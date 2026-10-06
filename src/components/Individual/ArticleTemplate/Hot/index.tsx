import React from "react";
import ArticleTemplate, { ArticleSectionItem } from "..";
import { FaBookOpen, FaFireAlt, FaTemperatureHigh, FaSun } from "react-icons/fa";
import { HotArticleData } from "./ssg_function";
import { HotStationCard } from "./widgets/HotStationCard/UI";

export const HotArticlePageTemplate: React.FC<HotArticleData> = ({
  stations,
}) => {

  const sections: ArticleSectionItem[] = [
    {
      id: "overview",
      title: "概要：なぜ日本の特定の地域はここまで猛暑になるのか？",
      accentColor: "#dc2626",
      content: (
        <div className="space-y-3">
          <p className="leading-relaxed">
            日本の夏は全国的に高温多湿ですが、ニュースで連日のように40℃超えや最高気温ランキングの上位に登場する地点には、
            <strong>「内陸盆地」「山越えのフェーン現象」「大都市のヒートアイランド現象」</strong>
            という明確な気象・地形的理由が存在します。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
            <div className="p-3 bg-red-50/70 border border-red-200/80 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-red-900 text-sm">
                <FaSun className="text-red-500" />
                <span>内陸盆地</span>
              </div>
              <p className="text-xs text-red-700 leading-normal">
                周囲を山に囲まれ熱がこもりやすく、日射による昇温が極大化する。
              </p>
            </div>
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 text-sm">
                <FaTemperatureHigh className="text-amber-500" />
                <span>フェーン現象</span>
              </div>
              <p className="text-xs text-amber-700 leading-normal">
                山を吹き降りる際に乾燥断熱昇温し、熱風となって平野部を直撃する。
              </p>
            </div>
            <div className="p-3 bg-orange-50/70 border border-orange-200/80 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-orange-900 text-sm">
                <FaFireAlt className="text-orange-500" />
                <span>熱帯夜・蓄熱</span>
              </div>
              <p className="text-xs text-orange-700 leading-normal">
                都市化や海風の侵入遅れ、高湿度により夜間も気温が下がらない。
              </p>
            </div>
          </div>
          <p className="leading-relaxed">
            以下では、歴代最高気温ランキングの上位常連地点や、ニュースで話題となる代表的な猛暑地点14選の記録と気象背景を詳しく紹介します。
          </p>
        </div>
      ),
    },
    {
      id: "stations",
      title: "日本屈指の猛暑地点14選（歴代記録・観測特徴）",
      accentColor: "#dc2626",
      content: (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 mb-2">
            ※ 観測記録は歴代の極値データに基づきます。地点名をクリックすると各アメダスの平年値詳細ページへ移動します。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stations.map((st) => (
              <HotStationCard key={st.id} station={st} />
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "summary",
      title: "まとめ：観測地点ごとの暑さの質の違いを知る",
      accentColor: "#dc2626",
      content: (
        <div className="space-y-3">
          <p className="leading-relaxed">
            ひとくちに「猛暑」「日本一暑い街」と言っても、
            <strong>「昼間の絶対的な最高気温が突き抜ける盆地地点（美濃・多治見・日田など）」</strong>と、
            <strong>「夜間も気温がほとんど下がらず熱帯夜が連続する都市・沿岸地点（大阪など）」</strong>
            では、暑さの質や人体への影響が大きく異なります。
          </p>
          <p className="leading-relaxed">
            アメダス図鑑の各地点詳細ページでは、月別の最高気温・最低気温や日照時間などの平年値グラフ（雨温図）を掲載しています。ぜひ、気になる地点の気候データをチェックしてみてください。
          </p>
        </div>
      ),
    },
  ];

  return (
    <ArticleTemplate
      seo={{
        title: "日本一の暑さを誇る猛暑地点まとめ〜盆地・フェーン・熱帯夜のメカニズム〜 - アメダス図鑑",
        description:
          "多治見・日田・熊谷・伊勢崎・甲府など、夏季に連日ニュースを賑わせる日本有数の猛暑地点14選。国内最高記録や熱帯夜記録の背景にある地形・気象メカニズムを徹底解説します。",
        canonical: "https://amedas-zukan.jp/column/hot-stations",
      }}
      breadcrumbs={[
        { label: "気象コラム", href: "/column" },
        { label: "日本一の暑さを誇る猛暑地点まとめ" },
      ]}
      hero={{
        badgeIcon: <FaBookOpen className="text-sky-300" />,
        badgeText: "Weather Column & Insights",
        title: "気象コラム・解説",
        description:
          "雨温図の見方から日本の気候区分の秘密、気象データの面白い読み解き方まで。アメダス観測データをより深く楽しむための解説記事一覧です。",
        watermark: "COLUMN",
        gradient: "bg-gradient-to-r from-red-600 via-rose-600 to-amber-600",
      }}
      category="気候まとめ・データ比較"
      publishedAt="2026年9月28日"
      readTime="約8分"
      title="日本一の暑さを誇る猛暑地点まとめ〜盆地・フェーン・熱帯夜のメカニズム〜"
      points="40℃超えを連発する内陸盆地や、山越えのフェーン現象で記録的高温を叩き出す地点、夜間も気温が下がらない大都市まで、日本の代表的な暑い地点の観測記録と特徴をまとめました。"
      sections={sections}
      backHref="/column"
      backLabel="コラム一覧に戻る"
    />
  );
};

export default HotArticlePageTemplate;
