import sharp from 'sharp';
import { readFileSync, writeFileSync, statSync, unlinkSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const kb = (p) => (statSync(p).size / 1024).toFixed(0);

// [input, output, maxWidth, quality, deleteInput?]
const jobs = [
  ['public/img/home-hero.jpg', 'public/img/home-hero.jpg', 1920, 70, false],
  ['public/img/tesseramento-bg.jpg', 'public/img/tesseramento-bg.jpg', 1920, 70, false],
  ['public/img/eventi/rottura-del-silenzio-27.jpg', 'public/img/eventi/rottura-del-silenzio-27.jpg', 1080, 78, false],
  ['public/img/eventi/end-of-impact-fest.jpg', 'public/img/eventi/end-of-impact-fest.jpg', 1080, 78, false],
  // venue photo: PNG -> JPG (much smaller for a photograph)
  ['public/img/ekidna-luogo.png', 'public/img/ekidna-luogo.jpg', 1600, 78, true],
];

for (const [inRel, outRel, maxW, quality, del] of jobs) {
  const inPath = resolve(root, inRel);
  const outPath = resolve(root, outRel);
  const before = kb(inPath);
  const buf = readFileSync(inPath);
  const out = await sharp(buf)
    .rotate()
    .resize({ width: maxW, withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true, progressive: true })
    .toBuffer();
  writeFileSync(outPath, out);
  if (del && inPath !== outPath) unlinkSync(inPath);
  console.log(`${outRel}: ${before}KB -> ${kb(outPath)}KB`);
}
