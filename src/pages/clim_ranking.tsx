import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { IoIosTrophy } from "react-icons/io";
import CategoryLegend from "../components/CategoryLegend";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import { colorWithAlpha } from "../components/LayeredPieChart/chartUtils";
import MetricPopup from "../components/Ranking/MetricPopup";
import { RankingData, RawRankingData } from "../components/Ranking/types";
import CustomSelect from "../components/UI/CustomSelect";
import { RawStationData } from "../types/raw";
import { StationId } from "../types/union";
import { MonthMap, getMetricColor } from "../utils/colorUtils";
import { toStation } from "../utils/masterUtils";
import { MetricKey, MetricMeta } from "../utils/metric";
import { PrefKey, PrefMeta } from "../utils/pref";
import { RankKey, RankMeta } from "../utils/rank";
import { processRankingData } from "../utils/rankingUtils";
import { RegionKey, RegionMeta } from "../utils/region";
import { loadMaster } from "../utils/ssgLoader";

interface Props {
  masterData: Record<string, RawStationData>;
}

const ClimatologicalRankingPage: NextPage<Props> = ({ masterData }) => {
  const [metric, setMetric] = useState<MetricMeta>(MetricKey.av_avtemp);
  const [rankMeta, setRankMeta] = useState<RankMeta>(RankKey.top);
  const [selectedRegion, setSelectedRegion] = useState<RegionMeta>(
    RegionKey.kanto
  );
  const [selectedPref, setSelectedPref] = useState<PrefMeta>(PrefKey.tokyo);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [showPopup, setShowPopup] = useState(false);

  // クライアントサイドで取得するデータ
  const [rankingRaw, setRankingRaw] = useState<Record<
    StationId,
    number[]
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [prevMetricKey, setPrevMetricKey] = useState(metric.key);

  if (metric.key !== prevMetricKey) {
    setPrevMetricKey(metric.key);
    setIsLoading(true);
    setRankingRaw(null);
  }

  useEffect(() => {
    let isMounted = true;
    
    fetch(`/ranking_not_null/${metric.key}.json`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setRankingRaw(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [metric.key]);

  const monthIdx = useMemo(
    () => (selectedMonth === "all" ? 12 : parseInt(selectedMonth) - 1),
    [selectedMonth]
  );

  const dataBounds = useMemo(() => {
    if (!rankingRaw) return { min: 0, max: 0 };
    const values = Object.values(rankingRaw)
      .map((v) => v[monthIdx])
      .filter((v): v is number => v !== null && v !== undefined);
    if (values.length === 0) return { min: 0, max: 0 };
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, [rankingRaw, monthIdx]);

  const displayList: RankingData[] = useMemo(() => {
    if (!rankingRaw || !masterData) return [];

    // 1. RawRankingData に変換
    const rawList: RawRankingData[] = Object.entries(rankingRaw)
      .map(([id, values]) => {
        const master = masterData[id as StationId];
        if (!master) return null;
        const value = values[monthIdx];
        if (value === undefined || value === null) return null;
        return {
          ...master,
          id,
          value,
          rank: 0,
        } as RawRankingData;
      })
      .filter((s): s is RawRankingData => s !== null);

    // 2. 共通ロジックでランキング処理
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
    }));
  }, [
    rankingRaw,
    masterData,
    monthIdx,
    rankMeta,
    selectedRegion,
    selectedPref,
  ]);

  const config = metric;
  const detail = useMemo(() => config.detail!, [config]);

  return (
    <>
      <Head>
        <title>{`${selectedMonth === "all" ? "通年" : selectedMonth + "月"}の${
          config.label
        }ランキング - アメダス図鑑`}</title>
      </Head>

      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
        <Header />

        <main className="flex-1 pb-16">
          <HeroSection
            title="平年値ランキング"
            description={`全国の観測所の平年値（1991-2020年）をランキング形式で比較できます。月ごとの切り替えや、地域・都道府県での絞り込みも可能です。`}
            Icon={<IoIosTrophy />}
            gradient="bg-gradient-to-r from-amber-600 to-yellow-500"
          />

          <div className="max-w-[1200px] mx-auto px-4 mt-4">
            {/* 項目・月選択 */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
              <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex flex-wrap justify-center gap-1">
                {Object.values(MetricKey)
                  .filter((m) => m.tab === "主要")
                  .map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setMetric(m)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        metric.key === m.key
                          ? `text-white shadow-md`
                          : "text-slate-500 hover:bg-slate-50"
                      }`}
                      style={
                        metric.key === m.key ? { backgroundColor: m.color } : {}
                      }
                    >
                      {m.label}
                    </button>
                  ))}

                {/* その他メトリック選択 */}
                <button
                  onClick={() => setShowPopup(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    metric.tab !== "主要"
                      ? "text-white shadow-md"
                      : "text-slate-500 hover:bg-slate-50 border border-transparent"
                  }`}
                  style={
                    metric.tab !== "主要"
                      ? { backgroundColor: metric.color }
                      : {}
                  }
                >
                  {metric.tab !== "主要" ? metric.label : "その他 ▸"}
                </button>
              </div>

              <div className="rounded-xl shadow-sm flex items-center">
                <CustomSelect
                  value={selectedMonth}
                  onChange={(v) => setSelectedMonth(v)}
                  options={Object.entries(MonthMap).map(([k, v]) => ({
                    value: k,
                    label: v,
                  }))}
                />
              </div>
            </div>

            <MetricPopup
              isOpen={showPopup}
              onClose={() => setShowPopup(false)}
              onApply={(m) => setMetric(m)}
              rankType={rankMeta}
              initialMetricKey={metric}
            />

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
            {isLoading ? (
              <div className="text-center py-20">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-slate-200 border-t-slate-500 rounded-full mb-4"></div>
                <p className="text-slate-500 font-bold">
                  データを読み込み中...
                </p>
              </div>
            ) : (
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
                          className={`text-2xl font-mono font-bold ${getMetricColor(
                            s.value,
                            dataBounds.min,
                            dataBounds.max,
                            metric.unit !== "℃"
                          )}`}
                        >
                          {s.value !== null && s.value !== undefined
                            ? `${s.value.toFixed(1)}${config.unit}`
                            : "---"}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!isLoading && displayList.length === 0 && (
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
  try {
    const masterData = loadMaster();
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
    console.error(
      "[SSG Error] ClimatologicalRankingPage Shell generation failed:",
      error
    );
    return { notFound: true };
  }
};

export default ClimatologicalRankingPage;
