import Link from "next/link";
import React from "react";
import { StationData } from "../types/station";
import { getIcon } from "../utils/colorUtils";

interface InfoPanelProps {
  stationId: string | null | undefined;
  stationData: StationData | null;
  loading: boolean;
}

// ==============================
// Helpers
// ==============================
function showValue(
  v: number | null | undefined,
  isRank: boolean = false
): string {
  if (v === null || v === undefined) return "--";
  if (isRank) return String(v);
  return v.toFixed(1);
}

// ==============================
// Component
// ==============================
const InfoPanel: React.FC<InfoPanelProps> = ({
  stationId,
  stationData,
  loading,
}) => {
  // ===== 読み込み中 =====
  if (loading) {
    return (
      <div className="p-4 w-full h-full flex items-center justify-center">
        <div className="text-lg font-bold animate-pulse">読み込み中…</div>
      </div>
    );
  }

  const data: StationData = stationData ?? {
    official_name: "地点を選んでください!!",
    station_name: "",
    pref: "",
    city: "",
    height: null,
    lon: null,
    lat: null,
    uonzu: {
      av_avtemp: [],
      av_hitemp: [],
      av_lwtemp: [],
      sm_rain: [],
      sm_sun: [],
      sm_snowing: [],
    },
    data: {
      av_avtemp: undefined,
      av_hitemp: undefined,
      sm_sun: undefined,
      sm_rain: undefined,
      sm_snowing: undefined,
    },
  };

  const icon = getIcon(data.official_name || "");

  const defaultAnnualData = { all: { value: null, rank: undefined } };

  const avtemp  = data.data.av_avtemp  ?? defaultAnnualData;
  const maxtemp = data.data.av_hitemp  ?? defaultAnnualData;
  const sun     = data.data.sm_sun     ?? defaultAnnualData;
  const rain    = data.data.sm_rain    ?? defaultAnnualData;
  const snow    = data.data.sm_snowing ?? defaultAnnualData;

  return (
    <div className="p-2 rounded-md w-full h-full flex flex-col gap-1.5">
      <h3 className="station-name font-bold text-2xl">
        {stationId ? (
          <Link
            href={`/station/${stationId}`}
            className="group inline-block relative"
          >
            <span className="flex items-center gap-2">
              {icon}
              {data.official_name}
            </span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-current transition-all duration-200 group-hover:w-full" />
          </Link>
        ) : (
          <span className="flex items-center gap-2">
            {icon}
            {data.official_name}
          </span>
        )}
      </h3>

      <div>
        都道府県：{data.pref} {data.city}
      </div>
      <div>観測所名：{data.station_name}</div>
      <div>
        緯度・経度：({showValue(data.lat)}, {showValue(data.lon)})
      </div>
      <div>標高：{showValue(data.height)} m</div>

      <div>
        平均気温：{showValue(avtemp.all?.value)} ℃（全国{" "}
        {showValue(avtemp.all?.rank, true)} 位）
      </div>
      <div>
        平均最高気温：{showValue(maxtemp.all?.value)} ℃（全国{" "}
        {showValue(maxtemp.all?.rank, true)} 位）
      </div>
      <div>
        日照時間：{showValue(sun.all?.value)} 時間（全国{" "}
        {showValue(sun.all?.rank, true)} 位）
      </div>
      <div>
        降水量：{showValue(rain.all?.value)} mm（全国{" "}
        {showValue(rain.all?.rank, true)} 位）
      </div>
      <div>
        降雪量：{showValue(snow.all?.value, true)} cm（全国{" "}
        {showValue(snow.all?.rank, true)} 位）
      </div>
    </div>
  );
};

export default InfoPanel;
