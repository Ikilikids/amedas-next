import fs from "fs";
import path from "path";
import { RawMonthlyData, RawStationData } from "../types/raw";
import { StationId } from "../types/union";
import {
  loadMaster,
} from "./climateDataManager";
import { MetricValue } from "../setting/metric";

export { loadMaster };

export interface ArticleUonzuItem {
  id: string;
  name: string;
  rawUonzu: RawMonthlyData;
}

/**
 * 地点名のリストから StationId を逆引きする (SSG用)
 */
export function resolveStationNames(names: string[]): StationId[] {
  const master = loadMaster();
  return names.flatMap((name) => {
    const entry = Object.entries(master).find(([_, s]) => s.station_name === name);
    return entry ? [entry[0] as StationId] : [];
  });
}



/**
 * ランキング画面（clim_ranking, daily_ranking, recent_ranking）共通の getStaticProps 生成ヘルパー
 */
export function getRankingStaticProps(defaultMetric: MetricValue = "av_avtemp") {
  return async ({ params }: { params?: any }) => {
    const metric = (params?.metric as MetricValue) || defaultMetric;
    const master = loadMaster();

    const masterData: Record<string, RawStationData> = Object.fromEntries(
      Object.entries(master).map(([id, s]) => [
        id,
        {
          id: s.id,
          pref: s.pref,
          station_name: s.station_name,
          category: s.category,
        },
      ])
    );

    return {
      props: {
        masterData,
        targetMetric: metric,
      },
    };
  };
}

