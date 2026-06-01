// features/station/StationPage.tsx

import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import HeroSection from "../../components/HeroSection";
import HyouTable from "../../components/HyouTable";
import InfoPanel from "../../components/InfoPanel";
import LayeredPieChart from "../../components/LayeredPieChart";
import ChartControls from "../../components/LayeredPieChart/ChartControls";
import { ChartType } from "../../components/LayeredPieChart/types";
import MiniMap from "../../components/MiniMap";
import UonzuChart from "../../components/UonzuChart";
import Similar from "../../components/similar";
import RankBadge from "../../svg/RankBadge";

import { SectionWithDescription } from "../../utils/colorUtils";

import { CiViewTable } from "react-icons/ci";
import { FaChartPie } from "react-icons/fa";
import { IoBook } from "react-icons/io5";
import { LuChartNoAxesCombined } from "react-icons/lu";
import PrefecturePart from "../../components/prefecturePart";
import { AllData, BadgeData } from "../../types/all";
import { RawData } from "../../types/raw";
import { CATEGORY_KEYS } from "../../utils/category";
import { toAllData } from "../../utils/masterUtils";
import { RankKey, RankValue, isIslandId } from "../../utils/rank";

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

  const [selectedBar, setSelectedBar] = useState<"rain" | "snowing" | "sun">(
    "rain"
  );

  // Ratio Chart States
  const [ratioMonth, setRatioMonth] = useState<number | null>(null);
  const [ratioRankValue, setRatioRankValue] = useState<RankValue>(
    RankKey.top.key
  );

  // Table State
  const [tableRankValue, setTableRankValue] = useState<RankValue>(
    RankKey.top.key
  );

  const regionColor = stationData.pref.region.colorBase;
  const regionGradient = `linear-gradient(to right, ${stationData.pref.region.colorStrong}, ${stationData.pref.region.colorBase})`;

  // Ratio Chart States
  const [ratioType, setRatioType] = useState<ChartType | null>(null);

  const typeOptions = useMemo(() => {
    const tabs = new Set<string>();

    if (ratioData) {
      for (const meta of ratioData.keys()) {
        if (meta.tab.endsWith("日数")) {
          tabs.add(meta.tab);
        }
      }
    }

    return Array.from(tabs).map((tab) => ({
      key: tab as ChartType,
      label: tab.replace("日数", ""),
    }));
  }, [ratioData]);

  useEffect(() => {
    setRatioType(null);
  }, [stationData.id]);
  // ★これが本体
  useEffect(() => {
    if (
      ratioType === null ||
      !typeOptions.some((opt) => opt.key === ratioType)
    ) {
      setRatioType(typeOptions[0]?.key ?? null);
    }
  }, [typeOptions, ratioType]);

  const isMeteo = stationData.category === CATEGORY_KEYS.meteo;
  const isIsland = isIslandId(stationData.id);

  const baseRankValues: RankValue[] = ["top", "bot", "region", "pre"];

  const ratioRankOptions = useMemo(() => {
    const rankValues = new Set<RankValue>(baseRankValues);

    if (isMeteo) rankValues.add("meteo");
    if (!isIsland && ratioType === "気温日数") rankValues.add("island");

    return Array.from(rankValues);
  }, [ratioType]);

  const tableRankOptions = useMemo(() => {
    const rankValues = new Set<RankValue>(baseRankValues);

    if (isMeteo) rankValues.add("meteo");
    if (
      !isIsland &&
      Array.from(tableData.keys()).some((meta) => meta.key === "av_avtemp")
    )
      rankValues.add("island");

    return Array.from(rankValues);
  }, [tableData]);

  return (
    <>
      <Head>
        <title>{`${stationData.official_name} - アメダス図鑑`}</title>
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <main className="flex-1">
          <HeroSection
            title={
              <span className="flex gap-2 flex-wrap items-center">
                {stationData.official_name}
                {badges &&
                  badges.map((b: BadgeData, i: number) => (
                    <RankBadge key={i} {...b} />
                  ))}
              </span>
            }
            description={`${stationData.pref.label} ${stationData.city} / ${stationData.category.label}`}
            Icon={stationData.category.icon}
            gradient={regionGradient}
          />

          <div className="max-w-[1280px] mx-auto w-full flex flex-col lg:flex-row gap-4 p-4">
            <div className="flex-[5] min-w-0 flex flex-col gap-2">
              <SectionWithDescription
                icon={IoBook}
                title="基本データ"
                bgColor={regionColor}
              />

              <div className="flex gap-2">
                <InfoPanel
                  stationData={stationData}
                  overViewData={overviewData}
                  loading={false}
                  isTitle={false}
                />
                <MiniMap
                  lat={stationData.lat}
                  lng={stationData.lon}
                  height="280px"
                />
              </div>

              <SectionWithDescription
                icon={LuChartNoAxesCombined}
                title="雨温図"
                bgColor={regionColor}
                description={[
                  `・棒グラフは${
                    selectedBar === "rain"
                      ? "降水量"
                      : selectedBar === "snowing"
                      ? "降雪量"
                      : "日照時間"
                  }、折れ線グラフは平均気温・最低気温・最高気温を表しています。`,
                  "・月降水量が500mmを超える地点は、棒グラフの最大値が1000mmになります。",
                ]}
              >
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner ml-2">
                  {[
                    { key: "rain", label: "降水量" },
                    { key: "snowing", label: "降雪量" },
                    { key: "sun", label: "日照時間" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setSelectedBar(opt.key as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-tighter transition-all duration-200 ${
                        selectedBar === opt.key
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </SectionWithDescription>

              <UonzuChart
                uonzuData={uonzuData}
                selectedBar={selectedBar}
                height="800px"
              />

              <SectionWithDescription
                icon={FaChartPie}
                title="割合データ"
                bgColor={regionColor}
                description={[
                  "・各要素の日数割合を表しています。",
                  "・タブから、要素、月、順位別に切り替えることができます。",
                ]}
              >
                <ChartControls
                  type={ratioType}
                  setType={setRatioType}
                  selectedMonth={ratioMonth}
                  setSelectedMonth={setRatioMonth}
                  rankType={ratioRankValue}
                  setRankType={setRatioRankValue}
                  rankOptions={ratioRankOptions}
                  typeOptions={typeOptions}
                />
              </SectionWithDescription>
              <LayeredPieChart
                ratioData={ratioData}
                ratioInfo={{
                  metricTab: ratioType,
                  ranking: ratioRankValue,
                  isCut: false,
                }}
                selectedMonth={ratioMonth}
                rankType={ratioRankValue}
              />

              <SectionWithDescription
                icon={CiViewTable}
                title="月別気候表"
                bgColor={regionColor}
                description={[
                  "・月ごとの気候データを表形式で表示しています。",
                  "・下段は順位を示しています。タブで切り替えることができます。",
                ]}
              >
                <div className="flex items-center gap-2 ml-2">
                  <div className="relative">
                    <select
                      value={tableRankValue}
                      onChange={(e) =>
                        setTableRankValue(e.target.value as RankValue)
                      }
                      className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-1.5 pr-8 text-xs font-black text-slate-700 shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all cursor-pointer"
                    >
                      {tableRankOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {RankKey[opt].ratioLabel}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[8px]">
                      ▼
                    </div>
                  </div>
                </div>
              </SectionWithDescription>
              <HyouTable tableData={tableData} rankValue={tableRankValue} />
            </div>

            <div className="flex-[2] min-w-0">
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
