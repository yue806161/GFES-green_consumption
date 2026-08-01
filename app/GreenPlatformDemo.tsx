"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Banknote,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  FileCheck2,
  HandCoins,
  HeartHandshake,
  Home,
  Leaf,
  LockKeyhole,
  LogOut,
  Monitor,
  PackageCheck,
  Receipt,
  RefreshCcw,
  ScanLine,
  ShoppingBasket,
  Smartphone,
  Sprout,
  Store,
  Truck,
  Trees,
  TrendingUp,
  Upload,
  User,
  Users,
  X,
} from "lucide-react";

type Role = "consumer" | "farmer" | "institution";
type Modal =
  | null
  | "login"
  | "invoice"
  | "support"
  | "redeem"
  | "receipt"
  | "evidence"
  | "offer"
  | "portfolio"
  | "story"
  | "farmer-detail"
  | "local-story";

const roles = {
  consumer: {
    label: "消費者",
    account: "林子晴",
    description: "回傳消費證明、累積綠點並支持小農",
    icon: User,
  },
  farmer: {
    label: "小農",
    account: "禾日友善農園",
    description: "管理永續資料、綠色信用與資源媒合",
    icon: Sprout,
  },
  institution: {
    label: "金融合作機構",
    account: "綠色金融合作中心",
    description: "掌握農戶信用、資金流向與影響成果",
    icon: Building2,
  },
} satisfies Record<Role, { label: string; account: string; description: string; icon: typeof User }>;

const pointTrend = [
  { month: "2月", points: 180 },
  { month: "3月", points: 260 },
  { month: "4月", points: 220 },
  { month: "5月", points: 360 },
  { month: "6月", points: 430 },
  { month: "7月", points: 510 },
];

const fundTrend = [
  { month: "2月", funds: 168 },
  { month: "3月", funds: 205 },
  { month: "4月", funds: 244 },
  { month: "5月", funds: 278 },
  { month: "6月", funds: 326 },
  { month: "7月", funds: 386 },
];

const baseDimensions = [
  { name: "友善耕作", score: 88 },
  { name: "循環回收", score: 76 },
  { name: "低碳作業", score: 72 },
  { name: "資訊透明", score: 86 },
  { name: "地方共好", score: 90 },
];

const farmers = [
  { name: "禾日友善農園", area: "雲林", crop: "葉菜", score: 86, status: "審核中", amount: "68 萬", purpose: "節水灌溉設備", completeness: 100 },
  { name: "青谷稻作", area: "嘉義", crop: "稻米", score: 91, status: "已媒合", amount: "120 萬", purpose: "低碳烘穀設備", completeness: 96 },
  { name: "山里果園", area: "花蓮", crop: "果樹", score: 79, status: "待補件", amount: "36 萬", purpose: "太陽能冷藏", completeness: 72 },
  { name: "暖田蔬果", area: "彰化", crop: "蔬果", score: 84, status: "已媒合", amount: "52 萬", purpose: "循環包材與冷鏈", completeness: 92 },
];

const fundingOffers = [
  {
    id: "starter",
    category: "資金支持",
    name: "綠色起步配對金",
    amount: "最高 10 萬",
    term: "6–12 個月",
    rate: "成果核銷・免還款",
    description: "協助剛開始累積永續資料的小農，添購紀錄工具、友善資材與小型節水設施。",
    purpose: "友善資材、紀錄工具、小型節水設施",
    suggestedAmount: "80000",
    suggestedLabel: "8 萬元",
    paymentLabel: "依成果分期核銷",
    planText: "預計添購土壤濕度計、田間紀錄工具及友善防治資材，建立可追溯的生產基礎。",
    requiredScore: 70,
  },
  {
    id: "local",
    category: "優惠融資",
    name: "地方創生週轉支持",
    amount: "最高 30 萬",
    term: "最長 2 年",
    rate: "Demo 年利率 1.68% 起",
    description: "支應種苗、友善資材、循環包裝及採收旺季週轉，協助穩定接單與在地供應。",
    purpose: "友善資材、循環包材、季節性營運週轉",
    suggestedAmount: "240000",
    suggestedLabel: "24 萬元",
    paymentLabel: "約 10,300 元／月",
    planText: "預計補充友善資材與循環包裝，並支應採收旺季的短期人力與冷鏈週轉。",
    requiredScore: 75,
  },
  {
    id: "equipment",
    category: "優惠融資",
    name: "綠色設備改善方案",
    amount: "最高 80 萬",
    term: "最長 5 年",
    rate: "Demo 年利率 1.38% 起",
    description: "投入節水灌溉、節能冷藏、低碳農機與能源管理設備，改善效率並降低長期成本。",
    purpose: "節水、節能、低碳農機與冷鏈設備",
    suggestedAmount: "680000",
    suggestedLabel: "68 萬元",
    paymentLabel: "約 11,900 元／月",
    planText: "預計汰換老舊灌溉管線，導入分區滴灌與智慧控制器，降低用水並穩定產量。",
    requiredScore: 80,
    recommended: true,
  },
  {
    id: "resilience",
    category: "資金支持",
    name: "低碳韌性改善獎勵",
    amount: "最高 50 萬",
    term: "成果期 18 個月",
    rate: "最高配對支持 40%",
    description: "支持防災設施、雨水回收、土壤改善及氣候調適，依里程碑核銷配對資金。",
    purpose: "防災、雨水回收、土壤與氣候調適",
    suggestedAmount: "400000",
    suggestedLabel: "40 萬元",
    paymentLabel: "預估配對支持 16 萬",
    planText: "預計建置雨水回收槽、田區排水與土壤保水措施，降低極端氣候造成的生產風險。",
    requiredScore: 88,
  },
  {
    id: "upgrade",
    category: "優惠融資",
    name: "永續轉型升級方案",
    amount: "最高 150 萬",
    term: "最長 7 年",
    rate: "Demo 專案評估利率",
    description: "支持智慧農業、再生能源、加工與產銷設備升級，擴大長期永續生產與地方就業。",
    purpose: "智慧農業、再生能源、加工與產銷升級",
    suggestedAmount: "1200000",
    suggestedLabel: "120 萬元",
    paymentLabel: "約 17,600 元／月",
    planText: "預計導入智慧環控、太陽能與產地初級加工設備，提升品質穩定度並擴大在地雇用。",
    requiredScore: 90,
  },
] as const;

const localProjects = [
  {
    id: "water",
    kind: "support" as const,
    image: "https://images.pexels.com/photos/35834140/pexels-photo-35834140.jpeg?auto=compress&cs=tinysrgb&w=500",
    title: "阿蘭・禾日友善農園｜節水灌溉改善",
    farmer: "阿蘭｜禾日友善農園",
    note: "更換滴灌管線與智慧控制器，預估降低 18% 農業用水。",
    purpose: "灌溉管線與節水控制器",
    points: 300,
    progress: 78,
    impact: "用水效率提升 18%",
  },
  {
    id: "rice",
    kind: "support" as const,
    image: "/projects/zhiming-rice-habitat.webp",
    title: "志明・青谷稻作｜友善稻田生態復育",
    farmer: "志明｜青谷稻作",
    note: "建立田埂棲地與減藥示範區，讓稻田兼顧生產與生物多樣性。",
    purpose: "生態田埂與減藥資材",
    points: 220,
    progress: 61,
    impact: "新增 1.2 公頃友善棲地",
  },
  {
    id: "solar-cold",
    kind: "support" as const,
    image: "https://images.pexels.com/photos/2132171/pexels-photo-2132171.jpeg?auto=compress&cs=tinysrgb&w=500",
    title: "美珍・山里果園｜太陽能冷藏設備",
    farmer: "美珍｜山里果園",
    note: "汰換高耗能冷藏櫃並導入太陽能，降低鮮果損耗與用電成本。",
    purpose: "節能冷藏櫃與太陽能設備",
    points: 360,
    progress: 46,
    impact: "採後損耗預估降低 22%",
  },
  {
    id: "circular-pack",
    kind: "support" as const,
    image: "/projects/shufen-circular-crates.webp",
    title: "淑芬・暖田蔬果｜循環包材導入",
    farmer: "淑芬｜暖田蔬果",
    note: "導入可重複使用的產地周轉箱，減少一次性紙箱與塑膠緩衝材。",
    purpose: "循環周轉箱與回收清洗",
    points: 180,
    progress: 69,
    impact: "每年減少約 1,800 個紙箱",
  },
  {
    id: "pollinator",
    kind: "support" as const,
    image: "https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg?auto=compress&cs=tinysrgb&w=500",
    title: "雅惠・溪畔香草園｜授粉棲地營造",
    farmer: "雅惠｜溪畔香草園",
    note: "在田區邊界種植蜜源植物，建立友善蜂類與昆蟲的微型棲地。",
    purpose: "原生蜜源植物與棲地維護",
    points: 160,
    progress: 52,
    impact: "新增 600 平方公尺授粉棲地",
  },
  {
    id: "veggie",
    kind: "redeem" as const,
    image: "https://images.pexels.com/photos/8232776/pexels-photo-8232776.jpeg?auto=compress&cs=tinysrgb&w=500",
    title: "淑芬・暖田蔬果｜當季友善蔬菜箱",
    farmer: "淑芬｜暖田蔬果",
    note: "六種當季蔬菜，由產地採收後以循環箱低溫直送。",
    purpose: "產地冷藏直送",
    points: 480,
    progress: 64,
    impact: "支持 3 戶在地小農",
  },
  {
    id: "rice-box",
    kind: "redeem" as const,
    image: "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=500",
    title: "志明・青谷稻作｜友善耕作米食禮盒",
    farmer: "志明｜青谷稻作",
    note: "包含友善米、米餅與產地故事卡，採減塑包裝配送。",
    purpose: "常溫宅配",
    points: 420,
    progress: 72,
    impact: "支持友善稻作 6 公斤",
  },
  {
    id: "fruit-box",
    kind: "redeem" as const,
    image: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=500",
    title: "美珍・山里果園｜低碳鮮果分享箱",
    farmer: "美珍｜山里果園",
    note: "依當週熟度搭配三款鮮果，以格外果加工品補足箱內內容。",
    purpose: "低溫產地直送",
    points: 560,
    progress: 58,
    impact: "提升格外果利用率 15%",
  },
  {
    id: "herbal-tea",
    kind: "redeem" as const,
    image: "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=500",
    title: "雅惠・溪畔香草園｜無毒香草茶組",
    farmer: "雅惠｜溪畔香草園",
    note: "以自然乾燥的薄荷、香蜂草與迷迭香，組成三款產地茶包。",
    purpose: "常溫減塑配送",
    points: 260,
    progress: 83,
    impact: "支持 120 平方公尺友善香草田",
  },
  {
    id: "veggie-meal",
    kind: "redeem" as const,
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500",
    title: "阿蘭・禾日友善農園｜產地蔬食料理包",
    farmer: "阿蘭｜禾日友善農園",
    note: "將當季葉菜與根莖整理成兩人份料理組，附上小農家常食譜。",
    purpose: "冷藏循環箱配送",
    points: 340,
    progress: 67,
    impact: "減少產地蔬菜耗損 12%",
  },
] as const;

type LocalProject = (typeof localProjects)[number];

function getReceiptNumber(item: LocalProject) {
  const index = Math.max(localProjects.findIndex((project) => project.id === item.id), 0);
  return `GI-20260731-${String(186 + index).padStart(4, "0")}`;
}

const localProjectStories = {
  water: {
    location: "雲林・西螺",
    headline: "阿蘭想把每一滴水，用在作物真正需要的地方",
    quote: "以前只能靠經驗估算，現在我想讓灌溉更精準，也把省下來的水留下紀錄。",
    paragraphs: [
      "阿蘭每天清晨巡田，最先看的不是葉片，而是土壤濕度與舊管線的漏水位置。夏季水源吃緊時，她常得提早開泵，卻仍難確定每一區是否得到足夠灌溉。",
      "這次專案將田區分成四個灌溉區，搭配滴灌控制器與用水紀錄。綠點支持會優先投入管線、控制器與安裝，完成後再以每月用水量驗證改善成果。",
    ],
  },
  rice: {
    location: "嘉義・太保",
    headline: "志明讓稻田不只收成，也重新成為生物的家",
    quote: "田裡多一隻青蛙、多一種水鳥，對我來說都是友善耕作有回應。",
    paragraphs: [
      "志明接手家中稻田後，開始保留部分田埂植被，也減少非必要用藥。但田區缺少連續棲地，改善成果很難長期維持。",
      "專案會建立生態田埂、淺水區與減藥示範田，並以定期物種觀察留下紀錄。消費者支持的綠點，會成為苗木、友善資材與田區維護的人力。",
    ],
  },
  "solar-cold": {
    location: "花蓮・壽豐",
    headline: "美珍想讓好不容易種出的鮮果，不再敗給高溫與等待",
    quote: "果子成熟後，每多等一天都是風險；冷藏穩定，農人的努力才能完整送到消費者手上。",
    paragraphs: [
      "美珍的果園離主要集貨點較遠，採收旺季常因冷藏空間不足而增加損耗。老舊冰櫃耗電，也無法穩定維持適合鮮果的溫度。",
      "她計畫汰換節能冷藏設備，並以太陽能分擔白天用電。平台將持續記錄耗電與損耗率，讓設備改善成為可驗證的綠色信用成果。",
    ],
  },
  "circular-pack": {
    location: "彰化・溪州",
    headline: "淑芬從一只周轉箱開始，減少產地每天堆起的包材",
    quote: "蔬菜被好好送到餐桌很重要，但包裝不該在送達後立刻變成垃圾。",
    paragraphs: [
      "淑芬每天出貨都要使用大量紙箱與塑膠緩衝材，雨季時紙箱更容易受潮報廢。她和固定通路討論後，決定建立可回收的周轉箱系統。",
      "綠點將支持第一批循環箱、清洗設備與回收標示。每次回收都會形成紀錄，讓消費者看見一只箱子被重複使用了多少次。",
    ],
  },
  pollinator: {
    location: "苗栗・卓蘭",
    headline: "雅惠在香草田邊，替蜜蜂留下一條回家的路",
    quote: "授粉昆蟲願意回來，代表這塊田不只對作物友善，也對周邊生命友善。",
    paragraphs: [
      "雅惠觀察到田邊的蜂類逐年減少，因此開始保留雜草帶並種植原生蜜源植物。單一小區的改善有限，她希望把棲地延伸成連續廊道。",
      "專案將補植不同花期的蜜源植物，設置飲水點並進行季節觀察。成果會以棲地面積、開花期與授粉昆蟲紀錄回傳平台。",
    ],
  },
  veggie: {
    location: "彰化・溪州",
    headline: "淑芬把當週最好吃的六種蔬菜，裝進一只循環箱",
    quote: "蔬菜箱不是把剩下的菜湊在一起，而是讓大家跟著土地吃當季。",
    paragraphs: [
      "每週採收前，淑芬會依成熟度安排蔬菜箱內容，讓葉菜、瓜果與根莖保持平衡。遇到天候變化，她也會附上產地說明與替代料理建議。",
      "這份蔬菜箱採循環箱配送，消費者下一次取貨時可交回。綠點兌換會直接形成在地訂單，也支持農園維持友善資材與穩定雇工。",
    ],
  },
  "rice-box": {
    location: "嘉義・太保",
    headline: "志明把一季稻作的風土，做成可以分享的米食禮盒",
    quote: "我希望大家收到的不只是一包米，還能知道這塊田怎麼被照顧。",
    paragraphs: [
      "志明挑選友善耕作批次製作白米與米餅，並把田區、收穫日期與生態觀察寫進故事卡。包材則盡量減少塑膠與不必要隔層。",
      "每次兌換都對應到清楚的生產批次。消費者能從故事卡回到平台查看耕作紀錄，讓一份禮盒同時支持生產與資訊透明。",
    ],
  },
  "fruit-box": {
    location: "花蓮・壽豐",
    headline: "美珍讓外表不完美的果實，也能找到珍惜它的人",
    quote: "格外果不是不好吃，只是它需要一條不同的路走到消費者手上。",
    paragraphs: [
      "果園每季都有部分鮮果因外觀或尺寸無法進入一般通路。美珍把適合鮮食的果實放入分享箱，其餘則製成果乾與果醬。",
      "低碳鮮果箱依成熟批次出貨，減少長時間庫存。兌換形成的訂單能提高格外果利用，也降低農園在盛產期的損耗。",
    ],
  },
  "herbal-tea": {
    location: "苗栗・卓蘭",
    headline: "雅惠用低溫慢慢乾燥，留住香草最自然的氣味",
    quote: "不急著把水分烘走，香草的味道反而更完整，也能少用一些能源。",
    paragraphs: [
      "雅惠在清晨採收薄荷、香蜂草與迷迭香，完成挑選後以自然通風搭配低溫乾燥，保留香氣並降低耗能。",
      "每組茶包都標示採收批次與沖泡方式，包裝使用減塑材料。綠點兌換讓小量、多樣的香草生產能維持合理收入。",
    ],
  },
  "veggie-meal": {
    location: "雲林・西螺",
    headline: "阿蘭把田裡剛好的份量，變成回家就能料理的一餐",
    quote: "如果處理方式更方便，大家會願意多吃一點當季蔬菜，也能減少田裡的耗損。",
    paragraphs: [
      "阿蘭將規格不同但品質良好的蔬菜整理、清洗並搭配成兩人份料理包，再附上農家常做的簡單食譜。",
      "料理包以當週收成彈性調整，不追求固定菜色。兌換所得支持採後整理與冷藏，也讓更多蔬菜在最佳狀態進入家庭餐桌。",
    ],
  },
} as const;

const cycle = [
  ["綠色消費", "購買小農與符合資格的綠色商品", ShoppingBasket],
  ["取得綠點", "合作通路發放，或回傳消費證明", Receipt],
  ["支持或兌換", "投入改善專案，或兌換小農商品", HandCoins],
  ["改善生產", "升級設備、耕作與循環生產方式", Sprout],
  ["提升信用", "永續成果累積為可信的綠色信用", BadgeCheck],
  ["金融投入", "資源回到地方，擴大綠色消費選擇", Building2],
] as const;

const stories = [
  {
    id: "daily-farming",
    label: "小農工作現場",
    title: "把友善耕作，落實在每一天的田間管理",
    cover: "https://images.pexels.com/photos/35834140/pexels-photo-35834140.jpeg?auto=compress&cs=tinysrgb&w=1400",
    detail: "/stories/friend-farming-detail.webp",
    detailAlt: "阿蘭在同一座溫室檢查滴灌管線並記錄作物狀況",
    person: "阿蘭",
    place: "禾日友善農園・雲林",
    intro: "友善耕作不是一次性的認證，而是每天巡田、調整用水、留下紀錄的累積。",
    quote: "把每次觀察寫下來，才知道土地真的往哪裡改變。",
    paragraphs: [
      "天剛亮，阿蘭先巡過每一排蔬菜。她不只看葉色與蟲害，也檢查滴灌壓力、土壤濕度和前一天的用水量。這些細小但固定的工作，慢慢形成可追溯的永續生產資料。",
      "當設備改善前後的差異被記錄，平台就能把田間行動轉成綠色信用。消費者支持的不只是眼前的一把青菜，也是在幫助農園持續採用更省水、更穩定的生產方式。",
    ],
    metrics: [["18%", "預估節水"], ["4 分", "信用提升"], ["100%", "生產可追溯"]],
    steps: [["看見問題", "灌溉用水不易精準控制"], ["採取行動", "分區滴灌並每日留下紀錄"], ["成果回寫", "驗證節水成果並更新綠色信用"]],
  },
  {
    id: "green-equipment",
    label: "綠色生產",
    title: "更好的設備，帶來更穩定的收成",
    cover: "https://images.pexels.com/photos/11678438/pexels-photo-11678438.jpeg?auto=compress&cs=tinysrgb&w=1000",
    detail: "/stories/green-equipment-detail.webp",
    detailAlt: "志明與採收班在田間檢查同一台綠色採收設備",
    person: "志明與採收班",
    place: "青禾農場・嘉義",
    intro: "設備升級的目的不是追求更大規模，而是降低耗損、改善工作負擔，讓好品質能穩定留下。",
    quote: "機器幫我們省下的，不只是時間，也讓每一批收成都更完整。",
    paragraphs: [
      "過去採收旺季全靠人力追趕，遇到天候變化時，常來不及在最佳時間完成。團隊先記錄損耗、油耗與作業時間，再選擇適合田區規模的採收設備，而不是直接購入最大機型。",
      "這份改善計畫成為資金申請的具體用途。金融機構能看到預估效益、設備報價和綠色信用，農戶也能用後續生產資料回報設備是否真的發揮作用。",
    ],
    metrics: [["12%", "降低採收耗損"], ["23%", "縮短作業時間"], ["80 萬", "可媒合額度"]],
    steps: [["盤點需求", "記錄旺季工時與採收耗損"], ["媒合設備", "以綠色信用申請改善資金"], ["持續驗證", "回報油耗、產量與品質變化"]],
  },
  {
    id: "green-credit",
    label: "綠色金融",
    title: "讓信用來自真實的永續行動",
    cover: "https://images.pexels.com/photos/18703337/pexels-photo-18703337.jpeg?auto=compress&cs=tinysrgb&w=1000",
    detail: "/stories/green-credit-detail.webp",
    detailAlt: "淑芬在同一條灌溉水道測量水位並記錄數據",
    person: "淑芬",
    place: "清泉農園・花蓮",
    intro: "當用水、設備與耕作成果有資料可驗證，小農長期的努力就能成為金融機構看得懂的信用依據。",
    quote: "以前只能說我們很努力，現在可以把改變一筆一筆證明出來。",
    paragraphs: [
      "淑芬每週量測灌溉水位與作物狀態，累積成一份完整的用水紀錄。平台把紀錄完整度、改善幅度與產銷透明度納入評估，而不是只看傳統財務資料。",
      "完成設備證明後，她的綠色信用由 82 分提升到 86 分，也解鎖更合適的設備改善方案。金融資源因此能與真實永續行動連在一起。",
    ],
    metrics: [["42 筆", "水資源紀錄"], ["82→86", "綠色信用"], ["68 萬", "建議申請額"]],
    steps: [["持續記錄", "量測用水與設備運作狀況"], ["資料驗證", "確認紀錄來源與改善幅度"], ["信用媒合", "更新分數並推薦合適資金"]],
  },
  {
    id: "visible-impact",
    label: "地方共好",
    title: "一點一履歷，支持成果清楚可見",
    cover: "https://images.pexels.com/photos/8232776/pexels-photo-8232776.jpeg?auto=compress&cs=tinysrgb&w=1000",
    detail: "/stories/local-impact-detail.webp",
    detailAlt: "美惠在同一座藤蔓農場用手機記錄作物成果",
    person: "美惠",
    place: "暖田蔬果・彰化",
    intro: "消費者投入的每一筆綠點，都會留下支持對象、資源用途、專案進度與預估成果。",
    quote: "有人看見我們做的改變，我們也更願意把過程完整留下來。",
    paragraphs: [
      "美惠把作物照片、資材使用和採收批次上傳平台。消費者支持後，不只收到一張感謝訊息，而是能持續看到資源用在哪裡、專案完成到哪一步。",
      "當成果被驗證，資料會同步更新小農的綠色信用，也成為合作機構的影響力報告。支持、成果與下一輪資金因此形成循環。",
    ],
    metrics: [["12,680", "累積支持綠點"], ["86 張", "影響力收據"], ["15%", "資源效率提升"]],
    steps: [["綠點投入", "消費者選擇支持改善專案"], ["進度追蹤", "小農回傳採購與執行紀錄"], ["成果公開", "產生收據並回寫綠色信用"]],
  },
  {
    id: "start-cycle",
    label: "現在開始",
    title: "從一塊田開始，走進綠色循環",
    cover: "https://images.pexels.com/photos/9448904/pexels-photo-9448904.jpeg?auto=compress&cs=tinysrgb&w=1000",
    detail: "/stories/start-cycle-detail.webp",
    detailAlt: "鳳珠沿著同一片梯田行走並帶著準備種植的幼苗",
    person: "鳳珠",
    place: "山里梯田・花蓮",
    intro: "不論從消費、小農生產或金融合作開始，每一個角色都能讓地方的改變多走一步。",
    quote: "一開始只想把田顧好，後來才發現，每份紀錄都能為下一步多開一扇門。",
    paragraphs: [
      "鳳珠從三塊梯田的生產紀錄開始，把耕作方式、資材與收成一一整理。當資料逐漸完整，她能看見自己的改善方向，也更容易向合作機構說明資金真正要解決的問題。",
      "綠色循環不要求一次做到完美。消費者的一次支持、小農的一筆紀錄、金融機構的一次媒合，都能成為地方持續前進的起點。",
    ],
    metrics: [["3 塊", "示範田區"], ["6 個月", "改善週期"], ["75 分", "首項方案門檻"]],
    steps: [["選擇角色", "從消費者、小農或金融端開始"], ["完成行動", "回傳證明、補充資料或媒合資源"], ["形成循環", "成果回到信用並創造更多綠色選擇"]],
  },
] as const;

const heroSlides = [
  {
    image: "https://images.pexels.com/photos/35834141/pexels-photo-35834141.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "農人在友善耕作的蔬菜田中工作",
    label: "小農工作現場",
    title: "友善耕作，從每日田間管理開始",
  },
  {
    image: "https://images.pexels.com/photos/11678438/pexels-photo-11678438.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "小農檢視田間作物與生產設備",
    label: "綠色生產",
    title: "改善設備，讓收成與環境一起變好",
  },
  {
    image: "https://images.pexels.com/photos/18703337/pexels-photo-18703337.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "農業生產成果與永續行動紀錄",
    label: "綠色金融",
    title: "真實永續行動，累積可信的綠色信用",
  },
  {
    image: "https://images.pexels.com/photos/8232776/pexels-photo-8232776.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "在地農產與地方小農的生產成果",
    label: "地方共好",
    title: "每一點支持，都留下看得見的成果",
  },
] as const;

function Brand() {
  return (
    <span className="brand">
      <span className="brand-mark"><Leaf /></span>
      綠色消費平台
    </span>
  );
}

function ModalShell({
  title,
  onClose,
  children,
  small = false,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  small?: boolean;
  wide?: boolean;
}) {
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className={`modal ${small ? "modal-small" : ""} ${wide ? "modal-wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="關閉"><X /></button>
        </header>
        <div className="modal-body">{children}</div>
      </section>
    </div>
  );
}

export function GreenPlatformDemo() {
  const [screen, setScreen] = useState<"home" | "dashboard">("home");
  const [role, setRole] = useState<Role>("consumer");
  const [loginRole, setLoginRole] = useState<Role>("consumer");
  const [modal, setModal] = useState<Modal>(null);
  const [points, setPoints] = useState(1280);
  const [supportedProjectIds, setSupportedProjectIds] = useState<string[]>([]);
  const [redeemedProjectIds, setRedeemedProjectIds] = useState<string[]>([]);
  const [orderStages, setOrderStages] = useState<Record<string, number>>({});
  const [evidence, setEvidence] = useState(false);
  const [invoiceStage, setInvoiceStage] = useState<"form" | "scanning" | "success">("form");
  const [period, setPeriod] = useState("半年");
  const [region, setRegion] = useState("全部地區");
  const [selectedOfferId, setSelectedOfferId] = useState("equipment");
  const [fundingStep, setFundingStep] = useState(0);
  const [selectedFarmerName, setSelectedFarmerName] = useState(farmers[0].name);
  const [selectedProjectId, setSelectedProjectId] = useState("water");
  const [lastSupportedId, setLastSupportedId] = useState("water");
  const [lastRedeemedId, setLastRedeemedId] = useState("veggie");
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [consumerPage, setConsumerPage] = useState<"overview" | "local" | "invoice" | "receipt" | "orders">("overview");
  const [farmerPage, setFarmerPage] = useState<"overview" | "evidence" | "funding">("overview");
  const [institutionPage, setInstitutionPage] = useState<"overview" | "portfolio" | "report">("overview");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [selectedStoryId, setSelectedStoryId] = useState<string>(stories[0].id);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (heroPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [heroPaused]);

  const score = evidence ? 86 : 82;
  const supported = supportedProjectIds.length > 0;
  const redeemed = redeemedProjectIds.length > 0;
  const supportedProjects = localProjects.filter((item) => item.kind === "support" && supportedProjectIds.includes(item.id));
  const redeemedProjects = localProjects.filter((item) => item.kind === "redeem" && redeemedProjectIds.includes(item.id));
  const receiptItems = [...supportedProjects, ...redeemedProjects];
  const selectedProject = localProjects.find((item) => item.id === selectedProjectId) || localProjects[0];
  const receiptProject = localProjects.find((item) => item.id === lastSupportedId) || localProjects[0];
  const dimensions = useMemo(
    () => baseDimensions.map((item) => item.name === "低碳作業" && evidence ? { ...item, score: 88 } : item),
    [evidence],
  );

  function openLogin() {
    setLoginRole(role);
    setModal("login");
  }

  function openStory(id: string) {
    setSelectedStoryId(id);
    setModal("story");
  }

  function openFunding(id = "equipment") {
    setSelectedOfferId(id);
    setFundingStep(0);
    setModal("offer");
  }

  function openPortfolio(name = farmers[0].name) {
    setSelectedFarmerName(name);
    setModal("portfolio");
  }

  function openLocalProject(id: string) {
    const project = localProjects.find((item) => item.id === id) || localProjects[0];
    setSelectedProjectId(project.id);
    if (project.kind === "support" && supportedProjectIds.includes(project.id)) {
      setLastSupportedId(project.id);
      setModal("receipt");
      return;
    }
    if (project.kind === "redeem" && redeemedProjectIds.includes(project.id)) {
      setLastRedeemedId(project.id);
      setConsumerPage("orders");
      setModal(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setModal(project.kind === "support" ? "support" : "redeem");
  }

  function goToLocalSupport() {
    setConsumerPage("local");
    setModal(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function advanceOrder(id: string) {
    setOrderStages((stages) => {
      const nextStage = Math.min(3, (stages[id] ?? 0) + 1);
      setToast(nextStage === 3 ? "配送完成，影響力收據已更新" : "訂單進度已更新");
      return { ...stages, [id]: nextStage };
    });
  }

  function openLocalProjectStory(id: string) {
    const project = localProjects.find((item) => item.id === id) || localProjects[0];
    setSelectedProjectId(project.id);
    setModal("local-story");
  }

  function enterDashboard() {
    setRole(loginRole);
    setModal(null);
    setScreen("dashboard");
    setConsumerPage("overview");
    setFarmerPage("overview");
    setInstitutionPage("overview");
    window.scrollTo({ top: 0 });
  }

  function backHome() {
    setScreen("home");
    setModal(null);
    window.scrollTo({ top: 0 });
  }

  function resetDemo() {
    setPoints(1280);
    setSupportedProjectIds([]);
    setRedeemedProjectIds([]);
    setOrderStages({});
    setEvidence(false);
    setInvoiceStage("form");
    setFundingStep(0);
    setSelectedOfferId("equipment");
    setSelectedProjectId("water");
    setLastSupportedId("water");
    setLastRedeemedId("veggie");
    setToast("Demo 資料已重設");
  }

  function verifyInvoice() {
    setInvoiceStage("scanning");
    window.setTimeout(() => {
      setPoints((value) => value + 120);
      setInvoiceStage("success");
    }, 950);
  }

  function supportFarm() {
    const alreadySupported = supportedProjectIds.includes(selectedProject.id);
    if (!alreadySupported && points < selectedProject.points) {
      setToast(`綠點不足，還差 ${selectedProject.points - points} 點`);
      return;
    }
    if (!alreadySupported) {
      setPoints((value) => Math.max(0, value - selectedProject.points));
      setSupportedProjectIds((ids) => [...ids, selectedProject.id]);
    }
    setLastSupportedId(selectedProject.id);
    setModal("receipt");
    setToast(`已完成 ${selectedProject.points} 綠點支持，影響力收據已新增`);
  }

  function redeemProduct() {
    const alreadyRedeemed = redeemedProjectIds.includes(selectedProject.id);
    if (!alreadyRedeemed && points < selectedProject.points) {
      setToast(`綠點不足，還差 ${selectedProject.points - points} 點`);
      return;
    }
    if (!alreadyRedeemed) {
      setPoints((value) => Math.max(0, value - selectedProject.points));
      setRedeemedProjectIds((ids) => [...ids, selectedProject.id]);
      setOrderStages((stages) => ({ ...stages, [selectedProject.id]: 0 }));
    }
    setLastRedeemedId(selectedProject.id);
    setConsumerPage("orders");
    setModal(null);
    setToast(alreadyRedeemed ? "已開啟兌換訂單進度" : "兌換成功，影響力收據與訂單已同步新增");
  }

  function downloadReport() {
    const csv = [
      "農戶,地區,作物,綠色信用,狀態,申請資金,資金用途,資料完整度",
      ...farmers.map((item) => [item.name, item.area, item.crop, item.score, item.status, item.amount, item.purpose, `${item.completeness}%`].join(",")),
    ].join("\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "綠色金融影響力摘要-demo.csv";
    link.click();
    URL.revokeObjectURL(url);
    setToast("影響力摘要已下載");
  }

  function downloadReceipt(item: LocalProject = receiptProject) {
    const receiptNumber = getReceiptNumber(item);
    const lines = [
      "GFES 綠色消費平台｜影響力收據",
      `收據類型：${item.kind === "redeem" ? "小農好物兌換" : "小農改善支持"}`,
      `${item.kind === "redeem" ? "兌換來源" : "支持對象"}：${item.farmer}`,
      `${item.kind === "redeem" ? "兌換商品" : "支持專案"}：${item.title}`,
      `使用綠點：${item.points} 點`,
      `預估成果：${item.impact}`,
      `收據編號：${receiptNumber}`,
    ].join("\n");
    const url = URL.createObjectURL(new Blob([lines], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `GFES-${item.farmer.split("｜")[0]}-影響力收據.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setToast(`${item.farmer} 的影響力收據已下載`);
  }

  const modals = (
    <>
      {modal === "login" && (
        <LoginModal role={loginRole} setRole={setLoginRole} onClose={() => setModal(null)} onEnter={enterDashboard} />
      )}
      {modal === "local-story" && (
        <LocalProjectStoryModal
          item={selectedProject}
          onAction={() => setModal(selectedProject.kind === "support" ? "support" : "redeem")}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "story" && (
        <StoryModal
          storyId={selectedStoryId}
          onNext={(id) => setSelectedStoryId(id)}
          onExperience={openLogin}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "invoice" && (
        <InvoiceModal
          stage={invoiceStage}
          onClose={() => setModal(null)}
          onVerify={verifyInvoice}
        />
      )}
      {modal === "support" && (
        <ActionModal item={selectedProject} done={supportedProjectIds.includes(selectedProject.id)} balance={points} onClose={() => setModal(null)} onConfirm={supportFarm} />
      )}
      {modal === "redeem" && (
        <ActionModal item={selectedProject} done={redeemedProjectIds.includes(selectedProject.id)} balance={points} onClose={() => setModal(null)} onConfirm={redeemProduct} />
      )}
      {modal === "receipt" && <ReceiptModal supported={supported} item={receiptProject} onDownload={() => downloadReceipt(receiptProject)} onExplore={goToLocalSupport} onClose={() => setModal(null)} />}
      {modal === "evidence" && (
        <EvidenceModal
          added={evidence}
          onClose={() => setModal(null)}
          onSubmit={() => {
            setEvidence(true);
            setModal(null);
            setToast("信用分數提升至 86");
          }}
        />
      )}
      {modal === "offer" && (
        <OfferModal
          score={score}
          offerId={selectedOfferId}
          step={fundingStep}
          setStep={setFundingStep}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "portfolio" && (
        <InstitutionPortfolioModal
          selectedName={selectedFarmerName}
          setSelectedName={setSelectedFarmerName}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "farmer-detail" && <FarmerDetailModal onClose={() => setModal(null)} />}
      {toast && <div className="toast" role="status"><CheckCircle2 />{toast}</div>}
    </>
  );

  if (screen === "dashboard") {
    return (
      <div className="site-shell">
        <div className="dashboard">
          <aside className="sidebar">
            <button className="brand brand-button" onClick={backHome}><Brand /></button>
            <div className="side-role"><span>目前體驗角色</span><strong>{roles[role].label}</strong></div>
            <nav className="side-nav">
              <button
                className={(role === "consumer" ? consumerPage : role === "farmer" ? farmerPage : institutionPage) === "overview" ? "active" : ""}
                onClick={() => role === "consumer" ? setConsumerPage("overview") : role === "farmer" ? setFarmerPage("overview") : setInstitutionPage("overview")}
              ><Home />總覽</button>
              {role === "consumer" && (
                <>
                  <button className={consumerPage === "local" ? "active" : ""} onClick={() => setConsumerPage("local")}><HeartHandshake />用綠點支持在地</button>
                  <button className={consumerPage === "orders" ? "active" : ""} onClick={() => setConsumerPage("orders")}><ShoppingBasket />兌換訂單</button>
                  <button className={consumerPage === "invoice" ? "active" : ""} onClick={() => { setInvoiceStage("form"); setConsumerPage("invoice"); }}><Receipt />回傳消費證明</button>
                  <button className={consumerPage === "receipt" ? "active" : ""} onClick={() => setConsumerPage("receipt")}><FileCheck2 />影響力收據</button>
                </>
              )}
              {role === "farmer" && (
                <>
                  <button className={farmerPage === "evidence" ? "active" : ""} onClick={() => setFarmerPage("evidence")}><Upload />永續資料</button>
                  <button className={farmerPage === "funding" ? "active" : ""} onClick={() => setFarmerPage("funding")}><Banknote />信用解鎖資金方案</button>
                </>
              )}
              {role === "institution" && (
                <>
                  <button className={institutionPage === "portfolio" ? "active" : ""} onClick={() => setInstitutionPage("portfolio")}><Users />農戶組合</button>
                  <button className={institutionPage === "report" ? "active" : ""} onClick={() => setInstitutionPage("report")}><Download />影響力報告</button>
                </>
              )}
            </nav>
            <button className="button button-ghost side-reset" onClick={resetDemo}><RefreshCcw />重設 Demo</button>
          </aside>

          <main className="dashboard-main">
            <header className="dashboard-top">
              <div>
                <h1>{role === "consumer"
                  ? ({ overview: "消費者中心", local: "用綠點支持在地", invoice: "回傳消費證明", receipt: "影響力收據", orders: "兌換訂單" } as const)[consumerPage]
                  : role === "farmer"
                    ? ({ overview: "小農中心", evidence: "永續資料", funding: "信用解鎖資金方案" } as const)[farmerPage]
                    : ({ overview: "金融合作機構中心", portfolio: "農戶組合", report: "影響力報告" } as const)[institutionPage]}</h1>
                <p>{role === "consumer" && consumerPage === "local"
                  ? "選擇支持改善專案或兌換小農好物，讓綠點回到土地"
                  : role === "consumer" && consumerPage === "invoice"
                    ? "手動輸入發票資料，或掃描電子／傳統發票取得綠點"
                    : role === "consumer" && consumerPage === "orders"
                      ? "模擬查看小農好物從訂單成立、備貨、配送到完成的進度"
                    : role === "consumer" && consumerPage === "receipt"
                      ? "查看綠點流向、小農行動與地方成果"
                      : role === "farmer" && farmerPage === "evidence"
                        ? "管理永續生產紀錄，提升資料完整度與綠色信用"
                        : role === "farmer" && farmerPage === "funding"
                          ? "依綠色信用逐步解鎖資金支持與優惠融資"
                          : role === "institution" && institutionPage === "portfolio"
                            ? "檢視農戶信用、資料完整度與資金媒合狀態"
                            : role === "institution" && institutionPage === "report"
                              ? "彙整綠色金融投入、環境成果與地方影響"
                              : "以下資料皆為提案展示用的模擬資料"}</p>
              </div>
              <button className="profile-button" onClick={openLogin}>
                <span className="avatar"><User /></span>
                <span>{roles[role].account}</span>
                <ChevronRight />
              </button>
            </header>

            {role === "consumer" && consumerPage === "overview" && (
              <ConsumerDashboard
                points={points}
                supportedItems={supportedProjects}
                redeemed={redeemed}
                period={period}
                setPeriod={setPeriod}
                onInvoice={() => { setInvoiceStage("form"); setConsumerPage("invoice"); }}
                lastRedeemedId={lastRedeemedId}
                onReceipt={() => setConsumerPage("receipt")}
              />
            )}
            {role === "consumer" && consumerPage === "local" && (
              <LocalSupportDashboard
                points={points}
                supportedIds={supportedProjectIds}
                redeemedIds={redeemedProjectIds}
                onProject={openLocalProject}
                onLearnMore={openLocalProjectStory}
              />
            )}
            {role === "consumer" && consumerPage === "invoice" && (
              <ConsumerInvoicePage stage={invoiceStage} onVerify={verifyInvoice} onReset={() => setInvoiceStage("form")} />
            )}
            {role === "consumer" && consumerPage === "receipt" && (
              <ConsumerReceiptPage
                items={receiptItems}
                onDownload={downloadReceipt}
                onExplore={() => setConsumerPage("local")}
                onLearnMore={openLocalProjectStory}
              />
            )}
            {role === "consumer" && consumerPage === "orders" && (
              <ConsumerOrdersPage
                items={redeemedProjects}
                stages={orderStages}
                initialId={lastRedeemedId}
                onAdvance={advanceOrder}
                onReceipt={() => setConsumerPage("receipt")}
                onExplore={() => setConsumerPage("local")}
              />
            )}
            {role === "farmer" && farmerPage === "overview" && (
              <FarmerDashboard
                score={score}
                evidence={evidence}
                dimensions={dimensions}
                onEvidence={() => setFarmerPage("evidence")}
                onOffer={openFunding}
              />
            )}
            {role === "farmer" && farmerPage === "evidence" && (
              <FarmerEvidencePage
                evidence={evidence}
                onSubmit={() => { setEvidence(true); setToast("信用分數提升至 86"); }}
                onFunding={() => setFarmerPage("funding")}
              />
            )}
            {role === "farmer" && farmerPage === "funding" && (
              <FarmerFundingPage
                score={score}
                evidence={evidence}
                onEvidence={() => setFarmerPage("evidence")}
                onOffer={openFunding}
              />
            )}
            {role === "institution" && institutionPage === "overview" && (
              <InstitutionDashboard
                region={region}
                setRegion={setRegion}
                onDetail={(name) => { if (name) setSelectedFarmerName(name); setInstitutionPage("portfolio"); }}
                onDownload={() => setInstitutionPage("report")}
              />
            )}
            {role === "institution" && institutionPage === "portfolio" && (
              <InstitutionPortfolioPage selectedName={selectedFarmerName} setSelectedName={setSelectedFarmerName} />
            )}
            {role === "institution" && institutionPage === "report" && (
              <InstitutionReportPage onDownload={downloadReport} />
            )}
          </main>
        </div>

        <nav className={`mobile-nav ${role === "consumer" ? "mobile-nav-consumer" : ""}`}>
          <button
            className={(role === "consumer" ? consumerPage : role === "farmer" ? farmerPage : institutionPage) === "overview" ? "active" : ""}
            onClick={() => role === "consumer" ? setConsumerPage("overview") : role === "farmer" ? setFarmerPage("overview") : setInstitutionPage("overview")}
          ><Home />總覽</button>
          {role === "consumer" && (
            <>
              <button className={consumerPage === "invoice" ? "active" : ""} onClick={() => { setInvoiceStage("form"); setConsumerPage("invoice"); }}><Receipt />發票</button>
              <button className={consumerPage === "local" ? "active" : ""} onClick={() => setConsumerPage("local")}><HeartHandshake />支持在地</button>
              <button className={consumerPage === "orders" ? "active" : ""} onClick={() => setConsumerPage("orders")}><ShoppingBasket />訂單</button>
              <button className={consumerPage === "receipt" ? "active" : ""} onClick={() => setConsumerPage("receipt")}><FileCheck2 />收據</button>
            </>
          )}
          {role === "farmer" && (
            <>
              <button className={farmerPage === "evidence" ? "active" : ""} onClick={() => setFarmerPage("evidence")}><Upload />永續資料</button>
              <button className={farmerPage === "funding" ? "active" : ""} onClick={() => setFarmerPage("funding")}><Banknote />信用方案</button>
            </>
          )}
          {role === "institution" && (
            <>
              <button className={institutionPage === "portfolio" ? "active" : ""} onClick={() => setInstitutionPage("portfolio")}><Users />農戶</button>
              <button className={institutionPage === "report" ? "active" : ""} onClick={() => setInstitutionPage("report")}><Download />報告</button>
            </>
          )}
          <button onClick={backHome}><LogOut />首頁</button>
        </nav>
        {modals}
      </div>
    );
  }

  return (
    <div className={`site-shell home-site ${previewMode === "mobile" ? "device-preview-mobile" : ""}`}>
      <header className="topbar">
        <nav className="container nav">
          <div className="nav-brand-group">
            <button className="brand brand-button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><Brand /></button>
            <div className={`device-toggle ${previewMode}`} role="group" aria-label="切換首頁裝置預覽">
              <span className="device-toggle-thumb" aria-hidden="true" />
              <button type="button" className={previewMode === "desktop" ? "active" : ""} aria-pressed={previewMode === "desktop"} onClick={() => setPreviewMode("desktop")}><Monitor />網頁</button>
              <button type="button" className={previewMode === "mobile" ? "active" : ""} aria-pressed={previewMode === "mobile"} onClick={() => setPreviewMode("mobile")}><Smartphone />手機</button>
            </div>
          </div>
          <div className="nav-links">
            <a href="#stories">在地行動</a>
            <a href="#cycle">運作方式</a>
            <a href="#impact">社會影響</a>
          </div>
          <button className="button button-primary" onClick={openLogin}><User />登入／體驗 Demo</button>
        </nav>
      </header>

      <main>
        <section
          className="hero hero-full"
          onMouseEnter={() => setHeroPaused(true)}
          onMouseLeave={() => setHeroPaused(false)}
          onFocusCapture={() => setHeroPaused(true)}
          onBlurCapture={() => setHeroPaused(false)}
        >
          <div className="hero-background" aria-roledescription="輪播" aria-label="綠色農業行動照片">
            {heroSlides.map((slide, index) => (
              <figure
                className={`hero-bg-slide ${heroSlide === index ? "active" : ""}`}
                aria-hidden={heroSlide !== index}
                key={slide.image}
              >
                <img src={slide.image} alt={heroSlide === index ? slide.alt : ""} loading={index === 0 ? "eager" : "lazy"} />
              </figure>
            ))}
          </div>

          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">Green Finance, Local Impact</span>
              <h1><span>讓每一次消費</span><span>都成為土地向前的力量</span></h1>
              <div className="hero-actions">
                <button className="button button-primary" onClick={openLogin}>開始體驗<ArrowRight /></button>
                <button className="button button-secondary" onClick={() => document.querySelector("#cycle")?.scrollIntoView()}>
                  了解運作方式<ArrowDown />
                </button>
              </div>
              <div className="trust-row">
                <span><BadgeCheck />消費可追溯</span>
                <span><Leaf />永續有依據</span>
                <span><HeartHandshake />支持看得見</span>
              </div>
            </div>

            <div className="hero-side">
              <div className="hero-active-caption" aria-live="polite">
                <span>{heroSlides[heroSlide].label}</span>
                <strong>{heroSlides[heroSlide].title}</strong>
              </div>
            </div>
          </div>

          <div className="hero-carousel-controls">
            <button
              type="button"
              onClick={() => setHeroSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length)}
              aria-label="上一張照片"
            ><ArrowLeft /></button>
            <div className="hero-dots" aria-label="選擇照片">
              {heroSlides.map((slide, index) => (
                <button
                  type="button"
                  className={heroSlide === index ? "active" : ""}
                  onClick={() => setHeroSlide(index)}
                  aria-label={`顯示第 ${index + 1} 張：${slide.label}`}
                  aria-current={heroSlide === index ? "true" : undefined}
                  key={slide.label}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setHeroSlide((current) => (current + 1) % heroSlides.length)}
              aria-label="下一張照片"
            ><ArrowRight /></button>
          </div>
        </section>

        <section className="section section-soft" id="stories">
          <div className="container">
            <header className="section-heading">
              <span className="eyebrow">從土地開始</span>
              <h2>看見每一份綠色選擇背後的行動</h2>
              <p>從田間生產、消費回饋到金融資源，讓地方農業的努力被看見、被支持，也能持續成長。</p>
            </header>
            <div className="story-grid">
              <StoryCard story={stories[0]} large onClick={() => openStory(stories[0].id)} />
              <div className="story-stack">
                <StoryCard story={stories[1]} onClick={() => openStory(stories[1].id)} />
                <StoryCard story={stories[2]} onClick={() => openStory(stories[2].id)} />
              </div>
              <div className="story-stack">
                <StoryCard story={stories[3]} onClick={() => openStory(stories[3].id)} />
                <StoryCard story={stories[4]} onClick={() => openStory(stories[4].id)} />
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="cycle">
          <div className="container">
            <header className="section-heading center">
              <span className="eyebrow">綠色金融循環</span>
              <h2>從一筆消費，到一座農村的改變</h2>
              <p>自動取得綠點或回傳消費證明，最終都匯入同一個可追溯的支持循環。</p>
            </header>
            <div className="cycle-track">
              {cycle.map(([title, text, Icon], index) => (
                <article className="cycle-step" key={title}>
                  <span className="step-number">0{index + 1}</span>
                  <span className="step-icon"><Icon /></span>
                  <h3>{title}</h3><p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark" id="impact">
          <div className="container">
            <header className="section-heading">
              <span className="eyebrow">共同影響力</span>
              <h2>讓支持不只是一個數字</h2>
              <p>以下為 Demo 模擬資料，展示未來如何追蹤消費、農業與金融共同創造的成果。</p>
            </header>
            <div className="impact-grid">
              <Impact icon={Users} value="128" label="受支持在地農戶" />
              <Impact icon={HandCoins} value="386 萬" label="媒合綠色金融資源" />
              <Impact icon={Trees} value="62.4 噸" label="估算年度減碳成果" />
              <Impact icon={ShoppingBasket} value="18,620" label="筆綠色消費行動" />
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-row">
          <Brand />
          <span>本網站為提案 Demo，人物、故事、數字、信用評估與金融方案皆為模擬資料。</span>
          <a href="https://www.pexels.com/" target="_blank" rel="noreferrer">封面來源：Pexels・故事圖為 AI 生成示意</a>
        </div>
      </footer>
      {modals}
    </div>
  );
}

function StoryCard({
  story,
  onClick,
  large = false,
}: {
  story: (typeof stories)[number];
  onClick: () => void;
  large?: boolean;
}) {
  return (
    <button className={`story-card ${large ? "large" : ""}`} onClick={onClick} aria-label={`閱讀故事：${story.title}`}>
      <img src={story.cover} alt={story.title} />
      <span className="story-overlay">
        <span>{story.label}</span>
        <strong>{story.title}</strong>
        <em>閱讀故事 <ArrowRight /></em>
      </span>
    </button>
  );
}

function LocalProjectStoryModal({
  item,
  onAction,
  onClose,
}: {
  item: LocalProject;
  onAction: () => void;
  onClose: () => void;
}) {
  const story = localProjectStories[item.id as keyof typeof localProjectStories];
  const isSupport = item.kind === "support";
  return (
    <ModalShell title={isSupport ? "小農改善專案故事" : "小農好物故事"} onClose={onClose} wide>
      <article className="local-story-detail">
        <div className="local-story-hero">
          <img src={item.image} alt={item.title} />
          <div><span>{isSupport ? "GREEN ACTION" : "LOCAL PRODUCT"}・{story.location}</span><h3>{story.headline}</h3><p>{item.farmer}</p></div>
        </div>
        <div className="local-story-content">
          <section><span className="eyebrow">來自產地的故事</span><blockquote>「{story.quote}」</blockquote>{story.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>
          <aside><h4>{isSupport ? "這份支持會帶來什麼" : "這次兌換支持了什麼"}</h4><div className="local-story-facts"><div><small>{isSupport ? "所需綠點" : "兌換綠點"}</small><strong>{item.points} 點</strong></div><div><small>目前進度</small><strong>{item.progress}%</strong></div><div><small>{isSupport ? "資源用途" : "配送方式"}</small><strong>{item.purpose}</strong></div><div><small>預期成果</small><strong>{item.impact}</strong></div></div><div className="progress"><span style={{ width: item.progress + "%" }} /></div><p>{isSupport ? "完成支持後，專案進度與成果將同步到你的影響力收據。" : "完成兌換後，這筆綠點會形成在地訂單並支持小農持續生產。"}</p></aside>
        </div>
      </article>
      <div className="modal-actions local-story-actions"><button className="button button-secondary" onClick={onClose}>返回專案列表</button><button className="button button-primary" onClick={onAction}>{isSupport ? `支持 ${item.points} 點` : `兌換 ${item.points} 點`}<ArrowRight /></button></div>
    </ModalShell>
  );
}

function StoryModal({
  storyId,
  onNext,
  onExperience,
  onClose,
}: {
  storyId: string;
  onNext: (id: string) => void;
  onExperience: () => void;
  onClose: () => void;
}) {
  const index = Math.max(stories.findIndex((item) => item.id === storyId), 0);
  const story = stories[index];
  const nextStory = stories[(index + 1) % stories.length];
  return (
    <ModalShell title={story.label} onClose={onClose} wide>
      <article className="story-detail">
        <div className="story-detail-hero">
          <img src={story.detail} alt={story.detailAlt} />
          <div>
            <span>DEMO STORY ・ {String(index + 1).padStart(2, "0")}</span>
            <h3>{story.title}</h3>
            <p>{story.person}｜{story.place}</p>
          </div>
        </div>
        <div className="story-intro">
          <div><small>故事人物</small><strong>{story.person}</strong><span>{story.place}</span></div>
          <p>{story.intro}</p>
        </div>
        <div className="story-metrics">
          {story.metrics.map(([value, label]) => <article key={label}><strong>{value}</strong><span>{label}</span></article>)}
        </div>
        <div className="story-content-grid">
          <section>
            <span className="eyebrow">從現場到成果</span>
            {story.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <blockquote>「{story.quote}」<cite>— {story.person}</cite></blockquote>
          </section>
          <aside>
            <h4>這個行動如何形成循環</h4>
            <div className="story-steps">
              {story.steps.map(([title, note], stepIndex) => (
                <div key={title}><span>{stepIndex + 1}</span><p><b>{title}</b><small>{note}</small></p></div>
              ))}
            </div>
            <div className="story-disclosure"><FileCheck2 /><span><b>Demo 模擬故事</b><small>人物名稱、成果數字與專案內容為提案展示；故事圖依封面人物與場景生成。</small></span></div>
          </aside>
        </div>
      </article>
      <div className="story-modal-actions">
        <button className="button button-secondary" onClick={() => onNext(nextStory.id)}>下一個故事：{nextStory.label}<ArrowRight /></button>
        <button className="button button-primary" onClick={onExperience}>進入角色 Demo<User /></button>
      </div>
    </ModalShell>
  );
}

function Impact({ icon: Icon, value, label }: { icon: typeof Users; value: string; label: string }) {
  return <article className="impact-card"><Icon /><strong>{value}</strong><span>{label}</span></article>;
}

function LoginModal({
  role,
  setRole,
  onClose,
  onEnter,
}: {
  role: Role;
  setRole: (role: Role) => void;
  onClose: () => void;
  onEnter: () => void;
}) {
  return (
    <ModalShell title="登入／體驗 Demo" onClose={onClose}>
      <div className="login-layout">
        <div className="login-photo">
          <strong>選擇你的角色，走進同一個綠色循環。</strong>
          <span>三種角色共享同一條消費、信用與金融資源資料鏈。</span>
        </div>
        <div>
          <span className="eyebrow">選擇體驗角色</span>
          <div className="role-options">
            {(Object.keys(roles) as Role[]).map((key) => {
              const item = roles[key];
              const Icon = item.icon;
              return (
                <button className={`role-option ${role === key ? "active" : ""}`} key={key} onClick={() => setRole(key)}>
                  <span className="role-icon"><Icon /></span>
                  <span><strong>{item.label}</strong><small>{item.description}</small></span>
                  {role === key && <CheckCircle2 className="role-check" />}
                </button>
              );
            })}
          </div>
          <button className="button button-primary button-block" onClick={onEnter}>
            進入{roles[role].label}中心<ArrowRight />
          </button>
          <p className="demo-note">無須帳號密碼，所有操作皆為 Demo 模擬</p>
        </div>
      </div>
    </ModalShell>
  );
}

function ConsumerDashboard({
  points,
  supportedItems,
  redeemed,
  period,
  setPeriod,
  lastRedeemedId,
  onInvoice,
  onReceipt,
}: {
  points: number;
  supportedItems: LocalProject[];
  redeemed: boolean;
  period: string;
  setPeriod: (value: string) => void;
  lastRedeemedId: string;
  onInvoice: () => void;
  onReceipt: () => void;
}) {
  const supportTotal = supportedItems.reduce((sum, item) => sum + item.points, 380);

  return (
    <div className="dashboard-grid">
      <section className="span-4">
        <div className="wallet">
          <span>可用綠點</span>
          <strong>{points.toLocaleString()} <small>點</small></strong>
          <div><span>本月取得<b>510 點</b></span><span>累計支持<b>{supportTotal.toLocaleString()} 點</b></span></div>
        </div>
        <div className="quick-actions">
          <button onClick={onInvoice}><span><ScanLine /></span><b>回傳發票<small>輸入或拍照取得綠點</small></b></button>
          <button onClick={onReceipt}><span><FileCheck2 /></span><b>影響力收據<small>查看支持流向與成果</small></b></button>
        </div>
      </section>

      <Panel className="span-8" title="綠點趨勢" note="合作通路與發票驗證取得的綠點" action={
        <div className="chips">
          {["近三月", "半年", "一年"].map((item) => (
            <button className={period === item ? "active" : ""} onClick={() => setPeriod(item)} key={item}>{item}</button>
          ))}
        </div>
      }>
        <Chart>
          <AreaChart data={period === "近三月" ? pointTrend.slice(-3) : pointTrend}>
            <defs><linearGradient id="pointFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2d7250" stopOpacity=".32" /><stop offset="95%" stopColor="#2d7250" stopOpacity="0" /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7ebe4" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="points" name="取得綠點" stroke="#2d7250" strokeWidth={3} fill="url(#pointFill)" />
          </AreaChart>
        </Chart>
      </Panel>

      <Panel className="span-12" title="近期紀錄" note="綠點來源與使用去向">
        <div className="activity-list">
          <Activity icon={Store} title="合作通路消費回饋" note="綠田生活市集" value="+180 點" />
          <Activity icon={Receipt} title="發票驗證回饋" note="友善農產專區" value="+120 點" />
          {supportedItems.slice(-2).reverse().map((item) => <Activity key={item.id} icon={HeartHandshake} title="支持改善專案" note={item.farmer} value={`-${item.points} 點`} />)}
          {redeemed && <Activity icon={ShoppingBasket} title="兌換小農商品" note={(localProjects.find((item) => item.id === lastRedeemedId) || localProjects[2]).farmer} value={`-${(localProjects.find((item) => item.id === lastRedeemedId) || localProjects[2]).points} 點`} />}
        </div>
      </Panel>
    </div>
  );
}

function LocalSupportDashboard({
  points,
  supportedIds,
  redeemedIds,
  onProject,
  onLearnMore,
}: {
  points: number;
  supportedIds: string[];
  redeemedIds: string[];
  onProject: (id: string) => void;
  onLearnMore: (id: string) => void;
}) {
  const renderProject = (item: (typeof localProjects)[number]) => {
    const done = item.kind === "support"
      ? supportedIds.includes(item.id)
      : redeemedIds.includes(item.id);
    return (
      <Project
        key={item.id}
        image={item.image}
        title={item.title}
        note={done ? (item.kind === "support" ? `已支持 ${item.points} 點，可查看影響力收據` : "兌換完成，預計 3–5 個工作天出貨") : item.note}
        progress={done ? 100 : item.progress}
        button={done ? (item.kind === "support" ? "查看成果" : "查看狀態") : item.kind === "support" ? `支持 ${item.points} 點` : `兌換 ${item.points} 點`}
        onClick={() => onProject(item.id)}
        onLearnMore={() => onLearnMore(item.id)}
        gold={item.kind === "redeem"}
      />
    );
  };

  return (
    <div className="dashboard-grid">
      <section className="local-support-banner span-12">
        <div className="local-points">
          <span>目前可用綠點</span>
          <strong>{points.toLocaleString()} <small>點</small></strong>
        </div>
        <div className="local-support-path"><span><Sprout /></span><div><b>支持小農改善</b><small>投入設備、耕作與生態專案，成果會形成影響力收據</small></div></div>
        <div className="local-support-path"><span><ShoppingBasket /></span><div><b>兌換小農好物</b><small>用綠點兌換小農生產商品，直接支持在地收入</small></div></div>
      </section>

      <Panel className="span-12 local-project-panel" title="支持小農改善專案" note="每個專案都標示小農姓名、用途、目前進度與預期成果">
        <div className="project-list project-list-expanded">
          {localProjects.filter((item) => item.kind === "support").map(renderProject)}
        </div>
      </Panel>

      <Panel className="span-12 local-project-panel" title="兌換小農生產好物" note="從蔬果、米食到香草產品，讓綠點成為看得見的在地訂單">
        <div className="project-list project-list-expanded">
          {localProjects.filter((item) => item.kind === "redeem").map(renderProject)}
        </div>
      </Panel>
    </div>
  );
}

function FarmerDashboard({
  score,
  evidence,
  dimensions,
  onEvidence,
  onOffer,
}: {
  score: number;
  evidence: boolean;
  dimensions: { name: string; score: number }[];
  onEvidence: () => void;
  onOffer: (id: string) => void;
}) {
  const unlockedOffers = fundingOffers.filter((offer) => score >= offer.requiredScore);
  const nextOffer = fundingOffers.find((offer) => score < offer.requiredScore);
  const nextGap = nextOffer ? nextOffer.requiredScore - score : 0;
  return (
    <>
      <div className="metrics">
        <Metric icon={HeartHandshake} value="680 點" label="本月取得支持" delta="+18%" />
        <Metric icon={ShoppingBasket} value="46 箱" label="商品兌換數" delta="+12%" />
        <Metric icon={FileCheck2} value={evidence ? "100%" : "86%"} label="永續資料完整度" delta={evidence ? "完成" : "待補 1 項"} />
        <Metric icon={Banknote} value={`${unlockedOffers.length} 項`} label="已解鎖資金方案" delta={`${fundingOffers.length - unlockedOffers.length} 項待解鎖`} />
      </div>
      <div className="dashboard-grid">
        <Panel className="span-7" title="綠色信用評分" note="依永續行動、資料完整度與成果紀錄綜合評估">
          <div className="score-panel">
            <div className="score-ring" style={{ "--score": `${score}%` } as React.CSSProperties}><span><strong>{score}</strong><small>滿分 100</small></span></div>
            <div>
              <h3>{evidence ? "信用提升完成" : "穩健成長中"}</h3>
              <p>{evidence ? "低碳作業證明已完成驗證，綠色信用提升 4 分，媒合條件同步更新。" : "補充低碳設備使用紀錄，預估可提升 4 分並更接近進階資金方案。"}</p>
              <button className="button button-primary" onClick={onEvidence}><Upload />{evidence ? "查看補件結果" : "補充永續證明"}</button>
            </div>
          </div>
        </Panel>
        <Panel className="span-5" title="評估維度" note="五項綠色生產指標">
          <Chart>
            <BarChart layout="vertical" data={dimensions}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={70} />
              <Tooltip />
              <Bar dataKey="score" name="分數" fill="#74a945" radius={[0, 8, 8, 0]} />
            </BarChart>
          </Chart>
        </Panel>
        <Panel className="span-7" title="永續資料進度" note="完整且可追溯的資料，是綠色信用的基礎">
          <div className="evidence-list">
            <Evidence title="友善耕作紀錄" note="最近更新：2026/07/18" done />
            <Evidence title="循環回收與資材管理" note="最近更新：2026/07/10" done />
            <Evidence title="低碳設備使用證明" note={evidence ? "已完成 Demo 驗證" : "待補充設備與使用紀錄"} done={evidence} />
            <Evidence title="農產履歷與批次資訊" note="最近更新：2026/07/22" done />
          </div>
        </Panel>
        <Panel className="span-12" title="信用解鎖資金方案" note="累積綠色信用，逐步解鎖更高額度、配對資金與優惠條件">
          <div className="funding-unlock-summary">
            <div className="funding-current"><span><BadgeCheck /></span><div><small>目前綠色信用</small><strong>{score} 分</strong><p>已解鎖 {unlockedOffers.length}／{fundingOffers.length} 項方案</p></div></div>
            {nextOffer ? (
              <div className="funding-next">
                <div><span>下一個解鎖目標</span><b>{nextOffer.requiredScore} 分・{nextOffer.name}</b></div>
                <div className="progress"><span style={{ width: `${Math.min((score / nextOffer.requiredScore) * 100, 100)}%` }} /></div>
                <small>再累積 <b>{nextGap} 分</b>，即可解鎖 {nextOffer.amount}</small>
              </div>
            ) : (
              <div className="funding-next complete"><b>所有示範方案皆已解鎖</b><small>持續更新成果，可爭取更適合的正式條件。</small></div>
            )}
            <button className="button button-primary" onClick={onEvidence}><Upload />{evidence ? "查看信用提升紀錄" : "補資料、加速解鎖"}</button>
          </div>
          <div className="funding-legend"><span><i className="support" />資金支持／成果核銷</span><span><i className="loan" />優惠融資／分期運用</span><span><LockKeyhole />金色虛線為待解鎖</span></div>
          <div className="offer-list funding-offer-grid">
            {fundingOffers.map((offer) => (
              <Offer
                key={offer.id}
                category={offer.category}
                name={offer.name}
                amount={offer.amount}
                term={offer.term}
                rate={offer.rate}
                description={offer.description}
                purpose={offer.purpose}
                requiredScore={offer.requiredScore}
                currentScore={score}
                recommended={"recommended" in offer && offer.recommended}
                onClick={() => onOffer(offer.id)}
              />
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

function InstitutionDashboard({
  region,
  setRegion,
  onDetail,
  onDownload,
}: {
  region: string;
  setRegion: (value: string) => void;
  onDetail: (name?: string) => void;
  onDownload: () => void;
}) {
  const multiplier = region === "全部地區" ? 1 : region === "雲林" ? 0.34 : 0.22;
  const regionData = [
    { name: "雲林", value: 34, color: "#2d7250" },
    { name: "嘉義", value: 27, color: "#74a945" },
    { name: "花蓮", value: 22, color: "#d8a72f" },
    { name: "其他", value: 17, color: "#c7d4bd" },
  ];
  const visibleFarmers = farmers.filter((item) => region === "全部地區" || item.area === region);
  return (
    <>
      <div className="metrics">
        <Metric icon={Users} value={`${Math.round(128 * multiplier)}`} label="支持農戶" delta="+9.4%" />
        <Metric icon={HandCoins} value={`${Math.round(386 * multiplier)} 萬`} label="媒合金融資源" delta="+18.2%" />
        <Metric icon={Trees} value={`${(62.4 * multiplier).toFixed(1)} 噸`} label="估算減碳成果" delta="+12.1%" />
        <Metric icon={TrendingUp} value="84.6" label="平均綠色信用" delta="+2.8" />
      </div>
      <div className="dashboard-grid">
        <Panel className="span-8" title="資金成長趨勢" note="媒合資金單位：萬元" action={
          <select className="select" value={region} onChange={(event) => setRegion(event.target.value)}>
            <option>全部地區</option><option>雲林</option><option>嘉義</option><option>花蓮</option>
          </select>
        }>
          <Chart>
            <BarChart data={fundTrend.map((item) => ({ ...item, funds: Math.round(item.funds * multiplier) }))}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="funds" name="媒合資金" fill="#2d7250" radius={[8, 8, 0, 0]} />
            </BarChart>
          </Chart>
        </Panel>
        <Panel className="span-4" title="農戶地區分布" note="目前合作農戶占比">
          <Chart>
            <PieChart>
              <Pie data={regionData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={4}>
                {regionData.map((item) => <Cell key={item.name} fill={item.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </Chart>
        </Panel>
        <Panel className="span-12" title="農戶信用與媒合進度" note={`目前顯示 ${visibleFarmers.length} 戶；點選可開啟完整農戶組合`} action={
          <div className="panel-actions"><button className="button button-secondary" onClick={() => onDetail()}><Users />開啟農戶組合</button><button className="button button-secondary" onClick={onDownload}><Download />下載影響力摘要</button></div>
        }>
          <div className="table-wrap">
            <table>
              <thead><tr><th>農戶</th><th>地區</th><th>作物</th><th>綠色信用</th><th>申請資金</th><th>媒合狀態</th><th>查看</th></tr></thead>
              <tbody>
                {visibleFarmers.map((item) => (
                  <tr key={item.name} onClick={() => onDetail(item.name)} tabIndex={0} onKeyDown={(event) => event.key === "Enter" && onDetail(item.name)}>
                    <td><b>{item.name}</b></td><td>{item.area}</td><td>{item.crop}</td>
                    <td><span className="score-pill">{item.score}</span></td><td>{item.amount}</td><td><span className={`status-pill ${item.status === "待補件" ? "waiting" : ""}`}>{item.status}</span></td><td><ChevronRight /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </>
  );
}

type InvoiceEntryMethod = "manual" | "scan";
type InvoiceScanType = "electronic" | "traditional";

function InvoiceEntryContent({ onVerify }: { onVerify: () => void }) {
  const [method, setMethod] = useState<InvoiceEntryMethod>("manual");
  const [scanType, setScanType] = useState<InvoiceScanType>("electronic");
  const [scanReady, setScanReady] = useState(false);

  function selectScanType(type: InvoiceScanType) {
    setScanType(type);
    setScanReady(false);
  }

  return (
    <>
      <div className="invoice-entry-tabs" role="tablist" aria-label="發票登錄方式">
        <button type="button" className={method === "manual" ? "active" : ""} onClick={() => setMethod("manual")}><Receipt />手動新增</button>
        <button type="button" className={method === "scan" ? "active" : ""} onClick={() => setMethod("scan")}><ScanLine />掃描發票</button>
      </div>

      {method === "manual" ? (
        <>
          <div className="invoice-helper"><span><Receipt /></span><div><b>手動新增發票</b><small>依發票內容填寫日期、號碼及消費金額；隨機碼與備註可選填</small></div></div>
          <div className="form-grid invoice-manual-form">
            <label className="full">消費日期<input type="date" defaultValue="2026-07-31" /></label>
            <label className="full">發票號碼
              <span className="invoice-number-fields">
                <input aria-label="發票英文字軌" defaultValue="AB" maxLength={2} autoCapitalize="characters" />
                <b>－</b>
                <input aria-label="發票八碼號碼" defaultValue="12345678" inputMode="numeric" maxLength={8} />
              </span>
            </label>
            <label className="full">消費金額<input type="number" defaultValue="680" min="0" inputMode="numeric" /></label>
            <label className="full">4 碼隨機碼 <small>選填，電子發票可提高查詢完整度</small><input defaultValue="4827" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} /></label>
            <label className="full">備註 <small>選填，尚無店家名稱時會顯示於紀錄標題</small><textarea defaultValue="友善蔬菜箱與在地農產" maxLength={50} /></label>
          </div>
          <p className="fine-print">本功能為提案 Demo，輸入內容不會送至財政部或外部系統。</p>
          <div className="subpage-actions"><button className="button button-primary" type="button" onClick={onVerify}><CheckCircle2 />儲存並驗證</button></div>
        </>
      ) : (
        <>
          <div className="invoice-helper"><span><ScanLine /></span><div><b>掃描新增發票</b><small>選擇發票類型，再將鏡頭對準發票號碼或 QR Code</small></div></div>
          <div className="scan-type-tabs" role="tablist" aria-label="掃描發票類型">
            <button type="button" className={scanType === "electronic" ? "active" : ""} onClick={() => selectScanType("electronic")}>電子發票</button>
            <button type="button" className={scanType === "traditional" ? "active" : ""} onClick={() => selectScanType("traditional")}>傳統發票</button>
          </div>

          {!scanReady ? (
            <div className="invoice-scanner">
              <div className={`scanner-viewport ${scanType}`}>
                <div className="scanner-beam" />
                <div className="scanner-receipt" aria-hidden="true">
                  <span />
                  <span />
                  {scanType === "electronic" ? <div className="scanner-qr"><i /><i /><i /><i /></div> : <strong>AB12345678</strong>}
                  <span />
                </div>
              </div>
              <div className="scanner-instruction">
                <b>{scanType === "electronic" ? "請將鏡頭對準發票 QR Code" : "請將鏡頭對準發票號碼"}</b>
                <small>{scanType === "electronic" ? "適度調整掃描距離以便相機對焦" : "支援 114–115 年度傳統發票辨識"}</small>
              </div>
              <div className="scan-upload-actions">
                <label className="button button-secondary"><Upload />開啟相機／上傳照片<input type="file" accept="image/*" capture="environment" onChange={() => setScanReady(true)} /></label>
                <button type="button" className="button button-primary" onClick={() => setScanReady(true)}><ScanLine />使用 Demo 掃描</button>
              </div>
            </div>
          ) : (
            <div className="scan-result">
              <div className="scan-result-status"><CheckCircle2 /><div><b>掃描完成</b><small>已辨識發票內容，請確認資料後送出</small></div></div>
              <div className="form-grid">
                <label>消費日期<input type="date" defaultValue="2026-07-31" /></label>
                <label>消費金額<input type="number" defaultValue="680" /></label>
                <label className="full">發票號碼<input defaultValue="AB12345678" /></label>
                <label className="full">4 碼隨機碼<input defaultValue="4827" inputMode="numeric" maxLength={4} /></label>
              </div>
              <div className="subpage-actions"><button type="button" className="button button-secondary" onClick={() => setScanReady(false)}>重新掃描</button><button type="button" className="button button-primary" onClick={onVerify}><CheckCircle2 />確認並驗證</button></div>
            </div>
          )}
        </>
      )}
    </>
  );
}

function ConsumerInvoicePage({
  stage,
  onVerify,
  onReset,
}: {
  stage: "form" | "scanning" | "success";
  onVerify: () => void;
  onReset: () => void;
}) {
  return (
    <div className="dashboard-grid">
      <Panel className="span-8 subpage-primary" title="新增消費證明" note="可手動填寫完整資料，或使用相機掃描電子／傳統發票">
        {stage === "success" ? (
          <Success title="驗證完成，獲得 120 綠點" text="這筆友善農產消費已通過 Demo 驗證，綠點已加入你的錢包。">
            <button className="button button-primary" onClick={onReset}>再新增一張發票</button>
          </Success>
        ) : stage === "scanning" ? (
          <Success title="正在驗證發票" text="Demo 正在核對發票日期、號碼、消費金額與綠色消費資格。">
            <div className="progress"><span style={{ width: "76%" }} /></div>
          </Success>
        ) : <InvoiceEntryContent onVerify={onVerify} />}
      </Panel>
      <Panel className="span-4" title="取得綠點流程" note="資料確認後自動加入錢包">
        <div className="subpage-steps"><div><span>1</span><p><b>選擇登錄方式</b><small>手動新增或掃描發票</small></p></div><div><span>2</span><p><b>確認發票資料</b><small>核對日期、號碼與消費金額</small></p></div><div><span>3</span><p><b>資格驗證</b><small>確認符合綠色消費條件</small></p></div><div><span>4</span><p><b>綠點入帳</b><small>支持小農或兌換商品</small></p></div></div>
      </Panel>
    </div>
  );
}

function ImpactReceiptDetail({ item }: { item: LocalProject }) {
  const isRedeem = item.kind === "redeem";
  const impactValue = item.impact.match(/\d+(?:\.\d+)?%?/)?.[0] || "追蹤中";

  return (
    <div className={`impact-receipt ${isRedeem ? "receipt-redeem" : ""}`}>
      <div className="receipt-hero">
        <div><small>{isRedeem ? "GFES PRODUCT IMPACT RECEIPT" : "GFES IMPACT RECEIPT"}</small><h3>{item.points} 綠點，正在地方產生改變</h3><p>{item.title}</p></div>
        <span>{isRedeem ? <ShoppingBasket /> : <Leaf />}</span>
      </div>
      <div className="impact-flow">
        <div><User /><b>你的綠色消費</b></div><ArrowRight /><div><HandCoins /><b>{item.points} 綠點</b></div><ArrowRight /><div>{isRedeem ? <ShoppingBasket /> : <Sprout />}<b>{item.farmer}</b></div>
      </div>
      <div className="receipt-metrics">
        <article><strong>{item.points}</strong><span>使用綠點</span></article>
        <article><strong>100%</strong><span>{isRedeem ? "形成在地訂單" : "投入專案用途"}</span></article>
        <article><strong>{impactValue}</strong><span>{isRedeem ? "產地支持成果" : "預估環境成果"}</span></article>
      </div>
      <div className="receipt-story-grid">
        <section>
          <h4>{isRedeem ? "兌換如何支持產地" : "資源如何被使用"}</h4>
          {(isRedeem
            ? [["小農商品收入", "60%"], ["產地理貨與冷藏", "25%"], ["循環包裝與配送", "15%"]]
            : [["設備與材料", "55%"], ["施工與改善", "30%"], ["成果追蹤", "15%"]]
          ).map(([label, value]) => (
            <div className="allocation" key={label}><span><b>{label}</b><em>{value}</em></span><div className="progress"><i style={{ width: value }} /></div></div>
          ))}
        </section>
        <section>
          <h4>{isRedeem ? "訂單與影響里程碑" : "專案里程碑"}</h4>
          <div className="receipt-timeline">
            <div className="done"><span><Check /></span><p><b>{isRedeem ? "商品兌換完成" : "綠點支持完成"}</b><small>2026/07/31</small></p></div>
            <div className="active"><span>2</span><p><b>{isRedeem ? "小農備貨與產地配送" : "採購與改善進行中"}</b><small>{isRedeem ? "可至兌換訂單查看最新進度" : "預計 2026/08 完成"}</small></p></div>
            <div><span>3</span><p><b>{isRedeem ? "地方成果持續累積" : "成果驗證與回報"}</b><small>{isRedeem ? "訂單收入支持下一批友善生產" : "完成後更新綠色信用"}</small></p></div>
          </div>
        </section>
      </div>
      <footer className="receipt-footer"><span>收據編號 {getReceiptNumber(item)}</span><b>每一次消費，都是地方改變的起點。</b></footer>
    </div>
  );
}

function ConsumerReceiptPage({
  items,
  onDownload,
  onExplore,
  onLearnMore,
}: {
  items: LocalProject[];
  onDownload: (item: LocalProject) => void;
  onExplore: () => void;
  onLearnMore: (id: string) => void;
}) {
  const [activeId, setActiveId] = useState(items[items.length - 1]?.id || "");

  useEffect(() => {
    if (items.length && !items.some((item) => item.id === activeId)) setActiveId(items[items.length - 1].id);
  }, [items, activeId]);

  if (!items.length) {
    return (
      <div className="dashboard-grid"><Panel className="span-12 subpage-empty" title="尚未產生影響力收據" note="支持改善專案或兌換小農好物後，收據會自動出現在這裡">
        <div className="empty-receipt"><span><FileCheck2 /></span><h3>第一張影響力收據等你完成</h3><p>支持小農改善或兌換任一項小農好物，就能追蹤綠點流向、產地故事與地方成果。</p></div>
        <button className="button button-primary" onClick={onExplore}>前往「用綠點支持在地」</button>
      </Panel></div>
    );
  }

  const activeItem = items.find((item) => item.id === activeId) || items[items.length - 1];
  const totalPoints = items.reduce((sum, item) => sum + item.points, 0);
  const redeemedCount = items.filter((item) => item.kind === "redeem").length;

  return (
    <div className="dashboard-grid"><Panel className="span-12 receipt-page-panel" title="影響力收據" note={`共 ${items.length} 張・含 ${redeemedCount} 張商品兌換收據・累計使用 ${totalPoints} 綠點`}>
      <div className="receipt-library">
        <div className="receipt-selector" aria-label="小農影響力收據列表">
          {items.map((item) => (
            <article key={item.id} className={`receipt-selector-card ${item.id === activeItem.id ? "active" : ""}`}>
              <button className="receipt-select-main" onClick={() => setActiveId(item.id)}>
                <img src={item.image} alt={item.farmer + (item.kind === "redeem" ? "商品照片" : "專案照片")} />
                <span><small>{item.kind === "redeem" ? "商品兌換" : "改善支持"}・{getReceiptNumber(item)}</small><b>{item.farmer}</b><em>{item.purpose}</em></span>
                <strong>{item.points}<small>綠點</small></strong>
                <ChevronRight />
              </button>
              <button className="receipt-more-button" onClick={() => onLearnMore(item.id)}>了解更多<ArrowRight /></button>
            </article>
          ))}
        </div>
        <section className="receipt-selected">
          <header><div><small>目前查看・{activeItem.kind === "redeem" ? "商品兌換" : "改善支持"}</small><h3>{activeItem.farmer}的影響力收據</h3></div><span>{items.findIndex((item) => item.id === activeItem.id) + 1}／{items.length}</span></header>
          <ImpactReceiptDetail item={activeItem} />
          <button className="button button-secondary receipt-story-button" onClick={() => onLearnMore(activeItem.id)}>了解更多完整故事<ArrowRight /></button>
        </section>
      </div>
      <div className="subpage-actions"><button className="button button-secondary" onClick={onExplore}><HeartHandshake />繼續支持在地</button><button className="button button-primary" onClick={() => onDownload(activeItem)}><Download />下載這張收據</button></div>
    </Panel></div>
  );
}

const orderSteps = [
  { title: "訂單成立", note: "綠點完成扣除，訂單與影響力收據同步建立", icon: PackageCheck },
  { title: "小農備貨", note: "小農依採收批次理貨、品管並完成低溫包裝", icon: Store },
  { title: "產地配送", note: "物流完成收件，可在 Demo 中查看模擬追蹤資訊", icon: Truck },
  { title: "配送完成", note: "商品送達，這筆在地訂單持續支持友善生產", icon: CheckCircle2 },
] as const;

function ConsumerOrdersPage({
  items,
  stages,
  initialId,
  onAdvance,
  onReceipt,
  onExplore,
}: {
  items: LocalProject[];
  stages: Record<string, number>;
  initialId: string;
  onAdvance: (id: string) => void;
  onReceipt: () => void;
  onExplore: () => void;
}) {
  const [activeId, setActiveId] = useState(initialId);

  useEffect(() => {
    if (items.length && !items.some((item) => item.id === activeId)) setActiveId(items[items.length - 1].id);
  }, [items, activeId]);

  if (!items.length) {
    return (
      <div className="dashboard-grid"><Panel className="span-12 subpage-empty" title="尚未建立兌換訂單" note="兌換任一項小農生產好物後，即可體驗完整配送路徑">
        <div className="empty-receipt"><span><ShoppingBasket /></span><h3>從一份小農好物開始</h3><p>完成兌換後，系統會建立訂單、影響力收據與模擬物流進度。</p></div>
        <button className="button button-primary" onClick={onExplore}>前往兌換小農好物</button>
      </Panel></div>
    );
  }

  const activeItem = items.find((item) => item.id === activeId) || items[items.length - 1];
  const stage = Math.min(3, stages[activeItem.id] ?? 0);
  const orderNumber = `GFES-ORD-${getReceiptNumber(activeItem).split("-").at(-1)}`;

  return (
    <div className="dashboard-grid">
      <Panel className="span-12 order-page-panel" title="兌換小農生產好物訂單" note={`共 ${items.length} 筆訂單・逐步模擬從成立到配送完成`}>
        <div className="order-layout">
          <div className="order-list" aria-label="兌換訂單列表">
            {items.map((item) => {
              const itemStage = Math.min(3, stages[item.id] ?? 0);
              return (
                <button key={item.id} className={item.id === activeItem.id ? "active" : ""} onClick={() => setActiveId(item.id)}>
                  <img src={item.image} alt={item.title} />
                  <span><small>{itemStage === 3 ? "已送達" : orderSteps[itemStage].title}</small><b>{item.title}</b><em>{item.farmer}</em></span>
                  <ChevronRight />
                </button>
              );
            })}
          </div>
          <section className="order-detail">
            <header>
              <div><small>訂單編號 {orderNumber}</small><h3>{activeItem.title}</h3><p>{activeItem.farmer}</p></div>
              <span className={`status-pill ${stage < 2 ? "waiting" : ""}`}>{stage === 3 ? "配送完成" : orderSteps[stage].title}</span>
            </header>
            <div className="order-product"><img src={activeItem.image} alt={activeItem.title} /><div><small>兌換內容</small><h4>{activeItem.title}</h4><p>{activeItem.note}</p><strong>{activeItem.points} 綠點</strong></div></div>
            <div className="order-meta"><article><small>配送方式</small><b>{activeItem.purpose}</b></article><article><small>收件資訊</small><b>林子晴・台北市中山區</b></article><article><small>物流單號</small><b>{stage >= 2 ? `TCAT-260731-${activeItem.points}` : "待小農交寄"}</b></article></div>
            <div className="order-timeline">
              {orderSteps.map((step, index) => {
                const Icon = step.icon;
                return <div key={step.title} className={index < stage ? "done" : index === stage ? "active" : ""}><span>{index < stage ? <Check /> : <Icon />}</span><p><b>{step.title}</b><small>{step.note}</small></p></div>;
              })}
            </div>
            <div className="order-actions">
              <button className="button button-secondary" onClick={onReceipt}><FileCheck2 />查看影響力收據</button>
              <button className="button button-primary" onClick={() => onAdvance(activeItem.id)} disabled={stage >= 3}>{stage >= 3 ? "配送已完成" : `模擬下一步：${orderSteps[stage + 1].title}`}<ArrowRight /></button>
            </div>
          </section>
        </div>
      </Panel>
    </div>
  );
}
function FarmerEvidencePage({
  evidence,
  onSubmit,
  onFunding,
}: {
  evidence: boolean;
  onSubmit: () => void;
  onFunding: () => void;
}) {
  return (
    <div className="dashboard-grid">
      <Panel className="span-7 subpage-primary" title="永續資料進度" note="完整且可追溯的資料，是綠色信用的基礎">
        <div className="evidence-list"><Evidence title="友善耕作紀錄" note="最近更新：2026/07/18" done /><Evidence title="循環回收與資材管理" note="最近更新：2026/07/10" done /><Evidence title="低碳設備使用證明" note={evidence ? "已完成 Demo 驗證" : "待補充設備與使用紀錄"} done={evidence} /><Evidence title="農產履歷與批次資訊" note="最近更新：2026/07/22" done /></div>
      </Panel>
      <Panel className="span-5" title={evidence ? "資料驗證完成" : "補充低碳作業證明"} note={evidence ? "綠色信用已同步更新" : "上傳範例文件即可完成 Demo"}>
        {evidence ? <Success title="信用提升至 86 分" text="低碳設備使用證明已完成驗證，可查看新的資金解鎖狀態。"><button className="button button-primary" onClick={onFunding}>查看信用解鎖方案</button></Success> : <><div className="upload-box"><Upload /><b>低碳設備使用紀錄.pdf</b><small>Demo 已準備範例文件</small></div><div className="receipt-box"><Row label="設備" value="節水灌溉控制器" /><Row label="使用期間" value="2026/04–2026/07" /><Row label="預估分數" value="82 → 86" /></div><button className="button button-primary button-block" onClick={onSubmit}>模擬送出並驗證</button></>}
      </Panel>
    </div>
  );
}

function FarmerFundingPage({
  score,
  evidence,
  onEvidence,
  onOffer,
}: {
  score: number;
  evidence: boolean;
  onEvidence: () => void;
  onOffer: (id: string) => void;
}) {
  const unlockedOffers = fundingOffers.filter((offer) => score >= offer.requiredScore);
  const nextOffer = fundingOffers.find((offer) => score < offer.requiredScore);
  const nextGap = nextOffer ? nextOffer.requiredScore - score : 0;
  return (
    <div className="dashboard-grid"><Panel className="span-12 subpage-primary" title="依綠色信用解鎖適合方案" note="方案門檻、額度、用途與申請流程皆可完整體驗">
      <div className="funding-unlock-summary"><div className="funding-current"><span><BadgeCheck /></span><div><small>目前綠色信用</small><strong>{score} 分</strong><p>已解鎖 {unlockedOffers.length}／{fundingOffers.length} 項方案</p></div></div>{nextOffer ? <div className="funding-next"><div><span>下一個解鎖目標</span><b>{nextOffer.requiredScore} 分・{nextOffer.name}</b></div><div className="progress"><span style={{ width: Math.min((score / nextOffer.requiredScore) * 100, 100) + "%" }} /></div><small>再累積 <b>{nextGap} 分</b>，即可解鎖 {nextOffer.amount}</small></div> : <div className="funding-next complete"><b>所有示範方案皆已解鎖</b></div>}<button className="button button-primary" onClick={onEvidence}><Upload />{evidence ? "查看信用提升紀錄" : "補資料、加速解鎖"}</button></div>
      <div className="funding-legend"><span><i className="support" />資金支持／成果核銷</span><span><i className="loan" />優惠融資／分期運用</span><span><LockKeyhole />金色虛線為待解鎖</span></div>
      <div className="offer-list funding-offer-grid">{fundingOffers.map((offer) => <Offer key={offer.id} category={offer.category} name={offer.name} amount={offer.amount} term={offer.term} rate={offer.rate} description={offer.description} purpose={offer.purpose} requiredScore={offer.requiredScore} currentScore={score} recommended={"recommended" in offer && offer.recommended} onClick={() => onOffer(offer.id)} />)}</div>
    </Panel></div>
  );
}

type PortfolioView = "overview" | "sustainability" | "assessment";

function InstitutionPortfolioPage({
  selectedName,
  setSelectedName,
}: {
  selectedName: string;
  setSelectedName: (name: string) => void;
}) {
  const selected = farmers.find((item) => item.name === selectedName) || farmers[0];
  const [view, setView] = useState<PortfolioView>("overview");
  const [assessmentStep, setAssessmentStep] = useState(0);

  useEffect(() => {
    setView("overview");
    setAssessmentStep(0);
  }, [selectedName]);

  function openAssessment() {
    setAssessmentStep(0);
    setView("assessment");
  }

  return (
    <div className="dashboard-grid"><Panel className="span-12 subpage-primary" title="農戶信用與資金媒合" note="從左側選擇農戶，查看完整評估資料">
      <div className="portfolio-summary"><article><strong>4 戶</strong><span>示範農戶</span></article><article><strong>276 萬</strong><span>申請資金</span></article><article><strong>85.0</strong><span>平均綠色信用</span></article><article><strong>75%</strong><span>可進入媒合</span></article></div>
      <div className="portfolio-layout">
        <div className="portfolio-list">{farmers.map((item) => <button className={item.name === selected.name ? "active" : ""} onClick={() => setSelectedName(item.name)} key={item.name}><span className="portfolio-avatar"><Sprout /></span><span><b>{item.name}</b><small>{item.area}・{item.crop}・{item.purpose}</small></span><em>{item.score}</em></button>)}</div>
        <section className="portfolio-detail">
          <header><div><small>目前查看</small><h3>{selected.name}</h3><p>{selected.area}地區・{selected.crop}農戶</p></div><span className={"status-pill " + (selected.status === "待補件" ? "waiting" : "")}>{selected.status}</span></header>
          <div className="portfolio-credit"><div className="mini-score">{selected.score}<small>綠色信用</small></div><div><b>資料完整度 {selected.completeness}%</b><div className="progress"><span style={{ width: selected.completeness + "%" }} /></div><small>{selected.completeness < 80 ? "需補充設備估價與減碳資料" : "資料足以進入資金評估"}</small></div></div>
          <div className="receipt-box"><Row label="申請資金" value={selected.amount} /><Row label="主要用途" value={selected.purpose} /><Row label="本月綠點支持" value={selected.name === "禾日友善農園" ? "12,680 點" : "8,240 點"} /><Row label="預估環境效益" value={selected.crop === "稻米" ? "減碳 8.6 噸／年" : "資源效率提升 15%"} /></div>
          <div className="portfolio-actions"><button className="button button-secondary" onClick={() => setView("sustainability")}><Leaf />查看永續資料</button><button className="button button-primary" onClick={openAssessment}><FileCheck2 />進入模擬評估</button></div>
        </section>
      </div>

      {view === "sustainability" && (
        <section className="portfolio-workspace">
          <header><div><small>{selected.name}</small><h3>永續資料與驗證紀錄</h3><p>金融機構可檢視資料來源、更新時間與驗證狀態。</p></div><button className="button button-secondary" onClick={() => setView("overview")}>收起資料</button></header>
          <div className="sustainability-metrics"><article><span><Trees /></span><div><small>環境改善</small><strong>{selected.crop === "稻米" ? "減碳 8.6 噸" : "效率 +15%"}</strong></div></article><article><span><FileCheck2 /></span><div><small>資料完整度</small><strong>{selected.completeness}%</strong></div></article><article><span><BadgeCheck /></span><div><small>綠色信用</small><strong>{selected.score} 分</strong></div></article></div>
          <div className="sustainability-records">
            <div><span className="done"><Check /></span><p><b>友善耕作與生產紀錄</b><small>2026/07/22 更新・產銷履歷資料</small></p><em>已驗證</em></div>
            <div><span className="done"><Check /></span><p><b>水資源與能源使用資料</b><small>2026/07/18 更新・設備自動紀錄</small></p><em>已驗證</em></div>
            <div><span className={selected.completeness < 80 ? "waiting" : "done"}>{selected.completeness < 80 ? <Upload /> : <Check />}</span><p><b>設備改善與估價資料</b><small>{selected.completeness < 80 ? "尚缺設備估價單與預估效益" : "2026/07/12 更新・文件完整"}</small></p><em>{selected.completeness < 80 ? "待補件" : "已驗證"}</em></div>
            <div><span className="done"><Check /></span><p><b>地方供應與綠點支持紀錄</b><small>2026/07/31 更新・平台交易資料</small></p><em>已驗證</em></div>
          </div>
        </section>
      )}

      {view === "assessment" && (
        <section className="portfolio-workspace assessment-workspace">
          <header><div><small>{selected.name}</small><h3>模擬融資評估</h3><p>依綠色信用、資料完整度與申請用途產生 Demo 建議。</p></div><button className="button button-secondary" onClick={() => setView("overview")}>離開評估</button></header>
          <div className="assessment-stepper">{["資料檢核", "風險評估", "建議結果"].map((label, index) => <div className={index <= assessmentStep ? "active" : ""} key={label}><span>{index < assessmentStep ? <Check /> : index + 1}</span><b>{label}</b></div>)}</div>
          {assessmentStep === 0 && <div className="assessment-checks"><div><CheckCircle2 /><p><b>農戶基本與營運資料</b><small>農場、作物與近一期產銷資料已帶入</small></p><em>完成</em></div><div><CheckCircle2 /><p><b>綠色信用資料</b><small>{selected.score} 分・最近更新 2026/07/31</small></p><em>完成</em></div><div><CheckCircle2 /><p><b>資金用途與需求</b><small>{selected.purpose}・申請 {selected.amount}</small></p><em>完成</em></div><div className={selected.completeness < 80 ? "warning" : ""}>{selected.completeness < 80 ? <Upload /> : <CheckCircle2 />}<p><b>佐證文件</b><small>資料完整度 {selected.completeness}%</small></p><em>{selected.completeness < 80 ? "需補件" : "完成"}</em></div></div>}
          {assessmentStep === 1 && <div className="assessment-factors"><article><small>綠色信用</small><strong>{selected.score}<em>／100</em></strong><div className="progress"><span style={{ width: selected.score + "%" }} /></div><p>{selected.score >= 85 ? "永續紀錄穩定，優於示範門檻" : "達基本門檻，仍可持續提升"}</p></article><article><small>資料可信度</small><strong>{selected.completeness}<em>％</em></strong><div className="progress"><span style={{ width: selected.completeness + "%" }} /></div><p>{selected.completeness >= 90 ? "資料來源完整且可追溯" : "需補充部分佐證文件"}</p></article><article><small>用途適配度</small><strong>{selected.status === "待補件" ? "中" : "高"}</strong><div className="progress"><span style={{ width: selected.status === "待補件" ? "68%" : "92%" }} /></div><p>{selected.purpose}符合綠色農業改善方向</p></article></div>}
          {assessmentStep === 2 && <div className={"assessment-result " + (selected.completeness < 80 ? "conditional" : "approved")}><span>{selected.completeness < 80 ? <Upload /> : <BadgeCheck />}</span><div><small>Demo 評估建議</small><h3>{selected.completeness < 80 ? "補件後進入資金媒合" : "建議進入下一階段評估"}</h3><p>{selected.completeness < 80 ? "補上設備估價與環境效益試算後，可重新產生評估結果。" : `綠色信用 ${selected.score} 分、資料完整度 ${selected.completeness}%，建議依 ${selected.amount} 需求進行合作機構審查。`}</p><div><span>建議額度<b>{selected.amount}</b></span><span>主要用途<b>{selected.purpose}</b></span><span>追蹤條件<b>每季更新成果</b></span></div></div></div>}
          <div className="assessment-actions"><button className="button button-secondary" onClick={() => assessmentStep === 0 ? setView("overview") : setAssessmentStep(assessmentStep - 1)}>{assessmentStep === 0 ? "取消評估" : "上一步"}</button><button className="button button-primary" onClick={() => assessmentStep === 2 ? setView("overview") : setAssessmentStep(assessmentStep + 1)}>{assessmentStep === 2 ? "完成評估" : assessmentStep === 0 ? "開始風險評估" : "產生建議結果"}</button></div>
        </section>
      )}
    </Panel></div>
  );
}

function InstitutionReportPage({ onDownload }: { onDownload: () => void }) {
  return (
    <>
      <div className="metrics"><Metric icon={Users} value="128 戶" label="受支持農戶" delta="+9.4%" /><Metric icon={HandCoins} value="386 萬" label="媒合金融資源" delta="+18.2%" /><Metric icon={Trees} value="62.4 噸" label="估算減碳成果" delta="+12.1%" /><Metric icon={TrendingUp} value="84.6" label="平均綠色信用" delta="+2.8" /></div>
      <div className="dashboard-grid">
        <Panel className="span-8 subpage-primary" title="影響力成長趨勢" note="近六個月媒合金融資源，單位：萬元"><Chart><BarChart data={fundTrend}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="funds" name="媒合資金" fill="#2d7250" radius={[8, 8, 0, 0]} /></BarChart></Chart></Panel>
        <Panel className="span-4" title="本期成果摘要" note="可供合作機構揭露與追蹤"><div className="report-highlights"><div><span><Trees /></span><p><b>環境成果</b><small>節水、減碳與友善棲地持續增加</small></p></div><div><span><Users /></span><p><b>地方成果</b><small>支持農戶與地方供應鏈穩定成長</small></p></div><div><span><Banknote /></span><p><b>金融成果</b><small>綠色信用協助資源精準投入</small></p></div></div></Panel>
        <Panel className="span-12" title="報告涵蓋範圍" note="所有數據均為 Demo 模擬資料" action={<button className="button button-primary" onClick={onDownload}><Download />下載影響力摘要</button>}><div className="table-wrap"><table><thead><tr><th>指標</th><th>本期成果</th><th>資料來源</th><th>更新頻率</th></tr></thead><tbody><tr><td>受支持農戶</td><td>128 戶</td><td>綠點支持與農戶專案</td><td>每月</td></tr><tr><td>媒合金融資源</td><td>386 萬元</td><td>合作機構媒合紀錄</td><td>每月</td></tr><tr><td>估算減碳成果</td><td>62.4 噸</td><td>小農永續成果回報</td><td>每季</td></tr><tr><td>平均綠色信用</td><td>84.6 分</td><td>綠色信用評估系統</td><td>即時</td></tr></tbody></table></div></Panel>
      </div>
    </>
  );
}

function Panel({
  title,
  note,
  action,
  className = "",
  children,
}: {
  title: string;
  note: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`panel ${className}`}>
      <header className="panel-head"><div><h2>{title}</h2><p>{note}</p></div>{action}</header>
      {children}
    </section>
  );
}

function Chart({ children }: { children: React.ReactElement }) {
  return <div className="chart"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>;
}

function Metric({ icon: Icon, value, label, delta }: { icon: typeof Users; value: string; label: string; delta: string }) {
  return (
    <article className="metric">
      <div><span><Icon /></span><small>{delta}</small></div>
      <strong>{value}</strong><p>{label}</p>
    </article>
  );
}

function ActionModal({
  item,
  done,
  balance,
  onClose,
  onConfirm,
}: {
  item: LocalProject;
  done: boolean;
  balance: number;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const insufficient = !done && balance < item.points;
  const isSupport = item.kind === "support";
  return (
    <ModalShell title={isSupport ? "支持小農改善專案" : "兌換小農好物"} onClose={onClose} small>
      <div className="action-project">
        <img src={item.image} alt={item.title} />
        <div><small>{item.farmer}</small><h3>{item.title}</h3><p>{item.note}</p></div>
      </div>
      <div className="receipt-box"><Row label={isSupport ? "支持綠點" : "兌換綠點"} value={`${item.points} 點`} /><Row label="目前可用" value={`${balance.toLocaleString()} 點`} /><Row label={isSupport ? "資源用途" : "配送方式"} value={item.purpose} /><Row label="預期成果" value={item.impact} /></div>
      {insufficient && <div className="points-insufficient"><span>綠點不足</span><b>還差 {(item.points - balance).toLocaleString()} 點</b><small>可先回傳綠色消費證明取得更多綠點。</small></div>}
      <div className="modal-actions"><button className="button button-secondary" onClick={onClose}>取消</button><button className="button button-primary" onClick={onConfirm} disabled={insufficient}>{done ? (isSupport ? "查看影響力收據" : "查看兌換狀態") : insufficient ? "綠點不足" : isSupport ? `確認支持 ${item.points} 點` : `確認兌換 ${item.points} 點`}</button></div>
    </ModalShell>
  );
}

function Project({
  image,
  title,
  note,
  progress,
  button,
  onClick,
  onLearnMore,
  gold,
}: {
  image: string;
  title: string;
  note: string;
  progress: number;
  button: string;
  onClick: () => void;
  onLearnMore: () => void;
  gold?: boolean;
}) {
  return (
    <article className="project">
      <img src={image} alt={title} />
      <div><h3>{title}</h3><p>{note}</p><div className="progress"><span style={{ width: `${progress}%` }} /></div></div>
      <div className="project-actions">
        <button className="button button-secondary" onClick={onLearnMore}>了解更多</button>
        <button className={`button ${gold ? "button-gold" : "button-primary"}`} onClick={onClick}>{button}</button>
      </div>
    </article>
  );
}

function Activity({ icon: Icon, title, note, value }: { icon: typeof Store; title: string; note: string; value: string }) {
  return (
    <div className="activity"><span><Icon /></span><div><b>{title}</b><small>{note}</small></div><time>{value}</time></div>
  );
}

function Evidence({ title, note, done }: { title: string; note: string; done: boolean }) {
  return (
    <div className="evidence"><span className={done ? "done" : ""} /><div><b>{title}</b><small>{note}</small></div><em>{done ? "已完成" : "待補件"}</em></div>
  );
}

function Offer({
  category,
  name,
  amount,
  term,
  rate,
  description,
  purpose,
  requiredScore,
  currentScore,
  onClick,
  recommended = false,
}: {
  category: string;
  name: string;
  amount: string;
  term: string;
  rate: string;
  description: string;
  purpose: string;
  requiredScore: number;
  currentScore: number;
  onClick: () => void;
  recommended?: boolean;
}) {
  const locked = currentScore < requiredScore;
  const gap = Math.max(requiredScore - currentScore, 0);
  return (
    <article className={`offer ${locked ? "locked" : ""}`}>
      <div className="offer-kicker">
        <span className={category === "資金支持" ? "support" : "loan"}>{category}</span>
        <span className={`offer-status ${locked ? "locked" : ""}`}>
          {locked ? <LockKeyhole /> : <CheckCircle2 />}
          {locked ? "待解鎖" : recommended ? "最適合你" : "已解鎖"}
        </span>
      </div>
      <header className="offer-header"><b>{name}</b><small>{requiredScore} 分門檻</small></header>
      <p className="offer-description">{description}</p>
      <div className="offer-data">
        <small>可申請額度<b>{amount}</b></small>
        <small>使用／方案期間<b>{term}</b></small>
      </div>
      <div className="offer-rate">{rate}</div>
      {locked ? (
        <>
          <div className="locked-benefit"><LockKeyhole /><span><b>解鎖後可運用</b><small>{purpose}</small></span></div>
          <div className="unlock-progress">
            <div><span>目前 {currentScore} 分</span><b>目標 {requiredScore} 分</b></div>
            <div className="progress"><span style={{ width: `${Math.min((currentScore / requiredScore) * 100, 100)}%` }} /></div>
            <small>再提升 {gap} 分即可解鎖</small>
          </div>
        </>
      ) : (
        <div className="offer-threshold"><BadgeCheck />已達成綠色信用 {requiredScore} 分門檻</div>
      )}
      <button className={`button button-block ${locked ? "button-locked" : "button-secondary"}`} onClick={onClick}>
        {locked ? <LockKeyhole /> : <ChevronRight />}
        {locked ? "查看解鎖方法" : "模擬申請完整流程"}
      </button>
    </article>
  );
}

function InvoiceModal({
  stage,
  onVerify,
  onClose,
}: {
  stage: "form" | "scanning" | "success";
  onVerify: () => void;
  onClose: () => void;
}) {
  return (
    <ModalShell title="回傳消費證明" onClose={onClose} wide>
      {stage === "success" ? (
        <Success title="驗證完成，獲得 120 綠點" text="這筆友善農產消費已通過 Demo 驗證，綠點已加入你的錢包。">
          <button className="button button-primary button-block" onClick={onClose}>回到綠點錢包</button>
        </Success>
      ) : stage === "scanning" ? (
        <Success title="正在驗證發票" text="Demo 正在核對發票日期、號碼、消費金額與綠色消費資格。">
          <div className="progress"><span style={{ width: "76%" }} /></div>
        </Success>
      ) : <InvoiceEntryContent onVerify={onVerify} />}
    </ModalShell>
  );
}

function ReceiptModal({
  supported,
  item,
  onDownload,
  onExplore,
  onClose,
}: {
  supported: boolean;
  item: (typeof localProjects)[number];
  onDownload: () => void;
  onExplore: () => void;
  onClose: () => void;
}) {
  if (!supported) {
    return (
      <ModalShell title="影響力收據" onClose={onClose} small>
        <div className="empty-receipt"><span><FileCheck2 /></span><h3>第一張影響力收據等你完成</h3><p>支持任一小農改善專案後，就能在這裡追蹤綠點流向、專案進度與地方成果。</p></div>
        <button className="button button-primary button-block" onClick={onExplore}>前往「用綠點支持在地」</button>
      </ModalShell>
    );
  }
  return (
    <ModalShell title="你的影響力收據" onClose={onClose}>
      <div className="impact-receipt">
        <div className="receipt-hero">
          <div><small>GFES IMPACT RECEIPT</small><h3>{item.points} 綠點，正在地方產生改變</h3><p>{item.title}</p></div>
          <span><Leaf /></span>
        </div>
        <div className="impact-flow">
          <div><User /><b>你的綠色消費</b></div><ArrowRight /><div><HandCoins /><b>{item.points} 綠點</b></div><ArrowRight /><div><Sprout /><b>{item.farmer}</b></div>
        </div>
        <div className="receipt-metrics">
          <article><strong>{item.points}</strong><span>投入綠點</span></article>
          <article><strong>100%</strong><span>投入專案用途</span></article>
          <article><strong>{item.impact.match(/\d+(?:\.\d+)?%?/)?.[0] || "追蹤中"}</strong><span>預估環境成果</span></article>
        </div>
        <div className="receipt-story-grid">
          <section>
            <h4>資源如何被使用</h4>
            <div className="allocation"><span><b>設備與材料</b><em>55%</em></span><div className="progress"><i style={{ width: "55%" }} /></div></div>
            <div className="allocation"><span><b>施工與改善</b><em>30%</em></span><div className="progress"><i style={{ width: "30%" }} /></div></div>
            <div className="allocation"><span><b>成果追蹤</b><em>15%</em></span><div className="progress"><i style={{ width: "15%" }} /></div></div>
          </section>
          <section>
            <h4>專案里程碑</h4>
            <div className="receipt-timeline">
              <div className="done"><span><Check /></span><p><b>綠點支持完成</b><small>2026/07/31</small></p></div>
              <div className="active"><span>2</span><p><b>採購與改善進行中</b><small>預計 2026/08 完成</small></p></div>
              <div><span>3</span><p><b>成果驗證與回報</b><small>完成後更新綠色信用</small></p></div>
            </div>
          </section>
        </div>
        <footer className="receipt-footer"><span>收據編號 {getReceiptNumber(item)}</span><b>每一次消費，都是地方改變的起點。</b></footer>
      </div>
      <div className="modal-actions"><button className="button button-secondary" onClick={onDownload}><Download />下載收據</button><button className="button button-secondary" onClick={onExplore}><HeartHandshake />回到支持在地</button><button className="button button-primary" onClick={onClose}>完成</button></div>
    </ModalShell>
  );
}

function EvidenceModal({ added, onClose, onSubmit }: { added: boolean; onClose: () => void; onSubmit: () => void }) {
  return (
    <ModalShell title="補充低碳作業證明" onClose={onClose} small>
      {added ? (
        <Success title="證明已完成 Demo 驗證" text="綠色信用已由 82 分提升至 86 分，金融媒合條件同步更新。">
          <button className="button button-primary button-block" onClick={onClose}>返回信用總覽</button>
        </Success>
      ) : (
        <>
          <div className="upload-box"><Upload /><b>低碳設備使用紀錄.pdf</b><small>Demo 已準備範例文件，可直接模擬送出</small></div>
          <div className="receipt-box"><Row label="設備" value="節水灌溉控制器" /><Row label="使用期間" value="2026/04–2026/07" /><Row label="預估分數" value="82 → 86" /></div>
          <div className="modal-actions"><button className="button button-secondary" onClick={onClose}>取消</button><button className="button button-primary" onClick={onSubmit}>模擬送出並驗證</button></div>
        </>
      )}
    </ModalShell>
  );
}

function OfferModal({
  score,
  offerId,
  step,
  setStep,
  onClose,
}: {
  score: number;
  offerId: string;
  step: number;
  setStep: (step: number) => void;
  onClose: () => void;
}) {
  const offer = fundingOffers.find((item) => item.id === offerId) || fundingOffers[1];
  const locked = score < offer.requiredScore;
  const gap = Math.max(offer.requiredScore - score, 0);
  const steps = ["方案確認", "填寫申請", "文件檢查", "送件確認"];

  if (locked) {
    return (
      <ModalShell title="信用解鎖資金方案" onClose={onClose} small>
        <div className="unlock-hero"><span className="unlock-orb"><LockKeyhole /></span><div><small>目前綠色信用</small><strong>{score} 分</strong><p>再提升 {gap} 分，即可解鎖「{offer.name}」。</p></div></div>
        <div className="unlock-map">
          <div className="unlock-step done"><span><Check /></span><div><b>完成永續資料建檔</b><small>友善耕作、循環資材與產銷履歷已建立</small></div></div>
          <div className="unlock-step active"><span>2</span><div><b>優先提升低碳作業與資訊透明</b><small>補充用電、用水、設備成效或產銷批次紀錄，預估可增加 2–4 分</small></div></div>
          <div className="unlock-step locked"><span><LockKeyhole /></span><div><b>{offer.requiredScore} 分解鎖申請</b><small>{offer.amount}・{offer.term}・{offer.rate.replace("Demo ", "")}</small></div></div>
        </div>
        <button className="button button-primary button-block" onClick={onClose}>返回累積綠色信用</button>
      </ModalShell>
    );
  }

  if (step === 4) {
    return (
      <ModalShell title="信用解鎖資金方案" onClose={onClose} small>
        <Success title="Demo 申請已成功送出" text="合作金融機構將依綠色信用與申請資料進行初步評估。">
          <div className="application-number"><small>案件編號</small><strong>GF-20260731-0068</strong></div>
        </Success>
        <div className="application-timeline">
          <div className="done"><span><Check /></span><p><b>完成送件</b><small>今天</small></p></div>
          <div className="active"><span>2</span><p><b>資料初審</b><small>預估 1–2 個工作天</small></p></div>
          <div><span>3</span><p><b>專員聯繫與媒合</b><small>預估 3–5 個工作天</small></p></div>
        </div>
        <button className="button button-primary button-block" onClick={onClose}>返回小農中心</button>
      </ModalShell>
    );
  }

  return (
    <ModalShell title="信用解鎖資金方案" onClose={onClose}>
      <div className="application-stepper">
        {steps.map((label, index) => <div className={index <= step ? "active" : ""} key={label}><span>{index < step ? <Check /> : index + 1}</span><b>{label}</b></div>)}
      </div>
      {step === 0 && (
        <div className="application-layout">
          <div className="application-offer"><span className="offer-status"><CheckCircle2 />信用已解鎖・{offer.category}</span><h3>{offer.name}</h3><p>{offer.description}</p><div><span>額度<b>{offer.amount}</b></span><span>期間<b>{offer.term}</b></span><span>條件<b>{offer.rate.replace("Demo ", "")}</b></span></div></div>
          <div className="receipt-box"><Row label="目前綠色信用" value={`${score} 分`} /><Row label="建議申請金額" value={offer.suggestedLabel} /><Row label={offer.category === "資金支持" ? "支持方式" : "預估每月還款"} value={offer.paymentLabel} /><Row label="適用用途" value={offer.purpose} /></div>
        </div>
      )}
      {step === 1 && (
        <div className="form-grid application-form">
          <label>申請金額<input type="number" defaultValue={offer.suggestedAmount} /></label>
          <label>期望期間<select defaultValue={offer.term}><option>{offer.term}</option><option>依審查建議調整</option></select></label>
          <label className="full">資金用途<select defaultValue={offer.purpose}><option>{offer.purpose}</option><option>節水灌溉與能源設備</option><option>友善資材與營運週轉</option><option>循環包材與冷鏈</option></select></label>
          <label className="full">改善計畫<textarea defaultValue={offer.planText} /></label>
        </div>
      )}
      {step === 2 && (
        <div className="document-checklist">
          <div><span><Check /></span><p><b>農場基本與營運資料</b><small>已從小農中心帶入</small></p><em>完成</em></div>
          <div><span><Check /></span><p><b>綠色信用評估資料</b><small>目前 {score} 分，符合方案門檻</small></p><em>完成</em></div>
          <div><span><Check /></span><p><b>設備估價單</b><small>節水灌溉設備估價單.pdf</small></p><em>Demo 已附</em></div>
          <div><span><Check /></span><p><b>最近一期產銷紀錄</b><small>2026 年第二季產銷摘要.pdf</small></p><em>Demo 已附</em></div>
        </div>
      )}
      {step === 3 && (
        <div className="review-card">
          <div className="review-head"><span><FileCheck2 /></span><div><small>送件前最後確認</small><h3>{offer.name}</h3></div></div>
          <div className="receipt-box"><Row label="申請農戶" value="禾日友善農園" /><Row label="方案類型" value={offer.category} /><Row label="申請金額" value={offer.suggestedLabel} /><Row label="資金用途" value={offer.purpose} /><Row label="文件狀態" value="4 / 4 已備妥" /></div>
          <label className="consent"><input type="checkbox" defaultChecked />我同意將本次 Demo 申請資料提供合作金融機構進行模擬評估。</label>
        </div>
      )}
      <p className="fine-print">本流程為提案 Demo，不會送出真實申請；正式額度、利率與核准結果仍由金融機構依授信條件評估。</p>
      <div className="modal-actions"><button className="button button-secondary" onClick={() => step === 0 ? onClose() : setStep(step - 1)}>{step === 0 ? "取消" : "上一步"}</button><button className="button button-primary" onClick={() => setStep(step + 1)}>{step === 3 ? "確認送出申請" : step === 0 ? "開始填寫申請" : "下一步"}</button></div>
    </ModalShell>
  );
}

function InstitutionPortfolioModal({
  selectedName,
  setSelectedName,
  onClose,
}: {
  selectedName: string;
  setSelectedName: (name: string) => void;
  onClose: () => void;
}) {
  const selected = farmers.find((item) => item.name === selectedName) || farmers[0];
  return (
    <ModalShell title="農戶組合與資金媒合" onClose={onClose}>
      <div className="portfolio-summary">
        <article><strong>4 戶</strong><span>示範農戶</span></article><article><strong>276 萬</strong><span>申請資金</span></article><article><strong>85.0</strong><span>平均綠色信用</span></article><article><strong>75%</strong><span>可進入媒合</span></article>
      </div>
      <div className="portfolio-layout">
        <div className="portfolio-list">
          {farmers.map((item) => (
            <button className={item.name === selected.name ? "active" : ""} onClick={() => setSelectedName(item.name)} key={item.name}>
              <span className="portfolio-avatar"><Sprout /></span>
              <span><b>{item.name}</b><small>{item.area}・{item.crop}・{item.purpose}</small></span>
              <em>{item.score}</em>
            </button>
          ))}
        </div>
        <section className="portfolio-detail">
          <header><div><small>目前查看</small><h3>{selected.name}</h3><p>{selected.area}地區・{selected.crop}農戶</p></div><span className={`status-pill ${selected.status === "待補件" ? "waiting" : ""}`}>{selected.status}</span></header>
          <div className="portfolio-credit"><div className="mini-score">{selected.score}<small>綠色信用</small></div><div><b>資料完整度 {selected.completeness}%</b><div className="progress"><span style={{ width: `${selected.completeness}%` }} /></div><small>{selected.completeness < 80 ? "需補充設備估價與減碳資料" : "資料足以進入資金評估"}</small></div></div>
          <div className="receipt-box"><Row label="申請資金" value={selected.amount} /><Row label="主要用途" value={selected.purpose} /><Row label="本月綠點支持" value={selected.name === "禾日友善農園" ? "12,680 點" : "8,240 點"} /><Row label="預估環境效益" value={selected.crop === "稻米" ? "減碳 8.6 噸／年" : "資源效率提升 15%"} /></div>
          <div className="portfolio-actions"><button className="button button-secondary">查看永續資料</button><button className="button button-primary">進入模擬評估</button></div>
        </section>
      </div>
      <p className="fine-print">農戶、信用與資金資料皆為 Demo 模擬，用於展示金融機構如何檢視組合及媒合進度。</p>
    </ModalShell>
  );
}

function FarmerDetailModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell title="禾日友善農園" onClose={onClose} small>
      <div className="farmer-summary"><div className="mini-score">86<small>綠色信用</small></div><div><h3>資料完整、穩健成長</h3><p>雲林地區葉菜農戶，目前申請節水灌溉設備改善資源。</p></div></div>
      <div className="receipt-box"><Row label="支持綠點" value="12,680 點" /><Row label="媒合資金" value="68 萬元" /><Row label="資料完整度" value="100%" /><Row label="媒合狀態" value="審核中" /></div>
      <button className="button button-primary button-block" onClick={onClose}>返回農戶清單</button>
    </ModalShell>
  );
}

function Success({ title, text, children }: { title: string; text: string; children?: React.ReactNode }) {
  return (
    <div className="success"><span><Check /></span><h3>{title}</h3><p>{text}</p>{children}</div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="receipt-row"><span>{label}</span><b>{value}</b></div>;
}
