import Link from "next/link";
import React, { useState } from "react";
import { getIcon, getRegionColor } from "../utils/colorUtils";
import LayeredPieChart from "./LayeredPieChart_part";
import MiniMap from "./MiniMap";
import UonzuChart from "./UonzuChart";
import Description from "./description";
import DescriptionSimple from "./description_simple";

// ==============================
// Types
// ==============================
interface RatioItem {
  list: (number | null)[];
  type: string;
  month: number | "all";
}

interface Station {
  official_name: string;
  station_name: string;
  pref: string;
  number: string;
  lon: number | string; // Assuming lon/lat can be string from API
  lat: number | string;
  temp: (number | null)[];
  hitemp: (number | null)[];
  lwtemp: (number | null)[];
  rain: (number | null)[];
  sun: (number | null)[];
  snowing: (number | null)[];
  ratio: RatioItem[];
  記録: string | null; // Changed from optional to required
  d1: string | null; // Changed from optional to required
  d2: string | null; // Changed from optional to required
  d3: string | null; // Changed from optional to required
  d4: string | null; // Changed from optional to required
  d5: string | null; // Changed from optional to required
  概要: string | null; // Changed from optional to required
  気温: string | null; // Changed from optional to required
  降水: string | null; // Changed from optional to required
  その他: string | null; // Changed from optional to required
}

interface Option {
  value: string;
  label: string;
}

interface DescriptionWithUonzuProps {
  station: Station[];
  options: Option[];
  description: boolean;
}

// ==============================
// Component
// ==============================
const DescriptionWithUonzu: React.FC<DescriptionWithUonzuProps> = ({
  station,
  options,
  description,
}) => {
  const [selectedBars, setSelectedBars] = useState<string[]>(() =>
    station ? station.map(() => options[0].value) : []
  );

  if (!station || station.length === 0) return null;

  const handleChange = (idx: number, value: string) => {
    setSelectedBars((prev) => prev.map((v, i) => (i === idx ? value : v)));
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {station.map((s, idx) => {
        const regionColor = getRegionColor(s.pref);
        const selectedBarValue = selectedBars[idx];
        const ratioIndex = Number(selectedBarValue.slice(-1));
        const currentRatio = s.ratio[ratioIndex];

        return (
          <div key={idx} className="w-full h-full flex flex-col">
            <div
              className="flex flex-row items-center justify-between w-full mb-2 sm:mb-2 p-1 rounded"
              style={{ backgroundColor: regionColor }}
            >
              <h2 className="flex items-baseline gap-1 font-bold text-base sm:text-xl">
                {getIcon(s.official_name)}
                <Link href={`/station/${s.number}`} className="hover:underline">
                  <span className="sm:hidden">{s.station_name}</span>
                  <span className="hidden sm:inline">{s.official_name}</span>
                </Link>
                <span className="text-gray-800 text-sm">({s.pref})</span>
              </h2>
              <div className="flex items-center gap-1 text-sm sm:text-base">
                <span>データ：</span>
                <select
                  className="p-0.5 border rounded text-sm sm:text-sm"
                  value={selectedBarValue}
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

            <div className="w-full flex flex-col sm:flex-row gap-2">
              <div className="flex-[6] w-full sm:min-h-[350px]">
                {description ? (
                  <Description station={s} />
                ) : (
                  <DescriptionSimple station={s} />
                )}
              </div>
              <div className="flex-[5] w-full h-[350px] overflow-hidden">
                {selectedBarValue === "map" ? (
                  <MiniMap lat={s.lon} lng={s.lat} />
                ) : selectedBarValue.includes("chart") && currentRatio ? (
                  <LayeredPieChart
                    values={currentRatio.list}
                    type={currentRatio.type}
                    month={currentRatio.month}
                  />
                ) : (
                  <UonzuChart
                    temp={s.temp}
                    hitemp={s.hitemp}
                    lwtemp={s.lwtemp}
                    rain={s.rain}
                    sun={s.sun}
                    snowing={s.snowing}
                    selectedBar={selectedBarValue as any} // SelectedBar can be "rain" | "snowing" | "sun"
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DescriptionWithUonzu;
