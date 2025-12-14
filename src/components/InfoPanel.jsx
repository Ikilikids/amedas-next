import Link from "next/link";
import { getIcon } from "../utils/colorUtils";

function showValue(v, isSnow = false, isRank = false) {
  if (v === null || v === undefined) return "--";
  if (isRank) return v;
  if (!isSnow) return v.toFixed(1);
  return v;
}

export default function InfoPanel({ stationId, stationData, loading }) {
  // ===== 読み込み中 =====
  if (loading) {
    return (
      <div className="p-4 w-full h-full flex items-center justify-center">
        <div className="text-lg font-bold animate-pulse">読み込み中…</div>
      </div>
    );
  }

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

  const avtemp = data.data.av_avtemp ?? {};
  const maxtemp = data.data.av_hitemp ?? {};
  const sun = data.data.sm_sun ?? {};
  const rain = data.data.sm_rain ?? {};
  const snow = data.data.sm_snowing ?? {};

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
        緯度・経度：({data.lat}, {data.lon})
      </div>
      <div>標高：{data.height ?? "--"}m</div>

      <div>
        平均気温：{showValue(avtemp.value)}℃ （全国{" "}
        {showValue(avtemp.rank, true)} 位）
      </div>
      <div>
        平均最高気温：{showValue(maxtemp.value)}℃（全国{" "}
        {showValue(maxtemp.rank, true)} 位）
      </div>
      <div>
        日照時間：{showValue(sun.value)}時間（全国 {showValue(sun.rank, true)}{" "}
        位）
      </div>
      <div>
        降水量：{showValue(rain.value)}mm（全国 {showValue(rain.rank, true)}{" "}
        位）
      </div>
      <div>
        降雪量：{showValue(snow.value, true)}cm（全国{" "}
        {showValue(snow.rank, true)} 位）
      </div>
      {/* グラフ */}
    </div>
  );
}
