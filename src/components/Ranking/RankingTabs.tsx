import React from "react";
import { MonthMap } from "../../utils/colorUtils";
import { MetricKey, MetricMeta } from "../../utils/metric";
import { PrefKey, PrefMeta } from "../../utils/pref";
import { RegionKey, RegionMeta } from "../../utils/region";
import { RankType, rankTypes } from "./types";
import { isCombinationValid } from "./utils";

interface RankingTabsProps {
  sortKey: MetricMeta;
  setSortKey: (key: MetricMeta) => void;
  rankType: RankType;
  setRankType: (type: RankType) => void;
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

                  if (rank === RankType.Region) {
                    setSelectedRegion(RegionKey.kanto);
                  }

                  if (rank === RankType.Pre) {
                    setSelectedPref(PrefKey.tokyo);
                  }
                }}
              >
                {val.label}
              </button>
            );
          }
        )}
      </div>

      {/* ================= DROPDOWN (NEW) ================= */}
      {rankType === RankType.Region && (
        <SimpleSelect
          items={regions}
          selected={selectedRegion}
          onChange={setSelectedRegion}
        />
      )}

      {rankType === RankType.Pre && (
        <SimpleSelect
          items={prefs}
          selected={selectedPref}
          onChange={setSelectedPref}
        />
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

type SelectItem = {
  value: string;
  label: string;
};

type Props<T extends SelectItem> = {
  items: T[];
  selected: T;
  onChange: (item: T) => void;
};

function SimpleSelect<T extends SelectItem>({
  items,
  selected,
  onChange,
}: Props<T>) {
  return (
    <div className="mb-2">
      <select
        value={selected.value}
        onChange={(e) => {
          const found = items.find((i) => i.value === e.target.value);
          if (found) onChange(found);
        }}
        className="px-2 py-1 rounded bg-gray-100"
      >
        {items.map((i) => (
          <option key={i.value} value={i.value}>
            {i.label}
          </option>
        ))}
      </select>
    </div>
  );
}
