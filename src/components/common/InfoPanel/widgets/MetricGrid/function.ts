import { MetricMeta } from "../../../../../setting/metric";
import { RawMonthlyData } from "../../../../../types/raw";
import { calculateStar } from "../../../../../utils/starUtils";
import { DISPLAY_METRICS } from "../../function";

export interface MetricCardData {
  meta: MetricMeta;
  val: number | null | undefined;
  hasVal: boolean;
  starResult: { star: number; label: string } | null;
  myStar: number | null;
  maxStars: number;
  starLabel: string;
  rank?: number;
}

export function computeMetricGridItems(
  climateData: RawMonthlyData | null
): MetricCardData[] {
  return DISPLAY_METRICS.map((m) => {
    const entries = climateData?.[m.key];
    const annual = entries && entries.length > 12 ? entries[12] : entries?.[0];
    const val = annual?.value;
    const hasVal = val != null && !isNaN(val);
    const starResult = hasVal && m.star ? calculateStar(val, m.star) : null;
    const myStar = starResult?.star ?? null;
    const maxStars = m.star?.levels.length ? m.star.levels.length + 1 : 10;
    const starLabel = starResult ? starResult.label : "データなし";
    const rank = annual?.top;

    return {
      meta: m,
      val,
      hasVal,
      starResult,
      myStar,
      maxStars,
      starLabel,
      rank,
    };
  });
}
