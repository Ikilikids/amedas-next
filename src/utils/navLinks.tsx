import {
  FaBalanceScaleLeft,
  FaBookOpen,
  FaBuilding,
  FaClock,
  FaDice,
  FaSearch,
  FaStar,
} from "react-icons/fa";
import { FaMapLocationDot, FaSatelliteDish } from "react-icons/fa6";
import { IoIosTrophy } from "react-icons/io";
import { PiRankingDuotone, PiThermometerHotFill } from "react-icons/pi";
import { TbTemperaturePlus, TbTemperatureSun } from "react-icons/tb";

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
    href: "/live/daily_ranking",
    Icon: <PiRankingDuotone />,
    title: "今日のランキング",
    description: "本日の気温・降水ランキング",
    topPageTitle: "今日の気象ランキング",
    topPageDescription:
      "本日これまでの全国最高気温・最低気温・日降水量・最大瞬間風速のトップ地点をリアルタイムでランキング表示。今どこが最も暑く、あるいは寒いのかを速報します。",
    iconClass: "text-yellow-500",
  },
];

export const yearlyRankingLinks: NavLink[] = [
  {
    href: "/live/recent_ranking/heat",
    Icon: <IoIosTrophy />,
    title: "暑さのランキング",
    description: "今年の最高気温や猛暑日など",
    topPageTitle: "暑さのランキング（今年・最近）",
    topPageDescription:
      "今年記録された全国の最高気温ベスト記録や、猛暑日・真夏日の年間日数ランキング。各地の記録的猛暑の推移を一覧で振り返ることができます。",
    iconClass: "text-red-600",
  },
  {
    href: "/live/recent_ranking/cold",
    Icon: <IoIosTrophy />,
    title: "寒さのランキング",
    description: "今年の最低気温や冬日など",
    topPageTitle: "寒さのランキング（今年・最近）",
    topPageDescription:
      "冬期に観測された全国の最低気温ワースト記録や、冬日・真冬日の継続日数などを集計。北日本や高地を中心とする極寒の気候データを追跡できます。",
    iconClass: "text-sky-400",
  },
  {
    href: "/live/recent_ranking/rain",
    Icon: <IoIosTrophy />,
    title: "降水量のランキング",
    description: "最近の降水量や今年の累計など",
    topPageTitle: "降水量のランキング（今年・最近）",
    topPageDescription:
      "24時間・48時間などの大雨集中記録から、年間の積算降水量ランキングまで網羅。多雨地域や台風・豪雨による記録的な雨量を詳しく検証できます。",
    iconClass: "text-indigo-800",
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
  {
    href: "/gacha",
    Icon: <FaDice />,
    title: "アメダス・ガチャ",
    description: "全国のアメダス地点を引いてコレクション！",
    topPageTitle: "アメダス・ガチャ（ランダム発見）",
    topPageDescription:
      "全国約1,300地点の中からランダムにアメダス観測所を引いてコレクション！未知の離島や山岳観測所など、知られざる日本の地域気候との出会いを楽しめます。",
    iconClass: "text-purple-600",
  },
];

export const featureLinks: NavLink[] = [
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
    href: "/feature/meteo",
    Icon: <FaBuilding />,
    title: "47都道府県まとめ",
    description: "都道府県の代表地点です",
    topPageTitle: "47都道府県の代表気象台まとめ",
    topPageDescription:
      "全国47都道府県の県庁所在地・主要地方気象台を一挙に集約。日本各地の中核都市における気候特性や雨温図データを一覧で比較・閲覧できます。",
    iconClass: "text-red-500",
  },
  {
    href: "/feature/special",
    Icon: <FaSatelliteDish />,
    title: "特別観測所まとめ",
    description: "地域の代表地点です",
    topPageTitle: "特別地域気象観測所まとめ",
    topPageDescription:
      "旧測候所などの歴史を持ち、高精度・多種多様な観測機器が維持されている地域の基幹観測所を特集。各エリアの気候の要となる重要地点を紹介します。",
    iconClass: "text-yellow-500",
  },
  {
    href: "/feature/hot",
    Icon: <PiThermometerHotFill />,
    title: "暑い地点まとめ",
    description: "夏季に良くニュースになる地点をまとめました",
    topPageTitle: "日本一の暑さを誇る地点まとめ",
    topPageDescription:
      "熊谷・多治見・館林・日田など、夏になると最高気温ランキングの上位に頻出する盆地や内陸の猛暑地点を特集。その独特の地形と気温上昇要因を解説します。",
    iconClass: "text-red-700",
  },
  {
    href: "/feature/warm",
    Icon: <TbTemperaturePlus />,
    title: "暖かい地点まとめ",
    description: "主に島などの暖かい地点をまとめました",
    topPageTitle: "南国・温暖な海洋性気候地点まとめ",
    topPageDescription:
      "沖縄・奄美や小笠原諸島、黒潮の流れる温暖な沿岸部のアメダスをピックアップ。冬でも氷点下にならない常夏の気候特性や豊かな雨量を紐解きます。",
    iconClass: "text-orange-500",
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
    id: "yearly",
    title: "今年のランキング",
    description:
      "今年これまでの最高気温、最低気温、降水量などのランキングです。",
    Icon: <IoIosTrophy />,
    bgColor: "#f59e0b",
    links: yearlyRankingLinks,
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
