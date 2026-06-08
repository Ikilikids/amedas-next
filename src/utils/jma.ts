/**
 * 気象庁のCSVデータを取得・解析するユーティリティ
 */

import { RankingItem } from "../components/Ranking/types";

/**
 * 気象庁の最新の最高・最低気温・降水量ランキングCSVを取得して解析する
 */
export async function fetchJmaDailyMaxRanking(mmdd: string | null): Promise<{
  av_hitemp: RankingItem[];
  av_lwtemp: RankingItem[];
  sm_rain: RankingItem[];
}> {
  const fetchCSV = async (metric: "av_hitemp" | "av_lwtemp" | "sm_rain") => {
    const config = {
      av_hitemp: { type: "tem", file: "mxtemsadext" },
      av_lwtemp: { type: "tem", file: "mntemsadext" },
      sm_rain: { type: "pre", file: "predaily" },
    };
    const { type, file } = config[metric];
    const Time = mmdd ? mmdd : "00_rct";
    const CSV_URL = `https://www.data.jma.go.jp/stats/data/mdrr/${type}_rct/alltable/${file}${Time}.csv`;

    const res = await fetch(CSV_URL);
    if (!res.ok) throw new Error(`JMA CSV data not found: ${CSV_URL}`);

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
      const val = parseFloat(cols[9]);
      const hour = cols[11];
      const min = cols[12];
      const time =
        hour && min && type !== "pre"
          ? `${hour}:${min.padStart(2, "0")}`
          : null;

      if (!isNaN(val) && stationID.match(/^\d+$/)) {
        rankings.push({
          id: stationID,
          value: val,
          time,
          rank: 0,
        });
      }
    }
    // 高い順にソート
    return rankings.sort((a, b) => b.value - a.value);
  };

  const [hitemp, lwtemp, rain] = await Promise.all([
    fetchCSV("av_hitemp"),
    fetchCSV("av_lwtemp"),
    fetchCSV("sm_rain"),
  ]);

  return { av_hitemp: hitemp, av_lwtemp: lwtemp, sm_rain: rain };
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
