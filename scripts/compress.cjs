const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');

const mediaDir = path.join(__dirname, '../public/media');
const MAX_SIZE = 24 * 1024 * 1024; // 24 MB limit

function processDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (stat.size > MAX_SIZE && fullPath.endsWith('.mp4')) {
      console.log(`Komprimuji: ${file} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
      const tempPath = fullPath + '.tmp.mp4';
      
      // Spuštění FFmpeg pro snížení kvality/velikosti
      execSync(`"${ffmpeg}" -y -i "${fullPath}" -vcodec libx264 -crf 30 -preset fast "${tempPath}"`, { stdio: 'inherit' });
      
      fs.unlinkSync(fullPath); // Smazání původního
      fs.renameSync(tempPath, fullPath); // Nahrazení zmenšeným
    }
  });
}

processDir(mediaDir);
console.log("Hotovo.");