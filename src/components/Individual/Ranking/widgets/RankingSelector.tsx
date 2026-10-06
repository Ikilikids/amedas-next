import React, { useMemo } from "react";
import CustomSelect from "../../../common/CustomSelect";
import { MetricKey, MetricMeta, MetricValue } from "../../../../setting/metric";
import { RankKey, RankMeta } from "../../../../setting/rank";
import { RegionKey, RegionMeta } from "../../../../setting/region";
import { PrefKey, PrefMeta } from "../../../../setting/pref";
import { MonthKey, MonthValue } from "../../../../setting/month";
import { PiMapPinAreaFill } from "react-icons/pi";

export type RankingCategory = "climate" | "recent" | "daily";

const DAILY_METRICS: MetricValue[] = ["av_hitemp", "av_lwtemp", "sm_rain"];
const RECENT_METRICS: MetricValue[] = (Object.values(MetricKey) as Array<(typeof MetricKey)[MetricValue]>)
  .filter((m) => m.detail.group !== undefined)
  .map((m) => m.key);

export interface RankingSelectorProps {
  category: RankingCategory;
  config: MetricMeta;
  onSelectMetric: (metric: MetricValue) => void;
  // 集計月（climate用）
  selectedMonth?: string;
  onSelectMonth?: (month: string) => void;
  // 範囲・地方・都道府県
  rankMeta: RankMeta;
  onSelectRank: (rank: RankMeta) => void;
  selectedRegion: RegionMeta;
  onSelectRegion: (region: RegionMeta) => void;
  selectedPref: PrefMeta;
  onSelectPref: (pref: PrefMeta) => void;
}

interface SelectRowProps {
  label: string;
  children: React.ReactNode;
}

const SelectRow: React.FC<SelectRowProps> = ({ label, children }) => (
  <div className="flex items-center gap-2 w-full min-w-0">
    <span className="shrink-0 whitespace-nowrap text-[11px] font-black text-slate-400 uppercase tracking-wider">
      {label}:
    </span>
    <div className="flex-1 min-w-0">{children}</div>
  </div>
);

export const RankingSelector: React.FC<RankingSelectorProps> = ({
  category,
  config,
  onSelectMetric,
  selectedMonth,
  onSelectMonth,
  rankMeta,
  onSelectRank,
  selectedRegion,
  onSelectRegion,
  selectedPref,
  onSelectPref,
}) => {
  // 指標選択肢
  const metricOptions = useMemo(() => {
    let keys: MetricValue[];
    if (category === "daily") {
      keys = DAILY_METRICS;
    } else if (category === "recent") {
      keys = RECENT_METRICS;
    } else {
      keys = Object.values(MetricKey)
        .filter((m) => m.existJson)
        .map((m) => m.key);
    }
    return keys.map((k) => {
      const m = MetricKey[k];
      return {
        value: m.key,
        label: m.label,
        icon: m.icon,
        color: m.color,
      };
    });
  }, [category]);

  const monthOptions = useMemo(
    () =>
      Object.values(MonthKey).map((m) => ({
        value: m.key,
        label: m.label,
        icon: m.icon,
        color: m.color,
      })),
    []
  );

  const rankOptions = useMemo(
    () =>
      Object.values(RankKey).map((rk) => ({
        value: rk.key,
        label: rk.rankingLabel,
        icon: rk.icon,
        color: rk.color,
      })),
    []
  );

  const regionOptions = useMemo(
    () =>
      Object.values(RegionKey).map((r) => ({
        value: r.key,
        label: r.label,
        color: r.colorStrong,
      })),
    []
  );

  const prefOptions = useMemo(
    () =>
      Object.values(PrefKey).map((p) => ({
        value: p.key,
        label: p.label,
        icon: p.icon,
        color: p.region.colorStrong,
      })),
    []
  );



  const hasMonth = category === "climate" && selectedMonth && onSelectMonth;
  const hasSubScope = rankMeta.key === "region" || rankMeta.key === "pre";
  const currentMonthMeta = selectedMonth ? MonthKey[selectedMonth as MonthValue] : undefined;

  return (
    <div className="bg-white rounded-3xl p-4 xl:p-6 shadow-sm border border-slate-200/80">
      <div className="flex flex-col xl:grid xl:grid-cols-4 gap-3 xl:gap-4 items-center">
        {/* 1. 指標（xl以下は独立した1行） */}
        <div className="w-full xl:contents">
          <SelectRow label="指標">
            <CustomSelect
              value={config.key}
              onChange={(val) => onSelectMetric(val as MetricValue)}
              options={metricOptions}
              activeColor={config?.color || "#3b82f6"}
              leftIcon={config?.icon}
            />
          </SelectRow>
        </div>

        {/* 2. 月（平年値のみ。xl以下は独立した1行） */}
        {hasMonth ? (
          <div className="w-full xl:contents">
            <SelectRow label="集計月">
              <CustomSelect
                value={selectedMonth}
                onChange={onSelectMonth}
                options={monthOptions}
                activeColor={currentMonthMeta?.color || "#3b82f6"}
                leftIcon={currentMonthMeta?.icon}
              />
            </SelectRow>
          </div>
        ) : (
          <div className="hidden xl:block" />
        )}

        {/* グループ2: 範囲 & 地方/都道府県 */}
        <div className={`w-full xl:contents ${hasSubScope ? "flex items-center gap-3" : ""}`}>
          <SelectRow label="範囲">
            <CustomSelect
              value={rankMeta.key}
              onChange={(val) => {
                const found = Object.values(RankKey).find((rk) => rk.key === val);
                if (found) onSelectRank(found);
              }}
              options={rankOptions}
              activeColor={rankMeta.color || config.color}
              leftIcon={rankMeta.icon}
            />
          </SelectRow>

          {rankMeta.key === "region" ? (
            <SelectRow label="地方">
              <CustomSelect
                value={selectedRegion.key}
                onChange={(val) => {
                  const found = Object.values(RegionKey).find((r) => r.key === val);
                  if (found) onSelectRegion(found);
                }}
                options={regionOptions}
                activeColor={selectedRegion.colorStrong}
                leftIcon={<PiMapPinAreaFill />}
              />
            </SelectRow>
          ) : rankMeta.key === "pre" ? (
            <SelectRow label="県">
              <CustomSelect
                value={selectedPref.key}
                onChange={(val) => {
                  const found = Object.values(PrefKey).find((p) => p.key === val);
                  if (found) onSelectPref(found);
                }}
                options={prefOptions}
                activeColor={selectedPref.region.colorStrong}
                leftIcon={selectedPref.icon}
              />
            </SelectRow>
          ) : (
            <div className="hidden xl:block" />
          )}
        </div>
      </div>
    </div>
  );
};

export default RankingSelector;
