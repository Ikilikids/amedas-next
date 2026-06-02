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
    <div className="h-[750px] lg:flex-[2] xl:flex-[2] flex flex-col gap-4">
      <h2 className="sr-only">情報パネル</h2>
      
      <div className="flex flex-col gap-2">
        <SectionWithDescription 
          icon={IoBook} 
          title="基本情報" 
          bgColor={bgColor === "white" ? "#3b82f6" : bgColor} 
        />
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm p-2">
          <div className="h-[280px] overflow-auto">
            <InfoPanel
              stationData={stationData}
              overViewData={overviewData}
              loading={loading}
              isTitle={true}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 flex-1 min-h-0">
        <SectionWithDescription
          icon={LuChartNoAxesCombined}
          title="雨温図"
          bgColor={bgColor === "white" ? "#3b82f6" : bgColor}
        />
        <div className="bg-white border border-slate-200 rounded-3xl flex-1 min-h-0 overflow-hidden shadow-sm p-4">
          {uonzuData ? (
            <UonzuChart uonzuData={uonzuData} selectedBar="rain" height="100%" />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
              地点を選択すると雨温図が表示されます
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StationDetailPanel;
