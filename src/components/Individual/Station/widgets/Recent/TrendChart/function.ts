import { RawMonthlyData } from "../../../../../../types/raw";
import { MetricKey } from "../../../../../../setting/metric";

export interface HistoryEntry {
  date: string;
  hi: number | null;
  lw: number | null;
  rain: number | null;
}

export function formatTrendChartData(history: HistoryEntry[]) {
  const sortedData = [...history].sort((a, b) => a.date.localeCompare(b.date));
  const labels = sortedData.map((item) =>
    item.date.split("-").slice(1).join("/")
  );

  const uonzuMap: RawMonthlyData = {};
  const hiValues = sortedData.map((d) => (d.hi != null ? { value: d.hi } : null));
  const lwValues = sortedData.map((d) => (d.lw != null ? { value: d.lw } : null));
  const rainValues = sortedData.map((d) => (d.rain != null ? { value: d.rain } : null));

  if (hiValues.some((v) => v !== null)) {
    uonzuMap[MetricKey.av_hitemp.key] = hiValues as any;
  }
  if (lwValues.some((v) => v !== null)) {
    uonzuMap[MetricKey.av_lwtemp.key] = lwValues as any;
  }
  if (rainValues.some((v) => v !== null)) {
    uonzuMap[MetricKey.sm_rain.key] = rainValues as any;
  }

  return { labels, uonzuMap };
}
