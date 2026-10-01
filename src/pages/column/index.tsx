import { NextPage } from "next";
import Link from "next/link";
import Layout from "../../components/Layout";
import Sidebar from "../../components/Layout/widgets/Sidebar";
import { COLUMNS, ColumnArticle } from "../../data/columns";
import { FaBookOpen, FaClock, FaCalendarAlt, FaChevronRight, FaInfoCircle, FaTags } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { PiRankingDuotone } from "react-icons/pi";

const ColumnIndexPage: NextPage = () => {
  return (
    <Layout
      seo={{
        title: "気象コラム・気候解説 - アメダス図鑑",
        description:
          "アメダス図鑑がお届けする気象・気候の解説コラム。日本の気候区分の秘密や雨温図の読み解き方、観測網の仕組みなどを専門的かつ分かりやすく解説します。",
        canonical: "https://amedas-zukan.jp/column",
      }}
      breadcrumbs={[
        { label: "気象コラム" },
      ]}
        sidebar={<Sidebar />}
        heroProps={{
          badgeIcon: <FaBookOpen className="text-sky-300" />,
          badgeText: "Weather Column & Insights",
          title: "気象コラム・解説",
          description: "雨温図の見方から日本の気候区分の秘密、気象データの面白い読み解き方まで。アメダス観測データをより深く楽しむための解説記事一覧です。",
          watermark: "COLUMN",
          gradient: "bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600",
        }}
        sections={[
          {
            id: "articles-list",
            label: "コラム一覧",
            accentColor: "#3b82f6",
            children: (
              <div className="space-y-6">
                {COLUMNS.map((article: ColumnArticle) => (
                  <article
                    key={article.slug}
                    className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group relative"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-bold mb-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black"
                        style={{
                          color: article.color,
                          backgroundColor: `color-mix(in srgb, ${article.color} 10%, white)`,
                        }}
                      >
                        <span className="text-sm">{article.Icon}</span>
                        <span>{article.category}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt />
                        <span>{article.publishedAt}</span>
                      </span>
                      <span className="flex items-center gap-1 ml-auto">
                        <FaClock />
                        <span>{article.readTime}</span>
                      </span>
                    </div>

                    <h2 className="text-xl font-black text-slate-800 group-hover:text-blue-600 transition-colors mb-3 leading-snug">
                      <Link href={`/column/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {article.description}
                    </p>

                    <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                      <Link
                        href={`/column/${article.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-black group-hover:translate-x-1 transition-transform"
                        style={{ color: article.color }}
                      >
                        <span>続きを読む</span>
                        <FaChevronRight className="text-[10px]" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ),
          },
        ]}
      />
  );
};

export default ColumnIndexPage;
