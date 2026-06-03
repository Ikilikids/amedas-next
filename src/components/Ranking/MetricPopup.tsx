import React, { useEffect, useMemo, useState } from "react";
import { MetricKey, MetricMeta, MetricTab } from "../../utils/metric";
import { RankMeta } from "../../utils/rank";
import { isCombinationValid } from "./utils";

interface MetricPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (key: MetricMeta) => void;
  rankType: RankMeta;
  initialMetricKey: MetricMeta | null;
}

const MetricPopup: React.FC<MetricPopupProps> = ({
  isOpen,
  onClose,
  onApply,
  rankType,
  initialMetricKey,
}) => {
  const [selectedKey, setSelectedKey] = useState<MetricMeta | null>(
    initialMetricKey
  );

  useEffect(() => {
    setSelectedKey(initialMetricKey);
  }, [initialMetricKey, isOpen]);

  const groupedMetrics = useMemo(() => {
    return Object.values(MetricKey).reduce((acc, key) => {
      const tab = key.tab;

      // 除外
      if ((tab as string) === "主要" || (tab as string) === "極値") return acc;

      if (!acc[tab]) acc[tab] = [];

      acc[tab].push(key);

      return acc;
    }, {} as Record<MetricTab, MetricMeta[]>);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-30" onClick={onClose} />

      <div className="relative w-[90%] max-w-[520px] bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10">
        {Object.entries(groupedMetrics).map(([tab, items]) => (
          <div key={tab}>
            <div className="font-semibold text-gray-600 mb-1">{tab}</div>

            <div className="flex flex-wrap gap-1">
              {items.map((key) => {
                const disabled = !isCombinationValid(rankType, key);

                return (
                  <button
                    key={key.key}
                    disabled={disabled}
                    onClick={() => !disabled && setSelectedKey(key)}
                    className={`px-2 py-1 text-sm rounded ${
                      disabled
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : selectedKey === key
                        ? "bg-orange-400 text-white"
                        : "bg-gray-100 hover:bg-orange-100"
                    }`}
                  >
                    {key.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mt-3 flex justify-end gap-2">
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            キャンセル
          </button>

          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => {
              if (selectedKey) onApply(selectedKey);
              onClose();
            }}
          >
            適用
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetricPopup;
