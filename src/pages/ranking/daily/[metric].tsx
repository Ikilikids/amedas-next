import { GetStaticPaths, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import RankingPageTemplate from "../../../components/Individual/Ranking/RankingPageTemplate";
import DailySelector, { DAILY_METRICS } from "../../../components/Individual/Ranking/selectors/DailySelector";
import { RankingItem } from "../../../components/Individual/Ranking/types";
import { RawStationData } from "../../../types/raw";
import { StationId } from "../../../types/union";
import { MetricKey, MetricValue } from "../../../setting/metric";
import { getRankingStaticProps } from "../../../utils/ssgLoader";
import { calculateRankingEntries } from "../../../utils/calculateRankingEntries";

interface Props {
  masterData: Record<string, RawStationData>;
  targetMetric: MetricValue;
}

const DailyRankingMetricPage: NextPage<Props> = ({ masterData, targetMetric }) => {
  const router = useRouter();

  const metric = (router.query.metric as MetricValue) || targetMetric;
  const config = useMemo(() => MetricKey[metric] || MetricKey[targetMetric], [metric, targetMetric]);

  const [jmaData, setJmaData] = useState<{
    av_hitemp: RankingItem[];
    av_lwtemp: RankingItem[];
    sm_rain: RankingItem[];
    lastUpdate?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/live/daily-ranking")
      .then((res) => res.json())
      .then(setJmaData)
      .catch(console.error);
  }, []);

  const { calculatedEntries, timeMap } = useMemo(() => {
    if (!jmaData) return { calculatedEntries: null, timeMap: new Map() };

    const jmaList = (jmaData as any)[metric] || [];
    if (jmaList.length === 0) return { calculatedEntries: null, timeMap: new Map() };

    const rawData: Record<StationId, number[]> = {};
    const tMap = new Map<string, string | null>();

    for (const item of jmaList) {
      if (!item.id || item.value === null || item.value === undefined) continue;
      rawData[item.id as StationId] = [item.value];
      tMap.set(item.id, item.time || null);
    }

    const cacheKey = `daily_${metric}_${jmaData.lastUpdate || "latest"}`;
    return {
      calculatedEntries: calculateRankingEntries(rawData, masterData, cacheKey),
      timeMap: tMap,
    };
  }, [jmaData, metric, masterData]);

  const displayLastUpdate = useMemo(() => {
    if (!jmaData || !jmaData.lastUpdate) return "読み込み中...";
    return new Date(jmaData.lastUpdate).toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
    });
  }, [jmaData]);

  return (
    <RankingPageTemplate
      pageTitle={`今日の本日の${config.label}ランキング - アメダス速報`}
      pageDescription={`本日これまでのアメダス${config.label}の全国・地域・都道府県別ランキングです。気象庁の最新観測データに基づき、最高記録地点を速報表示します。`}
      canonicalUrl={`https://amedas-zukan.jp/ranking/daily/${metric}`}
      breadcrumbLabel="今日のランキング"
      badgeText="Today's Ranking"
      watermark="TODAY"
      lastUpdateValue={displayLastUpdate}
      lastUpdateLabel="更新"
      config={config}
      calculatedEntries={calculatedEntries}
      masterData={masterData}
      timeMap={timeMap}
      subTextPrefix="観測時刻: "
      selectorBar={<DailySelector currentMetric={metric} />}
    />
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: DAILY_METRICS.map((metric) => ({ params: { metric } })),
    fallback: false,
  };
};

export const getStaticProps = getRankingStaticProps("av_hitemp");

export default DailyRankingMetricPage;
