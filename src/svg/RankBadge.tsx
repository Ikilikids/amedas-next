import React, { useId } from "react";
import { AiFillSun } from "react-icons/ai";
import { BiWind } from "react-icons/bi";
import { BsFillCloudRainHeavyFill } from "react-icons/bs";
import { LiaSnowflake } from "react-icons/lia";
import { PiThermometerColdFill, PiThermometerHotFill } from "react-icons/pi";
import { TbTemperaturePlus } from "react-icons/tb";

/* =====================
 * 型
 * ===================== */
export type Rank = 1 | 2 | 3 | 4;

export type BadgeType =
  | "toptemp"
  | "bottemp"
  | "hitemp"
  | "rain"
  | "sun"
  | "snowing"
  | "wind";

type Props = {
  size?: number;
  rank: Rank;
  type: BadgeType;
};

/* =====================
 * ラベル（title用）
 * ===================== */
const badgeTypeLabel: Record<BadgeType, string> = {
  toptemp: "平均気温(高)",
  bottemp: "平均気温(低)",
  hitemp: "猛暑日日数",
  rain: "降水量",
  sun: "日照時間",
  snowing: "降雪量",
  wind: "平均風速",
};

const rankLabel: Record<Rank, string> = {
  1: "top10",
  2: "上位5%",
  3: "上位10%",
  4: "上位20%",
};

/* =====================
 * 色定義
 * rank1 = 🌈
 * rank2 = 🥇
 * rank3 = 🥈
 * rank4 = 🥉
 * ===================== */
const medalColors: Record<
  Rank,
  {
    mainTop?: string;
    mainBottom?: string;
    stroke: string;
    shine: string;
    icon: string;
    isRainbow?: boolean;
  }
> = {
  1: {
    stroke: "#dddddd",
    shine: "rgba(255,255,255,0.85)",
    icon: "rgba(255,255,255,0.9)",
    isRainbow: true,
  },
  2: {
    mainTop: "#FFDD00",
    mainBottom: "#DDBB00",
    stroke: "#B89600",
    shine: "rgba(255,255,255,0.6)",
    icon: "#B89600",
  },
  3: {
    mainTop: "#E5E5E5",
    mainBottom: "#BFC3C7",
    stroke: "#9A9EA3",
    shine: "rgba(255,255,255,0.7)",
    icon: "#8C8F94",
  },
  4: {
    mainTop: "#E6B17E",
    mainBottom: "#C68642",
    stroke: "#9C5A1A",
    shine: "rgba(255,255,255,0.5)",
    icon: "#8A4B12",
  },
};

/* =====================
 * アイコン
 * ===================== */
const badgeIcons: Record<BadgeType, React.ComponentType<any>> = {
  toptemp: TbTemperaturePlus,
  bottemp: PiThermometerColdFill,
  hitemp: PiThermometerHotFill,
  rain: BsFillCloudRainHeavyFill,
  sun: AiFillSun,
  snowing: LiaSnowflake,
  wind: BiWind,
};

/* =====================
 * コンポーネント
 * ===================== */
const RankBadge: React.FC<Props> = ({ size = 36, rank, type }) => {
  const colors = medalColors[rank];
  const Icon = badgeIcons[type];

  const uid = useId();
  const medalGradId = `medal-${uid}`;
  const shineGradId = `shine-${uid}`;
  const rainbowGradId = `rainbow-${uid}`;

  const titleText = `${badgeTypeLabel[type]}：${rankLabel[rank]}`;

  return (
    <div
      title={titleText}
      style={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 120 120">
        <defs>
          {/* 通常グラデ */}
          <linearGradient id={medalGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.mainTop ?? "#fff"} />
            <stop offset="100%" stopColor={colors.mainBottom ?? "#eee"} />
          </linearGradient>

          {/* 🌈 虹 */}
          <linearGradient id={rainbowGradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff004c" />
            <stop offset="25%" stopColor="#ffdd00" />
            <stop offset="50%" stopColor="#00e0ff" />
            <stop offset="75%" stopColor="#8b00ff" />
            <stop offset="100%" stopColor="#ff004c" />
          </linearGradient>

          {/* キラ */}
          <linearGradient id={shineGradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor={colors.shine} />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* 外円 */}
        <circle
          cx="60"
          cy="60"
          r="56"
          fill={
            colors.isRainbow ? `url(#${rainbowGradId})` : `url(#${medalGradId})`
          }
          stroke={colors.stroke}
          strokeWidth="4"
        />

        {/* キラ */}
        <rect
          x="-140"
          y="0"
          width="140"
          height="120"
          fill={`url(#${shineGradId})`}
          transform="rotate(20 60 60)"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            from="-250 0"
            to="250 0"
            dur={colors.isRainbow ? "2.5s" : "5s"}
            repeatCount="indefinite"
          />
        </rect>
      </svg>

      {/* 中央アイコン */}
      <Icon
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: size * 0.55,
          color: colors.icon,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default RankBadge;
