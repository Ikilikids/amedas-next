import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../utils/firebaseAdmin";
import { fetchJmaDailyMaxRanking } from "../../../utils/jma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1. セキュリティチェック（タイマーからのリクエストか確認）
  const { secret } = req.query;
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // 診断情報をサーバーログに出力（ブラウザには返さない）
  console.log("Environment Check:", {
    hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
    hasEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
    hasKey: !!process.env.FIREBASE_PRIVATE_KEY,
    keyLength: process.env.FIREBASE_PRIVATE_KEY?.length,
    cronSecretLoaded: !!process.env.CRON_SECRET,
  });

  try {
    console.log("Fetching JMA data...");
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    // 日本時間(JST)でYYYY-MM-DD形式を取得
    const dateStr = yesterday.toLocaleDateString("sv-SE", {
      timeZone: "Asia/Tokyo",
    });
    const mmdd = dateStr.split("-").slice(1).join("");

    // 気象庁から昨日の最高・最低気温・降水量ランキング（全国）を取得
    const { av_hitemp, av_lwtemp, sm_rain } = await fetchJmaDailyMaxRanking(
      mmdd
    );

    /*const av_hitemp: RankingItem[] = [
      { id: "1", value: 35.0 },
      { id: "10", value: 32.0 },
    ];
    const av_lwtemp: RankingItem[] = [
      { id: "1", value: 5.0 },
      { id: "10", value: -2.0 },
    ];
    const sm_rain: RankingItem[] = [{ id: "1", value: 10.0 }];*/

    // 全地点のデータをIDごとにマッピングして統合
    const stationMap: Record<
      string,
      { hi?: number; lw?: number; rain?: number }
    > = {};

    av_hitemp.forEach((s) => {
      if (s.id) stationMap[s.id] = { ...stationMap[s.id], hi: s.value };
    });
    av_lwtemp.forEach((s) => {
      if (s.id) stationMap[s.id] = { ...stationMap[s.id], lw: s.value };
    });
    sm_rain.forEach((s) => {
      if (s.id) stationMap[s.id] = { ...stationMap[s.id], rain: s.value };
    });

    const stationIds = Object.keys(stationMap);
    console.log(
      `Processing ${stationIds.length} stations for date: ${dateStr}`
    );

    const batchSize = 100;
    for (let i = 0; i < stationIds.length; i += batchSize) {
      const chunkIds = stationIds.slice(i, i + batchSize);
      const batch = db.batch();

      // まとめてドキュメントを取得
      const refs = chunkIds.map((id) => db.collection("stations").doc(id));
      const snapshots = await db.getAll(...refs);

      chunkIds.forEach((id, index) => {
        const doc = snapshots[index];
        const update = stationMap[id];

        let data = doc.exists
          ? (doc.data() as any)
          : { history: [], stats: {} };
        if (!data.stats) data.stats = {};
        const s = data.stats;

        // 1. 最高気温の統計更新
        if (update.hi !== undefined) {
          if (s.max_hitemp === undefined) {
            s.hitemp_40 = 0;
            s.hitemp_35 = 0;
            s.hitemp_30 = 0;
            s.hitemp_25 = 0;
            s.hitemp_0 = 0;
            s.max_hitemp = -99;
          }
          if (update.hi >= 40.0) s.hitemp_40 = (s.hitemp_40 || 0) + 1;
          if (update.hi >= 35.0) s.hitemp_35 = (s.hitemp_35 || 0) + 1;
          if (update.hi >= 30.0) s.hitemp_30 = (s.hitemp_30 || 0) + 1;
          if (update.hi >= 25.0) s.hitemp_25 = (s.hitemp_25 || 0) + 1;
          if (update.hi <= 0.0) s.hitemp_0 = (s.hitemp_0 || 0) + 1;

          if (update.hi > s.max_hitemp) {
            s.max_hitemp = update.hi;
            s.max_hitemp_date = dateStr;
          }
        }

        // 2. 最低気温の統計更新
        if (update.lw !== undefined) {
          if (s.min_lwtemp === undefined) {
            s.lwtemp_25 = 0;
            s.lwtemp_0 = 0;
            s.min_lwtemp = 99;
          }
          if (update.lw >= 25.0) s.lwtemp_25 = (s.lwtemp_25 || 0) + 1;
          if (update.lw <= 0.0) s.lwtemp_0 = (s.lwtemp_0 || 0) + 1;

          if (update.lw < s.min_lwtemp) {
            s.min_lwtemp = update.lw;
            s.min_lwtemp_date = dateStr;
          }
        }

        // 3. 降水量の統計更新 (合計)
        if (update.rain !== undefined) {
          s.sm_rain = (s.sm_rain || 0) + update.rain;
        }

        // 履歴の更新
        const newEntry = {
          date: dateStr,
          hi: update.hi ?? null,
          lw: update.lw ?? null,
          rain: update.rain ?? null,
        };
        const existingIndex = data.history.findIndex(
          (h: any) => h.date === dateStr
        );
        if (existingIndex > -1) {
          data.history[existingIndex] = {
            ...data.history[existingIndex],
            ...newEntry,
          };
        } else {
          data.history.push(newEntry);
        }

        data.history.sort((a: any, b: any) => b.date.localeCompare(a.date));
        data.history = data.history.slice(0, 15);

        // 降水量移動合計の更新
        const rain7 = data.history
          .slice(0, 7)
          .reduce((sum: number, h: any) => sum + (h.rain || 0), 0);
        const rain15 = data.history.reduce(
          (sum: number, h: any) => sum + (h.rain || 0), 0
        );
        s.rain_7d = Math.round(rain7 * 10) / 10;
        s.rain_15d = Math.round(rain15 * 10) / 10;

        data.lastUpdate = new Date().toISOString();
        data.stationId = id;

        batch.set(refs[index], data, { merge: true });
      });

      await batch.commit();
      console.log(
        `Processed chunk ${i / batchSize + 1} (${Math.min(
          i + batchSize,
          stationIds.length
        )} stations)...`
      );
    }

    // --- 4. 全地点の統計データ集計と保存 ---
    console.log("Generating separate documents for each metric ranking...");

    // 対象とする全項目の定義
    const rankingMetrics = [
      { key: "max_hitemp", hasDate: true },
      { key: "min_lwtemp", hasDate: true },
      { key: "hitemp_40", hasDate: false },
      { key: "hitemp_35", hasDate: false },
      { key: "hitemp_30", hasDate: false },
      { key: "hitemp_25", hasDate: false },
      { key: "hitemp_0", hasDate: false },
      { key: "lwtemp_25", hasDate: false },
      { key: "lwtemp_0", hasDate: false },
      { key: "rain_7d", hasDate: false },
      { key: "rain_15d", hasDate: false },
      { key: "sm_rain", hasDate: false },
    ];

    const allStationsSnapshot = await db
      .collection("stations")
      .select("stats")
      .get();

    const allStatsData: Array<{ id: string; stats: any }> = [];
    allStationsSnapshot.forEach((doc) => {
      allStatsData.push({ id: doc.id, stats: doc.data().stats || {} });
    });

    const updatedAt = new Date().toISOString();

    for (const metric of rankingMetrics) {
      const list = allStatsData
        .filter((s) => s.stats[metric.key] !== undefined && s.stats[metric.key] !== null)
        .map((s) => ({
          id: s.id,
          val: s.stats[metric.key],
          ...(metric.hasDate && s.stats[metric.key + "_date"]
            ? { d: s.stats[metric.key + "_date"] }
            : {}),
        }));

      if (list.length > 0) {
        await db.collection("rankings").doc(metric.key).set({
          updatedAt,
          list,
        });
        console.log(`Saved stats list: ${metric.key} (${list.length} stations)`);
      }
    }

    return res.status(200).json({ success: true, count: stationIds.length });
  } catch (error: any) {
    console.error("CRON Error:", error);
    return res.status(500).json({ error: error?.message || String(error) });
  }
}
