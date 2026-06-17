import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useMemo, useState } from "react";
import { FaBalanceScaleLeft, FaExchangeAlt } from "react-icons/fa";
import { IoBook } from "react-icons/io5";
import { LuChartNoAxesCombined } from "react-icons/lu";
import { PiRankingDuotone } from "react-icons/pi";
import CompareMonthlyTable from "../components/CompareMonthlyTable";
import CompareUonzuChart from "../components/CompareUonzuChart";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import InfoPanel from "../components/InfoPanel";
import { useStationDetail } from "../components/Ranking/useRankingData";
import CustomSelect from "../components/UI/CustomSelect";
import SegmentedControl from "../components/UI/SegmentedControl";
import { RawStationData } from "../types/raw";
import { StationId } from "../types/union";
import { CATEGORY_KEYS } from "../utils/category";
import { SectionWithDescription } from "../utils/colorUtils";
import { MetricKey, MetricMeta } from "../utils/metric";
import { PrefKey } from "../utils/pref";
import { loadMaster } from "../utils/ssgLoader";

interface Props {
  masterData: Record<StationId, RawStationData>;
}

const ComparePage: NextPage<Props> = ({ masterData }) => {
  const [id1, setId1] = useState<StationId>("44132"); // 稚内
  const [id2, setId2] = useState<StationId>("62078"); // 東京

  // Prefecture state for filtering
  const [pref1, setPref1] = useState<string>("44");
  const [pref2, setPref2] = useState<string>("62");

  const {
    stationData: s1,
    uonzuData: u1,
    overviewData: o1,
    tableData: t1,
    loading: l1,
  } = useStationDetail(id1);
  const {
    stationData: s2,
    uonzuData: u2,
    overviewData: o2,
    tableData: t2,
    loading: l2,
  } = useStationDetail(id2);

  const uonzuOptions = useMemo(() => {
    const targets = [MetricKey.sm_rain, MetricKey.sm_snowing, MetricKey.sm_sun];
    if (!u1 || !u2) return [];

    return targets
      .filter((meta) => u1.has(meta) || u2.has(meta))
      .map((meta) => ({
        key: meta.key,
        label: meta.label,
        color: meta.color,
        meta: meta,
      }));
  }, [u1, u2]);

  const [selectedBar, setSelectedBar] = useState<MetricMeta>(MetricKey.sm_rain);

  // Sync selectedBar when options change
  if (uonzuOptions.length > 0) {
    if (!uonzuOptions.some((opt) => opt.key === selectedBar.key)) {
      setSelectedBar(uonzuOptions[0].meta);
    }
  }

  const prefOptions = useMemo(() => {
    return Object.values(PrefKey)
      .map((p) => ({
        value: p.code,
        label: p.label,
      }))
      .sort((a, b) => a.value.localeCompare(b.value));
  }, []);

  const stationsByPref1 = useMemo(() => {
    return Object.values(masterData)
      .filter((s) => s.pref === pref1)
      .sort((a, b) => {
        const catA = a.category ? CATEGORY_KEYS[a.category].value : 99;
        const catB = b.category ? CATEGORY_KEYS[b.category].value : 99;
        if (catA !== catB) return catA - catB;
        return (a.station_name || "").localeCompare(b.station_name || "");
      });
  }, [masterData, pref1]);

  const stationsByPref2 = useMemo(() => {
    return Object.values(masterData)
      .filter((s) => s.pref === pref2)
      .sort((a, b) => {
        const catA = a.category ? CATEGORY_KEYS[a.category].value : 99;
        const catB = b.category ? CATEGORY_KEYS[b.category].value : 99;
        if (catA !== catB) return catA - catB;
        return (a.station_name || "").localeCompare(b.station_name || "");
      });
  }, [masterData, pref2]);

  const getCategoryIconByValue = (catValue?: string) => {
    if (!catValue) return null;
    const meta = CATEGORY_KEYS[catValue as keyof typeof CATEGORY_KEYS];
    if (!meta) return null;
    return <span style={{ color: meta.colorFull }}>{meta.icon}</span>;
  };

  const stationOptions1 = useMemo(() => {
    return stationsByPref1.map((s) => ({
      value: s.id,
      label: s.station_name,
      icon: getCategoryIconByValue(s.category),
    }));
  }, [stationsByPref1]);

  const stationOptions2 = useMemo(() => {
    return stationsByPref2.map((s) => ({
      value: s.id,
      label: s.station_name,
      icon: getCategoryIconByValue(s.category),
    }));
  }, [stationsByPref2]);

  // Update station ID when prefecture changes (Render-time sync)
  if (
    stationsByPref1.length > 0 &&
    !stationsByPref1.some((s) => s.id === id1)
  ) {
    setId1(stationsByPref1[0].id);
  }

  if (
    stationsByPref2.length > 0 &&
    !stationsByPref2.some((s) => s.id === id2)
  ) {
    setId2(stationsByPref2[0].id);
  }

  // Initial sync for defaults (Render-time sync)
  const [isInitialized, setIsInitialized] = useState(false);
  if (!isInitialized && masterData) {
    const s1Master = masterData[id1];
    if (s1Master) setPref1(s1Master.pref);
    const s2Master = masterData[id2];
    if (s2Master) setPref2(s2Master.pref);
    setIsInitialized(true);
  }

  const swapStations = () => {
    const tempId = id1;
    const tempPref = pref1;
    setId1(id2);
    setPref1(pref2);
    setId2(tempId);
    setPref2(tempPref);
  };

  const getCategoryIcon = (id: StationId) => {
    const cat = masterData[id]?.category;
    if (!cat) return null;
    const meta = CATEGORY_KEYS[cat];
    return <span style={{ color: meta.colorFull }}>{meta.icon}</span>;
  };

  const getRegionColor = (prefCode: string) => {
    const pref = Object.values(PrefKey).find((p) => p.code === prefCode);
    return pref?.region?.colorStrong || "#3b82f6";
  };

  return (
    <>
      <Head>
        <title>アメダス地点比較 - アメダス図鑑</title>
      </Head>

      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
        <Header />

        <main className="flex-1 pb-16">
          <HeroSection
            title="地点を比較する"
            description="2つのアメダス地点を並べて、気温や降水量の違いを詳しく比較できます。"
            Icon={<FaBalanceScaleLeft />}
            gradient="bg-gradient-to-r from-blue-600 to-indigo-600"
          />

          <div className="max-w-[1200px] mx-auto px-4 mt-8">
            {/* Selector Area */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 mb-10 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
                <div className="flex-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    地点 1: 都道府県
                  </label>
                  <CustomSelect
                    value={pref1}
                    onChange={(v) => setPref1(v as string)}
                    options={prefOptions}
                    activeColor={getRegionColor(pref1)}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    地点 1: 観測所
                  </label>
                  <CustomSelect
                    value={id1}
                    onChange={(v) => setId1(v as StationId)}
                    options={stationOptions1}
                    leftIcon={getCategoryIcon(id1)}
                    activeColor={getRegionColor(pref1)}
                  />
                </div>
              </div>

              <button
                onClick={swapStations}
                className="p-4 rounded-full bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95 shadow-inner shrink-0"
                title="入れ替え"
              >
                <FaExchangeAlt className="rotate-90 lg:rotate-0" />
              </button>

              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
                <div className="flex-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    地点 2: 都道府県
                  </label>
                  <CustomSelect
                    value={pref2}
                    onChange={(v) => setPref2(v as string)}
                    options={prefOptions}
                    activeColor={getRegionColor(pref2)}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    地点 2: 観測所
                  </label>
                  <CustomSelect
                    value={id2}
                    onChange={(v) => setId2(v as StationId)}
                    options={stationOptions2}
                    leftIcon={getCategoryIcon(id2)}
                    activeColor={getRegionColor(pref2)}
                  />
                </div>
              </div>
            </div>

            {/* Comparison Grid */}
            <div className="flex flex-col gap-4 mb-12">
              <SectionWithDescription
                icon={<IoBook />}
                title="地点概要"
                bgColor="#10b981"
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                <InfoPanel
                  stationData={s1}
                  overViewData={o1}
                  loading={l1}
                  isTitle={true}
                />
                <InfoPanel
                  stationData={s2}
                  overViewData={o2}
                  loading={l2}
                  isTitle={true}
                />
              </div>
            </div>

            {/* Combined Uonzu Chart */}
            <div className="flex flex-col gap-4 mb-12">
              <SectionWithDescription
                icon={<LuChartNoAxesCombined />}
                title="雨温図比較"
                bgColor="#3b82f6"
              >
                <SegmentedControl
                  value={selectedBar.key}
                  onChange={(v) => setSelectedBar(MetricKey[v])}
                  options={uonzuOptions}
                  className="ml-2"
                />
              </SectionWithDescription>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 overflow-hidden">
                {u1 && u2 && s1 && s2 ? (
                  <CompareUonzuChart
                    uonzuData1={u1}
                    uonzuData2={u2}
                    name1={s1.station_name}
                    name2={s2.station_name}
                    selectedBar={selectedBar}
                    height="400px"
                  />
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-slate-300 font-bold">
                    データ読み込み中...
                  </div>
                )}
              </div>
            </div>

            {/* Monthly Comparison Table */}
            <div className="flex flex-col gap-4">
              <SectionWithDescription
                icon={<PiRankingDuotone />}
                title="月別データ比較"
                bgColor="#ef4444"
              />

              {l1 || l2 ? (
                <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-4">
                  <div className="animate-spin w-8 h-8 border-4 border-slate-100 border-t-indigo-600 rounded-full"></div>
                  <p className="text-slate-400 font-bold">データを準備中...</p>
                </div>
              ) : (
                <CompareMonthlyTable
                  tableData1={t1}
                  tableData2={t2}
                  station1={s1 ?? null}
                  station2={s2 ?? null}
                />
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const masterData = loadMaster();
    return {
      props: {
        masterData,
      },
    };
  } catch (e) {
    console.error("SSG Error in ComparePage:", e);
    return { notFound: true };
  }
};

export default ComparePage;
