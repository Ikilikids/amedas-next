import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
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
import { PrefKey, PrefMeta } from "../../utils/pref";
import { RankKey, RankMeta } from "../../utils/rank";
import { processRankingData } from "../../utils/rankingUtils";
import { RegionKey, RegionMeta } from "../../utils/region";
import { loadMaster } from "../../utils/ssgLoader";

import { colorWithAlpha } from "../../components/LayeredPieChart/chartUtils";
import { MetricKey, MetricValue } from "../../utils/metric";

interface MetricEntry {
  value: number;
  time: string | null;
}

interface StationData {
  station_name: string;
  pref: string;
  category: CategoryValue;
  [key: string]: any;
}

interface Props {
  stations: Record<string, StationData>;
  lastUpdate: string;
}

const DailyRankingPage: NextPage<Props> = ({ stations, lastUpdate }) => {
  const [metric, setMetric] = useState<MetricValue>("av_hitemp");
  const [rankMeta, setRankMeta] = useState<RankMeta>(RankKey.top);
  const [selectedRegion, setSelectedRegion] = useState<RegionMeta>(
    RegionKey.kanto
  );
  const [selectedPref, setSelectedPref] = useState<PrefMeta>(PrefKey.tokyo);

  const config = useMemo(() => MetricKey[metric], [metric]);
  const detail = useMemo(() => config.detail!, [config]);

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
        <title>{`今日の${config.label}ランキング - アメダス図鑑`}</title>
      </Head>

      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
        <Header />

        <main className="flex-1 pb-16">
          <HeroSection
            title={`今日の${config.label}ランキング`}
            description={`今日これまでに観測された${config.label}の全国ランキングです。気象庁から取得した最新の観測データに基づいています。`}
            Icon={config.highIcon}
            gradient={detail.gradient}
            lastUpdateLabel="データ更新"
            lastUpdateValue={lastUpdate}
          />

          <div className="max-w-[1200px] mx-auto px-4 mt-4">
            {/* メトリック選択タブ */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex gap-1">
                {(["av_hitemp", "av_lwtemp", "sm_rain"] as MetricValue[]).map(
                  (m) => (
                    <button
                      key={m}
                      onClick={() => setMetric(m)}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                        metric === m
                          ? `text-white shadow-md`
                          : "text-slate-500 hover:bg-slate-50"
                      }`}
                      style={
                        metric === m
                          ? { backgroundColor: MetricKey[m].color }
                          : {}
                      }
                    >
                      {MetricKey[m].label}
                    </button>
                  )
                )}
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
                        ? `text-white shadow-md scale-105`
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                    style={
                      rankMeta.key === rk.key
                        ? { backgroundColor: config.color }
                        : {}
                    }
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
                              backgroundColor: colorWithAlpha(
                                r.colorBase,
                                0.15
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
                    className="px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2"
                    style={{ outlineColor: config.color } as any}
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
                      backgroundColor: colorWithAlpha(
                        s.pref?.region?.colorBase,
                        0.1
                      ),
                      borderColor: colorWithAlpha(
                        s.pref?.region?.colorBase,
                        0.3
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
  const overallStart = Date.now();
  console.log("[ISR] DailyRankingPage: getStaticProps execution started");

  try {
    // 1. マスターデータのロード (キャッシュチェックは内部で行う)
    const masterData = loadMaster();

    // 2. 気象庁データのフェッチ計測
    const jmaStart = Date.now();
    console.log("[ISR] fetchJmaDailyMaxRanking: Starting network fetch...");
    const result = await fetchJmaDailyMaxRanking(null);
    console.log(`[ISR] fetchJmaDailyMaxRanking: Completed in ${Date.now() - jmaStart}ms`);

    const lastUpdate = new Date().toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
    });

    const mergeStart = Date.now();
    const stations: Record<string, StationData> = {};

    const mergeData = (m: MetricValue, items: RankingItem[]) => {
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

        stations[id][m] = entry;
      });
    };

    mergeData("av_hitemp", result.av_hitemp);
    mergeData("av_lwtemp", result.av_lwtemp);
    mergeData("sm_rain", result.sm_rain);
    console.log(`[ISR] Data Merging: Completed for ${Object.keys(stations).length} stations in ${Date.now() - mergeStart}ms`);

    console.log(`[ISR] DailyRankingPage: Total getStaticProps execution took ${Date.now() - overallStart}ms`);

    return {
      props: {
        stations,
        lastUpdate,
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error(`[ISR Error] DailyRankingPage (Failed after ${Date.now() - overallStart}ms):`, error);
    return { notFound: true };
  }
};

export default DailyRankingPage;
