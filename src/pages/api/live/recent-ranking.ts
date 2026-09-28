import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../utils/firebaseAdmin";
import { MetricGroup, MetricValue } from "../../../setting/metric";
import { MetricKey } from "../../../setting/metric";

/**
 * 特定のカテゴリ（heat/cold/rain）の最近のランキングを返すAPI
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { type } = req.query;

  try {
    const rankingsSnapshot = await db.collection("rankings").get();
    const result: Record<string, any> = {};

    const targetMetrics =
      type && typeof type === "string" && type !== "all"
        ? Object.values(MetricKey)
            .filter((m) => m.detail.group === type)
            .map((m) => m.key)
        : Object.values(MetricKey)
            .filter((m) => m.detail.group !== undefined)
            .map((m) => m.key);

    rankingsSnapshot.forEach((doc) => {
      const metricId = doc.id as MetricValue;
      if (!targetMetrics.includes(metricId)) return;

      const data = doc.data();
      result[metricId] = data.list;
    });

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=60"
    );

    res.status(200).json({
      metrics: result,
      lastUpdate: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[API Error] Recent Ranking Fetch Failed:", error);
    res.status(500).json({ error: "Failed to fetch ranking data" });
  }
}
