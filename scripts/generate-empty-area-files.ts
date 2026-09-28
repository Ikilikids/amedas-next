import fs from 'fs';
import path from 'path';
import https from 'https';

function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

// Map officeCode to folder in src/data/area/ and prefKey in PrefKey
const officeInfo: Record<string, { folder: string; prefKey: string }> = {
  '011000': { folder: '11_douhoku', prefKey: 'hokkaido_douhoku' },
  '012000': { folder: '11_douhoku', prefKey: 'hokkaido_douhoku' },
  '013000': { folder: '17_doutou', prefKey: 'hokkaido_doutou' },
  '014030': { folder: '17_doutou', prefKey: 'hokkaido_doutou' },
  '014100': { folder: '17_doutou', prefKey: 'hokkaido_doutou' },
  '015000': { folder: '14_douou', prefKey: 'hokkaido_douou' },
  '016000': { folder: '14_douou', prefKey: 'hokkaido_douou' },
  '017000': { folder: '23_dounan', prefKey: 'hokkaido_dounan' },
  '020000': { folder: '31_aomori', prefKey: 'aomori' },
  '030000': { folder: '33_iwate', prefKey: 'iwate' },
  '040000': { folder: '34_miyagi', prefKey: 'miyagi' },
  '050000': { folder: '32_akita', prefKey: 'akita' },
  '060000': { folder: '35_yamagata', prefKey: 'yamagata' },
  '070000': { folder: '36_fukushima', prefKey: 'fukushima' },
  '080000': { folder: '40_ibaraki', prefKey: 'ibaraki' },
  '090000': { folder: '41_tochigi', prefKey: 'tochigi' },
  '100000': { folder: '42_gunma', prefKey: 'gunma' },
  '110000': { folder: '43_saitama', prefKey: 'saitama' },
  '120000': { folder: '45_chiba', prefKey: 'chiba' },
  '130000': { folder: '44_tokyo', prefKey: 'tokyo' },
  '140000': { folder: '46_kanagawa', prefKey: 'kanagawa' },
  '150000': { folder: '54_niigata', prefKey: 'niigata' },
  '160000': { folder: '55_toyama', prefKey: 'toyama' },
  '170000': { folder: '56_ishikawa', prefKey: 'ishikawa' },
  '180000': { folder: '57_fukui', prefKey: 'fukui' },
  '190000': { folder: '49_yamanashi', prefKey: 'yamanashi' },
  '200000': { folder: '48_nagano', prefKey: 'nagano' },
  '210000': { folder: '52_gifu', prefKey: 'gifu' },
  '220000': { folder: '50_shizuoka', prefKey: 'shizuoka' },
  '230000': { folder: '51_aichi', prefKey: 'aichi' },
  '240000': { folder: '53_mie', prefKey: 'mie' },
  '250000': { folder: '60_shiga', prefKey: 'shiga' },
  '260000': { folder: '61_kyoto', prefKey: 'kyoto' },
  '270000': { folder: '62_osaka', prefKey: 'osaka' },
  '280000': { folder: '63_hyogo', prefKey: 'hyogo' },
  '290000': { folder: '64_nara', prefKey: 'nara' },
  '300000': { folder: '65_wakayama', prefKey: 'wakayama' },
  '310000': { folder: '69_tottori', prefKey: 'tottori' },
  '320000': { folder: '68_shimane', prefKey: 'shimane' },
  '330000': { folder: '66_okayama', prefKey: 'okayama' },
  '340000': { folder: '67_hiroshima', prefKey: 'hiroshima' },
  '350000': { folder: '81_yamaguchi', prefKey: 'yamaguchi' },
  '360000': { folder: '71_tokushima', prefKey: 'tokushima' },
  '370000': { folder: '72_kagawa', prefKey: 'kagawa' },
  '380000': { folder: '73_ehime', prefKey: 'ehime' },
  '390000': { folder: '74_kochi', prefKey: 'kochi' },
  '400000': { folder: '82_fukuoka', prefKey: 'fukuoka' },
  '410000': { folder: '85_saga', prefKey: 'saga' },
  '420000': { folder: '84_nagasaki', prefKey: 'nagasaki' },
  '430000': { folder: '86_kumamoto', prefKey: 'kumamoto' },
  '440000': { folder: '83_oita', prefKey: 'oita' },
  '450000': { folder: '87_miyazaki', prefKey: 'miyazaki' },
  '460100': { folder: '88_kagoshima', prefKey: 'kagoshima' },
  '460040': { folder: '88_kagoshima', prefKey: 'kagoshima' },
  '471000': { folder: '91_okinawa_main', prefKey: 'okinawa_main' },
  '472000': { folder: '92_okinawa_daito', prefKey: 'okinawa_daito' },
  '473000': { folder: '93_okinawa_miyako', prefKey: 'okinawa_miyako' },
  '474000': { folder: '94_okinawa_yaeyama', prefKey: 'okinawa_yaeyama' },
};

async function main() {
  const areaJson = await fetchJson('https://www.jma.go.jp/bosai/common/const/area.json');
  const class10Entries = Object.entries<any>(areaJson.class10s);

  // Group class10s by folder
  const folderToAreas: Record<string, { code: string; name: string; varName: string; prefKey: string }[]> = {};

  for (const [code, c10] of class10Entries) {
    const officeCode = c10.parent;
    const info = officeInfo[officeCode];
    if (!info) throw new Error(`Unknown office: ${officeCode}`);

    if (!folderToAreas[info.folder]) {
      folderToAreas[info.folder] = [];
    }
    const varName = `area_${code}`;
    folderToAreas[info.folder].push({
      code,
      name: c10.name,
      varName,
      prefKey: info.prefKey,
    });
  }

  const baseDir = path.join(process.cwd(), 'src/data/area');

  // Clear old files in each folder and write new files
  for (const [folder, areas] of Object.entries(folderToAreas)) {
    const dir = path.join(baseDir, folder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    } else {
      // Remove old .ts files in folder
      const existingFiles = fs.readdirSync(dir);
      for (const f of existingFiles) {
        if (f.endsWith('.ts')) fs.unlinkSync(path.join(dir, f));
      }
    }

    // Write area files
    for (const a of areas) {
      const filePath = path.join(dir, `${a.code}.ts`);
      const content = `import { AreaItemData } from "../../types";

export const ${a.varName}: AreaItemData = {
  key: "${a.code}",
  name: "${a.name}",
  catchphrase: "",
  climateType: "",
  heroDescription: "",
  description: [
    {
      isSummary: true,
      content: [],
    },
  ],
  highlights: [],
};
`;
      fs.writeFileSync(filePath, content, 'utf8');
    }

    // Write folder index.ts
    const folderNameClean = folder.replace(/^\d+_/, '');
    const exportArrayName = `${folderNameClean}Areas`;
    const importStatements = areas.map(a => `import { ${a.varName} } from "./${a.code}";`).join('\n');
    const exportList = areas.map(a => a.varName).join(', ');

    const indexContent = `${importStatements}

export const ${exportArrayName} = [${exportList}];

export { ${exportList} };
`;
    fs.writeFileSync(path.join(dir, 'index.ts'), indexContent, 'utf8');
  }

  console.log('Successfully created all area article files across 53 folders!');

  // Generate src/data/area/index.ts
  let masterIndexImports = 'import { AreaItemData } from "../types";\n';
  const prefMapEntries: string[] = [];

  // Group by prefKey
  const prefKeyToAreas: Record<string, string[]> = {};
  for (const [folder, areas] of Object.entries(folderToAreas)) {
    const folderNameClean = folder.replace(/^\d+_/, '');
    const exportArrayName = `${folderNameClean}Areas`;
    masterIndexImports += `import { ${exportArrayName} } from "./${folder}";\n`;

    for (const a of areas) {
      if (!prefKeyToAreas[a.prefKey]) prefKeyToAreas[a.prefKey] = [];
    }
  }

  // We can map prefKey directly to the array
  const prefArrayMapEntries = Object.entries(folderToAreas).map(([folder, areas]) => {
    const folderNameClean = folder.replace(/^\d+_/, '');
    const exportArrayName = `${folderNameClean}Areas`;
    const prefKey = areas[0].prefKey;
    return `  ${prefKey}: ${exportArrayName},`;
  }).join('\n');

  const masterIndexContent = `${masterIndexImports}
export const PREF_AREAS_MAP: Record<string, AreaItemData[]> = {
${prefArrayMapEntries}
};

export function getAreasForPref(prefKey: string): AreaItemData[] {
  return PREF_AREAS_MAP[prefKey] || [];
}
`;
  fs.writeFileSync(path.join(baseDir, 'index.ts'), masterIndexContent, 'utf8');
  console.log('Successfully updated src/data/area/index.ts!');

  // Now update src/setting/area.ts to import each area and attach it as detail!
  let areaTsImports = `import { PrefKey, PrefMeta, PrefValue } from "./pref";
import { AreaItemData } from "../data/types";
export type { AreaItemData };\n\n`;

  for (const [folder, areas] of Object.entries(folderToAreas)) {
    const imports = areas.map(a => a.varName).join(', ');
    areaTsImports += `import { ${imports} } from "../data/area/${folder}";\n`;
  }

  const areaValues = class10Entries.map(([code]) => `  | "${code}"`).join('\n');

  let areaKeyEntries = '';
  for (const [code, c10] of class10Entries) {
    const officeCode = c10.parent;
    const info = officeInfo[officeCode];
    const name = c10.name;
    const varName = `area_${code}`;

    areaKeyEntries += `  "${code}": {
    key: "${code}",
    label: "${name}",
    pref: PrefKey.${info.prefKey},
    detail: ${varName},
  },\n`;
  }

  const areaTsContent = `${areaTsImports}
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
  console.log('Successfully updated src/setting/area.ts!');
}

main().catch(console.error);
