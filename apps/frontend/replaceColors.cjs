const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace gradients with solid primary
      content = content.replace(/bg-gradient-to-[a-z]+ from-amber-[0-9]+ to-orange-[0-9]+/g, 'bg-primary');
      content = content.replace(/bg-gradient-to-[a-z]+ from-amber-[0-9]+ to-red-[0-9]+/g, 'bg-primary');
      content = content.replace(/hover:from-amber-[0-9]+ hover:to-orange-[0-9]+/g, 'hover:bg-primary/90');
      
      // Replace text gradients with solid primary
      content = content.replace(/bg-gradient-to-[a-z]+ from-amber-[0-9]+ to-orange-[0-9]+ bg-clip-text text-transparent/g, 'text-primary');

      // Replace amber/orange colors with primary
      content = content.replace(/amber-[0-9]+/g, 'primary');
      content = content.replace(/orange-[0-9]+/g, 'primary');
      
      // For text-slate-900 on primary backgrounds, we should use text-on-primary
      content = content.replace(/text-slate-900/g, 'text-on-primary');
      
      // Fix border and shadows
      content = content.replace(/border-primary\/30/g, 'border-primary');
      content = content.replace(/shadow-primary\/[0-9]+/g, 'shadow-primary/20');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir('/Users/macbook/Documents/Antigravity/Restaurante/restaurante/apps/frontend/src');
console.log("Colors replaced");
