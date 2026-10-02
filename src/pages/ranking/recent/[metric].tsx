import { GetStaticPaths, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import RankingPageTemplate from "../../../components/Individual/Ranking/RankingPageTemplate";
import { RawStationData } from "../../../types/raw";
import { StationId } from "../../../types/union";
import { MetricKey, MetricValue } from "../../../setting/metric";
import { getRankingStaticProps } from "../../../utils/ssgLoader";
import { calculateRankingEntries } from "../../../utils/calculateRankingEntries";
interface Props {
  masterData: Record<string, RawStationData>;
  targetMetric: MetricValue;
}

const RecentRankingMetricPage: NextPage<Props> = ({ masterData, targetMetric }) => {
  const router = useRouter();

  const metric = (router.query.metric as MetricValue) || targetMetric;
  const config = useMemo(() => MetricKey[metric] || MetricKey[targetMetric], [metric, targetMetric]);

  const [liveData, setLiveData] = useState<{
    metrics: Record<string, Array<{ id: string; val: number; d?: string }>>;
    lastUpdate: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/live/recent-ranking")
      .then((res) => res.json())
      .then(setLiveData)
      .catch(console.error);
  }, []);

  const { calculatedEntries, timeMap } = useMemo(() => {
    if (!liveData || !liveData.metrics) return { calculatedEntries: null, timeMap: new Map() };

    const metricData = liveData.metrics[metric] || [];
    if (metricData.length === 0) return { calculatedEntries: null, timeMap: new Map() };

    const rawData: Record<StationId, number[]> = {};
    const tMap = new Map<string, string | null>();

    for (const item of metricData) {
      if (!item.id || item.val === null || item.val === undefined) continue;
      rawData[item.id as StationId] = [item.val];
      tMap.set(item.id, item.d || null);
    }

    const cacheKey = `recent_${metric}_${liveData.lastUpdate || "latest"}`;
    return {
      calculatedEntries: calculateRankingEntries(rawData, masterData, cacheKey),
      timeMap: tMap,
    };
  }, [liveData, metric, masterData]);

  const displayLastUpdate = useMemo(() => {
    if (!liveData) return "読み込み中...";
    return new Date(liveData.lastUpdate).toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
    });
  }, [liveData]);

  return (
    <RankingPageTemplate
      category="recent"
      pageTitle={`2026年の${config.label}ランキング - アメダス年間速報`}
      heroTitle={`2026年の${config.label}ランキング`}
      pageDescription={`2026年にアメダスで観測された${config.label}の全国・地域・都道府県別ランキングです。最新の年間極値記録・統計を一覧表示します。`}
      canonicalUrl={`https://amedas-zukan.jp/ranking/recent/${metric}`}
      breadcrumbLabel="2026年速報ランキング"
      badgeText="Recent Records"
      watermark="RECENT"
      lastUpdateValue={displayLastUpdate}
      lastUpdateLabel="観測日時"
      config={config}
      calculatedEntries={calculatedEntries}
      masterData={masterData}
      timeMap={timeMap}
      subTextPrefix="観測日時: "
    />
  );
};

const RECENT_METRICS: MetricValue[] = (Object.values(MetricKey) as Array<(typeof MetricKey)[MetricValue]>)
  .filter((m) => m.detail.group !== undefined)
  .map((m) => m.key);

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: RECENT_METRICS.map((metric) => ({ params: { metric } })),
    fallback: false,
  };
};

export const getStaticProps = getRankingStaticProps("max_hitemp");

export default RecentRankingMetricPage;
