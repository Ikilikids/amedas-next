import React from "react";
import Similar from "./Similar/UI";
import PrefecturePart from "./PrefecturePart/UI";
import { RawSimilarStationData, RawStationData } from "../../../../../types/raw";
import { isSidebarDataAvailable } from "./function";

export interface SidebarWidgetProps {
  similarAll?: RawSimilarStationData[];
  similarMeteo?: RawSimilarStationData[];
  sameStations: RawStationData[];
  meteoStations: RawStationData[];
}

export const SidebarWidget: React.FC<SidebarWidgetProps> = ({
  similarAll,
  similarMeteo,
  sameStations,
  meteoStations,
}) => {
  if (!isSidebarDataAvailable(similarAll, similarMeteo, sameStations, meteoStations)) {
    return null;
  }

  return (
    <>
      {similarAll && similarMeteo && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <Similar
            similarDataAll={similarAll}
            similarDataMeteo={similarMeteo}
          />
        </div>
      )}

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <PrefecturePart
          sameStations={sameStations}
          meteoStations={meteoStations}
        />
      </div>
    </>
  );
};

export default SidebarWidget;
