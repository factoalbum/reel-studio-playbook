// Minimal Chrome DevTools Protocol helper: starts headless Chrome and drives one tab (Node 22+ has WebSocket built in).
// Used to capture real website footage for the reels: real pages, real clicks and typing, screenshots of each state.
// Analytics and ad requests are blocked, so capture visits never show up in the website's statistics.
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const CHROME = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
export const BLOCK = [
  "*google-analytics.com*",
  "*googletagmanager.com*",
  "*doubleclick.net*",
  "*googlesyndication.com*",
  "*googleadservices.com*",
  "*/_vercel/insights*",
  "*/_vercel/speed-insights*",
  "*vercel-insights.com*",
  "*clarity.ms*",
];
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const KEYS = {
  Backspace: { code: "Backspace", vk: 8 },
  Enter: { code: "Enter", vk: 13 },
  Tab: { code: "Tab", vk: 9 },
};

export async function openChrome({ width = 1280, height = 800, scale = 2, mobile = false, port = 9333 } = {}) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "reel-capture-"));
  const proc = spawn(
    CHROME,
    ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "--mute-audio", `--window-size=${width},${height}`, "about:blank"],
    { stdio: "ignore" },
  );
  let target;
  for (let i = 0; i < 80 && !target; i++) {
    await sleep(250);
    try {
      target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page");
    } catch {
      // Chrome is still starting.
    }
  }
  if (!target) throw new Error("Chrome did not start");
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });
  let id = 0;
  const pending = new Map();
  const waiters = [];
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id) {
      const p = pending.get(m.id);
      pending.delete(m.id);
      if (p) m.error ? p.rej(new Error(`${p.method}: ${m.error.message}`)) : p.res(m.result);
      return;
    }
    for (const w of [...waiters]) {
      if (w.method === m.method) {
        waiters.splice(waiters.indexOf(w), 1);
        w.res(m.params);
      }
    }
  };
  const send = (method, params = {}) =>
    new Promise((res, rej) => {
      const i = ++id;
      pending.set(i, { res, rej, method });
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  const once = (method) => new Promise((res) => waiters.push({ method, res }));

  await send("Page.enable");
  await send("Network.enable");
  await send("Network.setBlockedURLs", { urls: BLOCK });
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: scale, mobile });

  const tab = {
    send,
    async goto(url, settle = 2000) {
      const loaded = once("Page.loadEventFired");
      await send("Page.navigate", { url });
      await loaded;
      await sleep(settle);
    },
    async eval(expression) {
      const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
      return r.result.value;
    },
    /** Viewport screenshot, or a region in page coordinates ({ x, y, w, h }, CSS pixels) rendered beyond the viewport. */
    async shot(file, clip) {
      const params = clip ? { format: "png", captureBeyondViewport: true, clip: { x: clip.x, y: clip.y, width: clip.w, height: clip.h, scale: 1 } } : { format: "png" };
      const { data } = await send("Page.captureScreenshot", params);
      fs.writeFileSync(file, Buffer.from(data, "base64"));
    },
    async move(x, y) {
      await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
    },
    async click(x, y) {
      await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
      await send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 });
      await send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 });
    },
    /** Types like a keyboard: one key press per character. */
    async type(text) {
      for (const ch of text) {
        await send("Input.dispatchKeyEvent", { type: "keyDown", key: ch, text: ch, unmodifiedText: ch });
        await send("Input.dispatchKeyEvent", { type: "keyUp", key: ch });
      }
    },
    async press(name, { selectAll = false } = {}) {
      const k = KEYS[name];
      await send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: name, code: k.code, windowsVirtualKeyCode: k.vk, ...(selectAll ? { commands: ["selectAll"] } : {}) });
      await send("Input.dispatchKeyEvent", { type: "keyUp", key: name, code: k.code, windowsVirtualKeyCode: k.vk });
    },
    async selectAll() {
      await send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: "a", code: "KeyA", windowsVirtualKeyCode: 65, modifiers: 2, commands: ["selectAll"] });
      await send("Input.dispatchKeyEvent", { type: "keyUp", key: "a", code: "KeyA", windowsVirtualKeyCode: 65, modifiers: 2 });
    },
    async close() {
      try {
        await send("Browser.close");
      } catch {
        // Already closed.
      }
      ws.close();
      proc.kill();
    },
  };
  return tab;
}
