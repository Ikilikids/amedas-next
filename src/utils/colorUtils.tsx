import React from "react";
import { IconType } from "react-icons";

interface SectionWithDescriptionProps {
  icon: IconType;
  title: string;
  bgColor: string;
  description?: string[];
  children?: React.ReactNode;
}

export function SectionWithDescription({
  icon: Icon,
  title,
  bgColor,
  description,
  children,
}: SectionWithDescriptionProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between w-full border-b border-gray-100 pb-3">
        <div className="flex items-center gap-3 relative">
          {/* Vertical accent line */}
          <div
            className="absolute -left-4 w-1.5 h-8 rounded-full"
            style={{ backgroundColor: bgColor }}
          />
          
          <div 
            className="p-2 rounded-xl text-white shadow-sm"
            style={{ backgroundColor: bgColor }}
          >
            {Icon && <Icon className="w-5 h-5" />}
          </div>
          
          <h2 className="font-black text-2xl text-slate-800 tracking-tighter">
            {title}
          </h2>
        </div>

        {/* children (like selects) go to the right */}
        {children && <div className="z-10">{children}</div>}
      </div>

      {description && (
        <div className="text-xs font-bold text-slate-400 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed italic">
          {description.map((line, i) => (
            <div key={i} className="flex gap-2">
              <span className="opacity-50">•</span>
              <span>{line}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const MonthMap: { [key: string]: string } = {
  all: "通年",
  "1": "1月",
  "2": "2月",
  "3": "3月",
  "4": "4月",
  "5": "5月",
  "6": "6月",
  "7": "7月",
  "8": "8月",
  "9": "9月",
  "10": "10月",
  "11": "11月",
  "12": "12月",
};

export function getTempColor(temp: number | null | undefined) {
  if (temp == null) return "text-slate-400";
  if (temp >= 35) return "text-red-700";
  if (temp >= 30) return "text-red-500";
  if (temp >= 25) return "text-orange-500";
  if (temp >= 20) return "text-yellow-500";
  if (temp >= 15) return "text-lime-500";
  if (temp >= 10) return "text-green-500";
  if (temp >= 5) return "text-cyan-500";
  if (temp >= 0) return "text-blue-500";
  return "text-indigo-600";
}
