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
    <div className="">
      <div
        className="flex flex-row items-center justify-between w-full z-10 p-1 rounded"
        style={{ backgroundColor: bgColor }}
      >
        <h2 className="flex items-center font-bold text-base sm:text-xl text-left gap-1">
          {Icon && <Icon />}
          {title}
        </h2>
        {/* childrenをここに置くと右端に */}
        {children && <div>{children}</div>}
      </div>

      {description && (
        <div className="text-sm pt-2">
          {description.map((line, i) => (
            <div key={i}>{line}</div>
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
