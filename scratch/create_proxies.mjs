import fs from 'fs';

const prefs = {
  'kanto.ts': '3_kanto',
  'hokuriku.ts': '4_hokuriku',
  'chubu.ts': '5_chubu',
  'kinki.ts': '6_kinki',
  'chugoku.ts': '7_chugoku',
  'shikoku.ts': '8_shikoku',
  'kyushu.ts': '9_kyushu',
  'okinawa.ts': '10_okinawa'
};

for (const [f, dir] of Object.entries(prefs)) {
  fs.writeFileSync('src/data/prefs/' + f, `export * from "./${dir}";\n`, 'utf8');
}

const regions = {
  'hokkaido.ts': '1_hokkaido',
  'tohoku.ts': '2_tohoku',
  'kanto.ts': '3_kanto',
  'hokuriku.ts': '4_hokuriku',
  'chubu.ts': '5_chubu',
  'kinki.ts': '6_kinki',
  'chugoku.ts': '7_chugoku',
  'shikoku.ts': '8_shikoku',
  'kyushu.ts': '9_kyushu',
  'okinawa.ts': '10_okinawa'
};

for (const [f, dir] of Object.entries(regions)) {
  fs.writeFileSync('src/data/regions/' + f, `export * from "./${dir}";\n`, 'utf8');
}

console.log('Compatibility proxies created successfully!');
