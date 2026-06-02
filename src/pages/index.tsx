import { NextPage } from "next";
import { FaHistory, FaHome, FaSearch, FaStar } from "react-icons/fa";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import LinkCard from "../components/LinkCard";
import { SectionWithDescription } from "../utils/colorUtils";
import { featureLinks, rankingLinks, searchLinks } from "../utils/navLinks";

interface Props {
  lastUpdated: string;
}

const Home: NextPage<Props> = ({ lastUpdated }) => {
  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-sans">
      <Header />
      <main className="flex-1 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] z-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <HeroSection
          title="アメダス図鑑"
          description={
            <>
              ・アメダスの平年値データをまとめているサイトです。
              <br />
              ・マップ、ランキングなどから雨温図、割合データなど詳細な情報を得ることができます。
            </>
          }
          Icon={<FaHome />}
          gradient="bg-gradient-to-br from-blue-700 via-indigo-800 to-blue-900"
        />

        <div className="max-w-[1280px] mx-auto flex flex-col gap-16 p-8 relative z-10">
          <section className="relative">
            <div className="mb-8">
              <SectionWithDescription
                icon={<FaSearch />}
                title="観測データを検索"
                bgColor="#3b82f6"
                description={[
                  "リアルタイムの観測データや、平年値のランキングから地点を探すことができます。",
                ]}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {searchLinks.map((link) => (
                <LinkCard key={link.title} {...link} />
              ))}
            </div>
          </section>

          <section className="relative">
            <div className="mb-8">
              <SectionWithDescription
                icon={<FaStar />}
                title="アメダス特集"
                bgColor="#ef4444"
                description={[
                  "気象台や特定の気候的特徴を持つ地点をピックアップして紹介しています。",
                ]}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featureLinks.map((link) => (
                <LinkCard key={link.title} {...link} />
              ))}
            </div>
          </section>

          <section className="relative pb-12">
            <div className="mb-8">
              <SectionWithDescription
                icon={<FaHistory />}
                title="年度別ランキング"
                bgColor="#f59e0b"
                description={[
                  "1991年から現在までの、年ごとの極値や日数のランキングを確認できます。",
                ]}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rankingLinks.map((link) => (
                <LinkCard key={link.title} {...link} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
