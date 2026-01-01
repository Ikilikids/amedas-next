import fs from "fs";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import path from "path";
import { PiThermometerHotFill } from "react-icons/pi";

import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import RankingYear from "../../../components/Ranking_year";

import { JSX } from "react";
import { detectUnitFromPath, metrics } from "../../../utils/colorUtils";

import { TbTemperature, TbTemperaturePlus } from "react-icons/tb";

import type { IconType } from "react-icons";

// ==============================
// Types
// ==============================

interface RankingIconDef {
  Icon: IconType;
  iconClass: string;
}

interface RankingJsonStation {
  rank: number;
  value: number | string;
  station_name: string;
  pref: string;
  city: string;
}

interface RankingStation {
  number: string;
  station_name: string;
  pref: string;
  city: string;
  rank: number;
  value: string | null;
}

interface Ranking {
  title: string;
  stations: RankingStation[];
}

interface PageProps {
  rankingList: Ranking[];
  year: string;
  years: string[];
  type: string;
}

// ==============================
// 表示ラベル定義
// ==============================

// ==============================
// getStaticPaths
// ==============================
export const getStaticPaths: GetStaticPaths = async () => {
  const dataRoot = path.join(process.cwd(), "data");

  const paths: { params: { type: string; year: string } }[] = [];

  for (const type of fs.readdirSync(dataRoot)) {
    const typeDir = path.join(dataRoot, type);
    if (!fs.statSync(typeDir).isDirectory()) continue;

    const years = fs
      .readdirSync(typeDir)
      .filter((f) => /^\d{4}\.json$/.test(f))
      .map((f) => f.replace(".json", ""));

    for (const year of years) {
      paths.push({
        params: { type, year },
      });
    }
  }

  return {
    paths,
    fallback: false,
  };
};

// ==============================
// getStaticProps
// ==============================
export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  const type = context.params?.type as string;
  const year = context.params?.year as string;

  const rankingPath = path.join(process.cwd(), "data", type, `${year}.json`);

  let rankingList: Ranking[] = [];

  if (fs.existsSync(rankingPath)) {
    const json = JSON.parse(fs.readFileSync(rankingPath, "utf-8")) as Record<
      string,
      RankingJsonStation
    >;

    const unit = detectUnitFromPath(rankingPath);

    const stations: RankingStation[] = Object.keys(json)
      .map((number) => {
        const s = json[number];
        const val = Number(s.value);
        return {
          number,
          station_name: s.station_name,
          pref: s.pref,
          city: s.city,
          rank: s.rank,
          value: isNaN(val) ? null : `${val.toFixed(0)}${unit}`,
        };
      })
      .filter((s) => s.rank <= 100)
      .sort((a, b) => a.rank - b.rank);

    const metric = metrics.find((m) => m.key === type);
    const label = metric?.label ?? type;

    rankingList = [
      {
        title: `${year}年の${label}ランキング`,
        stations,
      },
    ];
  }

  // 年一覧（type 別）
  const yearsDir = path.join(process.cwd(), "data", type);
  const years = fs
    .readdirSync(yearsDir)
    .filter((f) => /^\d{4}\.json$/.test(f))
    .map((f) => f.replace(".json", ""))
    .sort((a, b) => Number(b) - Number(a));

  return {
    props: {
      rankingList: JSON.parse(JSON.stringify(rankingList)),
      year,
      years,
      type,
    },
  };
};

// ==============================
// Page
// ==============================
const RankingYearPage: NextPage<PageProps> = ({
  rankingList,
  year,
  years,
  type,
}) => {
  const metric = metrics.find((m) => m.key === type);
  const label = metric?.label ?? type;
  const description = metricDescriptions[type];
  const iconDef = rankingIconMap[type];
  const Icon = iconDef.Icon;
  return (
    <>
      <Head>
        <title>{`${year}年の${label}ランキング - アメダス図鑑`}</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="flex-1 p-4">
          <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-4">
            <div className="w-full flex-col gap-4">
              <h1 className="text-3xl font-bold flex gap-2 items-center">
                <iconDef.Icon className={`w-8 h-8 ${iconDef.iconClass}`} />
                {year}年の{label}ランキング
              </h1>

              <div className="text-gray-700 mb-4 mt-2 leading-relaxed space-y-1">
                {description}
              </div>

              <RankingYear
                rankingList={rankingList}
                year={year}
                years={years}
                type={type}
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default RankingYearPage;
const metricDescriptions: Record<string, JSX.Element> = {
  hitemp_35: (
    <>
      <div>
        ・年度ごとの猛暑日日数をもとに、全国の観測地点をランキング化しています。
      </div>
      <div>
        ・地球温暖化の影響により、猛暑日日数は年々増加傾向にあります。特に
        2024年・2025年は、過去に例を見ない水準となりました。
      </div>
      <div>・年間最多記録は、日田(2025年)および大宰府(2024年)の62日です。</div>
      <div>
        ・これまでに年間1位となった回数は、日田(11回)、館林(8回)、
        熊谷(5回)、多治見(4回)、熊本(2回)となっています。
      </div>
    </>
  ),
  hitemp_30: (
    <>
      <div>
        ・年度ごとの真夏日日数をもとに、全国の観測地点をランキング化しています。
      </div>
      <div>
        ・基本的に島嶼部が上位ですが、本州・四国・九州の地点がtop10に入る年もあります。
      </div>
      <div>
        ・島嶼部は気温が極端に高いため、区別のためランクに順位に*がついています。
      </div>
      <div>・年間最多記録は、南鳥島(2020年)の176日です。</div>
    </>
  ),
  hitemp_25: (
    <>
      <div>
        ・年度ごとの夏日日数をもとに、全国の観測地点をランキング化しています。
      </div>
      <div>
        ・島嶼部が上位を独占しており、西日本(特に九州)の地点がtop100を独占しています。
      </div>
      <div>
        ・島嶼部は気温が極端に高いため、区別のためランクに順位に*がついています。
      </div>
      <div>・年間最多記録は、南鳥島(2021年)の330日です。</div>
    </>
  ),
};
export const rankingIconMap: Record<string, RankingIconDef> = {
  hitemp_35: {
    Icon: PiThermometerHotFill,
    iconClass: "text-red-500",
  },
  hitemp_30: {
    Icon: TbTemperaturePlus,
    iconClass: "text-orange-500",
  },
  hitemp_25: {
    Icon: TbTemperature,
    iconClass: "text-yellow-500",
  },
};
