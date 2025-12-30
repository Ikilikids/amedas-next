import React from "react";
import InfoPanel from "./InfoPanel2";
import MiniMap from "./MiniMap";

// ==============================
// Types
// ==============================
interface MonthlyRank {
  top?: number;
  bot?: number;
  island?: number;
  region?: number;
  pre?: number;
  meteo?: number;
}

interface MonthlyData {
  value: number | null;
  rank?: MonthlyRank;
}

interface MonthlyDataSource {
  all?: MonthlyData;
  [month: string]: MonthlyData | undefined; // For specific months
}

interface StationData {
  緯度: string;
  経度: string;
  official_name: string;
  station_name: string;
  pref: string;
  city: string;
  height: number | null;
  lon: number | null;
  lat: number | null;
  data: {
    av_avtemp?: MonthlyDataSource;
    av_hitemp?: MonthlyDataSource;
    sm_sun?: MonthlyDataSource;
    sm_rain?: MonthlyDataSource;
    sm_snowing?: MonthlyDataSource;
  };
}

interface InfoPanelWithMapProps {
  station: StationData | null;
  regionColor: string;
}

// ==============================
// Component
// ==============================
const InfoPanelWithMap: React.FC<InfoPanelWithMapProps> = ({
  station,
  regionColor,
}) => {
  console.log(regionColor);
  const lat = station?.緯度 ? parseFloat(station.緯度) : null;
  const lng = station?.経度 ? parseFloat(station.経度) : null;

  return (
    <div className="w-full h-full flex flex-col items-left">
      <div className="w-full h-full flex flex-col sm:flex-row gap-2">
        {/* 左：情報パネル */}
        <div className="flex-[6] w-full">
          <InfoPanel station={station} />
        </div>

        {/* 右：その地点だけの地図 */}
        <div className="flex-[5] w-full min-h-[250px] sm:h-full">
          <MiniMap lat={lat} lng={lng} />
        </div>
      </div>
    </div>
  );
};

export default InfoPanelWithMap;
