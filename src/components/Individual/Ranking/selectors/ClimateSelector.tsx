import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import CustomSelect from "../../../common/CustomSelect";
import MetricPopup from "../MetricPopup";
import { MetricKey, MetricMeta, MetricValue } from "../../../../setting/metric";
import { RankKey } from "../../../../setting/rank";

interface ClimateSelectorProps {
  currentMetric: MetricValue;
  selectedMonth: string;
  onSelectMonth: (m: string) => void;
}

export const ClimateSelector: React.FC<ClimateSelectorProps> = ({
  currentMetric,
  selectedMonth,
  onSelectMonth,
}) => {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const config = MetricKey[currentMetric];

  const handleSelectMetric = (nextMetric: MetricValue) => {
    if (nextMetric === currentMetric) return;
    router.push(`/ranking/climate/${nextMetric}`, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  const monthOptions = useMemo(
    () => [
      { value: "all", label: "通年" },
      ...Array.from({ length: 12 }, (_, i) => ({
        value: `${i + 1}`,
        label: `${i + 1}月`,
      })),
    ],
    []
  );

  return (
    <div className="flex flex-col justify-between items-stretch gap-4 pb-5 border-b border-slate-100">
      <div className="flex flex-wrap gap-1.5 items-center">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mr-1">
          指標:
        </span>
        {Object.values(MetricKey)
          .filter((m) => m.tab === "主要")
          .map((m) => {
            const isSelected = currentMetric === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => handleSelectMetric(m.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${isSelected
                  ? "text-white shadow-sm"
                  : "text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/70"
                  }`}
                style={isSelected ? { backgroundColor: m.color } : {}}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            );
          })}

        <button
          type="button"
          onClick={() => setShowPopup(true)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${config.tab !== "主要"
            ? "text-white shadow-sm"
            : "text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/70"
            }`}
          style={config.tab !== "主要" ? { backgroundColor: config.color } : {}}
        >
          {config.tab !== "主要" ? (
            <>
              <span>{config.icon}</span>
              <span>{config.label}</span>
            </>
          ) : (
            <span>その他の指標...</span>
          )}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
          集計月:
        </span>
        <div className="w-56">
          <CustomSelect
            value={selectedMonth}
            onChange={onSelectMonth}
            options={monthOptions}
          />
        </div>
      </div>

      <MetricPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onApply={(m) => {
          handleSelectMetric(m.key);
          setShowPopup(false);
        }}
        rankType={RankKey.top}
        initialMetricKey={config}
      />
    </div>
  );
};

export default ClimateSelector;
