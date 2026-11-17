// Million Dollar Homepage reel: real screenshots of the live milliondollarhomepage.com, captured in headless Chrome.
// Writes public/mdh/real-top.png (header and the top of the pixel grid), public/mdh/real-grid.png (the full
// 1000x1000 grid) and src/episodes/mdh-capture.json (image sizes and the grid's box, CSS pixels).
// Usage: node scripts/capture-mdh.mjs
import fs from "node:fs";
import { openChrome } from "./cdp.mjs";

const SITE = "http://www.milliondollarhomepage.com/";
const OUT = "public/mdh";
fs.mkdirSync(OUT, { recursive: true });

const tab = await openChrome({ width: 1280, height: 900, scale: 2 });
try {
  await tab.goto(SITE, 6000);
  const info = await tab.eval(`(() => {
    const imgs = [...document.querySelectorAll("img")].map(i => ({ src: i.src, w: i.naturalWidth, h: i.naturalHeight, r: i.getBoundingClientRect() }));
    const grid = imgs.sort((a, b) => b.r.width * b.r.height - a.r.width * a.r.height)[0];
    return { title: document.title, url: location.href, grid: grid && { src: grid.src, w: grid.w, h: grid.h, x: Math.round(grid.r.x), y: Math.round(grid.r.y + scrollY), cw: Math.round(grid.r.width), ch: Math.round(grid.r.height) }, docH: document.documentElement.scrollHeight };
  })()`);
  console.log(JSON.stringify(info));
  const g = info.grid;
  await tab.shot(`${OUT}/real-top.png`, { x: 0, y: 0, w: 1280, h: 900 });
  await tab.shot(`${OUT}/real-grid.png`, { x: g.x, y: g.y, w: g.cw, h: g.ch });
  const data = {
    url: info.url,
    title: info.title,
    capturedOn: new Date().toISOString().slice(0, 10),
    top: { file: "mdh/real-top.png", width: 1280, height: 900 },
    grid: { file: "mdh/real-grid.png", width: g.cw, height: g.ch, inTop: { x: g.x, y: g.y, w: g.cw, h: g.ch } },
  };
  fs.writeFileSync("src/episodes/mdh-capture.json", JSON.stringify(data, null, 2));
} finally {
  await tab.close();
}
