import { RawSimilarStationData, RawStationData } from "../types/raw";
import { OriginSimilarItem } from "../types/union";

export const buildSimilar = (
  rawSimilarAll: OriginSimilarItem[] | null,
  rawSimilarMeteo: OriginSimilarItem[] | null,
  masterAll: Record<string, RawStationData>
): {
  rawSimilarAll: RawSimilarStationData[];
  rawSimilarMeteo: RawSimilarStationData[];
} => {
  const resolve = (items: OriginSimilarItem[] | null): RawSimilarStationData[] => {
    if (!items) return [];

    return items.map((item) => {
      const m = masterAll[item.id];

      return {
        ...m,
        similar: item.similar,
      };
    });
  };

  return {
    rawSimilarAll: resolve(rawSimilarAll),
    rawSimilarMeteo: resolve(rawSimilarMeteo),
  };
};
