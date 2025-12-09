// components/Header.jsx
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b-2">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500"></div>
      <div className="max-w-[1280px] mx-auto pt-4 flex flex-col gap-2">
        {/* 1段目：ロゴ + 検索バー(大画面) + メニューボタン(小画面) */}
        <div className="flex justify-between items-center pb-3 lg:pb-0 px-4">
          {/* ロゴ */}
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

          {/* 🔸 メニューボタン（lg未満で表示） */}
          <button
            className="lg:hidden bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={() => setOpen(!open)}
          >
            メニュー
          </button>
        </div>

        {/* 🔸 2段目ナビ（lg以上のみ表示） */}
        <nav className="hidden lg:flex">
          {[
            { href: "/map", label: "マップから探す" },
            {
              href: "/ranking/av_avtemp/top/default",
              label: "ランキングから探す",
            },
            { href: "/prefecture", label: "都道府県から探す" },
          ].map((item, index) => (
            <Link
              key={item.href + index}
              href={item.href}
              className="flex-1 text-center text-black font-semibold px-4 relative"
            >
              <div className="hover:bg-blue-900 py-2 hover:text-white">
                {item.label}
              </div>
              {index == 0 && (
                <span className="absolute left-0 top-1/4 h-1/2 border-l border-gray-300"></span>
              )}
              <span className="absolute right-0 top-1/4 h-1/2 border-r border-gray-300"></span>
            </Link>
          ))}
        </nav>

        {/* 🔸 スマホ・タブレット用ドロワーメニュー（lg未満で表示） */}
        {open && (
          <div className="lg:hidden bg-white border-t pt-2 pb-4 flex flex-col gap-2 px-4">
            {[
              { href: "/map", label: "マップから探す" },
              {
                href: "/ranking/av_avtemp/top/default",
                label: "ランキングから探す",
              },
              { href: "/prefecture", label: "都道府県から探す" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-blue-900 text-lg py-1"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
