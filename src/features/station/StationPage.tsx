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
import RecentTrendChart from "../../components/RecentTrendChart";
import StationMap from "../../components/StationMap";
import UonzuChart from "../../components/UonzuChart";
import Similar from "../../components/similar";
import RankBadge from "../../svg/RankBadge";

import { SectionWithDescription } from "../../utils/colorUtils";

import { CiViewTable } from "react-icons/ci";
import { FaChartPie } from "react-icons/fa";
import { IoBook } from "react-icons/io5";
import { LuChartNoAxesCombined } from "react-icons/lu";
import CustomSelect from "../../components/UI/CustomSelect";
import SegmentedControl from "../../components/UI/SegmentedControl";
import PrefecturePart from "../../components/prefecturePart";
import { AllData, BadgeData } from "../../types/all";
import { RawData } from "../../types/raw";
import { CATEGORY_KEYS } from "../../utils/category";
import { toAllData } from "../../utils/masterUtils";
import {
  METRIC_CATEGORY_KEYS,
  MetricCategoryValue,
  MetricKey,
  MetricMeta,
} from "../../utils/metric";
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

  const [selectedBar, setSelectedBar] = useState<MetricMeta>(MetricKey.sm_rain);

  const uonzuOptions = useMemo(() => {
    const targets = [MetricKey.sm_rain, MetricKey.sm_snowing, MetricKey.sm_sun];

    return targets
      .filter((meta) => uonzuData.has(meta))
      .map((meta) => {
        const cat = METRIC_CATEGORY_KEYS[meta.category];
        return {
          key: meta.key,
          label: meta.label,
          color: cat.color,
          borderColor: cat.borderColor,
          shadowColor: cat.shadowColor,
          meta: meta, // Store original meta for easier access
        };
      });
  }, [uonzuData]);

  // Ensure selectedBar is valid when uonzuOptions change
  useEffect(() => {
    if (!uonzuOptions.some((opt) => opt.key === selectedBar.key)) {
      if (uonzuOptions.length > 0) {
        setSelectedBar(uonzuOptions[0].meta);
      }
    }
  }, [uonzuOptions, selectedBar.key]);

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

    return Array.from(tabs).map((tab) => {
      const label = tab.replace("日数", "");
      const cat = METRIC_CATEGORY_KEYS[label as MetricCategoryValue];
      return {
        key: tab as ChartType,
        label,
        color: cat?.color,
        borderColor: cat?.borderColor,
        shadowColor: cat?.shadowColor,
      };
    });
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
                <span className="flex gap-2 flex-wrap items-center">
                  {badges &&
                    badges.map((b: BadgeData, i: number) => (
                      <RankBadge key={i} {...b} />
                    ))}
                </span>
              </span>
            }
            description={`${stationData.pref.label} ${stationData.city} / ${stationData.category.label}`}
            Icon={stationData.category.icon}
            gradient={regionGradient}
          />

          <div className="max-w-[1280px] mx-auto w-full flex flex-col lg:flex-row gap-4 p-4">
            <div className="min-w-0 flex flex-col gap-2 flex-[4]">
              <SectionWithDescription
                icon={<IoBook />}
                title="基本データ"
                bgColor={regionColor}
              />

              <div className="flex flex-col lg:flex-row gap-2 items-stretch">
                {/* InfoPanel */}
                <div className="sm:min-w-[420px] flex-1">
                  <InfoPanel
                    stationData={stationData}
                    overViewData={overviewData}
                    loading={false}
                    isTitle={false}
                  />
                </div>

                {/* Map */}
                <div className="lg:flex-1 lg:min-w-0 h-[336px]">
                  <StationMap
                    isMini
                    lat={stationData.lat}
                    lng={stationData.lon}
                  />
                </div>
              </div>

              <SectionWithDescription
                icon={<LuChartNoAxesCombined />}
                title="雨温図"
                bgColor={regionColor}
                description={[
                  `・棒グラフは${selectedBar.label}、折れ線グラフは平均気温・最低気温・最高気温を表しています。`,
                  "・月降水量が500mmを超える地点は、棒グラフの最大値が1000mmになります。",
                ]}
              >
                <SegmentedControl
                  value={selectedBar.key}
                  onChange={(v) => setSelectedBar(MetricKey[v])}
                  options={uonzuOptions}
                  className="ml-2"
                />
              </SectionWithDescription>

              <UonzuChart
                uonzuData={uonzuData}
                selectedBar={selectedBar}
                height="400px"
              />

              <SectionWithDescription
                icon={<FaChartPie />}
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
                icon={<CiViewTable />}
                title="月別気候表"
                bgColor={regionColor}
                description={[
                  "・月ごとの気候データを表形式で表示しています。",
                  "・下段は順位を示しています。タブで切り替えることができます。",
                ]}
              >
                <div className="flex items-center gap-2 ml-2">
                  <CustomSelect
                    value={tableRankValue}
                    onChange={(v) => setTableRankValue(v)}
                    options={tableRankOptions.map((opt) => ({
                      value: opt,
                      label: RankKey[opt].ratioLabel,
                    }))}
                  />
                </div>
              </SectionWithDescription>
              <HyouTable tableData={tableData} rankValue={tableRankValue} />

              {/* 最近のデータセクション */}
              {props.history && props.history.length > 0 && (
                <>
                  <SectionWithDescription
                    icon={<LuChartNoAxesCombined />}
                    title="最近のデータ"
                    bgColor={regionColor}
                    description={[
                      "・気象庁から取得した直近15日間の最高気温推移を表示しています。",
                      "・右側の数値は今年の累計データ（1月1日〜）です。",
                    ]}
                  />
                  <RecentTrendChart
                    history={props.history}
                    stats={props.stats}
                    color={regionColor}
                  />
                </>
              )}
            </div>

            <div className="flex-[1]">
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
