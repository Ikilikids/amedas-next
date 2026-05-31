import fs from "fs";
import { GetStaticProps } from "next";
import path from "path";
import {
  RawData,
  RawRatioData,
  RawStationData,
  RawUonzuData,
} from "../../types/raw";
import { DescriptionData, FEATURE_CONFIGS, FeatureName } from "../../types/union";
import { MetricKey, MetricValue } from "../../utils/metric";

const readFile = <T>(p: string): T | null => {
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf-8")) : null;
};

export interface FeaturePageProps {
  data: Record<string, RawData>;
  featureName: FeatureName;
}

export const getFeatureStaticProps =
  (featureName: FeatureName): GetStaticProps<FeaturePageProps> =>
  async () => {
    const dataDir = process.cwd();

    const rawMasterAll: Record<string, RawStationData> = JSON.parse(
      fs.readFileSync(path.join(dataDir, "public/stations.json"), "utf-8")
    );

    const descriptionData = readFile<Record<string, DescriptionData>>(
      path.join(dataDir, `data/feature/${featureName}.json`)
    );

    if (!descriptionData) {
      return { notFound: true };
    }

    const idList = Object.keys(descriptionData);

    const result: Record<string, RawData> = {};

    for (const id of idList) {
      const station = rawMasterAll[id];

      const uonzu = readFile<RawUonzuData>(
        path.join(dataDir, "data/uonzu", `${id}.json`)
      );

      const rawRatio = readFile<RawRatioData>(
        path.join(dataDir, "data/ratio", `${id}.json`)
      );

      const description = descriptionData[id];
      const allowedTabs = FEATURE_CONFIGS[featureName].ratioTabs.map(
        (info) => info.metricTab
      );

      const ratio = rawRatio
        ? (Object.fromEntries(
            Object.entries(rawRatio)
              .filter(([k]) => {
                const meta = MetricKey[k as MetricValue];
                return meta && allowedTabs.includes(meta.tab);
              })
              .map(([k, v]) => [
                k,
                Array.isArray(v) && v.length >= 13 ? [v[12]] : v,
              ])
          ) as RawRatioData)
        : null;

      result[id] = {
        station,
        uonzu,
        ratio,
        description,
      };
    }

    return {
      props: {
        data: result,
        featureName,
      },
    };
  };
