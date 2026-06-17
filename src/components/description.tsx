import React from "react";
import { IoIosTrophy, IoMdInformationCircleOutline } from "react-icons/io";
import { WiThermometer, WiRaindrops, WiStars } from "react-icons/wi";
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
  const standardKeys = ["prime", "temp", "rain", "other", "record"];
  
  // Extract non-standard keys (e.g., d1, d2, d3 from hot.json)
  const unknownEntries = Object.entries(description)
    .filter(([key]) => !standardKeys.includes(key))
    .sort(([a], [b]) => a.localeCompare(b));

  const sections = [
    { 
      key: "prime", 
      label: "概要", 
      icon: <IoMdInformationCircleOutline className="text-blue-500" />,
      extraContent: unknownEntries.map(([_, text]) => text).join("\n")
    },
    { key: "temp", label: "気温の特徴", icon: <WiThermometer className="text-red-500" size={24} /> },
    { key: "rain", label: "降水・日照", icon: <WiRaindrops className="text-cyan-500" size={24} /> },
    { key: "other", label: "その他", icon: <WiStars className="text-amber-500" size={24} /> },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Principal Record */}
      {description.record && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-3 items-start shadow-sm">
          <div className="bg-amber-400 p-1.5 rounded-lg text-white shadow-sm flex-shrink-0 mt-0.5">
            <IoIosTrophy size={18} />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-0.5">
              主な記録・特徴
            </div>
            <div className="text-sm font-black text-slate-800 leading-relaxed">
              {description.record}
            </div>
          </div>
        </div>
      )}

      {/* Structured Sections */}
      <div className="grid grid-cols-1 gap-4 mt-2">
        {sections.map((section) => {
          const mainContent = description[section.key];
          const extraContent = (section as any).extraContent;
          
          if (!mainContent && !extraContent) return null;

          return (
            <div key={section.key} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-slate-700 font-bold border-b border-slate-100 pb-1">
                <span className="text-lg">{section.icon}</span>
                <span className="text-sm">{section.label}</span>
              </div>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line pl-1 flex flex-col gap-2">
                {mainContent && <div>{mainContent}</div>}
                {extraContent && <div>{extraContent}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Description;
