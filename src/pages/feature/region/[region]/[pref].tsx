import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import ArticleTemplate, { ArticleSection } from "../../../../components/Article/ArticleTemplate";
import { TocItem } from "../../../../components/Sidebar";
import {
  FaMapMarkerAlt,
  FaCheckCircle,
  FaCompass,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { REGION_LIST, RegionKey, RegionValue, RegionMeta } from "../../../../setting/region";
import { PrefKey, PrefValue, PrefMeta, getPrefsInRegion } from "../../../../setting/pref";
import ClimateUonzuAccordion from "../../../../components/Article/ClimateUonzuAccordion";
import { ArticleUonzuItem, loadUonzuItemsForList } from "../../../../utils/ssgLoader";

import { ClimateSection } from "../../../../data/types";

interface Props {
  regionKey: RegionValue;
  prefKey: PrefValue;
  regionMeta: RegionMeta;
  prefMeta: PrefMeta;
  prefData: {
    name: string;
    catchphrase: string;
    climateType: string;
    heroDescription: string;
    description: ClimateSection[];
    highlights: string[];
  };
  prefUonzuItems: ArticleUonzuItem[];
  siblingPrefs: {
    key: PrefValue;
    label: string;
  }[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { region: string; pref: string } }[] = [];

  REGION_LIST.forEach((regionKey) => {
    const prefKeys = getPrefsInRegion(regionKey);
    prefKeys.forEach((prefKey) => {
      paths.push({
        params: {
          region: regionKey,
          pref: prefKey,
        },
      });
    });
  });

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const regionKey = params?.region as RegionValue;
  const prefKey = params?.pref as PrefValue;

  const regionMeta = RegionKey[regionKey];
  const prefMeta = PrefKey[prefKey];

  if (!regionMeta || !prefMeta || prefMeta.region.label !== regionMeta.label) {
    return { notFound: true };
  }

  // pref/[code]_[pref].ts などの専用データがあれば使用し、未作成の都道府県はフォールバック
  const customDetail = prefMeta.detail;

  interface PrefData {
    name: string;
    catchphrase: string;
    climateType: string;
    heroDescription: string;
    description: ClimateSection[];
    highlights: string[];
    uonzuList?: string[];
  }

  let prefData: PrefData = {
    name: prefMeta.label,
    catchphrase: `${prefMeta.label}の気候・風土の特徴`,
    climateType: "太平洋側気候 / 日本海側気候",
    heroDescription: `${prefMeta.label}の気候特性、季節風や地形の影響、アメダス観測所の特徴を徹底解説。`,
    description: [
      {
        isSummary: true,
        content: [
          `${prefMeta.label}の平年値データとアメダス観測所の特徴をまとめています。`,
          `周辺山脈や沿岸からの風向きによって気温や日照・降水傾向が変化します。`,
          `アメダス観測所ごとに地形特有の気候差が見られます。`,
        ],
      },
    ],
    highlights: [
      "季節風と地形による寒暖差",
      "アメダス観測地点ごとの標高差と局地気候",
      "平年値統計データによる年間推移",
    ],
  };

  if (customDetail) {
    prefData = {
      name: prefMeta.label,
      catchphrase: customDetail.catchphrase,
      climateType: customDetail.climateType,
      heroDescription: customDetail.heroDescription,
      description: customDetail.description,
      highlights: customDetail.highlights,
      uonzuList: customDetail.uonzuList,
    };
  }

  // 雨温図データのロード（都道府県代表3地点）
  const prefUonzuItems = loadUonzuItemsForList(prefData.uonzuList);

  const siblingKeys = getPrefsInRegion(regionKey);
  const siblingPrefs = siblingKeys.map((k) => ({
    key: k,
    label: PrefKey[k].label,
  }));

  return {
    props: {
      regionKey,
      prefKey,
      regionMeta,
      prefMeta,
      prefData,
      prefUonzuItems,
      siblingPrefs,
    },
  };
};

const PrefDetailPage: NextPage<Props> = ({
  regionKey,
  prefKey,
  regionMeta,
  prefMeta,
  prefData,
  prefUonzuItems,
  siblingPrefs,
}) => {
  const tocItems: TocItem[] = [
    { id: "overview", label: `1. ${prefMeta.label}の気候概況` },
    { id: "highlights", label: "2. 気候の主なポイント" },
    { id: "tools", label: "3. アメダス関連ツール・データ" },
    { id: "siblings", label: `4. ${regionMeta.label}地方の他の地域` },
  ];

  return (
    <>
      <Head>
        <title>{`${prefMeta.label}の気候とアメダス観測所まとめ - アメダス図鑑`}</title>
        <meta
          name="description"
          content={`${prefMeta.label}（${regionMeta.label}地方）の気候特性、平年値の傾向、アメダス観測データについて解説。`}
        />
        <link
          rel="canonical"
          href={`https://amedas-zukan.jp/feature/region/${regionKey}/${prefKey}`}
        />
      </Head>

      <ArticleTemplate
        breadcrumbs={[
          { label: "気候特集", href: "/feature/meteo" },
          { label: "地域別の気候解説", href: "/feature/region" },
          { label: `${regionMeta.label}地方`, href: `/feature/region/${regionKey}` },
          { label: prefMeta.label },
        ]}
        hero={{
          badgeIcon: <FaMapMarkerAlt className="text-white/90" />,
          badgeText: `${prefMeta.label} (${regionMeta.label})`,
          title: `${prefMeta.label}の気候・観測データ`,
          description: prefData.heroDescription,
          watermark: prefKey.toUpperCase(),
          gradient: `linear-gradient(135deg, ${regionMeta.colorStrong} 0%, color-mix(in srgb, ${regionMeta.colorStrong} 75%, black) 100%)`,
          rightContent: (
            <div className="text-xs font-mono font-bold bg-black/20 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-white shrink-0">
              PREF CODE: #{prefMeta.code.join(", #")}
            </div>
          ),
        }}
        category="気候学・都道府県別解説"
        publishedAt="2026年9月16日"
        readTime="約4分"
        title={`${prefMeta.label}の気候特性〜風土・季節の特徴とアメダス観測データ〜`}
        points={[
          `気候区分: ${prefData.climateType}`,
          `キャッチコピー: ${prefData.catchphrase}`,
          `${prefMeta.label}内のアメダス観測所の雨温図・平年値データをまとめて確認可能`,
        ]}
        tocItems={tocItems}
        backHref={`/feature/region/${regionKey}`}
        backLabel={`${regionMeta.label}地方の解説に戻る`}
      >
        {/* セクション1: 気候の特徴と概況 */}
        <ArticleSection
          id="overview"
          title={`1. ${prefMeta.label}の気候概況`}
          accentColor={regionMeta.colorStrong}
        >
          <div className="space-y-4">
            <p className="font-bold text-slate-800">
              【特徴】{prefData.catchphrase}（{prefData.climateType}）
            </p>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              {prefData.description.map((sec, sIdx) => (
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
        </ArticleSection>

        {/* セクション2: 主な気候ポイント */}
        {prefData.highlights && prefData.highlights.length > 0 && (
          <ArticleSection
            id="highlights"
            title="2. 気候の主なポイント"
            accentColor={regionMeta.colorStrong}
          >
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-2.5">
              {prefData.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-3 py-2.5 rounded-xl border border-slate-200/80 shadow-sm min-w-0"
                >
                  <FaCheckCircle
                    className="text-xs shrink-0"
                    style={{ color: regionMeta.colorStrong }}
                  />
                  <span className="truncate" title={item}>
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* 都道府県の代表地点の雨温図（開閉式） */}
            {prefUonzuItems && prefUonzuItems.length > 0 && (
              <ClimateUonzuAccordion
                title={`${prefMeta.label}の代表雨温図`}
                items={prefUonzuItems}
                accentColor={regionMeta.colorStrong}
                defaultOpen={true}
              />
            )}
          </ArticleSection>
        )}

        {/* セクション3: アメダス関連ツール */}
        <ArticleSection
          id="tools"
          title="3. アメダス関連ツール・データ"
          accentColor={regionMeta.colorStrong}
        >
          <p className="text-slate-600 mb-4">
            {prefMeta.label}内の観測地点の現在値や過去の平年値データ（雨温図）を各種ツールで深掘りできます。
          </p>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Link
              href={`/map?pref=${prefMeta.code[0]}`}
              className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all flex items-center justify-between group bg-white"
            >
              <div className="space-y-1">
                <span className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                  <FaMapMarkerAlt style={{ color: regionMeta.colorStrong }} />
                  マップで観測所を探す
                </span>
                <p className="text-xs text-slate-500">
                  地図上で{prefMeta.label}内の観測地点一覧を確認できます
                </p>
              </div>
              <FaExternalLinkAlt className="text-xs text-slate-400 group-hover:text-blue-500 shrink-0 ml-2" />
            </Link>

            <Link
              href="/feature/meteo"
              className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all flex items-center justify-between group bg-white"
            >
              <div className="space-y-1">
                <span className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                  <FaCompass style={{ color: regionMeta.colorStrong }} />
                  都道府県の代表気象台
                </span>
                <p className="text-xs text-slate-500">
                  代表気象台の雨温図と平年値データをまとめて比較
                </p>
              </div>
              <FaExternalLinkAlt className="text-xs text-slate-400 group-hover:text-blue-500 shrink-0 ml-2" />
            </Link>
          </div>
        </ArticleSection>

        {/* セクション4: 同地域の他の都道府県 */}
        {siblingPrefs.length > 1 && (
          <ArticleSection
            id="siblings"
            title={`4. ${regionMeta.label}地方の他の地域・都道府県`}
            accentColor={regionMeta.colorStrong}
          >
            <div className="flex flex-wrap gap-2">
              {siblingPrefs.map((sib) => {
                const isCurrent = sib.key === prefKey;
                return (
                  <Link
                    key={sib.key}
                    href={`/feature/region/${regionKey}/${sib.key}`}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-slate-800 text-white shadow-sm"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {sib.label}
                  </Link>
                );
              })}
            </div>
          </ArticleSection>
        )}
      </ArticleTemplate>
    </>
  );
};

export default PrefDetailPage;
