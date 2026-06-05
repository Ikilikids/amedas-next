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
              </>
            }
            Icon={<IoIosTrophy />}
            gradient="bg-gradient-to-r from-amber-500 to-orange-600"
          />

          <div className="max-w-[1280px] mx-auto flex flex-col gap-4 p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="h-[450px] lg:h-[750px] lg:flex-[4] xl:flex-[5] flex flex-col gap-4">
                <SectionWithDescription
                  icon={<IoIosTrophy />}
                  title="ランキング"
                  bgColor="#f59e0b"
                />
                <div className="bg-white border border-slate-200 rounded-3xl flex-1 min-h-0 overflow-hidden shadow-sm">
                  <Ranking onStationClick={setSelectedStation} />
                </div>
              </div>

              <div className="lg:flex-[2]">
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
