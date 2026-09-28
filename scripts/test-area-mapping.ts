import fs from 'fs';
import https from 'https';

// 1. Fetch JMA area.json
function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function main() {
  const areaJson = await fetchJson('https://www.jma.go.jp/bosai/common/const/area.json');
  const stations = JSON.parse(fs.readFileSync('public/stations.json', 'utf8'));

  // Build mapping for class20s
  const class20Entries = Object.entries(areaJson.class20s).map(([c20Code, c20]: [string, any]) => {
    const c15Code = c20.parent;
    const c15 = areaJson.class15s[c15Code];
    const c10Code = c15 ? c15.parent : null;
    const c10 = c10Code ? areaJson.class10s[c10Code] : null;
    const officeCode = c10 ? c10.parent : null;
    const office = officeCode ? areaJson.offices[officeCode] : null;
    return {
      c20Code,
      name: c20.name as string,
      c10Code: c10Code as string,
      c10Name: c10 ? c10.name as string : '',
      officeCode: officeCode as string,
      officeName: office ? office.name as string : '',
    };
  });

  function cleanCity(raw: string) {
    if (!raw) return '';
    return raw.replace(/^.+?郡/, '');
  }

  function resolveArea(st: any): { areaCode: string; areaName: string } {
    const rawCity = st.city || '';
    const clean = cleanCity(rawCity);

    // Special cases
    if (st.id === '72176') { // 竜王山 (徳島県美馬市)
      return { areaCode: '360010', areaName: '北部' };
    }
    if (st.id === '74296' || clean === '梼原町') { // 梼原
      return { areaCode: '390030', areaName: '西部' };
    }

    // Exact match
    let found = class20Entries.find(c => c.name === rawCity || c.name === clean);
    if (!found) {
      // Substring match
      found = class20Entries.find(c => clean.startsWith(c.name) || c.name.startsWith(clean));
    }

    if (found) {
      return { areaCode: found.c10Code, areaName: found.c10Name };
    }

    throw new Error(`Unresolved station: ${st.id} ${st.station_name} ${st.city}`);
  }

  // Test all stations
  let resolvedCount = 0;
  const areaDistribution: Record<string, { code: string; name: string; office: string; count: number }> = {};

  for (const [id, st] of Object.entries<any>(stations)) {
    const { areaCode, areaName } = resolveArea(st);
    resolvedCount++;
    if (!areaDistribution[areaCode]) {
      const c10 = areaJson.class10s[areaCode];
      const office = c10 ? areaJson.offices[c10.parent]?.name : '';
      areaDistribution[areaCode] = { code: areaCode, name: areaName, office, count: 0 };
    }
    areaDistribution[areaCode].count++;
  }

  console.log(`Successfully resolved all ${resolvedCount} stations!`);
  console.log(`Total distinct class10 areas used: ${Object.keys(areaDistribution).length}`);
  
  // Show a few
  console.log('Sample areas:', Object.values(areaDistribution).slice(0, 10));
}

main().catch(console.error);
