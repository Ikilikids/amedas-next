import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { GiJapan } from "react-icons/gi";
import CategoryLegend from "../../components/CategoryLegend";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import HeroSection from "../../components/HeroSection";
import {
  RankingData,
  RawRankingData,
} from "../../components/Ranking/types";
import { CategoryValue } from "../../utils/category";
import { getRainColor, getTempColor } from "../../utils/colorUtils";
import { toStation } from "../../utils/masterUtils";
import { PrefKey, PrefMeta } from "../../utils/pref";
import { RankKey, RankMeta } from "../../utils/rank";
import { processRankingData } from "../../utils/rankingUtils";
import { RegionKey, RegionMeta } from "../../utils/region";
import { loadMaster } from "../../utils/ssgLoader";
import { db } from "../../utils/firebaseAdmin";

type MetricType =
  | "max_hitemp"
  | "min_lwtemp"
  | "hitemp_40"
  | "hitemp_35"
  | "hitemp_30"
  | "hitemp_25"
  | "hitemp_0"
  | "lwtemp_25"
  | "lwtemp_0"
  | "rain_7d"
  | "rain_15d"
  | "sm_rain";

interface MetricEntry {
  value: number;
  time: string | null;
}

interface StationData {
  station_name: string;
  pref: string;
  category: CategoryValue;
  max_hitemp?: MetricEntry;
  min_lwtemp?: MetricEntry;
  hitemp_40?: MetricEntry;
  hitemp_35?: MetricEntry;
  hitemp_30?: MetricEntry;
  hitemp_25?: MetricEntry;
  hitemp_0?: MetricEntry;
  lwtemp_25?: MetricEntry;
  lwtemp_0?: MetricEntry;
  rain_7d?: MetricEntry;
  rain_15d?: MetricEntry;
  sm_rain?: MetricEntry;
}

interface Props {
  stations: Record<string, StationData>;
  lastUpdate: string;
}

const METRIC_CONFIG = {
  max_hitemp: {
    label: "最高気温",
    title: "通年最高気温ランキング",
    description: "今年これまでに観測された最高気温の全国ランキングです。",
    unit: "°C",
    gradient: "bg-gradient-to-r from-red-600 to-orange-600",
    accentColor: "bg-orange-500",
    ringColor: "focus:ring-orange-500",
    hoverColor: "hover:text-orange-600",
  },
  min_lwtemp: {
    label: "最低気温",
    title: "通年最低気温ランキング",
    description: "今年これまでに観測された最低気温の全国ランキングです。",
    unit: "°C",
    gradient: "bg-gradient-to-r from-blue-600 to-cyan-600",
    accentColor: "bg-blue-500",
    ringColor: "focus:ring-blue-500",
    hoverColor: "hover:text-blue-600",
  },
  hitemp_40: {
    label: "40℃以上",
    title: "40℃以上の日数ランキング",
    description: "今年これまでに最高気温40℃以上を観測した日数のランキングです。",
    unit: "日",
    gradient: "bg-gradient-to-r from-red-900 to-red-600",
    accentColor: "bg-red-800",
    ringColor: "focus:ring-red-800",
    hoverColor: "hover:text-red-900",
  },
  hitemp_35: {
    label: "猛暑日",
    title: "猛暑日日数ランキング",
    description: "今年これまでに観測された猛暑日（最高気温35℃以上）の日数ランキングです。",
    unit: "日",
    gradient: "bg-gradient-to-r from-red-700 to-red-500",
    accentColor: "bg-red-600",
    ringColor: "focus:ring-red-600",
    hoverColor: "hover:text-red-700",
  },
  hitemp_30: {
    label: "真夏日",
    title: "真夏日日数ランキング",
    description: "今年これまでに観測された真夏日（最高気温30℃以上）の日数ランキングです。",
    unit: "日",
    gradient: "bg-gradient-to-r from-orange-600 to-orange-400",
    accentColor: "bg-orange-500",
    ringColor: "focus:ring-orange-500",
    hoverColor: "hover:text-orange-600",
  },
  hitemp_25: {
    label: "夏日",
    title: "夏日日数ランキング",
    description: "今年これまでに観測された夏日（最高気温25℃以上）の日数ランキングです。",
    unit: "日",
    gradient: "bg-gradient-to-r from-orange-400 to-yellow-400",
    accentColor: "bg-orange-400",
    ringColor: "focus:ring-orange-400",
    hoverColor: "hover:text-orange-500",
  },
  hitemp_0: {
    label: "真冬日",
    title: "真冬日日数ランキング",
    description: "今年これまでに観測された真冬日（最高気温0℃未満）の日数ランキングです。",
    unit: "日",
    gradient: "bg-gradient-to-r from-blue-900 to-blue-600",
    accentColor: "bg-blue-800",
    ringColor: "focus:ring-blue-800",
    hoverColor: "hover:text-blue-900",
  },
  lwtemp_25: {
    label: "熱帯夜",
    title: "熱帯夜日数ランキング",
    description: "今年これまでに観測された熱帯夜（最低気温25℃以上）の日数ランキングです。",
    unit: "日",
    gradient: "bg-gradient-to-r from-purple-600 to-blue-600",
    accentColor: "bg-purple-500",
    ringColor: "focus:ring-purple-500",
    hoverColor: "hover:text-purple-600",
  },
  lwtemp_0: {
    label: "冬日",
    title: "冬日日数ランキング",
    description: "今年これまでに観測された冬日（最低気温0℃未満）の日数ランキングです。",
    unit: "日",
    gradient: "bg-gradient-to-r from-cyan-600 to-blue-400",
    accentColor: "bg-cyan-500",
    ringColor: "focus:ring-cyan-500",
    hoverColor: "hover:text-cyan-600",
  },
  rain_7d: {
    label: "7日降水",
    title: "7日間降水量ランキング",
    description: "最近7日間の合計降水量の全国ランキングです。",
    unit: "mm",
    gradient: "bg-gradient-to-r from-indigo-600 to-blue-600",
    accentColor: "bg-indigo-500",
    ringColor: "focus:ring-indigo-500",
    hoverColor: "hover:text-indigo-600",
  },
  rain_15d: {
    label: "15日降水",
    title: "15日間降水量ランキング",
    description: "最近15日間の合計降水量の全国ランキングです。",
    unit: "mm",
    gradient: "bg-gradient-to-r from-indigo-700 to-blue-700",
    accentColor: "bg-indigo-600",
    ringColor: "focus:ring-indigo-600",
    hoverColor: "hover:text-indigo-700",
  },
  sm_rain: {
    label: "累計降水",
    title: "年間降水量ランキング",
    description: "今年これまでに観測された累計降水量の全国ランキングです。",
    unit: "mm",
    gradient: "bg-gradient-to-r from-blue-700 to-slate-700",
    accentColor: "bg-blue-800",
    ringColor: "focus:ring-blue-800",
    hoverColor: "hover:text-blue-900",
  },
};

const RecentRankingPage: NextPage<Props> = ({ stations, lastUpdate }) => {
  const [metric, setMetric] = useState<MetricType>("max_hitemp");
  const [rankMeta, setRankMeta] = useState<RankMeta>(RankKey.top);
  const [selectedRegion, setSelectedRegion] = useState<RegionMeta>(
    RegionKey.kanto
  );
  const [selectedPref, setSelectedPref] = useState<PrefMeta>(PrefKey.tokyo);

  const config = useMemo(() => METRIC_CONFIG[metric], [metric]);

  const displayList: RankingData[] = useMemo(() => {
    const rawList: RawRankingData[] = Object.entries(stations)
      .filter(([, s]) => s[metric] !== undefined)
      .map(([id, s]) => {
        const mData = s[metric]!;
        return {
          id,
          station_name: s.station_name,
          pref: s.pref,
          category: s.category,
          value: mData.value,
          time: mData.time,
        };
      });

    const processed = processRankingData(
      rawList,
      rankMeta,
      selectedRegion,
      selectedPref,
      100
    );

    return processed.map((s) => ({
      ...toStation(s),
      value: s.value,
      rank: s.rank,
      time: s.time,
    }));
  }, [metric, stations, rankMeta, selectedRegion, selectedPref]);

  const isRainMetric = metric.includes("rain");
  const isCountMetric = metric.includes("hitemp_") || metric.includes("lwtemp_");

  return (
    <>
      <Head>
        <title>{config.title} - アメダス図鑑</title>
      </Head>

      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
        <Header />

        <main className="flex-1 pb-16">
          <HeroSection
            title={config.title}
            description={config.description}
            Icon={<GiJapan />}
            gradient={config.gradient}
            lastUpdateLabel="データ更新"
            lastUpdateValue={lastUpdate}
          />

          <div className="max-w-[1200px] mx-auto px-4 mt-4">
            {/* メトリック選択タブ */}
            <div className="flex flex-col items-center mb-6 gap-3">
              <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex flex-wrap justify-center gap-1">
                {(Object.keys(METRIC_CONFIG) as MetricType[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMetric(m)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      metric === m
                        ? `${METRIC_CONFIG[m].accentColor} text-white shadow-md`
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {METRIC_CONFIG[m].label}
                  </button>
                ))}
              </div>
            </div>

            {/* しぼりこみナビゲーション */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-10 flex flex-col gap-4 border border-slate-100">
              <div className="flex flex-wrap gap-2 justify-center">
                {Object.values(RankKey).map((rk) => (
                  <button
                    key={rk.key}
                    onClick={() => setRankMeta(rk)}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                      rankMeta.key === rk.key
                        ? `${config.accentColor} text-white shadow-md scale-105`
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {rk.rankingLabel}
                  </button>
                ))}
              </div>

              {rankMeta.key === "region" && (
                <div className="flex flex-wrap gap-2 justify-center border-t border-slate-100 pt-4">
                  {Object.values(RegionKey).map((r) => (
                    <button
                      key={r.label}
                      onClick={() => setSelectedRegion(r)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedRegion.label === r.label
                          ? "text-white"
                          : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                      }`}
                      style={
                        selectedRegion.label === r.label
                          ? {
                              backgroundColor: r.colorStrong,
                            }
                          : {
                              backgroundColor: r.colorBase.replace(
                                "0.7",
                                "0.15"
                              ),
                            }
                      }
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              )}

              {rankMeta.key === "pre" && (
                <div className="flex justify-center border-t border-slate-100 pt-4">
                  <select
                    value={selectedPref.code}
                    onChange={(e) => {
                      const found = Object.values(PrefKey).find(
                        (p) => p.code === e.target.value
                      );
                      if (found) setSelectedPref(found);
                    }}
                    className={`px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 ${config.ringColor}`}
                  >
                    {Object.values(PrefKey).map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <CategoryLegend />

            {/* ランキングリスト */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {displayList.map((s) => (
                <Link
                  key={s.id}
                  href={`/station/${s.id}`}
                  className="block transition-transform hover:scale-105 group"
                >
                  <div
                    className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-slate-300 relative overflow-hidden h-full flex flex-col"
                    style={{
                      backgroundColor: s.pref?.region?.colorBase?.replace(
                        "0.7",
                        "0.1"
                      ),
                      borderColor: s.pref?.region?.colorBase?.replace(
                        "0.7",
                        "0.3"
                      ),
                    }}
                  >
                    <div
                      className="absolute top-0 right-0 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg"
                      style={{
                        backgroundColor: s.pref?.region?.colorStrong,
                        color: "white",
                      }}
                    >
                      {s.rank}位
                    </div>
                    <div className="flex items-center gap-1 mb-2 pr-6 overflow-hidden">
                      {s.category?.value !== 4 && (
                        <span
                          className="transform group-hover:scale-110 transition-transform shrink-0"
                          style={{
                            color: s.category?.colorFull,
                          }}
                        >
                          {s.category?.icon}
                        </span>
                      )}
                      <span className="text-sm font-bold text-slate-800 truncate">
                        {s.station_name}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono shrink-0">
                        #{s.id}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-end">
                      <div
                        className={`text-2xl font-mono font-bold ${
                          isRainMetric
                            ? getRainColor(s.value)
                            : getTempColor(s.value)
                        }`}
                      >
                        {s.value !== null
                          ? `${s.value.toFixed(isRainMetric || isCountMetric ? 0 : 1)}${
                              config.unit
                            }`
                          : "---"}
                      </div>
                      {s.time !== null && (
                        <div className="text-[10px] text-slate-500 font-medium mt-1">
                          観測日: {s.time}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {displayList.length === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-400 font-medium">
                  該当するデータが見つかりませんでした。
                </p>
              </div>
            )}
          </div>
        </main>

        <Footer />

        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`p-4 bg-white shadow-2xl rounded-full text-slate-400 border border-slate-100 transition-colors ${config.hoverColor}`}
          >
            <FaChevronDown className="transform rotate-180" />
          </button>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  console.log("[ISR] Generating RecentRankingPage at", new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }));
  try {
    const masterData = loadMaster();
    const rankingsSnapshot = await db.collection("rankings").get();
    const lastUpdate = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

    const stations: Record<string, StationData> = {};

    rankingsSnapshot.forEach((doc) => {
      const metricId = doc.id as MetricType;
      // 今回定義したMetricTypeに含まれるものだけ処理
      if (!METRIC_CONFIG[metricId]) return;

      const data = doc.data() as { list: Array<{ id: string; val: number; d?: string }> };
      
      data.list.forEach((item) => {
        const id = item.id;
        if (!stations[id]) {
          const master = masterData[id];
          if (!master) return;
          stations[id] = {
            station_name: master.station_name,
            pref: master.pref,
            category: master.category,
          };
        }
        
        stations[id][metricId] = {
          value: item.val,
          time: item.d || null,
        };
      });
    });

    console.log(`[ISR] RecentRankingPage generated at ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}. Metrics processed: ${Object.keys(stations).length} stations.`);
    return {
      props: {
        stations,
        lastUpdate,
      },
      revalidate: 3600, // 1時間ごとに再生成
    };
  } catch (error) {
    console.error(`[ISR Error] Failed to load recent-ranking data at ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}:`, error);
    return { notFound: true };
  }
};

export default RecentRankingPage;
