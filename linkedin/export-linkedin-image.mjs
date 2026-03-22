/**
 * Export a 1080×1080 LinkedIn HTML asset to PNG (Puppeteer).
 * Run from repo root:
 *   node linkedin/export-linkedin-image.mjs
 *   node linkedin/export-linkedin-image.mjs
 * linkedin/linkedin-agent-context-1080x1080.html
 */
import path from 'path';
import puppeteer from 'puppeteer';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const defaultHtml = 'linkedin/linkedin-blog-improving-claude-1080x1080.html';
const defaultPng = 'linkedin/linkedin-blog-improving-claude-1080x1080.png';

const htmlRel = process.argv[2] || defaultHtml;
const outRel = process.argv[3] || htmlRel.replace(/\.html$/i, '.png');

const htmlPath = path.join(repoRoot, htmlRel);
const outPath = path.join(repoRoot, outRel);

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({width: 1080, height: 1080, deviceScaleFactor: 1});
await page.goto(`file://${htmlPath}`, {waitUntil: 'networkidle0'});
await page.screenshot({path: outPath, type: 'png'});
await browser.close();
console.log('Saved:', outPath);
