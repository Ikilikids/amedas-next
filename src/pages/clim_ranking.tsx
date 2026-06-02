import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { IoIosTrophy } from "react-icons/io";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import Ranking from "../components/Ranking/index";
import { RawRankingData } from "../components/Ranking/types";

import StationDetailPanel from "../components/StationDetailPanel";
import { SectionWithDescription } from "../utils/colorUtils";

// ==============================
//  ページコンポーネント
// ==============================
const RankingPage: NextPage = () => {
  const [selectedStation, setSelectedStation] = useState<RawRankingData | null>(
    null
  );

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

        <main className="flex-1">
          <HeroSection
            title="ランキングから探す"
            description={
              <>
                ・ランキングをクリックすると、右側(下側)の情報パネルに選択した観測所の基本情報（正式名称、都道府県、市町村）と雨温図が表示されます。
                <br />
                ・情報パネルの地点名を押すと、各月の平均気温、最高・最低気温、降水量などの詳細データや、割合グラフを確認できます。データは平年値(1991-2020の平均値)です。
                <br />
                ・気温関連のデータについては、太平洋の島嶼部は気温が極端に高いため、区別のためランクに順位に*がついています。
                <br />
                ・情報パネルの背景色は、地方を表しています。
              </>
            }
            Icon={<IoIosTrophy />}
            gradient="bg-gradient-to-r from-amber-500 to-orange-600"
          />

          <div className="max-w-[1280px] mx-auto flex flex-col gap-4 p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="h-[400px] lg:h-[750px] lg:flex-[4] xl:flex-[5] flex flex-col gap-4">
                <SectionWithDescription
                  icon={<IoIosTrophy />}
                  title="ランキング"
                  bgColor="#f59e0b"
                />
                <div className="bg-white border border-slate-200 rounded-3xl flex-1 min-h-0 overflow-hidden shadow-sm">
                  <Ranking onStationClick={setSelectedStation} />
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

export default RankingPage;
