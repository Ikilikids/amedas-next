// pages/station/[id].tsx
import fs from "fs";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import path from "path";
import { useState } from "react";
import { IoBook } from "react-icons/io5";
import { LuChartNoAxesCombined } from "react-icons/lu";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import HyouTable from "../../components/HyouTable";
import InfoPanel from "../../components/InfoPanel2";
import MiniMap from "../../components/MiniMap";
import UonzuChart from "../../components/UonzuChart";
import PrefecturePage from "../../components/prefecturePart";
import Similar from "../../components/similar";
import RankBadge from "../../svg/RankBadge";
import {
  SectionWithDescription,
  getIcon,
  getRegionColor,
} from "../../utils/colorUtils";
const LayeredPieChart = dynamic(
  () => import("../../components/LayeredPieChart"),
  { ssr: false }
);

// ==============================
// Types
// ==============================
interface MonthlyRank {
  top?: number;
  bot?: number;
  island?: number;
  region?: number;
  pre?: number;
  meteo?: number;
}

interface MonthlyData {
  value: number | null;
  rank?: MonthlyRank;
}

interface MonthlyDataSource {
  all?: MonthlyData;
  [month: string]: MonthlyData | undefined; // For specific months
}

interface StationData {
  official_name: string;
  station_name: string;
  pref: string;
  city: string;
  lon: number;
  lat: number;
  height: number | null; // Added
  same_pre: any;
  meteo: any;
  similar_all: any;
  similar_meteo: any;
  data: {
    // More specific type for data
    av_avtemp: MonthlyDataSource;
    av_hitemp: MonthlyDataSource;
    av_lwtemp: MonthlyDataSource;
    hitemp_35: MonthlyDataSource; // ← 追加
    sm_rain: MonthlyDataSource;
    sm_sun?: MonthlyDataSource;
    sm_snowing?: MonthlyDataSource;
    av_wind?: MonthlyDataSource;
  };
}

interface PageProps {
  station: StationData;
  samePrefecture: any;
  rank1Stations: any;
  similarStations: any;
  similarCutStations: any;
  regionColor: string;
}

type Rank = 1 | 2 | 3 | 4;
type BadgeItem = {
  type: BadgeType;
  rank: Rank;
};

const makeBadge = (type: BadgeType, rank: Rank): BadgeItem => ({
  type,
  rank,
});

// ==============================
// getStaticPaths
// ==============================
export const getStaticPaths: GetStaticPaths = async () => {
  const dirPath = path.join(process.cwd(), "data/single");
  const files = fs.readdirSync(dirPath);
  const paths = files.map((file) => ({
    params: { id: path.basename(file, ".json") },
  }));

  return { paths, fallback: false };
};

// ==============================
// getStaticProps
// ==============================
export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const stationFile = path.join(
    process.cwd(),
    "data/single",
    `${params?.id}.json`
  );
  let stationData: StationData | null = null;
  if (fs.existsSync(stationFile)) {
    stationData = JSON.parse(fs.readFileSync(stationFile, "utf-8"));
  }

  if (!stationData) {
    return { notFound: true };
  }

  const samePrefecture = stationData.same_pre;
  const rank1Stations = stationData.meteo;
  const similarStations = stationData.similar_all;
  const similarCutStations = stationData.similar_meteo;
  const regionColor = getRegionColor(stationData.pref);

  return {
    props: {
      station: stationData,
      samePrefecture: samePrefecture || {},
      rank1Stations: rank1Stations || {},
      similarStations: similarStations || {},
      similarCutStations: similarCutStations || {},
      regionColor: regionColor,
    },
  };
};

type BadgeType =
  | "toptemp"
  | "bottemp"
  | "hitemp"
  | "rain"
  | "sun"
  | "snowing"
  | "wind";

function getBadgeColor(
  rankPercent: number | undefined,
  type: BadgeType
): Rank | null {
  if (rankPercent == null) return null;

  const totalMap: Record<BadgeType, number> = {
    toptemp: 904,
    bottemp: 904,
    hitemp: 904,
    rain: 1230,
    sun: 827,
    snowing: 320,
    wind: 874,
  };

  const all = totalMap[type];

  if (rankPercent <= 10) return 1;
  if (rankPercent <= all * 0.05) return 2;
  if (rankPercent <= all * 0.1) return 3;
  if (rankPercent <= all * 0.2) return 4;

  return null; // ← バッジなし
}
// ==============================
//  ページコンポーネント
// ==============================
const StationPage: NextPage<PageProps> = ({
  station,
  samePrefecture,
  rank1Stations,
  similarStations,
  similarCutStations,
  regionColor,
}) => {
  const [selectedBar, setSelectedBar] = useState<"rain" | "snowing" | "sun">(
    "rain"
  );
  const toptempRank = getBadgeColor(
    station.data.av_avtemp.all?.rank?.top,
    "toptemp"
  );
  const bottempRank = getBadgeColor(
    station.data.av_avtemp.all?.rank?.bot,
    "bottemp"
  );
  const hitempRank = getBadgeColor(
    station.data.hitemp_35.all?.rank?.top,
    "hitemp"
  );
  const rainRank = getBadgeColor(station.data.sm_rain.all?.rank?.top, "rain");

  const snowingRank = getBadgeColor(
    station.data.sm_snowing?.all?.rank?.top,
    "snowing"
  );

  const sunRank = getBadgeColor(station.data.sm_sun?.all?.rank?.top, "sun");
  const windRank = getBadgeColor(station.data.av_wind?.all?.rank?.top, "wind");
  const badgeItems: BadgeItem[] = [
    ["toptemp", toptempRank],
    ["bottemp", bottempRank],
    ["hitemp", hitempRank],
    ["rain", rainRank],
    ["snowing", snowingRank],
    ["sun", sunRank],
    ["wind", windRank],
  ]
    .filter((item): item is [BadgeType, Rank] => item[1] !== null)
    .map(([type, rank]) => makeBadge(type, rank))
    .sort((a, b) => a.rank - b.rank);
  if (!station) return <div>駅データが見つかりません</div>;
  return (
    <>
      <Head>
        <title>{`${station.official_name} の詳細な気候データ - アメダス図鑑`}</title>
        <meta
          name="description"
          content={`アメダス観測所の中から、${station.official_name} と気候が似ている地点を探せます。さらに平年気温・降水量・降雪量を雨温図や日数割合グラフで直感的に確認できます。`}
        />
      </Head>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <main className="flex-1 p-2">
          <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-4">
            {/* 左メインコンテンツ 5/7 */}
            <div className="flex-[5] w-full lg:w-auto flex flex-col gap-2 min-w-0">
              <h1 className="text-3xl font-bold mb-2 mt-2 flex gap-2 flex-wrap items-center">
                {getIcon(station.official_name)}
                {station.official_name} の詳細データ
                {badgeItems.map((badge) => (
                  <RankBadge
                    key={badge.type}
                    size={35}
                    rank={badge.rank}
                    type={badge.type}
                  />
                ))}
              </h1>

              <div className="text-gray-700 mb-4">
                <div>
                  ・{station.official_name}{" "}
                  の気候データです、データは平年値(1991-2020の平均値)です。
                </div>
                <div>
                  ・類似度は、全国のアメダス観測所の月ごとの平均気温、平均最高気温、平均最低気温、降水量をもとに算出しており、気候パターンの類似性を比較できます。
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {/* 情報パネルとマップ */}
                <SectionWithDescription
                  icon={IoBook}
                  title="基本データ"
                  bgColor={regionColor}
                />
                <div className="w-full sm:h-[290px] h-[580px] flex flex-col sm:flex-row gap-2">
                  {/* 左：情報パネル */}
                  <div className="flex-[5] w-full">
                    <InfoPanel station={station} />
                  </div>
                  {/* 右or下：その地点だけの地図 */}
                  <div className="flex-[5] w-full sm:pr-2">
                    <MiniMap
                      lat={station.lon}
                      lng={station.lat}
                      height="280px"
                    />
                  </div>
                </div>
                {/* 雨温図 */}
                <SectionWithDescription
                  icon={LuChartNoAxesCombined}
                  title="雨温図"
                  bgColor={regionColor}
                  description={[
                    "・月別の平均気温、降水量データを雨温図にまとめました。",
                    "・月別降水量が500mmを超える地点は、降水量の縦軸の縮尺が変わっています。",
                  ]}
                >
                  <div className="flex items-center gap-1">
                    <span>棒グラフ：</span>
                    <select
                      className="p-0.5 border rounded"
                      value={selectedBar}
                      onChange={(e) =>
                        setSelectedBar(
                          e.target.value as "rain" | "snowing" | "sun"
                        )
                      }
                    >
                      <option value="rain">降水量</option>
                      <option value="snowing">降雪量</option>
                      <option value="sun">日照時間</option>
                    </select>
                  </div>
                </SectionWithDescription>

                {/* チャートは別に置く */}
                <div className="h-[350px]">
                  <UonzuChart station={station} selectedBar={selectedBar} />
                </div>

                {/* 割合データ */}
                <div className="">
                  <LayeredPieChart
                    station={station}
                    regionColor={regionColor}
                  />
                </div>
                {/* 表データ */}
                <div className="">
                  <HyouTable station={station} regionColor={regionColor} />
                </div>
              </div>
            </div>

            {/* エリア 2/7 */}
            <div className="flex-[2] w-full xl:w-auto flex flex-col min-w-0">
              <div className="sticky top-4 flex-1">
                {similarStations && Object.keys(similarStations).length > 0 && (
                  <Similar
                    similarStations={similarStations}
                    similarCutStations={similarCutStations}
                  />
                )}
                <PrefecturePage
                  samePrefecture={samePrefecture}
                  rank1Stations={rank1Stations}
                />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default StationPage;
