import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { FaSyncAlt, FaTemperatureHigh } from "react-icons/fa";
import Footer from "../components/Footer";
import Header from "../components/Header";
import fs from "fs";
import path from "path";

interface StationMax {
  id: string;
  name: string;
  maxTemp: number | null;
  rank: number;
}

interface Props {
  stations: StationMax[];
  lastUpdate: string;
}

const DailyMaxPage: NextPage<Props> = ({ stations, lastUpdate }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>今日の最高気温ランキング - AMeDAS Next</title>
      </Head>
      <Header />
      <main className="flex-1 p-4">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <FaTemperatureHigh className="text-orange-500" />
                今日の最高気温ランキング
              </h1>
              <p className="text-gray-600 mt-1">
                今日これまでに観測された最高気温の全国ランキングです
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
              <FaSyncAlt className="animate-spin-slow text-blue-400" />
              <span>最新観測時刻: {lastUpdate}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {stations.map((s) => (
              <Link
                key={s.id}
                href={`/station/${s.id}`}
                className="block transition-transform hover:scale-105"
              >
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-orange-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                    {s.rank}位
                  </div>
                  <div className="text-xs text-gray-400 mb-1">{s.id}</div>
                  <div className="font-bold text-gray-800 truncate mb-2 pr-6">
                    {s.name}
                  </div>
                  <div
                    className={`text-2xl font-mono font-bold ${
                      s.maxTemp !== null && s.maxTemp >= 35
                        ? "text-red-600"
                        : s.maxTemp !== null && s.maxTemp >= 30
                        ? "text-orange-500"
                        : "text-blue-600"
                    }`}
                  >
                    {s.maxTemp !== null ? `${s.maxTemp.toFixed(1)}°C` : "---"}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition"
            >
              トップページに戻る
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    // 1. マスターデータを読み込む
    const masterPath = path.join(process.cwd(), "public/stations.json");
    const masterData = JSON.parse(fs.readFileSync(masterPath, "utf8"));

    // 2. 保存したランキングJSONファイルを読み込む (SSG)
    const filePath = path.join(process.cwd(), "data/ranking/daily_max.json");
    
    if (!fs.existsSync(filePath)) {
      return {
        props: {
          stations: [],
          lastUpdate: "データなし",
        },
      };
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const { lastUpdate, data } = JSON.parse(fileContent);

    // 3. データの整形 (マスターデータから名称を補完、インデックスから順位を付与)
    const stations: StationMax[] = data.map((item: any, index: number) => ({
      id: item.id,
      name: masterData[item.id]?.name || "不明",
      maxTemp: item.value,
      rank: index + 1
    }));

    return {
      props: {
        stations,
        lastUpdate: lastUpdate,
      },
      revalidate: 600, // 10分ごとに自動更新 (ISR)
    };
  } catch (error) {
    console.error("Failed to load daily max data:", error);
    return {
      props: {
        stations: [],
        lastUpdate: "取得失敗",
      },
    };
  }
};

export default DailyMaxPage;
