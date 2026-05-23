import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { IoIosTrophy } from "react-icons/io";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Ranking from "../components/Ranking/index";
import { Station } from "../components/Ranking/types";

import StationDetailPanel from "../components/StationDetailPanel";
import { SectionWithDescription } from "../utils/colorUtils";

// ==============================
//  ページコンポーネント
// ==============================
const RankingPage: NextPage = () => {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  return (
    <>
      <Head>
        <title>{`平年値ランキング - アメダス図鑑`}</title>
        <meta
          name="description"
          content={`平年値ランキングを確認できます。雨温図、熱帯夜、猛暑日などの詳細データも確認できます。割合データなど詳細なデータを完備しています。`}
        />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <main className="flex-1 p-4">
          <div className="max-w-[1280px] mx-auto flex flex-col gap-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <IoIosTrophy className="w-8 h-8" />
              ランキングから探す
            </h1>

            <div className="text-gray-700 mb-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div>
                ・ランキングをクリックすると、右側(下側)の情報パネルに選択した観測所の基本情報（正式名称、都道府県、市町村）と雨温図が表示されます。
              </div>
              <div>
                ・情報パネルの地点名を押すと、各月の平均気温、最高・最低気温、降水量などの詳細データや、割合グラフを確認できます。データは平年値(1991-2020の平均値)です。
              </div>
              <div>
                ・気温関連のデータについては、太平洋の島嶼部は気温が極端に高いため、区別のためランクに順位に*がついています。
              </div>
              <div>
                ・情報パネルの背景色は、地方を表しています。北海道：紺｜東北：水色｜関東：緑｜中部：黄緑｜北陸：黄｜近畿：橙｜中国：紫｜四国：桃色｜九州：赤｜沖縄：淡桃色
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="h-[600px] lg:h-[800px] lg:flex-[4] xl:flex-[5] overflow-hidden flex flex-col gap-2">
                <div className="bg-white border rounded-lg">
                  <SectionWithDescription
                    icon={IoIosTrophy}
                    title="ランキング"
                    bgColor=""
                  />
                </div>
                <div className="flex-1 min-h-0 overflow-hidden bg-white rounded-lg border shadow-sm">
                  <Ranking onStationClick={setSelectedStation} />
                </div>
              </div>

              <div className="lg:flex-[3] xl:flex-[2]">
                <StationDetailPanel stationId={selectedStation?.id} />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default RankingPage;
