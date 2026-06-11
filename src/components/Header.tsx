import Link from "next/link";
import React, { useState } from "react";
import { FaInfoCircle, FaSearch } from "react-icons/fa";
import { NavLink, navSections } from "../utils/navLinks";

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
    <header className="sticky top-0 z-[100] bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      {/* Top Gradient Bar */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-500"></div>

      <div className="max-w-[1280px] mx-auto flex flex-col">
        {/* 1段目: Logo, Search, Utils */}
        <div className="flex justify-between items-center py-3 lg:py-4 px-4 lg:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="group flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition-all duration-300 shadow-blue-200 shadow-lg group-hover:shadow-blue-300 group-hover:-translate-y-0.5">
                <span className="text-xl leading-none">🌡️</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl lg:text-2xl font-black tracking-tight text-slate-800">
                  アメダス<span className="text-blue-600">図鑑</span>
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none hidden lg:block">
                  Japan AMeDAS Database
                </span>
              </div>
            </Link>

            {/* Desktop Utility Links */}
            <div className="hidden xl:flex items-center gap-4 border-l pl-6 border-slate-200 ml-2">
              <Link
                href="/adsense-info.html"
                className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-blue-600 transition-colors"
              >
                <FaInfoCircle className="text-slate-300" />
                このサイトについて
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-4">
            {/* 検索 */}
            <form
              className="hidden lg:flex items-center bg-slate-100 rounded-full px-4 py-1.5 border border-transparent focus-within:border-blue-300 focus-within:bg-white transition-all shadow-inner"
              action="https://www.google.com/cse"
              method="get"
              target="_blank"
            >
              <FaSearch className="text-slate-400 mr-2 text-sm" />
              <input
                type="text"
                name="q"
                placeholder="地点を検索..."
                className="bg-transparent border-none outline-none text-sm w-48 text-slate-700 placeholder:text-slate-400 font-bold"
              />
              <input type="hidden" name="cx" value="a24d2c9bde483408d" />
              <button
                type="submit"
                className="ml-2 text-xs font-black text-blue-600 hover:text-blue-800 transition-colors"
              >
                検索
              </button>
            </form>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md hover:bg-blue-700 transition-all active:scale-95"
              onClick={() => setOpen(!open)}
            >
              <span className="text-lg w-5 text-center">{open ? "✕" : "☰"}</span>
              <span>MENU</span>
            </button>
          </div>
        </div>

        {/* PC ナビ */}
        <nav className="hidden lg:flex px-2 border-t border-slate-50">
          {navSections.map((section) => (
            <div
              key={section.id}
              className="group flex-1 relative cursor-pointer"
            >
              <div className="py-3 px-4 text-center">
                <span className="text-[14px] font-black text-slate-500 group-hover:text-blue-600 transition-colors duration-200 relative">
                  {section.title}
                  <span className="absolute -bottom-3 left-0 w-full h-[3px] bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-t-full" />
                </span>
              </div>

              {/* Dropdown content */}
              <div className="absolute left-0 top-full w-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform group-hover:translate-y-0 translate-y-2">
                <div className="bg-white shadow-2xl rounded-2xl border border-slate-100 overflow-hidden mx-2 mt-1 ring-1 ring-slate-900/5">
                  <div className="bg-slate-50/80 p-3 border-b border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                      {section.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 p-2 gap-1">
                    {section.links.map((f: NavLink) => (
                      <Link
                        key={f.href}
                        href={f.href}
                        className="flex items-start gap-4 p-3 hover:bg-blue-50/80 rounded-xl transition-all group/item text-left"
                      >
                        <div
                          className={`mt-1 p-2 rounded-lg bg-white shadow-sm border border-slate-100 text-xl transition-all duration-300 group-hover/item:scale-110 group-hover/item:shadow-md ${
                            f.iconClass || "text-blue-600"
                          }`}
                        >
                          {f.Icon}
                        </div>
                        <div className="flex flex-col">
                          <div className="font-black text-slate-700 group-hover/item:text-blue-600 transition-colors text-sm">
                            {f.title}
                          </div>
                          <div className="text-[11px] text-slate-400 font-bold leading-tight mt-0.5">
                            {f.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* スマホ */}
        {open && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white z-[110] overflow-y-auto max-h-[calc(100vh-100%)] shadow-2xl border-t border-slate-100">
            <div className="p-6 flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <a
                  href="/adsense-info.html"
                  className="flex items-center justify-center gap-2 bg-slate-50 text-slate-500 py-3 px-4 rounded-xl text-xs font-black hover:bg-slate-100 transition-colors"
                >
                  <FaInfoCircle />
                  このサイトについて
                </a>
              </div>

              {navSections.map((section) => (
                <div key={section.id} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      {section.title}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {section.links.map((item: NavLink) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="p-3 bg-slate-50 hover:bg-blue-50 rounded-xl flex items-center gap-4 transition-all group active:scale-[0.98]"
                        onClick={() => setOpen(false)}
                      >
                        <div
                          className={`p-2 rounded-lg bg-white shadow-sm border border-slate-100 text-lg ${item.iconClass}`}
                        >
                          {item.Icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-700 group-hover:text-blue-600 text-sm">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
