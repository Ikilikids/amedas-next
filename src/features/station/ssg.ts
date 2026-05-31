// features/station/ssg.ts

import fs from "fs";
import { GetStaticPaths, GetStaticProps } from "next";
import path from "path";
import { RawBadgeData, RawData, RawStationData } from "../../types/raw";
import { OriginSimilarItem } from "../../types/union";
import { BadgeLogic } from "../../utils/badgeLogic";
import { buildSimilar } from "./transformSimilar";

const dataDir = path.join(process.cwd(), "data");

const readFile = (s: string, f: string) => {
  const p = path.join(dataDir, s, f);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf-8")) : null;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const dirPath = path.join(process.cwd(), "data/overview");
  const paths = fs.readdirSync(dirPath).map((f) => ({
    params: { id: path.basename(f, ".json") },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<RawData> = async ({ params }) => {
  const id = params?.id as string;

  const rawMasterAll: Record<string, RawStationData> = JSON.parse(
    fs.readFileSync(path.join(dataDir, "stations.json"), "utf-8")
  );

  const rawStationData: RawStationData = rawMasterAll[id];

  const overview = readFile("overview", `${id}.json`);
  const uonzu = readFile("uonzu", `${id}.json`);
  const table = readFile("table", `${id}.json`);
  const ratio = readFile("ratio", `${id}.json`);
  const rawSimilarAllItem: OriginSimilarItem[] = readFile(
    "similar",
    `${id}.json`
  ).similar_all;
  const rawSimilarMeteoItem: OriginSimilarItem[] = readFile(
    "similar",
    `${id}.json`
  ).similar_meteo;

  if (!rawStationData || !overview || !uonzu) return { notFound: true };

  const result = buildSimilar(
    rawSimilarAllItem,
    rawSimilarMeteoItem,
    rawMasterAll
  );

  const rawSimilarAllData = result.rawSimilarAll;
  const rawSimilarMeteoData = result.rawSimilarMeteo;

  const rawSameStations: RawStationData[] = [];
  const rawMeteoStations: RawStationData[] = [];

  Object.entries(rawMasterAll).forEach(([id, s]) => {
    const rawFirstItem: RawStationData = {
      id: s.id,
      pref: s.pref,
      category: s.category,
      station_name: s.station_name,
    };

    if (s.pref === rawStationData.pref) {
      rawSameStations.push(rawFirstItem);
    }

    if (s.category === "meteo") {
      rawMeteoStations.push(rawFirstItem);
    }
  });

  const badgeinfo: RawBadgeData[] = BadgeLogic.getBadges(overview, ratio);
  return {
    props: {
      station: rawStationData,
      overview,
      uonzu,
      table,
      ratio,
      similarAll: rawSimilarAllData,
      similarMeteo: rawSimilarMeteoData,
      sameStations: rawSameStations,
      meteoStations: rawMeteoStations,
      badge: badgeinfo,
    },
  };
};
