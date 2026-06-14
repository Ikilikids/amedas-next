import { NextApiRequest, NextApiResponse } from "next";
import { fetchJmaDailyMaxRanking } from "../../../utils/jma";

/**
 * 今日のランキングデータを返すAPI
 * 10分間のCDNキャッシュを設定し、複数コンテナ間での不整合を防止する
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // 1. 気象庁から最新のランキングデータを取得 (null = 今日)
    const result = await fetchJmaDailyMaxRanking(null);

    // 2. キャッシュヘッダーの設定
    // s-maxage=600 (10分): CDNに10分間キャッシュさせる (全インスタンス共有)
    // stale-while-revalidate=30: キャッシュが切れた後30秒間は古いデータを返しつつ裏で更新
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=600, stale-while-revalidate=30"
    );

    // 3. データの返却
    res.status(200).json({
      ...result,
      lastUpdate: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[API Error] Daily Ranking Fetch Failed:", error);
    res.status(500).json({ error: "Failed to fetch JMA data" });
  }
}
