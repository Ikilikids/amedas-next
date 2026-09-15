// pages/map.tsx
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import Layout from "../components/Layout";
import PageLayout from "../components/PageLayout";
import HeroSection from "../components/HeroSection";
import Sidebar from "../components/Sidebar";
import StationMap from "../components/StationMap";
import InfoPanel from "../components/InfoPanel";
import UonzuChart from "../components/UonzuChart";
import Breadcrumb from "../components/Breadcrumb";
import { useStationDetail } from "../components/Ranking/useRankingData";
import { MetricKey } from "../setting/metric";
import { StationId } from "../types/union";

// ==============================
//  ページコンポーネント
// ==============================
const MapPage: NextPage = () => {
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const { stationData, uonzuData, overviewData, badges, loading } = useStationDetail(
    (selectedStation as StationId) || null
  );

  const regionStrong =
    stationData && stationData.pref
      ? (stationData.pref as any).region.colorStrong
      : "#10b981";

  return (
    <>
      <Head>
        <title>マップから探す - アメダス図鑑</title>
        <meta
          name="description"
          content="アメダス観測所の雨温図や降水量、猛暑日日数などの気候データを月別で確認できます。地図上のピンをクリックして、各観測所の詳細データを簡単にチェック可能です。"
        />
        <link rel="canonical" href="https://amedas-zukan.jp/map" />
      </Head>
      <Layout>
        <main className="max-w-[1280px] mx-auto p-4  my-4 w-full">
          {/* パンくずリスト */}
          <Breadcrumb
            items={[
              { label: "マップから探す" },
            ]}
          />

          <PageLayout sidebar={<Sidebar />}>
            {/* 左メインエリア */}
            <div className="space-y-6">
              {/* ページヘッダーカード */}
              <HeroSection
                badgeIcon={<FaMapLocationDot />}
                badgeText="Interactive Map"
                title="マップから探す"
                description="地図上のピンをクリックすると、下部に選択した観測所の基本データと雨温図が表示されます。"
                watermark="MAP"
                gradient="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600"
              />

              {/* 地図セクション */}
              <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200 mb-4">
                  <h2 className="text-lg  font-black text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-6 rounded-full bg-emerald-600" />
                    <span>全国アメダス観測所マップ</span>
                  </h2>
                  <span className="text-xs text-slate-400 font-bold hidden ">
                    ピンをクリックして地点を選択
                  </span>
                </div>
                <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-slate-100">
                  <StationMap
                    onStationClick={(s) => setSelectedStation(s.id)}
                  />
                </div>
              </section>

              {/* 地点選択時の詳細セクション */}
              <section className="bg-white rounded-3xl p-6  shadow-sm border border-slate-200/80">
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200 mb-6">
                  <h2 className="text-lg  font-black text-slate-800 flex items-center gap-2">
                    <span
                      className="w-1.5 h-6 rounded-full"
                      style={{ backgroundColor: regionStrong }}
                    />
                    <span>
                      {stationData
                        ? `${stationData.official_name}（${stationData.pref.label}）の気候データ`
                        : "選択中の地点データ"}
                    </span>
                  </h2>
                  {stationData && (
                    <Link
                      href={`/station/${stationData.id}`}
                      className="text-xs font-bold text-blue-600 hover:underline shrink-0"
                    >
                      個別ページを見る →
                    </Link>
                  )}
                </div>

                {!selectedStation ? (
                  <div className="py-16 text-center text-slate-400 font-bold flex flex-col items-center justify-center gap-3">
                    <FaInfoCircle className="text-3xl text-slate-300" />
                    <p className="text-sm">
                      地図上のピンをクリックすると、ここに基本データと雨温図が表示されます
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* 基本データ */}
                    <div>
                      <h3 className="text-sm font-black text-slate-700 mb-3 flex items-center gap-1.5">
                        <span className="w-1 h-4 rounded-full bg-slate-400" />
                        <span>基本情報・平年値サマリー</span>
                      </h3>
                      <InfoPanel
                        stationData={stationData}
                        overViewData={overviewData}
                        loading={loading}
                        isTitle={true}
                        badges={badges}
                      />
                    </div>

                    {/* 雨温図 */}
                    <div>
                      <h3 className="text-sm font-black text-slate-700 mb-3 flex items-center gap-1.5">
                        <span className="w-1 h-4 rounded-full bg-slate-400" />
                        <span>雨温図（月別平年値グラフ）</span>
                      </h3>
                      <div className="w-full h-[360px] p-2 bg-slate-50/50 rounded-2xl border border-slate-100">
                        {uonzuData ? (
                          <UonzuChart
                            uonzuData={uonzuData}
                            selectedBar={MetricKey.sm_rain}
                            height="100%"
                            hideLegend={true}
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                            雨温図データを読み込み中...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </PageLayout>
        </main>
      </Layout>
    </>
  );
};

export default MapPage;
