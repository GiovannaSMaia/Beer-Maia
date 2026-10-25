// Local asset preparation: npm install --prefix .asset-tools pdfjs-dist @napi-rs/canvas
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createCanvas, DOMMatrix, ImageData, Path2D } from './.asset-tools/node_modules/@napi-rs/canvas/index.js';
Object.assign(globalThis, { DOMMatrix, ImageData, Path2D });
const { getDocument } = await import('./.asset-tools/node_modules/pdfjs-dist/legacy/build/pdf.mjs');
mkdirSync('images/labels', { recursive: true });
for (const [source, name] of [['RED ALE (1).pdf', 'red-ale'], ['PRETA.pdf', 'preta'], ['CERVEJA PESSEGO (1) (1).pdf', 'pessego']]) {
    const pdf = await getDocument({ data: new Uint8Array(readFileSync(source)), useSystemFonts: true }).promise;
    const page = await pdf.getPage(1);
    const original = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: 1600 / original.width });
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    const [x, y, width, height] = name === 'red-ale' ? [12, 31, 782, 524] : name === 'preta' ? [8, 16, 784, 517] : [16, 16, 784, 522];
    const label = createCanvas(width, height);
    label.getContext('2d').drawImage(canvas, x, y, width, height, 0, 0, width, height);
    writeFileSync(`images/labels/${name}.webp`, label.toBuffer('image/webp', 90));
    console.log(name, width, height);
    page.cleanup();
}
