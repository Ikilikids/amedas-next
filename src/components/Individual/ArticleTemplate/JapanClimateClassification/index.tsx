import React, { useMemo } from "react";
import ArticleTemplate, { ArticleSectionItem } from "..";
import { FaBookOpen, FaChartBar } from "react-icons/fa";
import { JapanClimateArticleData } from "./ssg_function";
import { DivisionsSection } from "./widgets/DivisionsSection/UI";
import { ArticleUonzuItem } from "../../../../utils/ssgLoader";

export interface JapanClimateArticlePageTemplateProps {
  data: JapanClimateArticleData;
}

export const JapanClimateArticlePageTemplate: React.FC<
  JapanClimateArticlePageTemplateProps
> = ({ data }) => {
  const { uonzuItems } = data;

  const uonzuMap = useMemo(() => {
    return new Map<string, ArticleUonzuItem>(
      uonzuItems.map((item) => [item.id, item])
    );
  }, [uonzuItems]);

  const sections: ArticleSectionItem[] = [
    {
      id: "section1",
      title: "1. なぜ日本は南北・東西で気候が激変するのか？",
      accentColor: "#2563eb",
      content: (
        <div className="space-y-3">
          <p>
            「東京が冬晴れの青空でカラカラに乾燥しているとき、新幹線でトンネルを抜けた新潟では視界を遮る猛吹雪が吹き荒れている」——。
          </p>
          <p>
            川端康成の小説『雪国』の冒頭「国境の長いトンネルを抜けると雪国であった」は、日本の気候の劇的な変化を見事に表現した一節です。
          </p>
          <p>
            日本列島は、南北に約3,000kmにわたって細長く延びており、亜寒帯（北海道）から温帯（本州・四国・九州）、さらには亜熱帯（南西諸島）まで、多種多様な気候帯にまたがっています。さらに東西わずか数百kmの幅の中に、標高2,000〜3,000m級の険しい脊梁山脈（日本アルプスなど）が背骨のように貫いています。
          </p>
          <p>
            この「緯度の広がり」と「険しい山脈」が組み合わさることで、世界的に見ても極めてユニークな、地域ごとの個性あふれる気候が形成されています。
          </p>
        </div>
      ),
    },
    {
      id: "section2",
      title: "2. 気候を読み解くツール「雨温図」とは",
      accentColor: "#2563eb",
      content: (
        <div className="space-y-3">
          <p>
            ある地域の気候的個性をひと目で理解するために世界中で用いられているのが、<strong>「雨温図」</strong>です。
          </p>
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl my-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <FaChartBar className="text-blue-600" />
              <span>雨温図の基本ルール</span>
            </div>
            <ul className="text-xs text-slate-600 list-disc list-inside space-y-1">
              <li><strong>折れ線グラフ（赤色）:</strong> 月平均気温の推移（1月〜12月）</li>
              <li><strong>棒グラフ（青色）:</strong> 月降水量の合計値（1月〜12月）</li>
            </ul>
          </div>
          <p>
            雨温図を見るだけで、「夏と冬の寒暖差（気温の山が高くとがっているか、緩やかか）」や「雨が降る季節（夏に集中しているか、冬に多いか、年中均等か）」が瞬時に分かります。
          </p>
          <p>
            アメダス図鑑では、気象庁が公表する1991〜2020年の平年値統計をもとに、全国約1,300地点すべての雨温図を自動生成して掲載しています。
          </p>
        </div>
      ),
    },
    {
      id: "section3",
      title: "3. 日本の6大気候区分の特徴と雨温図パターン",
      accentColor: "#2563eb",
      content: <DivisionsSection uonzuMap={uonzuMap} />,
    },
    {
      id: "section4",
      title: "4. 気候の違いを生み出す2大メカニズム",
      accentColor: "#2563eb",
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-black text-slate-800 text-base mb-1">
              【メカニズム1: 季節風（モンスーン）の反転】
            </h3>
            <p className="text-sm">
              ユーラシア大陸と太平洋に挟まれた日本は、季節によって風向きが180度入れ替わります。冬は大陸高気圧からの「北西モンスーン」、夏は太平洋高気圧からの「南東モンスーン」が吹き付けます。
            </p>
          </div>

          <div>
            <h3 className="font-black text-slate-800 text-base mb-1">
              【メカニズム2: 脊梁山脈による水蒸気トラップとフェーン現象】
            </h3>
            <p className="text-sm">
              湿った風が山脈に衝突すると、強制的に上昇させられて冷却され、雨や雪を降らせます（風上側）。水分を失った空気は山を越えて吹き降りる際、乾燥断熱減率（約1℃/100m）で急激に気温を上昇させながら乾燥した風（からっ風やフェーン現象）となって風下側の平野に届きます。
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "section5",
      title: "5. アメダス図鑑で雨温図を楽しむポイント",
      accentColor: "#2563eb",
      content: (
        <div className="space-y-3">
          <p>
            アメダス図鑑では、地点詳細ページを開くだけで、その観測所の雨温図が即座にカラー表示されます。
          </p>
          <ul className="space-y-2 list-disc list-inside text-sm">
            <li><strong>「類似地点」をチェック:</strong> 自分の住む街と、遠く離れた別の街の雨温図がそっくりな形をしている驚きを発見できます。</li>
            <li><strong>「標高」との関係:</strong> 同じ都道府県内でも、標高が500m上がるだけで雨温図の折れ線が全体的に下へシフトする様子が手に取るように分かります。</li>
          </ul>
          <p className="mt-4">
            ぜひ、身近な地点や旅先、気になる観測所の雨温図を探検してみてください！
          </p>
        </div>
      ),
    },
  ];

  return (
    <ArticleTemplate
      seo={{
        title: "雨温図で読み解く日本の6大気候区分〜なぜ日本は地域によってこんなに天気が違うのか？〜 - アメダス図鑑",
        description:
          "太平洋側、日本海側、瀬戸内、中央高地、南西諸島、オホーツク海側の6大気候区分をアメダスの雨温図（平年値データ）とともに徹底解説。季節風と山脈がもたらす気候の違いの謎に迫ります。",
        canonical: "https://amedas-zukan.jp/column/japan-climate-classification",
      }}
      breadcrumbs={[
        { label: "気象コラム", href: "/column" },
        { label: "雨温図で読み解く日本の6大気候区分" },
      ]}
      hero={{
        badgeIcon: <FaBookOpen className="text-sky-300" />,
        badgeText: "Weather Column & Insights",
        title: "気象コラム・解説",
        description:
          "雨温図の見方から日本の気候区分の秘密、気象データの面白い読み解き方まで。アメダス観測データをより深く楽しむための解説記事一覧です。",
        watermark: "COLUMN",
        gradient: "bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600",
      }}
      category="気候学・気象解説"
      publishedAt="2026年9月14日"
      readTime="約6分"
      title="雨温図で読み解く日本の6大気候区分〜なぜ日本は地域によってこんなに天気が違うのか？〜"
      points="日本列島は南北に長く、中央に険しい山脈が連なるため、わずか数十km離れるだけで別世界のような気候が広がります。本記事では雨温図の見方と6大気候区分のメカニズムを解説します。"
      sections={sections}
      backHref="/column"
      backLabel="コラム一覧に戻る"
    />
  );
};

export default JapanClimateArticlePageTemplate;
