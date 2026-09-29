import { ArticleSectionItem } from "../../components/ArticleTemplate";
import FeatureStationCard from "../../components/ArticleTemplate/Feature";
import meteoDataRaw from "../../../data/feature/meteo.json";
import stationsRaw from "../../../public/stations.json";
import { resolvePref } from "../../utils/masterUtils";
import { RegionKey, RegionValue } from "../../setting/region";

interface MeteoItem {
  record: string;
  prime: string;
  temp: string;
  rain: string;
  other: string;
}

interface RawStation {
  id: string;
  station_name: string;
  official_name?: string;
  pref: string;
}

const METEO_DATA = meteoDataRaw as Record<string, MeteoItem>;
const STATIONS = stationsRaw as Record<string, RawStation>;

const REGION_ORDER: { key: RegionValue; label: string }[] = [
  { key: "hokkaido", label: "北海道地方" },
  { key: "tohoku", label: "東北地方" },
  { key: "kanto", label: "関東地方" },
  { key: "hokuriku", label: "北陸地方" },
  { key: "chubu", label: "中部地方" },
  { key: "kinki", label: "近畿地方" },
  { key: "chugoku", label: "中国地方" },
  { key: "shikoku", label: "四国地方" },
  { key: "kyushu", label: "九州地方" },
  { key: "okinawa", label: "沖縄地方" },
];

function buildPrefecturesMeteoSections(): ArticleSectionItem[] {
  // meteo.json の id から stations.json と pref/region を逆引きして地方別にグルーピング
  const groups: Record<
    string,
    {
      key: RegionValue;
      label: string;
      color: string;
      stations: Array<{
        id: string;
        name: string;
        officialName: string;
        prefLabel: string;
        data: MeteoItem;
      }>;
    }
  > = {};

  for (const [id, data] of Object.entries(METEO_DATA)) {
    const station = STATIONS[id];
    if (!station) continue;

    const prefMeta = resolvePref(station.pref);
    const regionMeta = prefMeta?.region || RegionKey.kanto;
    const regionKey = regionMeta.key;

    if (!groups[regionKey]) {
      groups[regionKey] = {
        key: regionKey,
        label: regionMeta.label,
        color: regionMeta.colorStrong,
        stations: [],
      };
    }

    groups[regionKey].stations.push({
      id,
      name: station.station_name,
      officialName: station.official_name || `${station.station_name}地方気象台`,
      prefLabel: prefMeta?.label || "",
      data,
    });
  }

  const sections: ArticleSectionItem[] = [
    {
      id: "overview",
      title: "概要：全国47都道府県の代表気象台と気候平年値",
      accentColor: "#2563eb",
      content: (
        <div className="space-y-3">
          <p className="leading-relaxed">
            日本国内には約1,300か所のアメダス観測所が存在しますが、その中でも各都道府県の代表として長年観測を牽引してきたのが、各県庁所在地等に置かれた<strong>代表気象台（地方気象台・管区気象台）</strong>です。
          </p>
          <p className="leading-relaxed">
            北端の札幌から南端の那覇まで、年平均気温は9.2℃から23.3℃まで14℃以上の開きがあり、年間降雪量は0cmから500cm超、年間日照時間も1,500時間台から2,200時間超まで大きな地域差が存在します。
          </p>
        </div>
      ),
    },
  ];

  for (const { key } of REGION_ORDER) {
    const group = groups[key];
    if (!group) continue;

    sections.push({
      id: `region-${group.key}`,
      title: `${group.label}の気象台`,
      accentColor: group.color,
      content: (
        <div className="grid grid-cols-1 gap-6">
          {group.stations.map((st) => (
            <FeatureStationCard
              key={st.id}
              id={st.id}
              recordBadgeText={st.data.record ? `気象台ランキング: ${st.data.record}` : undefined}
              prime={st.data.prime}
              tempDescription={st.data.temp}
              rainDescription={st.data.rain}
              otherTopic={st.data.other}
            />
          ))}
        </div>
      ),
    });
  }

  return sections;
}

export const PREFECTURES_METEO_SECTIONS = buildPrefecturesMeteoSections();
