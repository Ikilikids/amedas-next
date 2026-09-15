import React, { useMemo, useState } from "react";
import CustomSelect from "../UI/CustomSelect";
import UonzuChart from "../UonzuChart";
import { MetricKey, MetricMeta } from "../../setting/metric";
import { SectionWithDescription } from "../../utils/colorUtils";
import { LuChartNoAxesCombined } from "react-icons/lu";

interface UonzuSectionProps {
  uonzuData: Map<MetricMeta, number[]>;
  regionColor: string;
}

export const UonzuSection: React.FC<UonzuSectionProps> = ({
  uonzuData,
  regionColor,
}) => {
  const uonzuOptions = useMemo(() => {
    const targets = [MetricKey.sm_rain, MetricKey.sm_snowing, MetricKey.sm_sun];

    return targets
      .filter((meta) => uonzuData.has(meta))
      .map((meta) => {
        return {
          value: meta.key,
          label: meta.label,
          color: meta.color,
          meta: meta,
        };
      });
  }, [uonzuData]);

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
      <div className="pb-3 border-b border-slate-200 mb-4 space-y-3">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: regionColor }}></span>
          2. 雨温図（平年値グラフ）
        </h2>
        <div>
          <CustomSelect
            value={selectedBar.key}
            onChange={(v) => setSelectedBar(MetricKey[v])}
            options={uonzuOptions}
            activeColor={regionColor}
          />
        </div>
      </div>

      <p className="text-xs text-slate-500 mb-4">
        月ごとの平均気温・最高気温・最低気温の推移（折れ線）と、降水量・日照時間・降雪量（棒グラフ）です。
      </p>

      <UonzuChart
        uonzuData={uonzuData}
        selectedBar={selectedBar}
        height="400px"
      />
    </>
  );
};

export default UonzuSection;
