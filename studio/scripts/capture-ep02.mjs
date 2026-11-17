// Episode 02 footage: the live Internet Toolbox homepage and GST calculator, captured in headless Chrome.
// Every image is a real screenshot of www.internetoolbox.com after real key presses and clicks.
// Writes public/ep02/*.png and src/episodes/reel02-capture.json (image sizes and element boxes, CSS pixels).
// Usage: node scripts/capture-ep02.mjs
import fs from "node:fs";
import { openChrome, sleep } from "./cdp.mjs";

const SITE = "https://www.internetoolbox.com";
const OUT = "public/ep02";
const SCALE = 2;
fs.mkdirSync(OUT, { recursive: true });
const data = { home: {}, gst: {} };

const BOXES = `(sel) => { const e = typeof sel === "string" ? document.querySelector(sel) : sel; if (!e) return null; const r = e.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height) }; }`;
const byText = (scope, tag, re) => `[...document.querySelectorAll(${JSON.stringify(scope)})].find(e => e.tagName === ${JSON.stringify(tag)} && ${re}.test(e.textContent.trim()))`;

// 1. Homepage: one tall screenshot from the top to the end of the popular tools, for the camera to scroll over.
{
  const tab = await openChrome({ width: 1280, height: 800, scale: SCALE });
  try {
    await tab.goto(`${SITE}/`, 2500);
    const boxes = await tab.eval(`(() => {
      const box = ${BOXES};
      const toolsHead = [...document.querySelectorAll("h2")].find(h => /Popular tools/.test(h.textContent));
      const ebookHead = [...document.querySelectorAll("h2")].find(h => /Ebook/.test(h.textContent));
      return {
        logo: box(document.querySelector('header a[href="/"]')),
        h1: box("h1"),
        count: box(${byText("main p, main span, main div", "P", "/92 free tools/")} ?? ${byText("main *", "SPAN", "/92 free tools/")}),
        browse: box(${byText("main a", "A", "/Browse all tools/")}),
        toolsHead: box(toolsHead),
        gstCard: box([...document.querySelectorAll('main a[href^="/tools/gst-calculator"]')].find(a => a.getBoundingClientRect().width > 0)),
        end: ebookHead ? Math.round(ebookHead.getBoundingClientRect().y + scrollY - 40) : 2100,
        countText: (document.body.innerText.match(/\\d+ free tools[^\\n]*/) || [""])[0],
      };
    })()`);
    const h = boxes.end;
    await tab.shot(`${OUT}/home.png`, { x: 0, y: 0, w: 1280, h });
    data.home = { shot: { file: "ep02/home.png", width: 1280, height: h }, ...boxes };
    console.log("home", JSON.stringify(data.home));
  } finally {
    await tab.close();
  }
}

// 2. GST calculator: a tall window so the title, the inputs and the results are on screen together.
{
  const tab = await openChrome({ width: 1280, height: 1460, scale: SCALE, port: 9334 });
  try {
    await tab.goto(`${SITE}/tools/gst-calculator/`, 2500);
    const box = (expr) => tab.eval(`(${BOXES})(${expr})`);
    const button = (text) => `[...document.querySelectorAll("main button")].find(b => b.innerText.trim() === ${JSON.stringify(text)})`;
    const centre = (b) => [b.x + b.w / 2, b.y + b.h / 2];
    const boxes = {
      h1: await box(`document.querySelector("h1")`),
      amount: await box(`document.querySelector('input[aria-label^="Amount"]')`),
      rate5: await box(button("5%")),
      rate18: await box(button("18%")),
      select: await box(`document.querySelector('[aria-label="GST rate"]')`),
      base: await box(`[...document.querySelectorAll("main p")].find(p => p.textContent.trim() === "Base amount")?.parentElement`),
      gstBox: await box(`[...document.querySelectorAll("main p")].find(p => p.textContent.trim() === "GST")?.parentElement`),
      total: await box(`[...document.querySelectorAll("main p")].find(p => p.textContent.trim() === "Total")?.parentElement`),
      card: await box(`[...document.querySelectorAll("main h2, main h3, main p")].find(e => /Use GST Calculator/.test(e.textContent))?.closest("section, div[class*=rounded]")`),
    };
    const states = [];
    const snap = async (name, note) => {
      const file = `${OUT}/gst-${name}.png`;
      await tab.shot(file);
      const shown = await tab.eval(`(() => ({ amount: document.querySelector('input[aria-label^="Amount"]').value, total: [...document.querySelectorAll("main p")].find(p => p.textContent.trim() === "Total")?.nextElementSibling?.textContent ?? null, rate: [...document.querySelectorAll("main button[aria-pressed=true]")].map(b => b.innerText.trim()).filter(s => /%$/.test(s))[0] ?? null }))()`);
      states.push({ name, file: `ep02/gst-${name}.png`, note, ...shown });
      console.log(name, JSON.stringify(shown));
    };
    // Start state: rate 5%, amount empty (what a visitor sees after clearing the field).
    await tab.click(...centre(boxes.rate5));
    await sleep(300);
    await tab.click(...centre(boxes.amount));
    await tab.selectAll();
    await tab.press("Backspace");
    await sleep(400);
    await snap("empty", "amount cleared, 5% selected");
    for (const [i, ch] of ["1", "0", "0", "0"].entries()) {
      await tab.type(ch);
      await sleep(350);
      await snap(`type${i + 1}`, `typed ${"1000".slice(0, i + 1)}`);
    }
    await tab.move(...centre(boxes.rate18));
    await sleep(350);
    await snap("hover18", "pointer over 18%");
    await tab.click(...centre(boxes.rate18));
    await sleep(500);
    await snap("rate18", "18% chosen");
    data.gst = { shot: { width: 1280, height: 1460 }, ...boxes, states };
  } finally {
    await tab.close();
  }
}

fs.writeFileSync("src/episodes/reel02-capture.json", JSON.stringify(data, null, 1));
console.log("saved src/episodes/reel02-capture.json");
