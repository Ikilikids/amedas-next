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
export const METRIC_COLORS = [
  "text-indigo-500",
  "text-sky-500",
  "text-teal-500",
  "text-green-500",
  "text-lime-500",
  "text-yellow-500",
  "text-orange-500",
  "text-red-500",
  "text-pink-500",
  "text-purple-500",
];

/**
 * Calculates a color based on the value's relative position between min and max.
 * @param value The value to color
 * @param min Minimum value in the dataset
 * @param max Maximum value in the dataset
 * @param useSlateForZero If true, a value of 0 will be colored slate (neutral).
 *                        Typically true for counts (days, mm, h) and false for continuous scales (℃).
 */
export function getMetricColor(
  value: number | null | undefined,
  min: number,
  max: number,
  useSlateForZero: boolean = true
) {
  if (value == null) return "text-slate-400";

  // If 0 should be neutral (e.g., 0mm rain, 0 days of extreme heat)
  if (useSlateForZero && value === 0) return "text-slate-500";

  if (max <= min) return METRIC_COLORS[Math.floor(METRIC_COLORS.length / 2)];

  // Clamp ratio between 0 and 0.999...
  const ratio = Math.max(0, Math.min(0.999, (value - min) / (max - min)));
  const index = Math.floor(ratio * METRIC_COLORS.length);
  return METRIC_COLORS[index];
}
