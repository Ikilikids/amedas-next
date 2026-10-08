import { GetStaticProps, NextPage } from "next";
import { useMemo, useState } from "react";
import { FaBalanceScaleLeft, FaExchangeAlt } from "react-icons/fa";
import { IoBook } from "react-icons/io5";
import { LuChartNoAxesCombined } from "react-icons/lu";
import { PiRankingDuotone } from "react-icons/pi";
import CompareMonthlyTable from "../components/Individual/Compare/CompareMonthlyTable";
import UonzuChart from "../components/common/UonzuChart";
import Layout from "../components/Layout";
import Sidebar from "../components/Layout/widgets/Sidebar";
import InfoPanel from "../components/common/InfoPanel";
import { useStationDetail } from "../hooks/useStationDetail";
import CustomSelect from "../components/common/CustomSelect";
import { RawStationData } from "../types/raw";
import { StationId } from "../types/union";
import { CategoryKey } from "../setting/category";
import { MetricKey, MetricMeta } from "../setting/metric";
import { PrefKey } from "../setting/pref";
import { loadMaster } from "../components/Individual/Ranking/ssg_function";

interface Props {
  masterData: Record<StationId, RawStationData>;
}

const getCategoryIconByValue = (catValue?: string) => {
  if (!catValue) return null;
  const meta = CategoryKey[catValue as keyof typeof CategoryKey];
  if (!meta) return null;
  return <span style={{ color: meta.colorFull }}>{meta.icon}</span>;
};

const getCategoryIconById = (id: StationId, masterData: Record<StationId, RawStationData>) => {
  const cat = masterData?.[id]?.category;
  return getCategoryIconByValue(cat);
};

const getPrefMeta = (prefStr: string) => {
  return Object.values(PrefKey).find(
    (p) => p.label === prefStr || p.code === prefStr
  );
};

const getStationOptionsForPref = (prefStr: string, masterData: Record<StationId, RawStationData>) => {
  const prefObj = getPrefMeta(prefStr) || PrefKey.tokyo;
  return Object.values(masterData || {})
    .filter((s) => prefObj.code === s.pref)
    .sort((a, b) => {
      const catA = a.category ? CategoryKey[a.category].value : 99;
      const catB = b.category ? CategoryKey[b.category].value : 99;
      if (catA !== catB) return catA - catB;
      return (a.station_name || "").localeCompare(b.station_name || "");
    })
    .map((s) => ({
      value: s.id,
      label: s.station_name,
      icon: getCategoryIconByValue(s.category),
    }));
};

const ComparePage: NextPage<Props> = ({ masterData }) => {
  const [id1, setId1] = useState<StationId>("44132"); // 稚内
  const [id2, setId2] = useState<StationId>("62078"); // 東京

  // Prefecture state for filtering
  const [pref1, setPref1] = useState<string>(PrefKey.tokyo.label);
  const [pref2, setPref2] = useState<string>(PrefKey.osaka.label);

  const {
    rawData: rawData1,
    stationData: s1,
    climateData: c1,
    uonzuData: u1,
    tableData: t1,
    loading: l1,
  } = useStationDetail(id1, masterData);
  const {
    rawData: rawData2,
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
      .filter((meta) => !!u1[meta.key] || !!u2[meta.key])
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
        icon: p.icon,
        color: p.region.colorStrong,
        code: Number(p.code),
      }))
      .sort((a, b) => a.code - b.code);
  }, []);

  const stationOptions1 = useMemo(() => getStationOptionsForPref(pref1, masterData), [masterData, pref1]);
  const stationOptions2 = useMemo(() => getStationOptionsForPref(pref2, masterData), [masterData, pref2]);

  // Update station ID when prefecture changes (Render-time sync)
  if (stationOptions1.length > 0 && !stationOptions1.some((s) => s.value === id1)) {
    setId1(stationOptions1[0].value);
  }

  if (stationOptions2.length > 0 && !stationOptions2.some((s) => s.value === id2)) {
    setId2(stationOptions2[0].value);
  }

  // Initial sync for defaults (Render-time sync)
  const [isInitialized, setIsInitialized] = useState(false);
  if (!isInitialized && masterData) {
    const s1Master = masterData[id1];
    if (s1Master) {
      const p1 = Object.values(PrefKey).find((p) => p.code === s1Master.pref);
      if (p1) setPref1(p1.label);
    }
    const s2Master = masterData[id2];
    if (s2Master) {
      const p2 = Object.values(PrefKey).find((p) => p.code === s2Master.pref);
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

  const renderStationSelector = (
    label: string,
    currentPref: string,
    setPref: (v: string) => void,
    currentId: StationId,
    setId: (v: StationId) => void,
    stationOptions: Array<{ value: StationId; label: string; icon?: React.ReactNode }>
  ) => {
    const prefMeta = getPrefMeta(currentPref);
    const regionColor = prefMeta?.region?.colorStrong || "#3b82f6";
    return (
      <div className="flex flex-col gap-4 w-full flex-1">
        <div className="flex-1">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
            {label}: 都道府県
          </label>
          <CustomSelect
            value={currentPref}
            onChange={(v) => setPref(v as string)}
            options={prefOptions}
            activeColor={regionColor}
            leftIcon={prefMeta?.icon}
          />
        </div>
        <div className="flex-1">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
            {label}: 観測所
          </label>
          <CustomSelect
            value={currentId}
            onChange={(v) => setId(v as StationId)}
            options={stationOptions}
            leftIcon={getCategoryIconById(currentId, masterData)}
            activeColor={regionColor}
          />
        </div>
      </div>
    );
  };

  return (
    <Layout
      seo={{
        title: "アメダス地点比較 - アメダス図鑑",
        description:
          "全国約1,300地点のアメダス観測所から2地点を自由に選択し、平年気温や降水量の差、気候パターンの特徴を並べて詳細に比較できるツールです。",
        canonical: "https://amedas-zukan.jp/compare",
      }}
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
              {renderStationSelector("地点 1", pref1, setPref1, id1, setId1, stationOptions1)}

              <button
                onClick={swapStations}
                className="p-4 rounded-full bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95 shadow-inner shrink-0"
                title="入れ替え"
              >
                <FaExchangeAlt className="rotate-90 xl:rotate-0" />
              </button>

              {renderStationSelector("地点 2", pref2, setPref2, id2, setId2, stationOptions2)}
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
                rawData={rawData1}
                loading={l1}
                isTitle={true}
              />
              <InfoPanel
                rawData={rawData2}
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
              <div className="bg-white rounded-3xl px-2 xl:px-6 py-4 shadow-sm border border-slate-100 overflow-hidden">
                {rawData1 && rawData2 ? (
                  <UonzuChart
                    rawData={rawData1}
                    rawData2={rawData2}
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
