import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { FaChevronDown } from "react-icons/fa";
import Layout from "../../Layout";
import Sidebar from "../../Layout/widgets/Sidebar";
import RankingGrid from "./RankingGrid";
import RankingSelector, { RankingCategory } from "./RankingSelector";
import { MetricMeta, MetricValue } from "../../../setting/metric";
import { RankKey, RankMeta } from "../../../setting/rank";
import { RegionKey, RegionMeta } from "../../../setting/region";
import { PrefKey, PrefMeta } from "../../../setting/pref";
import { MonthlyEntry, StationId } from "../../../types/union";
import { RawStationData } from "../../../types/raw";
import { extractRankingList } from "../../../utils/extractRankingList";

export type { RankingCategory };

export interface RankingPageTemplateProps {
  category: RankingCategory;
  pageTitle: string;
  heroTitle?: string;
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
  selectedMonth?: string;
  onSelectMonth?: (m: string) => void;
}

export const RankingPageTemplate: React.FC<RankingPageTemplateProps> = ({
  category,
  pageTitle,
  heroTitle,
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
  selectedMonth,
  onSelectMonth,
}) => {
  const router = useRouter();
  const detail = useMemo(() => config.detail, [config]);

  // スコープのState管理
  const [rankMeta, setRankMeta] = useState<RankMeta>(RankKey.top);
  const [selectedRegion, setSelectedRegion] = useState<RegionMeta>(RegionKey.kanto);
  const [selectedPref, setSelectedPref] = useState<PrefMeta>(PrefKey.tokyo);

  const handleSelectMetric = (nextMetric: MetricValue) => {
    if (nextMetric === config.key) return;
    router.push(`/ranking/${category}/${nextMetric}`, undefined, {
      shallow: true,
      scroll: false,
    });
  };

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

  const displayHeroTitle = heroTitle ?? pageTitle.split(" - ")[0].trim();

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
        title: displayHeroTitle,
        description: pageDescription,
        watermark: watermark,
        gradient: detail?.gradient || "from-sky-500 to-indigo-600",
        lastUpdateLabel: lastUpdateLabel,
        lastUpdateValue: lastUpdateValue,
      }}
      sections={[
        {
          id: "ranking-grid",
          label: displayHeroTitle,
          accentColor: config.color,
          children: (
            <div className="space-y-6">
              {/* セレクター */}
              <RankingSelector
                category={category}
                config={config}
                onSelectMetric={handleSelectMetric}
                selectedMonth={selectedMonth}
                onSelectMonth={onSelectMonth}
                rankMeta={rankMeta}
                onSelectRank={setRankMeta}
                selectedRegion={selectedRegion}
                onSelectRegion={setSelectedRegion}
                selectedPref={selectedPref}
                onSelectPref={setSelectedPref}
              />

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
