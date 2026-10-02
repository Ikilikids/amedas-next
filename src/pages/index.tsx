import { NextPage } from "next";
import Layout from "../components/Layout";
import LinkCard from "../components/Individual/FirstPage/LinkCard";
import { navSections } from "../utils/navLinks";
import { FaThermometerHalf } from "react-icons/fa";

interface Props {
  lastUpdated: string;
}

const Home: NextPage<Props> = ({ lastUpdated }) => {
  return (
    <Layout
      seo={{
        title: "アメダス図鑑 - 全国約1,300地点のアメダス観測データ・ランキング",
        description:
          "日本全国約1,300地点のアメダス観測所の詳細データ（雨温図、気温・降水量・日照時間の平年値・月間ランキング・割合データなど）を網羅した図鑑サイトです。",
        canonical: "https://amedas-zukan.jp/",
      }}
      heroProps={{
        badgeIcon: <FaThermometerHalf className="text-sky-300" />,
        badgeText: "Japan AMeDAS Database",
        title: "アメダス図鑑へようこそ",
        description: "日本全国約1,300地点の気象庁アメダス観測データを網羅。各地の「雨温図」や「平年値ランキング」「類似地点の算出」など、地域の豊かな気候特性を直感的に探求できるデータポータルです。",
        watermark: "AMeDAS",
      }}
      sections={navSections.map((section) => ({
        id: section.id,
        label: section.title,
        subLabel: section.description,
        accentColor: "#2563eb",
        children: (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {section.links.map((link) => (
              <LinkCard
                key={link.href}
                {...link}
                title={link.topPageTitle || link.title}
                description={link.topPageDescription || link.description}
                category={section.title}
              />
            ))}
          </div>
        ),
      }))}
    />
  );
};

export default Home;
