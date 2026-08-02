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
  | "local-story"
  | "product"
  | "program"
  | "farmer-project";

type IncentiveProgram = {
  id: string;
  name: string;
  sponsor: string;
  action: string;
  reward: string;
  budgetPoints: number;
  participants: string;
  progress: number;
  esg: string;
};
type FarmerProduct = {
  id: string;
  title: string;
  points: number;
  stock: number;
  unit: string;
  proof: string;
  delivery: string;
  description: string;
  image: string;
};

type ProjectAllocation = { label: string; percent: number };
type ProjectStory = { location: string; headline: string; quote: string; paragraphs: string[] };
type LocalProject = {
  id: string;
  kind: "support" | "redeem";
  image: string;
  title: string;
  farmer: string;
  note: string;
  purpose: string;
  points: number;
  progress: number;
  impact: string;
  targetPoints?: number;
  raisedPoints?: number;
  supporters?: number;
  city?: string;
  district?: string;
  distance?: number;
  completionDate?: string;
  proof?: string;
  allocations?: ProjectAllocation[];
  story?: ProjectStory;
};

type ImprovementProjectDraft = {
  title: string;
  note: string;
  purpose: string;
  points: number;
  targetPoints: number;
  impact: string;
  city: string;
  district: string;
  distance: number;
  completionDate: string;
  proof: string;
  allocations: ProjectAllocation[];
  story: ProjectStory;
};

const initialFarmerProducts: FarmerProduct[] = [
  { id: "leafy-box", title: "友善葉菜箱", points: 480, stock: 24, unit: "箱", proof: "產銷履歷 TAP-26-0718", delivery: "雲林縣與鄰近 40 公里", description: "六種當季友善葉菜，以循環箱低溫配送。", image: "https://images.pexels.com/photos/8232776/pexels-photo-8232776.jpeg?auto=compress&cs=tinysrgb&w=500" },
  { id: "rice-pack", title: "節水栽培米 2 公斤", points: 360, stock: 38, unit: "包", proof: "無農藥檢測合格", delivery: "全台常溫配送", description: "友善稻作與節水栽培紀錄完整，採減塑包裝。", image: "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=500" },
  { id: "herb-tea", title: "減塑香草茶", points: 260, stock: 17, unit: "組", proof: "友善耕作紀錄", delivery: "全台常溫配送", description: "自然乾燥香草茶包，附採收批次與沖泡說明。", image: "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=500" },
];

const roles = {
  consumer: {
    label: "消費者",
    account: "林子晴",
    description: "從消費、交通與電子帳單取得綠點，優先支持附近小農",
    icon: User,
  },
  farmer: {
    label: "合作小農",
    account: "禾日友善農園",
    description: "用農產履歷與友善耕作證明獲得支持，再用綠點兌換農業資源",
    icon: Sprout,
  },
  institution: {
    label: "銀行／政府／企業",
    account: "永續共好計畫辦公室",
    description: "設計綠點激勵計畫，累積可揭露的 ESG 與地方效益",
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

const supportTrend = [
  { month: "2月", funds: 168 },
  { month: "3月", funds: 205 },
  { month: "4月", funds: 244 },
  { month: "5月", funds: 278 },
  { month: "6月", funds: 326 },
  { month: "7月", funds: 478 },
];

const baseDimensions = [
  { name: "友善耕作", score: 88 },
  { name: "循環回收", score: 76 },
  { name: "低碳作業", score: 72 },
  { name: "資訊透明", score: 86 },
  { name: "地方共好", score: 90 },
];

const farmers = [
  { name: "禾日友善農園", area: "雲林", crop: "葉菜", score: 86, status: "執行中", amount: "12,680 點", purpose: "節水灌溉改善", completeness: 100 },
  { name: "青谷稻作", area: "嘉義", crop: "稻米", score: 91, status: "成果回報", amount: "9,420 點", purpose: "田埂棲地復育", completeness: 96 },
  { name: "山里果園", area: "花蓮", crop: "果樹", score: 79, status: "待補資料", amount: "7,860 點", purpose: "太陽能冷藏", completeness: 72 },
  { name: "暖田蔬果", area: "彰化", crop: "蔬果", score: 84, status: "已完成", amount: "8,240 點", purpose: "循環包材與冷鏈", completeness: 92 },
];
const farmerBenefits = [
  {
    id: "soil-test",
    category: "農會服務",
    name: "土壤健康檢測補助",
    amount: "450 綠點",
    term: "7 個工作天",
    rate: "合作農會採樣",
    description: "由合作農會安排土壤採樣，提供酸鹼值、有機質與肥力建議，協助精準施肥。",
    purpose: "土壤檢測與施肥建議",
    suggestedAmount: "1",
    suggestedLabel: "1 次檢測",
    paymentLabel: "扣除 450 綠點",
    planText: "申請本季土壤檢測，作為下一期施肥與友善耕作紀錄依據。",
    requiredScore: 450,
  },
  {
    id: "harvest-crates",
    category: "農具兌換",
    name: "循環收成籃 10 入組",
    amount: "600 綠點",
    term: "農會取貨",
    rate: "剩餘 24 組",
    description: "耐用、可堆疊的循環收成籃，降低一次性紙箱與塑膠袋使用。",
    purpose: "採收、分級與循環運送",
    suggestedAmount: "1",
    suggestedLabel: "1 組",
    paymentLabel: "扣除 600 綠點",
    planText: "預計用於葉菜採收與合作通路配送，並記錄循環使用次數。",
    requiredScore: 600,
  },
  {
    id: "irrigation-kit",
    category: "農具兌換",
    name: "節水滴灌器材券",
    amount: "1,200 綠點",
    term: "30 日內使用",
    rate: "合作農會器材部",
    description: "兌換滴灌管、接頭與簡易控制器，改善小面積田區的用水效率。",
    purpose: "節水灌溉器材",
    suggestedAmount: "1",
    suggestedLabel: "1 張器材券",
    paymentLabel: "扣除 1,200 綠點",
    planText: "用於更新老舊滴灌管線，完成後回報安裝照片與每月用水紀錄。",
    requiredScore: 1200,
    recommended: true,
  },
  {
    id: "organic-coaching",
    category: "轉型補助",
    name: "友善／有機轉型輔導",
    amount: "1,800 綠點",
    term: "輔導 6 個月",
    rate: "政府與農會共同支持",
    description: "包含田間訪視、無農藥檢測、紀錄表與驗證準備，協助建立可信生產資料。",
    purpose: "友善耕作與無農藥驗證",
    suggestedAmount: "1",
    suggestedLabel: "1 期輔導",
    paymentLabel: "扣除 1,800 綠點",
    planText: "申請友善耕作轉型輔導，補齊用藥、資材與田間管理紀錄。",
    requiredScore: 1800,
  },
  {
    id: "low-carbon-machine",
    category: "設備補助",
    name: "低碳農機共購補助",
    amount: "3,000 綠點",
    term: "每季審查",
    rate: "最高補助 30%",
    description: "以綠點提出低碳農機共購補助，串連農會、政府與企業永續預算。",
    purpose: "節能農機與共同使用設備",
    suggestedAmount: "1",
    suggestedLabel: "1 件補助申請",
    paymentLabel: "扣除 3,000 綠點",
    planText: "申請電動搬運設備共購補助，預計由三戶共同使用並回報節能成果。",
    requiredScore: 3000,
  },
] as const;
const localProjects: LocalProject[] = [
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

function getReceiptNumber(item: LocalProject) {
  const index = localProjects.findIndex((project) => project.id === item.id);
  const customNumber = item.id.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0) % 9000;
  return `GI-20260731-${String(index >= 0 ? 186 + index : 1000 + customNumber).padStart(4, "0")}`;
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
      "她計畫汰換節能冷藏設備，並以太陽能分擔白天用電。平台將持續記錄耗電與損耗率，讓設備改善成為可追溯的永續成果。",
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

const roleCycleDetails = {
  consumer: {
    label: "消費者",
    short: "綠色行動者",
    icon: User,
    tone: "consumer",
    source: ["購買綠色商品取得消費回饋", "搭乘大眾運輸、改用電子帳單", "購買節能家電或完成政府企業任務"],
    incentive: ["每次行動立即看見綠點回饋", "優先推薦所在地附近的小農", "支持後取得可追蹤的影響力收據"],
    benefit: ["兌換可追溯的小農好物", "直接支持產地改善專案", "把日常選擇累積成地方影響力"],
  },
  farmer: {
    label: "合作小農",
    short: "在地生產者",
    icon: Sprout,
    tone: "farmer",
    source: ["消費者兌換商品帶來綠點收入", "改善專案接受消費者直接支持", "企業配對及永續成果獎勵"],
    incentive: ["農產履歷與無農藥資料提升曝光", "友善耕作成果轉成可信募資條件", "透明回報可獲得更多合作機會"],
    benefit: ["向農會兌換農具與節水設備", "取得檢測、轉型輔導與農業補助", "穩定訂單並持續改善生產環境"],
  },
  institution: {
    label: "銀行／政府／企業",
    short: "綠點推動者",
    icon: Building2,
    tone: "institution",
    source: ["把 ESG、政策或員工福利預算轉為綠點", "與商家及公用事業共同配對點數", "依節能、交通與電子帳單任務發放"],
    incentive: ["用明確獎勵提高綠色行動參與率", "串連地方創生、農業與淨零政策", "取得可追蹤的點數流向與成果資料"],
    benefit: ["累積 ESG 揭露與計畫成效證據", "提升在地小農及永續經濟效益", "持續優化政策與企業激勵方案"],
  },
} satisfies Record<Role, { label: string; short: string; icon: typeof User; tone: string; source: string[]; incentive: string[]; benefit: string[] }>;

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
      "當設備改善前後的差異被記錄，平台就能把田間行動轉成成果透明度。消費者支持的不只是眼前的一把青菜，也是在幫助農園持續採用更省水、更穩定的生產方式。",
    ],
    metrics: [["18%", "預估節水"], ["4%", "透明度提升"], ["100%", "生產可追溯"]],
    steps: [["看見問題", "灌溉用水不易精準控制"], ["採取行動", "分區滴灌並每日留下紀錄"], ["成果回寫", "驗證節水成果並更新成果透明度"]],
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
      "這份改善計畫會公開需求、執行里程碑與預估效益。消費者能看懂綠點支持的用途，小農也能用後續生產資料回報設備是否真的發揮作用。",
    ],
    metrics: [["12%", "降低採收耗損"], ["23%", "縮短作業時間"], ["80,000 點", "專案支持目標"]],
    steps: [["盤點需求", "記錄旺季工時與採收耗損"], ["上架專案", "公開設備需求與綠點目標"], ["持續驗證", "回報油耗、產量與品質變化"]],
  },
  {
    id: "impact-tracking",
    label: "綠色消費",
    title: "讓每一筆支持，都能看見後續成果",
    cover: "https://images.pexels.com/photos/18703337/pexels-photo-18703337.jpeg?auto=compress&cs=tinysrgb&w=1000",
    detail: "/stories/impact-tracking-detail.webp",
    detailAlt: "淑芬在同一條灌溉水道測量水位並記錄數據",
    person: "淑芬",
    place: "清泉農園・花蓮",
    intro: "當用水、設備與耕作成果有資料可驗證，消費者與合作夥伴就能看懂小農的行動進度與實際改變。",
    quote: "以前只能說我們很努力，現在可以把改變一筆一筆證明出來。",
    paragraphs: [
      "淑芬每週量測灌溉水位與作物狀態，累積成一份完整的用水紀錄。平台整理紀錄完整度、改善幅度與產銷透明度，讓支持者能直接追蹤專案是否持續前進。",
      "完成設備證明後，她的成果透明度由 82% 提升到 86%，也讓節水改善專案達到公開上架條件。綠點支持因此能與真實永續行動連在一起。",
    ],
    metrics: [["42 筆", "水資源紀錄"], ["82→86", "成果透明度"], ["68,000 點", "專案支持目標"]],
    steps: [["持續記錄", "量測用水與設備運作狀況"], ["資料驗證", "確認紀錄來源與改善幅度"], ["成果公開", "更新專案頁並公開下一階段"]],
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
      "當成果被驗證，資料會同步更新小農的成果透明度，也成為平台合作夥伴的影響力報告。支持、回報與下一次綠色選擇因此形成循環。",
    ],
    metrics: [["12,680", "累積支持綠點"], ["86 張", "影響力收據"], ["15%", "資源效率提升"]],
    steps: [["綠點投入", "消費者選擇支持改善專案"], ["進度追蹤", "小農回傳採購與執行紀錄"], ["成果公開", "產生收據並回寫成果透明度"]],
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
    intro: "不論從消費、商品上架或地方合作開始，每一個角色都能讓地方的改變多走一步。",
    quote: "一開始只想把田顧好，後來才發現，每份紀錄都能為下一步多開一扇門。",
    paragraphs: [
      "鳳珠從三塊梯田的生產紀錄開始，把耕作方式、資材與收成一一整理。當資料逐漸完整，她能看見自己的改善方向，也更容易向平台合作夥伴說明綠點支持真正要解決的問題。",
      "綠色循環不要求一次做到完美。消費者的一次支持、小農的一筆紀錄、合作夥伴的一次協作，都能成為地方持續前進的起點。",
    ],
    metrics: [["3 塊", "示範田區"], ["6 個月", "改善週期"], ["75%", "首項方案公開度"]],
    steps: [["選擇角色", "從消費者、小農或合作夥伴端開始"], ["完成行動", "回傳證明、補充資料或共享成果"], ["形成循環", "成果回到平台並創造更多綠色選擇"]],
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
    label: "綠色消費",
    title: "每一筆綠點，都留下看得見的成果",
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
  const [farmerPoints, setFarmerPoints] = useState(3680);
  const [farmerProducts, setFarmerProducts] = useState<FarmerProduct[]>(initialFarmerProducts);
  const [farmerProjects, setFarmerProjects] = useState<LocalProject[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [incentivePlans, setIncentivePlans] = useState<IncentiveProgram[]>(incentivePrograms);
  const [supportedProjectIds, setSupportedProjectIds] = useState<string[]>([]);
  const [redeemedProjectIds, setRedeemedProjectIds] = useState<string[]>([]);
  const [orderStages, setOrderStages] = useState<Record<string, number>>({});
  const [evidence, setEvidence] = useState(false);
  const [invoiceStage, setInvoiceStage] = useState<"form" | "scanning" | "success">("form");
  const [period, setPeriod] = useState("半年");
  const [region, setRegion] = useState("全部地區");
  const [selectedOfferId, setSelectedOfferId] = useState("soil-test");
  const [fundingStep, setFundingStep] = useState(0);
  const [selectedFarmerName, setSelectedFarmerName] = useState(farmers[0].name);
  const [selectedProjectId, setSelectedProjectId] = useState("water");
  const [lastSupportedId, setLastSupportedId] = useState("water");
  const [lastRedeemedId, setLastRedeemedId] = useState("veggie");
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [consumerPage, setConsumerPage] = useState<"overview" | "local" | "invoice" | "receipt" | "orders">("overview");
  const [farmerPage, setFarmerPage] = useState<"overview" | "products" | "projects" | "evidence" | "funding">("overview");
  const [institutionPage, setInstitutionPage] = useState<"overview" | "portfolio" | "report">("overview");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [selectedStoryId, setSelectedStoryId] = useState<string>(stories[0].id);
  const [toast, setToast] = useState("");
  const [cycleOpen, setCycleOpen] = useState(false);

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
  const availableLocalProjects = useMemo(() => [...farmerProjects, ...localProjects], [farmerProjects]);
  const managedFarmerProjects = useMemo(() => [localProjects[0], ...farmerProjects], [farmerProjects]);
  const supportedProjects = availableLocalProjects.filter((item) => item.kind === "support" && supportedProjectIds.includes(item.id));
  const redeemedProjects = availableLocalProjects.filter((item) => item.kind === "redeem" && redeemedProjectIds.includes(item.id));
  const receiptItems = [...supportedProjects, ...redeemedProjects];
  const selectedProject = availableLocalProjects.find((item) => item.id === selectedProjectId) || localProjects[0];
  const receiptProject = availableLocalProjects.find((item) => item.id === lastSupportedId) || localProjects[0];
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

  function openFunding(id = "soil-test") {
    setSelectedOfferId(id);
    setFundingStep(0);
    setModal("offer");
  }
  function openProduct(productId: string | null = null) {
    setSelectedProductId(productId);
    setModal("product");
  }

  function saveFarmerProduct(values: Omit<FarmerProduct, "id" | "image">) {
    if (selectedProductId) {
      setFarmerProducts((items) => items.map((item) => item.id === selectedProductId ? { ...item, ...values } : item));
      setToast(`${values.title} 的綠點與庫存已更新`);
    } else {
      const product: FarmerProduct = {
        ...values,
        id: `product-${Date.now()}`,
        image: localProjects.find((item) => item.id === "veggie")?.image ?? localProjects[0].image,
      };
      setFarmerProducts((items) => [product, ...items]);
      setToast(`${values.title} 已上架，附近消費者現在可以看見`);
    }
    setModal(null);
  }

  function saveFarmerProject(values: ImprovementProjectDraft) {
    const project: LocalProject = {
      ...values,
      id: `farmer-project-${Date.now()}`,
      kind: "support",
      image: localProjects[0].image,
      title: `阿蘭・禾日友善農園｜${values.title}`,
      farmer: "阿蘭｜禾日友善農園",
      progress: 0,
      raisedPoints: 0,
      supporters: 0,
    };
    setFarmerProjects((items) => [project, ...items]);
    setFarmerPage("projects");
    setModal(null);
    setToast(`${values.title} 已公開，消費者現在可以投入綠點支持`);
  }

  function saveIncentivePlan(values: Omit<IncentiveProgram, "id" | "progress">) {
    const plan: IncentiveProgram = { ...values, id: `program-${Date.now()}`, progress: 0 };
    setIncentivePlans((items) => [plan, ...items]);
    setModal(null);
    setToast(`${values.name} 已建立並加入綠點激勵計畫`);
  }
  function openPortfolio(name = farmers[0].name) {
    setSelectedFarmerName(name);
    setModal("portfolio");
  }

  function openLocalProject(id: string) {
    const project = availableLocalProjects.find((item) => item.id === id) || localProjects[0];
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
    const project = availableLocalProjects.find((item) => item.id === id) || localProjects[0];
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
    setFarmerPoints(3680);
    setFarmerProducts(initialFarmerProducts);
    setFarmerProjects([]);
    setSelectedProductId(null);
    setIncentivePlans(incentivePrograms);
    setSupportedProjectIds([]);
    setRedeemedProjectIds([]);
    setOrderStages({});
    setEvidence(false);
    setInvoiceStage("form");
    setFundingStep(0);
    setSelectedOfferId("soil-test");
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
      setFarmerProjects((items) => items.map((item) => {
        if (item.id !== selectedProject.id) return item;
        const raisedPoints = Math.min(item.targetPoints ?? 0, (item.raisedPoints ?? 0) + item.points);
        const progress = item.targetPoints ? Math.min(100, Math.round((raisedPoints / item.targetPoints) * 100)) : item.progress;
        return { ...item, raisedPoints, progress, supporters: (item.supporters ?? 0) + 1 };
      }));
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
    const link = document.createElement("a");
    link.href = "/reports/GFES_green_consumption_impact_summary_2026H1.pdf";
    link.download = "GFES_綠色消費與在地小農影響力摘要_2026上半年.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setToast("四頁正式版 PDF 影響力摘要已下載");
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
            setToast("成果透明度提升至 86%");
          }}
        />
      )}
      {modal === "offer" && (
        <OfferModal
          balance={farmerPoints}
          offerId={selectedOfferId}
          step={fundingStep}
          setStep={setFundingStep}
          onRedeem={(cost) => { setFarmerPoints((value) => Math.max(0, value - cost)); setToast(`已兌換 ${cost.toLocaleString()} 綠點，農會將協助後續領取`); }}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "farmer-project" && (
        <ImprovementProjectModal
          onClose={() => setModal(null)}
          onSubmit={saveFarmerProject}
        />
      )}
      {modal === "product" && (
        <ProductModal
          key={selectedProductId ?? "new-product"}
          product={farmerProducts.find((item) => item.id === selectedProductId) ?? null}
          onClose={() => setModal(null)}
          onSubmit={saveFarmerProduct}
        />
      )}
      {modal === "program" && (
        <ProgramModal
          onClose={() => setModal(null)}
          onSubmit={saveIncentivePlan}
        />
      )}      {modal === "portfolio" && (
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
                  <button className={farmerPage === "products" ? "active" : ""} onClick={() => setFarmerPage("products")}><ShoppingBasket />商品管理</button>
                  <button className={farmerPage === "projects" ? "active" : ""} onClick={() => setFarmerPage("projects")}><HeartHandshake />改善專案計畫</button>
                  <button className={farmerPage === "evidence" ? "active" : ""} onClick={() => setFarmerPage("evidence")}><Upload />永續證明</button>
                  <button className={farmerPage === "funding" ? "active" : ""} onClick={() => setFarmerPage("funding")}><PackageCheck />農業資源兌換</button>
                </>
              )}
              {role === "institution" && (
                <>
                  <button className={institutionPage === "portfolio" ? "active" : ""} onClick={() => setInstitutionPage("portfolio")}><PackageCheck />綠點激勵計畫</button>
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
                  ? ({ overview: "消費者中心", local: "用綠點支持在地｜您的所在地：台北市大安區", invoice: "回傳消費證明", receipt: "影響力收據", orders: "兌換訂單" } as const)[consumerPage]
                  : role === "farmer"
                    ? ({ overview: "小農中心", products: "商品管理", projects: "改善專案計畫", evidence: "永續證明", funding: "農業資源兌換" } as const)[farmerPage]
                    : ({ overview: "銀行／政府／企業中心", portfolio: "綠點激勵計畫", report: "ESG 影響力報告" } as const)[institutionPage]}</h1>
                <p>{role === "consumer" && consumerPage === "local"
                  ? "選擇支持改善專案或兌換小農好物，讓綠點回到土地"
                  : role === "consumer" && consumerPage === "invoice"
                    ? "手動輸入發票資料，或掃描電子／傳統發票取得綠點"
                    : role === "consumer" && consumerPage === "orders"
                      ? "模擬查看小農好物從訂單成立、備貨、配送到完成的進度"
                    : role === "consumer" && consumerPage === "receipt"
                      ? "查看綠點流向、小農行動與地方成果"
                      : role === "farmer" && farmerPage === "products"
                        ? "管理商品、庫存、配送區域，以及綁定農產履歷與無農藥證明"
                      : role === "farmer" && farmerPage === "projects"
                        ? "填寫產地改善計畫、綠點用途與募資目標，公開給消費者支持"
                      : role === "farmer" && farmerPage === "evidence"
                        ? "管理農產履歷、無農藥檢測與友善耕作紀錄"
                        : role === "farmer" && farmerPage === "funding"
                          ? "使用收到的綠點向合作農會兌換農具、檢測、輔導與補助"
                          : role === "institution" && institutionPage === "portfolio"
                            ? "建立綠點激勵任務，追蹤參與、點數流向與地方效益"
                            : role === "institution" && institutionPage === "report"
                              ? "彙整綠色消費投入、環境成果與地方影響"
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
                projects={availableLocalProjects}
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
                farmerPoints={farmerPoints}
                evidence={evidence}
                dimensions={dimensions}
                onEvidence={() => setFarmerPage("evidence")}
                onProducts={() => setFarmerPage("products")}
                onProjects={() => setFarmerPage("projects")}
                onBenefits={() => setFarmerPage("funding")}
              />
            )}
            {role === "farmer" && farmerPage === "products" && (
              <FarmerProductsPage products={farmerProducts} onAdd={() => openProduct(null)} onEdit={(id) => openProduct(id)} />
            )}
            {role === "farmer" && farmerPage === "projects" && (
              <FarmerProjectsPage
                projects={managedFarmerProjects}
                onCreate={() => setModal("farmer-project")}
                onPreview={openLocalProjectStory}
              />
            )}
            {role === "farmer" && farmerPage === "evidence" && (
              <FarmerEvidencePage
                evidence={evidence}
                onSubmit={() => { setEvidence(true); setToast("成果透明度提升至 86%"); }}
                onFunding={() => setFarmerPage("funding")}
              />
            )}
            {role === "farmer" && farmerPage === "funding" && (
              <FarmerFundingPage
                farmerPoints={farmerPoints}
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
              <InstitutionPortfolioPage programs={incentivePlans} onCreate={() => setModal("program")} />
            )}
            {role === "institution" && institutionPage === "report" && (
              <InstitutionReportPage onDownload={downloadReport} />
            )}
          </main>
        </div>

        <nav className={`mobile-nav ${role === "consumer" ? "mobile-nav-consumer" : role === "farmer" ? "mobile-nav-farmer" : ""}`}>
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
              <button className={farmerPage === "products" ? "active" : ""} onClick={() => setFarmerPage("products")}><ShoppingBasket />商品</button>
              <button className={farmerPage === "projects" ? "active" : ""} onClick={() => setFarmerPage("projects")}><HeartHandshake />改善</button>
              <button className={farmerPage === "evidence" ? "active" : ""} onClick={() => setFarmerPage("evidence")}><Upload />證明</button>
              <button className={farmerPage === "funding" ? "active" : ""} onClick={() => setFarmerPage("funding")}><PackageCheck />資源</button>
            </>
          )}
          {role === "institution" && (
            <>
              <button className={institutionPage === "portfolio" ? "active" : ""} onClick={() => setInstitutionPage("portfolio")}><PackageCheck />計畫</button>
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
              <span className="eyebrow">Green Points, Local Impact</span>
              <h1><span>讓每一次綠色行動</span><span>都成為在地小農的力量</span></h1>
              <div className="hero-actions">
                <button className="button button-primary" onClick={openLogin}>開始體驗<ArrowRight /></button>
                <button className="button button-secondary" onClick={() => document.querySelector("#cycle")?.scrollIntoView()}>
                  了解運作方式<ArrowDown />
                </button>
              </div>
              <div className="trust-row">
                <span><BadgeCheck />多元綠點來源</span>
                <span><Leaf />附近小農優先</span>
                <span><HeartHandshake />成果可追溯</span>
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
              <p>從綠色消費、低碳交通、電子帳單到企業與政府激勵，讓每一點支持都有清楚去向，也讓地方農業持續成長。</p>
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

        <section className="section cycle-section" id="cycle">
          <div className="container">
            <header className="section-heading center cycle-section-heading">
              <span className="eyebrow">綠色消費循環</span>
              <h2>從一個綠色行動，到一座農村的改變</h2>
              <p>消費者、合作小農與銀行／政府／企業共享同一套綠點循環，讓獎勵、支持與成果持續回到地方。</p>
              <button className="button button-primary cycle-reveal-button" onClick={() => setCycleOpen((open) => !open)} aria-expanded={cycleOpen} aria-controls="role-cycle-explorer">
                {cycleOpen ? "收合綠點循環" : "查看三方綠點循環"}<ChevronRight className={cycleOpen ? "open" : ""} />
              </button>
            </header>
            {cycleOpen && <RoleCycleExplorer />}
          </div>
        </section>

        <section className="section section-dark" id="impact">
          <div className="container">
            <header className="section-heading">
              <span className="eyebrow">共同影響力</span>
              <h2>讓支持不只是一個數字</h2>
              <p>以下為 Demo 模擬資料，展示綠點如何從多元行動回到小農，並形成可揭露的環境、地方與永續經濟成果。</p>
            </header>
            <div className="impact-grid">
              <Impact icon={Users} value="128" label="受支持在地農戶" />
              <Impact icon={HandCoins} value="478,000 點" label="發放與配對綠點" />
              <Impact icon={Trees} value="62.4 噸" label="估算年度減碳成果" />
              <Impact icon={ShoppingBasket} value="20,160" label="次綠色行動參與" />
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-row">
          <Brand />
          <span>本網站為提案 Demo，人物、故事、綠點與影響成果皆為模擬資料。</span>
          <a href="https://www.pexels.com/" target="_blank" rel="noreferrer">封面來源：Pexels・故事圖為 AI 生成示意</a>
        </div>
      </footer>
      {modals}
    </div>
  );
}

function RoleCycleExplorer() {
  const [hoveredRole, setHoveredRole] = useState<Role | null>(null);
  const [pinnedRole, setPinnedRole] = useState<Role | null>(null);
  const activeRole = hoveredRole ?? pinnedRole;
  const activeInfo = activeRole ? roleCycleDetails[activeRole] : null;
  const roleOrder: Role[] = ["institution", "consumer", "farmer"];

  return (
    <div id="role-cycle-explorer" className={`role-cycle-explorer ${activeRole ? "has-focus" : ""}`}>
      <div className="role-cycle-stage" aria-label="消費者、合作小農與銀行政府企業的綠點循環">
        <div className="role-cycle-orbit" aria-hidden="true">
          <span className="cycle-direction-arrow cycle-direction-arrow-top-right">↖</span>
          <span className="cycle-direction-arrow cycle-direction-arrow-top-left">↙</span>
          <span className="cycle-direction-arrow cycle-direction-arrow-bottom-left">↘</span>
          <span className="cycle-direction-arrow cycle-direction-arrow-bottom-right">↗</span>
        </div>
        <div className="cycle-core"><HandCoins /><strong>綠點循環</strong><small>獎勵・支持・成果</small></div>
        <span className="cycle-link cycle-link-grant">發放與配對綠點</span>
        <span className="cycle-link cycle-link-support">支持專案與兌換</span>
        <span className="cycle-link cycle-link-impact">回傳成果與效益</span>
        {roleOrder.map((key) => {
          const info = roleCycleDetails[key];
          const Icon = info.icon;
          const active = activeRole === key;
          return (
            <button
              type="button"
              key={key}
              className={`role-cycle-node role-cycle-node-${key} ${active ? "active" : ""} ${activeRole && !active ? "dimmed" : ""}`}
              onMouseEnter={() => setHoveredRole(key)}
              onMouseLeave={() => setHoveredRole(null)}
              onFocus={() => setHoveredRole(key)}
              onBlur={() => setHoveredRole(null)}
              onClick={() => setPinnedRole((current) => current === key ? null : key)}
              aria-pressed={pinnedRole === key}
            >
              <span className="role-cycle-icon"><Icon /></span>
              <span><small>{info.short}</small><strong>{info.label}</strong><em>{active ? "正在聚焦・下方查看完整內容" : "滑鼠移入或點擊查看"}</em></span>
            </button>
          );
        })}
      </div>
      <div className={`role-cycle-detail ${activeInfo ? "visible" : ""}`} aria-live="polite">
        {activeInfo && activeRole ? (
          <>
            <header><span className={`role-cycle-detail-icon ${activeInfo.tone}`}><activeInfo.icon /></span><div><small>{activeInfo.short}</small><h3>{activeInfo.label}如何參與綠點循環</h3></div><b>角色 {roleOrder.indexOf(activeRole) + 1}／3</b></header>
            <div className="role-cycle-detail-grid">
              <RoleCycleList title="綠點怎麼來" items={activeInfo.source} icon={HandCoins} />
              <RoleCycleList title="獲得綠點的誘因" items={activeInfo.incentive} icon={TrendingUp} />
              <RoleCycleList title="綠點帶來的好處" items={activeInfo.benefit} icon={BadgeCheck} />
            </div>
          </>
        ) : (
          <div className="role-cycle-prompt"><span><RefreshCcw /></span><div><b>把滑鼠移到任一角色上</b><p>其他角色會自動變暗，並顯示這個角色的綠點來源、參與誘因與實際好處；手機可直接點擊角色。</p></div></div>
        )}
      </div>
    </div>
  );
}

function RoleCycleList({ title, items, icon: Icon }: { title: string; items: string[]; icon: typeof HandCoins }) {
  return (
    <section><h4><Icon />{title}</h4><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>
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
  const savedStory = localProjectStories[item.id as keyof typeof localProjectStories] as ProjectStory | undefined;
  const story: ProjectStory = savedStory ?? item.story ?? {
    location: `${item.city ?? "合作產地"}・${item.district ?? "友善農區"}`,
    headline: `${item.farmer}希望透過這項計畫，讓產地改善能被看見與支持`,
    quote: "把需要改善的問題說清楚，也把每一筆綠點真正用在哪裡留下紀錄。",
    paragraphs: [item.note, `本計畫預計將綠點投入${item.purpose}，並以${item.impact}作為後續成果追蹤方向。`],
  };
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
          <aside><h4>{isSupport ? "這份支持會帶來什麼" : "這次兌換支持了什麼"}</h4><div className="local-story-facts"><div><small>{isSupport ? "所需綠點" : "兌換綠點"}</small><strong>{item.points} 點</strong></div><div><small>{isSupport && item.targetPoints ? "募集進度" : "目前進度"}</small><strong>{isSupport && item.targetPoints ? `${(item.raisedPoints ?? 0).toLocaleString()}／${item.targetPoints.toLocaleString()} 點` : `${item.progress}%`}</strong></div><div><small>{isSupport ? "資源用途" : "配送方式"}</small><strong>{item.purpose}</strong></div><div><small>預期成果</small><strong>{item.impact}</strong></div></div><div className="progress"><span style={{ width: item.progress + "%" }} /></div><p>{isSupport ? "完成支持後，專案進度與成果將同步到你的影響力收據。" : "完成兌換後，這筆綠點會形成在地訂單並支持小農持續生產。"}</p></aside>
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
          <span>三種角色共享同一條綠點、訂單、專案與成果資料鏈。</span>
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
          <button onClick={onInvoice}><span><ScanLine /></span><b>回傳消費證明<small>消費回饋取得綠點</small></b></button>
          <button onClick={onReceipt}><span><FileCheck2 /></span><b>影響力收據<small>查看支持流向與成果</small></b></button>
        </div>
      </section>

      <Panel className="span-8" title="綠點趨勢" note="消費、交通、電子帳單與政府企業方案取得的綠點" action={
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

      <Panel className="span-12" title="近期紀錄" note="多元綠點來源與使用去向">
        <div className="activity-list">
          <Activity icon={Store} title="合作通路消費回饋" note="綠田生活市集" value="+180 點" />
          <Activity icon={Truck} title="低碳交通行動" note="大眾運輸減碳回饋" value="+80 點" />
          <Activity icon={Building2} title="節能家電汰舊換新" note="購買一級能效冷氣獲得回饋" value="+600 點" />
          <Activity icon={Receipt} title="改用電子帳單" note="政府與公用事業推廣方案" value="+50 點" />
          <Activity icon={Building2} title="企業綠色行動加碼" note="員工 ESG 共好方案" value="+200 點" />
          {supportedItems.slice(-2).reverse().map((item) => <Activity key={item.id} icon={HeartHandshake} title="支持改善專案" note={item.farmer} value={`-${item.points} 點`} />)}
          {redeemed && <Activity icon={ShoppingBasket} title="兌換小農商品" note={(localProjects.find((item) => item.id === lastRedeemedId) || localProjects[2]).farmer} value={`-${(localProjects.find((item) => item.id === lastRedeemedId) || localProjects[2]).points} 點`} />}
        </div>
      </Panel>
    </div>
  );
}

function LocalSupportDashboard({
  points,
  projects,
  supportedIds,
  redeemedIds,
  onProject,
  onLearnMore,
}: {
  points: number;
  projects: LocalProject[];
  supportedIds: string[];
  redeemedIds: string[];
  onProject: (id: string) => void;
  onLearnMore: (id: string) => void;
}) {
  const locationById: Record<string, { city: string; district: string; distance: number }> = {
    water: { city: "雲林縣", district: "古坑鄉", distance: 205 },
    rice: { city: "嘉義縣", district: "民雄鄉", distance: 244 },
    "solar-cold": { city: "花蓮縣", district: "壽豐鄉", distance: 172 },
    "circular-pack": { city: "彰化縣", district: "溪州鄉", distance: 184 },
    pollinator: { city: "苗栗縣", district: "卓蘭鎮", distance: 137 },
    veggie: { city: "雲林縣", district: "西螺鎮", distance: 194 },
    "rice-box": { city: "嘉義縣", district: "民雄鄉", distance: 244 },
    "fruit-box": { city: "花蓮縣", district: "壽豐鄉", distance: 172 },
    "herbal-tea": { city: "苗栗縣", district: "卓蘭鎮", distance: 137 },
    "veggie-meal": { city: "雲林縣", district: "西螺鎮", distance: 194 },
  };
  const nearbyProjects = [...projects].sort((a, b) => (a.distance ?? locationById[a.id]?.distance ?? 300) - (b.distance ?? locationById[b.id]?.distance ?? 300));
  const renderProject = (item: LocalProject) => {
    const done = item.kind === "support" ? supportedIds.includes(item.id) : redeemedIds.includes(item.id);
    const location = { city: item.city ?? locationById[item.id]?.city ?? "其他縣市", district: item.district ?? locationById[item.id]?.district ?? "合作地區", distance: item.distance ?? locationById[item.id]?.distance ?? 300 };
    return (
      <Project
        key={item.id}
        image={item.image}
        title={item.title}
        note={`${location.city}｜${location.district}｜距離你約 ${location.distance} 公里｜${done ? (item.kind === "support" ? `已支持 ${item.points} 點，可查看影響力收據` : "兌換完成，預計 3–5 個工作天出貨") : item.note}`}
        progress={item.progress}
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
        <div className="local-points"><span>目前可用綠點</span><strong>{points.toLocaleString()} <small>點</small></strong></div>
        <div className="local-support-path"><span><Home /></span><div><b>您的所在地：台北市大安區</b><small>已依距離優先排列附近小農，可隨時切換地區</small></div></div>
        <div className="local-support-path"><span><HeartHandshake /></span><div><b>先在地、再擴散</b><small>支持改善專案或兌換農產，綠點直接回到地方</small></div></div>
      </section>

      <Panel className="span-12 local-project-panel" title="你附近的小農改善專案" note="依所在地距離優先排序，並揭露農產履歷、用途與預期成果">
        <div className="project-list project-list-expanded">{nearbyProjects.filter((item) => item.kind === "support").map(renderProject)}</div>
      </Panel>

      <Panel className="span-12 local-project-panel" title="你附近的小農好物" note="使用綠點兌換可追溯農產，直接形成在地訂單">
        <div className="project-list project-list-expanded">{nearbyProjects.filter((item) => item.kind === "redeem").map(renderProject)}</div>
      </Panel>
    </div>
  );
}

function FarmerProductsPage({ products, onAdd, onEdit }: { products: FarmerProduct[]; onAdd: () => void; onEdit: (id: string) => void }) {
  const totalStock = products.reduce((sum, item) => sum + item.stock, 0);
  return (
    <div className="dashboard-grid">
      <div className="metrics span-12"><Metric icon={ShoppingBasket} value={`${products.length} 款`} label="已上架商品" delta="可立即編輯" /><Metric icon={PackageCheck} value={`${totalStock} 件`} label="可售庫存" delta="即時更新" /><Metric icon={HandCoins} value="3,680 點" label="本月收到支持" delta="+18%" /><Metric icon={FileCheck2} value="92%" label="履歷完整度" delta="待補 1 項" /></div>
      <Panel className="span-12 subpage-primary" title="已上架商品" note="點選管理商品，即可修改兌換綠點與庫存數量" action={<button className="button button-primary" onClick={onAdd}><ShoppingBasket />上架新商品</button>}>
        <div className="project-list project-list-expanded">{products.map((item) => <Project key={item.id} image={item.image} title={item.title} note={`${item.points.toLocaleString()} 綠點・${item.proof}・庫存 ${item.stock} ${item.unit}`} progress={100} button="編輯點數與庫存" onClick={() => onEdit(item.id)} onLearnMore={() => onEdit(item.id)} gold />)}</div>
      </Panel>
      <Panel className="span-12" title="待處理訂單" note="商品兌換後會在此集中管理備貨與配送進度">
        <div className="table-wrap"><table><thead><tr><th>訂單</th><th>商品</th><th>兌換數量</th><th>配送地區</th><th>狀態</th></tr></thead><tbody><tr><td><b>GF-0821</b></td><td>{products[0]?.title ?? "友善葉菜箱"}</td><td>4 件</td><td>雲林縣斗六市</td><td><span className="status-pill">備貨中</span></td></tr><tr><td><b>GF-0818</b></td><td>{products[1]?.title ?? "節水栽培米"}</td><td>6 件</td><td>嘉義縣民雄鄉</td><td><span className="status-pill">待出貨</span></td></tr><tr><td><b>GF-0812</b></td><td>{products[2]?.title ?? "減塑香草茶"}</td><td>2 件</td><td>彰化縣員林市</td><td><span className="status-pill waiting">待確認</span></td></tr></tbody></table></div>
      </Panel>
    </div>
  );
}

function FarmerProjectsPage({
  projects,
  onCreate,
  onPreview,
}: {
  projects: LocalProject[];
  onCreate: () => void;
  onPreview: (id: string) => void;
}) {
  const projectStats = projects.map((project) => {
    const target = project.targetPoints ?? 68000;
    const raised = project.raisedPoints ?? Math.round(target * project.progress / 100);
    return { project, target, raised, supporters: project.supporters ?? 86 };
  });
  const totalTarget = projectStats.reduce((sum, item) => sum + item.target, 0);
  const totalRaised = projectStats.reduce((sum, item) => sum + item.raised, 0);
  const totalSupporters = projectStats.reduce((sum, item) => sum + item.supporters, 0);

  return (
    <div className="dashboard-grid">
      <div className="metrics span-12"><Metric icon={HeartHandshake} value={`${projects.length} 項`} label="公開改善專案" delta="消費者可支持" /><Metric icon={HandCoins} value={`${totalRaised.toLocaleString()} 點`} label="目前募集綠點" delta={`目標 ${totalTarget.toLocaleString()} 點`} /><Metric icon={Users} value={`${totalSupporters} 人`} label="支持人數" delta="每筆皆可追溯" /><Metric icon={FileCheck2} value="100%" label="專案資料完整度" delta="可公開募資" /></div>
      <Panel className="span-12 subpage-primary" title="小農改善專案計畫" note="說明田間問題、預期成果與綠點用途，公開向消費者募集改善資源" action={<button className="button button-primary" onClick={onCreate}><HeartHandshake />建立改善專案</button>}>
        <div className="farmer-project-grid">
          {projectStats.map(({ project, target, raised, supporters }) => (
            <article className="farmer-project-card" key={project.id}>
              <header><span>{project.id.startsWith("farmer-project-") ? "剛建立・公開募集中" : "公開募集中"}</span><h3>{project.title.split("｜").at(-1)}</h3><p>{project.note}</p></header>
              <div className="farmer-project-progress"><div><span>已募集</span><strong>{raised.toLocaleString()} <small>／ {target.toLocaleString()} 點</small></strong></div><b>{project.progress}%</b></div>
              <div className="progress"><span style={{ width: `${project.progress}%` }} /></div>
              <div className="farmer-project-facts"><span><small>每次支持</small><b>{project.points.toLocaleString()} 點</b></span><span><small>支持人數</small><b>{supporters} 人</b></span><span><small>預期成果</small><b>{project.impact}</b></span></div>
              <div className="farmer-project-allocation"><small>綠點如何支持產地</small><p>{(project.allocations ?? [{ label: "設備與材料", percent: 55 }, { label: "施工與改善", percent: 30 }, { label: "成果追蹤", percent: 15 }]).map((item) => `${item.label} ${item.percent}%`).join("・")}</p></div>
              <button className="button button-secondary button-block" onClick={() => onPreview(project.id)}>預覽消費者募資頁<ArrowRight /></button>
            </article>
          ))}
        </div>
      </Panel>
      <Panel className="span-12" title="公開前檢查" note="資料越完整，越容易讓消費者理解支持目的">
        <div className="project-publish-checks"><Evidence title="田間問題與改善方式" note="清楚說明現在遇到的問題" done /><Evidence title="綠點使用比例" note="揭露設備、執行與成果追蹤用途" done /><Evidence title="預期成果與完成時間" note="讓支持者可以追蹤後續進度" done /><Evidence title="產銷履歷或無農藥資料" note="建立可信的專案基礎" done /></div>
      </Panel>
    </div>
  );
}

function FarmerDashboard({
  score,
  farmerPoints,
  evidence,
  dimensions,
  onEvidence,
  onProducts,
  onProjects,
  onBenefits,
}: {
  score: number;
  farmerPoints: number;
  evidence: boolean;
  dimensions: { name: string; score: number }[];
  onEvidence: () => void;
  onProducts: () => void;
  onProjects: () => void;
  onBenefits: () => void;
}) {
  const availableBenefits = farmerBenefits.filter((benefit) => farmerPoints >= benefit.requiredScore);
  return (
    <>
      <div className="metrics">
        <Metric icon={HandCoins} value={`${farmerPoints.toLocaleString()} 點`} label="小農綠點餘額" delta="可於農會運用" />
        <Metric icon={ShoppingBasket} value="3 款" label="已上架商品" delta="12 箱待出貨" />
        <Metric icon={FileCheck2} value={evidence ? "100%" : "92%"} label="履歷與檢測完整度" delta={evidence ? "完成" : "待補 1 項"} />
        <Metric icon={PackageCheck} value={`${availableBenefits.length} 項`} label="可兌換農業資源" delta="依綠點餘額" />
      </div>
      <div className="dashboard-grid">
        <Panel className="span-7" title="商品與消費者支持" note="附近消費者可透過綠點兌換，支持直接累積到小農帳戶">
          <div className="score-panel"><div className="score-ring" style={{ "--score": "78%" } as React.CSSProperties}><span><strong>46</strong><small>本月訂單</small></span></div><div><h3>附近曝光持續增加</h3><p>商品綁定產銷履歷與無農藥檢測後，會優先顯示可信標章與配送距離。</p><div className="farmer-dashboard-actions"><button className="button button-primary" onClick={onProjects}><HeartHandshake />管理改善專案</button><button className="button button-secondary" onClick={onProducts}><ShoppingBasket />商品管理</button></div></div></div>
        </Panel>
        <Panel className="span-5" title="永續資料" note="用可追溯證明建立消費信任">
          <div className="evidence-list"><Evidence title="產銷履歷與批次資訊" note="2026/07/22 更新" done /><Evidence title="無農藥檢測報告" note="2026/07/18 更新" done /><Evidence title="友善耕作紀錄" note="本季紀錄完整" done /><Evidence title="低碳設備使用證明" note={evidence ? "已完成驗證" : "待補充"} done={evidence} /></div>
          <button className="button button-secondary button-block" onClick={onEvidence}><Upload />管理永續證明</button>
        </Panel>
        <Panel className="span-12" title="農會農業資源兌換" note="把消費者支持轉成土壤檢測、農具、輔導與補助資源" action={<button className="button button-primary" onClick={onBenefits}>查看全部資源<ArrowRight /></button>}>
          <div className="funding-unlock-summary"><div className="funding-current"><span><HandCoins /></span><div><small>目前可用</small><strong>{farmerPoints.toLocaleString()} 點</strong><p>可兌換 {availableBenefits.length}／{farmerBenefits.length} 項資源</p></div></div><div className="funding-next complete"><b>綠點來源透明</b><small>消費者兌換、直接支持與企業配對均可追溯。</small></div></div>
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
  const sourceData = [
    { name: "綠色消費", value: 38, color: "#2d7250" },
    { name: "低碳交通", value: 27, color: "#74a945" },
    { name: "電子帳單", value: 18, color: "#d8a72f" },
    { name: "政府企業方案", value: 17, color: "#c7d4bd" },
  ];
  const visibleFarmers = farmers.filter((item) => region === "全部地區" || item.area === region);
  return (
    <>
      <div className="metrics">
        <Metric icon={HandCoins} value={`${Math.round(478 * multiplier).toLocaleString()} 千點`} label="發放與配對綠點" delta="+18.2%" />
        <Metric icon={Users} value={`${Math.round(18620 * multiplier).toLocaleString()}`} label="參與人次" delta="+14.8%" />
        <Metric icon={Sprout} value={`${Math.round(128 * multiplier)}`} label="受支持小農" delta="+9.4%" />
        <Metric icon={Trees} value={`${(62.4 * multiplier).toFixed(1)} 噸`} label="估算減碳成果" delta="+12.1%" />
      </div>
      <div className="dashboard-grid">
        <Panel className="span-8" title="綠點激勵投入趨勢" note="消費、交通、電子帳單與企業配對，單位：千點" action={<select className="select" value={region} onChange={(event) => setRegion(event.target.value)}><option>全部地區</option><option>雲林</option><option>嘉義</option><option>花蓮</option></select>}>
          <Chart><BarChart data={supportTrend.map((item) => ({ ...item, funds: Math.round(item.funds * multiplier) }))}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="funds" name="發放綠點" fill="#2d7250" radius={[8, 8, 0, 0]} /></BarChart></Chart>
        </Panel>
        <Panel className="span-4" title="綠點來源" note="目前各類激勵行動占比">
          <Chart><PieChart><Pie data={sourceData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={4}>{sourceData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip /></PieChart></Chart>
        </Panel>
        <Panel className="span-12" title="在地小農支持成效" note={`目前顯示 ${visibleFarmers.length} 戶；用於 ESG 成果揭露與地方共好追蹤`} action={<div className="panel-actions"><button className="button button-secondary" onClick={() => onDetail()}><PackageCheck />管理激勵計畫</button><button className="button button-secondary" onClick={onDownload}><Download />查看成果報告</button></div>}>
          <div className="table-wrap"><table><thead><tr><th>農戶</th><th>地區</th><th>作物</th><th>履歷完整度</th><th>累積綠點支持</th><th>地方效益</th></tr></thead><tbody>{visibleFarmers.map((item) => <tr key={item.name}><td><b>{item.name}</b></td><td>{item.area}</td><td>{item.crop}</td><td><span className="score-pill">{item.completeness}%</span></td><td>{item.amount}</td><td>{item.purpose}</td></tr>)}</tbody></table></div>
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
            ? [{ label: "小農商品收入", percent: 60 }, { label: "產地理貨與冷藏", percent: 25 }, { label: "循環包裝與配送", percent: 15 }]
            : item.allocations ?? [{ label: "設備與材料", percent: 55 }, { label: "施工與改善", percent: 30 }, { label: "成果追蹤", percent: 15 }]
          ).map(({ label, percent }) => (
            <div className="allocation" key={label}><span><b>{label}</b><em>{percent}%</em></span><div className="progress"><i style={{ width: `${percent}%` }} /></div></div>
          ))}
        </section>
        <section>
          <h4>{isRedeem ? "訂單與影響里程碑" : "專案里程碑"}</h4>
          <div className="receipt-timeline">
            <div className="done"><span><Check /></span><p><b>{isRedeem ? "商品兌換完成" : "綠點支持完成"}</b><small>2026/07/31</small></p></div>
            <div className="active"><span>2</span><p><b>{isRedeem ? "小農備貨與產地配送" : "採購與改善進行中"}</b><small>{isRedeem ? "可至兌換訂單查看最新進度" : "預計 2026/08 完成"}</small></p></div>
            <div><span>3</span><p><b>{isRedeem ? "地方成果持續累積" : "成果驗證與回報"}</b><small>{isRedeem ? "訂單收入支持下一批友善生產" : "完成後更新成果透明度"}</small></p></div>
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
      <Panel className="span-7 subpage-primary" title="永續證明與農產履歷" note="資料將同步顯示於商品頁，幫助消費者判斷來源與耕作方式">
        <div className="evidence-list"><Evidence title="產銷履歷與批次資訊" note="履歷編號 TAP-26-0718" done /><Evidence title="無農藥殘留檢測" note="2026/07/18 檢測合格" done /><Evidence title="友善耕作紀錄" note="施作、用水與資材紀錄完整" done /><Evidence title="低碳設備使用證明" note={evidence ? "已完成 Demo 驗證" : "待補充節水設備使用紀錄"} done={evidence} /></div>
      </Panel>
      <Panel className="span-5" title={evidence ? "可信資料已更新" : "補充低碳作業證明"} note={evidence ? "商品標章與資料完整度已同步" : "上傳範例文件即可完成 Demo"}>
        {evidence ? <Success title="履歷完整度提升至 100%" text="消費者可在商品與支持頁看見最新證明。"><button className="button button-primary" onClick={onFunding}>前往農業資源兌換</button></Success> : <><div className="upload-box"><Upload /><b>節水設備使用紀錄.pdf</b><small>Demo 已準備範例文件</small></div><div className="receipt-box"><Row label="設備" value="節水灌溉控制器" /><Row label="使用期間" value="2026/04–2026/07" /><Row label="資料完整度" value="92 → 100" /></div><button className="button button-primary button-block" onClick={onSubmit}>模擬送出並驗證</button></>}
      </Panel>
    </div>
  );
}

function FarmerFundingPage({
  farmerPoints,
  onOffer,
}: {
  farmerPoints: number;
  onOffer: (id: string) => void;
}) {
  const availableBenefits = farmerBenefits.filter((benefit) => farmerPoints >= benefit.requiredScore);
  const nextBenefit = farmerBenefits.find((benefit) => farmerPoints < benefit.requiredScore);
  return (
    <div className="dashboard-grid"><Panel className="span-12 subpage-primary" title="農會農業資源兌換" note="把消費者與企業支持轉成檢測、農具、輔導和農業補助">
      <div className="funding-unlock-summary"><div className="funding-current"><span><HandCoins /></span><div><small>小農綠點餘額</small><strong>{farmerPoints.toLocaleString()} 點</strong><p>目前可兌換 {availableBenefits.length}／{farmerBenefits.length} 項</p></div></div>{nextBenefit ? <div className="funding-next"><div><span>下一項資源</span><b>{nextBenefit.requiredScore.toLocaleString()} 點・{nextBenefit.name}</b></div><div className="progress"><span style={{ width: Math.min((farmerPoints / nextBenefit.requiredScore) * 100, 100) + "%" }} /></div><small>再獲得 <b>{(nextBenefit.requiredScore - farmerPoints).toLocaleString()} 點</b>即可兌換</small></div> : <div className="funding-next complete"><b>目前所有示範資源皆可兌換</b><small>兌換後由農會協助領取或銜接輔導。</small></div>}</div>
      <div className="funding-legend"><span><i className="support" />農會合作資源</span><span><i className="loan" />器具／檢測／輔導</span><span><LockKeyhole />餘額不足時顯示差額</span></div>
      <div className="offer-list funding-offer-grid">{farmerBenefits.map((offer) => <Offer key={offer.id} category={offer.category} name={offer.name} amount={offer.amount} term={offer.term} rate={offer.rate} description={offer.description} purpose={offer.purpose} requiredScore={offer.requiredScore} currentScore={farmerPoints} recommended={"recommended" in offer && offer.recommended} onClick={() => onOffer(offer.id)} />)}</div>
    </Panel></div>
  );
}

const incentivePrograms: IncentiveProgram[] = [
  { id: "commute", name: "低碳通勤綠點", sponsor: "企業員工方案", action: "搭乘大眾運輸或共享單車", reward: "每次 20 點", budgetPoints: 96400, participants: "4,820 人", progress: 78, esg: "氣候行動" },
  { id: "ebill", name: "電子帳單轉換獎勵", sponsor: "政府／公用事業", action: "改用電子帳單", reward: "一次 80 點", budgetPoints: 74800, participants: "9,350 人", progress: 64, esg: "責任消費" },
  { id: "appliance", name: "節能家電汰舊換新", sponsor: "政府／銀行／家電通路", action: "購買一級能效冷氣、冰箱或除濕機", reward: "每件 600 點", budgetPoints: 92000, participants: "1,540 戶", progress: 69, esg: "能源效率" },
  { id: "local-shopping", name: "在地綠色消費加碼", sponsor: "銀行卡友／企業會員", action: "指定在地小農通路消費", reward: "消費 5% 點數", budgetPoints: 128600, participants: "6,240 人", progress: 83, esg: "地方共好" },
  { id: "farmer-match", name: "偏鄉小農支持配對", sponsor: "企業 ESG 專案", action: "企業 1：1 配對消費者綠點", reward: "等額配對", budgetPoints: 86200, participants: "128 戶", progress: 71, esg: "永續經濟" },
];

function InstitutionPortfolioPage({ programs, onCreate }: { programs: IncentiveProgram[]; onCreate: () => void }) {
  const totalBudget = programs.reduce((sum, program) => sum + program.budgetPoints, 0);
  return (
    <div className="dashboard-grid">
      <Panel className="span-12 subpage-primary" title="綠點激勵計畫" note="由銀行、政府與企業設計任務，將綠色行動轉成可追溯的在地支持" action={<button className="button button-primary" onClick={onCreate}><PackageCheck />建立新計畫</button>}>
        <div className="portfolio-summary"><article><strong>{programs.length} 項</strong><span>計畫總數</span></article><article><strong>{totalBudget.toLocaleString()} 點</strong><span>計畫綠點預算</span></article><article><strong>20,160</strong><span>既有參與人次</span></article><article><strong>128 戶</strong><span>受支持小農</span></article></div>
        <div className="incentive-grid">{programs.map((program) => <article className="incentive-card" key={program.id}><header><span>{program.esg}</span><b>{program.name}</b><small>{program.sponsor}</small></header><p>{program.action}</p><div className="incentive-data"><span>回饋方式<b>{program.reward}</b></span><span>計畫預算<b>{program.budgetPoints.toLocaleString()} 點</b></span><span>參與對象<b>{program.participants}</b></span></div><div className="progress"><span style={{ width: `${program.progress}%` }} /></div><small>{program.progress === 0 ? "新建立・尚未開始" : `年度目標達成 ${program.progress}%`}</small></article>)}</div>
      </Panel>
      <Panel className="span-12" title="ESG 可揭露成果" note="平台協助累積行動、點數流向與地方效益證據；正式評等仍依各揭露準則與評鑑機構認定">
        <div className="table-wrap"><table><thead><tr><th>成果面向</th><th>可揭露指標</th><th>目前成果</th><th>佐證方式</th></tr></thead><tbody><tr><td>氣候行動</td><td>低碳交通參與及估算減碳</td><td>62.4 噸 CO₂e</td><td>行動紀錄與估算方法</td></tr><tr><td>責任消費</td><td>綠色消費及電子帳單轉換</td><td>15,590 人次</td><td>點數發放紀錄</td></tr><tr><td>地方共好</td><td>在地小農支持與訂單</td><td>128 戶</td><td>影響力收據與產銷履歷</td></tr><tr><td>永續經濟</td><td>農業資源回流</td><td>86,200 點</td><td>農會兌換紀錄</td></tr></tbody></table></div>
      </Panel>
    </div>
  );
}

function InstitutionReportPage({ onDownload }: { onDownload: () => void }) {
  return (
    <>
      <div className="metrics"><Metric icon={HandCoins} value="478,000 點" label="發放與配對綠點" delta="+18.2%" /><Metric icon={Users} value="20,160" label="綠色行動人次" delta="+14.8%" /><Metric icon={Sprout} value="128 戶" label="受支持小農" delta="+9.4%" /><Metric icon={Trees} value="62.4 噸" label="估算減碳成果" delta="+12.1%" /></div>
      <div className="dashboard-grid">
        <Panel className="span-8 subpage-primary" title="綠點激勵投入趨勢" note="近六個月消費、交通、電子帳單與配對投入，單位：千點"><Chart><BarChart data={supportTrend}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="funds" name="發放綠點" fill="#2d7250" radius={[8, 8, 0, 0]} /></BarChart></Chart></Panel>
        <Panel className="span-4" title="ESG 成果摘要" note="供銀行、政府與企業揭露及持續追蹤"><div className="report-highlights"><div><span><Trees /></span><p><b>環境面</b><small>節能家電、低碳交通、節水與減藥行動持續累積</small></p></div><div><span><Users /></span><p><b>社會面</b><small>在地小農收入、農業資源與地方供應鏈受益</small></p></div><div><span><PackageCheck /></span><p><b>治理面</b><small>點數來源、流向、履歷與成果保留可追溯紀錄</small></p></div></div></Panel>
        <Panel className="span-12" title="可揭露成果範圍" note="平台提供績效證據；正式 ESG 評分仍依採用準則及評鑑機構認定" action={<button className="button button-primary" onClick={onDownload}><Download />下載正式版 PDF</button>}><div className="pdf-report-preview"><span>PDF</span><div><b>2026 年上半年綠色消費與在地小農影響力摘要</b><small>4 頁 A4 政策成果報告格式・含核心指標、趨勢圖、地區小農資料與 ESG 方法說明</small></div><em>GFES-DEMO-2026-H1-001</em></div><div className="table-wrap"><table><thead><tr><th>成果面向</th><th>本期成果</th><th>資料來源</th><th>更新頻率</th></tr></thead><tbody><tr><td>綠點激勵參與</td><td>20,160 人次</td><td>消費、節能家電、交通與電子帳單任務</td><td>每月</td></tr><tr><td>發放與配對綠點</td><td>478,000 點</td><td>平台點數流向紀錄</td><td>即時</td></tr><tr><td>受支持小農</td><td>128 戶</td><td>商品、支持與農會兌換紀錄</td><td>每月</td></tr><tr><td>估算減碳成果</td><td>62.4 噸 CO₂e</td><td>行動紀錄與公開估算方法</td><td>每季</td></tr></tbody></table></div></Panel>
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
      <div className="receipt-box"><Row label={isSupport ? "支持綠點" : "兌換綠點"} value={`${item.points} 點`} /><Row label="目前可用" value={`${balance.toLocaleString()} 點`} />{isSupport && item.targetPoints && <Row label="專案募資" value={`${(item.raisedPoints ?? 0).toLocaleString()}／${item.targetPoints.toLocaleString()} 點`} />}<Row label={isSupport ? "資源用途" : "配送方式"} value={item.purpose} /><Row label="預期成果" value={item.impact} /></div>
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
      <div className="offer-kicker"><span className="support">{category}</span><span className={`offer-status ${locked ? "locked" : ""}`}>{locked ? <LockKeyhole /> : <CheckCircle2 />}{locked ? "餘額不足" : recommended ? "推薦兌換" : "可兌換"}</span></div>
      <header className="offer-header"><b>{name}</b><small>{requiredScore.toLocaleString()} 綠點</small></header>
      <p className="offer-description">{description}</p>
      <div className="offer-data"><small>兌換點數<b>{amount}</b></small><small>領取方式<b>{term}</b></small></div>
      <div className="offer-rate">{rate}</div>
      {locked ? <><div className="locked-benefit"><LockKeyhole /><span><b>還差 {gap.toLocaleString()} 點</b><small>{purpose}</small></span></div><div className="unlock-progress"><div><span>目前 {currentScore.toLocaleString()} 點</span><b>需要 {requiredScore.toLocaleString()} 點</b></div><div className="progress"><span style={{ width: `${Math.min((currentScore / requiredScore) * 100, 100)}%` }} /></div></div></> : <div className="offer-threshold"><BadgeCheck />目前餘額足夠，由合作農會提供</div>}
      <button className={`button button-block ${locked ? "button-locked" : "button-secondary"}`} onClick={onClick}>{locked ? <LockKeyhole /> : <ChevronRight />}{locked ? "查看所需點數" : "查看並兌換"}</button>
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
  item: LocalProject;
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
            {(item.allocations ?? [{ label: "設備與材料", percent: 55 }, { label: "施工與改善", percent: 30 }, { label: "成果追蹤", percent: 15 }]).map(({ label, percent }) => <div className="allocation" key={label}><span><b>{label}</b><em>{percent}%</em></span><div className="progress"><i style={{ width: `${percent}%` }} /></div></div>)}
          </section>
          <section>
            <h4>專案里程碑</h4>
            <div className="receipt-timeline">
              <div className="done"><span><Check /></span><p><b>綠點支持完成</b><small>2026/07/31</small></p></div>
              <div className="active"><span>2</span><p><b>採購與改善進行中</b><small>預計 2026/08 完成</small></p></div>
              <div><span>3</span><p><b>成果驗證與回報</b><small>完成後更新成果透明度</small></p></div>
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
        <Success title="證明已完成 Demo 驗證" text="成果透明度已由 82% 提升至 86%，地方合作條件同步更新。">
          <button className="button button-primary button-block" onClick={onClose}>返回成果總覽</button>
        </Success>
      ) : (
        <>
          <div className="upload-box"><Upload /><b>低碳設備使用紀錄.pdf</b><small>Demo 已準備範例文件，可直接模擬送出</small></div>
          <div className="receipt-box"><Row label="設備" value="節水灌溉控制器" /><Row label="使用期間" value="2026/04–2026/07" /><Row label="預估透明度" value="82 → 86" /></div>
          <div className="modal-actions"><button className="button button-secondary" onClick={onClose}>取消</button><button className="button button-primary" onClick={onSubmit}>模擬送出並驗證</button></div>
        </>
      )}
    </ModalShell>
  );
}

function ImprovementProjectModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (values: ImprovementProjectDraft) => void }) {
  const [title, setTitle] = useState("節能溫室通風改善");
  const [note, setNote] = useState("夏季溫室溫度過高，作物容易熱傷；計畫導入節能循環風扇與自動通風控制，降低耗損與用電。");
  const [purpose, setPurpose] = useState("節能循環風扇、控制器與安裝");
  const [pointsValue, setPointsValue] = useState(200);
  const [targetPoints, setTargetPoints] = useState(24000);
  const [impact, setImpact] = useState("預估降低溫室用電 15%");
  const [city, setCity] = useState("雲林縣");
  const [district, setDistrict] = useState("斗六市");
  const [distance, setDistance] = useState(205);
  const [completionDate, setCompletionDate] = useState("2026-12-31");
  const [proof, setProof] = useState("產銷履歷與友善耕作紀錄");
  const [materialPercent, setMaterialPercent] = useState(60);
  const [executionPercent, setExecutionPercent] = useState(25);
  const [trackingPercent, setTrackingPercent] = useState(15);
  const [quote, setQuote] = useState("希望把溫室降溫做得更省電，也讓每一筆改善都有資料可以追蹤。");
  const allocationTotal = materialPercent + executionPercent + trackingPercent;

  function submit() {
    if (!title.trim() || !note.trim() || !purpose.trim() || !impact.trim() || allocationTotal !== 100) return;
    onSubmit({
      title: title.trim(),
      note: note.trim(),
      purpose: purpose.trim(),
      points: Math.max(1, pointsValue),
      targetPoints: Math.max(1, targetPoints),
      impact: impact.trim(),
      city: city.trim(),
      district: district.trim(),
      distance: Math.max(1, distance),
      completionDate,
      proof,
      allocations: [
        { label: "設備與材料", percent: Math.max(0, materialPercent) },
        { label: "施工與執行", percent: Math.max(0, executionPercent) },
        { label: "成果追蹤", percent: Math.max(0, trackingPercent) },
      ],
      story: {
        location: `${city.trim()}・${district.trim()}`,
        headline: `阿蘭希望透過「${title.trim()}」，讓產地改善有清楚目標與公開進度`,
        quote: quote.trim(),
        paragraphs: [note.trim(), `募集的綠點將投入${purpose.trim()}，預計於 ${completionDate} 前完成，並以「${impact.trim()}」持續回報成果。`],
      },
    });
  }

  return (
    <ModalShell title="建立小農改善專案" onClose={onClose} wide>
      <div className="invoice-helper"><span><HeartHandshake /></span><div><b>把田間改善計畫公開給消費者支持</b><small>送出後會立即出現在小農專案管理與消費者「支持在地」募資區</small></div></div>
      <div className="form-grid application-form improvement-project-form">
        <label className="full">專案名稱<input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
        <label className="full">目前問題與改善方式<textarea value={note} onChange={(event) => setNote(event.target.value)} /></label>
        <label className="full">綠點主要用途<input value={purpose} onChange={(event) => setPurpose(event.target.value)} /></label>
        <label>消費者每次支持點數<input type="number" min="1" value={pointsValue} onChange={(event) => setPointsValue(Number(event.target.value))} /></label>
        <label>專案募集目標<input type="number" min="1" value={targetPoints} onChange={(event) => setTargetPoints(Number(event.target.value))} /></label>
        <label className="full">預期成果<input value={impact} onChange={(event) => setImpact(event.target.value)} /></label>
        <label>縣市<input value={city} onChange={(event) => setCity(event.target.value)} /></label>
        <label>鄉鎮市區<input value={district} onChange={(event) => setDistrict(event.target.value)} /></label>
        <label>距離台北大安區約幾公里<input type="number" min="1" value={distance} onChange={(event) => setDistance(Number(event.target.value))} /></label>
        <label>預計完成日期<input type="date" value={completionDate} onChange={(event) => setCompletionDate(event.target.value)} /></label>
        <label className="full">可信資料<select value={proof} onChange={(event) => setProof(event.target.value)}><option>產銷履歷與友善耕作紀錄</option><option>無農藥檢測報告</option><option>農會輔導與設備估價單</option><option>有機驗證資料</option></select></label>
      </div>
      <section className="project-allocation-editor">
        <div><h4>綠點如何支持產地</h4><p>三項用途比例合計需為 100%，消費者與影響力收據都會看到。</p></div>
        <div className="allocation-input-grid">
          <label>設備與材料<input type="number" min="0" max="100" value={materialPercent} onChange={(event) => setMaterialPercent(Number(event.target.value))} /><span>%</span></label>
          <label>施工與執行<input type="number" min="0" max="100" value={executionPercent} onChange={(event) => setExecutionPercent(Number(event.target.value))} /><span>%</span></label>
          <label>成果追蹤<input type="number" min="0" max="100" value={trackingPercent} onChange={(event) => setTrackingPercent(Number(event.target.value))} /><span>%</span></label>
        </div>
        <b className={allocationTotal === 100 ? "allocation-total valid" : "allocation-total"}>目前合計 {allocationTotal}% {allocationTotal === 100 ? "・可公開" : "・請調整為 100%"}</b>
      </section>
      <label className="project-quote-field">想對支持者說的話<textarea value={quote} onChange={(event) => setQuote(event.target.value)} /></label>
      <div className="project-plan-preview"><span>公開後的募資摘要</span><strong>{title || "未命名專案"}</strong><p>每次支持 {Math.max(1, pointsValue).toLocaleString()} 點・目標 {Math.max(1, targetPoints).toLocaleString()} 點・{city}{district}・預計 {completionDate} 完成</p></div>
      <p className="fine-print">本功能為 Demo；建立與支持紀錄只保留在本次瀏覽期間，重新整理後會回到預設內容。</p>
      <div className="modal-actions"><button className="button button-secondary" onClick={onClose}>取消</button><button className="button button-primary" onClick={submit} disabled={!title.trim() || !note.trim() || !purpose.trim() || !impact.trim() || allocationTotal !== 100}><HeartHandshake />確認公開募資</button></div>
    </ModalShell>
  );
}

function ProgramModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (values: Omit<IncentiveProgram, "id" | "progress">) => void }) {
  const [name, setName] = useState("社區節能行動加碼");
  const [sponsor, setSponsor] = useState("企業 ESG 計畫");
  const [action, setAction] = useState("完成指定節能行動並上傳證明");
  const [rewardPoints, setRewardPoints] = useState(300);
  const [budgetPoints, setBudgetPoints] = useState(50000);
  const [participantCount, setParticipantCount] = useState(1000);
  const [participantUnit, setParticipantUnit] = useState("人");
  const [esg, setEsg] = useState("能源效率");

  function submit() {
    if (!name.trim() || !sponsor.trim() || !action.trim()) return;
    onSubmit({
      name: name.trim(),
      sponsor: sponsor.trim(),
      action: action.trim(),
      reward: `每次 ${Math.max(1, rewardPoints).toLocaleString()} 點`,
      budgetPoints: Math.max(1, budgetPoints),
      participants: `${Math.max(1, participantCount).toLocaleString()} ${participantUnit}`,
      esg,
    });
  }

  return (
    <ModalShell title="建立綠點激勵計畫" onClose={onClose}>
      <div className="invoice-helper"><span><PackageCheck /></span><div><b>手動建立新的激勵任務</b><small>送出後會立即加入計畫列表，並同步更新計畫數與綠點預算</small></div></div>
      <div className="form-grid application-form">
        <label className="full">計畫名稱<input value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label className="full">主辦／合作單位<input value={sponsor} onChange={(event) => setSponsor(event.target.value)} /></label>
        <label className="full">參與行動<textarea value={action} onChange={(event) => setAction(event.target.value)} /></label>
        <label>每次回饋綠點<input type="number" min="1" value={rewardPoints} onChange={(event) => setRewardPoints(Number(event.target.value))} /></label>
        <label>計畫綠點預算<input type="number" min="1" value={budgetPoints} onChange={(event) => setBudgetPoints(Number(event.target.value))} /></label>
        <label>預計參與數<input type="number" min="1" value={participantCount} onChange={(event) => setParticipantCount(Number(event.target.value))} /></label>
        <label>參與對象單位<select value={participantUnit} onChange={(event) => setParticipantUnit(event.target.value)}><option>人</option><option>戶</option><option>家企業</option><option>間門市</option></select></label>
        <label className="full">ESG 成果面向<select value={esg} onChange={(event) => setEsg(event.target.value)}><option>能源效率</option><option>氣候行動</option><option>責任消費</option><option>地方共好</option><option>永續經濟</option></select></label>
      </div>
      <div className="receipt-box"><Row label="回饋規則" value={`每次 ${Math.max(1, rewardPoints).toLocaleString()} 點`} /><Row label="計畫預算" value={`${Math.max(1, budgetPoints).toLocaleString()} 點`} /><Row label="預計參與" value={`${Math.max(1, participantCount).toLocaleString()} ${participantUnit}`} /></div>
      <p className="fine-print">本功能為 Demo；新計畫只保留在本次瀏覽期間，重新整理後會回到預設內容。</p>
      <div className="modal-actions"><button className="button button-secondary" onClick={onClose}>取消</button><button className="button button-primary" onClick={submit} disabled={!name.trim() || !sponsor.trim() || !action.trim()}><CheckCircle2 />確認建立計畫</button></div>
    </ModalShell>
  );
}
function ProductModal({ product, onClose, onSubmit }: { product: FarmerProduct | null; onClose: () => void; onSubmit: (values: Omit<FarmerProduct, "id" | "image">) => void }) {
  const [title, setTitle] = useState(product?.title ?? "當季友善蔬果箱");
  const [pointsValue, setPointsValue] = useState(product?.points ?? 420);
  const [stock, setStock] = useState(product?.stock ?? 20);
  const [unit, setUnit] = useState(product?.unit ?? "箱");
  const [proof, setProof] = useState(product?.proof ?? "產銷履歷 TAP-26-0718");
  const [delivery, setDelivery] = useState(product?.delivery ?? "雲林縣與鄰近 40 公里");
  const [description, setDescription] = useState(product?.description ?? "依本週收成搭配 5–7 種友善耕作蔬果，減塑包裝並附產地批次資訊。");

  function submit() {
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), points: Math.max(1, pointsValue), stock: Math.max(0, stock), unit, proof, delivery, description });
  }

  return (
    <ModalShell title={product ? "編輯商品" : "上架新商品"} onClose={onClose}>
      <div className="invoice-helper"><span>{product ? <PackageCheck /> : <ShoppingBasket />}</span><div><b>{product ? `正在管理：${product.title}` : "建立新的小農商品"}</b><small>儲存後，商品列表、兌換綠點與庫存會立即更新</small></div></div>
      <div className="form-grid application-form">
        <label className="full">商品名稱<input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
        <label>兌換綠點<input type="number" value={pointsValue} min="1" onChange={(event) => setPointsValue(Number(event.target.value))} /></label>
        <label>可售庫存<input type="number" value={stock} min="0" onChange={(event) => setStock(Number(event.target.value))} /></label>
        <label>庫存單位<select value={unit} onChange={(event) => setUnit(event.target.value)}><option>箱</option><option>包</option><option>組</option><option>份</option></select></label>
        <label>永續證明<select value={proof} onChange={(event) => setProof(event.target.value)}><option>產銷履歷 TAP-26-0718</option><option>無農藥檢測合格</option><option>友善耕作紀錄</option><option>有機驗證資料</option></select></label>
        <label className="full">配送區域<select value={delivery} onChange={(event) => setDelivery(event.target.value)}><option>雲林縣與鄰近 40 公里</option><option>全台冷藏配送</option><option>全台常溫配送</option><option>農場自取</option></select></label>
        <label className="full">商品說明<textarea value={description} onChange={(event) => setDescription(event.target.value)} /></label>
      </div>
      <div className="receipt-box"><Row label="消費者兌換價格" value={`${Math.max(1, pointsValue).toLocaleString()} 綠點`} /><Row label="目前可售數量" value={`${Math.max(0, stock)} ${unit}`} /><Row label="配送方式" value={delivery} /></div>
      <p className="fine-print">本功能為 Demo；資料只保留在本次瀏覽期間，重新整理後會回到預設內容。</p>
      <div className="modal-actions"><button className="button button-secondary" onClick={onClose}>取消</button><button className="button button-primary" onClick={submit} disabled={!title.trim()}><CheckCircle2 />{product ? "儲存商品變更" : "確認上架新品"}</button></div>
    </ModalShell>
  );
}

function OfferModal({
  balance,
  offerId,
  step,
  setStep,
  onRedeem,
  onClose,
}: {
  balance: number;
  offerId: string;
  step: number;
  setStep: (step: number) => void;
  onRedeem: (cost: number) => void;
  onClose: () => void;
}) {
  const offer = farmerBenefits.find((item) => item.id === offerId) || farmerBenefits[0];
  const locked = balance < offer.requiredScore;
  const gap = Math.max(offer.requiredScore - balance, 0);
  const steps = ["資源確認", "領取資料", "兌換確認"];

  if (locked) {
    return (
      <ModalShell title="農會農業資源兌換" onClose={onClose} small>
        <div className="unlock-hero"><span className="unlock-orb"><LockKeyhole /></span><div><small>目前小農綠點</small><strong>{balance.toLocaleString()} 點</strong><p>還差 {gap.toLocaleString()} 點，即可兌換「{offer.name}」。</p></div></div>
        <div className="receipt-box"><Row label="所需綠點" value={`${offer.requiredScore.toLocaleString()} 點`} /><Row label="合作單位" value={offer.rate} /><Row label="適用用途" value={offer.purpose} /></div>
        <button className="button button-primary button-block" onClick={onClose}>返回累積綠點</button>
      </ModalShell>
    );
  }

  if (step === 3) {
    return (
      <ModalShell title="農會農業資源兌換" onClose={onClose} small>
        <Success title="兌換申請已完成" text="合作農會將確認庫存或補助資格，並通知領取方式。"><div className="application-number"><small>兌換編號</small><strong>GF-FA-20260802-018</strong></div></Success>
        <div className="application-timeline"><div className="done"><span><Check /></span><p><b>綠點扣抵完成</b><small>今天</small></p></div><div className="active"><span>2</span><p><b>農會確認</b><small>預估 1–2 個工作天</small></p></div><div><span>3</span><p><b>領取或輔導媒合</b><small>依資源類型通知</small></p></div></div>
        <button className="button button-primary button-block" onClick={onClose}>返回農業資源</button>
      </ModalShell>
    );
  }

  return (
    <ModalShell title="農會農業資源兌換" onClose={onClose}>
      <div className="application-stepper">{steps.map((label, index) => <div className={index <= step ? "active" : ""} key={label}><span>{index < step ? <Check /> : index + 1}</span><b>{label}</b></div>)}</div>
      {step === 0 && <div className="application-layout"><div className="application-offer"><span className="offer-status"><CheckCircle2 />餘額足夠・{offer.category}</span><h3>{offer.name}</h3><p>{offer.description}</p><div><span>所需綠點<b>{offer.requiredScore.toLocaleString()} 點</b></span><span>提供單位<b>{offer.rate}</b></span><span>領取方式<b>{offer.term}</b></span></div></div><div className="receipt-box"><Row label="目前餘額" value={`${balance.toLocaleString()} 點`} /><Row label="兌換後餘額" value={`${(balance - offer.requiredScore).toLocaleString()} 點`} /><Row label="適用用途" value={offer.purpose} /></div></div>}
      {step === 1 && <div className="form-grid application-form"><label className="full">領取農會<select defaultValue="雲林縣斗六市農會"><option>雲林縣斗六市農會</option><option>雲林縣古坑鄉農會</option></select></label><label>聯絡人<input defaultValue="林禾日" /></label><label>聯絡電話<input defaultValue="0912-345-678" /></label><label className="full">使用說明<textarea defaultValue={offer.planText} /></label></div>}
      {step === 2 && <div className="review-card"><div className="review-head"><span><FileCheck2 /></span><div><small>扣點前最後確認</small><h3>{offer.name}</h3></div></div><div className="receipt-box"><Row label="申請小農" value="禾日友善農園" /><Row label="合作農會" value="雲林縣斗六市農會" /><Row label="扣抵綠點" value={`${offer.requiredScore.toLocaleString()} 點`} /><Row label="兌換後餘額" value={`${(balance - offer.requiredScore).toLocaleString()} 點`} /></div><label className="consent"><input type="checkbox" defaultChecked />我確認使用綠點兌換此農業資源，並同意由合作農會聯繫。</label></div>}
      <p className="fine-print">本流程為提案 Demo，不會送出真實申請或扣除實際點數。</p>
      <div className="modal-actions"><button className="button button-secondary" onClick={() => step === 0 ? onClose() : setStep(step - 1)}>{step === 0 ? "取消" : "上一步"}</button><button className="button button-primary" onClick={() => { if (step === 2) { onRedeem(offer.requiredScore); setStep(3); } else { setStep(step + 1); } }}>{step === 2 ? "確認兌換並扣點" : "下一步"}</button></div>
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
    <ModalShell title="小農專案與綠點成果" onClose={onClose}>
      <div className="portfolio-summary">
        <article><strong>4 戶</strong><span>示範農戶</span></article><article><strong>38,200 點</strong><span>累積支持</span></article><article><strong>85%</strong><span>平均成果透明度</span></article><article><strong>75%</strong><span>專案正常推進</span></article>
      </div>
      <div className="portfolio-layout">
        <div className="portfolio-list">
          {farmers.map((item) => (
            <button className={item.name === selected.name ? "active" : ""} onClick={() => setSelectedName(item.name)} key={item.name}>
              <span className="portfolio-avatar"><Sprout /></span>
              <span><b>{item.name}</b><small>{item.area}・{item.crop}・{item.purpose}</small></span>
              <em>{item.score}%</em>
            </button>
          ))}
        </div>
        <section className="portfolio-detail">
          <header><div><small>目前查看</small><h3>{selected.name}</h3><p>{selected.area}地區・{selected.crop}農戶</p></div><span className={`status-pill ${selected.status === "待補資料" ? "waiting" : ""}`}>{selected.status}</span></header>
          <div className="portfolio-credit"><div className="mini-score">{selected.score}<small>成果透明度</small></div><div><b>資料完整度 {selected.completeness}%</b><div className="progress"><span style={{ width: `${selected.completeness}%` }} /></div><small>{selected.completeness < 80 ? "需補充設備估價與減碳資料" : "資料足以公開專案進度"}</small></div></div>
          <div className="receipt-box"><Row label="累積支持" value={selected.amount} /><Row label="主要用途" value={selected.purpose} /><Row label="本月綠點支持" value={selected.name === "禾日友善農園" ? "12,680 點" : "8,240 點"} /><Row label="預估環境效益" value={selected.crop === "稻米" ? "減碳 8.6 噸／年" : "資源效率提升 15%"} /></div>
          <div className="portfolio-actions"><button className="button button-secondary">查看永續資料</button><button className="button button-primary">查看專案檢核</button></div>
        </section>
      </div>
      <p className="fine-print">小農、綠點與成果資料皆為 Demo 模擬，用於展示平台如何追蹤專案與地方影響。</p>
    </ModalShell>
  );
}

function FarmerDetailModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell title="禾日友善農園" onClose={onClose} small>
      <div className="farmer-summary"><div className="mini-score">86<small>成果透明度</small></div><div><h3>資料完整、穩健成長</h3><p>雲林地區葉菜農戶，目前公開節水灌溉改善專案。</p></div></div>
      <div className="receipt-box"><Row label="支持綠點" value="12,680 點" /><Row label="專案目標" value="68,000 點" /><Row label="資料完整度" value="100%" /><Row label="專案狀態" value="執行中" /></div>
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
