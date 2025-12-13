import Link from "next/link";
import { useEffect, useState } from "react";
import { getIcon, getRegionColor } from "../utils/colorUtils";
import UonzuChart from "./UonzuChart";

let stationCache = {};

function showValue(v, isSnow = false, isRank = false) {
  if (v === null || v === undefined) return "--";
  if (isRank) return v;
  if (!isSnow) return v.toFixed(1);
  return v;
}

export default function InfoPanel({ stationId }) {
  const [stationData, setStationData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!stationId) return setStationData(null);

      if (stationCache[stationId]) {
        setStationData(stationCache[stationId]);
        return;
      }

      const res = await fetch(`/infotable/${stationId}.json`);
      const data = await res.json();

      stationCache[stationId] = data;
      setStationData(data);
    };

    loadData();
  }, [stationId]);

  const data = stationData || {
    official_name: "地点を選んでください!!",
    data: {
      av_avtemp: {},
      av_hitemp: {},
      sm_sun: {},
      sm_rain: {},
      sm_snowing: {},
    },
    lon: null,
    lat: null,
    height: null,
    station_name: "",
    pref: "",
    city: "",
  };

  const icon = getIcon(data.official_name || "");
  const heightStr = data.height != null ? `${data.height}m` : "--m";
  const lonlat = data.lon != null ? `(${data.lat}, ${data.lon})` : "(--, --)";
  const avtemp = data.data.av_avtemp ?? {};
  const maxtemp = data.data.av_hitemp ?? {};
  const sun = data.data.sm_sun ?? {};
  const rain = data.data.sm_rain ?? {};
  const snow = data.data.sm_snowing ?? {};
  const bgColor = data.pref ? getRegionColor(data.pref) : "white";
  return (
    <div
      className="p-2 rounded-md w-full h-full flex flex-col gap-2"
      style={{ backgroundColor: bgColor }}
    >
      <h3 className="station-name font-bold text-2xl flex flex-col sm:flex-row sm:items-center gap-1">
        <div className="flex items-center gap-2">
          {icon}
          <span>{data.official_name}</span>
        </div>
      </h3>
      <div>
        地点：{data.pref} {data.city}
      </div>
      <div>観測所名：{data.station_name}</div>
      <div>緯度・経度：{lonlat}</div>
      <div>標高：{heightStr}</div>
      <div>
        平均気温：{showValue(avtemp.value)}℃（全国{" "}
        {showValue(avtemp.rank?.top, false, true)} 位）
      </div>
      <div>
        平均最高気温：{showValue(maxtemp.value)}℃（全国{" "}
        {showValue(maxtemp.rank?.top, false, true)} 位）
      </div>
      <div>
        日照時間：{showValue(sun.value)}時間（全国{" "}
        {showValue(sun.rank?.top, false, true)} 位）
      </div>
      <div>
        降水量：{showValue(rain.value)}mm（全国{" "}
        {showValue(rain.rank?.top, false, true)} 位）
      </div>
      <div>
        降雪量：{showValue(snow.value, true)}cm（全国{" "}
        {showValue(snow.rank?.top, false, true)} 位）
      </div>
      <h3 className="sr-only">Rain/Temp Chart</h3>
      {stationData && (
        <div className="mt-4 w-full h-[360px] bg-gray-50 border rounded shadow pt-2">
          <UonzuChart
            temp={stationData.uonzu.av_avtemp}
            hitemp={stationData.uonzu.av_hitemp}
            lwtemp={stationData.uonzu.av_lwtemp}
            rain={stationData.uonzu.sm_rain}
            sun={stationData.uonzu.sm_sun}
            snowing={stationData.uonzu.sm_snowing}
            selectedBar="rain"
          />
        </div>
      )}

      {stationData && (
        <Link
          href={`/station/${stationId}`}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center font-bold"
        >
          詳細を見る
        </Link>
      )}
    </div>
  );
}
