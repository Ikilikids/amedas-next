import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import ArticleTemplate, { ArticleSection } from "../../../../components/Article/ArticleTemplate";
import { TocItem } from "../../../../components/Sidebar";
import {
  FaCompass,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import { REGION_LIST, RegionKey, RegionValue, RegionMeta } from "../../../../setting/region";
import { PrefKey, PrefValue, getPrefsInRegion, ClimateArticleData } from "../../../../setting/pref";
import ClimateUonzuAccordion from "../../../../components/Article/ClimateUonzuAccordion";
import { ArticleUonzuItem, loadUonzuItemsForList } from "../../../../utils/ssgLoader";

export interface RegionPrefSectionItem extends ClimateArticleData {
  key: PrefValue;
  name: string;
  prefUonzuItems?: ArticleUonzuItem[];
}

interface Props {
  regionKey: RegionValue;
  regionMeta: RegionMeta;
  prefSections: RegionPrefSectionItem[];
  regionUonzuItems: ArticleUonzuItem[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = REGION_LIST.map((region) => ({
    params: { region },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const regionKey = params?.region as RegionValue;
  const regionMeta = RegionKey[regionKey];

  if (!regionMeta) {
    return { notFound: true };
  }

  // 地方の代表地点の雨温図データを取得
  const regionUonzuItems = loadUonzuItemsForList(regionMeta.detail.uonzuList);

  // 地方内の都県キー一覧を取得し、個別データ（pMeta.detail）があれば採用、なければプレースホルダーを適用
  const prefKeys = getPrefsInRegion(regionKey);
  const prefSections: RegionPrefSectionItem[] = prefKeys.map((pk) => {
    const pMeta = PrefKey[pk];
    const definedData = pMeta.detail;

    if (definedData) {
      return {
        key: pk,
        name: pMeta.label,
        ...definedData,
        prefUonzuItems: loadUonzuItemsForList(definedData.uonzuList),
      };
    }

    // 未作成の地方用プレースホルダー
    return {
      key: pk,
      name: pMeta.label,
      catchphrase: `${pMeta.label}の気候と風土`,
      climateType: regionMeta.detail.climateType,
      heroDescription: `${pMeta.label}の気候特性、季節風や地形の影響、アメダス観測所の特徴を徹底解説。`,
      description: [
        {
          isSummary: true,
          content: [
            `${pMeta.label}の気候平年値データとアメダス観測所の特徴をまとめています。`,
            `季節風や地形の影響により、地域特有の気候特性が見られます。`,
          ],
        },
      ],
      highlights: regionMeta.detail.highlights.slice(0, 2),
      prefUonzuItems: [],
    };
  });

  return {
    props: {
      regionKey,
      regionMeta,
      prefSections,
      regionUonzuItems,
    },
  };
};

const RegionDetailPage: NextPage<Props> = ({
  regionKey,
  regionMeta,
  prefSections,
  regionUonzuItems,
}) => {
  const detail = regionMeta.detail;
  const introTitle = `1. ${regionMeta.label}地方の気候の特徴とメカニズム`;

  // 目次（TOC）: セクション1が地方全体の総括、セクション2以降が各都道府県
  const tocItems: TocItem[] = [
    { id: "intro", label: introTitle },
    ...prefSections.map((pref, idx) => ({
      id: pref.key,
      label: `${idx + 2}. ${pref.name}の気候`,
    })),
  ];

  return (
    <>
      <Head>
        <title>{`${regionMeta.label}地方の気候・都道府県別特徴まとめ - アメダス図鑑`}</title>
        <meta
          name="description"
          content={`${regionMeta.label}地方の気候特性・風土メカニズムと、${prefSections
            .map((p) => p.name)
            .join("・")}の都道府県別気候解説まとめ。`}
        />
        <link rel="canonical" href={`https://amedas-zukan.jp/feature/region/${regionKey}`} />
      </Head>

      <ArticleTemplate
        breadcrumbs={[
          { label: "気候特集", href: "/feature/meteo" },
          { label: "地域別の気候解説", href: "/feature/region" },
          { label: `${regionMeta.label}地方` },
        ]}
        hero={{
          badgeIcon: <FaCompass className="text-white/90" />,
          badgeText: `${regionMeta.label} Region Climate`,
          title: `${regionMeta.label}地方の気候特性・特徴まとめ`,
          description: detail.heroDescription,
          watermark: regionKey.toUpperCase(),
          gradient: `linear-gradient(135deg, ${regionMeta.colorStrong} 0%, color-mix(in srgb, ${regionMeta.colorStrong} 75%, black) 100%)`,
          rightContent: (
            <div className="text-xs font-bold bg-black/20 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-white shrink-0">
              {prefSections.length} 都道府県・地域
            </div>
          ),
        }}
        category="気候学・地方別解説"
        publishedAt="2026年9月16日"
        readTime="約7分"
        title={`${regionMeta.label}地方の気候特性〜風土・季節風・地形のメカニズム〜`}
        points={[
          `気候区分: ${detail.climateType}`,
          `キャッチコピー: ${detail.catchphrase}`,
          `${regionMeta.label}地方を構成する全${prefSections.length}都道県・地域の気候を見出し別に徹底解説`,
        ]}
        tocItems={tocItems}
        backHref="/feature/region"
        backLabel="全地域一覧に戻る"
      >
        {/* セクション1: 地方全体の総括（導入） */}
        <ArticleSection
          id="intro"
          title={introTitle}
          accentColor={regionMeta.colorStrong}
        >
          <div className="space-y-4">
            <p className="font-bold text-slate-800">
              【特徴】{detail.catchphrase}（{detail.climateType}）
            </p>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              {detail.description.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-1">
                  {sec.title && (
                    <h3 className="font-bold text-slate-800">
                      【{sec.title}】
                    </h3>
                  )}
                  <p>{sec.content.join("")}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 地方の主な気候ポイント */}
          {detail.highlights && detail.highlights.length > 0 && (
            <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-xs font-black text-slate-700 block">
                {regionMeta.label}地方の主な気候ポイント:
              </span>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
                {detail.highlights.map((hl, hIdx) => (
                  <div
                    key={hIdx}
                    className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-200/80 shadow-sm min-w-0"
                  >
                    <FaCheckCircle
                      className="text-xs shrink-0"
                      style={{ color: regionMeta.colorStrong }}
                    />
                    <span className="truncate" title={hl}>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 地方の代表地点の雨温図（開閉式） */}
          {regionUonzuItems && regionUonzuItems.length > 0 && (
            <ClimateUonzuAccordion
              title={`${regionMeta.label}地方の代表雨温図`}
              items={regionUonzuItems}
              accentColor={regionMeta.colorStrong}
              defaultOpen={true}
            />
          )}
        </ArticleSection>

        {/* セクション2〜: 各都道府県が見出しになって順に並ぶ（統合ページと同様の構造） */}
        {prefSections.map((pref, idx) => {
          const sectionNumber = idx + 2;

          return (
            <ArticleSection
              key={pref.key}
              id={pref.key}
              title={`${sectionNumber}. ${pref.name}の気候`}
              accentColor={regionMeta.colorStrong}
            >
              <div className="space-y-4">
                <p className="font-bold text-slate-800">
                  【特徴】{pref.catchphrase}（{pref.climateType}）
                </p>

                <p className="text-slate-600 leading-relaxed">
                  {(
                    pref.description?.find((sec) => sec.isSummary) ||
                    pref.description?.[0]
                  )?.content?.join("") || ""}
                </p>

                {/* 主な気候ポイント */}
                {pref.highlights && pref.highlights.length > 0 && (
                  <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <span className="text-xs font-black text-slate-700 block">
                      主な気候ポイント:
                    </span>
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
                        {pref.highlights.map((hl, hIdx) => (
                          <div
                            key={hIdx}
                            className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-200/80 shadow-sm min-w-0"
                          >
                            <FaCheckCircle
                              className="text-xs shrink-0"
                              style={{ color: regionMeta.colorStrong }}
                            />
                            <span className="truncate" title={hl}>{hl}</span>
                          </div>
                        ))}
                      </div>
                  </div>
                )}

                {/* 各都道府県の代表雨温図（開閉式） */}
                {pref.prefUonzuItems && pref.prefUonzuItems.length > 0 && (
                  <ClimateUonzuAccordion
                    title={`${pref.name}の代表雨温図`}
                    items={pref.prefUonzuItems}
                    accentColor={regionMeta.colorStrong}
                    defaultOpen={true}
                  />
                )}

                {/* 第3階層（都道府県個別ページ）への誘導リンクボタン */}
                <div className="pt-2">
                  <Link
                    href={`/feature/region/${regionKey}/${pref.key}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white shadow-sm hover:opacity-95 transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${regionMeta.colorStrong} 0%, color-mix(in srgb, ${regionMeta.colorStrong} 75%, black) 100%)`,
                    }}
                  >
                    <span>{pref.name}の詳しい気候解説・アメダス観測データへ</span>
                    <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>
              </div>
            </ArticleSection>
          );
        })}
      </ArticleTemplate>
    </>
  );
};

export default RegionDetailPage;
