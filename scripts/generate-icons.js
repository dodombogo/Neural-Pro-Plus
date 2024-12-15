import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sizes = [192, 512];
const backgroundColor = '#111827';

// Neural Pro+ logo SVG
const generateLogoSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Background Circle -->
  <circle cx="50" cy="50" r="45" fill="${backgroundColor}"/>
  
  <!-- Neural Network Lines -->
  <g stroke="#60A5FA" stroke-opacity="0.5" stroke-width="2">
    <path d="M30 30 L50 50 L70 30"/>
    <path d="M30 50 L50 50 L70 50"/>
    <path d="M30 70 L50 50 L70 70"/>
  </g>

  <!-- Neural Network Nodes -->
  <g>
    <circle cx="30" cy="30" r="4" fill="#60A5FA"/>
    <circle cx="30" cy="50" r="4" fill="#60A5FA"/>
    <circle cx="30" cy="70" r="4" fill="#60A5FA"/>
    <circle cx="50" cy="50" r="6" fill="#3B82F6"/>
    <circle cx="70" cy="30" r="4" fill="#60A5FA"/>
    <circle cx="70" cy="50" r="4" fill="#60A5FA"/>
    <circle cx="70" cy="70" r="4" fill="#60A5FA"/>
  </g>

  <!-- Outer Ring -->
  <circle cx="50" cy="50" r="45" stroke="#60A5FA" stroke-width="2" fill="none"/>
</svg>
`;

async function generateIcon(size) {
  const svg = generateLogoSVG(size);
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