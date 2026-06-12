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

  // 全データをキャッシュに埋める
  ensureAllDataLoaded();

  const master = loadMaster();
  const rawStationData = master[id];

  if (!rawStationData) return { notFound: true };

  // --- Firestoreから履歴と統計を取得 ---
  let history = [];
  let stats = null;
  try {
    const doc = await db.collection("stations").doc(id).get();
    if (doc.exists) {
      const data = doc.data();
      history = data?.history || [];
      stats = data?.stats || null;
    }
  } catch (e) {
    // 静かにする
  }

  // --- キャッシュからこの地点のデータを取得 ---
  const integratedData = getStation(id);
  const { overview, table, ratio, uonzu } = assembleDisplayData(
    integratedData as any
  );

  // --- 既存のSimilar等はそのまま ---
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

  const lastUpdate = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });

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
      history,
      stats,
      lastUpdate,
      // デバッグ用: いつ、どのインスタンスで生成されたか
      _isr: {
        generatedAt: new Date().toISOString(),
        instance: process.env.HOSTNAME || "local",
        buildId: process.env.NEXT_PUBLIC_BUILD_ID || "static",
      },
    },
    revalidate: 3600, // 1時間ごとに再生成 (元に戻す)
  };
};
