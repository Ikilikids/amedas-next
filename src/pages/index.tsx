import { NextPage } from "next";
import { FaHome } from "react-icons/fa";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LinkCard from "../components/LinkCard";
import { featureLinks, rankingLinks, searchLinks } from "../utils/navLinks";

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 p-4">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FaHome className="w-8 h-8" />
            トップページ
          </h1>
          <div className="text-gray-700 mb-4">
            <div>・アメダスの平年値データをまとめているサイトです。</div>
            <div>
              ・マップ、ランキングなどから雨温図、割合データなど詳細な情報を得ることができます。
            </div>
            <div>
              ・アメダス特集では都道府県の代表地点や特筆すべき地点を詳しく説明しています。
            </div>
            <div>
              ・年度別ランキングでは1991-2025(最新)の猛暑日日数や降水量のランキングを確認できます。
            </div>
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
