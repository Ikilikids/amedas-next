import React from "react";

interface SectionWithDescriptionProps {
  icon: React.ReactNode;
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
      <div className="flex flex-row flex-wrap items-center justify-between w-full border-b border-gray-100 pb-3 gap-y-4">
        <div className="flex items-center gap-3 relative">
          {/* Vertical accent line */}
          <div
            className="w-1.5 h-8 rounded-full"
            style={{ backgroundColor: bgColor }}
          />

          <div
            className="p-2 rounded-xl text-white shadow-sm flex items-center justify-center"
            style={{ backgroundColor: bgColor }}
          >
            {Icon && <span className="text-xl">{Icon}</span>}
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

export function getTempColor(value: number | null | undefined) {
  if (value == null) return "text-slate-400";
  if (value >= 35) return "text-red-700";
  if (value >= 30) return "text-red-500";
  if (value >= 25) return "text-orange-500";
  if (value >= 20) return "text-yellow-500";
  if (value >= 15) return "text-lime-500";
  if (value >= 10) return "text-green-500";
  if (value >= 5) return "text-cyan-500";
  if (value >= 0) return "text-blue-500";
  return "text-indigo-600";
}

export function getRainColor(value: number | null | undefined) {
  if (value == null) return "text-slate-400";
  if (value >= 500) return "text-red-700";
  if (value >= 300) return "text-red-500";
  if (value >= 250) return "text-orange-500";
  if (value >= 200) return "text-yellow-500";
  if (value >= 150) return "text-lime-500";
  if (value >= 100) return "text-green-500";
  if (value >= 50) return "text-cyan-500";
  if (value >= 25) return "text-blue-500";
  if (value > 0) return "text-sky-500";
  return "text-slate-500";
}
