import Link from "next/link";
import React from "react";

// ==============================
// Types
// ==============================
interface FooterProps {}

// ==============================
// Component
// ==============================
const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 py-12">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-slate-800 pb-8 mb-8">
          <div className="text-xl font-bold text-white">
            <Link href="/" className="hover:text-blue-400 transition-colors">
              アメダス図鑑
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a
              href="/adsense-info.html"
              className="hover:text-white transition-colors"
            >
              このサイトについて
            </a>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              プライバシーポリシー
            </Link>
            <a
              href="https://www.jma.go.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              気象庁
            </a>
          </div>
        </div>
        <div className="text-center text-sm text-slate-500">
          <p>© 2025-2026 アメダス図鑑. Data sourced from Japan Meteorological Agency.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
