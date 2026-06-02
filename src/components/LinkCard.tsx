import Link from "next/link";
import React from "react";
import { FaChevronRight } from "react-icons/fa";

// ==============================
// Types
// ==============================
interface LinkCardProps {
  href: string;
  Icon: React.ReactNode;
  title: string;
  description: string;
  iconClass?: string;
}

// ==============================
// Component
// ==============================
const LinkCard: React.FC<LinkCardProps> = ({
  href,
  Icon,
  title,
  description,
  iconClass,
}) => {
  return (
    <Link
      href={href}
      className="group relative flex flex-col p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 overflow-hidden"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`text-3xl p-3 rounded-lg bg-gray-50 group-hover:bg-white group-hover:scale-110 transition-transform duration-300 ${
            iconClass || "text-blue-600"
          }`}
        >
          {Icon}
        </div>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        {description}
      </p>
      <div className="mt-auto flex items-center text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
        <span>詳細を見る</span>
        <FaChevronRight className="ml-1" />
      </div>
    </Link>
  );
};

export default LinkCard;
