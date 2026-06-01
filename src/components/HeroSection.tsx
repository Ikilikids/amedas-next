import React from "react";
import { IconType } from "react-icons";
import { FaSyncAlt } from "react-icons/fa";

interface HeroSectionProps {
  title: string;
  description: string;
  Icon: IconType;
  gradient?: string;
  lastUpdateLabel?: string;
  lastUpdateValue?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  description,
  Icon,
  gradient = "bg-gradient-to-r from-red-600 to-orange-700",
  lastUpdateLabel,
  lastUpdateValue,
}) => {
  return (
    <div className={`${gradient} text-white py-8 px-4 shadow-inner`}>
      <div
        className={`max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6`}
      >
        <div>
          <h1 className="text-4xl font-black flex items-center gap-4 mb-4 drop-shadow-md">
            <Icon className="w-12 h-12" />
            {title}
          </h1>
          <p className="text-white/90 text-lg max-w-2xl font-medium leading-relaxed">
            {description}
          </p>
        </div>
        {lastUpdateValue && (
          <div className="flex items-center gap-3 text-sm font-bold bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20 shadow-lg">
            <FaSyncAlt className="animate-spin-slow text-orange-200" />
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
