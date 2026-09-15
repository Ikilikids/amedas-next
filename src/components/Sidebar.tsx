import React, { useState } from "react";
import Link from "next/link";
import { FaBookOpen, FaInfoCircle, FaChevronRight, FaChevronDown, FaTags } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { PiRankingDuotone } from "react-icons/pi";
import { COLUMNS } from "../data/columns";

export interface TocItem {
  id: string; // e.g. "section-basic"
  label: string; // e.g. "1. 基本データ・位置マップ"
}

interface SidebarProps {
  children?: React.ReactNode;
  tocItems?: TocItem[];
  showColumns?: boolean;
  showTools?: boolean;
  showAbout?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  tocItems,
  showColumns = true,
  showTools = true,
  showAbout = true,
}) => {
  const [isTocOpen, setIsTocOpen] = useState(false);

  return (
    <aside className="w-full lg:w-[320px] shrink-0 space-y-6 lg:sticky lg:top-6 self-start">
      {/* ページ内目次（開閉式: デフォルト閉） */}
      {tocItems && tocItems.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <button
            type="button"
            onClick={() => setIsTocOpen(!isTocOpen)}
            className="w-full flex items-center justify-between font-black text-slate-800 text-sm group text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FaBookOpen className="text-blue-600" />
              <span>目次</span>
              <span className="text-xs text-slate-400 font-normal">
                （全{tocItems.length}項目）
              </span>
            </div>
            <div className="text-slate-400 group-hover:text-blue-600 transition-colors p-1">
              <FaChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isTocOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {isTocOpen && (
            <ul className="mt-4 pt-3 border-t border-slate-100 space-y-2.5 text-xs font-bold text-slate-600 max-h-[60vh] overflow-y-auto pr-1">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="hover:text-blue-600 transition-colors block leading-relaxed"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ページ独自のコンテンツ（目次以外のコンパニオンなど） */}
      {children}

      {/* 気象コラムピックアップ */}
      {showColumns && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 font-black text-slate-800 text-sm">
              <FaBookOpen className="text-blue-600" />
              <span>気象コラム・解説</span>
            </div>
            <Link
              href="/column"
              className="text-[11px] font-black text-blue-600 hover:underline"
            >
              一覧へ
            </Link>
          </div>

          <div className="space-y-4">
            {COLUMNS.slice(0, 3).map((col) => (
              <Link
                key={col.slug}
                href={`/column/${col.slug}`}
                className="group block"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl p-2 bg-slate-50 border border-slate-100 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                    {col.coverEmoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black text-blue-600 block mb-0.5">
                      {col.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                      {col.title}
                    </h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 人気ツールへのクイックアクセス */}
      {showTools && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 font-black text-slate-800 mb-3 pb-3 border-b border-slate-100 text-sm">
            <FaMapLocationDot className="text-emerald-600" />
            <span>人気ツールから探す</span>
          </div>
          <div className="space-y-2">
            <Link
              href="/map"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors group"
            >
              <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">
                🗺️ マップから探す
              </span>
              <FaChevronRight className="text-[10px] text-slate-400 group-hover:text-blue-600" />
            </Link>
            <Link
              href="/live/daily_ranking"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors group"
            >
              <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">
                🏆 今日の気象ランキング
              </span>
              <FaChevronRight className="text-[10px] text-slate-400 group-hover:text-blue-600" />
            </Link>
            <Link
              href="/clim_ranking"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors group"
            >
              <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">
                📊 平年値ランキング
              </span>
              <FaChevronRight className="text-[10px] text-slate-400 group-hover:text-blue-600" />
            </Link>
            <Link
              href="/compare"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors group"
            >
              <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">
                ⚖️ 2地点の気候を比較
              </span>
              <FaChevronRight className="text-[10px] text-slate-400 group-hover:text-blue-600" />
            </Link>
            <Link
              href="/gacha"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors group"
            >
              <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">
                🎲 アメダス・ガチャ
              </span>
              <FaChevronRight className="text-[10px] text-slate-400 group-hover:text-blue-600" />
            </Link>
          </div>
        </div>
      )}

      {/* サイト概要・About導線 */}
      {showAbout && (
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 font-black text-slate-800 mb-2.5 text-sm">
            <FaInfoCircle className="text-blue-600" />
            <span>アメダス図鑑とは</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            気象庁の全国約1,300地点の観測データと平年値（1991〜2020年）をもとに、各地点の雨温図やランキング、気候類似度を独自に分析・可視化する研究データベースです。
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 hover:underline"
          >
            <span>サイトの趣旨・お問い合わせ</span>
            <FaChevronRight className="text-[10px]" />
          </Link>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
