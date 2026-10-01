import { GetStaticPaths, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { IoIosTrophy } from "react-icons/io";
import RankingPageTemplate from "../../../components/Ranking/RankingPageTemplate";
import ClimateSelector from "../../../components/Ranking/selectors/ClimateSelector";
import { RawStationData } from "../../../types/raw";
import { MonthlyEntry, StationId } from "../../../types/union";
import { MetricKey, MetricValue } from "../../../setting/metric";
import { getRankingStaticProps } from "../../../utils/ssgLoader";
import { loadJsonSingleMetric } from "../../../utils/loadSingleMetric";
import { calculateRankingEntries } from "../../../utils/calculateRankingEntries";

interface Props {
  masterData: Record<string, RawStationData>;
  targetMetric: MetricValue;
}

const ClimateRankingMetricPage: NextPage<Props> = ({ masterData, targetMetric }) => {
  const router = useRouter();

  const metricKey = ((router.query.metric as MetricValue) || targetMetric).toLowerCase() as MetricValue;
  const config = useMemo(() => MetricKey[metricKey] || MetricKey[targetMetric], [metricKey, targetMetric]);

  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [rankingRaw, setRankingRaw] = useState<Record<StationId, MonthlyEntry[]> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [prevMetricKey, setPrevMetricKey] = useState(metricKey);
  if (prevMetricKey !== metricKey) {
    setPrevMetricKey(metricKey);
    setIsLoading(true);
  }

  useEffect(() => {
    let isMounted = true;

    loadJsonSingleMetric(metricKey)
      .then((rawData) => {
        if (!rawData) {
          if (isMounted) setIsLoading(false);
          return;
        }
        const entries = calculateRankingEntries(rawData, masterData, `climate_${metricKey}`);
        if (isMounted) {
          setRankingRaw(entries);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [metricKey, masterData]);

  const monthIdx = useMemo(
    () => (selectedMonth === "all" ? 12 : parseInt(selectedMonth) - 1),
    [selectedMonth]
  );

  const monthText = selectedMonth === "all" ? "通年" : `${selectedMonth}月`;
  const labelText = config.tab?.includes("日数") ? `${config.label}（${config.tab}）` : config.label;

  return (
    <RankingPageTemplate
      pageTitle={`${monthText}の${labelText}ランキング - アメダス図鑑`}
      pageDescription={`全国約1,300地点のアメダス観測データに基づき、${monthText}の${labelText}平年値ランキングを表示。地域・都道府県別での絞り込み比較も可能です。`}
      canonicalUrl={`https://amedas-zukan.jp/ranking/climate/${metricKey}`}
      breadcrumbLabel="気候平年値ランキング"
      badgeText="Climatological Ranking"
      badgeIcon={<IoIosTrophy className="text-amber-200" />}
      watermark="CLIMATE"
      config={config}
      calculatedEntries={rankingRaw}
      masterData={masterData}
      monthIdx={monthIdx}
      isLoading={isLoading}
      selectorBar={
        <ClimateSelector
          currentMetric={metricKey}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
        />
      }
    />
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: Object.keys(MetricKey).map((metric) => ({ params: { metric } })),
    fallback: false,
  };
};

export const getStaticProps = getRankingStaticProps("av_avtemp");

export default ClimateRankingMetricPage;
