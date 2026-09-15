import React from "react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const allItems: BreadcrumbItem[] = [{ label: "ホーム", href: "/" }, ...items];

  return (
    <nav aria-label="パンくずリスト" className="mb-6">
      <ol className="flex items-center gap-1.5 text-xs font-bold text-slate-400 flex-wrap">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <span className="text-slate-300 text-[10px] mx-0.5 select-none" aria-hidden="true">
                  /
                </span>
              )}
              <li className="flex items-center">
                {isLast || !item.href ? (
                  <span className="text-slate-600 truncate max-w-[200px] ">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
