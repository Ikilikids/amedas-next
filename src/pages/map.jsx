// pages/map.jsx
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import { IoHomeSharp } from "react-icons/io5";
import { LuChartNoAxesCombined } from "react-icons/lu";
import Footer from "../components/Footer";
import Header from "../components/Header";
import InfoPanel from "../components/InfoPanel";
import MapView from "../components/MapView";
import UonzuChart from "../components/UonzuChart";
import { SectionWithDescription, getRegionColor } from "../utils/colorUtils";
// --- SSR: 初期駅データ取得 ---

export default function MapPage({}) {
  const [selectedStation, setSelectedStation] = useState(null);
  const [stationData, setStationData] = useState(null);
  const [loading, setLoading] = useState(false);
  // ★ キャッシュは親で持つ
  const stationCacheRef = useRef({});

  useEffect(() => {
    const stationId = selectedStation?.id;
    if (!stationId) {
      setStationData(null);
      return;
    }

    // キャッシュ命中
    if (stationCacheRef.current[stationId]) {
      setStationData(stationCacheRef.current[stationId]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/infotable/${stationId}.json`);
        const data = await res.json();
        stationCacheRef.current[stationId] = data;
        setStationData(data);
      } catch (e) {
        console.error("fetch error:", e);
        setStationData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedStation]);
  const bgColor =
    stationData && stationData.pref
      ? getRegionColor(stationData.pref)
      : "white";
  return (
    <>
      <Head>
        <title>マップから探す - アメダス図鑑</title>
        <meta
          name="description"
          content="アメダス観測所の雨温図や降水量、猛暑日日数などの気候データを月別で確認できます。地図上のピンをクリックして、各観測所の詳細データを簡単にチェック可能です。"
        />
      </Head>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <main className="flex-1 p-4">
          <div className="max-w-[1280px] mx-auto flex flex-col gap-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FaMapLocationDot className="w-8 h-8" />
              マップから探す
            </h1>

            <div className="text-gray-700 mb-4">
              <div>
                ・地図上のピンをクリックすると、右側(下側)の情報パネルに選択した観測所の基本情報（正式名称、都道府県、市町村）と雨温図が表示されます。
              </div>
              <div>
                ・情報パネルの地点名を押すと、各月の平均気温、最高・最低気温、降水量などの詳細データや、割合グラフを確認できます。
              </div>
              <div>
                ・地図上でピンをドラッグしたり拡大縮小して、他の観測所の位置や周辺情報も簡単に確認できます。
              </div>
              <div>
                ・情報パネルの背景色は、地方を表しています。北海道：紺｜東北：水色｜関東：緑｜中部：黄緑｜北陸：黄｜近畿：橙｜中国：紫｜四国：桃色｜九州：赤｜沖縄：淡桃色
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              {/* 左：地図 */}
              <div className="h-[400px] lg:h-[750px] lg:flex-[4] xl:flex-[5] overflow-hidden flex flex-col gap-2">
                <h2 className="sr-only">地図</h2>

                <div className="bg-white border rounded-lg">
                  <SectionWithDescription
                    icon={FaMapLocationDot}
                    title="マップ"
                    bgColor=""
                  />
                </div>
                {/* ★ここが超重要 */}
                <div className="bg-white border rounded-lg flex-1 min-h-0 overflow-hidden">
                  {/* MapView */}
                  <MapView onStationClick={setSelectedStation} />
                </div>
              </div>

              {/* 右：情報パネル */}
              <div className="h-[750px] lg:flex-[2] xl:flex-[2] overflow-hidden flex flex-col gap-2">
                <h2 className="sr-only">情報パネル</h2>
                <div
                  className="border rounded-lg"
                  style={{ backgroundColor: bgColor }}
                >
                  <SectionWithDescription
                    icon={IoHomeSharp}
                    title="基本情報"
                    bgColor=""
                  />
                </div>
                <div className="min-h-0 h-[320px] overflow-auto">
                  <InfoPanel
                    stationId={selectedStation?.id}
                    stationData={stationData}
                    loading={loading}
                  />
                </div>
                <div
                  className="bg-white border rounded-lg"
                  style={{ backgroundColor: bgColor }}
                >
                  <SectionWithDescription
                    icon={LuChartNoAxesCombined}
                    title="雨温図"
                    bgColor=""
                  />
                </div>
                {stationData && (
                  <div className="w-full h-[320px] pt-2">
                    <UonzuChart
                      temp={stationData.uonzu.av_avtemp}
                      hitemp={stationData.uonzu.av_hitemp}
                      lwtemp={stationData.uonzu.av_lwtemp}
                      rain={stationData.uonzu.sm_rain}
                      sun={stationData.uonzu.sm_sun}
                      snowing={stationData.uonzu.sm_snowing}
                      selectedBar="rain"
                      height="320px"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
