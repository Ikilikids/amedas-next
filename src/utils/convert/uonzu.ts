import { RawData } from "../../types/raw";
import { MetricKey, MetricMeta, MetricValue } from "../../setting/metric";

export interface UonzuOption {
  value: string;
  label: string;
  color: string;
  meta: MetricMeta;
}

/**
 * 1地点の RawData から、雨温図で描画可能な棒グラフ候補（降水量・降雪量・日照時間）の選択肢を抽出する
 */
export function getUonzuOptions(rawData: RawData): UonzuOption[] {
  const cd = rawData.climateData;
  if (!cd) return [];

  const targets = [MetricKey.sm_rain, MetricKey.sm_snowing, MetricKey.sm_sun];

  return targets
    .filter((meta) => !!cd[meta.key])
    .map((meta) => ({
      value: meta.key,
      label: meta.label,
      color: meta.color,
      meta,
    }));
}
