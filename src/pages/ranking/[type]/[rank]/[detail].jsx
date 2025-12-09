import fs from "fs";
import Head from "next/head";
import path from "path";
import { useState } from "react";
import { IoIosTrophy } from "react-icons/io";
import Footer from "../../../../components/Footer";
import Header from "../../../../components/Header";
import InfoPanel from "../../../../components/InfoPanel";
import Ranking from "../../../../components/Ranking";
import {
  getRegionColor,
  metrics,
  prefCodeMap,
  slugToRegion,
} from "../../../../utils/colorUtils";

export async function getStaticPaths() {
  const types = [
    "av_avtemp",
    "av_hitemp",
    "sm_sun",
    "sm_rain",
    "sm_snow",
    "hitemp_35",
    "hitemp_30",
    "lwtemp5",
  ];

  // rank と detail は “手動で書く”
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

  const paths = [];

  // ----------------------------
  // type × month は固定の全組み合わせ
  // ----------------------------
  types.forEach((type) => {
    // 手動追加の rank/detail だけ組み合わせる
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
}

// --- SSRで初期表示用データのみ取得 ---
export async function getStaticProps({ params }) {
  const { type, rank, detail } = params;

  let rankingPath;

  if (rank === "pre" || rank === "region") {
    // detail は都道府県コード
    rankingPath = path.join(
      process.cwd(),
      `public/ranking/${type}/${rank}/${detail}/all.json`
    );
  } else {
    // その他のランキング
    rankingPath = path.join(
      process.cwd(),
      `public/ranking/${type}/${rank}/all.json`
    );
  }

  let rankingData = {};
  if (fs.existsSync(rankingPath)) {
    rankingData = JSON.parse(fs.readFileSync(rankingPath, "utf-8"));
  }

  const stationList = Object.entries(rankingData).map(([id, data]) => ({
    id,
    station_name: data.station_name,
    official_name: data.official_name,
    pref: data.pref,
    city: data.city,
    value: data.value,
    rank: data.rank,
  }));

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
}

export default function RankingPage({
  initialStations,
  initialSortKey,
  initialRankType,
  initialRegion,
  initialPref,
  initialMonth,
}) {
  const [selectedStation, setSelectedStation] = useState(null);

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
      {/* Head */}
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
              <IoIosTrophy className="w-8 h-8 text-red-500" />
              ランキングから探す
            </h1>

            <div className="text-gray-700 mb-4">
              <div>
                ・ランキングをクリックすると、右側の情報パネルに選択した観測所の基本情報（正式名称、都道府県、市町村）と雨温図が表示されます。
              </div>
              <div>
                ・情報パネルの「詳細」ボタンを押すと、各月の平均気温、最高・最低気温、降水量などの詳細データや、割合グラフを確認できます。
              </div>
              <div>
                ・気温関連のデータについては、太平洋の島嶼部は気温が極端に高いため、区別のためランクに順位に*がついています。
              </div>
              <div>
                ・情報パネルの背景色は、地方を表しています。北海道：紺｜東北：水色｜関東：緑｜中部：黄緑｜北陸：黄｜近畿：橙｜中国：紫｜四国：桃色｜九州：赤｜沖縄：淡桃色
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              {/* 左：ランキング */}
              <h2 className="sr-only">ランキング</h2>
              <div className="h-[400px] lg:h-[700px] lg:flex-[4] xl:flex-[5] border rounded-lg overflow-hidden shadow bg-white">
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

              {/* 右：情報パネル */}
              <h2 className="sr-only">情報パネル</h2>
              <div
                className="h-[700px] lg:flex-[2] xl:flex-[2] border rounded-lg overflow-auto shadow"
                style={{
                  backgroundColor: selectedStation
                    ? getRegionColor(selectedStation.pref)
                    : "white",
                }}
              >
                <InfoPanel stationId={selectedStation?.id} />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
