// features/station/StationPage.tsx

import Head from "next/head";
import { useMemo, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import HeroSection from "../../components/HeroSection";
import HyouTable from "../../components/HyouTable";
import InfoPanel from "../../components/InfoPanel";
import LayeredPieChart from "../../components/LayeredPieChart";
import ChartControls from "../../components/LayeredPieChart/ChartControls";
import { RANK_OPTIONS_ALL } from "../../components/LayeredPieChart/constants";
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
import { toAllData } from "../../utils/masterUtils";
import { RankKey, RankValue } from "../../utils/rank";

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
  const [ratioType, setRatioType] = useState<ChartType>("気温日数");
  const [ratioMonth, setRatioMonth] = useState<number | null>(null);
  const [ratioRankValue, setRatioRankValue] = useState<RankValue>(
    RankKey.top.key
  );

  const regionColor = stationData.pref.region.colorBase;
  const regionGradient = `linear-gradient(to right, ${stationData.pref.region.colorStrong}, ${stationData.pref.region.colorBase})`;

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

  const availableRankValues = useMemo(() => {
    const values = new Set<RankValue>();
    if (ratioData) {
      for (const [meta, entries] of ratioData.entries()) {
        if (meta.tab === ratioType) {
          for (const entry of entries) {
            if (entry.top !== undefined) values.add("top");
            if (entry.bot !== undefined) values.add("bot");
            if (entry.island !== undefined) values.add("island");
            if (entry.region !== undefined) values.add("region");
            if (entry.pre !== undefined) values.add("pre");
            if (entry.meteo !== undefined) values.add("meteo");
          }
        }
      }
    }
    return values;
  }, [ratioData, ratioType]);

  const rankOptions = RANK_OPTIONS_ALL.filter((opt) =>
    availableRankValues.has(opt)
  );

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

          <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-4 p-4">
            <div className="flex-[5] flex flex-col gap-2">
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
                  `・棒グラフは${selectedBar}、折れ線グラフは平均気温・最低気温・最高気温を表しています。`,
                  "・月降水量が500mmを超える地点は、棒グラフの最大値が1000mmになります。",
                ]}
              >
                <select
                  value={selectedBar}
                  onChange={(e) => setSelectedBar(e.target.value as any)}
                  className="ml-2 border rounded"
                >
                  <option value="rain">降水量</option>
                  <option value="snowing">降雪量</option>
                  <option value="sun">日照時間</option>
                </select>
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
                  rankOptions={rankOptions}
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
              />
              <HyouTable tableData={tableData} />
            </div>

            <div className="flex-[2]">
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
