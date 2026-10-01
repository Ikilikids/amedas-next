import { MetricStarMeta } from "../setting/metric";

/**
 * 単一地点の平年値から星数（1〜maxStars）とラベルを計算する純粋関数
 * @param val 計算対象の平年値数値（例: 15.3）
 * @param starMeta 指標ごとの閾値設定（m.star）
 */
export function calculateStar(
  val: number,
  starMeta?: MetricStarMeta
): { star: number; label: string } {
  if (!starMeta) return { star: 5, label: "--" };
  const { levels, baseLabel } = starMeta;

  if (levels.length === 0 || val < levels[0].threshold) {
    return { star: 1, label: baseLabel || "--" };
  }

  for (let i = levels.length - 1; i >= 0; i--) {
    if (val >= levels[i].threshold) {
      return { star: i + 2, label: levels[i].label };
    }
  }

  return { star: 1, label: baseLabel || "--" };
}
