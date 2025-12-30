import React from "react";

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
  pref: string;
  city: string;
  station_name: string;
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

interface InfoPanelProps {
  station: StationData;
}

// ==============================
// Helpers
// ==============================
function showValue(v: number | null | undefined, isSnow: boolean = false): string {
  if (v === null || v === undefined) return "--";
  if (!isSnow && typeof v === "number") return v.toFixed(1);
  return v.toString(); // For snow, it can be integer, or if it's not a number, convert to string
}

// ==============================
// Component
// ==============================
const InfoPanel: React.FC<InfoPanelProps> = ({ station }) => {
  const data = station;

  const heightStr = data.height != null ? `${data.height}m` : "--m";
  const lonlat =
    data.lon != null && data.lat != null
      ? `(${data.lat}, ${data.lon})`
      : "(--, --)";
  const defaultMonthlyData: MonthlyData = { value: null, rank: {} };

  const avtemp = data.data.av_avtemp?.all ?? defaultMonthlyData;
  const maxtemp = data.data.av_hitemp?.all ?? defaultMonthlyData;
  const sun = data.data.sm_sun?.all ?? defaultMonthlyData;
  const rain = data.data.sm_rain?.all ?? defaultMonthlyData;
  const snow = data.data.sm_snowing?.all ?? defaultMonthlyData;

  return (
    <div className="p-2 rounded-md w-full h-full flex flex-col gap-2">
      <div>
        都道府県：{data.pref} {data.city}
      </div>
      <div>観測所名：{data.station_name}</div>
      <div>緯度・経度：{lonlat}</div>
      <div>標高：{heightStr}</div>
      <div>
        平均気温：{showValue(avtemp.value)}℃（全国{" "}
        {showValue(avtemp.rank?.top, true)} 位）
      </div>
      <div>
        平均最高気温：{showValue(maxtemp.value)}℃（全国{" "}
        {showValue(maxtemp.rank?.top, true)} 位）
      </div>
      <div>
        日照時間：{showValue(sun.value)}時間（全国{" "}
        {showValue(sun.rank?.top, true)} 位）
      </div>
      <div>
        降水量：{showValue(rain.value)}mm（全国{" "}
        {showValue(rain.rank?.top, true)} 位）
      </div>
      <div>
        降雪量：{showValue(snow.value, true)}cm（全国{" "}
        {showValue(snow.rank?.top, true)} 位）
      </div>
    </div>
  );
};

export default InfoPanel;
