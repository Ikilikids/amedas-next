import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import CategoryLegend from "../../components/CategoryLegend";
import Layout from "../../components/Layout";
import PageLayout from "../../components/PageLayout";
import Sidebar from "../../components/Sidebar";
import Breadcrumb from "../../components/Breadcrumb";
import { RankingItem, RawRankingData } from "../../components/Ranking/types";
import { getMetricColor } from "../../utils/colorUtils";
import { toStation } from "../../utils/masterUtils";
import { PrefKey } from "../../setting/pref";
import { RegionKey } from "../../setting/region";
import { loadMaster } from "../../utils/ssgLoader";

import { TbTemperatureSun } from "react-icons/tb";
import { colorWithAlpha } from "../../components/LayeredPieChart/chartUtils";
import { RawStationData } from "../../types/raw";
import { StationId } from "../../types/union";
import { MetricKey } from "../../setting/metric";

interface Props {
  masterData: Record<StationId, RawStationData>;
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
  let minTemp = Infinity;
  let maxTemp = -Infinity;

  if (stations && stations.length > 0) {
    stations.forEach((s) => {
      tempMap[s.id!] = s.value;
      if (typeof s.value === "number") {
        if (s.value < minTemp) minTemp = s.value;
        if (s.value > maxTemp) maxTemp = s.value;
      }
    });
  }

  // 有効な値がない場合のフォールバック
  if (minTemp === Infinity) minTemp = 0;
  if (maxTemp === -Infinity) maxTemp = 0;

  return (
    <>
      <Head>
        <title>{`現在の気温 (リアルタイム) - アメダス図鑑`}</title>
        <meta
          name="description"
          content="全国約1,300地点のアメダス観測データから、現在のリアルタイムな気温状況を10分ごとに自動取得して表示します。日本各地の今の天気を視覚的に把握できます。"
        />
        <link rel="canonical" href="https://amedas-zukan.jp/live/realtime" />
      </Head>
      <Layout>
        <main className="max-w-[1280px] mx-auto p-4  my-4 w-full">
          {/* パンくずリスト */}
          <Breadcrumb
            items={[
              { label: "リアルタイム気温" },
            ]}
          />

          <PageLayout sidebar={<Sidebar />}>
            {/* 左メインエリア */}
            <div className="space-y-6">
              {/* ページヘッダーカード */}
              <div
                className="rounded-3xl p-6  text-white shadow-lg relative overflow-hidden"
                style={{
                  background:
                    config.detail?.gradient ||
                    "linear-gradient(to right, #ea580c, #d97706)",
                }}
              >
                <div className="relative z-10 flex flex-col    gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase mb-3">
                      <span>Realtime Weather</span>
                    </div>
                    <h1 className="text-2xl  font-black tracking-tight mb-2 flex items-center gap-3">
                      <TbTemperatureSun />
                      <span>現在の気温 (リアルタイム)</span>
                    </h1>
                    <p className="text-white/90 text-xs  leading-relaxed max-w-xl">
                      気象庁の最新アメダス速報値から取得した全国の気温状況です。10分ごとに自動更新されます。
                    </p>
                  </div>
                  <div className="text-xs font-bold bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 self-start  shrink-0">
                    最新観測: {displayLastUpdate}
                  </div>
                </div>
              </div>

              {/* クイックナビゲーション */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-wrap gap-2 justify-center ">
                {regions.map((region) => (
                  <a
                    key={`nav-${region.label}`}
                    href={`#region-${region.label}`}
                    className="px-4 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm border border-slate-200"
                    style={{
                      backgroundColor: region.colorBase,
                      color: "#1e293b",
                    }}
                  >
                    {region.label}
                  </a>
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
                              <div className="grid grid-cols-2     gap-3">
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
                                        className={`text-xl font-mono font-bold ${getMetricColor(
                                          temp,
                                          minTemp,
                                          maxTemp,
                                          true
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
        </PageLayout>
        </main>

        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`p-4 bg-white shadow-2xl rounded-full text-slate-400 border border-slate-100 transition-colors hover:text-slate-600`}
          >
            <FaChevronDown className="transform rotate-180" />
          </button>
        </div>
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const masterData: Record<StationId, RawStationData> = loadMaster();
    const data: Record<StationId, RawStationData> = Object.fromEntries(
      Object.entries(masterData).map(
        ([id, { lon, lat, similar, height, city, official_name, ...rest }]) => [
          id,
          rest,
        ]
      )
    );

    return {
      props: {
        masterData: data,
      },
    };
  } catch (error) {
    console.error("[SSG Error] RealtimePage Shell generation failed:", error);
    return { notFound: true };
  }
};

export default RealtimePage;
