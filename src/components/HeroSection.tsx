import React from "react";
import { FaSyncAlt } from "react-icons/fa";

interface HeroSectionProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  Icon: React.ReactNode;
  gradient?: string;
  lastUpdateLabel?: string;
  lastUpdateValue?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  description,
  Icon,
  gradient = "bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600",
  lastUpdateLabel,
  lastUpdateValue,
}) => {
  const isTailwind = gradient.includes("bg-") || gradient.includes("from-");

  return (
    <div
      className={`${
        isTailwind ? gradient : ""
      } text-white py-6  px-4  shadow-sm border-b border-white/10`}
      style={!isTailwind ? { background: gradient } : {}}
    >
      <div
        className="max-w-[1280px] mx-auto flex flex-col  justify-between items-start  gap-4"
      >
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl  font-black flex items-center gap-3 tracking-tight">
            {Icon && (
              <span className="text-3xl  shrink-0 flex items-center justify-center">
                {Icon}
              </span>
            )}
            <span className="truncate">{title}</span>
          </h1>
          {description && (
            <div className="mt-2 text-white/90 text-xs  font-medium leading-relaxed max-w-3xl">
              {description}
            </div>
          )}
        </div>
        {lastUpdateValue && (
          <div className="flex items-center gap-2.5 text-xs font-bold bg-black/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 shadow-sm shrink-0">
            <FaSyncAlt className="animate-spin-slow text-white/80 text-xs" />
            <span>
              {lastUpdateLabel}: {lastUpdateValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
