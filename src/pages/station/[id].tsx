// pages/station/[id].tsx
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import PageLayout from "../../components/PageLayout";
import Sidebar from "../../components/Sidebar";
import InfoPanel from "../../components/InfoPanel";
import StationMap from "../../components/StationMap";
import Similar from "../../components/Station/Similar";
import RankBadge from "../../svg/RankBadge";
import PrefecturePart from "../../components/Station/PrefecturePart";
import Breadcrumb from "../../components/Breadcrumb";
import { FaBookOpen, FaArrowLeft } from "react-icons/fa";

import { SectionWithDescription } from "../../utils/colorUtils";
import { IoBook } from "react-icons/io5";

import { AllData, BadgeData } from "../../types/all";
import { RawBadgeData, RawData, RawStationData } from "../../types/raw";
import { OriginSimilarItem, StationId } from "../../types/union";
import { CategoryKey } from "../../setting/category";
import { toAllData } from "../../utils/masterUtils";
import { isIslandId } from "../../setting/rank";

import UonzuSection from "../../components/Station/UonzuSection";
import RatioSection from "../../components/Station/RatioSection";
import TableSection from "../../components/Station/TableSection";
import RecentSection from "../../components/Station/RecentSection";

// --- SSG logic ---
import { BadgeLogic } from "../../utils/badgeLogic";
import { getStation } from "../../utils/climateCache";
import { assembleDisplayData } from "../../utils/rankingUtils";
import { buildSimilar } from "../../utils/transformSimilar";
import {
  ensureAllDataLoaded,
  loadMaster,
  readJson,
} from "../../utils/ssgLoader";

export const getStaticPaths: GetStaticPaths = async () => {
  const master = loadMaster();
  const paths = Object.keys(master).map((id) => ({
    params: { id },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<RawData> = async ({ params }) => {
  const id = params?.id as StationId;

  // 全データをキャッシュに埋める (静的な統計計算のため)
  ensureAllDataLoaded();

  const master = loadMaster();
  const rawStationData = master[id];

  if (!rawStationData) return { notFound: true };

  // --- キャッシュからこの地点の統計データを取得 (SSG) ---
  const integratedData = getStation(id);
  const { overview, table, ratio, uonzu } = assembleDisplayData(
    integratedData as any
  );

  // --- 類似地点等の静的データ生成 ---
  const similarFile = readJson<any>("data", "similar", `${id}.json`);
  const rawSimilarAllItem: OriginSimilarItem[] = similarFile?.similar_all || [];
  const rawSimilarMeteoItem: OriginSimilarItem[] =
    similarFile?.similar_meteo || [];

  const result = buildSimilar(rawSimilarAllItem, rawSimilarMeteoItem, master);

  const rawSameStations: RawStationData[] = [];
  const rawMeteoStations: RawStationData[] = [];

  Object.entries(master).forEach(([sid, s]) => {
    const item: RawStationData = {
      id: s.id,
      pref: s.pref,
      category: s.category,
      station_name: s.station_name,
    };

    if (s.pref === rawStationData.pref) rawSameStations.push(item);
    if (s.category === "meteo") rawMeteoStations.push(item);
  });

  const badgeinfo: RawBadgeData[] = BadgeLogic.getBadges(
    overview as any,
    ratio as any
  );

  return {
    props: {
      station: rawStationData,
      overview,
      uonzu,
      table,
      ratio,
      similarAll: result.rawSimilarAll,
      similarMeteo: result.rawSimilarMeteo,
      sameStations: rawSameStations,
      meteoStations: rawMeteoStations,
      badge: badgeinfo,
      // history, stats, lastUpdate はクライアントサイドでフェッチされる
      history: [],
      stats: null,
      lastUpdate: new Date().toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo",
      }),
    },
  };
};

// --- Page Component ---
const StationPage = (props: RawData) => {
  const allData: AllData = useMemo(() => toAllData(props), [props]);

  const {
    station: stationData,
    overview: overviewData,
    uonzu: uonzuData,
    table: tableData,
    ratio: ratioData,
    similarAll,
    similarMeteo,
    sameStations,
    meteoStations,
    badge: badges,
  } = allData;

  // 動的な履歴・統計データをクライアントサイドで管理
  const [liveData, setLiveData] = useState<{
    history: any[];
    stats: any;
    lastUpdate?: string;
  } | null>(null);

  useEffect(() => {
    if (!stationData.id) return;

    fetch(`/api/live/station-detail?id=${stationData.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.history) {
          setLiveData(data);
        }
      })
      .catch(console.error);
  }, [stationData.id]);

  const history = liveData?.history || [];
  const stats = liveData?.stats || null;
  const lastUpdate = liveData?.lastUpdate
    ? new Date(liveData.lastUpdate).toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo",
      })
    : "更新を確認中...";

  const regionColor = stationData.pref.region.colorBase;
  const regionStrong = stationData.pref.region.colorStrong;
  const isMeteo = stationData.category === CategoryKey.meteo;
  const isIsland = isIslandId(stationData.id);

  return (
    <>
      <Head>
        <title>{`${stationData.official_name}（${stationData.pref.label}）の気候・平年値データ - アメダス図鑑`}</title>
        <meta
          name="description"
          content={`【アメダス図鑑】${stationData.pref.label}${stationData.city || ""}にあるアメダス観測所「${stationData.official_name}」の詳細データ。標高${stationData.height != null ? `${stationData.height}m` : "データなし"}、緯度経度、雨温図グラフ、月別気候平年値、要素別割合、直近の気象推移を完全網羅。`}
        />
        <link rel="canonical" href={`https://amedas-zukan.jp/station/${stationData.id}`} />
      </Head>

      <Layout>
        <main className="flex-1 max-w-[1280px] mx-auto p-4 my-4 w-full overflow-x-hidden">
          {/* パンくずリスト */}
          <Breadcrumb
            items={[
              { label: "気候ランキング", href: "/clim_ranking" },
              { label: stationData.pref.label },
              { label: stationData.official_name },
            ]}
          />

          <PageLayout
            sidebar={
              <Sidebar
                tocItems={[
                  { id: "section-basic", label: "1. 基本データ・位置マップ" },
                  { id: "section-uonzu", label: "2. 雨温図（平年値グラフ）" },
                  { id: "section-table", label: "3. 月別気候データ一覧表" },
                  { id: "section-ratio", label: "4. 気候要素の割合・日数" },
                  ...(history && history.length > 0
                    ? [{ id: "section-recent", label: "5. 直近の観測推移" }]
                    : []),
                ]}
              >
                {/* 類似地点カード */}
                {similarAll && similarMeteo && (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                    <Similar
                      similarDataAll={similarAll}
                      similarDataMeteo={similarMeteo}
                    />
                  </div>
                )}

                {/* 同じ県の観測所カード */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                  <PrefecturePart
                    sameStations={sameStations}
                    meteoStations={meteoStations}
                  />
                </div>
              </Sidebar>
            }
          >
            {/* 左カラム: 記事本文コンテナ (columnと完全統一) */}
            <article className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-sm break-words">
              {/* メタ情報バッジ */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-bold mb-4">
                <span
                  className="px-3 py-1 rounded-full font-black text-white shadow-sm"
                  style={{ backgroundColor: regionStrong }}
                >
                  {stationData.pref.label} {stationData.city}
                </span>
                <span
                  className="px-3 py-1 rounded-full font-black border flex items-center gap-1"
                  style={{
                    borderColor: stationData.category.colorBorder,
                    backgroundColor: `${stationData.category.colorFull}15`,
                    color: stationData.category.colorFull,
                  }}
                >
                  <span>{stationData.category.icon}</span>
                  <span>{stationData.category.label}</span>
                </span>
                <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  観測所番号: #{stationData.id}
                </span>
                {lastUpdate && (
                  <span className="text-slate-400 text-xs font-mono">
                    最終更新: {lastUpdate}
                  </span>
                )}
              </div>

              {/* タイトル */}
              <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-tight mb-4 flex items-baseline gap-3 flex-wrap">
                <span>{stationData.official_name}</span>
                {stationData.official_name !== stationData.station_name && (
                  <span className="text-lg font-bold text-slate-400">
                    （通称: {stationData.station_name}）
                  </span>
                )}
              </h1>

              {/* 全国ランキングバッジ */}
              {badges && badges.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mb-6">
                  {badges.map((b: BadgeData, i: number) => (
                    <RankBadge key={i} {...b} />
                  ))}
                </div>
              )}

              {/* 地点サマリーボックス */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 text-sm leading-relaxed mb-8">
                <p className="font-bold text-slate-700 mb-1">【地点の概要】</p>
                <p>
                  気象庁アメダス「{stationData.official_name}」観測所の1991〜2020年平年値統計データです。
                  標高{stationData.height != null ? `${stationData.height}m` : "未公表"}（北緯{stationData.lat ? Number(stationData.lat).toFixed(2) : "--"}度、東経{stationData.lon ? Number(stationData.lon).toFixed(2) : "--"}度）に位置し、雨温図グラフ・月別平年値一覧・各種比率・直近推移を掲載しています。
                </p>
              </div>

              {/* モバイル用目次 (lg以上は右サイドバーに表示) */}
              <div className="lg:hidden bg-blue-50/50 border border-blue-100 rounded-2xl p-5 mb-10">
                <div className="flex items-center gap-2 font-black text-blue-900 mb-3 text-sm">
                  <FaBookOpen className="text-blue-600" />
                  <span>目次</span>
                </div>
                <ul className="space-y-2 text-xs font-bold text-slate-700">
                  <li>
                    <a href="#section-basic" className="hover:text-blue-600 transition-colors">
                      1. 基本データ・位置マップ
                    </a>
                  </li>
                  <li>
                    <a href="#section-uonzu" className="hover:text-blue-600 transition-colors">
                      2. 雨温図（平年値グラフ）
                    </a>
                  </li>
                  <li>
                    <a href="#section-table" className="hover:text-blue-600 transition-colors">
                      3. 月別気候データ一覧表
                    </a>
                  </li>
                  <li>
                    <a href="#section-ratio" className="hover:text-blue-600 transition-colors">
                      4. 気候要素の割合・日数
                    </a>
                  </li>
                  {history && history.length > 0 && (
                    <li>
                      <a href="#section-recent" className="hover:text-blue-600 transition-colors">
                        5. 直近の観測推移
                      </a>
                    </li>
                  )}
                </ul>
              </div>

              {/* 本文コンテンツセクション群 */}
              <div className="space-y-12 text-slate-700 leading-relaxed text-sm">
                {/* セクション1: 基本データ */}
                <section id="section-basic" className="scroll-mt-24">
                  <h2 className="text-xl font-black text-slate-800 pb-3 border-b border-slate-200 flex items-center gap-2 mb-4">
                    <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: regionStrong }}></span>
                    1. 基本データ・位置マップ
                  </h2>
                  <p className="text-xs text-slate-500 mb-4">
                    観測所の位置・標高および代表的な年平均平年値（気温・降水・日照・風速）です。
                  </p>

                  <div className="flex flex-col xl:flex-row gap-6 items-stretch">
                    <div className="xl:w-1/2 min-w-0">
                      <InfoPanel
                        stationData={stationData}
                        overViewData={overviewData}
                        loading={false}
                        isTitle={false}
                      />
                    </div>
                    <div className="xl:w-1/2 h-[340px] xl:h-auto shrink-0 rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm relative bg-slate-50">
                      <StationMap
                        isMini
                        lat={stationData.lat}
                        lng={stationData.lon}
                      />
                    </div>
                  </div>
                </section>

                {/* セクション2: 雨温図 */}
                <section id="section-uonzu" className="scroll-mt-24">
                  <UonzuSection uonzuData={uonzuData} regionColor={regionStrong} />
                </section>

                {/* セクション3: 月別気候データ一覧表 */}
                <section id="section-table" className="scroll-mt-24">
                  <TableSection
                    tableData={tableData}
                    regionColor={regionStrong}
                    isMeteo={isMeteo}
                    isIsland={isIsland}
                  />
                </section>

                {/* セクション4: 気候要素の割合・日数 */}
                <section id="section-ratio" className="scroll-mt-24">
                  <RatioSection
                    ratioData={ratioData}
                    regionColor={regionStrong}
                    isMeteo={isMeteo}
                    isIsland={isIsland}
                    stationId={stationData.id}
                  />
                </section>

                {/* セクション5: 直近の観測推移 */}
                {history && history.length > 0 && (
                  <section id="section-recent" className="scroll-mt-24">
                    <RecentSection
                      history={history}
                      stats={stats}
                      regionColor={regionStrong}
                    />
                  </section>
                )}
              </div>

              {/* 記事フッター (columnと統一) */}
              <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col justify-between items-center gap-4">
                <Link
                  href="/clim_ranking"
                  className="inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <FaArrowLeft />
                  <span>気候ランキングに戻る</span>
                </Link>
                <div className="text-xs text-slate-400 font-bold">
                  出典: 気象庁「過去の気象データ・平年値（1991〜2020年）」をもとに作成
                </div>
              </div>
            </article>
          </PageLayout>
        </main>
      </Layout>
    </>
  );
};

export default StationPage;
