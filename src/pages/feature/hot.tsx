// pages/feature/hot.tsx
import fs from "fs";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import path from "path";
import { PiThermometerHotFill } from "react-icons/pi";
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
  temp: (number | null)[];
  hitemp: (number | null)[];
  lwtemp: (number | null)[];
  rain: (number | null)[];
  sun: (number | null)[]; // Added
  snowing: (number | null)[]; // Added
  ratio: any[];
  記録: string | null;
  d1: string | null;
  d2: string | null;
  d3: string | null;
  d4: string | null;
  d5: string | null;
  概要: string | null; // Added
  気温: string | null; // Added
  降水: string | null; // Added
  その他: string | null; // Added
}

interface RankingStation {
  number: string;
  station_name: string;
  pref: string;
  city: string;
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
// Main
// ==============================
const selectedFiles = [
  "52606",
  "83137",
  "61286",
  "62078",
  "63518",
  "49142",
  "43056",
  "42302",
  "42366",
  "73306",
  "74381",
  "86141",
  "35426",
  "36066",
  "50456",
  "54181",
  "54711",
];

const rankingFiles = [
  {
    path: "data/ranking/hitemp_35/island/all.json",
    title: "年間猛暑日日数",
    topN: 20,
  },

  {
    path: "data/ranking/hitemp_30/island/all.json",
    title: "年間真夏日日数*",
    topN: 20,
  },
  {
    path: "data/ranking/lwtemp_25/island/all.json",
    title: "年間熱帯夜日数*",
    topN: 20,
  },
  {
    path: "data/ranking/av_hitemp/island/7.json",
    title: "7月平均最高気温",
    topN: 20,
  },
  {
    path: "data/ranking/av_hitemp/island/8.json",
    title: "8月平均最高気温",
    topN: 20,
  },
];

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const singleDir = path.join(process.cwd(), "data/single");

  const descPath = path.join(process.cwd(), "data/feature/hot.json");
  const descriptionData = fs.existsSync(descPath)
    ? JSON.parse(fs.readFileSync(descPath, "utf-8"))
    : {};

  const stationsRaw: Station[] = selectedFiles.map((num) => {
    const filePath = path.join(singleDir, `${num}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const ssgArray1 = getValuesArrayFromData(data, "all", "hitemp");
    const ssgArray2 = getValuesArrayFromData(data, "7", "hitemp");
    const ssgArray3 = getValuesArrayFromData(data, "8", "hitemp");
    const ssgArray = [ssgArray1, ssgArray2, ssgArray3];

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
      sun: getMonthly(data, "sm_sun"), // Added
      snowing: getMonthly(data, "sm_snowing"), // Added
      ratio: ssgArray,
      記録: descriptionData[data.station_name]?.記録 ?? null,
      d1: descriptionData[data.station_name]?.d1 ?? null,
      d2: descriptionData[data.station_name]?.d2 ?? null,
      d3: descriptionData[data.station_name]?.d3 ?? null,
      d4: descriptionData[data.station_name]?.d4 ?? null,
      d5: descriptionData[data.station_name]?.d5 ?? null,
      概要: descriptionData[data.station_name]?.概要 ?? null, // Added
      気温: descriptionData[data.station_name]?.気温 ?? null, // Added
      降水: descriptionData[data.station_name]?.降水 ?? null, // Added
      その他: descriptionData[data.station_name]?.その他 ?? null, // Added
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

  const stations = JSON.parse(JSON.stringify(stationsRaw));
  const rankingList = JSON.parse(JSON.stringify(rankingListRaw));

  return {
    props: {
      station: stations,
      rankingList,
    },
  };
};

const StationPage: NextPage<PageProps> = ({ station, rankingList }) => {
  const DATA_OPTIONS = [
    { value: "chart0", label: "気温割合(通年)" },
    { value: "chart1", label: "気温割合(7月)" },
    { value: "chart2", label: "気温割合(8月)" },
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
              <h1 className="text-3xl font-bold mb-2 flex gap-2">
                <PiThermometerHotFill className="w-8 h-8 text-red-500" />
                暑い地点まとめ
              </h1>
              <div className="mb-4">
                <div>
                  ・夏季に気温が上がりやすい地点をまとめました。主に猛暑日日数や真夏日日数、熱帯夜日数が多い地点です。
                </div>
                <div>
                  ・記録的な猛暑が観測された地点や、所属地方や緯度のわりに暑い地点もまとめてあります。
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
                <RankingPart rankingList={rankingList} />
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
