import fs from 'fs';
import https from 'https';
import { PrefKey } from '../src/setting/pref';

function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

// JMA office code to PrefKey (in src/setting/pref.ts)
const officeToPrefKey: Record<string, string> = {
  '011000': 'hokkaido_douhoku',
  '012000': 'hokkaido_douhoku',
  '013000': 'hokkaido_doutou',
  '014030': 'hokkaido_doutou',
  '014100': 'hokkaido_doutou',
  '015000': 'hokkaido_douou',
  '016000': 'hokkaido_douou',
  '017000': 'hokkaido_dounan',
  '020000': 'aomori',
  '030000': 'iwate',
  '040000': 'miyagi',
  '050000': 'akita',
  '060000': 'yamagata',
  '070000': 'fukushima',
  '080000': 'ibaraki',
  '090000': 'tochigi',
  '100000': 'gunma',
  '110000': 'saitama',
  '120000': 'chiba',
  '130000': 'tokyo',
  '140000': 'kanagawa',
  '150000': 'niigata',
  '160000': 'toyama',
  '170000': 'ishikawa',
  '180000': 'fukui',
  '190000': 'yamanashi',
  '200000': 'nagano',
  '210000': 'gifu',
  '220000': 'shizuoka',
  '230000': 'aichi',
  '240000': 'mie',
  '250000': 'shiga',
  '260000': 'kyoto',
  '270000': 'osaka',
  '280000': 'hyogo',
  '290000': 'nara',
  '300000': 'wakayama',
  '310000': 'tottori',
  '320000': 'shimane',
  '330000': 'okayama',
  '340000': 'hiroshima',
  '350000': 'yamaguchi',
  '360000': 'tokushima',
  '370000': 'kagawa',
  '380000': 'ehime',
  '390000': 'kochi',
  '400000': 'fukuoka',
  '410000': 'saga',
  '420000': 'nagasaki',
  '430000': 'kumamoto',
  '440000': 'oita',
  '450000': 'miyazaki',
  '460100': 'kagoshima',
  '460040': 'kagoshima',
  '471000': 'okinawa_main',
  '472000': 'okinawa_daito',
  '473000': 'okinawa_miyako',
  '474000': 'okinawa_yaeyama',
};

async function main() {
  console.log('Fetching JMA area.json...');
  const areaJson = await fetchJson('https://www.jma.go.jp/bosai/common/const/area.json');
  const stations = JSON.parse(fs.readFileSync('public/stations.json', 'utf8'));

  // Build class20 entries with ancestors
  const class20Entries = Object.entries(areaJson.class20s).map(([c20Code, c20]: [string, any]) => {
    const c15Code = c20.parent;
    const c15 = areaJson.class15s[c15Code];
    const c10Code = c15 ? c15.parent : null;
    const c10 = c10Code ? areaJson.class10s[c10Code] : null;
    const officeCode = c10 ? c10.parent : null;
    return {
      c20Code,
      name: c20.name as string,
      c10Code: c10Code as string,
      officeCode: officeCode as string,
    };
  });

  function cleanCity(raw: string) {
    if (!raw) return '';
    return raw.replace(/^.+?郡/, '');
  }

  // JMA Hokkaido offices
  const hokkaidoOffices = ['011000', '012000', '013000', '014030', '014100', '015000', '016000', '017000'];

  const prefToOfficeCodes: Record<string, string[]> = {};
  for (const [officeCode, prefKey] of Object.entries(officeToPrefKey)) {
    const meta = (PrefKey as any)[prefKey];
    if (meta && meta.code) {
      for (const p of meta.code) {
        if (parseInt(p, 10) >= 11 && parseInt(p, 10) <= 24) {
          prefToOfficeCodes[p] = hokkaidoOffices;
        } else {
          if (!prefToOfficeCodes[p]) prefToOfficeCodes[p] = [];
          prefToOfficeCodes[p].push(officeCode);
        }
      }
    }
  }

  // Exact resolution per station
  function resolveAreaCode(st: any): string {
    // 1. Cross-border/unique station overrides
    if (st.id === '72176') return '360010'; // 竜王山 (徳島美馬市)
    if (st.id === '74296') return '390030'; // 梼原 (高知)

    // Intra-city multi-area splits (specific station ID to area)
    if (st.id === '60116') return '250020'; // 南小松 (滋賀大津市北部)
    if (st.id === '51071' || st.id === '51056') return '230020'; // 稲武・小原 (愛知豊田市東部)
    if (st.id === '17246') return '013010'; // 常呂 (北海道北見市常呂)
    if (st.id === '34012') return '040020'; // 駒ノ湯 (宮城栗原市西部)
    if (st.id === '34096') return '040020'; // 川渡 (宮城大崎市西部)
    if (st.id === '34262' || st.id === '34311') return '040020'; // 泉ケ岳・新川 (宮城仙台市西部)
    if (st.id === '24141') return '017020'; // 熊石 (北海道八雲町檜山)

    // 2. Filter available class20 entries strictly by station's prefecture offices
    const validOffices = prefToOfficeCodes[st.pref] || [];
    const prefClass20s = class20Entries.filter(c => validOffices.includes(c.officeCode));

    const rawCity = st.city || '';
    const clean = cleanCity(rawCity);

    // Exact name match within prefecture
    let candidates = prefClass20s.filter(c => c.name === rawCity || c.name === clean);
    if (candidates.length === 0) {
      // Prefix/substring match within prefecture (e.g. 五條市 matches 五條市北部吉野川流域 / 五條市南部)
      candidates = prefClass20s.filter(c => clean.startsWith(c.name) || c.name.startsWith(clean));
    }

    if (candidates.length >= 1) {
      return candidates[0].c10Code;
    }

    throw new Error(`Unresolved station: ${st.id} ${st.station_name} ${st.city} pref:${st.pref}`);
  }

  // 1. Update stations.json
  console.log('Resolving area code for all 1,241 stations...');
  const updatedStations: Record<string, any> = {};
  for (const [id, st] of Object.entries<any>(stations)) {
    const area = resolveAreaCode(st);
    updatedStations[id] = {
      ...st,
      area,
    };
  }
  fs.writeFileSync('public/stations.json', JSON.stringify(updatedStations, null, 2), 'utf8');
  console.log('Successfully updated public/stations.json with official area codes!');

  // 2. Build src/setting/area.ts
  console.log('Generating src/setting/area.ts...');
  const class10Entries = Object.entries<any>(areaJson.class10s);
  const areaValues = class10Entries.map(([code]) => `  | "${code}"`).join('\n');

  let areaKeyEntries = '';
  for (const [code, c10] of class10Entries) {
    const officeCode = c10.parent;
    const prefKey = officeToPrefKey[officeCode];
    const name = c10.name;

    areaKeyEntries += `  "${code}": {
    key: "${code}",
    label: "${name}",
    pref: PrefKey.${prefKey},
    detail: {
      key: "${code}",
      name: "${name}",
      catchphrase: "",
      climateType: "",
      heroDescription: "",
      description: [],
      highlights: [],
    },
  },\n`;
  }

  const areaTsContent = `import { PrefKey, PrefMeta, PrefValue } from "./pref";
import { AreaItemData } from "../data/types";
export type { AreaItemData };

// ==============================
// 型（気象庁 一次細分区域コード 6桁）
// ==============================
export type AreaValue =
${areaValues};

export type AreaMeta = {
  key: AreaValue;
  label: string;
  pref: PrefMeta;
  detail: AreaItemData;
};

type AreaMap = Record<AreaValue, AreaMeta>;

// ==============================
// 定義（気象庁公式 一次細分区域 全142区分）
// ==============================
export const AreaKey = {
${areaKeyEntries}} satisfies AreaMap;

// ==============================
// utils
// ==============================
export const AREA_LIST = Object.keys(AreaKey) as AreaValue[];

export function getAreasInPref(prefKey: PrefValue): AreaMeta[] {
  return Object.values(AreaKey).filter(
    (area) => area.pref === PrefKey[prefKey]
  );
}
`;

  fs.writeFileSync('src/setting/area.ts', areaTsContent, 'utf8');
  console.log('Successfully updated src/setting/area.ts with all 142 official areas!');
}

main().catch(console.error);
