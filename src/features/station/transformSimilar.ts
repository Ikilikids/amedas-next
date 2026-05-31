// features/station/transformSimilar.ts
import { RawStationData } from "../../types/raw";
import { OriginSimilarItem } from "../../types/union";

export const buildSimilar = (
  rawSimilarAll: OriginSimilarItem[] | null,
  rawSimilarMeteo: OriginSimilarItem[] | null,
  masterAll: Record<string, RawStationData>
): {
  rawSimilarAll: RawStationData[];
  rawSimilarMeteo: RawStationData[];
} => {
  const resolve = (items: OriginSimilarItem[] | null): RawStationData[] => {
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
