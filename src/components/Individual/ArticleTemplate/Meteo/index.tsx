import React from "react";
import ArticleTemplate, { ArticleSectionItem } from "..";
import { FaBookOpen } from "react-icons/fa";
import { MeteoArticleData } from "./ssg_function";
import { MeteoStationCard } from "./widgets/MeteoStationCard/UI";

export interface MeteoArticlePageTemplateProps {
  data: MeteoArticleData;
}

export const MeteoArticlePageTemplate: React.FC<
  MeteoArticlePageTemplateProps
> = ({ data }) => {
  const { groups } = data;

  const sections: ArticleSectionItem[] = [
    {
      id: "overview",
      title: "はじめに：全国47都道府県の気候基準点",
      accentColor: "#e11d48",
      content: (
        <div className="space-y-3">
          <p className="leading-relaxed">
            日本の天気予報やニュースで基準とされる「各都道府県の代表気象台（気象官署）」。
            札幌から那覇まで、県庁所在地を中心とするこれら47地点の気象データは、それぞれの地域の気候特性を端的に表しています。
          </p>
          <p className="leading-relaxed">
            本コラムでは、1991〜2020年の平年値統計をもとに、全国47地点の「記録」「気温の特色」「降水量・雪の特色」を地方別に整理しました。
          </p>
        </div>
      ),
    },
    ...groups.map((group) => ({
      id: `region-${group.key}`,
      title: `${group.label}（${group.stations.length}地点）`,
      accentColor: group.color,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {group.stations.map((st) => (
              <MeteoStationCard key={st.id} station={st} />
            ))}
          </div>
        </div>
      ),
    })),
  ];

  return (
    <ArticleTemplate
      seo={{
        title: "全国47都道府県の代表気象台・気候総まとめ〜雨温図と平年値で読み解く地域の個性〜 - アメダス図鑑",
        description:
          "全国47都道府県庁所在地・代表気象台の気候特性、平年値データ、雨温図、順位記録を地域別に徹底比較・解説。各地の気温差や雨・雪の特徴が一目で分かります。",
        canonical: "https://amedas-zukan.jp/column/prefectures-meteo",
      }}
      breadcrumbs={[
        { label: "気象コラム", href: "/column" },
        { label: "全国47都道府県の代表気象台・気候総まとめ" },
      ]}
      hero={{
        badgeIcon: <FaBookOpen className="text-sky-300" />,
        badgeText: "Weather Column & Insights",
        title: "気象コラム・解説",
        description:
          "雨温図の見方から日本の気候区分の秘密、気象データの面白い読み解き方まで。アメダス観測データをより深く楽しむための解説記事一覧です。",
        watermark: "COLUMN",
        gradient: "bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600",
      }}
      category="気候まとめ・データ比較"
      publishedAt="2026年9月28日"
      readTime="約15分"
      title="全国47都道府県の代表気象台・気候総まとめ〜雨温図と平年値で読み解く地域の個性〜"
      points="北は札幌から南は那覇まで、全国47都道府県の代表気象台の気象平年値（1991〜2020年）を網羅。各地域の気候特性や特徴的な観測記録を地域ブロックごとに解説します。"
      sections={sections}
      backHref="/column"
      backLabel="コラム一覧に戻る"
    />
  );
};

export default MeteoArticlePageTemplate;
