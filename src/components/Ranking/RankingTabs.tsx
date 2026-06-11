import React from "react";
import { MonthMap } from "../../utils/colorUtils";
import { MetricKey, MetricMeta } from "../../utils/metric";
import { PrefKey, PrefMeta } from "../../utils/pref";
import { RankKey, RankMeta } from "../../utils/rank";
import { RegionKey, RegionMeta } from "../../utils/region";
import CustomSelect from "../UI/CustomSelect";
import SegmentedControl from "../UI/SegmentedControl";
import { isCombinationValid } from "./utils";

interface RankingTabsProps {
  sortKey: MetricMeta;
  setSortKey: (key: MetricMeta) => void;
  rankType: RankMeta;
  setRankType: (type: RankMeta) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  selectedMetricKey: MetricMeta | null;
  setSelectedMetricKey: (key: MetricMeta | null) => void;
  setShowPopup: (show: boolean) => void;
  selectedRegion: RegionMeta;
  setSelectedRegion: (region: RegionMeta) => void;
  selectedPref: PrefMeta;
  setSelectedPref: (pref: PrefMeta) => void;
}

const RankingTabs: React.FC<RankingTabsProps> = ({
  sortKey,
  setSortKey,
  rankType,
  setRankType,
  selectedMonth,
  setSelectedMonth,
  selectedMetricKey,
  setSelectedMetricKey,
  setShowPopup,
  selectedRegion,
  setSelectedRegion,
  selectedPref,
  setSelectedPref,
}) => {
  const mainMetrics = Object.values(MetricKey).filter((m) => m.tab === "主要");

  const regions = Object.values(RegionKey);
  const prefs = Object.values(PrefKey);
  const tab = selectedMetricKey?.tab ?? "";
  const label = selectedMetricKey?.label ?? "その他 ▸";

  return (
    <div className="flex flex-col gap-3">
      {/* ================= MAIN METRICS ================= */}
      <div className="flex gap-2 flex-wrap items-center">
        <SegmentedControl
          value={selectedMetricKey ? "" : sortKey.key}
          onChange={(val) => {
            const found = mainMetrics.find((m) => m.key === val);
            if (found) {
              setSortKey(found);
              setSelectedMetricKey(null);
            }
          }}
          options={mainMetrics.map((m) => {
            return {
              key: m.key,
              label: m.label,
              disabled: !isCombinationValid(rankType, m),
              color: m.color,
            };
          })}
          className="flex-wrap"
        >
          <button
            className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-tighter transition-all duration-200 ${
              selectedMetricKey
                ? "bg-white shadow-sm border"
                : "text-slate-500 hover:text-slate-800 border border-transparent"
            }`}
            style={
              selectedMetricKey
                ? {
                    color: selectedMetricKey.color,
                    borderColor: selectedMetricKey.color,
                    boxShadow: `0 1px 3px 0 ${selectedMetricKey.color.slice(0, 7) + "33"}`,
                  }
                : {}
            }
            onClick={() => setShowPopup(true)}
          >
            {["気温日数", "平均"].includes(tab)
              ? label
              : `${tab.replace("日数", "")}${label}`}
          </button>
        </SegmentedControl>
      </div>

      {/* ================= RANK TYPE & MONTH & FILTERS ================= */}
      <div className="flex flex-wrap items-center gap-2">
        {/* RANK TYPE */}
        <SegmentedControl
          value={rankType.key}
          onChange={(val) => {
            const found = Object.values(RankKey).find((rk) => rk.key === val);
            if (found) {
              setRankType(found);
              if (found.key === RankKey.region.key)
                setSelectedRegion(RegionKey.kanto);
              if (found.key === RankKey.pre.key) setSelectedPref(PrefKey.tokyo);
            }
          }}
          options={Object.values(RankKey).map((rk) => ({
            key: rk.key,
            label: rk.ratioLabel,
            disabled: !isCombinationValid(rk, sortKey),
          }))}
        />

        {/* MONTH SELECT */}
        <CustomSelect
          value={selectedMonth}
          onChange={(v) => setSelectedMonth(v)}
          options={Object.entries(MonthMap).map(([k, v]) => ({
            value: k,
            label: v,
          }))}
        />

        {/* REGION FILTER */}
        {rankType.key === RankKey.region.key && (
          <CustomSelect
            value={selectedRegion.label}
            onChange={(val) => {
              const found = regions.find((r) => r.label === val);
              if (found) setSelectedRegion(found);
            }}
            options={regions.map((r) => ({
              value: r.label,
              label: r.label,
            }))}
          />
        )}

        {/* PREF FILTER */}
        {rankType.key === RankKey.pre.key && (
          <CustomSelect
            value={selectedPref.code}
            onChange={(val) => {
              const found = prefs.find((p) => p.code === val);
              if (found) setSelectedPref(found);
            }}
            options={prefs.map((p) => ({
              value: p.code,
              label: p.label,
            }))}
          />
        )}
      </div>
    </div>
  );
};

export default RankingTabs;
