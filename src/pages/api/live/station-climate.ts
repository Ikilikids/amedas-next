import { NextApiRequest, NextApiResponse } from "next";
import { getStation } from "../../../utils/climateCache";
import { assembleDisplayData } from "../../../utils/rankingUtils";
import { ensureAllDataLoaded } from "../../../utils/ssgLoader";

/**
 * 特定地点の平年値データ（雨温図、割合、詳細テーブル）を返すAPI
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing id parameter" });
  }

  try {
    // 全平年値データをロードしてキャッシュに格納
    await ensureAllDataLoaded();

    const integratedData = getStation(id);
    if (!integratedData) {
      return res.status(404).json({ error: "Station climate data not found" });
    }

    const displayData = assembleDisplayData(integratedData as any);

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=3600"
    );

    res.status(200).json(displayData);
  } catch (error) {
    console.error("[API Error] Station Climate Fetch Failed:", error);
    res.status(500).json({ error: "Failed to fetch station climate data" });
  }
}
