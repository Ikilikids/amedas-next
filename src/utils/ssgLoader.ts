import fs from "fs";
import path from "path";
import { RawBadgeData, RawStationData } from "../types/raw";
import { StationId } from "../types/union";
import {
  loadMaster,
} from "./climateDataManager";
import { METRIC_LIST, MetricKey, MetricValue } from "../setting/metric";
import { isIslandId } from "../setting/rank";
import { resolvePref } from "./masterUtils";

export { loadMaster };

export interface ArticleUonzuItem {
  id: string;
  name: string;
  rawUonzu: Record<string, number[]>;
}

/**
 * JSONファイルを安全に読み込む (ビルド時専用)
 */
export function readJson<T>(...paths: string[]): T | null {
  const p = path.join(process.cwd(), ...paths);
  if (!fs.existsSync(p)) return null;
  const content = fs.readFileSync(p, "utf-8");
  if (!content || content.trim() === "") return null;
  return JSON.parse(content);
}

/**
 * 地点名のリストから StationId を逆引きする (SSG用)
 */
export function resolveStationNames(names: string[]): StationId[] {
  const master = loadMaster();
  return names.flatMap((name) => {
    const entry = Object.entries(master).find(([_, s]) => s.station_name === name);
    return entry ? [entry[0] as StationId] : [];
  });
}

export interface RegionTop1Item {
  metric: string;
  isHigh: boolean;
  label: string;
  station: {
    id: string;
    stationName: string;
    prefName: string;
    city: string;
    category: string;
  };
  value: number;
  nationalRank: number;
}

export interface RegionRainbowStationItem {
  id: string;
  stationName: string;
  prefName: string;
  city: string;
  category: string;
  badges: {
    metric: string;
    isHigh: boolean;
    rank: "rainbow";
    place: number;
    value: number;
  }[];
}

export function extractRainbowStations(
  stationsMap: Record<StationId, { id: StationId; station: RawStationData; badge?: RawBadgeData[] }>,
  prefCodes: readonly string[]
): RegionRainbowStationItem[] {
  const prefCodeSet = new Set(prefCodes);
  const results: RegionRainbowStationItem[] = [];

  Object.values(stationsMap).forEach((st) => {
    if (!st.station.pref || !prefCodeSet.has(st.station.pref)) return;
    const rainbowBadges = (st.badge || [])
      .filter((b) => b.rank === "rainbow")
      .map((b) => ({
        metric: b.metric,
        isHigh: b.isHigh,
        rank: "rainbow" as const,
        place: b.place ?? 1,
        value: b.value ?? 0,
      }));

    if (rainbowBadges.length > 0) {
      results.push({
        id: st.id,
        stationName: st.station.station_name || "",
        prefName: resolvePref(st.station.pref)?.label || "",
        city: st.station.city || "",
        category: st.station.category || "amedas",
        badges: rainbowBadges,
      });
    }
  });

  return results.sort((a, b) => b.badges.length - a.badges.length || a.stationName.localeCompare(b.stationName, "ja"));
}

export function extractTop1Stations(
  stationsMap: Record<StationId, { id: StationId; station: RawStationData; overview?: Record<string, { value: number; rank: number }> }>,
  prefCodes: readonly string[]
): RegionTop1Item[] {
  const prefCodeSet = new Set(prefCodes);
  const regionStations = Object.values(stationsMap).filter(
    (st) => st.station.pref && prefCodeSet.has(st.station.pref)
  );

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
        const item = st.overview?.[cfg.metric];
        if (!item || item.value == null) return null;
        return {
          station: st.station,
          id: st.id,
          val: item.value,
          nationalRank: item.rank,
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
      station: {
        id: top.id,
        stationName: top.station.station_name || "",
        prefName: resolvePref(top.station.pref || "")?.label || "",
        city: top.station.city || "",
        category: top.station.category || "amedas",
      },
      value: top.val,
      nationalRank: top.nationalRank,
    });
  });

  return results;
}

