import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const iconsDir = path.join(process.cwd(), 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="110" fill="#09090b" />
  <circle cx="256" cy="256" r="210" fill="#18181b" stroke="#3b82f6" stroke-width="4" stroke-opacity="0.3" />
  <rect x="120" y="120" width="272" height="272" rx="40" fill="#27272a" stroke="#60a5fa" stroke-width="6" />
  <path d="M190 260 L235 305 L325 210" fill="none" stroke="#60a5fa" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" />
  <circle cx="360" cy="150" r="16" fill="#10b981" />
  <text x="256" y="440" font-family="-apple-system, sans-serif" font-size="34" font-weight="800" fill="#f4f4f5" text-anchor="middle" letter-spacing="4">WORKOS</text>
</svg>
`;

async function main() {
  const buf = Buffer.from(svg);
  await sharp(buf).resize(192, 192).png().toFile(path.join(iconsDir, 'icon-192.png'));
  await sharp(buf).resize(512, 512).png().toFile(path.join(iconsDir, 'icon-512.png'));
  await sharp(buf).resize(180, 180).png().toFile(path.join(iconsDir, 'apple-touch-icon.png'));
  console.log('PWA icons generated successfully');
}
main();
