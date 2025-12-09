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

const selectedFiles = ["88686", "87346", "50427", "74151", "53378", "46161"];

// ランキング
const rankingFiles = [
  {
    path: "public/ranking/sm_rain/top/all.json",
    title: "年間降水量",
    topN: 20,
  },
];
// ==============================
// getStaticProps
// ==============================
export async function getStaticProps() {
  const singleDir = path.join(process.cwd(), "public/single");

  // 説明データ
  const descPath = path.join(process.cwd(), "public/feature/hot.json");
  const descriptionData = fs.existsSync(descPath)
    ? JSON.parse(fs.readFileSync(descPath, "utf-8"))
    : {};

  // 気象台データ
  const stationsRaw = selectedFiles.map((num) => {
    const filePath = path.join(singleDir, `${num}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    //割合データ
    const ssgArray1 = getValuesArrayFromData(data, "all", "rain");
    const ssgArray = [ssgArray1];

    return {
      number: num,
      official_name: data.official_name,
      station_name: data.station_name,
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
    { value: "chart0", label: "降水割合(通年)" },
    { value: "map", label: "マップ" },
    { value: "rain", label: "雨温図" },
  ];
  const description = false;

  if (!station) return <div>駅データが見つかりません</div>;

  return (
    <>
      <Head>
        <title>雨が多い地点まとめ - アメダス図鑑</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="flex-1 p-4">
          <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-4">
            <div className="flex-[5] flex flex-col gap-4">
              <h1 className="text-3xl font-bold mb-4 flex gap-2">
                <FaBuilding className="w-8 h-8" />
                雨が多い地点まとめ
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
