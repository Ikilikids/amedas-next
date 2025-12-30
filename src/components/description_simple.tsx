import React from "react";
import { IoIosTrophy } from "react-icons/io";

// ==============================
// Types
// ==============================
interface StationData {
  記録: string | null;
  d1?: string | null;
  d2?: string | null;
  d3?: string | null;
  d4?: string | null;
  d5?: string | null;
}

interface DescriptionSimpleProps {
  station: StationData;
}

// ==============================
// Component
// ==============================
const DescriptionSimple: React.FC<DescriptionSimpleProps> = ({ station }) => {
  const details = [
    station.d1,
    station.d2,
    station.d3,
    station.d4,
    station.d5,
  ].filter(Boolean); // null / undefined / "" を除外

  return (
    <div className="">
      <div className="flex gap-1">
        <span className="flex-shrink-0">
          <IoIosTrophy className="mt-1" />
        </span>
        <span className="break-words mb-1 font-bold">
          主な記録：{station.記録}
        </span>
      </div>

      {details.map((text, i) => (
        <div key={i} className="whitespace-pre-line text-sm">
          {text}
        </div>
      ))}
    </div>
  );
};

export default DescriptionSimple;
