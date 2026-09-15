import React from "react";
import { MonthMap } from "../../utils/colorUtils";
import { MetricKey, MetricMeta } from "../../setting/metric";
import { PrefKey, PrefMeta } from "../../setting/pref";
import { RankKey, RankMeta } from "../../setting/rank";
import { RegionKey, RegionMeta } from "../../setting/region";
import CustomSelect from "../UI/CustomSelect";
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

  const metricSelectOptions = [
    ...mainMetrics.map((m) => ({
      value: m.key,
      label: m.label,
      disabled: !isCombinationValid(rankType, m),
    })),
    ...(selectedMetricKey
      ? [
          {
            value: selectedMetricKey.key,
            label: ["気温日数", "平均"].includes(tab)
              ? label
              : `${tab.replace("日数", "")}${label}`,
          },
        ]
      : []),
    { value: "__popup__", label: "その他..." },
  ];

  const currentMetricValue = selectedMetricKey ? selectedMetricKey.key : sortKey.key;

  return (
    <div className="flex flex-col gap-3">
      {/* ================= MAIN METRICS ================= */}
      <div className="flex gap-2 flex-wrap items-center">
        {mainMetrics.map((m) => {
          const isSelected = !selectedMetricKey && sortKey.key === m.key;
          const disabled = !isCombinationValid(rankType, m);
          return (
            <button
              key={m.key}
              disabled={disabled}
              onClick={() => {
                setSortKey(m);
                setSelectedMetricKey(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-tighter transition-all duration-200 ${
                disabled
                  ? "opacity-30 cursor-not-allowed"
                  : isSelected
                  ? "bg-white shadow-sm border border-slate-400"
                  : "text-slate-500 hover:text-slate-800 border border-transparent"
              }`}
              style={
                isSelected
                  ? {
                      color: m.color,
                      borderColor: m.color,
                      boxShadow: `0 1px 3px 0 ${m.color.slice(0, 7) + "33"}`,
                    }
                  : {}
              }
            >
              {m.label}
            </button>
          );
        })}

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
      </div>

      {/* ================= RANK TYPE & MONTH & FILTERS ================= */}
      <div className="flex flex-wrap items-center gap-2">
        {/* RANK TYPE */}
        <CustomSelect
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
            value: rk.key,
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
