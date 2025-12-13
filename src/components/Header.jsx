// components/Header.jsx
import Link from "next/link";
import { useState } from "react";
import { featureLinks, searchLinks } from "../utils/navLinks";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b-2">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500"></div>
      <div className="max-w-[1280px] mx-auto pt-4 flex flex-col gap-2">
        {/* 1段目：ロゴ + 検索バー + メニューボタン */}
        <div className="flex justify-between items-center pb-3 lg:pb-0 px-4">
          <div className="text-2xl font-bold">
            <Link href="/">アメダス図鑑</Link>
          </div>

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

          {/* メニューボタン（小画面用） */}
          <button
            className="lg:hidden bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={() => setOpen(!open)}
          >
            メニュー
          </button>
        </div>

        {/* 🔸 PC ナビ（navLinks 使用） */}
        <nav className="hidden lg:flex relative">
          {searchLinks.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 text-center text-black font-semibold px-4 relative"
            >
              <div className="hover:bg-blue-900 py-2 hover:text-white">
                {item.title}
              </div>

              {/* 仕切り線 */}
              {index === 0 && (
                <span className="absolute left-0 top-1/4 h-1/2 border-l border-gray-300"></span>
              )}
              <span className="absolute right-0 top-1/4 h-1/2 border-r border-gray-300"></span>
            </Link>
          ))}

          {/* ▼▼ アメダス特集 ▼▼ */}
          <div className="group flex-1 text-center font-semibold px-4 relative cursor-pointer">
            <div className="hover:bg-blue-900 py-2 hover:text-white">
              アメダス特集
            </div>
            <span className="absolute right-0 top-1/4 h-1/2 border-r border-gray-300"></span>

            {/* ▼ ホバー時に出るサブメニュー ▼ */}
            <div className="absolute left-0 top-full w-full bg-white shadow-lg hidden group-hover:flex z-50 border-b">
              <div className="max-w-[1280px] mx-auto flex-col w-full px-4 py-4 gap-4">
                {featureLinks.map((f) => (
                  <Link
                    key={f.href}
                    href={f.href}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    <f.Icon className={`text-xl ${f.iconClass || ""}`} />
                    <div>
                      <div className="font-bold">{f.title}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* 🔸 スマホ用メニュー（navLinks 使用） */}
        {open && (
          <div className="lg:hidden bg-white border-t pt-2 pb-4 flex flex-col gap-2 px-4">
            {searchLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-blue-900 text-lg py-1"
              >
                {item.title}
              </Link>
            ))}

            {/* アメダス特集（スマホ版） */}
            <details className="text-blue-900">
              <summary className="text-lg py-1 cursor-pointer">
                アメダス特集
              </summary>
              <div className="pl-4 flex flex-col gap-1 mt-1">
                {featureLinks.map((f) => (
                  <Link
                    key={f.href}
                    href={f.href}
                    className="py-1 text-blue-700"
                  >
                    {f.title}
                  </Link>
                ))}
              </div>
            </details>
          </div>
        )}
      </div>
    </header>
  );
}
