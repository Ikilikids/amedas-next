// pages/prefecture.tsx
import fs from "fs";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import path from "path";
import { FaChevronDown } from "react-icons/fa";
import { GiJapan } from "react-icons/gi";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { RawStationData } from "../types/raw";
import { CATEGORY_KEYS } from "../utils/category";
import { toStation } from "../utils/masterUtils";
import { PrefKey } from "../utils/pref";
import { RegionKey } from "../utils/region";

// ==============================
// Types
// ==============================

interface PageProps {
  stations: RawStationData[];
}

// ==============================
// getStaticProps
// ==============================
export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const filePath = path.join(process.cwd(), "public", "stations.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const data: Record<string, RawStationData> = JSON.parse(jsonData);

  const stationList: RawStationData[] = Object.values(data).map(
    (s: RawStationData) => ({
      id: s.id,
      category: s.category,
      pref: s.pref,
      station_name: s.station_name,
    })
  );

  return {
    props: {
      stations: stationList,
    },
  };
};

// ==============================
//  ページコンポーネント
// ==============================
const PrefecturePage: NextPage<PageProps> = ({ stations }) => {
  const stationItem = stations.map((s) => toStation(s));
  // 地域ごとにグループ化
  const regions = Object.values(RegionKey);

  return (
    <>
      <Head>
        <title>都道府県から探す - アメダス図鑑</title>
        <meta
          name="description"
          content="都道府県別にアメダス観測所を一覧表示。各観測所の雨温図、降水量、猛暑日日数などの気候データを月別に確認できます。"
        />
      </Head>

      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Header />

        <main className="flex-1 pb-12">
          {/* ヒーローセクション */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white pb-12 pt-6 px-4 shadow-inner">
            <div className="max-w-[1200px] mx-auto">
              <h1 className="text-4xl font-extrabold flex items-center gap-3 mb-4 drop-shadow-md">
                <GiJapan className="w-12 h-12" />
                都道府県から探す
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl leading-relaxed">
                全国のアメダス観測所を地域別に整理しました。
                気象台や特別地域気象観測所など、重要度の高い地点を視覚的に探すことができます。
              </p>
            </div>
          </div>

          <div className="max-w-[1200px] mx-auto px-4 -mt-8">
            {/* クイックナビゲーション */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8 flex flex-wrap gap-2 justify-center border border-slate-100">
              {regions.map((region) => (
                <a
                  key={`nav-${region.label}`}
                  href={`#region-${region.label}`}
                  className="px-4 py-2 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-sm border border-slate-200"
                  style={{
                    backgroundColor: region.colorBase,
                    color: "#1e293b",
                  }}
                >
                  {region.label}
                </a>
              ))}
            </div>

            {/* 凡例説明 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              {Object.values(CATEGORY_KEYS).map((cat) => (
                <div
                  key={cat.value}
                  className="bg-white p-4 rounded-lg shadow-sm border-l-4 flex items-start gap-3"
                  style={{ borderColor: cat.colorFull }}
                >
                  <div
                    className="p-2 rounded"
                    style={{
                      backgroundColor: cat.colorBase,
                      color: cat.colorFull,
                    }}
                  >
                    {cat.icon}
                  </div>

                  <div>
                    <div className="font-bold text-slate-800">{cat.label}</div>
                    <div className="text-xs text-slate-500">
                      {cat.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 地域別セクション */}
            <div className="flex flex-col gap-16">
              {regions.map((region) => {
                const prefsInRegion = Object.values(PrefKey).filter(
                  (p) => p.region === region
                );

                return (
                  <section
                    key={`region-${region.label}`}
                    id={`region-${region.label}`}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <h2
                        className="text-2xl font-black px-6 py-2 rounded-r-full shadow-sm text-slate-800"
                        style={{ backgroundColor: region.colorBase }}
                      >
                        {region.label}
                      </h2>
                      <div
                        className="flex-1 h-px"
                        style={{ backgroundColor: region.colorStrong }}
                      ></div>
                    </div>

                    <div className="flex flex-col gap-10">
                      {prefsInRegion.map((pref) => {
                        const stationsInPref = stationItem
                          .filter((s) => s.pref.code === pref.code)
                          .sort(
                            (a, b) =>
                              a.category.value - b.category.value ||
                              a.id.localeCompare(b.id)
                          );

                        if (stationsInPref.length === 0) return null;

                        return (
                          <div
                            key={`pref-${pref.code}`}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                          >
                            <div
                              className="px-5 py-3 flex items-center justify-between border-b border-slate-100"
                              style={{
                                backgroundColor: region.colorBase.replace(
                                  "0.7",
                                  "0.1"
                                ),
                                borderColor: region.colorBase.replace(
                                  "0.7",
                                  "0.3"
                                ),
                              }}
                            >
                              <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                                {pref.label}
                                <span className="text-sm font-normal text-slate-400">
                                  ({stationsInPref.length}地点)
                                </span>
                              </h3>
                            </div>

                            <div className="p-5">
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
                                {stationsInPref.map((s) => {
                                  const baseClasses =
                                    "group border rounded-lg p-3 transition-all duration-200 flex flex-col items-center justify-center gap-1.5 min-h-[70px] text-center shadow-sm hover:shadow-md hover:-translate-y-0.5";

                                  return (
                                    <Link
                                      key={`station-${s.id}`}
                                      href={`/station/${s.id}`}
                                      className={`${baseClasses}`}
                                      style={{
                                        backgroundColor: s.category.colorBase,
                                        borderColor: s.category.colorBorder,
                                      }}
                                    >
                                      <div className="flex items-center gap-1.5">
                                        {s.category.value !== 4 && (
                                          <span
                                            className="transform group-hover:scale-110 transition-transform"
                                            style={{
                                              color: s.category.colorFull,
                                            }}
                                          >
                                            {s.category.icon}
                                          </span>
                                        )}
                                        <span
                                          className={`text-sm font-bold`}
                                          style={{
                                            color: s.category.colorFull,
                                          }}
                                        >
                                          {s.station_name}
                                        </span>
                                      </div>
                                      <span className="text-[10px] text-slate-400 font-mono tracking-tighter">
                                        #{s.id}
                                      </span>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </main>

        <Footer />

        {/* トップへ戻るボタン的なフローティングナビ（オプション） */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="p-4 bg-white shadow-2xl rounded-full text-slate-400 hover:text-blue-600 border border-slate-100 transition-colors"
          >
            <FaChevronDown className="transform rotate-180" />
          </button>
        </div>
      </div>
    </>
  );
};

export default PrefecturePage;
