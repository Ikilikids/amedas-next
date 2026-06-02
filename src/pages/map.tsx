// pages/map.tsx
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import MapView from "../components/MapView";
import StationDetailPanel from "../components/StationDetailPanel";
import { SectionWithDescription } from "../utils/colorUtils";

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
      </Head>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <main className="flex-1">
          <HeroSection
            title="マップから探す"
            description={
              <>
                ・地図上のピンをクリックすると、右側(下側)の情報パネルに選択した観測所の基本情報（正式名称、都道府県、市町村）と雨温図が表示されます。
                <br />
                ・情報パネルの地点名を押すと、各月の平均気温、最高・最低気温、降水量などの詳細データや、割合グラフを確認できます。データは平年値(1991-2020の平均値)です。
                <br />
                ・地図上でピンをドラッグしたり拡大縮小して、他の観測所の位置や周辺情報も簡単に確認できます。
                <br />
                ・情報パネルの背景色は、地方を表しています。
              </>
            }
            Icon={<FaMapLocationDot />}
            gradient="bg-gradient-to-r from-blue-600 to-cyan-700"
          />

          <div className="max-w-[1280px] mx-auto flex flex-col gap-4 p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="h-[400px] lg:h-[750px] lg:flex-[4] xl:flex-[5] flex flex-col gap-4">
                <SectionWithDescription
                  icon={<FaMapLocationDot />}
                  title="マップ"
                  bgColor="#3b82f6"
                />

                <div className="bg-white border border-slate-200 rounded-3xl flex-1 min-h-0 overflow-hidden shadow-sm">
                  <MapView onStationClick={(s) => setSelectedStation(s.id)} />
                </div>
              </div>

              <StationDetailPanel stationId={selectedStation} />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MapPage;
