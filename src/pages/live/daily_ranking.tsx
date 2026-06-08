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
  RankingItem,
  RawRankingData,
} from "../../components/Ranking/types";
import { CategoryValue } from "../../utils/category";
import { getRainColor, getTempColor } from "../../utils/colorUtils";
import { fetchJmaDailyMaxRanking } from "../../utils/jma";
import { toStation } from "../../utils/masterUtils";
import { PrefKey, PrefMeta, PrefValue } from "../../utils/pref";
import { RankKey, RankMeta } from "../../utils/rank";
import { processRankingData } from "../../utils/rankingUtils";
import { RegionKey, RegionMeta } from "../../utils/region";
import { loadMaster } from "../../utils/ssgLoader";

type MetricType = "av_hitemp" | "av_lwtemp" | "sm_rain";

interface MetricEntry {
  value: number;
  time: string | null;
}

interface StationData {
  station_name: string;
  pref: PrefValue;
  category: CategoryValue;
  av_hitemp?: MetricEntry;
  av_lwtemp?: MetricEntry;
  sm_rain?: MetricEntry;
}

interface Props {
  stations: Record<string, StationData>;
  lastUpdate: string;
}

const DailyRankingPage: NextPage<Props> = ({ stations, lastUpdate }) => {
  const [metric, setMetric] = useState<MetricType>("av_hitemp");
  const [rankMeta, setRankMeta] = useState<RankMeta>(RankKey.top);
  const [selectedRegion, setSelectedRegion] = useState<RegionMeta>(
    RegionKey.kanto
  );
  const [selectedPref, setSelectedPref] = useState<PrefMeta>(PrefKey.tokyo);

  const config = useMemo(() => {
    switch (metric) {
      case "av_hitemp":
        return {
          title: "今日の最高気温ランキング",
          description:
            "今日これまでに観測された最高気温の全国ランキングです。気象庁から取得した最新の観測データに基づいています。",
          gradient: "bg-gradient-to-r from-red-600 to-orange-600",
          accentColor: "bg-orange-500",
          ringColor: "focus:ring-orange-500",
          hoverColor: "hover:text-orange-600",
          unit: "°C",
        };
      case "av_lwtemp":
        return {
          title: "今日の最低気温ランキング",
          description:
            "今日これまでに観測された最低気温の全国ランキングです。気象庁から取得した最新の観測データに基づいています。",
          gradient: "bg-gradient-to-r from-blue-600 to-cyan-600",
          accentColor: "bg-blue-500",
          ringColor: "focus:ring-blue-500",
          hoverColor: "hover:text-blue-600",
          unit: "°C",
        };
      case "sm_rain":
        return {
          title: "今日の降水量ランキング",
          description:
            "今日これまでに観測された降水量の全国ランキングです。気象庁から取得した最新の観測データに基づいています。",
          gradient: "bg-gradient-to-r from-indigo-600 to-blue-600",
          accentColor: "bg-indigo-500",
          ringColor: "focus:ring-indigo-500",
          hoverColor: "hover:text-indigo-600",
          unit: "mm",
        };
    }
  }, [metric]);

  const displayList: RankingData[] = useMemo(() => {
    // 1. Recordから現在のメトリックを持つ地点を抽出し、RawRankingData[] を作成
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

    // 2. 共通ロジックでランキング処理 (ソート、フィルタリング、順位付け)
    const processed = processRankingData(
      rawList,
      rankMeta,
      selectedRegion,
      selectedPref,
      100
    );

    // 3. 表示用にRich化
    return processed.map((s) => ({
      ...toStation(s),
      value: s.value,
      rank: s.rank,
      time: s.time,
    }));
  }, [metric, stations, rankMeta, selectedRegion, selectedPref]);

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
            <div className="flex justify-center mb-6">
              <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex gap-1">
                <button
                  onClick={() => setMetric("av_hitemp")}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                    metric === "av_hitemp"
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  最高気温
                </button>
                <button
                  onClick={() => setMetric("av_lwtemp")}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                    metric === "av_lwtemp"
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  最低気温
                </button>
                <button
                  onClick={() => setMetric("sm_rain")}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                    metric === "sm_rain"
                      ? "bg-indigo-500 text-white shadow-md"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  降水量
                </button>
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
                          metric === "sm_rain"
                            ? getRainColor(s.value)
                            : getTempColor(s.value)
                        }`}
                      >
                        {s.value !== null
                          ? `${s.value.toFixed(metric === "sm_rain" ? 0 : 1)}${
                              config.unit
                            }`
                          : "---"}
                      </div>
                      {s.time !== null && (
                        <div className="text-[10px] text-slate-500 font-medium mt-1">
                          記録: {s.time}
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
  try {
    const masterData = loadMaster();
    const result = await fetchJmaDailyMaxRanking(null);
    const lastUpdate = new Date().toLocaleString("ja-JP");

    const stations: Record<string, StationData> = {};

    const mergeData = (m: MetricType, items: RankingItem[]) => {
      items.forEach((item) => {
        const id = item.id;
        if (!id) return;

        if (!stations[id]) {
          const master = masterData[id];
          if (!master) return;
          stations[id] = {
            station_name: master.station_name,
            pref: master.pref,
            category: master.category,
          };
        }

        const entry: MetricEntry = {
          value: item.value,
          time: item.time ?? null,
        };

        if (m === "av_hitemp") stations[id].av_hitemp = entry;
        else if (m === "av_lwtemp") stations[id].av_lwtemp = entry;
        else if (m === "sm_rain") stations[id].sm_rain = entry;
      });
    };

    mergeData("av_hitemp", result.av_hitemp);
    mergeData("av_lwtemp", result.av_lwtemp);
    mergeData("sm_rain", result.sm_rain);

    return {
      props: {
        stations,
        lastUpdate,
      },
      revalidate: 1800,
    };
  } catch (error) {
    console.error("Failed to load daily-ranking data:", error);
    return { notFound: true };
  }
};

export default DailyRankingPage;
