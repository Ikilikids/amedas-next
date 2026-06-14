import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import CategoryLegend from "../../components/CategoryLegend";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import HeroSection from "../../components/HeroSection";
import { RankingItem, RawRankingData } from "../../components/Ranking/types";
import { getTempColor } from "../../utils/colorUtils";
import { toStation } from "../../utils/masterUtils";
import { PrefKey } from "../../utils/pref";
import { RegionKey } from "../../utils/region";
import { loadMaster } from "../../utils/ssgLoader";

import { TbTemperatureSun } from "react-icons/tb";
import { colorWithAlpha } from "../../components/LayeredPieChart/chartUtils";
import { MetricKey } from "../../utils/metric";
import { RawStationData } from "../../types/raw";

interface Props {
  masterData: Record<string, RawStationData>;
}

const RealtimePage: NextPage<Props> = ({ masterData }) => {
  const regions = Object.values(RegionKey);
  const config = MetricKey.av_avtemp;

  const [liveData, setLiveData] = useState<{
    stations: RankingItem[];
    lastUpdate: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/live/realtime")
      .then((res) => res.json())
      .then(setLiveData)
      .catch(console.error);
  }, []);

  // APIデータとマスターデータを合体
  const stations: RawRankingData[] = useMemo(() => {
    if (!liveData) return [];
    return liveData.stations
      .filter((s) => s.id && masterData[s.id])
      .map((s) => {
        const master = masterData[s.id!];
        return {
          ...master,
          ...s,
        };
      });
  }, [liveData, masterData]);

  const displayLastUpdate = useMemo(() => {
    if (!liveData) return "読み込み中...";
    return liveData.lastUpdate;
  }, [liveData]);

  // 都道府県ごとの気温マップを作成
  const tempMap: Record<string, number | null> = {};
  if (stations && stations.length > 0) {
    stations.forEach((s) => {
      tempMap[s.id!] = s.value;
    });
  }

  return (
    <>
      <Head>
        <title>{`現在の気温 (リアルタイム) - アメダス図鑑`}</title>
      </Head>

      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
        <Header />

        <main className="flex-1 pb-16">
          <HeroSection
            title="現在の気温 (リアルタイム)"
            description="気象庁の最新データから取得した全国の気温状況です。10分ごとに自動更新されます。"
            Icon={<TbTemperatureSun />}
            gradient={
              config.detail?.gradient ||
              "bg-gradient-to-r from-orange-600 to-amber-600"
            }
            lastUpdateLabel="最新観測"
            lastUpdateValue={displayLastUpdate}
          />

          <div className="max-w-[1200px] mx-auto px-4 mt-4">
            {/* クイックナビゲーション */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-10 flex flex-wrap gap-2 justify-center border border-slate-100">
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

            <CategoryLegend />

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
                        const stationsInPref = stations
                          .filter((s) => s.pref === pref.code)
                          .map((s) => toStation(s))
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
                                backgroundColor: colorWithAlpha(
                                  region.colorBase,
                                  0.1
                                ),
                                borderColor: colorWithAlpha(
                                  region.colorBase,
                                  0.3
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
                                  const temp = tempMap[s.id];
                                  const baseClasses =
                                    "group border rounded-lg p-3 transition-all duration-200 flex flex-col items-center justify-center gap-1 min-h-[85px] text-center shadow-sm hover:shadow-md hover:-translate-y-0.5";

                                  return (
                                    <Link
                                      key={`station-${s.id}`}
                                      href={`/station/${s.id}`}
                                      className={`${baseClasses}`}
                                    >
                                      <div className="flex items-center gap-1">
                                        {s.category.value !== 4 && (
                                          <span
                                            className="transform group-hover:scale-110 transition-transform"
                                            style={{
                                              color: s.category.colorFull,
                                            }}
                                          >
                                            {s.category?.icon}
                                          </span>
                                        )}
                                        <span
                                          className={`text-sm font-bold truncate`}
                                        >
                                          {s.station_name}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-mono tracking-tighter">
                                          #{s.id}
                                        </span>
                                      </div>
                                      <div
                                        className={`text-xl font-mono font-bold ${getTempColor(
                                          temp
                                        )}`}
                                      >
                                        {typeof temp === "number" ? (
                                          <>
                                            {temp.toFixed(1)}
                                            <span className="text-sm ml-0.5">
                                              ℃
                                            </span>
                                          </>
                                        ) : (
                                          "---"
                                        )}
                                      </div>
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

        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`p-4 bg-white shadow-2xl rounded-full text-slate-400 border border-slate-100 transition-colors hover:text-slate-600`}
          >
            <FaChevronDown className="transform rotate-180" />
          </button>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const masterData = loadMaster();

    return {
      props: {
        masterData,
      },
    };
  } catch (error) {
    console.error("[SSG Error] RealtimePage Shell generation failed:", error);
    return { notFound: true };
  }
};

export default RealtimePage;
