import { NextPage } from "next";
import Layout from "../components/Layout";
import { FaChartLine, FaShieldAlt, FaEnvelope, FaUser, FaExternalLinkAlt } from "react-icons/fa";

const About: NextPage = () => {
  return (
    <Layout
      seo={{
        title: "このサイトについて・お問い合わせ - アメダス図鑑",
        description:
          "アメダス図鑑のサイト趣旨、気候データの独自分析アルゴリズム、データ出典、運営者情報、お問い合わせ窓口についてご紹介します。",
        canonical: "https://amedas-zukan.jp/about",
      }}
      breadcrumbs={[
        { label: "このサイトについて・お問い合わせ" },
      ]}
        heroProps={{
          badgeIcon: <FaUser className="text-sky-300" />,
          badgeText: "About & Contact",
          title: "このサイトについて・お問い合わせ",
          description: "「アメダス図鑑（Japan AMeDAS Database）」は、気象庁が全国に展開する約1,300箇所の地域気象観測システム（アメダス）の膨大な観測データをもとに、日本各地の豊かな気候特性を独自のアルゴリズムと直感的な可視化技術で探求できる気象データ研究・分析メディアです。",
          watermark: "ABOUT",
          gradient: "bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600",
        }}
        sections={[
          {
            id: "purpose",
            label: "1. サイトの目的と設立背景",
            accentColor: "#2563eb",
            children: (
              <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
                <p>
                  日本列島は南北に長く、中央に走る険しい脊梁山脈や周囲の海流の影響を受け、わずか数十キロメートル離れるだけで全く異なる気候が広がっています。冬に数メートルの雪に埋もれる山間部、夏に40℃近い猛暑を記録する内陸盆地、年中温暖で雨の多い南西諸島など、世界でも稀に見る多様な気候のグラデーションが存在します。
                </p>
                <p>
                  しかし、従来の気象情報サービスでは「今日の天気」「週末の降水確率」といった日常の短期予報が中心であり、それぞれの土地が持つ「気候の個性（平年値や歴史的統計）」を深く掘り下げて比較・探索できるプラットフォームは限られていました。
                </p>
                <p>
                  そこで当サイトでは、気象庁が蓄積してきた半世紀近くに及ぶ観測データと最新の気象庁オープンデータを組み合わせ、<strong>「日本各地の気候を1つの図鑑のように楽しく、かつ学術的・定量的に探索できる環境」</strong>を提供することを目指して開設されました。
                </p>
              </div>
            ),
          },
          {
            id: "features",
            label: "2. 当サイト独自の分析手法と付加価値",
            accentColor: "#2563eb",
            children: (
              <div>
                <p className="text-slate-600 leading-relaxed text-sm">
                  当サイトは、気象庁の公表データを単に転載するのではなく、独自のデータパイプラインを用いて以下のような付加価値の高い分析・加工を行っています。
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4">
                  <div className="p-5 bg-slate-50 border border-slate-200/70 rounded-2xl">
                    <h3 className="font-black text-slate-800 text-base mb-2 flex items-center gap-2">
                      <span className="text-blue-600">●</span> 独自雨温図の自動生成
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      全国約1,300の観測所ごとに、平年値（1991〜2020年統計）から月別の気温変化と降水量パターンを統合演算し、各地点特有の季節推移を一目で直感的に把握できる雨温図を自動生成しています。
                    </p>
                  </div>

                  <div className="p-5 bg-slate-50 border border-slate-200/70 rounded-2xl">
                    <h3 className="font-black text-slate-800 text-base mb-2 flex items-center gap-2">
                      <span className="text-blue-600">●</span> 気候類似度スコアリングアルゴリズム
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      年平均気温、年較差、月別降水比率、標高、日照時間などの多次元特徴量をベクトル化し、ユークリッド距離およびコサイン類似度を用いて「日本国内で気候が最も似ている観測所」を独自に算出・提示しています。
                    </p>
                  </div>

                  <div className="p-5 bg-slate-50 border border-slate-200/70 rounded-2xl">
                    <h3 className="font-black text-slate-800 text-base mb-2 flex items-center gap-2">
                      <span className="text-blue-600">●</span> 全国・地域・都道府県別ランキング
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      全国規模の順位にとどまらず、地方別・都道府県別での順位（Top/Bottom）や、島嶼部を除外した分析など、多角的な切り口で気候統計を再整理しています。
                    </p>
                  </div>

                  <div className="p-5 bg-slate-50 border border-slate-200/70 rounded-2xl">
                    <h3 className="font-black text-slate-800 text-base mb-2 flex items-center gap-2">
                      <span className="text-blue-600">●</span> リアルタイム観測と平年値の比較
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      気象庁の最新アメダス速報値と、その地点の過去30年の平年値統計をリアルタイムにクロス参照し、「平年値と比べてどれほど異常・顕著な気象状況か」を瞬時に把握できる構成を採用しています。
                    </p>
                  </div>
                </div>
              </div>
            ),
          },
          {
            id: "disclaimer",
            label: "3. データ出典・利用規約・免責事項",
            accentColor: "#2563eb",
            children: (
              <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
                <div>
                  <h3 className="font-bold text-slate-700 mb-1">【データ出典】</h3>
                  <p>
                    本サイトに掲載している基礎的な気象観測データ、観測所情報、および平年値データは、<a href="https://www.jma.go.jp/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold inline-flex items-center gap-1">気象庁ホームページ <FaExternalLinkAlt className="text-xs" /></a> が公開しているオープンデータを利用・加工しています。
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-700 mb-1">【免責事項】</h3>
                  <p>
                    本サイトに掲載している各種集計値や分析結果については、正確性と最新性の確保に努めておりますが、プログラムによる自動集計や通信状況等により誤りを含む可能性があります。本サイトの情報を利用したことにより生じたあらゆる損害について、運営者は一切の責任を負いかねます。
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    ※台風・豪雨・大雪・地震などの緊急時・防災判断においては、必ず気象庁公式の警報・注意報および自治体の避難情報を参照してください。
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-700 mb-1">【引用・リンクについて】</h3>
                  <p>
                    当サイトは原則リンクフリーです。教育機関・研究活動・個人のブログやSNS等でのデータ引用・ご紹介は、出典元（「アメダス図鑑」および該当ページのURL）を明記していただければ自由にご利用いただけます。
                  </p>
                </div>
              </div>
            ),
          },
          {
            id: "operator",
            label: "4. 運営者情報",
            accentColor: "#2563eb",
            children: (
              <div className="overflow-hidden rounded-xl border border-slate-100">
                <table className="w-full text-left border-collapse text-sm">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <th className="py-3.5 px-4 font-bold text-slate-700 bg-slate-50 w-1/3">サイト名称</th>
                      <td className="py-3.5 px-4 text-slate-600">アメダス図鑑（Japan AMeDAS Database）</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="py-3.5 px-4 font-bold text-slate-700 bg-slate-50">サイトURL</th>
                      <td className="py-3.5 px-4 text-slate-600">
                        <a href="https://amedas-zukan.jp" className="text-blue-600 underline font-semibold">https://amedas-zukan.jp</a>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="py-3.5 px-4 font-bold text-slate-700 bg-slate-50">運営者</th>
                      <td className="py-3.5 px-4 text-slate-600">アメダス図鑑 開発・運営事務局（個人開発プロジェクト）</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="py-3.5 px-4 font-bold text-slate-700 bg-slate-50">運営目的</th>
                      <td className="py-3.5 px-4 text-slate-600">
                        日本全国の地域ごとの多様な気候・気象データの集計、可視化、分析ツールの研究・一般公開
                      </td>
                    </tr>
                    <tr>
                      <th className="py-3.5 px-4 font-bold text-slate-700 bg-slate-50">プライバシーポリシー</th>
                      <td className="py-3.5 px-4 text-slate-600">
                        <a href="#privacy" className="text-blue-600 underline font-semibold">
                          本ページ内の「5. プライバシーポリシー」に記載
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ),
          },
          {
            id: "privacy",
            label: "5. プライバシーポリシー",
            accentColor: "#2563eb",
            children: (
              <div className="space-y-5 text-slate-600 leading-relaxed text-sm">
                <p>
                  アメダス図鑑（以下「当サイト」）は、訪問者の個人情報およびプライバシーを尊重し、以下の方針に基づいて適切な管理と運用を行っています。
                </p>

                <div className="space-y-2">
                  <h3 className="font-bold text-slate-800">【広告の配信について】</h3>
                  <p>
                    当サイトでは、第三者配信の広告サービス（Google AdSense 等）を利用する場合があります。広告配信事業者は、利用者の興味に応じた商品やサービスの広告を表示するため、当サイトや他サイトへのアクセスに関する情報「Cookie」（氏名、住所、メールアドレス、電話番号は含まれません）を使用することがあります。
                  </p>
                  <p className="text-xs text-slate-500">
                    Google による広告での Cookie の取り扱い詳細や、パーソナライズ広告を無効にする設定については、<a href="https://policies.google.com/technologies/ads?hl=ja" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">Google のポリシーと規約ページ</a>をご確認ください。
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-slate-800">【アクセス解析ツールについて】</h3>
                  <p>
                    当サイトでは、サイトの利用状況を把握・改善するために Google によるアクセス解析ツール「Google Analytics」を使用しています。この Google Analytics はデータの収集のために Cookie を使用していますが、データは匿名で収集されており、個人を特定するものではありません。ブラウザの設定で Cookie を無効にすることで収集を拒否することも可能です。
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-slate-800">【個人情報の取り扱いと管理】</h3>
                  <p>
                    当サイトでは、お問い合わせ窓口等を通じて利用者から提供された個人情報（お名前、メールアドレス等）を、お問い合わせへの回答や必要な情報のご連絡のためにのみ適切に利用し、法令に基づく場合を除き第三者に開示・提供することはありません。
                  </p>
                </div>

                <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">
                  制定日: 2025年11月23日 / 最終改定日: 2026年9月14日
                </p>
              </div>
            ),
          },
          {
            id: "contact",
            label: "6. お問い合わせ",
            accentColor: "#2563eb",
            children: (
              <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
                <p>
                  アメダス図鑑に関するご質問、掲載データの間違い・誤植のご指摘、機能改善のご要望、取材やデータ連携のご相談などは、以下の連絡先または窓口よりお気軽にお問い合わせください。
                </p>

                <div className="p-6 bg-blue-50/60 border border-blue-100 rounded-2xl space-y-4">
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-slate-700 w-32 shrink-0">メール窓口:</span>
                    <a
                      href="mailto:contact@amedas-zukan.jp"
                      className="text-blue-600 font-bold hover:underline break-all"
                    >
                      contact@amedas-zukan.jp
                    </a>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    ※通常、数日〜1週間以内に内容を確認の上、必要に応じて折り返しご連絡差し上げます。個人運営のため、すべてのお問い合わせに個別返答をお約束するものではございませんことをあらかじめご了承ください。
                  </p>
                </div>
              </div>
            ),
          },
        ]}
      />
  );
};

export default About;
