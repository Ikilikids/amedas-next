// pages/map.jsx
import Head from "next/head";
import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import Footer from "../components/Footer";
import Header from "../components/Header";
import InfoPanel from "../components/InfoPanel";
import MapView from "../components/MapView";
import { getRegionColor } from "../utils/colorUtils";

// --- SSR: 初期駅データ取得 ---

export default function MapPage({}) {
  const [selectedStation, setSelectedStation] = useState(null);

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
              <FaMapMarkerAlt className="w-8 h-8 text-red-500" />
              マップから探す
            </h1>

            <div className="text-gray-700 mb-4">
              <div>
                ・地図上のピンをクリックすると、右側の情報パネルに選択した観測所の基本情報（正式名称、都道府県、市町村）と雨温図が表示されます。
              </div>
              <div>
                ・情報パネルの「詳細」ボタンを押すと、各月の平均気温、最高・最低気温、降水量などの詳細データや、割合グラフを確認できます。
              </div>
              <div>
                ・地図上でピンをドラッグしたり拡大縮小して、他の観測所の位置や周辺情報も簡単に確認できます。
              </div>
              <div>
                ・情報パネルの背景色は、地方を表しています。北海道：紺｜東北：水色｜関東：緑｜中部：黄緑｜北陸：黄｜近畿：橙｜中国：紫｜四国：桃色｜九州：赤｜沖縄：淡桃色
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              {/* 左：地図 */}
              <div className="h-[400px] lg:h-[700px] lg:flex-[4] xl:flex-[5] border rounded-lg overflow-hidden shadow bg-white">
                <h2 className="sr-only">地図</h2>
                <MapView onStationClick={setSelectedStation} />
              </div>

              {/* 右：情報パネル */}
              <div
                className="h-[700px] lg:flex-[2] xl:flex-[2] border rounded-lg overflow-auto shadow"
                style={{
                  backgroundColor: selectedStation
                    ? getRegionColor(selectedStation.都道府県)
                    : "white",
                }}
              >
                <h2 className="sr-only">情報パネル</h2>

                <InfoPanel stationId={selectedStation?.id} />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
