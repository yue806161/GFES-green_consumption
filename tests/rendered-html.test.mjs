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
  assert.match(html, /讓每一次綠色行動/);
  assert.match(html, /都成為在地小農的力量/);
  assert.match(html, /看見每一份綠色選擇背後的行動/);
  assert.match(html, /登入／體驗 Demo/);
  assert.match(html, /綠色消費循環/);
  assert.doesNotMatch(html, /綠色信用|信用評分|融資|授信/);
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
  assert.match(layout, /把消費、低碳交通與電子帳單化為綠點/);
  assert.match(demo, /function ConsumerOrdersPage/);
  assert.match(demo, /兌換訂單/);
  assert.match(demo, /receiptItems/);
  assert.match(demo, /了解更多完整故事/);
  assert.match(demo, /銀行／政府／企業/);
  assert.match(demo, /提升企業形象/);
  assert.doesNotMatch(demo, /持續優化政策與企業激勵方案/);
  assert.match(demo, /附近小農/);
  assert.match(demo, /自備環保杯、餐具或購物袋等減塑行動/);
  assert.match(demo, /initialImprovementProjects/);
  assert.match(demo, /farmer-project-greenhouse-demo/);
  assert.match(demo, /requiredScore: 15000/);
  assert.match(demo, /\\u4f7f\\u7528\\u74b0\\u4fdd\\u676f/);
  assert.match(demo, /\u9084\u5dee \{gap\.toLocaleString\(\)\} \u9ede/);
  assert.match(demo, /台北市大安區/);
  assert.match(demo, /距離你約/);
  assert.match(demo, /商品管理/);
  assert.match(demo, /function saveFarmerProduct/);
  assert.match(demo, /function ProgramModal/);
  assert.match(demo, /function ImprovementProjectModal/);
  assert.match(demo, /function RoleCycleExplorer/);
  assert.match(demo, /cycle-direction-arrow-top-right[^>]*>↖/);
  assert.match(demo, /查看三方綠點循環/);
  assert.match(demo, /onMouseEnter=\{\(\) => setHoveredRole/);
  assert.match(demo, /function saveFarmerProject/);
  assert.match(demo, /FarmerProjectsPage/);
  assert.match(demo, /projects=\{availableLocalProjects\}/);
  assert.match(demo, /確認公開募資/);
  assert.match(demo, /function saveIncentivePlan/);
  assert.match(demo, /GFES_green_consumption_impact_summary_2026H1\.pdf/);
  assert.match(demo, /下載正式版 PDF/);
  assert.match(demo, /setIncentivePlans/);
  assert.match(demo, /programs\.length/);
  assert.match(demo, /儲存商品變更/);
  assert.match(demo, /確認上架新品/);
  assert.match(demo, /農業資源兌換/);
  assert.match(demo, /綠點激勵計畫/);
  assert.match(demo, /節能家電汰舊換新/);
  assert.match(demo, /每件 600 點/);
  assert.match(demo, /成果透明度/);
  assert.doesNotMatch(demo, /綠色信用|信用評分|融資|授信|金融合作機構/);
  assert.match(css, /\.order-layout/);
  assert.match(css, /\.role-cycle-node\.dimmed/);
  assert.match(css, /@keyframes role-cycle-spin-counterclockwise \{ to \{ transform: rotate\(-360deg\); \} \}/);
  assert.match(css, /\.cycle-section-heading h2 \{ white-space: nowrap/);
  assert.match(css, /\.role-cycle-node strong \{[^}]*font-size: 21px/);
  assert.match(css, /\.role-cycle-detail-grid li \{[^}]*font-size: 16px/);
  assert.match(css, /\.device-preview-mobile \.cycle-section-heading h2 \{[^}]*white-space: normal/);
  assert.match(css, /\.device-preview-mobile \.role-cycle-stage \{[^}]*display: grid/);
  assert.match(css, /\.device-preview-mobile \.role-cycle-node,[\s\S]*?width: 100%/);
  assert.match(css, /\.device-preview-mobile \.role-cycle-detail-grid \{ grid-template-columns: 1fr; \}/);
  assert.match(css, /content: "\\7DA0\\9EDE\\6D41\\5411"/);
  assert.match(css, /\.cycle-link-support \{ left: 50%; bottom: 74px/);
  assert.match(css, /\.cycle-direction-arrow \{ display: none; \}/);
  assert.match(css, /content: "\\2193"/);
  assert.doesNotMatch(css, /content: "\?+/);
  assert.match(css, /\.receipt-more-button/);
  assert.match(demo, /dashboard-device-preview/);
  assert.match(demo, /dashboard-device-toggle/);
  assert.match(demo, /mobile-nav-institution/);
  assert.match(css, /\.dashboard-shell \.mobile-nav-institution \{ grid-template-columns: repeat\(4/);
  assert.match(css, /\.dashboard-shell \.mobile-nav \{[^}]*background: linear-gradient\(145deg, #12382a, #08251b\)/);
  assert.match(css, /\.dashboard-device-preview \.mobile-nav \{ position: fixed/);
  assert.match(demo, /mobile-card-table orders-table/);
  assert.match(css, /@container dashboard-shell \(max-width: 780px\)/);
  assert.match(css, /\.mobile-card-table td::before \{ content: none; \}/);
  assert.match(css, /\.dashboard-shell \.metrics \{ grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(packageJson, /vinext dev --port 4310 --strictPort/);

  await access(new URL("../public/reports/GFES_green_consumption_impact_summary_2026H1.pdf", import.meta.url));
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
  await assert.rejects(access(new URL("public/_sites-preview", templateRoot)));
});