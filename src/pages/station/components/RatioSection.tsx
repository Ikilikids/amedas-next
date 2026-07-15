import React, { useMemo, useState } from "react";
import ChartControls from "../../../components/LayeredPieChart/ChartControls";
import { CHART_METRICS } from "../../../components/LayeredPieChart/constants";
import { ChartType } from "../../../components/LayeredPieChart/types";
import LayeredPieChart from "../../../components/LayeredPieChart";
import { MetricMeta, MetricTab } from "../../../setting/metric";
import { RankKey, RankValue } from "../../../setting/rank";
import { SectionWithDescription } from "../../../utils/colorUtils";
import { FaChartPie } from "react-icons/fa";

import { RatioData } from "../../../types/all";

interface RatioSectionProps {
  ratioData: RatioData;
  regionColor: string;
  isMeteo: boolean;
  isIsland: boolean;
  stationId: string;
}

const BASE_RANK_VALUES: RankValue[] = ["top", "bot", "region", "pre"];

export const RatioSection: React.FC<RatioSectionProps> = ({
  ratioData,
  regionColor,
  isMeteo,
  isIsland,
  stationId,
}) => {
  // Ratio Chart States
  const [ratioMonth, setRatioMonth] = useState<number | null>(null);
  const [ratioRankValue, setRatioRankValue] = useState<RankValue>(
    RankKey.top.key
  );

  const typeOptions = useMemo(() => {
    const tabs = new Set([...ratioData.keys()].map((meta) => meta.tab));
    return Object.keys(CHART_METRICS)
      .filter((p) => tabs.has(p as MetricTab))
      .map((tab) => {
        const label = tab.replace("日数", "");
        const schema = CHART_METRICS[tab];
        const baseMetric = schema?.[tab === "気温日数" ? 0 : 2]
          ?.metric as MetricMeta;
        const baseColor = baseMetric?.color;

        return {
          key: tab as ChartType,
          label,
          color: baseColor,
        };
      });
  }, [ratioData]);

  // Ratio Chart States
  const [ratioType, setRatioType] = useState<ChartType | null>(
    typeOptions[0]?.key || null
  );

  // レンダリング中にProps/Optionsの変更を検知して状態を同期 (React 19 推奨パターン)
  const [prevSync, setPrevSync] = useState({
    id: stationId,
    options: typeOptions,
  });
  if (stationId !== prevSync.id || typeOptions !== prevSync.options) {
    setPrevSync({ id: stationId, options: typeOptions });
    if (stationId !== prevSync.id) {
      setRatioType(typeOptions[0]?.key ?? null);
    } else if (
      ratioType === null ||
      !typeOptions.some((opt) => opt.key === ratioType)
    ) {
      setRatioType(typeOptions[0]?.key ?? null);
    }
  }

  const ratioRankOptions = useMemo(() => {
    const rankValues = new Set<RankValue>(BASE_RANK_VALUES);

    if (isMeteo) rankValues.add("meteo");
    if (!isIsland && ratioType === "気温日数") rankValues.add("island");

    return Array.from(rankValues);
  }, [ratioType, isMeteo, isIsland]);

  return (
    <>
      <SectionWithDescription
        icon={<FaChartPie />}
        title="割合データ"
        bgColor={regionColor}
        description={[
          "各要素の日数割合を表しています。",
          "タブから、要素、月、順位別に切り替えることができます。",
        ]}
      >
        <ChartControls
          type={ratioType}
          setType={setRatioType}
          selectedMonth={ratioMonth}
          setSelectedMonth={setRatioMonth}
          rankType={ratioRankValue}
          setRankType={setRatioRankValue}
          rankOptions={ratioRankOptions}
          typeOptions={typeOptions}
        />
      </SectionWithDescription>
      <LayeredPieChart
        ratioData={ratioData}
        ratioInfo={{
          metricTab: ratioType,
          ranking: ratioRankValue,
          isCut: false,
        }}
        selectedMonth={ratioMonth}
        rankType={ratioRankValue}
      />
    </>
  );
};

export default RatioSection;
