/**
 * 気象庁のCSVデータを取得・解析するユーティリティ
 */

import { RankingItem } from "../components/Ranking/types";

/**
 * 気象庁の最新の最高気温ランキングCSVを取得して解析する
 */
export async function fetchJmaDailyMaxRanking(
  mmdd = null
): Promise<RankingItem[]> {
  const CSV_URL = mmdd
    ? `https://www.data.jma.go.jp/stats/data/mdrr/tem_rct/alltable/mxtemsadext${mmdd}.csv`
    : "https://www.data.jma.go.jp/stats/data/mdrr/tem_rct/alltable/mxtemsadext00_rct.csv";

  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error("JMA CSV data not found.");

  const buffer = await res.arrayBuffer();
  const decoder = new TextDecoder("shift-jis");
  const csvText = decoder.decode(buffer);

  const lines = csvText.split("\n");
  const rankings: RankingItem[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith("観測")) continue;

    const cols = line.split(",");
    if (cols.length < 10) continue;

    const stationID = cols[0];
    const maxTemp = parseFloat(cols[9]);
    // CSVの仕様: 11:起時(時), 12:起時(分)
    const hour = cols[11];
    const min = cols[12];
    const time = hour && min ? `${hour}:${min.padStart(2, "0")}` : null;

    if (!isNaN(maxTemp) && stationID.match(/^\d+$/)) {
      rankings.push({
        id: stationID,
        value: maxTemp,
        time,
        rank: 0, // 後で順位付けする
      });
    }
  }

  // 高い順にソート
  return rankings.sort((a, b) => b.value - a.value);
}

/**
 * 気象庁の現在の気温データを取得して解析する
 */
export async function fetchJmaRealtime(): Promise<{
  stations: RankingItem[];
  lastUpdate: string;
}> {
  // 1. 最新時刻の取得
  const timeRes = await fetch(
    "https://www.jma.go.jp/bosai/amedas/data/latest_time.txt"
  );
  const isoTime = await timeRes.text();
  const formattedTime = isoTime.replace(/[-T:]/g, "").substring(0, 14);
  const displayTime = new Date(isoTime).toLocaleString("ja-JP");
  const observationTime = new Date(isoTime).toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // 2. 全国データの取得
  const dataRes = await fetch(
    `https://www.jma.go.jp/bosai/amedas/data/map/${formattedTime}.json`
  );
  const allData = await dataRes.json();

  const stations: RankingItem[] = Object.keys(allData).map((id) => ({
    id,
    value: allData[id]?.temp?.[0] ?? null,
    time: observationTime,
    rank: 0,
    // リアルタイムデータは一斉観測なので、共通の観測時刻を入れる
  }));

  return { stations, lastUpdate: displayTime };
}
