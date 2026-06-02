import { NextPage } from "next";
import { FaHome, FaTemperatureHigh } from "react-icons/fa";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import LinkCard from "../components/LinkCard";
import { featureLinks, rankingLinks, searchLinks } from "../utils/navLinks";

interface Props {
  lastUpdated: string;
}

const Home: NextPage<Props> = ({ lastUpdated }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection
          title="トップページ"
          description={
            <>
              ・アメダスの平年値データをまとめているサイトです。
              <br />
              ・マップ、ランキングなどから雨温図、割合データなど詳細な情報を得ることができます。
              <br />
              ・アメダス特集では都道府県の代表地点や特筆すべき地点を詳しく説明しています。
              <br />
              ・年度別ランキングでは1991-2025(最新)の猛暑日日数や降水量のランキングを確認できます。
            </>
          }
          Icon={<FaHome />}
        />
        <div className="max-w-[1280px] mx-auto flex flex-col gap-4 p-4">
          <h2 className="text-xl font-bold">今日の観測状況</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <LinkCard
              href="/live/realtime"
              Icon={<FaTemperatureHigh />}
              title="現在の気温"
              description="気象庁の最新データを確認できます"
              iconClass="text-red-500"
            />
            <LinkCard
              href="/live/dailymax"
              Icon={<FaTemperatureHigh />}
              title="今日の最高気温"
              description="全国の最高気温ランキングを確認できます"
              iconClass="text-orange-500"
            />
          </div>
          <h2 className="text-xl font-bold">検索方法</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {searchLinks.map((link) => (
              <LinkCard key={link.title} {...link} />
            ))}
          </div>
          <h2 className="text-xl font-bold">アメダス特集</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {featureLinks.map((link) => (
              <LinkCard key={link.title} {...link} />
            ))}
          </div>
          <h2 className="text-xl font-bold">年度別ランキング</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {rankingLinks.map((link) => (
              <LinkCard key={link.title} {...link} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
