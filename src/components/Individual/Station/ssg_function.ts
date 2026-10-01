import fs from "fs";
import path from "path";
import { RawData, RawStationData } from "../../../types/raw";
import { StationId } from "../../../types/union";
import { loadMaster } from "../../../utils/climateDataManager";
import { climateDownload } from "../../../utils/downloader";

export type StationDetailPageProps = RawData;

/**
 * 全地点の静的パス一覧を生成する
 */
export function getStationStaticPaths(): { params: { id: string } }[] {
  const master = loadMaster();
  return Object.keys(master).map((id) => ({
    params: { id },
  }));
}

/**
 * 特定の地点詳細ページに必要なデータをすべて読み込んで集約する
 */
export async function loadStationDetailPageData(
  id: StationId
): Promise<StationDetailPageProps | null> {
  const master = loadMaster();

  // 地点詳細に必要な全メトリックを自動解決して取得
  const stationMetricsMap = await climateDownload(
    {
      [id]: ["table", "overview", "ratio", "uonzu"],
    },
    master
  );

  const stationData = stationMetricsMap[id];
  if (!stationData) return null;

  const rawStationData = stationData.station;
  const { climateData } = stationData;

  // 類似地点データの読み込み
  const similarPath = path.join(process.cwd(), "data", "similar", `${id}.json`);
  const similarJson = fs.existsSync(similarPath)
    ? JSON.parse(fs.readFileSync(similarPath, "utf-8"))
    : null;

  const toSimilar = (list: { id: string; similar: number }[] = []) =>
    list.map((item) => ({
      ...master[item.id as StationId],
      similar: item.similar,
    }));

  // 同じ都道府県・気象台の観測所リスト
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

  return {
    station: rawStationData,
    climateData,
    otherStations: {
      similarAll: toSimilar(similarJson?.similar_all),
      similarMeteo: toSimilar(similarJson?.similar_meteo),
      sameStations: rawSameStations,
      meteoStations: rawMeteoStations,
    },
  };
}
