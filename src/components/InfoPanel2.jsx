// src/components/InfoPanel.jsx

function normalizePref(pref) {
  return pref ? pref.replace(/[都府県]$/, "") : "";
}

function showValue(v, isSnow = false) {
  if (v === null || v === undefined) return "--";
  if (!isSnow && typeof v === "number" && Number.isInteger(v))
    return v.toFixed(1);
  return v;
}

export default function InfoPanel({ station }) {
  const data = station;

  const heightStr = data.height != null ? `${data.height}m` : "--m";
  const lonlat = data.lon != null ? `(${data.lat}, ${data.lon})` : "(--, --)";
  const avtemp = data.data.av_avtemp?.all ?? {};
  const maxtemp = data.data.av_hitemp?.all ?? {};
  const sun = data.data.sm_sun?.all ?? {};
  const rain = data.data.sm_rain?.all ?? {};
  const snow = data.data.sm_snowing?.all ?? {};

  return (
    <div className="p-2 rounded-md w-full h-full flex flex-col gap-2">
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
    </div>
  );
}
