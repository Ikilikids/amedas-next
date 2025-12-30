// src/components/StationDetailPanel.tsx
import { IoHomeSharp } from "react-icons/io5";
import { LuChartNoAxesCombined } from "react-icons/lu";
import { useStationData } from "../hooks/useStationData";
import { getRegionColor, SectionWithDescription } from "../utils/colorUtils";
import InfoPanel from "./InfoPanel";
import UonzuChart from "./UonzuChart";

interface StationDetailPanelProps {
  stationId: string | null | undefined;
}

const StationDetailPanel = ({ stationId }: StationDetailPanelProps) => {
  const { stationData, loading } = useStationData(stationId);

  const bgColor =
    stationData && stationData.pref
      ? getRegionColor(stationData.pref)
      : "white";

  return (
    <div className="h-[750px] lg:flex-[2] xl:flex-[2] overflow-hidden flex flex-col gap-2">
      <h2 className="sr-only">情報パネル</h2>
      <div className="border rounded-lg" style={{ backgroundColor: bgColor }}>
        <SectionWithDescription
          icon={IoHomeSharp}
          title="基本情報"
          bgColor=""
        />
      </div>
      <div className="min-h-0 h-[320px] overflow-auto">
        <InfoPanel
          stationId={stationId}
          stationData={stationData}
          loading={loading}
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
      {stationData && (
        <div className="w-full h-[320px] pt-2">
          <UonzuChart
            temp={stationData.uonzu.av_avtemp}
            hitemp={stationData.uonzu.av_hitemp}
            lwtemp={stationData.uonzu.av_lwtemp}
            rain={stationData.uonzu.sm_rain}
            sun={stationData.uonzu.sm_sun}
            snowing={stationData.uonzu.sm_snowing}
            selectedBar="rain"
            height="320px"
          />
        </div>
      )}
    </div>
  );
};

export default StationDetailPanel;
