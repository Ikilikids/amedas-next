import { RawData, RawStationData } from "../../../../../../types/raw";
import { StationId } from "../../../../../../types/union";
import { METRIC_LIST, MetricKey, MetricValue } from "../../../../../../setting/metric";
import { resolvePref } from "../../../../../../utils/masterUtils";

export interface RegionTop1Item {
  metric: string;
  isHigh: boolean;
  label: string;
  station: RawStationData;
  value: number;
  nationalRank: number;
}

/**
 * stationsMap から各主要気象項目のNo.1（極値）観測所を抽出する純粋関数
 */
export function extractTop1Stations(
  stationsMap: Record<StationId, RawData>
): RegionTop1Item[] {
  const regionStations = Object.values(stationsMap);

  const TOP1_CONFIGS = METRIC_LIST.flatMap((m) => {
    const meta = MetricKey[m];
    const items: { metric: MetricValue; isHigh: boolean; label: string }[] = [];
    if (meta.high) items.push({ metric: m, isHigh: true, label: meta.high.label });
    if (meta.low) items.push({ metric: m, isHigh: false, label: meta.low.label });
    return items;
  });

  const results: RegionTop1Item[] = [];

  TOP1_CONFIGS.forEach((cfg) => {
    const candidates = regionStations
      .map((st) => {
        const entries = st.climateData?.[cfg.metric];
        if (!entries || entries.length === 0) return null;
        const annualEntry = entries.length > 12 ? entries[12] : entries[0];
        if (!annualEntry || annualEntry.value == null) return null;
        return {
          station: st.station,
          id: st.station.id,
          val: annualEntry.value,
          nationalRank: annualEntry.top ?? 1,
        };
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);

    if (candidates.length === 0) return;

    candidates.sort((a, b) => (cfg.isHigh ? b.val - a.val : a.val - b.val));
    const top = candidates[0];

    results.push({
      metric: cfg.metric,
      isHigh: cfg.isHigh,
      label: cfg.label,
      station: top.station,
      value: top.val,
      nationalRank: top.nationalRank,
    });
  });

  return results;
}
