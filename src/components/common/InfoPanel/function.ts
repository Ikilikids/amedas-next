export function showValue(
  v: number | null | undefined,
  isRank: boolean = false
): string {
  if (v === null || v === undefined) return "--";
  if (isRank) return String(v);
  return v.toFixed(1);
}
