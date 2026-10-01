import React, { useMemo, useState } from "react";
import CustomSelect from "../../../../common/CustomSelect";
import UonzuChart from "../../../../common/UonzuChart";
import { MetricKey, MetricMeta } from "../../../../../setting/metric";
import { RawMonthlyData } from "../../../../../types/raw";
import { getUonzuOptions } from "./function";

export interface UonzuWidgetProps {
  uonzuData: RawMonthlyData;
  regionColor: string;
}

export const UonzuWidget: React.FC<UonzuWidgetProps> = ({
  uonzuData,
  regionColor,
}) => {
  const uonzuOptions = useMemo(() => getUonzuOptions(uonzuData), [uonzuData]);

  const [selectedBar, setSelectedBar] = useState<MetricMeta>(
    uonzuOptions[0]?.meta || MetricKey.sm_rain
  );

  const [prevUonzuOptions, setPrevUonzuOptions] = useState(uonzuOptions);
  if (uonzuOptions !== prevUonzuOptions) {
    setPrevUonzuOptions(uonzuOptions);
    if (!uonzuOptions.some((opt) => opt.value === selectedBar.key)) {
      if (uonzuOptions.length > 0) {
        setSelectedBar(uonzuOptions[0].meta);
      }
    }
  }

  return (
    <>
      <div className="pb-3 border-b border-slate-200 mb-4">
        <CustomSelect
          value={selectedBar.key}
          onChange={(val) => {
            const opt = uonzuOptions.find((o) => o.value === val);
            if (opt) setSelectedBar(opt.meta);
          }}
          options={uonzuOptions.map((opt) => ({
            value: opt.value,
            label: opt.label,
          }))}
        />
      </div>

      <p className="text-xs text-slate-500 mb-4">
        月ごとの平均気温・最高気温・最低気温の推移（折れ線）と、降水量・日照時間・降雪量（棒グラフ）です。
      </p>

      <div className="w-full">
        <UonzuChart
          uonzuData={uonzuData}
          selectedBar={selectedBar}
        />
      </div>
    </>
  );
};

export default UonzuWidget;
