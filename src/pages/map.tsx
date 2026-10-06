import { GetStaticProps, NextPage } from "next";
import { useCallback, useState } from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import Layout from "../components/Layout";
import StationMap from "../components/common/StationMap";
import InfoPanel from "../components/common/InfoPanel";
import { useStationDetail } from "../hooks/useStationDetail";
import { StationId } from "../types/union";
import { RawStationData } from "../types/raw";
import { loadMaster } from "../utils/loading/0_stationData";

type MapPageProps = {
  masterData: Record<StationId, RawStationData>;
};

const MapPage: NextPage<MapPageProps> = ({ masterData }) => {
  const [selectedStation, setSelectedStation] = useState<StationId | null>(null);

  const { rawData, loading } = useStationDetail(
    selectedStation,
    masterData
  );

  const handleStationClick = useCallback((s: { id: StationId }) => {
    setSelectedStation(s.id);
  }, []);

  return (
    <Layout
      seo={{
        title: "全国アメダス観測所マップ - アメダス図鑑",
        description:
          "アメダス観測所の雨温図や降水量、猛暑日日数などの気候データを月別で確認できます。地図上のピンをクリックして、各観測所の詳細データを簡単にチェック可能です。",
        canonical: "https://amedas-zukan.jp/map",
      }}
      breadcrumbs={[
        { label: "マップから探す" },
      ]}
      heroProps={{
        badgeIcon: <FaMapLocationDot />,
        badgeText: "Interactive Map",
        title: "マップから探す",
        description: "地図上のピンをクリックすると、選択した観測所の基本データや平年値サマリーが表示されます。",
        watermark: "MAP",
        gradient: "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600",
      }}
      sections={[
        {
          id: "map-section",
          label: "全国アメダス観測所マップ",
          subLabel: "ピンをクリックして地点を選択できます。",
          accentColor: "#10b981",
          children: (
            <div className="flex flex-col xl:flex-row gap-6 items-stretch">
              {/* 地図コンテナ: 通常280px、xlで2倍の560px */}
              <div className="w-full xl:w-1/2 h-[280px] xl:h-[560px] rounded-2xl overflow-hidden border border-slate-100 shrink-0">
                <StationMap
                  stationsMap={masterData}
                  onStationClick={handleStationClick}
                />
              </div>

              {/* 地点詳細パネル: 通常は下、xlで右側に横並び */}
              <div className="w-full xl:w-1/2 flex flex-col">
                <InfoPanel
                  rawData={rawData}
                  loading={loading}
                  isTitle={true}
                />
              </div>
            </div>
          ),
        },
      ]}
    />
  );
};

export const getStaticProps: GetStaticProps<MapPageProps> = async () => {
  const masterData = loadMaster();
  return {
    props: {
      masterData,
    },
  };
};

export default MapPage;
