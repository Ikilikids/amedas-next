// pages/station/[id].tsx
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import HeroSection from "../../components/HeroSection";
import InfoPanel from "../../components/InfoPanel";
import StationMap from "../../components/StationMap";
import Similar from "../../components/Station/Similar";
import RankBadge from "../../svg/RankBadge";
import PrefecturePart from "../../components/Station/PrefecturePart";

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
  const regionGradient = `linear-gradient(to right, ${stationData.pref.region.colorStrong}, ${stationData.pref.region.colorBase})`;
  const isMeteo = stationData.category === CategoryKey.meteo;
  const isIsland = isIslandId(stationData.id);

  return (
    <>
      <Head>
        <title>{`${stationData.official_name} - アメダス図鑑`}</title>
        <meta
          name="description"
          content={`【アメダス図鑑】${stationData.pref.label}${stationData.city || ""}にあるアメダス観測所「${stationData.official_name}」の詳細データ。標高${stationData.height != null ? `${stationData.height}m` : "データなし"}、経緯度などの基本情報のほか、平年値データ（雨温図・各種ランキング・気象要素別の割合データ）を網羅。`}
        />
        <link rel="canonical" href={`https://amedas-next--amedas-ppp.asia-east1.hosted.app/station/${stationData.id}`} />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <main className="flex-1">
          <HeroSection
            title={
              <span className="flex gap-2 flex-wrap items-center">
                {stationData.official_name}
                <span className="flex gap-2 flex-wrap items-center">
                  {badges &&
                    badges.map((b: BadgeData, i: number) => (
                      <RankBadge key={i} {...b} />
                    ))}
                </span>
              </span>
            }
            description={`${stationData.pref.label} ${stationData.city} / ${stationData.category.label}`}
            Icon={stationData.category.icon}
            gradient={regionGradient}
            lastUpdateLabel="最終更新"
            lastUpdateValue={lastUpdate}
          />

          <div className="max-w-[1280px] mx-auto w-full flex flex-col lg:flex-row gap-4 p-4">
            <div className="min-w-0 flex flex-col gap-2 flex-[4]">
              <SectionWithDescription
                icon={<IoBook />}
                title="基本データ"
                bgColor={regionColor}
              />

              <div className="flex flex-col lg:flex-row gap-2 items-stretch">
                {/* InfoPanel */}
                <div className="sm:min-w-[420px] flex-1">
                  <InfoPanel
                    stationData={stationData}
                    overViewData={overviewData}
                    loading={false}
                    isTitle={false}
                  />
                </div>

                {/* Map */}
                <div className="lg:flex-1 lg:min-w-0 h-[335px]">
                  <StationMap
                    isMini
                    lat={stationData.lat}
                    lng={stationData.lon}
                  />
                </div>
              </div>

              {/* 雨温図 */}
              <UonzuSection uonzuData={uonzuData} regionColor={regionColor} />

              {/* 割合データ */}
              <RatioSection
                ratioData={ratioData}
                regionColor={regionColor}
                isMeteo={isMeteo}
                isIsland={isIsland}
                stationId={stationData.id}
              />

              {/* 月別気候表 */}
              <TableSection
                tableData={tableData}
                regionColor={regionColor}
                isMeteo={isMeteo}
                isIsland={isIsland}
              />

              {/* 最近のデータ */}
              <RecentSection
                history={history}
                stats={stats}
                regionColor={regionColor}
              />
            </div>

            <div className="flex-[1]">
              <div className="sticky top-4 flex flex-col gap-4">
                {similarAll && similarMeteo && (
                  <Similar
                    similarDataAll={similarAll}
                    similarDataMeteo={similarMeteo}
                  />
                )}
                <PrefecturePart
                  sameStations={sameStations}
                  meteoStations={meteoStations}
                />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default StationPage;
