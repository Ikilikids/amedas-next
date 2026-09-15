import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";
import PageLayout from "../components/PageLayout";
import HeroSection from "../components/HeroSection";
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
            <HeroSection
              badgeIcon={<FaThermometerHalf className="text-sky-300" />}
              badgeText="Japan AMeDAS Database"
              title="アメダス図鑑へようこそ"
              description="日本全国約1,300地点の気象庁アメダス観測データを網羅。各地の「雨温図」や「平年値ランキング」「類似地点の算出」など、地域の豊かな気候特性を直感的に探求できるデータポータルです。"
              watermark="AMeDAS"
            />

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
