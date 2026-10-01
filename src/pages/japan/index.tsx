import React, { useMemo } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { FaCompass, FaArrowRight } from "react-icons/fa";
import { RegionKey, REGION_LIST } from "../../setting/region";
import { getPrefsInRegion } from "../../setting/pref";
import ArticleTemplate, { ArticleSectionItem } from "../../components/Individual/ArticleTemplate";

const RegionIndexPage: NextPage = () => {
  const sections: ArticleSectionItem[] = useMemo(() => {
    const list: ArticleSectionItem[] = [
      {
        id: "intro",
        title: "1. 日本の地域別気候の特徴と多様性",
        accentColor: "#2563eb",
        content: (
          <div className="space-y-3">
            <p>
              日本列島は、南北約3,000kmにわたって弓状に延びており、北は氷点下30℃に達する亜寒帯の北海道から、南は年間を通じて常夏の亜熱帯に属する沖縄・奄美まで、きわめて幅広い気候帯を有しています。
            </p>
            <p>
              さらに日本の中央部には標高2,000〜3,000m級の峻険な脊梁山脈が走り、冬のシベリアからの北西季節風や夏の太平洋高気圧からの南東季節風を真正面から受け止めます。この地形構造が、日本海側の豪雪と太平洋側の冬晴れ乾燥という対照的な気候差を生み出し、さらには内陸盆地や瀬戸内の穏やかな気候など、地域ごとに際立った個性を作り出しています。
            </p>
            <p>
              以下では、全国10地方の気候特性の概要を順に解説します。各地方のブロックから、より詳細な地域個別ページや各都道府県のページへ進むことができます。
            </p>
          </div>
        ),
      },
    ];

    REGION_LIST.forEach((regKey, index) => {
      const regMeta = RegionKey[regKey];
      const info = regMeta.detail;
      const prefs = getPrefsInRegion(regKey);
      const sectionNumber = index + 2;

      list.push({
        id: regKey,
        title: `${sectionNumber}. ${regMeta.label}地方の気候`,
        accentColor: regMeta.colorStrong,
        content: (
          <div className="space-y-4">
            <p className="font-bold text-slate-800">
              【特徴】{info?.catchphrase}（{info?.climateType}）
            </p>

            <p className="text-slate-600 leading-relaxed">
              {(
                info?.description?.find((sec) => sec.isSummary) ||
                info?.description?.[0]
              )?.content?.join("") || ""}
            </p>

            {/* 都道府県リンク */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              <span className="text-xs font-bold text-slate-500 self-center mr-1">
                所属都道府県:
              </span>
              {prefs.map((p) => (
                <Link
                  key={p.key}
                  href={`/japan/${regKey}/${p.key}`}
                  className="text-xs font-bold px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg border border-slate-200/60 transition-colors"
                >
                  {p.label}
                </Link>
              ))}
            </div>

            {/* 詳細リンク */}
            <div className="pt-2">
              <Link
                href={`/japan/${regKey}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white shadow-sm hover:opacity-95 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${regMeta.colorStrong} 0%, color-mix(in srgb, ${regMeta.colorStrong} 75%, black) 100%)`,
                }}
              >
                <span>{regMeta.label}地方の詳しい気候解説・都道府県一覧へ</span>
                <FaArrowRight className="text-[10px]" />
              </Link>
            </div>
          </div>
        ),
      });
    });

    return list;
  }, []);

  return (
    <ArticleTemplate
      seo={{
        title: "日本の地域別気候解説・特徴まとめ - アメダス図鑑",
        description:
          "全国10地方（北海道から沖縄まで）の気候区分と特徴を一覧解説。気候メカニズムや雨温図の傾向を地域ごとに深掘りします。",
        canonical: "https://amedas-zukan.jp/japan",
      }}
      breadcrumbs={[
        { label: "気候特集", href: "/column" },
        { label: "地域別の気候解説" },
      ]}
        hero={{
          badgeIcon: <FaCompass className="text-sky-300" />,
          badgeText: "Regional Climate Encyclopedia",
          title: "地域別の気候解説・特徴まとめ",
          description:
            "南北約3,000kmに連なる日本列島の多様な気候風土を10の地域ごとに徹底解説。山脈や季節風がもたらす気候の劇的な違いを読み解きます。",
          watermark: "REGIONS",
          gradient: "bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600",
        }}
        category="気候学・地域別解説"
        publishedAt="2026年9月16日"
        readTime="約8分"
        title="日本列島10地域の気候特性〜なぜ地域ごとにこんなに天気が違うのか？〜"
        points="日本列島を構成する北海道から沖縄までの全国10地方（北海道・東北・関東・北陸・中部・近畿・中国・四国・九州・沖縄）の気候特性、季節風、地形の影響を総括。各地域の解説からさらに各地方ごとの詳細ページ、そして各都道府県の気候解説へと深掘りできます。"
        sections={sections}
        backHref="/column"
        backLabel="コラム一覧に戻る"
      />
  );
};

export default RegionIndexPage;
