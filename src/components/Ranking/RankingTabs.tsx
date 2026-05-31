import React from "react";
import { MonthMap } from "../../utils/colorUtils";
import { MetricKey, MetricMeta } from "../../utils/metric";
import { PrefKey, PrefMeta } from "../../utils/pref";
import { RankKey, RankMeta, RankValue } from "../../utils/rank";
import { RegionKey, RegionMeta } from "../../utils/region";
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

  return (
    <>
      {/* ================= MAIN METRICS ================= */}
      <div className="flex gap-2 mb-2 flex-wrap">
        {mainMetrics.map((m) => {
          const disabled = !isCombinationValid(rankType, m);

          return (
            <button
              key={m.key}
              disabled={disabled}
              className={`px-3 py-1 rounded ${
                disabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : sortKey === m
                  ? "bg-orange-400 text-white"
                  : "bg-gray-200 hover:bg-orange-100"
              }`}
              onClick={() => {
                if (!disabled) {
                  setSortKey(m);
                  setSelectedMetricKey(null);
                }
              }}
            >
              {m.label}
            </button>
          );
        })}

        <button
          className={`px-3 py-1 rounded ${
            selectedMetricKey
              ? "bg-orange-400 text-white"
              : "bg-gray-200 hover:bg-orange-100"
          }`}
          onClick={() => setShowPopup(true)}
        >
          {selectedMetricKey?.label ?? "その他 ▸"}
        </button>
      </div>

      {/* ================= RANK TYPE ================= */}
      <div className="flex gap-2 mb-2 flex-wrap">
        {(Object.values(RankKey)).map((val) => {
          const disabled = !isCombinationValid(val, sortKey);

          return (
            <button
              key={val.key}
              disabled={disabled}
              className={`px-2 py-1 rounded text-sm ${
                disabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : rankType.key === val.key
                  ? "bg-green-400 text-white"
                  : "bg-gray-200 hover:bg-green-200"
              }`}
              onClick={() => {
                if (disabled) return;
                setRankType(val);

                if (val.key === RankKey.region.key) {
                  setSelectedRegion(RegionKey.kanto);
                }

                if (val.key === RankKey.pre.key) {
                  setSelectedPref(PrefKey.tokyo);
                }
              }}
            >
              {val.rankingLabel}
            </button>
          );
        })}
      </div>

      {/* ================= DROPDOWN ================= */}
      {rankType.key === RankKey.region.key && (
        <div className="mb-2">
          <select
            value={selectedRegion.label}
            onChange={(e) => {
              const found = regions.find((r) => r.label === e.target.value);
              if (found) setSelectedRegion(found);
            }}
            className="px-2 py-1 rounded bg-gray-100"
          >
            {regions.map((r) => (
              <option key={r.label} value={r.label}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {rankType.key === RankKey.pre.key && (
        <div className="mb-2">
          <select
            value={selectedPref.code}
            onChange={(e) => {
              const found = prefs.find((p) => p.code === e.target.value);
              if (found) setSelectedPref(found);
            }}
            className="px-2 py-1 rounded bg-gray-100"
          >
            {prefs.map((p) => (
              <option key={p.code} value={p.code}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ================= MONTH ================= */}
      <div className="flex gap-1.5 mb-2 flex-wrap">
        {Object.entries(MonthMap).map(([k, v]) => (
          <button
            key={k}
            className={`px-1.5 py-1 rounded text-sm ${
              selectedMonth === k
                ? "bg-indigo-400 text-white"
                : "bg-gray-200 hover:bg-indigo-200"
            }`}
            onClick={() => setSelectedMonth(k)}
          >
            {v}
          </button>
        ))}
      </div>
    </>
  );
};

export default RankingTabs;
