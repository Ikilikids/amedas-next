// pages/feature/meteo.tsx
import fs from "fs";
import { GetStaticProps, NextPage } from "next";
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
// Types
// ==============================
interface Station {
  number: string;
  official_name: string;
  station_name: string;
  pref: string;
  city: string;
  lon: number;
  lat: number;
  ratio: any[];
  temp: (number | null)[];
  hitemp: (number | null)[];
  lwtemp: (number | null)[];
  rain: (number | null)[];
  snowing: (number | null)[];
  sun: (number | null)[];
  記録: string | null;
  概要: string | null;
  気温: string | null;
  降水: string | null;
  その他: string | null;
  d1: string | null; // Added
  d2: string | null; // Added
  d3: string | null; // Added
  d4: string | null; // Added
  d5: string | null; // Added
}

interface RankingStation {
  number: string;
  station_name: string;
  pref: string;
  rank: number;
  value: string | null;
}

interface Ranking {
  title: string;
  stations: RankingStation[];
}

interface PageProps {
  station: Station[];
  rankingList: Ranking[];
}

// ==============================
// 共通関数
// ==============================
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

function isTargetMeteo(official_name: string, number: string): boolean {
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
export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const singleDir = path.join(process.cwd(), "data/single");
  const allFiles = fs.readdirSync(singleDir).filter((f) => f.endsWith(".json"));

  const descPath = path.join(process.cwd(), "data/feature/meteo.json");
  const descriptionData = fs.existsSync(descPath)
    ? JSON.parse(fs.readFileSync(descPath, "utf-8"))
    : {};

  const stationsRaw: Station[] = allFiles
    .map((file) => ({
      number: file.replace(".json", ""),
      json: JSON.parse(fs.readFileSync(path.join(singleDir, file), "utf-8")),
    }))
    .filter((s) => isTargetMeteo(s.json.official_name, s.number))
    .map((s) => {
      const data = s.json;
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
        d1: descriptionData[data.station_name]?.d1 ?? null, // Added
        d2: descriptionData[data.station_name]?.d2 ?? null, // Added
        d3: descriptionData[data.station_name]?.d3 ?? null, // Added
        d4: descriptionData[data.station_name]?.d4 ?? null, // Added
        d5: descriptionData[data.station_name]?.d5 ?? null, // Added
      };
    });

  const rankingListRaw: Ranking[] = rankingFiles.map((r) => {
    const filePath = path.join(process.cwd(), r.path);
    if (!fs.existsSync(filePath)) return { title: r.title, stations: [] };

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const unit = detectUnitFromPath(filePath);

    const stations: RankingStation[] = Object.entries(data)
      .filter(([number, s]: [string, any]) => s.rank <= r.topN)
      .sort(([, a]: [string, any], [, b]: [string, any]) => a.rank - b.rank)
      .map(([number, s]: [string, any]) => {
        const val = Number(s.value);
        return {
          number,
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

  const stations = JSON.parse(JSON.stringify(stationsRaw));
  const rankingList = JSON.parse(JSON.stringify(rankingListRaw));

  return {
    props: {
      station: stations,
      rankingList,
    },
  };
};

// ==============================
// JSX
// ==============================
const StationPage: NextPage<PageProps> = ({ station, rankingList }) => {
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
        <title>気象台まとめ - アメダス図鑑</title>
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
};

export default StationPage;
