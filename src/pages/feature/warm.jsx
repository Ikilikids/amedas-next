// pages/station/[id].jsx
import fs from "fs";
import Head from "next/head";
import path from "path";
import { FaBuilding } from "react-icons/fa";
import DescriptionWithUonzu from "../../components/DescriptionWithUonzu";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import RankingPart from "../../components/RankingPart";
import {
  detectUnitFromPath,
  getMonthly,
  getValuesArrayFromData,
} from "../../utils/colorUtils";

// ==============================
// 共通関数
// ==============================

const selectedFiles = [
  "44356",
  "94081",
  "91197",
  "44301",
  "44263",
  "88317",
  "87376",
  "74516",
  "65356",
  "50331",
];

// ==============================
// getStaticProps
// ==============================
export async function getStaticProps() {
  const singleDir = path.join(process.cwd(), "public/single");

  // 説明データ
  const descPath = path.join(process.cwd(), "public/feature/warm.json");
  const descriptionData = fs.existsSync(descPath)
    ? JSON.parse(fs.readFileSync(descPath, "utf-8"))
    : {};

  // 気象台データ
  const stationsRaw = selectedFiles.map((num) => {
    const filePath = path.join(singleDir, `${num}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    //割合データ
    const ssgArray1 = getValuesArrayFromData(data, "all", "temp");
    const ssgArray = [ssgArray1];

    return {
      number: num,
      official_name: data.official_name,
      pref: data.pref,
      city: data.city,
      lon: data.lon,
      lat: data.lat,

      temp: getMonthly(data, "av_avtemp"),
      hitemp: getMonthly(data, "av_hitemp"),
      lwtemp: getMonthly(data, "av_lwtemp"),
      rain: getMonthly(data, "sm_rain"),
      ratio: ssgArray,
      記録: descriptionData[data.station_name]?.記録 ?? null,
      d1: descriptionData[data.station_name]?.d1 ?? null,
      d2: descriptionData[data.station_name]?.d2 ?? null,
      d3: descriptionData[data.station_name]?.d3 ?? null,
      d4: descriptionData[data.station_name]?.d4 ?? null,
      d5: descriptionData[data.station_name]?.d5 ?? null,
    };
  });

  // ランキング
  const rankingFiles = [
    {
      path: "public/ranking/av_avtemp/top/all.json",
      title: "年間平均気温",
      topN: 20,
    },
    {
      path: "public/ranking/av_avtemp/island/all.json",
      title: "年間平均気温(島嶼部を除く)",
      topN: 20,
    },
    {
      path: "public/ranking/hitemp_25/top/all.json",
      title: "年間夏日日数",
      topN: 20,
    },
    {
      path: "public/ranking/hitemp_25/island/all.json",
      title: "年間夏日日数(島嶼部を除く)",
      topN: 20,
    },
  ];

  const rankingListRaw = rankingFiles.map((r) => {
    const filePath = path.join(process.cwd(), r.path);
    if (!fs.existsSync(filePath)) return { title: r.title, stations: [] };

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const unit = detectUnitFromPath(filePath);

    const stations = Object.entries(data)
      .filter(([number, s]) => s.rank <= r.topN)
      .sort(([, a], [, b]) => a.rank - b.rank)
      .map(([number, s]) => {
        const val = Number(s.value);
        return {
          number, // ここでキーを number として取得
          station_name: s.station_name,
          pref: s.pref,
          city: s.city,
          rank: s.rank,
          value: isNaN(val) ? null : `${val.toFixed(1)}${unit}`,
        };
      });

    return {
      title: r.title,
      stations,
    };
  });

  // ⚠ 最終的に JSON-safe 化（undefined を完全除去）
  const stations = JSON.parse(
    JSON.stringify(stationsRaw, (k, v) => (v === undefined ? null : v))
  );

  const rankingList = JSON.parse(
    JSON.stringify(rankingListRaw, (k, v) => (v === undefined ? null : v))
  );

  return {
    props: {
      station: stations,
      rankingList,
    },
  };
}

// ==============================
// JSX
// ==============================
export default function StationPage({ station, rankingList }) {
  const DATA_OPTIONS = [
    { value: "chart0", label: "気温割合(通年)" },
    { value: "map", label: "マップ" },
    { value: "rain", label: "雨温図" },
  ];
  const description = false;

  if (!station) return <div>駅データが見つかりません</div>;

  return (
    <>
      <Head>
        <title>暑い地点まとめ - アメダス図鑑</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="flex-1 p-4">
          <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-4">
            <div className="flex-[5] flex flex-col gap-4">
              <h1 className="text-3xl font-bold mb-4 flex gap-2">
                <FaBuilding className="w-8 h-8" />
                暑い地点まとめ
              </h1>

              <DescriptionWithUonzu
                station={station}
                options={DATA_OPTIONS}
                description={description}
              />
            </div>

            <div className="flex-[2]">
              <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
                <RankingPart rankingList={rankingList} />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
