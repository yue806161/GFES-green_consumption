import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the green consumption platform", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>綠色消費平台<\/title>/i);
  assert.match(html, /讓每一次消費/);
  assert.match(html, /都成為土地向前的力量/);
  assert.match(html, /看見每一份綠色選擇背後的行動/);
  assert.match(html, /登入／體驗 Demo/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Building your site/i);
});

test("keeps the completed demo and consumer journeys wired", async () => {
  const [page, layout, demo, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/GreenPlatformDemo.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<GreenPlatformDemo \/>/);
  assert.match(layout, /default:\s*"綠色消費平台"/);
  assert.match(layout, /讓每一次消費，都成為土地向前的力量/);
  assert.match(demo, /function ConsumerOrdersPage/);
  assert.match(demo, /兌換訂單/);
  assert.match(demo, /receiptItems/);
  assert.match(demo, /了解更多完整故事/);
  assert.match(css, /\.order-layout/);
  assert.match(css, /\.receipt-more-button/);
  assert.match(packageJson, /vinext dev --port 4310 --strictPort/);

  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
  await assert.rejects(access(new URL("public/_sites-preview", templateRoot)));
});