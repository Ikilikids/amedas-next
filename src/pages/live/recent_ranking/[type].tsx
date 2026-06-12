import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import CategoryLegend from "../../../components/CategoryLegend";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import HeroSection from "../../../components/HeroSection";
import { RankingData, RawRankingData } from "../../../components/Ranking/types";
import { CategoryValue } from "../../../utils/category";
import { getRainColor, getTempColor } from "../../../utils/colorUtils";
import { db } from "../../../utils/firebaseAdmin";
import { toStation } from "../../../utils/masterUtils";
import { PrefKey, PrefMeta } from "../../../utils/pref";
import { RankKey, RankMeta } from "../../../utils/rank";
import { processRankingData } from "../../../utils/rankingUtils";
import { RegionKey, RegionMeta } from "../../../utils/region";
import { loadMaster } from "../../../utils/ssgLoader";

import { colorWithAlpha } from "../../../components/LayeredPieChart/chartUtils";
import {
  MetricGroup,
  MetricKey,
  MetricValue,
  RANKING_GROUP_META,
} from "../../../utils/metric";

interface StationData {
  station_name: string;
  pref: string;
  category: CategoryValue;
  [key: string]: any;
}

interface Props {
  stations: Record<string, StationData>;
  lastUpdate: string;
  type: MetricGroup;
}

const RecentRankingDynamicPage: NextPage<Props> = ({
  stations,
  lastUpdate,
  type,
}) => {
  const router = useRouter();
  const groupMeta = RANKING_GROUP_META[type];

  // このグループに属するメトリクスを自動抽出
  const groupMetrics = useMemo(
    () =>
      Object.values(MetricKey)
        .filter((m) => m.detail.group === type)
        .map((m) => m.key),
    [type]
  );

  const [metric, setMetric] = useState<MetricValue>(groupMetrics[0]);
  const [rankMeta, setRankMeta] = useState<RankMeta>(RankKey.top);
  const [selectedRegion, setSelectedRegion] = useState<RegionMeta>(
    RegionKey.kanto
  );
  const [selectedPref, setSelectedPref] = useState<PrefMeta>(PrefKey.tokyo);

  // Reset metric when type changes (Render-time synchronization)
  const [prevType, setPrevType] = useState(type);
  if (type !== prevType) {
    setPrevType(type);
    setMetric(groupMetrics[0]);
  }

  const config = useMemo(() => MetricKey[metric], [metric]);
  const detail = useMemo(() => config.detail, [config]);

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
  const isCountMetric =
    metric.includes("hitemp_") || metric.includes("lwtemp_");

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const pageTitle = `2026年${groupMeta.label}ランキング`;
  const pageDescription = `2026年の${groupMeta.label}に関する項目のランキングです。`;

  return (
    <>
      <Head>
        <title>{`2026年${config.label}ランキング - アメダス図鑑`}</title>
      </Head>

      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
        <Header />

        <main className="flex-1 pb-16">
          <HeroSection
            title={pageTitle}
            description={pageDescription}
            Icon={config.highIcon}
            gradient={detail.gradient}
            lastUpdateLabel="データ更新"
            lastUpdateValue={lastUpdate}
          />

          <div className="max-w-[1200px] mx-auto px-4 mt-4">
            {/* メトリック選択タブ */}
            <div className="flex flex-col items-center mb-6 gap-3">
              <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex flex-wrap justify-center gap-1">
                {groupMetrics.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMetric(m)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
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
                          isRainMetric
                            ? getRainColor(s.value)
                            : getTempColor(s.value)
                        }`}
                      >
                        {s.value !== null
                          ? `${s.value.toFixed(
                              isRainMetric || isCountMetric ? 0 : 1
                            )}${config.unit}`
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
            className={`p-4 bg-white shadow-2xl rounded-full text-slate-400 border border-slate-100 transition-colors hover:text-slate-600`}
          >
            <FaChevronDown className="transform rotate-180" />
          </button>
        </div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { type: "heat" } },
      { params: { type: "cold" } },
      { params: { type: "rain" } },
    ],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const type = params?.type as MetricGroup;
  if (!RANKING_GROUP_META[type]) {
    return { notFound: true };
  }

  try {
    const masterData = loadMaster();
    const rankingsSnapshot = await db.collection("rankings").get();
    const lastUpdate = new Date().toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
    });

    const stations: Record<string, StationData> = {};
    const targetMetrics = Object.values(MetricKey)
      .filter((m) => m.detail.group === type)
      .map((m) => m.key);

    rankingsSnapshot.forEach((doc) => {
      const metricId = doc.id as MetricValue;
      if (!targetMetrics.includes(metricId)) return;

      const data = doc.data() as {
        list: Array<{ id: string; val: number; d?: string }>;
      };

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

    return {
      props: {
        stations,
        lastUpdate,
        type,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error(`Failed to load ${type} ranking data:`, error);
    return { notFound: true };
  }
};

export default RecentRankingDynamicPage;
