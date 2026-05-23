// pages/prefecture.tsx
import fs from "fs";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import path from "path";
import { GiJapan } from "react-icons/gi";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { getIcon, prefCodeMap } from "../utils/colorUtils";

// ==============================
// Types
// ==============================
interface StationValue {
  id: string;
  rank: number;
  観測所名: string;
}

interface Station {
  value: StationValue;
  prefCode: number;
}

interface PageProps {
  stations: Station[];
}

// ==============================
// getStaticProps
// ==============================
export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const filePath = path.join(process.cwd(), "public", "stations.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(jsonData);

  const stationList: Station[] = Object.entries(data).map(
    ([id, value]: [string, any]) => {
      const prefCode = parseInt(id.slice(0, 2), 10);
      return {
        value: { ...value, id, 観測所名: value.name }, // 互換性のために観測所名を残す
        prefCode,
      };
    }
  );

  return {
    props: {
      stations: stationList,
    },
  };
};

// ==============================
//  ページコンポーネント
// ==============================
const PrefecturePage: NextPage<PageProps> = ({ stations }) => {
  return (
    <>
      <Head>
        <title>都道府県から探す - アメダス図鑑</title>
        <meta
          name="description"
          content="都道府県別にアメダス観測所を一覧表示。各観測所の雨温図、降水量、猛暑日日数などの気候データを月別に確認できます。"
        />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <main className="flex-1 p-4">
          <div className="max-w-[1280px] mx-auto flex flex-col gap-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <GiJapan className="w-8 h-8" />
              都道府県から探す
            </h1>

            <div className="text-gray-700 mb-4">
              <div>
                ・都道府県別にアメダスをまとめました。クリックすると詳細ページに移動します。
              </div>
              <div>
                ・赤は気象台です。北海道に7つ、沖縄県に4つ、その他都道府県に1つずつ存在します。
              </div>
              <div>
                ・基本的に県庁所在地に置かれていますが、銚子(千葉)、熊谷(埼玉)、彦根(滋賀)、下関(山口)のみ例外的に県庁所在地以外に置かれています。
              </div>
              <div>
                ・黄色は特別地域気象観測所、測候所などです。気象台に次いで、高度な観測機器が設置されています。
              </div>
            </div>

            {stations.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">気象台</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                  {stations
                    .filter((s) => s.value.rank === 1)
                    .sort((a, b) => a.value.id.localeCompare(b.value.id))
                    .map((s) => (
                      <Link
                        key={`rank1-${s.value.id}`}
                        href={`/station/${s.value.id}`}
                        className="border rounded-lg p-3 shadow hover:shadow-lg transition text-center flex items-center justify-center gap-1 bg-white"
                      >
                        {s.value.観測所名}
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {Object.entries(prefCodeMap).map(([prefCode, prefName]) => {
              const stationsInPref = stations
                .filter((s) => s.prefCode.toString() === prefCode)
                .sort((a, b) => {
                  const rankOrder = [1, 2];
                  const idxA = rankOrder.includes(a.value.rank)
                    ? rankOrder.indexOf(a.value.rank)
                    : 2;
                  const idxB = rankOrder.includes(b.value.rank)
                    ? rankOrder.indexOf(b.value.rank)
                    : 2;
                  if (idxA !== idxB) return idxA - idxB;
                  return a.value.id.localeCompare(b.value.id);
                });

              return (
                <div key={`pref-${prefCode}`} className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">{prefName}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                    {stationsInPref.map((s) => {
                      const bgColor =
                        s.value.rank === 1
                          ? "bg-red-200"
                          : s.value.rank === 2
                          ? "bg-orange-200"
                          : "bg-white";
                      return (
                        <Link
                          key={`station-${prefCode}-${s.value.id}`}
                          href={`/station/${s.value.id}`}
                          className={`border rounded-lg p-3 shadow hover:shadow-lg transition text-center flex items-center justify-center gap-1 ${bgColor}`}
                        >
                          {(s.value.rank === 1 || s.value.rank === 2) &&
                            getIcon(String(s.value.rank))}
                          {s.value.観測所名}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PrefecturePage;
