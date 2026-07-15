// pages/map.tsx
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import { IoBook } from "react-icons/io5";
import { LuChartNoAxesCombined } from "react-icons/lu";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import StationMap from "../components/StationMap";
import InfoPanel from "../components/InfoPanel";
import UonzuChart from "../components/UonzuChart";
import { useStationDetail } from "../components/Ranking/useRankingData";
import { SectionWithDescription } from "../utils/colorUtils";
import { MetricKey } from "../setting/metric";
import { StationId } from "../types/union";

// ==============================
//  ローカルサブコンポーネント
// ==============================
interface StationDetailPanelProps {
  stationId: StationId | null | undefined;
}

const StationDetailPanel = ({ stationId }: StationDetailPanelProps) => {
  const { stationData, uonzuData, overviewData, loading } = useStationDetail(
    stationId || null
  );

  const bgColor =
    stationData && stationData.pref
      ? (stationData.pref as any).region.colorStrong
      : "white";

  return (
    <div className="h-[900px] sm:h-[750px] flex flex-col gap-4">
      <h2 className="sr-only">情報パネル</h2>

      <div className="flex flex-col gap-2">
        <SectionWithDescription
          icon={<IoBook />}
          title="基本情報"
          bgColor={bgColor === "white" ? "#777777" : bgColor}
        />
        <InfoPanel
          stationData={stationData}
          overViewData={overviewData}
          loading={loading}
          isTitle={true}
        />
      </div>

      <div className="flex flex-col gap-2 flex-1 min-h-0">
        <SectionWithDescription
          icon={<LuChartNoAxesCombined />}
          title="雨温図"
          bgColor={bgColor === "white" ? "#777777" : bgColor}
        />
        <div className="bg-white border border-slate-200 rounded-3xl flex-1 min-h-0 overflow-hidden shadow-sm p-2">
          {uonzuData ? (
            <UonzuChart
              uonzuData={uonzuData}
              selectedBar={MetricKey.sm_rain}
              height="100%"
              hideLegend={true}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
              地点を選択すると雨温図が表示されます
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==============================
//  ページコンポーネント
// ==============================
const MapPage: NextPage = () => {
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  return (
    <>
      <Head>
        <title>マップから探す - アメダス図鑑</title>
        <meta
          name="description"
          content="アメダス観測所の雨温図や降水量、猛暑日日数などの気候データを月別で確認できます。地図上のピンをクリックして、各観測所の詳細データを簡単にチェック可能です。"
        />
        <link rel="canonical" href="https://amedas-next--amedas-ppp.asia-east1.hosted.app/map" />
      </Head>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <main className="flex-1">
          <HeroSection
            title="マップから探す"
            description={
              <>
                ・地図上のピンをクリックすると、右側(下側)の情報パネルに選択した観測所の基本情報（正式名称、都道府県、市町村）と雨温図が表示されます。
              </>
            }
            Icon={<FaMapLocationDot />}
            gradient="bg-gradient-to-r from-green-600 to-emerald-500"
          />

          <div className="max-w-[1280px] mx-auto flex flex-col gap-4 p-4 w-full">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="h-[450px] lg:h-[750px] lg:flex-[4] flex flex-col gap-4">
                <SectionWithDescription
                  icon={<FaMapLocationDot />}
                  title="マップ"
                  bgColor="#3b82f6"
                />

                <div className="flex-1 min-h-0 overflow-hidden justify-center items-center flex">
                  <StationMap
                    onStationClick={(s) => setSelectedStation(s.id)}
                  />
                </div>
              </div>
              <div className="lg:flex-[2]">
                <StationDetailPanel stationId={selectedStation} />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MapPage;
