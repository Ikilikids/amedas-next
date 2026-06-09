import fs from 'fs';
import path from 'path';

const inputDir = 'rawdata_csv';
const outputFile = 'all_station_stats.csv';

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.csv'));

console.log(`Consolidating ${files.length} files into one...`);

const header = 'id,hitemp_40,hitemp_35,hitemp_30,hitemp_25,hitemp_0,max_hitemp,max_hitemp_date,lwtemp_25,lwtemp_0,min_lwtemp,min_lwtemp_date,sm_rain,rain_7d,rain_15d';
const results = [header];

files.forEach(file => {
  const id = path.basename(file, '.csv');
  const filePath = path.join(inputDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(line => line.trim() !== '' && !line.startsWith('date,'));

  const counts = {
    hitemp_40: 0,
    hitemp_35: 0,
    hitemp_30: 0,
    hitemp_25: 0,
    hitemp_0: 0,
    lwtemp_25: 0,
    lwtemp_0: 0
  };
  
  let max_hitemp = -Infinity;
  let max_hitemp_date = '';
  let min_lwtemp = Infinity;
  let min_lwtemp_date = '';
  let sm_rain = 0;
  
  let hasHi = false;
  let hasLw = false;
  let hasRain = false;

  // For rolling rain calculation (assuming lines are sorted by date ascending)
  const rainValues = [];

  lines.forEach(line => {
    const [date, rainStr, hiStr, lwStr] = line.split(',');
    
    const rain = parseFloat(rainStr);
    const hi = parseFloat(hiStr);
    const lw = parseFloat(lwStr);

    if (!isNaN(hi)) {
      hasHi = true;
      if (hi >= 40.0) counts.hitemp_40++;
      if (hi >= 35.0) counts.hitemp_35++;
      if (hi >= 30.0) counts.hitemp_30++;
      if (hi >= 25.0) counts.hitemp_25++;
      if (hi <= 0.0) counts.hitemp_0++;
      if (hi > max_hitemp) {
        max_hitemp = hi;
        max_hitemp_date = date;
      }
    }

    if (!isNaN(lw)) {
      hasLw = true;
      if (lw >= 25.0) counts.lwtemp_25++;
      if (lw <= 0.0) counts.lwtemp_0++;
      if (lw < min_lwtemp) {
        min_lwtemp = lw;
        min_lwtemp_date = date;
      }
    }

    if (!isNaN(rain)) {
      hasRain = true;
      sm_rain += rain;
      rainValues.push(rain);
    } else {
      rainValues.push(0); // Treat missing as 0 for rolling sum, or null? 
    }
  });

  // Calculate rolling rain for the LAST 7 and 15 days
  let rain_7d = 0;
  let rain_15d = 0;
  if (hasRain) {
    const last7 = rainValues.slice(-7);
    const last15 = rainValues.slice(-15);
    rain_7d = last7.reduce((a, b) => a + b, 0);
    rain_15d = last15.reduce((a, b) => a + b, 0);
  }

  const row = [id];

  // Highest temp related
  if (hasHi) {
    row.push(counts.hitemp_40);
    row.push(counts.hitemp_35);
    row.push(counts.hitemp_30);
    row.push(counts.hitemp_25);
    row.push(counts.hitemp_0);
    row.push(max_hitemp.toFixed(1));
    row.push(max_hitemp_date);
  } else {
    row.push('--', '--', '--', '--', '--', '--', '--');
  }

  // Lowest temp related
  if (hasLw) {
    row.push(counts.lwtemp_25);
    row.push(counts.lwtemp_0);
    row.push(min_lwtemp.toFixed(1));
    row.push(min_lwtemp_date);
  } else {
    row.push('--', '--', '--', '--');
  }

  // Rain
  if (hasRain) {
    row.push(sm_rain.toFixed(1));
    row.push(rain_7d.toFixed(1));
    row.push(rain_15d.toFixed(1));
  } else {
    row.push('--', '--', '--');
  }

  results.push(row.join(','));
});

fs.writeFileSync(outputFile, results.join('\n'));
console.log(`Generated ${outputFile}`);
