import fs from "fs";
import path from "path";
import { RawMonthlyData, RawStationData } from "../types/raw";
import { StationId } from "../types/union";
import {
  loadMaster,
} from "./climateDataManager";
import { METRIC_LIST, MetricKey, MetricValue } from "../setting/metric";
import { isIslandId } from "../setting/rank";
import { resolvePref } from "./masterUtils";
import { BadgeLogic } from "./badgeLogic";

export { loadMaster };

export interface ArticleUonzuItem {
  id: string;
  name: string;
  rawUonzu: RawMonthlyData;
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
    isIsland?: boolean;
    rank: "rainbow";
    place: number;
    value: number;
  }[];
}

export function extractRainbowStations(
  stationsMap: Record<StationId, { station: RawStationData; climateData?: RawMonthlyData }>,
  prefCodes: readonly string[]
): RegionRainbowStationItem[] {
  const prefCodeSet = new Set(prefCodes);
  const results: RegionRainbowStationItem[] = [];

  Object.values(stationsMap).forEach((st) => {
    if (!st.station.pref || !prefCodeSet.has(st.station.pref)) return;
    if (!st.climateData) return;

    const isIsland = isIslandId(st.station.id);
    const badges = BadgeLogic.getBadges(st.climateData, isIsland);
    const rainbowBadges: RegionRainbowStationItem["badges"] = badges
      .filter((b) => b.rank === "rainbow")
      .map((b) => ({
        metric: b.metric,
        isHigh: b.isHigh,
        isIsland: b.isIsland,
        rank: "rainbow" as const,
        place: b.place ?? 1,
        value: b.value ?? 0,
      }));

    if (rainbowBadges.length > 0) {
      results.push({
        id: st.station.id,
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
  stationsMap: Record<StationId, { station: RawStationData; climateData?: RawMonthlyData }>,
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

/**
 * ランキング画面（clim_ranking, daily_ranking, recent_ranking）共通の getStaticProps 生成ヘルパー
 */
export function getRankingStaticProps(defaultMetric: MetricValue = "av_avtemp") {
  return async ({ params }: { params?: any }) => {
    const metric = (params?.metric as MetricValue) || defaultMetric;
    const master = loadMaster();

    const masterData: Record<string, RawStationData> = Object.fromEntries(
      Object.entries(master).map(([id, s]) => [
        id,
        {
          id: s.id,
          pref: s.pref,
          station_name: s.station_name,
          category: s.category,
        },
      ])
    );

    return {
      props: {
        masterData,
        targetMetric: metric,
      },
    };
  };
}

