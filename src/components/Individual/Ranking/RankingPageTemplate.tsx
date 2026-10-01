import React, { useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import Layout from "../../Layout";
import Sidebar from "../../Layout/widgets/Sidebar";
import RankingScopeFilter from "./RankingScopeFilter";
import RankingGrid from "./RankingGrid";
import { MetricMeta } from "../../../setting/metric";
import { RankKey, RankMeta } from "../../../setting/rank";
import { RegionKey, RegionMeta } from "../../../setting/region";
import { PrefKey, PrefMeta } from "../../../setting/pref";
import { MonthlyEntry, StationId } from "../../../types/union";
import { RawStationData } from "../../../types/raw";
import { extractRankingList } from "../../../utils/extractRankingList";

export interface RankingPageTemplateProps {
  pageTitle: string;
  pageDescription: string;
  canonicalUrl: string;
  breadcrumbLabel: string;
  badgeText: string;
  badgeIcon?: React.ReactNode;
  watermark: string;
  lastUpdateValue?: string;
  lastUpdateLabel?: string;
  config: MetricMeta;
  calculatedEntries: Record<StationId, MonthlyEntry[]> | null;
  masterData: Record<string, RawStationData>;
  monthIdx?: number;
  timeMap?: Map<string, string | null>;
  isLoading?: boolean;
  subTextPrefix?: string;
  selectorBar: React.ReactNode;
}

export const RankingPageTemplate: React.FC<RankingPageTemplateProps> = ({
  pageTitle,
  pageDescription,
  canonicalUrl,
  breadcrumbLabel,
  badgeText,
  badgeIcon,
  watermark,
  lastUpdateValue,
  lastUpdateLabel = "更新",
  config,
  calculatedEntries,
  masterData,
  monthIdx = 0,
  timeMap,
  isLoading = false,
  subTextPrefix,
  selectorBar,
}) => {
  const detail = useMemo(() => config.detail, [config]);

  // スコープのState管理をテンプレート内に集約
  const [rankMeta, setRankMeta] = useState<RankMeta>(RankKey.top);
  const [selectedRegion, setSelectedRegion] = useState<RegionMeta>(RegionKey.kanto);
  const [selectedPref, setSelectedPref] = useState<PrefMeta>(PrefKey.tokyo);

  // 共通の抽出ロジックで displayList を生成
  const displayList = useMemo(() => {
    return extractRankingList(
      calculatedEntries,
      masterData,
      { rankMeta, selectedRegion, selectedPref },
      monthIdx,
      timeMap
    );
  }, [calculatedEntries, masterData, rankMeta, selectedRegion, selectedPref, monthIdx, timeMap]);

  const dataBounds = useMemo(() => {
    if (!displayList || displayList.length === 0) return { min: 0, max: 0 };
    const values = displayList
      .map((s) => s.value)
      .filter((v): v is number => v !== null && v !== undefined);
    if (values.length === 0) return { min: 0, max: 0 };
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, [displayList]);

  return (
    <Layout
      seo={{
        title: pageTitle,
        description: pageDescription,
        canonical: canonicalUrl,
      }}
      breadcrumbs={[
        { label: breadcrumbLabel },
        { label: config.label },
      ]}
        sidebar={<Sidebar />}
        heroProps={{
          badgeIcon: badgeIcon,
          badgeText: badgeText,
          Icon: config.icon || (config as any).high?.icon,
          title: pageTitle,
          description: pageDescription,
          watermark: watermark,
          gradient: detail?.gradient || "from-sky-500 to-indigo-600",
          lastUpdateLabel: lastUpdateLabel,
          lastUpdateValue: lastUpdateValue,
        }}
        sections={[
          {
            id: "ranking-grid",
            label: `${config.label}ランキング`,
            accentColor: config.color,
            children: (
              <div className="space-y-6">
                {/* 統合コントロールパネル */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
                  {/* 1. 各画面特有のセレクター（指標タブ、月選択、グループタブ等） */}
                  {selectorBar}

                  {/* 2. 共通絞り込みナビゲーション（全国・地方・県別・気象台・島除外） */}
                  <RankingScopeFilter
                    rankMeta={rankMeta}
                    setRankMeta={setRankMeta}
                    selectedRegion={selectedRegion}
                    setSelectedRegion={setSelectedRegion}
                    selectedPref={selectedPref}
                    setSelectedPref={setSelectedPref}
                    accentColor={config.color}
                  />
                </div>

                {/* ランキンググリッド一覧 */}
                <RankingGrid
                  items={displayList}
                  unit={config.unit}
                  minBound={dataBounds.min}
                  maxBound={dataBounds.max}
                  subTextPrefix={subTextPrefix}
                  fractionDigits={config.key === "sm_rain" ? 0 : 1}
                  isLoading={isLoading}
                />
              </div>
            ),
          },
        ]}
        footerContent={
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="p-4 bg-white shadow-2xl rounded-full text-slate-400 border border-slate-100 transition-colors hover:text-slate-600"
              aria-label="ページ先頭へ戻る"
            >
              <FaChevronDown className="transform rotate-180" />
            </button>
          </div>
        }
      />
  );
};

export default RankingPageTemplate;
