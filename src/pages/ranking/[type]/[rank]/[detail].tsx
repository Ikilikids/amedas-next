// pages/ranking/[type]/[rank]/[detail].tsx
import fs from "fs";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import path from "path";
import { useState } from "react";
import { IoIosTrophy } from "react-icons/io";
import Footer from "../../../../components/Footer";
import Header from "../../../../components/Header";
import Ranking from "../../../../components/Ranking";
import StationDetailPanel from "../../../../components/StationDetailPanel";
import {
  SectionWithDescription,
  metrics,
  prefCodeMap,
  slugToRegion,
} from "../../../../utils/colorUtils";

// ==============================
// Types
// ==============================
interface Station {
  id: string;
  station_name: string;
  official_name: string;
  pref: string;
  city: string;
  value: number | string;
  rank: number;
}

interface PageProps {
  initialStations: Station[];
  initialSortKey: string;
  initialRankType: string;
  initialRegion: string;
  initialPref: string;
  initialMonth: string;
}

// ==============================
// getStaticPaths
// ==============================
export const getStaticPaths: GetStaticPaths = async () => {
  const types = [
    "av_avtemp",
    "av_hitemp",
    "sm_sun",
    "sm_rain",
    "sm_snowing",
    "hitemp_35",
    "hitemp_30",
    "lwtemp_25",
  ];

  const extraPaths = [
    { rank: "top", detail: "default" },
    { rank: "pre", detail: "44" },
    { rank: "pre", detail: "62" },
    { rank: "region", detail: "hokkaido" },
    { rank: "region", detail: "tohoku" },
    { rank: "region", detail: "kanto" },
    { rank: "region", detail: "hokuriku" },
    { rank: "region", detail: "chubu" },
    { rank: "region", detail: "kinki" },
    { rank: "region", detail: "chugoku" },
    { rank: "region", detail: "shikoku" },
    { rank: "region", detail: "kyushu" },
  ];

  const paths: { params: { type: string; rank: string; detail: string } }[] =
    [];

  types.forEach((type) => {
    extraPaths.forEach(({ rank, detail }) => {
      paths.push({
        params: { type, rank, detail },
      });
    });
  });

  return {
    paths,
    fallback: false,
  };
};

// ==============================
// getStaticProps
// ==============================
export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const { type, rank, detail } = params as {
    type: string;
    rank: string;
    detail: string;
  };

  let rankingPath;

  if (rank === "pre" || rank === "region") {
    rankingPath = path.join(
      process.cwd(),
      `data/ranking/${type}/${rank}/${detail}/all.json`
    );
  } else {
    rankingPath = path.join(
      process.cwd(),
      `data/ranking/${type}/${rank}/all.json`
    );
  }

  let rankingData = {};
  if (fs.existsSync(rankingPath)) {
    rankingData = JSON.parse(fs.readFileSync(rankingPath, "utf-8"));
  }

  const stationList: Station[] = Object.entries(rankingData).map(
    ([id, data]: [string, any]) => ({
      id,
      station_name: data.station_name,
      official_name: data.official_name,
      pref: data.pref,
      city: data.city,
      value: data.value,
      rank: data.rank,
    })
  );

  return {
    props: {
      initialStations: stationList,
      initialSortKey: type,
      initialRankType: rank,
      initialMonth: "all",
      initialRegion: rank === "region" ? detail : "kanto",
      initialPref: rank === "pre" ? detail : "44",
    },
  };
};

// ==============================
//  ページコンポーネント
// ==============================
const RankingPage: NextPage<PageProps> = ({
  initialStations,
  initialSortKey,
  initialRankType,
  initialRegion,
  initialPref,
  initialMonth,
}) => {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const rankTarget =
    metrics.find((m) => m.key === initialSortKey)?.label || "値";

  const areaName =
    initialRankType === "pre"
      ? prefCodeMap[initialPref]
      : initialRankType === "region"
      ? slugToRegion[initialRegion]
      : "全国";

  return (
    <>
      <Head>
        <title>{`${areaName}の${rankTarget}ランキング - アメダス図鑑`}</title>
        <meta
          name="description"
          content={`${areaName}の${rankTarget}ランキングを確認できます。雨温図、熱帯夜、猛暑日などの詳細データも確認できます。割合データなど詳細なデータを完備しています。`}
        />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <main className="flex-1 p-4">
          <div className="max-w-[1280px] mx-auto flex flex-col gap-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <IoIosTrophy className="w-8 h-8" />
              ランキングから探す
            </h1>

            <div className="text-gray-700 mb-4">
              <div>
                ・ランキングをクリックすると、右側(下側)の情報パネルに選択した観測所の基本情報（正式名称、都道府県、市町村）と雨温図が表示されます。
              </div>
              <div>
                ・情報パネルの地点名を押すと、各月の平均気温、最高・最低気温、降水量などの詳細データや、割合グラフを確認できます。データは平年値(1991-2020の平均値)です。
              </div>
              <div>
                ・気温関連のデータについては、太平洋の島嶼部は気温が極端に高いため、区別のためランクに順位に*がついています。
              </div>
              <div>
                ・情報パネルの背景色は、地方を表しています。北海道：紺｜東北：水色｜関東：緑｜中部：黄緑｜北陸：黄｜近畿：橙｜中国：紫｜四国：桃色｜九州：赤｜沖縄：淡桃色
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="h-[400px] lg:h-[750px] lg:flex-[4] xl:flex-[5] overflow-hidden flex flex-col gap-2">
                <h2 className="sr-only">地図</h2>

                <div className="bg-white border rounded-lg">
                  <SectionWithDescription
                    icon={IoIosTrophy}
                    title="ランキング"
                    bgColor=""
                  />
                </div>
                <div className="flex-1 min-h-0 overflow-hidden">
                  <Ranking
                    initialStations={initialStations}
                    initialSortKey={initialSortKey}
                    initialRankType={initialRankType}
                    initialRegion={initialRegion}
                    initialPref={initialPref}
                    initialMonth={initialMonth}
                    onStationClick={setSelectedStation}
                  />
                </div>
              </div>

              <StationDetailPanel stationId={selectedStation?.id} />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};
export default RankingPage;
