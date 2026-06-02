import React from "react";
import { OverviewData } from "../types/all";
import { MetricKey } from "../utils/metric";
import { TbTemperaturePlus } from "react-icons/tb";
import { BsFillCloudRainHeavyFill } from "react-icons/bs";
import { FaSnowman } from "react-icons/fa6";
import { AiFillSun } from "react-icons/ai";
import { BiWind } from "react-icons/bi";

interface SummaryStatsProps {
  overviewData: OverviewData;
}

const SummaryStats: React.FC<SummaryStatsProps> = ({ overviewData }) => {
  const stats = [
    {
      meta: MetricKey.av_avtemp,
      color: "text-rose-500",
      iconBg: "bg-rose-500/10",
      label: "気温",
    },
    {
      meta: MetricKey.sm_rain,
      color: "text-blue-500",
      iconBg: "bg-blue-500/10",
      label: "降水",
    },
    {
      meta: MetricKey.sm_snowing,
      color: "text-sky-400",
      iconBg: "bg-sky-400/10",
      label: "降雪",
    },
    {
      meta: MetricKey.sm_sun,
      color: "text-amber-500",
      iconBg: "bg-amber-500/10",
      label: "日照",
    },
    {
      meta: MetricKey.av_wind,
      color: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
      label: "風速",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat) => {
        const data = overviewData.get(stat.meta as any);
        if (!data) return null;

        return (
          <div
            key={stat.meta.key}
            className="relative overflow-hidden bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20 shadow-2xl group transition-all duration-300 hover:bg-white/20 hover:scale-[1.02]"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.iconBg} flex items-center justify-center`}>
                <span className={`text-2xl ${stat.color}`}>
                  {stat.meta.highIcon}
                </span>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black tracking-tighter uppercase text-white/80 border border-white/10">
                RANK {data.rank}
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-white/60 text-xs font-bold tracking-widest uppercase">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white tracking-tighter">
                  {data.value.toLocaleString(undefined, {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                </span>
                <span className="text-sm font-bold text-white/40">{stat.meta.unit}</span>
              </div>
            </div>

            {/* Subtle background glow */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-20 ${stat.iconBg}`} />
          </div>
        );
      })}
    </div>
  );
};

export default SummaryStats;
