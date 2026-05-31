// src/components/StationDetailPanel.tsx
import { IoBook } from "react-icons/io5";
import { LuChartNoAxesCombined } from "react-icons/lu";
import { SectionWithDescription } from "../utils/colorUtils";
import InfoPanel from "./InfoPanel";
import { useStationDetail } from "./Ranking/useRankingData";
import UonzuChart from "./UonzuChart";

interface StationDetailPanelProps {
  stationId: string | null | undefined;
}

const StationDetailPanel = ({ stationId }: StationDetailPanelProps) => {
  const { stationData, uonzuData, overviewData, loading } = useStationDetail(
    stationId || null
  );

  const bgColor =
    stationData && stationData.pref
      ? (stationData.pref as any).region.colorBase
      : "white";

  return (
    <div className="h-[750px] lg:flex-[2] xl:flex-[2] overflow-hidden flex flex-col gap-2">
      <h2 className="sr-only">情報パネル</h2>
      <div className="border rounded-lg" style={{ backgroundColor: bgColor }}>
        <SectionWithDescription icon={IoBook} title="基本情報" bgColor="" />
      </div>
      <div className="min-h-0 h-[320px] overflow-auto">
        <InfoPanel
          stationData={stationData}
          overViewData={overviewData}
          loading={loading}
          isTitle={true}
        />
      </div>
      <div
        className="bg-white border rounded-lg"
        style={{ backgroundColor: bgColor }}
      >
        <SectionWithDescription
          icon={LuChartNoAxesCombined}
          title="雨温図"
          bgColor=""
        />
      </div>
      {uonzuData && (
        <div className="w-full h-[320px] pt-2">
          <UonzuChart uonzuData={uonzuData} selectedBar="rain" height="320px" />
        </div>
      )}
    </div>
  );
};

export default StationDetailPanel;
