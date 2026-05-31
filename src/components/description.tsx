import React from "react";
import { IoIosTrophy } from "react-icons/io";
import { DescriptionData } from "../types/union";

// ==============================
// Types
// ==============================

interface DescriptionProps {
  description: DescriptionData;
}

// ==============================
// Component
// ==============================
const Description: React.FC<DescriptionProps> = ({ description }) => {
  return (
    <div className="w-full sm:min-h-[350px]">
      <div className="flex gap-1">
        <span className="flex-shrink-0">
          <IoIosTrophy className="mt-1" />
        </span>
        <span className="break-words mb-1 font-bold">
          主な記録：{description.record}
        </span>
      </div>
      <div className="whitespace-pre-line text-sm">{description.other}</div>
      {Object.entries(description)
        .filter(([k]) => k !== "record")
        .map(([i, text]) => (
          <div key={i}>
            {descriptionRecord[i] && (
              <div className="whitespace-pre-line text-base font-bold">
                -----{descriptionRecord[i]}-----
              </div>
            )}
            <div className="whitespace-pre-line text-sm">{text}</div>
          </div>
        ))}
    </div>
  );
};

export default Description;

const descriptionRecord: Record<string, string> = {
  prime: "概要",
  temp: "気温",
  rain: "降水、日照など",
  other: "その他",
};
