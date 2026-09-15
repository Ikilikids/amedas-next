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
import {
  RankingData,
  RankingItem,
  RawRankingData,
} from "../../components/Ranking/types";
import { toStation } from "../../utils/masterUtils";
import { PrefKey, PrefMeta } from "../../setting/pref";
import { RankKey, RankMeta } from "../../setting/rank";
import { processRankingData } from "../../utils/rankingUtils";
import { RegionKey, RegionMeta } from "../../setting/region";
import { loadMaster } from "../../utils/ssgLoader";

import { colorWithAlpha } from "../../components/LayeredPieChart/chartUtils";
import { RawStationData } from "../../types/raw";
import { StationId } from "../../types/union";
import { getMetricColor } from "../../utils/colorUtils";
import { MetricKey, MetricValue } from "../../setting/metric";

interface Props {
  masterData: Record<string, RawStationData>;
}

const DailyRankingPage: NextPage<Props> = ({ masterData }) => {
  const [metric, setMetric] = useState<MetricValue>("av_hitemp");
  const [rankMeta, setRankMeta] = useState<RankMeta>(RankKey.top);
  const [selectedRegion, setSelectedRegion] = useState<RegionMeta>(
    RegionKey.kanto
  );
  const [selectedPref, setSelectedPref] = useState<PrefMeta>(PrefKey.tokyo);

  // クライアントサイドで取得する動的データ
  const [jmaData, setJmaData] = useState<{
    av_hitemp: RankingItem[];
    av_lwtemp: RankingItem[];
    sm_rain: RankingItem[];
    lastUpdate?: string;
  } | null>(null);

  useEffect(() => {
    // APIから最新の数字を取得
    fetch("/api/live/daily-ranking")
      .then((res) => res.json())
      .then(setJmaData)
      .catch(console.error);
  }, []);

  const config = useMemo(() => MetricKey[metric], [metric]);
  const detail = useMemo(() => config.detail!, [config]);

  const displayList: RankingData[] = useMemo(() => {
    if (!jmaData) return [];

    const jmaList = jmaData[metric] || [];

    // 1. RawRankingData に変換 (SSGのマスターデータと合体)
    const rawList: RawRankingData[] = jmaList
      .map((item) => {
        const id = item.id!;
        const master = masterData[id];
        if (!master) return null;
        return {
          ...master,
          ...item,
        } as RawRankingData;
      })
      .filter((s): s is RawRankingData => s !== null);

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
  }, [metric, jmaData, masterData, rankMeta, selectedRegion, selectedPref]);

  const dataBounds = useMemo(() => {
    if (!jmaData || !metric) return { min: 0, max: 0 };
    const list = jmaData[metric] || [];
    const values = list
      .map((s) => s.value)
      .filter((v): v is number => typeof v === "number");
    if (values.length === 0) return { min: 0, max: 0 };
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, [jmaData, metric]);

  const displayLastUpdate = useMemo(() => {
    if (!jmaData?.lastUpdate) return "読み込み中...";
    return new Date(jmaData.lastUpdate).toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
    });
  }, [jmaData]);

  return (
    <>
      <Head>
        <title>{`今日の${config.label}ランキング - アメダス図鑑`}</title>
        <meta
          name="description"
          content={`全国アメダス観測所のデータから、今日これまでに観測された${config.label}の全国トップ10ランキングを表示。今日の最高気温・最低気温・最大降水量などの極値を素早く確認できます。`}
        />
        <link rel="canonical" href="https://amedas-zukan.jp/live/daily_ranking" />
      </Head>
      <Layout>
        <main className="max-w-[1280px] mx-auto p-4  my-4 w-full">
          {/* パンくずリスト */}
          <Breadcrumb
            items={[
              { label: "本日の気象ランキング" },
            ]}
          />

          <PageLayout sidebar={<Sidebar />}>
            {/* 左メインエリア */}
            <div className="space-y-6">
              {/* ページヘッダーカード */}
              <div
                className="rounded-3xl p-6  text-white shadow-lg relative overflow-hidden"
                style={{ background: detail.gradient }}
              >
                <div className="relative z-10 flex flex-col    gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase mb-3">
                      <span>Today's Ranking</span>
                    </div>
                    <h1 className="text-2xl  font-black tracking-tight mb-2 flex items-center gap-3">
                      {config.highIcon}
                      <span>今日の{config.label}ランキング</span>
                    </h1>
                    <p className="text-white/90 text-xs  leading-relaxed max-w-xl">
                      今日これまでに全国のアメダス観測所で観測された{config.label}の速報値ランキングです。
                    </p>
                  </div>
                  <div className="text-xs font-bold bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 self-start  shrink-0">
                    更新: {displayLastUpdate}
                  </div>
                </div>
              </div>

              {/* 統合コントロールパネル（メトリック選択・絞り込み） */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
                {/* 1. メトリック選択 */}
                <div className="flex flex-wrap gap-1.5 items-center pb-5 border-b border-slate-100">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mr-1">
                    指標:
                  </span>
                  {(["av_hitemp", "av_lwtemp", "sm_rain"] as MetricValue[]).map(
                    (m) => (
                      <button
                        key={m}
                        onClick={() => setMetric(m)}
                        className={`px-4 py-1.5 rounded-xl text-xs  font-bold transition-all ${
                          metric === m
                            ? `text-white shadow-sm`
                            : "text-slate-600 hover:bg-slate-100"
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

                {/* 2. しぼりこみナビゲーション */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mr-1">
                      範囲:
                    </span>
                    {Object.values(RankKey).map((rk) => (
                      <button
                        key={rk.key}
                        onClick={() => setRankMeta(rk)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                          rankMeta.key === rk.key
                            ? `text-white shadow-sm`
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
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {Object.values(RegionKey).map((r) => (
                        <button
                          key={r.label}
                          onClick={() => setSelectedRegion(r)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            selectedRegion.label === r.label
                              ? "text-white shadow-sm"
                              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                          }`}
                          style={
                            selectedRegion.label === r.label
                              ? { backgroundColor: r.colorStrong }
                              : { backgroundColor: colorWithAlpha(r.colorBase, 0.15) }
                          }
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {rankMeta.key === "pre" && (
                    <div className="pt-2">
                      <select
                        value={selectedPref.code}
                        onChange={(e) => {
                          const found = Object.values(PrefKey).find(
                            (p) => p.code === e.target.value
                          );
                          if (found) setSelectedPref(found);
                        }}
                        className="px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2"
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
              </div>

              {/* ランキングリスト */}
              <div className="grid grid-cols-2   gap-3.5">
                {displayList.map((s) => (
                  <Link
                    key={s.id}
                    href={`/station/${s.id}`}
                    className="block transition-transform hover:-translate-y-0.5 group"
                  >
                    <div
                      className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-300 relative overflow-hidden h-full flex flex-col transition-shadow hover:shadow-md"
                      style={{
                        backgroundColor: colorWithAlpha(
                          s.pref?.region?.colorBase,
                          0.08
                        ),
                        borderColor: colorWithAlpha(
                          s.pref?.region?.colorBase,
                          0.25
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
                            config.unit !== "℃"
                          )}`}
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
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                  <p className="text-slate-400 font-medium">
                    該当するデータが見つかりませんでした。
                  </p>
                </div>
              )}
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
    // マスターデータのロードのみを行う (SSGの器として機能させる)
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
      "[SSG Error] DailyRankingPage Shell generation failed:",
      error
    );
    return { notFound: true };
  }
};

export default DailyRankingPage;
