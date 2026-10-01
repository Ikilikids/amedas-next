import { RawData } from "../../../../../../types/raw";
import { StationId } from "../../../../../../types/union";
import { METRIC_LIST, MetricKey, MetricValue } from "../../../../../../setting/metric";
import { isIslandId } from "../../../../../../setting/rank";
import { resolvePref } from "../../../../../../utils/masterUtils";
import { BadgeLogic } from "../../../../../../utils/badgeLogic";

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

export interface RainbowGroupItem {
  metric: MetricValue;
  isHigh: boolean;
  list: {
    station: RegionRainbowStationItem;
    badge: RegionRainbowStationItem["badges"][number];
  }[];
}

/**
 * stationsMap から虹バッジ（全国TOP10/BOTTOM10）を持つ地点を抽出し、
 * 指標・方向ごとにグループ化して順位順にソートする純粋関数
 */
export function extractRainbowGroups(
  stationsMap: Record<StationId, RawData>
): RainbowGroupItem[] {
  // 1. 各地点の虹バッジを抽出
  const rainbowStations: RegionRainbowStationItem[] = [];

  Object.values(stationsMap).forEach((st) => {
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
      rainbowStations.push({
        id: st.station.id,
        stationName: st.station.station_name || "",
        prefName: resolvePref(st.station.pref)?.label || "",
        city: st.station.city || "",
        category: st.station.category || "amedas",
        badges: rainbowBadges,
      });
    }
  });

  // 2. 指標×方向（高/低）ごとにグループ化して順位ソート
  return METRIC_LIST.flatMap((key) => {
    const meta = MetricKey[key];
    const dirs: { metric: MetricValue; isHigh: boolean }[] = [];
    if (meta.high) dirs.push({ metric: key, isHigh: true });
    if (meta.low) dirs.push({ metric: key, isHigh: false });
    return dirs;
  })
    .map((item) => {
      const stationsWithBadge: {
        station: RegionRainbowStationItem;
        badge: RegionRainbowStationItem["badges"][number];
      }[] = [];

      rainbowStations.forEach((s) => {
        s.badges.forEach((b) => {
          if (b.metric === item.metric && b.isHigh === item.isHigh) {
            stationsWithBadge.push({ station: s, badge: b });
          }
        });
      });

      // 順位順（上位1位〜）にソート
      stationsWithBadge.sort((a, b) => a.badge.place - b.badge.place);

      return {
        ...item,
        list: stationsWithBadge,
      };
    })
    .filter((g) => g.list.length > 0);
}
