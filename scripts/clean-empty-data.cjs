const fs = require('fs');
const path = require('path');

const dirs = ['data/ratio', 'data/table'];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (file.endsWith('.json')) {
      const filePath = path.join(dir, file);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        if (!content.trim()) return;
        const data = JSON.parse(content);
        let changed = false;
        for (const key in data) {
          if (Array.isArray(data[key])) {
            const isEmpty = data[key].every(item => 
              item !== null && 
              typeof item === 'object' && 
              Object.keys(item).length === 0
            );
            if (isEmpty && data[key].length > 0) {
              delete data[key];
              changed = true;
            }
          }
        }
        if (changed) {
          fs.writeFileSync(filePath, JSON.stringify(data));
          console.log(`Cleaned: ${filePath}`);
        }
      } catch (e) {
        console.error(`Error processing ${filePath}: ${e.message}`);
      }
    }
  });
});
