// src/pages/gacha.tsx
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import {
  FaDice,
  FaVolumeMute,
  FaVolumeUp
} from "react-icons/fa";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";

// Gacha Modular Hooks & Components
import { CollectionDashboard } from "../components/Gacha/CollectionDashboard";
import { DropRatesPanel } from "../components/Gacha/DropRatesPanel";
import { GachaMachine } from "../components/Gacha/GachaMachine";
import { ProgressPanel } from "../components/Gacha/ProgressPanel";
import { RevealPanel } from "../components/Gacha/RevealPanel";
import { StationRaw } from "../components/Gacha/gachaUtils";
import { useGacha } from "../components/Gacha/useGacha";

// SSG Utilities
import { RawOverviewData } from "../types/raw";
import { StationId } from "../types/union";
import { getStation } from "../utils/climateCache";
import { assembleDisplayData } from "../utils/rankingUtils";
import { ensureAllDataLoaded, loadMaster } from "../utils/ssgLoader";

interface Props {
  stations: StationRaw[];
  stationsOverview: Record<string, RawOverviewData>;
}

const GachaPage: NextPage<Props> = ({ stations: initialStations, stationsOverview }) => {
  const {
    stations,
    loading,
    collection,
    muted,
    setMuted,
    isSpinning,
    drawnCards,
    showReveal,
    setShowReveal,
    revealIndex,
    setRevealIndex,
    animationClass,
    setAnimationClass,
    hasDrawnThisPeriod,
    nextGachaMessage,
    handleDrawTen,
    handleResetCollection,
  } = useGacha(initialStations, stationsOverview);

  return (
    <>
      <Head>
        <title>アメダス・ガチャ ＆ カードコレクション - アメダス図鑑</title>
        <meta
          name="description"
          content="全国約1,300地点のアメダス観測所をガチャで引き当てて自分だけのカード図鑑を完成させよう！離島や標高の高いレア地点、歴史ある気象台などをコレクションできます。"
        />
        <link rel="canonical" href="https://amedas-next--amedas-ppp.asia-east1.hosted.app/gacha" />
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            10%, 30%, 50%, 70%, 90% { transform: translate(-3px, 1px) rotate(-1deg); }
            20%, 40%, 60%, 80% { transform: translate(3px, -1px) rotate(1deg); }
          }
          .animate-shake {
            animation: shake 0.6s ease-in-out;
          }

          @keyframes drop {
            0% { transform: translateY(-120px) scale(0.6); opacity: 0; }
            60% { transform: translateY(8px) scale(1.05); opacity: 1; }
            80% { transform: translateY(-4px) scale(0.98); }
            100% { transform: translateY(0) scale(1); }
          }
          .animate-drop {
            animation: drop 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          }

          @keyframes rainbow-border {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .rainbow-gradient {
            background: linear-gradient(270deg, #ff3b30, #ff9500, #ffcc00, #4cd964, #5ac8fa, #007aff, #5856d6);
            background-size: 300% 300%;
            animation: rainbow-border 6s ease infinite;
          }

          @keyframes shimmer {
            0% { transform: translateX(-150%) rotate(45deg); }
            100% { transform: translateX(150%) rotate(45deg); }
          }
          .shimmer-sweep {
            position: relative;
            overflow: hidden;
          }
          .shimmer-sweep::after {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 200%; height: 100%;
            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
            transform: translateX(-100%) rotate(45deg);
            animation: shimmer 2s infinite;
          }
        `}</style>
      </Head>

      <div className="min-h-screen bg-[#fcfcfd] text-slate-800 flex flex-col font-sans">
        <Header />

        <main className="flex-1 pb-16">
          <HeroSection
            title={
              <span className="flex items-center gap-3">
                アメダス・ガチャ
              </span>
            }
            description="日本全国約1,300地点のアメダス観測所をガチャで回して、あなただけの観測所図鑑を完成させよう！"
            Icon={<FaDice />}
            gradient="bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950"
          />

          <div className="max-w-[1280px] mx-auto px-4 mt-8">
            {/* Top Toolbar: Sound toggle */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setMuted(!muted)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all shadow-md cursor-pointer"
              >
                {muted ? (
                  <>
                    <FaVolumeMute className="text-red-400" />
                    <span>ミュート中</span>
                  </>
                ) : (
                  <>
                    <FaVolumeUp className="text-green-400" />
                    <span>効果音あり</span>
                  </>
                )}
              </button>
            </div>

            {/* Top Row: Left Gacha machine, Right stats */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
              
              {/* Left Column: Gacha Machine */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center">
                <GachaMachine
                  isSpinning={isSpinning}
                  loading={loading}
                  onDrawTen={handleDrawTen}
                  hasDrawnThisPeriod={hasDrawnThisPeriod}
                  nextGachaMessage={nextGachaMessage}
                />
              </div>

              {/* Right Column: Progress stats panel & Drop rates */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                <ProgressPanel
                  collection={collection}
                  stations={stations}
                  loading={loading}
                  stationsOverview={stationsOverview}
                />

                {/* Drop Rates & Criteria */}
                <DropRatesPanel stations={stations} stationsOverview={stationsOverview} />
              </div>

            </div>

            {/* Reveal Area: Only visible when cards are drawn */}
            <RevealPanel
              showReveal={showReveal}
              setShowReveal={setShowReveal}
              drawnCards={drawnCards}
              revealIndex={revealIndex}
              setRevealIndex={setRevealIndex}
              collection={collection}
              animationClass={animationClass}
              setAnimationClass={setAnimationClass}
              muted={muted}
              stationsOverview={stationsOverview}
            />

            {/* Bottom Row: Full-width Stamp Rally Card Collection */}
            <div className="mt-8">
              <CollectionDashboard
                collection={collection}
                stations={stations}
                onReset={handleResetCollection}
                stationsOverview={stationsOverview}
              />
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  ensureAllDataLoaded();
  const master = loadMaster();
  const stationsOverview: Record<string, RawOverviewData> = {};

  Object.keys(master).forEach((id) => {
    const integratedData = getStation(id as StationId);
    const { overview } = assembleDisplayData(integratedData as any);
    stationsOverview[id] = overview;
  });

  const stations = Object.values(master) as StationRaw[];

  return {
    props: {
      stations,
      stationsOverview,
    },
  };
};

export default GachaPage;
