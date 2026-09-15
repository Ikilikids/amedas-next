import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import ArticleTemplate, { ArticleSection } from "../../../components/Article/ArticleTemplate";
import { TocItem } from "../../../components/Sidebar";
import {
  FaCompass,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import { REGION_LIST, RegionKey, RegionValue } from "../../../setting/region";
import { PrefKey, getPrefsInRegion } from "../../../setting/pref";
import ClimateUonzuAccordion from "../../../components/Article/ClimateUonzuAccordion";
import { ArticleUonzuItem, loadUonzuItemsForList } from "../../../utils/ssgLoader";

interface Props {
  regionUonzuMap: Record<string, ArticleUonzuItem[]>;
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const regionUonzuMap: Record<string, ArticleUonzuItem[]> = {};

  REGION_LIST.forEach((regKey) => {
    const detail = RegionKey[regKey]?.detail;
    if (detail?.uonzuList) {
      regionUonzuMap[regKey] = loadUonzuItemsForList(detail.uonzuList);
    } else {
      regionUonzuMap[regKey] = [];
    }
  });

  return {
    props: {
      regionUonzuMap,
    },
  };
};

const tocItems: TocItem[] = [
  { id: "intro", label: "1. 日本の地域別気候の特徴と多様性" },
  { id: "hokkaido", label: "2. 北海道地方の気候" },
  { id: "tohoku", label: "3. 東北地方の気候" },
  { id: "kanto", label: "4. 関東地方の気候" },
  { id: "hokuriku", label: "5. 北陸地方の気候" },
  { id: "chubu", label: "6. 中部地方の気候" },
  { id: "kinki", label: "7. 近畿地方の気候" },
  { id: "chugoku", label: "8. 中国地方の気候" },
  { id: "shikoku", label: "9. 四国地方の気候" },
  { id: "kyushu", label: "10. 九州地方の気候" },
  { id: "okinawa", label: "11. 沖縄地方の気候" },
];

const RegionIndexPage: NextPage<Props> = ({ regionUonzuMap }) => {
  return (
    <>
      <Head>
        <title>地域別の気候解説・全国10地方の特徴まとめ - アメダス図鑑</title>
        <meta
          name="description"
          content="北海道から沖縄まで、全国10地方の気候特性・季節風や地形の影響・アメダス観測所の特徴を徹底解説。各地方の詳細ページや都道府県別の気候ガイドへナビゲートします。"
        />
        <link rel="canonical" href="https://amedas-zukan.jp/feature/region" />
      </Head>

      <ArticleTemplate
        breadcrumbs={[
          { label: "気候特集", href: "/feature/meteo" },
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
        tocItems={tocItems}
        backHref="/feature/meteo"
        backLabel="気候特集トップに戻る"
      >
        {/* 導入セクション */}
        <ArticleSection
          id="intro"
          title="1. 日本の地域別気候の特徴と多様性"
          accentColor="#2563eb"
        >
          <p>
            日本列島は、南北約3,000kmにわたって弓状に延びており、北は氷点下30℃に達する亜寒帯の北海道から、南は年間を通じて常夏の亜熱帯に属する沖縄・奄美まで、きわめて幅広い気候帯を有しています。
          </p>
          <p className="mt-3">
            さらに日本の中央部には標高2,000〜3,000m級の峻険な脊梁山脈が走り、冬のシベリアからの北西季節風や夏の太平洋高気圧からの南東季節風を真正面から受け止めます。この地形構造が、日本海側の豪雪と太平洋側の冬晴れ乾燥という対照的な気候差を生み出し、さらには内陸盆地や瀬戸内の穏やかな気候など、地域ごとに際立った個性を作り出しています。
          </p>
          <p className="mt-3">
            以下では、全国10地方の気候特性の概要を順に解説します。各地方のブロックから、より詳細な地域個別ページや各都道府県のページへ進むことができます。
          </p>
        </ArticleSection>

        {/* 各地域の解説セクション */}
        {REGION_LIST.map((regKey, index) => {
          const regMeta = RegionKey[regKey];
          const info = regMeta.detail;
          const prefKeys = getPrefsInRegion(regKey);
          const sectionNumber = index + 2;

          return (
            <ArticleSection
              key={regKey}
              id={regKey}
              title={`${sectionNumber}. ${regMeta.label}地方の気候`}
              accentColor={regMeta.colorStrong}
            >
              <p className="font-bold text-slate-800 mb-2">
                【特徴】{info?.catchphrase}（{info?.climateType}）
              </p>

              <p className="text-slate-600 leading-relaxed">
                {(
                  info?.description?.find((sec) => sec.isSummary) ||
                  info?.description?.[0]
                )?.content?.join("") || ""}
              </p>

              {/* ハイライト */}
              {info?.highlights && info.highlights.length > 0 && (
                <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="text-xs font-black text-slate-700 block">
                    主な気候ポイント:
                  </span>
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
                    {info.highlights.map((hl, hIdx) => (
                      <div
                        key={hIdx}
                        className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-200/80 shadow-sm min-w-0"
                      >
                        <FaCheckCircle
                          className="text-xs shrink-0"
                          style={{ color: regMeta.colorStrong }}
                        />
                        <span className="truncate" title={hl}>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 代表地点の雨温図（開閉式） */}
              {regionUonzuMap[regKey] && regionUonzuMap[regKey].length > 0 && (
                <ClimateUonzuAccordion
                  title={`${regMeta.label}地方の代表雨温図`}
                  items={regionUonzuMap[regKey]}
                  accentColor={regMeta.colorStrong}
                  defaultOpen={true}
                />
              )}

              {/* 所属都道府県 */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3 mb-4">
                <span className="text-xs font-bold text-slate-400 mr-1">
                  所属都道府県・地域:
                </span>
                {prefKeys.map((pk) => {
                  const pMeta = PrefKey[pk];
                  return (
                    <Link
                      key={pk}
                      href={`/feature/region/${regKey}/${pk}`}
                      className="text-xs font-bold px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg border border-slate-200/60 transition-colors"
                    >
                      {pMeta?.label}
                    </Link>
                  );
                })}
              </div>

              {/* 詳細リンク */}
              <div className="mt-3">
                <Link
                  href={`/feature/region/${regKey}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white shadow-sm hover:opacity-95 transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${regMeta.colorStrong} 0%, color-mix(in srgb, ${regMeta.colorStrong} 75%, black) 100%)`,
                  }}
                >
                  <span>{regMeta.label}地方の詳しい気候解説・都道府県一覧へ</span>
                  <FaArrowRight className="text-[10px]" />
                </Link>
              </div>
            </ArticleSection>
          );
        })}
      </ArticleTemplate>
    </>
  );
};

export default RegionIndexPage;
