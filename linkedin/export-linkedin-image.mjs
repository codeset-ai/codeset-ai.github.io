/**
 * Export linkedin-blog-improving-claude-1080x1080.html to PNG.
 * Run: npx puppeteer scripts/export-linkedin-image.mjs
 */
import path from 'path';
import puppeteer from 'puppeteer';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname);
const htmlPath = path.join(
    root, 'linkedin', 'linkedin-blog-improving-claude-1080x1080.html');
const outPath =
    path.join(root, 'linkedin', 'linkedin-blog-improving-claude-1080x1080.png');

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({width: 1080, height: 1080, deviceScaleFactor: 1});
await page.goto(`file://${htmlPath}`, {waitUntil: 'networkidle0'});
await page.screenshot({path: outPath, type: 'png'});
await browser.close();
console.log('Saved:', outPath);
