import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";
import PageLayout from "../components/PageLayout";
import LinkCard from "../components/LinkCard";
import Sidebar from "../components/Sidebar";
import { SectionWithDescription } from "../utils/colorUtils";
import { navSections } from "../utils/navLinks";
import { FaBookOpen, FaCompass, FaThermometerHalf } from "react-icons/fa";

interface Props {
  lastUpdated: string;
}

const Home: NextPage<Props> = ({ lastUpdated }) => {
  return (
    <Layout>
      <Head>
        <title>アメダス図鑑 - 全国約1,300地点のアメダス観測データ・ランキング</title>
        <meta
          name="description"
          content="日本全国約1,300地点のアメダス観測所の詳細データ（雨温図、気温・降水量・日照時間の平年値・月間ランキング・割合データなど）を網羅した図鑑サイトです。"
        />
        <link rel="canonical" href="https://amedas-zukan.jp/" />
      </Head>

      <main className="max-w-[1280px] mx-auto p-4 my-4 w-full">
        <PageLayout sidebar={<Sidebar />}>
          {/* 左メインエリア */}
          <div className="space-y-10">
            {/* ポータルヘッダーカード */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 text-white/10 text-9xl font-black select-none pointer-events-none">
                AMeDAS
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase mb-4">
                  <FaThermometerHalf className="text-sky-300" />
                  <span>Japan AMeDAS Database</span>
                </div>
                <h1 className="text-2xl font-black tracking-tight mb-3">
                  アメダス図鑑へようこそ
                </h1>
                <p className="text-white/90 text-sm max-w-2xl leading-relaxed">
                  日本全国約1,300地点の気象庁アメダス観測データを網羅。各地の「雨温図」や「平年値ランキング」「類似地点の算出」など、地域の豊かな気候特性を直感的に探求できるデータポータルです。
                </p>
              </div>
            </div>

            {/* ナビゲーションセクション一覧 */}
            <div className="space-y-10">
              {navSections.map((section) => (
                <section key={section.id} className="relative">
                  <div className="mb-4">
                    <h2 className="text-xl font-black text-slate-800 pb-3 border-b border-slate-200 flex items-center gap-2.5">
                      <span
                        className="w-1.5 h-6 rounded-full"
                        style={{ backgroundColor: section.bgColor }}
                      />
                      <span className="flex items-center gap-2">
                        <span style={{ color: section.bgColor }}>{section.Icon}</span>
                        <span>{section.title}</span>
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-2">
                      {section.description}
                    </p>
                  </div>
                  <div className="space-y-4">
                    {section.links.map((link) => (
                      <LinkCard
                        key={link.title}
                        {...link}
                        title={link.topPageTitle || link.title}
                        description={link.topPageDescription || link.description}
                        category={section.title}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </PageLayout>
      </main>
    </Layout>
  );
};

export default Home;
