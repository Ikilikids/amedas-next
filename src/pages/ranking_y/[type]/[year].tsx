import fs from "fs";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import path from "path";

import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import RankingYear from "../../../components/Ranking_year";

import { detectUnitFromPath, metrics } from "../../../utils/colorUtils";

import { rankingLinks } from "../../../utils/navLinks"; // 実際のパスに合わせて

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
  description: string[];
}

// ==============================
// 表示ラベル定義
// ==============================

// ==============================
// getStaticPaths
// ==============================
export const getStaticPaths: GetStaticPaths = async () => {
  const dataRoot = path.join(process.cwd(), "data", "ranking_y");

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

  const rankingPath = path.join(
    process.cwd(),
    "data",
    "ranking_y",
    type,
    `${year}.json`
  );

  let rankingList: Ranking[] = [];

  const descPath = path.join(
    process.cwd(),
    "data",
    "ranking_y",
    "description.json"
  );

  const descJson = JSON.parse(fs.readFileSync(descPath, "utf-8")) as Record<
    string,
    string[]
  >;

  const description = descJson[type] ?? [];
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
          value: isNaN(val)
            ? null
            : unit == "日" || unit == "cm"
            ? `${val.toFixed(0)}${unit}`
            : `${val.toFixed(1)}${unit}`,
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
  const yearsDir = path.join(process.cwd(), "data", "ranking_y", type);
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
      description,
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
  description,
}) => {
  const metric = metrics.find((m) => m.key === type);
  const label = metric?.label ?? type;
  const linkDef = rankingLinks.find((l) =>
    l.href.includes(`/ranking_y/${type}/`)
  );
  const Icon = linkDef?.Icon;
  const iconClass = linkDef?.iconClass ?? "";
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
                {Icon && <Icon className={`w-8 h-8 ${iconClass}`} />}
                {year}年の{label}ランキング
              </h1>

              <div className="text-gray-700 mb-4 mt-2 leading-relaxed space-y-1">
                {description.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
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
