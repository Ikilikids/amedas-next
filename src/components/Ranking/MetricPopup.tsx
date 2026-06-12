import React, { useMemo, useState } from "react";
import { MetricKey, MetricMeta, MetricTab } from "../../utils/metric";
import { RankMeta } from "../../utils/rank";
import SegmentedControl from "../UI/SegmentedControl";
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

  // レンダリング中にPropsの変更を検知して状態を同期 (React 19 推奨パターン)
  const [prevProps, setPrevProps] = useState({ initialMetricKey, isOpen });
  if (
    isOpen !== prevProps.isOpen ||
    initialMetricKey !== prevProps.initialMetricKey
  ) {
    setPrevProps({ initialMetricKey, isOpen });
    setSelectedKey(initialMetricKey);
  }

  const groupedMetrics = useMemo(() => {
    if (!MetricKey) return {} as Record<MetricTab, MetricMeta[]>;
    return Object.values(MetricKey).reduce((acc, key) => {
      if (!key || !key.tab) return acc;
      const tab = key.tab;

      // 除外
      if ((tab as string) === "主要" || !tab) return acc;

      if (!acc[tab]) acc[tab] = [];

      acc[tab].push(key);

      return acc;
    }, {} as Record<MetricTab, MetricMeta[]>);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100]">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-[95%] max-w-[550px] bg-white rounded-2xl shadow-2xl p-6 z-10 flex flex-col gap-6">
        <div className="text-lg font-black text-slate-800 border-b pb-2">
          項目を選択
        </div>

        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {Object.entries(groupedMetrics).map(([tab, items]) => (
            <div key={tab} className="flex flex-col gap-2">
              <div className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
                {tab}
              </div>

              <SegmentedControl
                value={selectedKey?.key ?? ""}
                onChange={(val) => {
                  const found = items.find((m) => m.key === val);
                  if (found) setSelectedKey(found);
                }}
                options={items
                  .filter(
                    (p) =>
                      !["~", "その他"].some((prefix) =>
                        p.label.startsWith(prefix)
                      )
                  )
                  .map((m) => {
                    return {
                      key: m.key,
                      label: m.label,
                      disabled: !isCombinationValid(rankType, m),
                      color: m.color,
                    };
                  })}
                className="flex-wrap"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            className="px-6 py-2 rounded-xl text-sm font-black text-slate-500 hover:bg-slate-100 transition-colors"
            onClick={onClose}
          >
            キャンセル
          </button>

          <button
            className="px-8 py-2 bg-blue-600 text-white rounded-xl text-sm font-black shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
            disabled={!selectedKey}
            onClick={() => {
              if (selectedKey) onApply(selectedKey);
              onClose();
            }}
          >
            適用する
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetricPopup;
