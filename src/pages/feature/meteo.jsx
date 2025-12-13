// pages/station/[id].jsx
import fs from "fs";
import Head from "next/head";
import path from "path";
import { FaBuilding } from "react-icons/fa";
import DescriptionWithUonzu from "../../components/DescriptionWithUonzu";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import RankingPartSimple from "../../components/RankingPartSimple";
import {
  detectUnitFromPath,
  getMonthly,
  getValuesArrayFromData,
} from "../../utils/colorUtils";
// ==============================
// 共通関数
// ==============================

// 気象台の条件
const EXCLUDE = [
  "11016",
  "12442",
  "17341",
  "19432",
  "21323",
  "23232",
  "40336",
  "92011",
  "93041",
  "94081",
];

// ランキング
const rankingFiles = [
  {
    path: "data/ranking/av_avtemp/meteo/all.json",
    title: "年間平均気温",
    topN: 47,
  },
  {
    path: "data/ranking/sm_rain/meteo/all.json",
    title: "年間降水量",
    topN: 47,
  },
  {
    path: "data/ranking/sm_snowing/meteo/all.json",
    title: "年間降雪量",
    topN: 47,
  },
  {
    path: "data/ranking/sm_sun/meteo/all.json",
    title: "年間日照時間",
    topN: 47,
  },
  {
    path: "data/ranking/hitemp_0/meteo/all.json",
    title: "年間真冬日日数",
    topN: 47,
  },
  {
    path: "data/ranking/lwtemp_0/meteo/all.json",
    title: "年間冬日日数",
    topN: 47,
  },
  {
    path: "data/ranking/hitemp_25/meteo/all.json",
    title: "年間夏日日数",
    topN: 47,
  },
  {
    path: "data/ranking/hitemp_30/meteo/all.json",
    title: "年間真夏日日数",
    topN: 47,
  },
  {
    path: "data/ranking/hitemp_35/meteo/all.json",
    title: "年間猛暑日日数",
    topN: 47,
  },
  {
    path: "data/ranking/lwtemp_25/meteo/all.json",
    title: "年間熱帯夜日数",
    topN: 47,
  },
];

function isTargetMeteo(official_name, number) {
  return (
    official_name.includes("気象台") &&
    !official_name.includes("航空") &&
    !official_name.includes("高層") &&
    !EXCLUDE.includes(number)
  );
}

// ==============================
// getStaticProps
// ==============================
export async function getStaticProps() {
  const singleDir = path.join(process.cwd(), "data/single");
  const allFiles = fs.readdirSync(singleDir).filter((f) => f.endsWith(".json"));

  // 説明データ
  const descPath = path.join(process.cwd(), "data/feature/meteo.json");
  const descriptionData = fs.existsSync(descPath)
    ? JSON.parse(fs.readFileSync(descPath, "utf-8"))
    : {};

  // 気象台データ
  const stationsRaw = allFiles
    .map((file) => ({
      number: file.replace(".json", ""),
      json: JSON.parse(fs.readFileSync(path.join(singleDir, file), "utf-8")),
    }))
    .filter((s) => isTargetMeteo(s.json.official_name, s.number))
    .map((s) => {
      const data = s.json;
      //割合データ
      const ssgArray1 = getValuesArrayFromData(data, "all", "temp");
      const ssgArray2 = getValuesArrayFromData(data, "all", "rain");
      const ssgArray = [ssgArray1, ssgArray2];

      return {
        number: s.number,
        official_name: data.official_name,
        station_name: data.station_name,
        pref: data.pref,
        city: data.city,
        lon: data.lon,
        lat: data.lat,
        ratio: ssgArray,
        temp: getMonthly(data, "av_avtemp"),
        hitemp: getMonthly(data, "av_hitemp"),
        lwtemp: getMonthly(data, "av_lwtemp"),
        rain: getMonthly(data, "sm_rain"),
        snowing: getMonthly(data, "sm_snowing"),
        sun: getMonthly(data, "sm_sun"),
        記録: descriptionData[data.station_name]?.記録 ?? null,
        概要: descriptionData[data.station_name]?.概要 ?? null,
        気温: descriptionData[data.station_name]?.気温 ?? null,
        降水: descriptionData[data.station_name]?.降水 ?? null,
        その他: descriptionData[data.station_name]?.その他 ?? null,
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
    { value: "rain", label: "降水量" },
    { value: "snowing", label: "降雪量" },
    { value: "sun", label: "日照時間" },
    { value: "map", label: "マップ" },
    { value: "chart0", label: "気温割合" },
    { value: "chart1", label: "降水割合" },
  ];
  const description = true;

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
            <div className="flex-[5] flex flex-col gap-2">
              <h1 className="text-3xl font-bold mb-4 flex gap-2">
                <FaBuilding className="w-8 h-8" />
                気象台まとめ
              </h1>
              <div className="mb-4">
                <div>
                  ・都道府県の代表地点である気象台の特徴をまとめました。北海道は札幌、沖縄県は那覇を代表点としています。
                </div>
                <div>
                  ・それぞれの地点のデータタブを切り替えると雨温図や割合データ、位置などを知ることができます。
                </div>
              </div>
              <DescriptionWithUonzu
                station={station}
                options={DATA_OPTIONS}
                description={description}
              />
            </div>

            <div className="flex-[2]">
              <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
                <RankingPartSimple rankingList={rankingList} />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
