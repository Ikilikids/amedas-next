import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { FaSyncAlt, FaTemperatureHigh } from "react-icons/fa";
import Footer from "../components/Footer";
import Header from "../components/Header";

interface StationRealtime {
  id: string;
  name: string;
  temp: number | null;
}

interface Props {
  stations: StationRealtime[];
  lastUpdate: string;
}

const RealtimePage: NextPage<Props> = ({ stations, lastUpdate }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>リアルタイム気温データ - AMeDAS Next</title>
      </Head>
      <Header />
      <main className="flex-1 p-4">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <FaTemperatureHigh className="text-red-500" />
                現在の気温 (リアルタイム)
              </h1>
              <p className="text-gray-600 mt-1">
                気象庁の最新JSONデータから取得しています
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
              <FaSyncAlt className="animate-spin-slow text-blue-400" />
              <span>最新観測時刻: {lastUpdate}</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-blue-800 text-sm">
            このページは <strong>ISR (Incremental Static Regeneration)</strong>{" "}
            で動作しています。
            10分ごとに気象庁のデータを自動で取得し、静的ページを再生成します。
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {stations.map((s) => (
              <Link
                key={s.id}
                href={`/station/${s.id}`}
                className="block transition-transform hover:scale-105"
              >
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300">
                  <div className="text-xs text-gray-500 mb-1">{s.id}</div>
                  <div className="font-bold text-gray-800 truncate mb-2">
                    {s.name}
                  </div>
                  <div
                    className={`text-2xl font-mono font-bold ${
                      s.temp !== null && s.temp > 30
                        ? "text-red-500"
                        : "text-blue-600"
                    }`}
                  >
                    {s.temp !== null ? `${s.temp.toFixed(1)}°C` : "---"}
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
    // 1. 最新時刻の取得
    const timeRes = await fetch(
      "https://www.jma.go.jp/bosai/amedas/data/latest_time.txt"
    );
    const isoTime = await timeRes.text();
    const formattedTime = isoTime.replace(/[-T:]/g, "").substring(0, 14); // YYYYMMDDHHMMSS形式
    const displayTime = new Date(isoTime).toLocaleString("ja-JP");

    // 2. 全国データの取得
    const dataRes = await fetch(
      `https://www.jma.go.jp/bosai/amedas/data/map/${formattedTime}.json`
    );
    const allData = await dataRes.json();

    // 3. 地点名称データの読み込み (amedastable.json)
    const tableRes = await fetch(
      "https://www.jma.go.jp/bosai/amedas/const/amedastable.json"
    );
    const amedasTable = await tableRes.json();

    // 4. 主要な地点（県庁所在地など）のみピックアップして表示用データを整形
    // 今回はデモとして最初の50地点を表示
    const selectedIds = Object.keys(allData);
    const stations: StationRealtime[] = selectedIds.map((id) => ({
      id,
      name: amedasTable[id]?.kjName || "不明",
      temp: allData[id]?.temp?.[0] ?? null,
    }));

    return {
      props: {
        stations,
        lastUpdate: displayTime,
      },
      revalidate: 600, // 10分
    };
  } catch (error) {
    console.error("Failed to fetch realtime data:", error);
    return {
      props: {
        stations: [],
        lastUpdate: "取得失敗",
      },
      revalidate: 60, // 失敗時は早めにリトライ
    };
  }
};

export default RealtimePage;
