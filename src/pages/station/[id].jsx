// pages/station/[id].jsx
import fs from "fs";
import dynamic from "next/dynamic";
import Head from "next/head";
import path from "path";
import { useState } from "react";
import { IoHomeSharp } from "react-icons/io5";
import { LuChartNoAxesCombined } from "react-icons/lu";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import HyouTable from "../../components/HyouTable";
import InfoPanel from "../../components/InfoPanel2";
import MiniMap from "../../components/MiniMap";
import UonzuChart from "../../components/UonzuChart";
import PrefecturePage from "../../components/prefecturePart";
import Similar from "../../components/similar";
import { getIcon, getRegionColor } from "../../utils/colorUtils";
const LayeredPieChart = dynamic(
  () => import("../../components/LayeredPieChart"),
  { ssr: false }
);
// ==============================
// getStaticPaths
// ==============================
export async function getStaticPaths() {
  // public/single フォルダ内の全ファイル名から paths を生成
  const dirPath = path.join(process.cwd(), "public/single");
  const files = fs.readdirSync(dirPath); // ["11001.json", "11002.json", ...]
  const paths = files.map((file) => ({
    params: { id: path.basename(file, ".json") }, // ファイル名から拡張子を除く
  }));

  return { paths, fallback: false };
}

// ==============================
// getStaticProps
// ==============================
export async function getStaticProps({ params }) {
  // 1. 個別駅データ
  const stationFile = path.join(
    process.cwd(),
    "public/single",
    `${params.id}.json`
  );
  let stationData = null;
  if (fs.existsSync(stationFile)) {
    stationData = JSON.parse(fs.readFileSync(stationFile, "utf-8"));
  }
  const samePrefecture = stationData.same_pre;
  const rank1Stations = stationData.meteo;
  const similarStations = stationData.similar_all;
  const similarCutStations = stationData.similar_meteo;
  const regionColor = getRegionColor(stationData.pref);
  return {
    props: {
      station: stationData || null,
      samePrefecture: samePrefecture || {},
      rank1Stations: rank1Stations || {},
      similarStations: similarStations || {},
      similarCutStations: similarCutStations || {},
      regionColor: regionColor || {},
    },
  };
}

// ==============================
//  ページコンポーネント
// ==============================
export default function StationPage({
  station,
  samePrefecture,
  rank1Stations,
  similarStations,
  similarCutStations,
  regionColor,
}) {
  const [selectedBar, setSelectedBar] = useState("rain"); // 1地点だけ選択
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
            <div className="flex-[5] w-full lg:w-auto flex flex-col gap-4 min-w-0">
              <h1 className="text-3xl font-bold mb-4 flex gap-2">
                {getIcon(station.official_name)}
                {station.official_name} の詳細データ
              </h1>

              <div className="text-gray-700 mb-4">
                <div>
                  ・{station.official_name} の平年値・月別のデータです。
                </div>
                <div>
                  ・類似度は、全国のアメダス観測所の月ごとの平均気温、平均最高気温、平均最低気温、降水量をもとに算出しており、気候パターンの類似性を比較できます。
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {/* 情報パネルとマップ */}
                <SectionWithDescription
                  icon={IoHomeSharp}
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
                    <MiniMap lat={station.lon} lng={station.lat} />
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
                      onChange={(e) => setSelectedBar(e.target.value)}
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
}

function SectionWithDescription({
  icon: Icon,
  title,
  bgColor,
  description,
  children,
}) {
  return (
    <div className="">
      <div
        className="flex flex-row items-center justify-between w-full z-10 p-1 rounded"
        style={{ backgroundColor: bgColor }}
      >
        <h2 className="flex items-center font-bold text-base sm:text-xl text-left gap-1">
          {Icon && <Icon />}
          {title}
        </h2>
        {/* childrenをここに置くと右端に */}
        {children && <div>{children}</div>}
      </div>

      {description && (
        <div className="text-sm pt-2">
          {description.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}
