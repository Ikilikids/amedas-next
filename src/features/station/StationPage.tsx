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
import { CHART_METRICS } from "../../components/LayeredPieChart/constants";
import CustomSelect from "../../components/UI/CustomSelect";
import SegmentedControl from "../../components/UI/SegmentedControl";
import PrefecturePart from "../../components/prefecturePart";
import { AllData, BadgeData } from "../../types/all";
import { RawData } from "../../types/raw";
import { CATEGORY_KEYS } from "../../utils/category";
import { toAllData } from "../../utils/masterUtils";
import { MetricKey, MetricMeta, MetricTab, MetricValue } from "../../utils/metric";
import { RankKey, RankValue, isIslandId } from "../../utils/rank";

const BASE_RANK_VALUES: RankValue[] = ["top", "bot", "region", "pre"];

const StationPage = (props: RawData) => {
  const allData: AllData = useMemo(() => {
    try {
      if (!props || !props.station) return {} as AllData;
      return toAllData(props);
    } catch (e) {
      console.error("[StationPage] toAllData failed:", e, props);
      throw e;
    }
  }, [props]);

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

  const uonzuOptions = useMemo(() => {
    try {
      const targets = [MetricKey.sm_rain, MetricKey.sm_snowing, MetricKey.sm_sun];
      if (!uonzuData || !(uonzuData instanceof Map)) {
        return [];
      }

      return targets
        .filter((meta) => meta && uonzuData.has(meta))
        .map((meta) => ({
          key: meta.key,
          label: meta.label,
          color: meta.color,
          meta: meta,
        }));
    } catch (e) {
      console.error("[StationPage] Error in uonzuOptions useMemo:", e);
      return [];
    }
  }, [uonzuData]);

  // 初期値は MetricKey.sm_rain。ただし uonzuOptions に含まれるものを優先する
  const [selectedBar, setSelectedBar] = useState<MetricMeta>(MetricKey.sm_rain);

  // データが切り替わった時に選択中のバーが新データになければリセット (Render-time synchronization)
  const [prevUonzuOptions, setPrevUonzuOptions] = useState(uonzuOptions);
  if (uonzuOptions !== prevUonzuOptions) {
    setPrevUonzuOptions(uonzuOptions);
    if (uonzuOptions.length > 0) {
      const currentExists = uonzuOptions.some((opt) => opt.key === selectedBar?.key);
      if (!currentExists) {
        setSelectedBar(uonzuOptions[0].meta);
      }
    }
  }

  // Ratio Chart States
  const [ratioMonth, setRatioMonth] = useState<number | null>(null);
  const [ratioRankValue, setRatioRankValue] = useState<RankValue>(
    RankKey.top.key
  );

  // Table State
  const [tableRankValue, setTableRankValue] = useState<RankValue>(
    RankKey.top.key
  );

  const typeOptions = useMemo(() => {
    try {
      const tabs = new Set<string>();
      if (ratioData && ratioData instanceof Map) {
        for (const meta of ratioData.keys()) {
          if (meta && meta.tab) tabs.add(meta.tab);
        }
      }

      return Object.keys(CHART_METRICS)
        .filter((p) => tabs.has(p))
        .map((tab) => {
          const label = tab.replace("日数", "");
          const schema = CHART_METRICS[tab];
          if (!schema || !Array.isArray(schema)) return null;

          const baseMetric = schema[tab === "気温日数" ? 0 : (schema.length > 2 ? 2 : 0)]?.metric as MetricMeta;
          const baseColor = baseMetric?.color || "#64748b";

          return { key: tab as ChartType, label, color: baseColor };
        }).filter((opt): opt is NonNullable<typeof opt> => opt !== null);
    } catch (e) {
      console.error("[StationPage] Error in typeOptions useMemo:", e);
      return [];
    }
  }, [ratioData]);

  // Ratio Chart States
  const [ratioType, setRatioType] = useState<ChartType | null>(null);

  // 地点やタブ構成が変わった時の同期 (Render-time synchronization)
  const [prevTypeOptions, setPrevTypeOptions] = useState(typeOptions);
  const [prevStationId, setPrevStationId] = useState(stationData?.id);
  if (typeOptions !== prevTypeOptions || stationData?.id !== prevStationId) {
    setPrevTypeOptions(typeOptions);
    setPrevStationId(stationData?.id);
    if (typeOptions.length > 0) {
      const currentExists = typeOptions.some((opt) => opt.key === ratioType);
      if (!currentExists || !ratioType) {
        setRatioType(typeOptions[0].key);
      }
    } else {
      setRatioType(null);
    }
  }

  const ratioRankOptions = useMemo(() => {
    const isMeteo = stationData?.category === CATEGORY_KEYS.meteo;
    const isIsland = isIslandId(stationData?.id || "");
    const rankValues = new Set<RankValue>(BASE_RANK_VALUES);

    if (isMeteo) rankValues.add("meteo");
    if (!isIsland && ratioType === "気温日数") rankValues.add("island");

    return Array.from(rankValues);
  }, [ratioType, stationData?.id, stationData?.category]);

  const tableRankOptions = useMemo(() => {
    const isMeteo = stationData?.category === CATEGORY_KEYS.meteo;
    const isIsland = isIslandId(stationData?.id || "");
    const rankValues = new Set<RankValue>(BASE_RANK_VALUES);

    if (isMeteo) rankValues.add("meteo");
    if (
      !isIsland &&
      tableData instanceof Map &&
      Array.from(tableData.keys() || []).some((meta) => meta?.key === "av_avtemp")
    )
      rankValues.add("island");

    return Array.from(rankValues);
  }, [tableData, stationData?.id, stationData?.category]);

  // データの存在チェック（ガード） - Hookの後に移動
  if (!props || !props.station) {
    console.warn("[StationPage] Missing props.station, showing loading state.");
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold animate-pulse">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  const isMeteo = stationData?.category === CATEGORY_KEYS.meteo;
  const isIsland = isIslandId(stationData?.id || "");

  const regionColor = stationData?.pref?.region?.colorBase || "#777777";
  const regionGradient = `linear-gradient(to right, ${stationData?.pref?.region?.colorStrong || "#777777"}, ${stationData?.pref?.region?.colorBase || "#999999"})`;

  return (
    <>
      <Head>
        <title>{`${stationData?.official_name || "読み込み中..."} - アメダス図鑑`}</title>
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <main className="flex-1">
          <HeroSection
            title={
              <span className="flex gap-2 flex-wrap items-center">
                {stationData?.official_name || "地点名不明"}
                <span className="flex gap-2 flex-wrap items-center">
                  {badges && Array.isArray(badges) &&
                    badges.map((b: BadgeData, i: number) => (
                      b && b.metric && <RankBadge key={`${b.metric.key || "badge"}-${i}`} {...b} />
                    ))}
                </span>
              </span>
            }
            description={`${stationData?.pref?.label || ""} ${stationData?.city || ""} / ${stationData?.category?.label || ""}`}
            Icon={stationData?.category?.icon}
            gradient={regionGradient}
            lastUpdateLabel="最終更新"
            lastUpdateValue={props.lastUpdate}
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
                    lat={stationData?.lat}
                    lng={stationData?.lon}
                  />
                </div>
              </div>

              <SectionWithDescription
                icon={<LuChartNoAxesCombined />}
                title="雨温図"
                bgColor={regionColor}
                description={[
                  `・棒グラフは${selectedBar?.label || "降水量"}、折れ線グラフは平均気温・最低気温・最高気温を表しています。`,
                  "・月降水量が500mmを超える地点は、棒グラフの最大値が1000mmになります。",
                ]}
              >
                <SegmentedControl
                  value={selectedBar?.key}
                  onChange={(v) => {
                    const next = MetricKey[v as MetricValue];
                    if (next) setSelectedBar(next);
                  }}
                  options={uonzuOptions || []}
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
                  metricTab: ratioType || "気温日数",
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
                    options={(tableRankOptions || [])
                      .filter((opt) => opt && RankKey[opt])
                      .map((opt) => ({
                        value: opt,
                        label: RankKey[opt]?.ratioLabel || "不明",
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
                      "・気象庁から取得した直近15日間の最高・最低気温と降水量の推移を表示しています。",
                      "・上部の数値は今年の累計・極値データ（1月1日〜）です。",
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
