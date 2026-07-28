import React from "react";
import { FaTrophy } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { WiRaindrops, WiThermometer } from "react-icons/wi";
import { RawOverviewData, RawTableData } from "../types/raw";
import { generateClimateSummary } from "../utils/climateSummaryGenerator";

interface AiClimateDigestCardProps {
  stationName: string;
  table: RawTableData;
  overview: RawOverviewData;
}

export const AiClimateDigestCard: React.FC<AiClimateDigestCardProps> = ({
  stationName,
  table,
  overview,
}) => {
  const summary = generateClimateSummary(stationName, table, overview);

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-500/20 relative overflow-hidden my-6">
      {/* 背景装飾 */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <HiSparkles size={120} />
      </div>

      {/* カードヘッダー */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center">
          <HiSparkles className="text-white text-xl animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold tracking-wide text-white">
              AI 気候特徴ダイジェスト
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 font-mono">
              平年値分析
            </span>
          </div>
          <p className="text-xs text-indigo-200/80">
            {stationName}観測所の蓄積気象データに基づく分析レポート
          </p>
        </div>
      </div>

      {/* 特徴バッジ一覧 */}
      <div className="flex flex-wrap gap-2 mb-5">
        {summary.badges.map((badge, idx) => (
          <span
            key={idx}
            className={`text-xs font-semibold px-3 py-1 rounded-full border shadow-sm ${badge.colorClass}`}
          >
            {badge.label}
          </span>
        ))}
      </div>

      {/* 総合概要 */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-sm text-slate-200 leading-relaxed mb-4">
        {summary.overviewSummary}
      </div>

      {/* 詳細分析グリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 気温アナリティクス */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-2">
            <WiThermometer size={26} />
            <span>気温特性</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {summary.tempSummary}
          </p>
        </div>

        {/* 降水・雨温アナリティクス */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-2">
            <WiRaindrops size={26} />
            <span>降水・日照特性</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {summary.rainSummary}
          </p>
        </div>
      </div>

      {/* ランキングハイライト（該当する場合のみ） */}
      {summary.rankingSummary && (
        <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 flex items-start gap-3">
          <FaTrophy className="text-amber-400 text-xl flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/90 leading-relaxed">
            {summary.rankingSummary}
          </p>
        </div>
      )}
    </div>
  );
};
