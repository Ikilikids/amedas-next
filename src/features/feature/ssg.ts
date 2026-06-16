import { GetStaticProps } from "next";
import { RawData, RawRatioData } from "../../types/raw";
import {
  DescriptionData,
  FEATURE_CONFIGS,
  FeatureName,
  StationId,
} from "../../types/union";
import { getStation } from "../../utils/climateCache";
import { MetricKey, MetricValue } from "../../utils/metric";
import { assembleDisplayData } from "../../utils/rankingUtils";
import {
  ensureAllDataLoaded,
  loadMaster,
  readJson,
} from "../../utils/ssgLoader";

export interface FeaturePageProps {
  data: Record<StationId, RawData>;
  featureName: FeatureName;
}

export const getFeatureStaticProps =
  (featureName: FeatureName): GetStaticProps<FeaturePageProps> =>
  async () => {
    const dataDir = process.cwd();

    // キャッシュを埋める（マスターも内部でロードされる）
    ensureAllDataLoaded();
    const rawMasterAll = loadMaster();

    const descriptionData = readJson<Record<StationId, DescriptionData>>(
      "data",
      "feature",
      `${featureName}.json`
    );

    if (!descriptionData) {
      return { notFound: true };
    }

    const idList = Object.keys(descriptionData) as StationId[];
    const result: Record<StationId, RawData> = {};

    for (const id of idList) {
      const station = rawMasterAll[id];
      // キャッシュから地点ごとのデータを取得
      const integratedData = getStation(id);
      const { overview, table, ratio, uonzu } =
        assembleDisplayData(integratedData);

      // 特集ページ固有の ratio フィルタリング
      const config = FEATURE_CONFIGS[featureName];

      const allowedTabs = config.ratioTabs.map((info) => info.metricTab);

      const rankingMap = Object.fromEntries(
        config.ratioTabs.map((info) => [info.metricTab, info.ranking])
      );

      const filteredRatio: RawRatioData = {};

      Object.entries(ratio).forEach(([m, data]) => {
        const meta = MetricKey[m as MetricValue];

        if (meta && allowedTabs.includes(meta.tab)) {
          const ranking = rankingMap[meta.tab]; // "meteo" など

          filteredRatio[m] = data.map((d) => ({
            value: d.value,
            [ranking]: d[ranking],
          }));
        }
      });
      result[id] = {
        station,
        uonzu,
        ratio: filteredRatio,
        description: descriptionData[id],
      };
    }

    return {
      props: {
        data: result,
        featureName,
      },
    };
  };
