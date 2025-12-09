import Link from "next/link";
import { useState } from "react";
import { getIcon, getRegionColor } from "../utils/colorUtils";
import LayeredPieChart from "./LayeredPieChart_part";
import MiniMap from "./MiniMap";
import UonzuChart from "./UonzuChart";
import Description from "./description";
import DescriptionSimple from "./description_simple";

export default function DescriptionWithUonzu({
  station,
  options,
  description,
}) {
  if (!station || station.length === 0) return null;

  // 各 station ごとの selectedBar を state で管理
  const [selectedBars, setSelectedBars] = useState(
    station.map(() => options[0].value) // ← 初期値も外から決められる
  );

  const handleChange = (idx, value) => {
    setSelectedBars((prev) => prev.map((v, i) => (i === idx ? value : v)));
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {station.map((s, idx) => {
        const regionColor = getRegionColor(s.pref);
        return (
          <div key={idx} className="w-full h-full flex flex-col">
            {/* タイトルバー */}
            <div
              className="flex flex-row items-center justify-between w-full mb-2 sm:mb-2 p-1 rounded"
              style={{ backgroundColor: regionColor }}
            >
              <h2 className="flex items-baseline gap-1 font-bold text-base sm:text-xl">
                {getIcon(s.official_name)}
                <Link href={`/station/${s.number}`} className="hover:underline">
                  {/* 小さいときは station_name, 大きいときは official_name */}
                  <span className="sm:hidden">{s.station_name}</span>
                  <span className="hidden sm:inline">{s.official_name}</span>
                </Link>
                <span className="text-gray-800 text-sm">({s.pref})</span>
              </h2>
              {/* プルダウン */}
              <div className="flex items-center gap-1 text-sm sm:text-base">
                <span>データ：</span>
                <select
                  className="p-0.5 border rounded text-sm sm:text-sm"
                  value={selectedBars[idx]}
                  onChange={(e) => handleChange(idx, e.target.value)}
                >
                  {options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 左: Description, 右: UonzuChart */}
            <div className="w-full sm:h-[350px] flex flex-col sm:flex-row gap-2">
              <div className="flex-[6] w-full">
                {description ? (
                  <Description station={s} />
                ) : (
                  <DescriptionSimple station={s} />
                )}
              </div>
              <div className="flex-[5] w-full min-h-[350px]">
                {selectedBars[idx] === "map" ? (
                  <MiniMap lat={s.lon} lng={s.lat} />
                ) : selectedBars[idx].includes("chart") ? (
                  <LayeredPieChart
                    values={s.ratio[selectedBars[idx].slice(-1)].list}
                    type={s.ratio[selectedBars[idx].slice(-1)].type}
                    month={s.ratio[selectedBars[idx].slice(-1)].month}
                  />
                ) : (
                  <UonzuChart
                    temp={s.temp}
                    hitemp={s.hitemp}
                    lwtemp={s.lwtemp}
                    rain={s.rain}
                    sun={s.sun}
                    snowing={s.snowing}
                    selectedBar={selectedBars[idx]}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
