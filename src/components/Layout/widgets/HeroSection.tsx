import React from "react";
import { FaSyncAlt } from "react-icons/fa";

export interface HeroSectionProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  Icon?: React.ReactNode;
  badgeIcon?: React.ReactNode;
  badgeText?: string;
  watermark?: string;
  gradient?: string;
  lastUpdateLabel?: string;
  lastUpdateValue?: string;
  rightContent?: React.ReactNode;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  description,
  Icon,
  badgeIcon,
  badgeText,
  watermark = "AMeDAS",
  gradient = "bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600",
  lastUpdateLabel,
  lastUpdateValue,
  rightContent,
}) => {
  const isTailwind = gradient.includes("bg-") || gradient.includes("from-");

  return (
    <div
      className={`${
        isTailwind ? gradient : ""
      } rounded-3xl p-6 text-white shadow-xl relative overflow-hidden`}
      style={!isTailwind ? { background: gradient } : {}}
    >
      {/* 背景のウォーターマーク大文字 */}
      {watermark && (
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 text-white/10 text-8xl md:text-9xl font-black select-none pointer-events-none uppercase">
          {watermark}
        </div>
      )}

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1 min-w-0 space-y-3">
          {/* 上部ピルタグ / カプセルタグ */}
          {(badgeText || badgeIcon) && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase">
              {badgeIcon}
              {badgeText && <span>{badgeText}</span>}
            </div>
          )}

          {/* ページタイトル */}
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
            {Icon && (
              <span className="text-3xl shrink-0 flex items-center justify-center">
                {Icon}
              </span>
            )}
            <span>{title}</span>
          </h1>

          {/* 説明文 */}
          {description && (
            <div className="text-white/90 text-sm font-medium leading-relaxed max-w-2xl">
              {description}
            </div>
          )}
        </div>

        {/* 右側カスタムコンテンツまたは更新日時バッジ */}
        {rightContent && (
          <div className="shrink-0 self-start md:self-auto">{rightContent}</div>
        )}
        {!rightContent && lastUpdateValue && (
          <div className="flex items-center gap-2.5 text-xs font-bold bg-black/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 shadow-sm shrink-0 self-start md:self-auto">
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
