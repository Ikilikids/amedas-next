import React, { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../Layout";
import Sidebar from "../../Layout/widgets/Sidebar";
import InfoPanel from "../../common/InfoPanel";
import StationMap from "../../common/StationMap";
import SidebarWidget from "./widgets/Sidebar/UI";
import UonzuWidget from "./widgets/Uonzu/UI";
import TableWidget from "./widgets/Table/UI";
import RatioWidget from "./widgets/Ratio";
import RecentWidget from "./widgets/Recent/UI";
import { StationDetailPageProps } from "./ssg_function";
import { StationLiveData } from "../../../types/raw";
import { resolveCategory, resolvePref } from "../../../utils/masterUtils";
import { isIslandId } from "../../../setting/rank";
import { FaArrowLeft } from "react-icons/fa6";

export const StationDetailPageTemplate: React.FC<{
  rawData: StationDetailPageProps;
}> = ({ rawData }) => {
  const station = rawData.station;
  const climateData = rawData.climateData;

  const pref = station.pref ? resolvePref(station.pref) : undefined;
  const category = station.category ? resolveCategory(station.category) : undefined;

  const similarAll = rawData.otherStations?.similarAll;
  const similarMeteo = rawData.otherStations?.similarMeteo;
  const sameStations = rawData.otherStations?.sameStations || [];
  const meteoStations = rawData.otherStations?.meteoStations || [];

  // 動的な履歴・統計データをクライアントサイドで管理
  const [liveData, setLiveData] = useState<StationLiveData | null>(null);

  useEffect(() => {
    if (!station.id) return;

    fetch(`/api/live/station-detail?id=${station.id}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData && resData.history) {
          setLiveData(resData);
        }
      })
      .catch(console.error);
  }, [station.id]);

  const history = liveData?.history || [];
  const stats = liveData?.stats || null;
  const lastUpdate = liveData?.lastUpdate
    ? new Date(liveData.lastUpdate).toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
    })
    : "更新を確認中...";

  const regionStrong = pref?.region.colorStrong || "#2563eb";
  const isMeteo = station.category === "meteo";
  const isIsland = station.id ? isIslandId(station.id) : false;

  return (
    <Layout
      seo={{
        title: `${station.official_name || station.station_name}（${pref?.label}）の気候・平年値データ - アメダス図鑑`,
        description: `【アメダス図鑑】${pref?.label}${station.city || ""}にあるアメダス観測所「${station.official_name || station.station_name}」の詳細データ。標高${station.height != null ? `${station.height}m` : "データなし"}、緯度経度、雨温図グラフ、月別気候平年値、要素別割合、直近の気象推移を完全網羅。`,
        canonical: `https://amedas-zukan.jp/station/${station.id}`,
      }}
      breadcrumbs={[
        { label: "気候ランキング", href: "/ranking/climate/av_avtemp" },
        { label: pref?.label || "" },
        { label: station.official_name || station.station_name || "" },
      ]}
      sidebar={
        <SidebarWidget
          similarAll={similarAll}
          similarMeteo={similarMeteo}
          sameStations={sameStations}
          meteoStations={meteoStations}
        />
      }
      heroProps={{
        badgeIcon: <span>{category?.icon}</span>,
        badgeText: `${pref?.label} ${station.city || ""} ・ ${category?.label}`,
        title: (
          <div className="flex items-baseline gap-3 flex-wrap">
            <span>{station.official_name || station.station_name}</span>
            {station.official_name &&
              station.official_name !== station.station_name && (
                <span className="text-base font-medium text-white/80">
                  （通称: {station.station_name}）
                </span>
              )}
          </div>
        ),
        description: `気象庁アメダス「${station.official_name || station.station_name}」観測所の1991〜2020年平年値統計データです。雨温図グラフ・月別平年値一覧・各種比率・直近推移を掲載しています。`,
        watermark: "STATION",
        gradient: `linear-gradient(135deg, ${regionStrong} 0%, color-mix(in srgb, ${regionStrong} 75%, black) 100%)`,
        rightContent: (
          <div className="flex flex-col items-start xl:items-end gap-1.5 shrink-0">
            <div className="text-xs font-mono font-bold text-white bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
              観測所番号: #{station.id}
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
          subLabel:
            "観測所の位置・標高および代表的な年平均平年値（気温・降水・日照・風速）です。",
          accentColor: regionStrong,
          children: (
            <div className="flex flex-col xl:flex-row gap-6 items-stretch">
              <div className="xl:w-1/2 min-w-0">
                <InfoPanel
                  rawData={rawData}
                  loading={false}
                  isTitle={false}
                />
              </div>
              <div className="xl:w-1/2 flex flex-col min-w-0">
                <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm relative bg-slate-50 min-h-[350px] xl:min-h-0">
                  <div className="w-full h-[350px] xl:h-full xl:absolute xl:inset-0">
                    <StationMap lat={station.lat} lng={station.lon} />
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
            <UonzuWidget rawData={rawData} />
          ),
        },
        {
          id: "section-table",
          label: "3. 月別気候データ一覧表",
          accentColor: regionStrong,
          children: (
            <TableWidget
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
            <RatioWidget
              ratioData={climateData}
              regionColor={regionStrong}
              isMeteo={isMeteo}
              isIsland={isIsland}
              stationId={station.id || ""}
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
                <RecentWidget
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
  );
};

export default StationDetailPageTemplate;
