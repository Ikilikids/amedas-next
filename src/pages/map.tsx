// pages/map.tsx
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import Footer from "../components/Footer";
import Header from "../components/Header";
import MapView from "../components/MapView";
import StationDetailPanel from "../components/StationDetailPanel";
import { SelectedStation } from "../types/raw";
import { SectionWithDescription } from "../utils/colorUtils";

// ==============================
//  ページコンポーネント
// ==============================
const MapPage: NextPage = () => {
  const [selectedStation, setSelectedStation] =
    useState<SelectedStation | null>(null);

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

        <main className="flex-1 p-4">
          <div className="max-w-[1280px] mx-auto flex flex-col gap-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FaMapLocationDot className="w-8 h-8" />
              マップから探す
            </h1>

            <div className="text-gray-700 mb-4">
              <div>
                ・地図上のピンをクリックすると、右側(下側)の情報パネルに選択した観測所の基本情報（正式名称、都道府県、市町村）と雨温図が表示されます。
              </div>
              <div>
                ・情報パネルの地点名を押すと、各月の平均気温、最高・最低気温、降水量などの詳細データや、割合グラフを確認できます。データは平年値(1991-2020の平均値)です。
              </div>
              <div>
                ・地図上でピンをドラッグしたり拡大縮小して、他の観測所の位置や周辺情報も簡単に確認できます。
              </div>
              <div>
                ・情報パネルの背景色は、地方を表しています。北海道：紺｜東北：水色｜関東：緑｜中部：黄緑｜北陸：黄｜近畿：橙｜中国：紫｜四国：桃色｜九州：赤｜沖縄：淡桃色
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="h-[400px] lg:h-[750px] lg:flex-[4] xl:flex-[5] overflow-hidden flex flex-col gap-2">
                <h2 className="sr-only">地図</h2>

                <div className="bg-white border rounded-lg">
                  <SectionWithDescription
                    icon={FaMapLocationDot}
                    title="マップ"
                    bgColor=""
                  />
                </div>
                <div className="bg-white border rounded-lg flex-1 min-h-0 overflow-hidden">
                  <MapView onStationClick={setSelectedStation} />
                </div>
              </div>

              <StationDetailPanel stationId={selectedStation?.id} />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MapPage;
