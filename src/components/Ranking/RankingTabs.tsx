import React from "react";
import {
  MetricKey,
  MetricTab,
  metricList,
  metrics,
} from "../../utils/colorUtils";
import { MonthMap, RankType, rankTypes } from "./types";
import { isCombinationValid } from "./utils";

interface RankingTabsProps {
  sortKey: MetricKey;
  setSortKey: (key: MetricKey) => void;
  rankType: RankType;
  setRankType: (type: RankType) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  selectedMetricKey: MetricKey | null;
  setSelectedMetricKey: (key: MetricKey | null) => void;
  setShowPopup: (show: boolean) => void;
  setSelectedRegion: (region: string) => void;
  setSelectedPref: (pref: string) => void;
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
  setSelectedRegion,
  setSelectedPref,
}) => {
  const mainMetrics = metricList.filter((m) => m.tab === MetricTab.Main);

  return (
    <>
      {/* ================= MAIN METRICS ================= */}
      <div className="flex gap-2 mb-2 flex-wrap">
        {mainMetrics.map((m) => {
          const disabled = !isCombinationValid(rankType, m.key);

          return (
            <button
              key={m.key}
              disabled={disabled}
              className={`px-3 py-1 rounded ${
                disabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : sortKey === m.key
                  ? "bg-orange-400 text-white"
                  : "bg-gray-200 hover:bg-orange-100"
              }`}
              onClick={() => {
                if (!disabled) {
                  setSortKey(m.key);
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
          {metrics[selectedMetricKey]?.label ?? "その他 ▸"}
        </button>
      </div>

      {/* ================= RANK TYPE ================= */}
      <div className="flex gap-2 mb-2 flex-wrap">
        {(Object.entries(rankTypes) as [RankType, { label: string }][]).map(
          ([rank, val]) => {
            const disabled = !isCombinationValid(rank, sortKey);

            return (
              <button
                key={rank}
                disabled={disabled}
                className={`px-2 py-1 rounded text-sm ${
                  disabled
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : rankType === rank
                    ? "bg-green-400 text-white"
                    : "bg-gray-200 hover:bg-green-200"
                }`}
                onClick={() => {
                  if (disabled) return;
                  setRankType(rank);
                  if (rank === RankType.Region) setSelectedRegion("kanto");
                  if (rank === RankType.Pre) setSelectedPref("44");
                }}
              >
                {val.label}
              </button>
            );
          }
        )}
      </div>

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
