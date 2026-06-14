// features/station/ssg.ts

import { GetStaticPaths, GetStaticProps } from "next";
import { RawBadgeData, RawData, RawStationData } from "../../types/raw";
import { OriginSimilarItem, StationId } from "../../types/union";
import { BadgeLogic } from "../../utils/badgeLogic";
import { getStation } from "../../utils/climateCache";
import { db } from "../../utils/firebaseAdmin";
import { assembleDisplayData } from "../../utils/rankingUtils";
import { buildSimilar } from "./transformSimilar";

import {
  ensureAllDataLoaded,
  loadMaster,
  readJson,
} from "../../utils/ssgLoader";

export const getStaticPaths: GetStaticPaths = async () => {
  const master = loadMaster();
  const paths = Object.keys(master).map((id) => ({
    params: { id },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<RawData> = async ({ params }) => {
  const id = params?.id as StationId;

  // 全データをキャッシュに埋める (静的な統計計算のため)
  ensureAllDataLoaded();

  const master = loadMaster();
  const rawStationData = master[id];

  if (!rawStationData) return { notFound: true };

  // --- キャッシュからこの地点の統計データを取得 (SSG) ---
  const integratedData = getStation(id);
  const { overview, table, ratio, uonzu } = assembleDisplayData(
    integratedData as any
  );

  // --- 類似地点等の静的データ生成 ---
  const similarFile = readJson<any>("data", "similar", `${id}.json`);
  const rawSimilarAllItem: OriginSimilarItem[] = similarFile?.similar_all || [];
  const rawSimilarMeteoItem: OriginSimilarItem[] =
    similarFile?.similar_meteo || [];

  const result = buildSimilar(rawSimilarAllItem, rawSimilarMeteoItem, master);

  const rawSameStations: RawStationData[] = [];
  const rawMeteoStations: RawStationData[] = [];

  Object.entries(master).forEach(([sid, s]) => {
    const item: RawStationData = {
      id: s.id,
      pref: s.pref,
      category: s.category,
      station_name: s.station_name,
    };

    if (s.pref === rawStationData.pref) rawSameStations.push(item);
    if (s.category === "meteo") rawMeteoStations.push(item);
  });

  const badgeinfo: RawBadgeData[] = BadgeLogic.getBadges(
    overview as any,
    ratio as any
  );

  return {
    props: {
      station: rawStationData,
      overview,
      uonzu,
      table,
      ratio,
      similarAll: result.rawSimilarAll,
      similarMeteo: result.rawSimilarMeteo,
      sameStations: rawSameStations,
      meteoStations: rawMeteoStations,
      badge: badgeinfo,
      // history, stats, lastUpdate はクライアントサイドでフェッチされる
      history: [],
      stats: null,
      lastUpdate: new Date().toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo",
      }),
    },
  };
};
