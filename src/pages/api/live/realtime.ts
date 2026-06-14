import { NextApiRequest, NextApiResponse } from "next";
import { fetchJmaRealtime } from "../../../utils/jma";

/**
 * リアルタイムの全国観測データを返すAPI
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await fetchJmaRealtime();

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=600, stale-while-revalidate=30"
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("[API Error] Realtime Fetch Failed:", error);
    res.status(500).json({ error: "Failed to fetch JMA realtime data" });
  }
}
