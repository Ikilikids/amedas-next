export const METRIC_COLORS = [
  "text-indigo-500",
  "text-sky-500",
  "text-teal-500",
  "text-green-500",
  "text-lime-500",
  "text-yellow-500",
  "text-orange-500",
  "text-red-500",
  "text-pink-500",
  "text-purple-500",
];

/**
 * Calculates a color based on the value's relative position between min and max.
 * @param value The value to color
 * @param min Minimum value in the dataset
 * @param max Maximum value in the dataset
 * @param useSlateForZero If true, a value of 0 will be colored slate (neutral).
 *                        Typically true for counts (days, mm, h) and false for continuous scales (℃).
 */
export function getMetricColor(
  value: number | null | undefined,
  min: number,
  max: number,
  useSlateForZero: boolean = true
) {
  if (value == null) return "text-slate-400";

  // If 0 should be neutral (e.g., 0mm rain, 0 days of extreme heat)
  if (useSlateForZero && value === 0) return "text-slate-500";

  if (max <= min) return METRIC_COLORS[Math.floor(METRIC_COLORS.length / 2)];

  // Clamp ratio between 0 and 0.999...
  const ratio = Math.max(0, Math.min(0.999, (value - min) / (max - min)));
  const index = Math.floor(ratio * METRIC_COLORS.length);
  return METRIC_COLORS[index];
}
