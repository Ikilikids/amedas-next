import React from "react";
import { GiIsland } from "react-icons/gi";
import { RawData } from "../../../../../../types/raw";
import { StationId } from "../../../../../../types/union";
import { METRIC_LIST, MetricKey, MetricValue } from "../../../../../../setting/metric";
import { resolvePref } from "../../../../../../utils/masterUtils";
import { isIslandId } from "../../../../../../setting/rank";

export interface RainbowBadgeItem {
  icon: React.ReactNode;
  title: string;
  isHigh: boolean;
  place: number;
  value?: number;
}

export interface RegionRainbowStationItem {
  id: string;
  stationName: string;
  prefName: string;
  city: string;
  category: string;
}

export interface RainbowGroupItem {
  metric: MetricValue;
  isHigh: boolean;
  list: {
    station: RegionRainbowStationItem;
    badge: RainbowBadgeItem;
  }[];
}

const TARGET_METRICS: MetricValue[] = [
  "av_avtemp",
  "hitemp_35",
  "sm_rain",
  "sm_sun",
  "sm_snowing",
  "av_wind",
];

/**
 * stationsMap から全国TOP10/BOTTOM10（虹バッジ相当）を持つ地点を抽出し、
 * 指標・方向ごとにグループ化して順位順にソートする純粋関数
 */
export function extractRainbowGroups(
  stationsMap: Record<StationId, RawData>
): RainbowGroupItem[] {
  const groupMap = new Map<
    string,
    {
      metric: MetricValue;
      isHigh: boolean;
      list: {
        station: RegionRainbowStationItem;
        badge: RainbowBadgeItem;
      }[];
    }
  >();

  Object.values(stationsMap).forEach((st) => {
    const { station, climateData } = st;
    if (!station || !climateData) return;

    const isIsland = isIslandId(station.id);
    const stationItem: RegionRainbowStationItem = {
      id: station.id,
      stationName: station.station_name || "",
      prefName: resolvePref(station.pref)?.label || "",
      city: station.city || "",
      category: station.category || "amedas",
    };

    TARGET_METRICS.forEach((key) => {
      const meta = MetricKey[key];
      if (!meta) return;

      const entries = climateData[key];
      const annual = entries && entries.length > 12 ? entries[12] : entries?.[0];
      if (!annual) return;

      let topRank = annual.top;
      const botRank = annual.bot;

      if (key === "av_avtemp" && annual.island != null && annual.island > 0) {
        topRank = topRank != null && topRank > 0 ? Math.min(topRank, annual.island) : annual.island;
      }

      // 上位10位（虹）判定
      if (meta.high && topRank != null && topRank > 0 && topRank <= 10) {
        const isIslandTemp = isIsland && key === "av_avtemp";
        const notIsIslandTemp = !isIsland && key === "av_avtemp";
        const icon = isIslandTemp ? React.createElement(GiIsland) : (meta.high.icon || meta.icon);
        const islandText = isIslandTemp ? "(全国)" : notIsIslandTemp ? "(本土)" : "";
        const title = `${meta.high.label}：上位10位${islandText}`;

        const gKey = `${key}_high`;
        if (!groupMap.has(gKey)) {
          groupMap.set(gKey, { metric: key, isHigh: true, list: [] });
        }
        groupMap.get(gKey)!.list.push({
          station: stationItem,
          badge: { icon, title, isHigh: true, place: topRank, value: annual.value },
        });
      }

      // 下位10位（虹）判定
      if (meta.low && botRank != null && botRank > 0 && botRank <= 10) {
        const icon = meta.low.icon || meta.icon;
        const title = `${meta.low.label}：下位10位`;

        const gKey = `${key}_low`;
        if (!groupMap.has(gKey)) {
          groupMap.set(gKey, { metric: key, isHigh: false, list: [] });
        }
        groupMap.get(gKey)!.list.push({
          station: stationItem,
          badge: { icon, title, isHigh: false, place: botRank, value: annual.value },
        });
      }
    });
  });

  // 各グループ内を順位順（place昇順）にソート
  const groups = Array.from(groupMap.values());
  groups.forEach((grp) => {
    grp.list.sort((a, b) => a.badge.place - b.badge.place);
  });

  // 指標の定義順（METRIC_LIST順、かつ high -> low の順）にグループをソート
  groups.sort((a, b) => {
    const idxA = METRIC_LIST.indexOf(a.metric);
    const idxB = METRIC_LIST.indexOf(b.metric);
    if (idxA !== idxB) return idxA - idxB;
    return a.isHigh === b.isHigh ? 0 : a.isHigh ? -1 : 1;
  });

  return groups;
}
