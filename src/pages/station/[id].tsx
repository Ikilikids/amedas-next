// pages/station/[id].tsx
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import Sidebar from "../../components/Sidebar";
import InfoPanel from "../../components/InfoPanel";
import StationMap from "../../components/StationMap";
import { MetricKey } from "../../setting/metric";
import Similar from "../../components/Station/Similar";
import PrefecturePart from "../../components/Station/PrefecturePart";
import { FaBookOpen, FaArrowLeft, FaMapLocationDot } from "react-icons/fa6";

import { SectionWithDescription } from "../../utils/colorUtils";
import { IoBook } from "react-icons/io5";

import { AllData, } from "../../types/all";
import { RawData, RawStationData, StationLiveData } from "../../types/raw";
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
import { buildSimilar } from "../../utils/transformSimilar";
import { readJson } from "../../utils/ssgLoader";
import {
  loadMaster,
} from "../../utils/climateDataManager";
import { climateDownload } from "../../utils/downloader";

export const getStaticPaths: GetStaticPaths = async () => {
  const master = loadMaster();
  const paths = Object.keys(master).map((id) => ({
    params: { id },
  }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<RawData> = async ({ params }) => {
  const master = loadMaster();
  const id = params?.id as StationId;

  // 地点詳細に必要な全メトリックを自動解決して取得
  const stationMetricsMap = await climateDownload({
    [id]: ["table", "overview", "ratio", "uonzu"],
  }, master);
  const stationData = stationMetricsMap[id];
  if (!stationData) return { notFound: true };


  const rawStationData = stationData.station;
  const { climateData } = stationData;

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

  return {
    props: {
      station: rawStationData,
      climateData,
      otherStations: {
        similarAll: result.rawSimilarAll,
        similarMeteo: result.rawSimilarMeteo,
        sameStations: rawSameStations,
        meteoStations: rawMeteoStations,
      },
    },
  };
};

// --- Page Component ---
const StationPage = (props: RawData) => {
  const allData: AllData = useMemo(() => toAllData(props), [props]);

  const {
    station: stationData,
    climateData,
    otherStations,
  } = allData;

  const similarAll = otherStations?.similarAll;
  const similarMeteo = otherStations?.similarMeteo;
  const sameStations = otherStations?.sameStations || [];
  const meteoStations = otherStations?.meteoStations || [];

  // 動的な履歴・統計データをクライアントサイドで管理
  const [liveData, setLiveData] = useState<StationLiveData | null>(null);

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

      <Layout
        breadcrumbs={[
          { label: "気候ランキング", href: "/ranking/climate/av_avtemp" },
          { label: stationData.pref.label },
          { label: stationData.official_name },
        ]}
        sidebar={
          <>
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
          </>
        }
        heroProps={{
          badgeIcon: <span>{stationData.category.icon}</span>,
          badgeText: `${stationData.pref.label} ${stationData.city || ""} ・ ${stationData.category.label}`,
          title: (
            <div className="flex items-baseline gap-3 flex-wrap">
              <span>{stationData.official_name}</span>
              {stationData.official_name !== stationData.station_name && (
                <span className="text-base font-medium text-white/80">
                  （通称: {stationData.station_name}）
                </span>
              )}
            </div>
          ),
          description: `気象庁アメダス「${stationData.official_name}」観測所の1991〜2020年平年値統計データです。標高${stationData.height != null ? `${stationData.height}m` : "未公表"}（北緯${stationData.lat ? Number(stationData.lat).toFixed(2) : "--"}度、東経${stationData.lon ? Number(stationData.lon).toFixed(2) : "--"}度）に位置し、雨温図グラフ・月別平年値一覧・各種比率・直近推移を掲載しています。`,
          watermark: "STATION",
          gradient: `linear-gradient(135deg, ${regionStrong} 0%, color-mix(in srgb, ${regionStrong} 75%, black) 100%)`,
          rightContent: (
            <div className="flex flex-col items-start xl:items-end gap-1.5 shrink-0">
              <div className="text-xs font-mono font-bold text-white bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                観測所番号: #{stationData.id}
              </div>
              {lastUpdate && (
                <span className="text-white/80 text-[11px] font-mono">
                  最終更新: {lastUpdate}
                </span>
              )}
            </div>
          ),
        }}
        sections={[
          {
            id: "section-basic",
            label: "1. 基本データ・位置マップ",
            subLabel: "観測所の位置・標高および代表的な年平均平年値（気温・降水・日照・風速）です。",
            accentColor: regionStrong,
            children: (
              <div className="flex flex-col xl:flex-row gap-6 items-stretch">
                <div className="xl:w-1/2 min-w-0">
                  <InfoPanel
                    stationData={stationData}
                    climateData={climateData ?? null}
                    loading={false}
                    isTitle={false}
                  />
                </div>
                <div className="xl:w-1/2 flex flex-col min-w-0">
                  <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm relative bg-slate-50 min-h-[350px] xl:min-h-0">
                    <div className="w-full h-[350px] xl:h-full xl:absolute xl:inset-0">
                      <StationMap
                        isMini
                        lat={stationData.lat}
                        lng={stationData.lon}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ),
          },
          {
            id: "section-uonzu",
            label: "2. 雨温図（平年値グラフ）",
            accentColor: regionStrong,
            children: (
              <UonzuSection uonzuData={climateData} regionColor={regionStrong} />
            ),
          },
          {
            id: "section-table",
            label: "3. 月別気候データ一覧表",
            accentColor: regionStrong,
            children: (
              <TableSection
                tableData={climateData}
                regionColor={regionStrong}
                isMeteo={isMeteo}
                isIsland={isIsland}
              />
            ),
          },
          {
            id: "section-ratio",
            label: "4. 気候要素の割合・日数",
            accentColor: regionStrong,
            children: (
              <RatioSection
                ratioData={climateData}
                regionColor={regionStrong}
                isMeteo={isMeteo}
                isIsland={isIsland}
                stationId={stationData.id}
              />
            ),
          },
          ...(history && history.length > 0
            ? [
                {
                  id: "section-recent",
                  label: "5. 直近の観測推移",
                  accentColor: regionStrong,
                  children: (
                    <RecentSection
                      history={history}
                      stats={stats}
                      regionColor={regionStrong}
                    />
                  ),
                },
              ]
            : []),
        ]}
        footerContent={
          <>
            <Link
              href="/ranking/climate/av_avtemp"
              className="inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FaArrowLeft />
              <span>気候ランキングに戻る</span>
            </Link>
            <div className="text-xs text-slate-400 font-bold">
              出典: 気象庁「過去の気象データ・平年値（1991〜2020年）」をもとに作成
            </div>
          </>
        }
      />
    </>
  );
};

export default StationPage;
