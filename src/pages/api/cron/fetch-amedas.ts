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

    // 気象庁から昨日の最高気温ランキング（全国）を取得
    const rankings = await fetchJmaDailyMaxRanking(mmdd);

    console.log(`Processing ${rankings.length} stations for date: ${dateStr}`);
    const batchSize = 100;
    for (let i = 0; i < rankings.length; i += batchSize) {
      const chunk = rankings.slice(i, i + batchSize);
      const batch = db.batch();

      // まとめてドキュメントを取得
      const refs = chunk.map((item) => db.collection("stations").doc(item.id));
      const snapshots = await db.getAll(...refs);

      chunk.forEach((item, index) => {
        const doc = snapshots[index];
        let data = doc.exists
          ? (doc.data() as any)
          : {
              history: [],
              stats: { extremeHotDays: 0, maxTempYear: -99 },
            };

        // 年が変わったらリセットするロジック (1月1日)
        if (today.getMonth() === 0 && today.getDate() === 1) {
          data.stats.extremeHotDays = 0;
          data.stats.maxTempYear = -99;
        }

        // 猛暑日判定
        if (item.value >= 35.0) {
          data.stats.extremeHotDays = (data.stats.extremeHotDays || 0) + 1;
        }

        // 今年の最高気温更新
        if (item.value > (data.stats.maxTempYear || -99)) {
          data.stats.maxTempYear = item.value;
        }

        // 履歴の更新（最新15日分を保持）
        const newEntry = { date: dateStr, temp: item.value };
        const existingIndex = data.history.findIndex(
          (h: any) => h.date === dateStr
        );
        if (existingIndex > -1) {
          data.history[existingIndex] = newEntry;
        } else {
          data.history.push(newEntry);
        }

        data.history.sort((a: any, b: any) => b.date.localeCompare(a.date));
        data.history = data.history.slice(0, 15);

        data.lastUpdate = new Date().toISOString();
        data.stationId = item.id;

        batch.set(refs[index], data, { merge: true });
      });

      await batch.commit();
      console.log(
        `Processed ${Math.min(i + batchSize, rankings.length)} stations...`
      );
    }

    return res.status(200).json({ success: true, count: rankings.length });
  } catch (error: any) {
    console.error("CRON Error:", error);
    // 本番環境では詳細なエラーをブラウザに返さない方が安全ですが、
    // 現在は調査のため、エラーメッセージのみ返すようにします。
    return res.status(500).json({ error: error?.message || String(error) });
  }
}
