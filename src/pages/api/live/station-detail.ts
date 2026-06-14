import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../utils/firebaseAdmin";

/**
 * 地点ごとの履歴と統計データを返すAPI
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
    const doc = await db.collection("stations").doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: "Station not found" });
    }

    const data = doc.data();
    
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=600, stale-while-revalidate=30"
    );

    res.status(200).json({
      history: data?.history || [],
      stats: data?.stats || null,
      lastUpdate: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[API Error] Station Detail Fetch Failed:", error);
    res.status(500).json({ error: "Failed to fetch station data" });
  }
}
