// src/components/InfoPanel.jsx
import { IoIosTrophy } from "react-icons/io";

export default function DescriptionSimple({ station }) {
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
}
