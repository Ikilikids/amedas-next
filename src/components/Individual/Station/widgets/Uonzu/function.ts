import { MetricKey, MetricMeta } from "../../../../../setting/metric";
import { RawMonthlyData } from "../../../../../types/raw";

export interface UonzuOption {
  value: string;
  label: string;
  color: string;
  meta: MetricMeta;
}

export function getUonzuOptions(uonzuData: RawMonthlyData): UonzuOption[] {
  const targets = [MetricKey.sm_rain, MetricKey.sm_snowing, MetricKey.sm_sun];

  return targets
    .filter((meta) => !!uonzuData[meta.key])
    .map((meta) => ({
      value: meta.key,
      label: meta.label,
      color: meta.color,
      meta: meta,
    }));
}
