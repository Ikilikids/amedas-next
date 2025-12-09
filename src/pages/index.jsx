import { BsCloudRainFill } from "react-icons/bs";
import { FaBuilding, FaMapMarkerAlt } from "react-icons/fa";
import { FaRegSnowflake } from "react-icons/fa6";
import { GiJapan } from "react-icons/gi";
import { IoIosTrophy } from "react-icons/io";
import { PiThermometerColdFill, PiThermometerHotFill } from "react-icons/pi";
import { TbTemperaturePlus } from "react-icons/tb";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LinkCard from "../components/LinkCard";

const searchLinks = [
  {
    href: "/map",
    Icon: FaMapMarkerAlt,
    title: "マップから探す",
    description: "地図を見ながらアメダスを選択できます",
  },
  {
    href: "/ranking/av_avtemp/top/default",
    Icon: IoIosTrophy,
    title: "ランキングから探す",
    description: "雨量や気温のランキングからアメダスを探せます",
  },
  {
    href: "/prefecture",
    Icon: GiJapan,
    title: "都道府県から探す",
    description: "都道府県ごとにアメダスをまとめています",
  },
];

const featureLinks = [
  {
    href: "/feature/hot",
    Icon: PiThermometerHotFill,
    title: "暑い地点まとめ",
    description: "夏季に良くニュースになる地点をまとめました",
    iconClass: "text-red-500",
  },
  {
    href: "/feature/cold",
    Icon: PiThermometerColdFill,
    title: "寒い地点まとめ",
    description: "主に北海道、東北、標高が高い地点をまとめました",
    iconClass: "text-blue-500",
  },
  {
    href: "/feature/warm",
    Icon: TbTemperaturePlus,
    title: "暖かい地点まとめ",
    description: "主に島嶼部、九州など温暖な地点をまとめました",
    iconClass: "text-orange-500",
  },
  {
    href: "/feature/rain",
    Icon: BsCloudRainFill,
    title: "降水量が多い地点まとめ",
    description: "主に山間部、九州、太平洋沿岸の地域です",
    iconClass: "text-blue-800",
  },
  {
    href: "/feature/snow",
    Icon: FaRegSnowflake,
    title: "降雪量が多い地点まとめ",
    description: "主に北陸などの日本海側の地域です",
    iconClass: "text-cyan-300",
  },
  {
    href: "/feature/meteo",
    Icon: FaBuilding,
    title: "気象台まとめ",
    description: "都道府県の代表地点です",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 p-4">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            トップページ
          </h1>
          <div className="text-gray-700 mb-4">
            <div>・アメダスの平年値データをまとめているサイトです。</div>
            <div>
              ・ランキング、雨温図、割合データなど詳細な情報を得ることができます。
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
