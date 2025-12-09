import { useMemo, useState } from "react";
import {
  getFullRegionColor,
  getIcon,
  mainKeys,
  metrics,
  prefCodeMap,
  slugMonthMap,
  slugToRegion,
} from "../utils/colorUtils";

export default function Ranking({
  initialStations,
  initialSortKey,
  initialRankType,
  initialRegion,
  initialPref,
  initialMonth,
  onStationClick,
}) {
  const [stations, setStations] = useState(initialStations);
  const [sortKey, setSortKey] = useState(initialSortKey);
  const [rankType, setRankType] = useState(initialRankType);
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [selectedPref, setSelectedPref] = useState(initialPref);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);

  const islandPrefixes = [
    "886",
    "887",
    "888",
    "889",
    "4417",
    "442",
    "443",
    "9",
  ];
  const isIslandId = (id) => id && islandPrefixes.some((p) => id.startsWith(p));

  const metricsByCategory = {
    平均: metrics.filter(
      (m) => m.key.includes("av") && !mainKeys.includes(m.key)
    ),
    気温日数: metrics.filter(
      (m) => m.key.includes("temp_") && !mainKeys.includes(m.key)
    ),
    降水日数: metrics.filter(
      (m) => m.key.includes("rain_") && !mainKeys.includes(m.key)
    ),
    降雪日数: metrics.filter(
      (m) => m.key.includes("snowing_") && !mainKeys.includes(m.key)
    ),
    積雪日数: metrics.filter(
      (m) => m.key.includes("snowed_") && !mainKeys.includes(m.key)
    ),
    風速日数: metrics.filter(
      (m) => m.key.includes("wind_") && !mainKeys.includes(m.key)
    ),
  };

  // --- fetch 関数（ユーザー操作でのみ呼ぶ） ---
  const fetchStations = ({ typeParam, rankParam, detailParam, monthParam }) => {
    console.log(
      `/ranking/${typeParam}/${rankParam}/${detailParam}/${monthParam}.json`
    );
    fetch(
      rankParam === "bot" ||
        rankParam === "top" ||
        rankParam === "island" ||
        rankParam === "meteo"
        ? `/ranking/${typeParam}/${rankParam}/${monthParam}.json`
        : `/ranking/${typeParam}/${rankParam}/${detailParam}/${monthParam}.json`
    )
      .then((res) => res.json())
      .then((data) => {
        const stationList = Object.entries(data).map(([id, d]) => ({
          id,
          station_name: d.station_name,
          official_name: d.official_name,
          pref: d.pref,
          city: d.city,
          value: d.value,
          rank: d.rank,
        }));
        setStations(stationList);
      })
      .catch(() => setStations([]));
  };

  // --- filteredStations ---
  const filteredStations = useMemo(() => {
    return stations
      .filter((s) => s.value != null)
      .sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity));
  }, [stations, sortKey, rankType, selectedRegion, selectedPref]);

  // --- display切替のみ & fetch ---
  const changeDisplay = ({
    newSortKey,
    newRankType,
    newMonth,
    newRegion,
    newPref,
    newMetric,
  }) => {
    if (newSortKey) setSortKey(newSortKey);
    if (newRankType) setRankType(newRankType);
    if (newMonth) setSelectedMonth(newMonth);
    if (newRegion) setSelectedRegion(newRegion);
    if (newPref) setSelectedPref(newPref);
    if (newMetric !== undefined) setSelectedMetric(newMetric);

    // fetch はユーザー操作でのみ
    fetchStations({
      typeParam: newSortKey || sortKey,
      rankParam: newRankType || rankType,
      detailParam:
        (newRankType || rankType) === "pre"
          ? newPref || selectedPref
          : (newRankType || rankType) === "region"
          ? newRegion || selectedRegion
          : "default",
      monthParam: newMonth || selectedMonth,
    });
  };

  return (
    <div className="overflow-auto h-full p-2 flex flex-col gap-2">
      {/* データ種別切替 */}
      <div className="flex gap-2 mb-2 flex-wrap">
        {metrics
          .filter((m) => mainKeys.includes(m.key))
          .map(({ key, label }) => {
            const isDisabled = rankType === "island" && !key.includes("temp");
            return (
              <button
                key={key}
                disabled={isDisabled}
                className={`px-3 py-1 rounded ${
                  isDisabled
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : sortKey === key
                    ? "bg-orange-400 text-white"
                    : "bg-gray-200 hover:bg-orange-100"
                }`}
                onClick={() =>
                  !isDisabled &&
                  changeDisplay({ newSortKey: key, newMetric: null })
                }
              >
                {label}
              </button>
            );
          })}
        <div className="relative">
          <button
            className={`px-3 py-1 rounded ${
              selectedMetric
                ? "bg-orange-400 text-white"
                : "bg-gray-200 hover:bg-orange-100"
            }`}
            onClick={() => setShowPopup(!showPopup)}
          >
            {selectedMetric ? `${selectedMetric.label} ▸` : "その他 ▸"}
          </button>
          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div
                className="absolute inset-0 bg-black opacity-30"
                onClick={() => setShowPopup(false)}
              />
              <div className="relative w-[90%] max-w-[520px] bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10">
                <h3 className="font-semibold mb-2 text-gray-700">
                  その他の項目
                </h3>
                <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
                  {Object.entries(metricsByCategory).map(
                    ([category, items]) => (
                      <div key={category}>
                        <div className="font-semibold text-gray-600 mb-1">
                          {category}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {items.map((m) => {
                            const isDisabled =
                              rankType === "island" && !m.key.includes("temp");
                            return (
                              <button
                                key={m.key}
                                disabled={isDisabled}
                                onClick={() =>
                                  !isDisabled && setSelectedMetric(m)
                                }
                                className={`px-2 py-1 text-sm rounded ${
                                  isDisabled
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : selectedMetric?.key === m.key
                                    ? "bg-orange-400 text-white"
                                    : "bg-gray-100 hover:bg-orange-100"
                                }`}
                              >
                                {m.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => {
                      setShowPopup(false);
                    }}
                  >
                    キャンセル
                  </button>
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => {
                      if (selectedMetric)
                        changeDisplay({
                          newSortKey: selectedMetric.key,
                          newMetric: selectedMetric,
                        });
                      setShowPopup(false);
                    }}
                  >
                    適用
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ランク種別 */}
      <div className="flex gap-2 mb-2 flex-wrap">
        {[
          { key: "top", label: "上位100地点" },
          { key: "bot", label: "下位100地点" },
          { key: "island", label: "島嶼部を除く" },
          { key: "region", label: "地域別" },
          { key: "pre", label: "県別" },
          { key: "meteo", label: "気象台のみ" },
        ].map(({ key, label }) => {
          const isDisabled = key === "island" && !sortKey.includes("temp");
          return (
            <button
              key={key}
              disabled={isDisabled}
              className={`px-2 py-1 rounded text-sm ${
                isDisabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : rankType === key
                  ? "bg-green-400 text-white"
                  : "bg-gray-200 hover:bg-green-200"
              }`}
              onClick={() =>
                !isDisabled &&
                changeDisplay({
                  newRankType: key,
                  newRegion: key === "region" ? "kanto" : undefined,
                  newPref: key === "pre" ? "44" : undefined,
                })
              }
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 地域/県セレクト */}
      {rankType === "region" && (
        <select
          className="p-1 mb-2 border rounded text-sm"
          value={selectedRegion}
          onChange={(e) => changeDisplay({ newRegion: e.target.value })}
        >
          {Object.entries(slugToRegion).map(([slug, label]) => (
            <option key={slug} value={slug}>
              {label}
            </option>
          ))}
        </select>
      )}
      {rankType === "pre" && (
        <select
          className="p-1 mb-2 border rounded text-sm"
          value={selectedPref}
          onChange={(e) => changeDisplay({ newPref: e.target.value })}
        >
          {Object.entries(prefCodeMap).map(([slug, label]) => (
            <option key={slug} value={slug}>
              {label}
            </option>
          ))}
        </select>
      )}

      {/* 月選択 */}
      <div className="flex gap-1.5 mb-2 flex-wrap">
        {Object.entries(slugMonthMap).map(([monthSlug, label]) => (
          <button
            key={monthSlug}
            className={`px-1.5 py-1 rounded text-sm ${
              selectedMonth === monthSlug
                ? "bg-indigo-400 text-white"
                : "bg-gray-200 hover:bg-indigo-200"
            }`}
            onClick={() => changeDisplay({ newMonth: monthSlug })}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ランキングリスト */}
      {filteredStations.map((s) => {
        const val =
          s.value != null
            ? sortKey === "sm_snowing"
              ? s.value
              : s.value.toFixed(1)
            : "";
        const rank = s.rank ?? "--";
        const icon = getIcon(s.official_name || "");
        const regioncolor = getFullRegionColor(s.pref || "");
        const isTemp = sortKey.endsWith("temp");
        const unit = isTemp
          ? "℃"
          : sortKey === "sm_rain"
          ? "mm"
          : sortKey === "sm_snowing"
          ? "cm"
          : sortKey === "av_wind"
          ? "m/s"
          : sortKey === "sm_sun"
          ? "時間"
          : "日";

        return (
          <div
            key={s.id}
            className="flex items-center justify-between p-3 bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition"
            onClick={() => onStationClick(s)}
          >
            <div className="w-12 text-center font-bold text-lg flex flex-col items-center">
              <span>
                {isIslandId(s.id) && sortKey.includes("temp")
                  ? `${rank}*`
                  : rank}
              </span>
            </div>
            <div className="flex-1 ml-3">
              <div className="font-bold flex items-center gap-1">
                {icon}
                <span className="block md:hidden">{s.station_name}</span>
                <span className="hidden md:block">{s.official_name}</span>
              </div>
              <div className="flex gap-1 items-end text-sm">
                <span className="font-semibold" style={{ color: regioncolor }}>
                  {s.pref}
                </span>
                <span className="font-normal text-gray-700 text-xs">
                  {s.city}
                </span>
              </div>
            </div>
            <div className="text-right font-extrabold">
              {val} {unit}
            </div>
          </div>
        );
      })}
    </div>
  );
}
