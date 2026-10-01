import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import Layout from "../../components/Layout";
import { RankingItem, RawRankingData } from "../../components/Individual/Ranking/types";
import { getMetricColor } from "../../utils/colorUtils";
import { resolveCategory } from "../../utils/masterUtils";
import { PrefKey } from "../../setting/pref";
import { RegionKey } from "../../setting/region";
import { loadMaster } from "../../utils/ssgLoader";

import { TbTemperatureSun } from "react-icons/tb";
import { colorWithAlpha } from "../../components/Individual/Station/widgets/Ratio/function";
import { RawStationData } from "../../types/raw";
import { StationId } from "../../types/union";
import { MetricKey } from "../../setting/metric";

interface Props {
  masterData: Record<StationId, RawStationData>;
}

const RealtimePage: NextPage<Props> = ({ masterData }) => {
  const regions = Object.values(RegionKey);
  const config = MetricKey.av_avtemp;

  const [liveData, setLiveData] = useState<{
    stations: RankingItem[];
    lastUpdate: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/live/realtime")
      .then((res) => res.json())
      .then(setLiveData)
      .catch(console.error);
  }, []);

  // APIデータとマスターデータを合体
  const stations: RawRankingData[] = useMemo(() => {
    if (!liveData) return [];
    return liveData.stations
      .filter((s) => s.id && masterData[s.id])
      .map((s) => {
        const master = masterData[s.id!];
        return {
          ...master,
          ...s,
        };
      });
  }, [liveData, masterData]);

  const displayLastUpdate = useMemo(() => {
    if (!liveData) return "読み込み中...";
    return liveData.lastUpdate;
  }, [liveData]);

  // 地点IDごとの気温マップ
  const tempMap = useMemo(() => {
    const map: Record<string, number | null> = {};
    stations.forEach((s) => {
      map[s.id] = s.value !== undefined ? s.value : null;
    });
    return map;
  }, [stations]);

  // 全国の最高・最低気温（カラースケール用）
  const { minTemp, maxTemp } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    Object.values(tempMap).forEach((t) => {
      if (typeof t === "number") {
        if (t < min) min = t;
        if (t > max) max = t;
      }
    });
    return {
      minTemp: min === Infinity ? 0 : min,
      maxTemp: max === -Infinity ? 35 : max,
    };
  }, [tempMap]);

  return (
    <>
      <Layout
        seo={{
          title: "現在の気温 (リアルタイム) - アメダス図鑑",
        description:
          "全国約1,300地点のアメダス観測データから、現在のリアルタイムな気温状況を10分ごとに自動取得して表示します。日本各地の今の天気を視覚的に把握できます。",
        canonical: "https://amedas-zukan.jp/live/realtime",
      }}
      breadcrumbs={[
        { label: "リアルタイム気温" },
      ]}
        heroProps={{
          badgeText: "Realtime Weather",
          Icon: <TbTemperatureSun />,
          title: "現在の気温 (リアルタイム)",
          description: "気象庁の最新アメダス速報値から取得した全国の気温状況です。10分ごとに自動更新されます。",
          watermark: "REALTIME",
          gradient:
            config.detail?.gradient ||
            "bg-gradient-to-r from-orange-600 to-amber-600",
          lastUpdateLabel: "最新観測",
          lastUpdateValue: displayLastUpdate,
        }}
        introContent={
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-wrap gap-2 justify-center">
            {regions.map((region) => (
              <a
                key={`nav-${region.label}`}
                href={`#region-${region.label}`}
                className="px-4 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm border border-slate-200"
                style={{
                  backgroundColor: region.colorBase,
                  color: "#1e293b",
                }}
              >
                {region.label}
              </a>
            ))}
          </div>
        }
        sections={regions.map((region) => {
          const prefsInRegion = Object.values(PrefKey).filter(
            (p) => p.region === region
          );

          return {
            id: `region-${region.label}`,
            label: `${region.label}地方の現在の気温`,
            accentColor: region.colorStrong,
            children: (
              <div className="flex flex-col gap-10">
                {prefsInRegion.map((pref) => {
                  const stationsInPref = stations
                    .filter((s) => s.pref && pref.code.includes(s.pref))
                    .sort(
                      (a, b) =>
                        ((a.category ? resolveCategory(a.category)?.value : 99) || 99) -
                        ((b.category ? resolveCategory(b.category)?.value : 99) || 99) ||
                        (a.id || "").localeCompare(b.id || "")
                    );

                  if (stationsInPref.length === 0) return null;

                  return (
                    <div
                      key={`pref-${pref.label}`}
                      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                    >
                      <div
                        className="px-5 py-3 flex items-center justify-between border-b border-slate-100"
                        style={{
                          backgroundColor: colorWithAlpha(
                            region.colorBase,
                            0.1
                          ),
                          borderColor: colorWithAlpha(
                            region.colorBase,
                            0.3
                          ),
                        }}
                      >
                        <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                          {pref.label}
                          <span className="text-sm font-normal text-slate-400">
                            ({stationsInPref.length}地点)
                          </span>
                        </h3>
                      </div>

                      <div className="p-5">
                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                          {stationsInPref.map((s) => {
                            const temp = tempMap[s.id || ""];
                            const category = s.category ? resolveCategory(s.category) : undefined;
                            const baseClasses =
                              "group border rounded-lg p-3 transition-all duration-200 flex flex-col items-center justify-center gap-1 min-h-[85px] text-center shadow-sm hover:shadow-md hover:-translate-y-0.5";

                            return (
                              <Link
                                key={`station-${s.id}`}
                                href={`/station/${s.id}`}
                                prefetch={false}
                                className={`${baseClasses}`}
                              >
                                <div className="flex items-center gap-1">
                                  {category && category.value !== 4 && (
                                    <span
                                      className="transform group-hover:scale-110 transition-transform"
                                      style={{
                                        color: category.colorFull,
                                      }}
                                    >
                                      {category.icon}
                                    </span>
                                  )}
                                  <span
                                    className={`text-sm font-bold truncate`}
                                  >
                                    {s.station_name}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono tracking-tighter">
                                    #{s.id}
                                  </span>
                                </div>
                                <div
                                  className={`text-xl font-mono font-bold ${getMetricColor(
                                    temp,
                                    minTemp,
                                    maxTemp,
                                    true
                                  )}`}
                                >
                                  {typeof temp === "number" ? (
                                    <>
                                      {temp.toFixed(1)}
                                      <span className="text-sm ml-0.5">
                                        ℃
                                      </span>
                                    </>
                                  ) : (
                                    "---"
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ),
          };
        })}
      />

      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="p-4 bg-white shadow-2xl rounded-full text-slate-400 border border-slate-100 transition-colors hover:text-slate-600"
        >
          <FaChevronDown className="transform rotate-180" />
        </button>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const masterData: Record<StationId, RawStationData> = loadMaster();
    const data: Record<StationId, RawStationData> = Object.fromEntries(
      Object.entries(masterData).map(
        ([id, { lon, lat, height, city, official_name, ...rest }]) => [
          id,
          rest,
        ]
      )
    ) as Record<StationId, RawStationData>;

    return {
      props: {
        masterData: data,
      },
    };
  } catch (e) {
    console.error("SSG Error in RealtimePage:", e);
    return { notFound: true };
  }
};

export default RealtimePage;
