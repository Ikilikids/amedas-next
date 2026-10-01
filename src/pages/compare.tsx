import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useMemo, useState } from "react";
import { FaBalanceScaleLeft, FaExchangeAlt } from "react-icons/fa";
import { IoBook } from "react-icons/io5";
import { LuChartNoAxesCombined } from "react-icons/lu";
import { PiRankingDuotone } from "react-icons/pi";
import CompareMonthlyTable from "../components/Compare/CompareMonthlyTable";
import CompareUonzuChart from "../components/Compare/CompareUonzuChart";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import InfoPanel from "../components/InfoPanel";
import { useStationDetail } from "../hooks/useStationDetail";
import CustomSelect from "../components/UI/CustomSelect";
import { RawStationData } from "../types/raw";
import { StationId } from "../types/union";
import { CategoryKey } from "../setting/category";
import { SectionWithDescription } from "../utils/colorUtils";
import { MetricKey, MetricMeta } from "../setting/metric";
import { PrefKey } from "../setting/pref";
import { loadMaster } from "../utils/ssgLoader";
import { resisterMaster } from "../utils/climateDataManager";

interface Props {
  masterData: Record<StationId, RawStationData>;
}

const ComparePage: NextPage<Props> = ({ masterData }) => {
  resisterMaster(masterData);
  const [id1, setId1] = useState<StationId>("44132"); // 稚内
  const [id2, setId2] = useState<StationId>("62078"); // 東京

  // Prefecture state for filtering
  const [pref1, setPref1] = useState<string>(PrefKey.tokyo.label);
  const [pref2, setPref2] = useState<string>(PrefKey.osaka.label);

  const {
    stationData: s1,
    climateData: c1,
    uonzuData: u1,
    tableData: t1,
    loading: l1,
  } = useStationDetail(id1, masterData);
  const {
    stationData: s2,
    climateData: c2,
    uonzuData: u2,
    tableData: t2,
    loading: l2,
  } = useStationDetail(id2, masterData);

  const uonzuOptions = useMemo(() => {
    const targets = [MetricKey.sm_rain, MetricKey.sm_snowing, MetricKey.sm_sun];
    if (!u1 || !u2) return [];

    return targets
      .filter((meta) => u1.has(meta) || u2.has(meta))
      .map((meta) => ({
        value: meta.key,
        label: meta.label,
        color: meta.color,
        meta: meta,
      }));
  }, [u1, u2]);

  const [selectedBar, setSelectedBar] = useState<MetricMeta>(MetricKey.sm_rain);

  // Sync selectedBar when options change
  if (uonzuOptions.length > 0) {
    if (!uonzuOptions.some((opt) => opt.value === selectedBar.key)) {
      setSelectedBar(uonzuOptions[0].meta);
    }
  }

  const prefOptions = useMemo(() => {
    return Object.values(PrefKey)
      .map((p) => ({
        value: p.label,
        label: p.label,
        code: Number(p.code[0]),
      }))
      .sort((a, b) => a.code - b.code);
  }, []);

  const selectedPrefObj1 = useMemo(() => {
    return Object.values(PrefKey).find((p) => p.label === pref1 || p.code.includes(pref1)) || PrefKey.tokyo;
  }, [pref1]);

  const selectedPrefObj2 = useMemo(() => {
    return Object.values(PrefKey).find((p) => p.label === pref2 || p.code.includes(pref2)) || PrefKey.osaka;
  }, [pref2]);

  const stationsByPref1 = useMemo(() => {
    return Object.values(masterData)
      .filter((s) => selectedPrefObj1.code.includes(s.pref))
      .sort((a, b) => {
        const catA = a.category ? CategoryKey[a.category].value : 99;
        const catB = b.category ? CategoryKey[b.category].value : 99;
        if (catA !== catB) return catA - catB;
        return (a.station_name || "").localeCompare(b.station_name || "");
      });
  }, [masterData, selectedPrefObj1]);

  const stationsByPref2 = useMemo(() => {
    return Object.values(masterData)
      .filter((s) => selectedPrefObj2.code.includes(s.pref))
      .sort((a, b) => {
        const catA = a.category ? CategoryKey[a.category].value : 99;
        const catB = b.category ? CategoryKey[b.category].value : 99;
        if (catA !== catB) return catA - catB;
        return (a.station_name || "").localeCompare(b.station_name || "");
      });
  }, [masterData, selectedPrefObj2]);

  const getCategoryIconByValue = (catValue?: string) => {
    if (!catValue) return null;
    const meta = CategoryKey[catValue as keyof typeof CategoryKey];
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
    if (s1Master) {
      const p1 = Object.values(PrefKey).find((p) => p.code.includes(s1Master.pref));
      if (p1) setPref1(p1.label);
    }
    const s2Master = masterData[id2];
    if (s2Master) {
      const p2 = Object.values(PrefKey).find((p) => p.code.includes(s2Master.pref));
      if (p2) setPref2(p2.label);
    }
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
    const meta = CategoryKey[cat];
    return <span style={{ color: meta.colorFull }}>{meta.icon}</span>;
  };

  const getRegionColor = (prefStr: string) => {
    const pref = Object.values(PrefKey).find(
      (p) => p.label === prefStr || (p.code as readonly string[]).includes(prefStr)
    );
    return pref?.region?.colorStrong || "#3b82f6";
  };

  return (
    <>
      <Head>
        <title>アメダス地点比較 - アメダス図鑑</title>
        <meta
          name="description"
          content="全国約1,300地点のアメダス観測所から2地点を自由に選択し、平年気温や降水量の差、気候パターンの特徴を並べて詳細に比較できるツールです。"
        />
        <link rel="canonical" href="https://amedas-zukan.jp/compare" />
      </Head>

      <Layout
        breadcrumbs={[
          { label: "地点を比較する" },
        ]}
        sidebar={<Sidebar />}
        heroProps={{
          badgeIcon: <FaBalanceScaleLeft />,
          badgeText: "Station Comparison",
          title: "地点を比較する",
          description: "2つのアメダス観測所を選択し、気温や降水量の違い・雨温図パターンを並べて詳しく比較できます。",
          watermark: "COMPARE",
          gradient: "bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700",
        }}
        sections={[
          {
            id: "selector-section",
            label: "地点の選択",
            accentColor: "#6366f1",
            children: (
              <div className="flex flex-col xl:flex-row items-center justify-center gap-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80">
                <div className="flex flex-col gap-4 w-full flex-1">
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
                  <FaExchangeAlt className="rotate-90 xl:rotate-0" />
                </button>

                <div className="flex flex-col gap-4 w-full flex-1">
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
            ),
          },
          {
            id: "info-section",
            label: "地点概要",
            accentColor: "#10b981",
            children: (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
                <InfoPanel
                  stationData={s1}
                  climateData={c1}
                  loading={l1}
                  isTitle={true}
                />
                <InfoPanel
                  stationData={s2}
                  climateData={c2}
                  loading={l2}
                  isTitle={true}
                />
              </div>
            ),
          },
          {
            id: "uonzu-section",
            label: "雨温図比較",
            accentColor: "#3b82f6",
            children: (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-end">
                  <CustomSelect
                    value={selectedBar.key}
                    onChange={(v) => setSelectedBar(MetricKey[v])}
                    options={uonzuOptions}
                    className="w-44"
                  />
                </div>
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
            ),
          },
          {
            id: "table-section",
            label: "月別データ比較",
            accentColor: "#ef4444",
            children: (
              <div>
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
            ),
          },
        ]}
      />
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
