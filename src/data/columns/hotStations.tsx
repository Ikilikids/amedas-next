import {
  FaFireAlt,
  FaTemperatureHigh,
  FaSun,
} from "react-icons/fa";
import { ArticleSectionItem } from "../../components/ArticleTemplate";
import FeatureStationCard from "../../components/ArticleTemplate/Feature";
import hotDataRaw from "../../../data/feature/hot.json";
import stationsRaw from "../../../public/stations.json";
import { resolvePref } from "../../utils/masterUtils";

interface HotItem {
  record: string;
  d1?: string;
  d2?: string;
  d3?: string;
  d4?: string;
  d5?: string;
}

interface RawStation {
  id: string;
  station_name: string;
  pref: string;
}

const HOT_DATA = hotDataRaw as Record<string, HotItem>;
const STATIONS = stationsRaw as Record<string, RawStation>;

function buildHotStationsSections(): ArticleSectionItem[] {
  const sections: ArticleSectionItem[] = [
    {
      id: "overview",
      title: "概要：なぜ日本の特定の地域はここまで猛暑になるのか？",
      accentColor: "#dc2626",
      content: (
        <div className="space-y-3">
          <p className="leading-relaxed">
            日本の夏は全国的に高温多湿ですが、ニュースで連日のように40℃超えや最高気温ランキングの上位に登場する地点には、
            <strong>「内陸盆地」「山越えのフェーン現象」「大都市のヒートアイランド現象」</strong>
            など、気象条件と地形が複合した明確な物理的理由があります。
          </p>
          <p className="leading-relaxed">
            歴代全国最高記録を保持する熊谷や多治見、伊勢崎をはじめ、日中の昇温が凄まじい盆地地点から、
            朝晩の気温が全く下がらない熱帯夜の代表地点（大阪、神戸など）まで、日本の猛暑を象徴する14の代表地点をまとめました。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-xs">
              <div className="font-bold text-rose-800 flex items-center gap-1.5 mb-1">
                <FaFireAlt className="text-rose-600" />
                <span>内陸盆地型</span>
              </div>
              <p className="text-slate-600">
                多治見・甲府・日田など。海風が届かず日射で暖められた空気が滞留し、極端な最高気温を記録。
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs">
              <div className="font-bold text-amber-800 flex items-center gap-1.5 mb-1">
                <FaSun className="text-amber-600" />
                <span>フェーン現象型</span>
              </div>
              <p className="text-slate-600">
                熊谷・伊勢崎・三条など。山脈を越えた乾いた風が吹き降りて断熱圧縮され、爆発的な高温をもたらす。
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-xs">
              <div className="font-bold text-orange-800 flex items-center gap-1.5 mb-1">
                <FaTemperatureHigh className="text-orange-600" />
                <span>夜間高温・都市型</span>
              </div>
              <p className="text-slate-600">
                大阪・神戸など。海風や都市排熱・アスファルトの影響で夜間も気温が下がらず、熱帯夜日数が国内最多クラス。
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // 各地点をカード形式でセクション化
  Object.entries(HOT_DATA).forEach(([id, data], idx) => {
    const station = STATIONS[id];
    const prefMeta = station ? resolvePref(station.pref) : null;
    const bullets = [data.d1, data.d2, data.d3, data.d4, data.d5].filter(Boolean);

    sections.push({
      id: `station-${id}`,
      title: `${idx + 1}. ${station?.station_name || id}（${prefMeta?.label || ""}）`,
      accentColor: "#dc2626",
      content: (
        <FeatureStationCard
          id={id}
          recordBadgeText={data.record ? `観測記録・特徴: ${data.record}` : undefined}
          bullets={bullets}
        />
      ),
    });
  });

  return sections;
}

export const HOT_STATIONS_SECTIONS = buildHotStationsSections();
