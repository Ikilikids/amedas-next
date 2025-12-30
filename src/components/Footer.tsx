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
    <footer className="bg-blue-100 border-t mt-8">
      <div className="max-w-5xl mx-auto p-4 text-center text-sm text-gray-600 flex flex-col sm:flex-row justify-center items-center gap-2">
        <span>© 2025 アメダス図鑑</span>
        <Link href="/privacy" className="text-blue-700 hover:underline">
          プライバシーポリシー
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
