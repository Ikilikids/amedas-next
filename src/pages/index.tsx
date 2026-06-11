import { NextPage } from "next";
import { FaHome } from "react-icons/fa";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import LinkCard from "../components/LinkCard";
import { SectionWithDescription } from "../utils/colorUtils";
import { navSections } from "../utils/navLinks";

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
          {navSections.map((section) => (
            <section key={section.id} className="relative">
              <div className="mb-8">
                <SectionWithDescription
                  icon={section.Icon}
                  title={section.title}
                  bgColor={section.bgColor}
                  description={[section.description]}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {section.links.map((link) => (
                  <LinkCard key={link.title} {...link} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
