import {
  FaBalanceScaleLeft,
  FaBookOpen,
  FaBuilding,
  FaClock,
  FaCompass,
  FaSearch,
  FaStar,
} from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { IoIosTrophy } from "react-icons/io";
import { PiRankingDuotone, PiThermometerHotFill } from "react-icons/pi";
import { TbTemperatureSun } from "react-icons/tb";

export interface NavLink {
  href: string;
  Icon: React.ReactNode;
  title: string;
  description: string;
  topPageTitle?: string;
  topPageDescription?: string;
  iconClass?: string;
}

export interface NavSection {
  id: string;
  title: string;
  description: string;
  Icon: React.ReactNode;
  bgColor: string;
  links: NavLink[];
}

export const realtimeLinks: NavLink[] = [
  {
    href: "/live/realtime",
    Icon: <TbTemperatureSun />,
    title: "現在の気温",
    description: "全国の最新観測データを表示",
    topPageTitle: "現在の気温（全国アメダス速報）",
    topPageDescription:
      "気象庁から毎時配信される最新の観測データをリアルタイム集計。日本全国約1,300地点の現在の気温状況や寒暖の様子を一目でチェックできます。",
    iconClass: "text-orange-500",
  },
  {
    href: "/live/daily_ranking/av_hitemp",
    Icon: <PiRankingDuotone />,
    title: "今日のランキング",
    description: "本日の気温・降水ランキング",
    topPageTitle: "今日の気象ランキング",
    topPageDescription:
      "本日これまでの全国最高気温・最低気温・日降水量・最大瞬間風速のトップ地点をリアルタイムでランキング表示。今どこが最も暑く、あるいは寒いのかを速報します。",
    iconClass: "text-yellow-500",
  },
  {
    href: "/live/recent_ranking/max_hitemp",
    Icon: <IoIosTrophy />,
    title: "今年これまでのランキング",
    description: "最高・最低気温や猛暑日・降水量など",
    topPageTitle: "今年これまでのランキング（年間速報）",
    topPageDescription:
      "今年これまでに記録された全国の最高・最低気温や猛暑日・熱帯夜の日数、積算降水量などを集計。最新の年間記録を一覧で確認できます。",
    iconClass: "text-amber-500",
  },
];

export const searchLinks: NavLink[] = [
  {
    href: "/clim_ranking",
    Icon: <IoIosTrophy />,
    title: "平年値ランキング",
    description: "全国の平年値データをランキング形式で比較できます",
    topPageTitle: "平年値ランキング（統計データ）",
    topPageDescription:
      "1991〜2020年の平年値データをもとに、月別・年間の平均気温・降水量・日照時間を全国ランキング化。各地域の標準的な気候の違いを多角的に比較分析できます。",
    iconClass: "text-yellow-500",
  },
  {
    href: "/compare",
    Icon: <FaBalanceScaleLeft />,
    title: "地点を比較する",
    description: "2つの地点を並べて気候の違いを確認できます",
    topPageTitle: "2地点の気候を徹底比較",
    topPageDescription:
      "全国の任意の2地点を選んで雨温図や月別気象データを横並びで直接比較。出身地と移住先、旅行先などの気候環境の差異をビジュアルに把握できます。",
    iconClass: "text-blue-500",
  },
  {
    href: "/map",
    Icon: <FaMapLocationDot />,
    title: "マップから探す",
    description: "地図を見ながらアメダスを選択できます",
    topPageTitle: "全国マップから探す",
    topPageDescription:
      "日本地図の地理的配置を見ながら直感的にアメダス地点を探索。都道府県や標高、地形に応じた観測所を選択し、瞬時に雨温図や平年値データを呼び出せます。",
    iconClass: "text-green-600",
  },
];

export const featureLinks: NavLink[] = [
  {
    href: "/japan",
    Icon: <FaCompass />,
    title: "地域・都道府県の気候",
    description: "全国10地域と各都道府県の気候特性・風土を徹底解説",
    topPageTitle: "地域・都道府県別の気候ガイド",
    topPageDescription:
      "北海道から沖縄まで全国10地方の気候特性と、各都道府県ごとの気象・風土・アメダス観測所の特徴を3段階の階層構造でわかりやすく解説します。",
    iconClass: "text-teal-600",
  },
  {
    href: "/column",
    Icon: <FaBookOpen />,
    title: "気象コラム・気候解説",
    description: "雨温図で読み解く日本の気候区分や気象メカニズムを解説",
    topPageTitle: "気象コラム・気候解説",
    topPageDescription:
      "雨温図で読み解く日本の6大気候区分や、山脈・季節風がもたらす天気の謎を徹底解説。専門的な気象・地理の知見を分かりやすい図解とともに深掘りします。",
    iconClass: "text-blue-600",
  },
  {
    href: "/column/prefectures-meteo",
    Icon: <FaBuilding />,
    title: "47都道府県まとめ",
    description: "全国47都道府県の代表気象台・気候特性解説",
    topPageTitle: "47都道府県の代表気象台・気候総まとめ",
    topPageDescription:
      "全国47都道府県の県庁所在地・代表気象台を一挙に集約。日本各地の中核都市における気候特性や雨温図・順位データを地域ブロック別の解説記事形式で比較・閲覧できます。",
    iconClass: "text-red-500",
  },
  {
    href: "/column/hot-stations",
    Icon: <PiThermometerHotFill />,
    title: "暑い地点まとめ",
    description: "夏季に良くニュースになる地点をまとめました",
    topPageTitle: "日本一の暑さを誇る地点まとめ",
    topPageDescription:
      "熊谷・多治見・館林・日田など、夏になると最高気温ランキングの上位に頻出する盆地や内陸の猛暑地点を特集。その独特の地形と気温上昇要因を解説します。",
    iconClass: "text-red-700",
  },
];

export const navSections: NavSection[] = [
  {
    id: "realtime",
    title: "リアルタイム更新",
    description: "現在の気温や、今日のランキングを確認できます。",
    Icon: <FaClock />,
    bgColor: "#ef4444",
    links: realtimeLinks,
  },
  {
    id: "search",
    title: "アメダスを探す",
    description: "マップや平年値のランキングから地点を探すことができます。",
    Icon: <FaSearch />,
    bgColor: "#3b82f6",
    links: searchLinks,
  },
  {
    id: "feature",
    title: "アメダス特集",
    description:
      "気象台や特定の気候的特徴を持つ地点をピックアップして紹介しています。",
    Icon: <FaStar />,
    bgColor: "#8b5cf6",
    links: featureLinks,
  },
];
