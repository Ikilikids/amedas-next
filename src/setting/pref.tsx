import React from "react";
import { RegionKey, RegionMeta, RegionValue } from "./region";
import {
  FaSnowflake,
  FaCanadianMapleLeaf,
  FaCar,
  FaShip,
  FaToriiGate,
  FaChurch,
  FaHotTubPerson,
  FaTowerBroadcast,
  FaAnchor,
  FaAppleWhole,
  FaIgloo,
  FaCow,
  FaShrimp,
  FaSailboat,
  FaGun,
  FaVolcano,
  FaUmbrellaBeach,
  FaMoon,
} from "react-icons/fa6";
import { FaMountain, FaSkiing } from "react-icons/fa";
import { LuApple, LuCherry, LuGrape } from "react-icons/lu";
import { TbBrandDisney, TbCherryFilled, TbFlowerFilled } from "react-icons/tb";
import {
  GiTeapot,
  GiOni,
  GiCenturionHelmet,
  GiCow,
  GiCharm,
  GiStrawberry,
  GiSewingString,
  GiFamilyHouse,
  GiCastle,
  GiWheat,
  GiCrab,
  GiDinosaurRex,
  GiGrapes,
  GiWoodCabin,
  GiLeafSwirl,
  GiShrimp,
  GiWaves,
  GiHandheldFan,
  GiOctopus,
  GiDeer,
  GiFlowerEmblem,
  GiPear,
  GiPeach,
  GiBridge,
  GiSpiralBloom,
  GiNoodles,
  GiTangerine,
  GiDoubleFish,
  GiFastNoodles,
  GiAirBalloon,
  GiVolcano,
  GiSunCloud,
  GiPotato,
  GiPalmTree,
  GiBamboo,
  GiRose,
  GiRadioTower,
  GiFuji,
  GiDam,
  GiSadCrab,
  GiBlackBridge,
  GiAsianLantern,
  GiLeek,
  GiCrescentBlade,
  GiNinjaStar,
} from "react-icons/gi";
import { MdChurch, MdOutlineLocalAirport } from "react-icons/md";
import { SiFoodpanda, SiOctopusdeploy } from "react-icons/si";
import { RiTimeZoneFill } from "react-icons/ri";
import { PiCookingPotFill, PiOrangeFill, PiSpiralBold } from "react-icons/pi";
import { BiSolidCastle } from "react-icons/bi";
import { IoRocket } from "react-icons/io5";

// ==============================
// 型
// ==============================
export type PrefValue =
  | "hokkaido_douou"
  | "hokkaido_dounan"
  | "hokkaido_doutou"
  | "hokkaido_douhoku"
  | "aomori"
  | "akita"
  | "iwate"
  | "miyagi"
  | "yamagata"
  | "fukushima"
  | "ibaraki"
  | "tochigi"
  | "gunma"
  | "saitama"
  | "tokyo"
  | "chiba"
  | "kanagawa"
  | "nagano"
  | "yamanashi"
  | "shizuoka"
  | "aichi"
  | "gifu"
  | "mie"
  | "niigata"
  | "toyama"
  | "ishikawa"
  | "fukui"
  | "shiga"
  | "kyoto"
  | "osaka"
  | "hyogo"
  | "nara"
  | "wakayama"
  | "okayama"
  | "hiroshima"
  | "shimane"
  | "tottori"
  | "yamaguchi"
  | "tokushima"
  | "kagawa"
  | "ehime"
  | "kochi"
  | "fukuoka"
  | "oita"
  | "nagasaki"
  | "saga"
  | "kumamoto"
  | "miyazaki"
  | "kagoshima"
  | "okinawa_main"
  | "okinawa_daito"
  | "okinawa_miyako"
  | "okinawa_yaeyama";



export type PrefMeta = {
  key: PrefValue;
  code: string;
  label: string;
  region: RegionMeta;
  icon?: React.ReactNode;
};

type PrefMap = Record<PrefValue, PrefMeta>;

export const PrefKey: PrefMap = {
  // ===== 北海道（4区分に集約） =====
  hokkaido_douou: {
    key: "hokkaido_douou",
    code: "14",
    label: "道央",
    region: RegionKey.hokkaido,
    icon: <FaSnowflake />,
  },
  hokkaido_dounan: {
    key: "hokkaido_dounan",
    code: "23",
    label: "道南",
    region: RegionKey.hokkaido,
    icon: <FaSnowflake />,
  },
  hokkaido_doutou: {
    key: "hokkaido_doutou",
    code: "17",
    label: "道東",
    region: RegionKey.hokkaido,
    icon: <FaSnowflake />,
  },
  hokkaido_douhoku: {
    key: "hokkaido_douhoku",
    code: "11",
    label: "道北",
    region: RegionKey.hokkaido,
    icon: <FaSnowflake />,
  },

  // ===== 東北 =====
  aomori: { key: "aomori", code: "31", label: "青森県", region: RegionKey.tohoku, icon: <FaAppleWhole /> },
  akita: { key: "akita", code: "32", label: "秋田県", region: RegionKey.tohoku, icon: <FaIgloo /> },
  iwate: { key: "iwate", code: "33", label: "岩手県", region: RegionKey.tohoku, icon: <GiTeapot /> },
  miyagi: { key: "miyagi", code: "34", label: "宮城県", region: RegionKey.tohoku, icon: <FaMoon /> },
  yamagata: { key: "yamagata", code: "35", label: "山形県", region: RegionKey.tohoku, icon: <TbCherryFilled /> },
  fukushima: { key: "fukushima", code: "36", label: "福島県", region: RegionKey.tohoku, icon: <FaCow /> },

  // ===== 関東 =====
  ibaraki: { key: "ibaraki", code: "40", label: "茨城県", region: RegionKey.kanto, icon: <IoRocket /> },
  tochigi: { key: "tochigi", code: "41", label: "栃木県", region: RegionKey.kanto, icon: <GiStrawberry /> },
  gunma: { key: "gunma", code: "42", label: "群馬県", region: RegionKey.kanto, icon: <GiSewingString /> },
  saitama: { key: "saitama", code: "43", label: "埼玉県", region: RegionKey.kanto, icon: <GiLeek /> },
  tokyo: { key: "tokyo", code: "44", label: "東京都", region: RegionKey.kanto, icon: <GiRadioTower /> },
  chiba: { key: "chiba", code: "45", label: "千葉県", region: RegionKey.kanto, icon: <MdOutlineLocalAirport /> },
  kanagawa: { key: "kanagawa", code: "46", label: "神奈川県", region: RegionKey.kanto, icon: <FaAnchor /> },

  // ===== 中部 =====
  nagano: { key: "nagano", code: "48", label: "長野県", region: RegionKey.chubu, icon: <FaSkiing /> },
  yamanashi: { key: "yamanashi", code: "49", label: "山梨県", region: RegionKey.chubu, icon: <LuGrape /> },
  shizuoka: { key: "shizuoka", code: "50", label: "静岡県", region: RegionKey.chubu, icon: <GiFuji /> },
  aichi: { key: "aichi", code: "51", label: "愛知県", region: RegionKey.chubu, icon: <FaCar /> },
  gifu: { key: "gifu", code: "52", label: "岐阜県", region: RegionKey.chubu, icon: <GiWoodCabin /> },
  mie: { key: "mie", code: "53", label: "三重県", region: RegionKey.chubu, icon: <GiNinjaStar /> },

  // ===== 北陸 =====
  niigata: { key: "niigata", code: "54", label: "新潟県", region: RegionKey.hokuriku, icon: <GiWheat /> },
  toyama: { key: "toyama", code: "55", label: "富山県", region: RegionKey.hokuriku, icon: <GiDam /> },
  ishikawa: { key: "ishikawa", code: "56", label: "石川県", region: RegionKey.hokuriku, icon: <GiSadCrab /> },
  fukui: { key: "fukui", code: "57", label: "福井県", region: RegionKey.hokuriku, icon: <GiDinosaurRex /> },

  // ===== 近畿 =====
  shiga: { key: "shiga", code: "60", label: "滋賀県", region: RegionKey.kinki, icon: <FaSailboat /> },
  kyoto: { key: "kyoto", code: "61", label: "京都府", region: RegionKey.kinki, icon: <GiHandheldFan /> },
  osaka: { key: "osaka", code: "62", label: "大阪府", region: RegionKey.kinki, icon: <SiOctopusdeploy /> },
  hyogo: { key: "hyogo", code: "63", label: "兵庫県", region: RegionKey.kinki, icon: <RiTimeZoneFill /> },
  nara: { key: "nara", code: "64", label: "奈良県", region: RegionKey.kinki, icon: <GiDeer /> },
  wakayama: { key: "wakayama", code: "65", label: "和歌山県", region: RegionKey.kinki, icon: <SiFoodpanda /> },

  // ===== 中国 =====
  okayama: { key: "okayama", code: "66", label: "岡山県", region: RegionKey.chugoku, icon: <GiPeach /> },
  hiroshima: { key: "hiroshima", code: "67", label: "広島県", region: RegionKey.chugoku, icon: <FaCanadianMapleLeaf /> },
  shimane: { key: "shimane", code: "68", label: "島根県", region: RegionKey.chugoku, icon: <FaToriiGate /> },
  tottori: { key: "tottori", code: "69", label: "鳥取県", region: RegionKey.chugoku, icon: <GiPear /> },
  yamaguchi: { key: "yamaguchi", code: "81", label: "山口県", region: RegionKey.chugoku, icon: <GiBlackBridge /> },

  // ===== 四国 =====
  tokushima: { key: "tokushima", code: "71", label: "徳島県", region: RegionKey.shikoku, icon: <PiSpiralBold /> },
  kagawa: { key: "kagawa", code: "72", label: "香川県", region: RegionKey.shikoku, icon: <GiNoodles /> },
  ehime: { key: "ehime", code: "73", label: "愛媛県", region: RegionKey.shikoku, icon: <PiOrangeFill /> },
  kochi: { key: "kochi", code: "74", label: "高知県", region: RegionKey.shikoku, icon: <GiDoubleFish /> },

  // ===== 九州 =====
  fukuoka: { key: "fukuoka", code: "82", label: "福岡県", region: RegionKey.kyushu, icon: <PiCookingPotFill /> },
  oita: { key: "oita", code: "83", label: "大分県", region: RegionKey.kyushu, icon: <FaHotTubPerson /> },
  nagasaki: { key: "nagasaki", code: "84", label: "長崎県", region: RegionKey.kyushu, icon: <MdChurch /> },
  saga: { key: "saga", code: "85", label: "佐賀県", region: RegionKey.kyushu, icon: <GiAirBalloon /> },
  kumamoto: { key: "kumamoto", code: "86", label: "熊本県", region: RegionKey.kyushu, icon: <BiSolidCastle /> },
  miyazaki: { key: "miyazaki", code: "87", label: "宮崎県", region: RegionKey.kyushu, icon: <GiPalmTree /> },
  kagoshima: { key: "kagoshima", code: "88", label: "鹿児島県", region: RegionKey.kyushu, icon: <FaVolcano /> },

  // ===== 沖縄 =====
  okinawa_main: {
    key: "okinawa_main",
    code: "91",
    label: "沖縄地方",
    region: RegionKey.okinawa,
    icon: <FaUmbrellaBeach />,
  },
  okinawa_daito: {
    key: "okinawa_daito",
    code: "92",
    label: "大東地方",
    region: RegionKey.okinawa,
    icon: <FaUmbrellaBeach />,
  },
  okinawa_miyako: {
    key: "okinawa_miyako",
    code: "93",
    label: "宮古地方",
    region: RegionKey.okinawa,
    icon: <FaUmbrellaBeach />,
  },
  okinawa_yaeyama: {
    key: "okinawa_yaeyama",
    code: "94",
    label: "八重山地方",
    region: RegionKey.okinawa,
    icon: <FaUmbrellaBeach />,
  },
};

// ==============================
// utils
// ==============================
export const PREF_LIST = Object.keys(PrefKey) as PrefValue[];

export function getPrefsInRegion(regionKey: RegionValue): PrefMeta[] {
  return Object.values(PrefKey).filter(
    (pref) => pref.region === RegionKey[regionKey]
  );
}

