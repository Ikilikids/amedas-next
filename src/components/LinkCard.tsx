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
  category?: string;
  actionText?: string;
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
  category,
  actionText = "詳細を見る",
}) => {
  return (
    <Link
      href={href}
      className="group block bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300"
    >
      <div className="flex flex-col gap-5 items-start">
        <div
          className={`text-4xl p-4 bg-slate-50 border border-slate-100 rounded-2xl shrink-0 group-hover:scale-105 transition-transform duration-300 ${
            iconClass || "text-blue-600"
          }`}
        >
          {Icon}
        </div>
        <div className="flex-1 min-w-0">
          {category && (
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full font-black text-xs">
                {category}
              </span>
            </div>
          )}

          <h3 className="text-lg font-black text-slate-800 group-hover:text-blue-600 transition-colors leading-snug mb-2">
            {title}
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            {description}
          </p>

          <div className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 group-hover:gap-2 transition-all">
            <span>{actionText}</span>
            <FaChevronRight className="text-[10px]" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LinkCard;
