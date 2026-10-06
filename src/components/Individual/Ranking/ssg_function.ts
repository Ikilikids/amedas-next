import { RawStationData } from "../../../types/raw";
import { StationId } from "../../../types/union";
import {
  loadMaster,
} from "../../../utils/loading/0_stationData";
import { MetricValue } from "../../../setting/metric";

export { loadMaster };





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

