import { useId } from "react";
import { BadgeRank } from "../types/raw";

/* =====================
 * 色定義
 * ===================== */
const medalColors: Record<
  BadgeRank,
  {
    mainTop?: string;
    mainBottom?: string;
    stroke: string;
    shine: string;
    icon: string;
    isRainbow?: boolean;
  }
> = {
  rainbow: {
    stroke: "#ffffff4d",
    shine: "#ffffffd9",
    icon: "#ffffffe6",
    isRainbow: true,
  },
  gold: {
    mainTop: "#FFDD00",
    mainBottom: "#DDBB00",
    stroke: "#B89600",
    shine: "#ffffff99",
    icon: "#B89600",
  },
  silver: {
    mainTop: "#E5E5E5",
    mainBottom: "#BFC3C7",
    stroke: "#9A9EA3",
    shine: "#ffffffb3",
    icon: "#8C8F94",
  },
  bronze: {
    mainTop: "#E6B17E",
    mainBottom: "#C68642",
    stroke: "#9C5A1A",
    shine: "#ffffff80",
    icon: "#8A4B12",
  },
};

export interface RankBadgeProps {
  rank: BadgeRank;
  icon: React.ReactNode;
  size?: number;
}

export const RankBadge = ({
  rank,
  icon,
  size = 40,
}: RankBadgeProps) => {
  const uid = useId();
  if (!icon) return null;

  const colors = medalColors[rank] || medalColors.bronze;
  const medalGradId = `medal-${uid}`;
  const shineGradId = `shine-${uid}`;
  const rainbowGradId = `rainbow-${uid}`;
  const clipId = `clip-${uid}`;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 120 120">
        <defs>
          <linearGradient id={medalGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.mainTop ?? "#fff"} />
            <stop offset="100%" stopColor={colors.mainBottom ?? "#eee"} />
          </linearGradient>

          <linearGradient id={rainbowGradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff004cee" />
            <stop offset="25%" stopColor="#ffdd00ee" />
            <stop offset="50%" stopColor="#00e0ffee" />
            <stop offset="75%" stopColor="#8b00ffee" />
            <stop offset="100%" stopColor="#ff004cee" />
          </linearGradient>

          <linearGradient id={shineGradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff00" />
            <stop offset="50%" stopColor={colors.shine} />
            <stop offset="100%" stopColor="#ffffff00" />
          </linearGradient>

          <clipPath id={clipId}>
            <circle cx="60" cy="60" r="56" />
          </clipPath>
        </defs>

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

        <g clipPath={`url(#${clipId})`}>
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
        </g>
      </svg>

      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: size * 0.55,
          color: colors.icon,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </span>
    </div>
  );
};

export default RankBadge;
