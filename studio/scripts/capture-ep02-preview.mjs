// Episode 02: ChatGPT's percentage calculator (public/ep02/chatgpt/percentage-calculator.html, unchanged)
// opened in headless Chrome, typed into and clicked. Each state is a real screenshot of the page.
// Writes public/ep02/chatgpt/preview-*.png and adds the boxes to src/episodes/reel02-capture.json.
// Usage: node scripts/capture-ep02-preview.mjs
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { openChrome, sleep } from "./cdp.mjs";

const DIR = "public/ep02/chatgpt";
const W = 720;
const H = 450;
const tab = await openChrome({ width: W, height: H, scale: 3, port: 9335 });
const states = [];
try {
  await tab.goto(pathToFileURL(path.resolve(DIR, "percentage-calculator.html")).href, 800);
  const box = (sel) => tab.eval(`(() => { const r = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; })()`);
  const boxes = { card: await box(".box"), percent: await box("#percent"), number: await box("#number"), button: await box("button"), result: await box("#result") };
  const centre = (b) => [b.x + b.w / 2, b.y + b.h / 2];
  const snap = async (name, note) => {
    await tab.shot(`${DIR}/preview-${name}.png`);
    const shown = await tab.eval(`({ percent: document.querySelector("#percent").value, number: document.querySelector("#number").value, result: document.querySelector("#result").textContent })`);
    states.push({ name, file: `ep02/chatgpt/preview-${name}.png`, note, ...shown });
    console.log(name, JSON.stringify(shown));
  };
  await tab.move(W - 20, H - 20);
  await snap("empty", "as opened");
  await tab.click(...centre(boxes.percent));
  await tab.type("18");
  await sleep(250);
  await snap("percent", "typed 18");
  await tab.click(...centre(boxes.number));
  await tab.type("1000");
  await sleep(250);
  await snap("number", "typed 1000");
  await tab.move(...centre(boxes.button));
  await sleep(250);
  await snap("hover", "pointer on Calculate");
  await tab.click(...centre(boxes.button));
  await sleep(300);
  await snap("result", "clicked Calculate");
  const file = "src/episodes/reel02-capture.json";
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.preview = { shot: { width: W, height: H }, ...boxes, states };
  fs.writeFileSync(file, JSON.stringify(data, null, 1));
} finally {
  await tab.close();
}
