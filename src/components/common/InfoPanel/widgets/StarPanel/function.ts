import { MetricMeta } from "../../../../../setting/metric";
import { MetricDistribution } from "../../../../../setting/metricDistributions";

export function evaluateStar(
  value: number | null | undefined,
  starMeta?: MetricMeta["star"]
): { starCount: number; maxStars: number; label: string } {
  if (!starMeta) {
    return { starCount: 0, maxStars: 10, label: "--" };
  }

  const { baseLabel, levels } = starMeta;
  const maxStars = levels.length + 1;

  if (value == null || isNaN(value)) {
    return { starCount: 0, maxStars, label: "--" };
  }

  if (levels.length === 0 || value < levels[0].threshold) {
    return { starCount: 1, maxStars, label: baseLabel };
  }

  for (let i = levels.length - 1; i >= 0; i--) {
    if (value >= levels[i].threshold) {
      return {
        starCount: i + 2,
        maxStars,
        label: levels[i].label,
      };
    }
  }

  return { starCount: 1, maxStars, label: baseLabel };
}

export function computePositionPct(
  value: number | null | undefined,
  dist?: MetricDistribution
): number {
  if (!dist || dist.bins.length === 0) return 50;
  if (value == null || isNaN(value)) return 50;
  const range = dist.max - dist.min;
  if (range <= 0) return 50;
  return Math.max(0, Math.min(100, ((value - dist.min) / range) * 100));
}
