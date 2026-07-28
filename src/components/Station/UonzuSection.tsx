import React, { useMemo, useState } from "react";
import SegmentedControl from "../UI/SegmentedControl";
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
          key: meta.key,
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
    if (!uonzuOptions.some((opt) => opt.key === selectedBar.key)) {
      if (uonzuOptions.length > 0) {
        setSelectedBar(uonzuOptions[0].meta);
      }
    }
  }

  return (
    <>
      <SectionWithDescription
        icon={<LuChartNoAxesCombined />}
        title="雨温図"
        bgColor={regionColor}
        description={[
          `棒グラフは${selectedBar.label}、折れ線グラフは平均気温・最低気温・最高気温を表しています。`,
          "月降水量が500mmを超える地点は、棒グラフの最大値が1000mmになります。",
        ]}
      >
        <SegmentedControl
          value={selectedBar.key}
          onChange={(v) => setSelectedBar(MetricKey[v])}
          options={uonzuOptions}
          className="ml-2"
        />
      </SectionWithDescription>

      <UonzuChart
        uonzuData={uonzuData}
        selectedBar={selectedBar}
        height="400px"
      />
    </>
  );
};

export default UonzuSection;
