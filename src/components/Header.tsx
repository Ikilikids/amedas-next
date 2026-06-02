import Link from "next/link";
import React, { useState } from "react";
import {
  NavLink,
  featureLinks,
  rankingLinks,
  searchLinks,
} from "../utils/navLinks"; // NavLink もインポート

// ==============================
// Types
// ==============================
interface HeaderProps {}

// ==============================
// Component
// ==============================
const Header: React.FC<HeaderProps> = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <header className="bg-white border-b-2">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500"></div>

      <div className="max-w-[1280px] mx-auto pt-4 flex flex-col gap-2">
        {/* 1段目 */}
        <div className="flex justify-between items-center pb-3 lg:pb-0 px-4">
          <div className="text-2xl font-bold">
            <Link href="/">アメダス図鑑</Link>
          </div>

          {/* 検索 */}
          <form
            className="hidden lg:flex"
            action="https://www.google.com/cse"
            method="get"
            target="_blank"
          >
            <input
              type="text"
              name="q"
              placeholder="サイト内検索"
              className="border rounded-l px-2 py-1"
            />
            <input type="hidden" name="cx" value="a24d2c9bde483408d" />
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 rounded-r hover:bg-blue-600"
            >
              検索
            </button>
          </form>

          {/* メニュー */}
          <button
            className="lg:hidden bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => setOpen(!open)}
          >
            メニュー
          </button>
        </div>

        {/* PC ナビ */}
        <nav className="hidden lg:flex relative">
          {searchLinks.map((item: NavLink, index: number) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 text-center font-bold px-4 relative group"
            >
              <div className="py-3 text-slate-700 group-hover:text-blue-600 transition-colors duration-200">
                {item.title}
              </div>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
              {index === 0 && (
                <span className="absolute left-0 top-1/4 h-1/2 border-l border-gray-200" />
              )}
              <span className="absolute right-0 top-1/4 h-1/2 border-r border-gray-200" />
            </Link>
          ))}

          {/* アメダス特集 */}
          <div className="group flex-1 text-center font-bold px-4 relative cursor-pointer">
            <div className="py-3 text-slate-700 group-hover:text-blue-600 transition-colors duration-200">
              アメダス特集
            </div>
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
            <span className="absolute right-0 top-1/4 h-1/2 border-r border-gray-200" />

            <div className="absolute left-0 top-full w-full bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border-t border-blue-50">
              <div className="flex flex-col w-full p-4 gap-2">
                {featureLinks.map((f: NavLink) => (
                  <Link
                    key={f.href}
                    href={f.href}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors group/item text-left"
                  >
                    <span
                      className={`text-xl transition-transform duration-200 group-hover/item:scale-110 ${
                        f.iconClass || "text-blue-600"
                      }`}
                    >
                      {f.Icon}
                    </span>
                    <div className="font-bold text-slate-700">{f.title}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="group flex-1 text-center font-bold px-4 relative cursor-pointer">
            <div className="py-3 text-slate-700 group-hover:text-blue-600 transition-colors duration-200">
              年別ランキング
            </div>
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
            <span className="absolute right-0 top-1/4 h-1/2 border-r border-gray-200" />

            <div className="absolute left-0 top-full w-full bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border-t border-blue-50">
              <div className="flex flex-col w-full p-4 gap-2">
                {rankingLinks.map((f: NavLink) => (
                  <Link
                    key={f.href}
                    href={f.href}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors group/item text-left"
                  >
                    <span
                      className={`text-xl transition-transform duration-200 group-hover/item:scale-110 ${
                        f.iconClass || "text-blue-600"
                      }`}
                    >
                      {f.Icon}
                    </span>
                    <div className="font-bold text-slate-700">{f.title}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* スマホ */}
        {open && (
          <div className="lg:hidden bg-white border-t pt-2 pb-4 flex flex-col gap-2 px-4">
            <a
              href="/adsense-info.html"
              className="text-blue-800 font-semibold"
            >
              このサイトについて
            </a>
            <Link href="/privacy" className="text-blue-800 font-semibold">
              プライバシーポリシー
            </Link>

            {searchLinks.map((item: NavLink) => (
              <Link key={item.href} href={item.href} className="py-1">
                {item.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
