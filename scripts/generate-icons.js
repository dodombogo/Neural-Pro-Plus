import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sizes = [192, 512];
const backgroundColor = '#111827';
const iconText = 'N+';

async function generateIcon(size) {
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${backgroundColor}"/>
      <text
        x="50%"
        y="50%"
        font-family="Arial, sans-serif"
        font-size="${size * 0.5}"
        font-weight="bold"
        fill="#60A5FA"
        text-anchor="middle"
        dominant-baseline="central"
      >${iconText}</text>
    </svg>
  `;

  const outputPath = path.join(process.cwd(), 'public', `icon-${size}.png`);
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);
  
  console.log(`Generated icon: ${outputPath}`);
}

// Create public directory if it doesn't exist
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Generate icons for all sizes
Promise.all(sizes.map(size => generateIcon(size)))
  .then(() => console.log('All icons generated successfully'))
  .catch(err => console.error('Error generating icons:', err)); 