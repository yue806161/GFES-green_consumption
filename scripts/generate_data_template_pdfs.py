from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import KeepTogether, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "pdf"
PUBLIC_DIR = ROOT / "public" / "documents"
FONT_PATH = Path("C:/Windows/Fonts/msjh.ttc")


DOCUMENTS = [
    {
        "key": "consumer_invoice",
        "filename": "GFES_綠色消費證明_完整範例.pdf",
        "title": "綠色消費證明申請暨查驗表",
        "number": "GFES-CI-202608-001",
        "role": "消費者",
        "purpose": "消費回饋綠點申請與電子／傳統發票查驗",
        "sections": [
            ("申請人資料", [("平台帳號", "consumer-001"), ("姓名", "林子晴"), ("所在地", "台北市大安區"), ("聯絡信箱", "consumer@gfes.tw")]),
            ("交易資料", [("發票類型", "電子發票"), ("發票號碼", "AB12345678"), ("隨機碼", "4827"), ("交易日期", "2026 年 8 月 8 日"), ("消費金額", "新臺幣 680 元"), ("商店名稱", "大安友善雜貨店"), ("綠色消費分類", "在地友善農產")]),
            ("附件與查驗", [("必要附件", "AB12345678.pdf"), ("附件格式", "PDF／電子發票載具明細"), ("查驗項目", "發票號碼、日期、商店、金額與綠色分類"), ("重複申請檢查", "同一發票號碼僅限申請一次")]),
            ("申請人聲明", [("聲明內容", "本人確認交易資料與所附原始文件相符，並同意平台進行必要查驗。"), ("確認狀態", "已確認"), ("簽署日期", "2026 年 8 月 10 日")]),
        ],
    },
    {
        "key": "farm_trace",
        "filename": "GFES_農產履歷批次資料_完整範例.pdf",
        "title": "農產履歷與生產批次資料表",
        "number": "GFES-FT-202608-001",
        "role": "合作小農",
        "purpose": "商品上架、產地揭露及農產履歷查驗",
        "sections": [
            ("生產者資料", [("小農編號", "farmer-001"), ("農場名稱", "禾日友善農園"), ("負責人", "林美惠"), ("生產地", "雲林縣斗六市")]),
            ("作物批次", [("作物名稱", "小白菜"), ("追溯編號", "TAP-26-0718"), ("種植日期", "2026 年 5 月 12 日"), ("採收日期", "2026 年 7 月 18 日"), ("批次產量", "320 公斤"), ("田區代碼", "YL-DL-03")]),
            ("履歷查驗", [("查驗結果", "產銷履歷有效"), ("查驗單位", "合作農會產銷履歷窗口"), ("查驗日期", "2026 年 7 月 20 日"), ("履歷狀態", "有效期內")]),
            ("附件清單", [("附件一", "產銷履歷證明.pdf"), ("附件二", "批次採收紀錄.pdf"), ("附件三", "田區與包裝批號對照表.pdf")]),
        ],
    },
    {
        "key": "pesticide_test",
        "filename": "GFES_無農藥檢測報告_完整範例.pdf",
        "title": "農藥殘留檢測報告摘要暨查驗表",
        "number": "GFES-PT-202607-018",
        "role": "合作小農",
        "purpose": "無農藥殘留資料揭露與商品資格審查",
        "sections": [
            ("檢驗單位", [("實驗室", "農業部認證檢驗單位（範例）"), ("報告編號", "LAB-2026-0718-028"), ("認證依據", "ISO/IEC 17025"), ("報告日期", "2026 年 7 月 22 日")]),
            ("樣本資料", [("農場名稱", "禾日友善農園"), ("作物名稱", "小白菜"), ("批次編號", "TAP-26-0718"), ("採樣日期", "2026 年 7 月 18 日"), ("採樣方式", "田間隨機採樣並封緘送驗")]),
            ("檢測結果", [("檢測方法", "公告農藥多重殘留分析方法"), ("檢測項目", "410 項"), ("分析結果", "未檢出"), ("判定結論", "符合公告容許量標準"), ("品質管制", "空白、添加回收率與儀器校正均符合規範")]),
            ("附件與聲明", [("正式附件", "LAB-2026-0718-028.pdf"), ("資料完整性", "已核對報告編號、樣本批次與實驗室資訊"), ("用途限制", "本摘要應與原始檢驗報告一併使用")]),
        ],
    },
    {
        "key": "cultivation_log",
        "filename": "GFES_友善耕作紀錄_完整範例.pdf",
        "title": "友善耕作與農業資材使用紀錄表",
        "number": "GFES-CL-2026Q2-006",
        "role": "合作小農",
        "purpose": "田間作業、用水、肥培與病蟲害管理紀錄",
        "sections": [
            ("農場與田區", [("小農編號", "farmer-001"), ("農場名稱", "禾日友善農園"), ("田區代碼", "YL-DL-03"), ("耕作面積", "0.8 公頃"), ("紀錄期間", "2026 年 4 月 1 日至 6 月 30 日")]),
            ("田間作業紀錄", [("2026-04-05", "整地與堆肥施用｜腐熟有機堆肥 240 公斤"), ("2026-05-18", "病蟲害巡田｜設置黏蟲板 20 片，未使用化學農藥"), ("2026-06-12", "滴灌作業｜用水量 18 立方公尺"), ("2026-06-28", "採收前巡查｜完成田區清潔與批次標示")]),
            ("資材與環境管理", [("肥培資材", "腐熟有機堆肥，來源與批號留存"), ("病蟲害管理", "物理防治、巡田與誘蟲監測"), ("水資源管理", "滴灌並按月抄錄水表"), ("廢棄物管理", "農膜與資材容器分類回收")]),
            ("紀錄聲明", [("紀錄人", "林美惠"), ("覆核人", "合作農會輔導員"), ("簽署日期", "2026 年 7 月 2 日"), ("聲明", "以上紀錄依實際田間作業填寫並保存相關單據。")]),
        ],
    },
    {
        "key": "equipment_evidence",
        "filename": "GFES_低碳設備使用證明_完整範例.pdf",
        "title": "低碳與節水設備使用成效證明",
        "number": "GFES-EQ-202607-011",
        "role": "合作小農",
        "purpose": "設備補助、節水與低碳作業成效驗證",
        "sections": [
            ("設備資料", [("設備名稱", "智慧滴灌控制器"), ("型號", "WATER-SMART-02"), ("安裝日期", "2026 年 4 月 1 日"), ("安裝地點", "雲林縣斗六市 YL-DL-03"), ("設備序號", "WS02-YL-260401-18")]),
            ("使用成效", [("統計期間", "2026 年 4 月 1 日至 7 月 31 日"), ("運轉時數", "486 小時"), ("改善前用水", "420 立方公尺"), ("改善後用水", "344 立方公尺"), ("估算節水率", "18.1%"), ("計算方式", "同田區同期水表讀值比較")]),
            ("證明附件", [("附件一", "設備發票與付款證明.pdf"), ("附件二", "安裝完工紀錄.pdf"), ("附件三", "改善前後水表讀值.pdf"), ("附件四", "控制器運轉紀錄.xlsx")]),
            ("申請人聲明", [("申請人", "林美惠"), ("確認事項", "設備持續用於核定田區，資料取自設備與水表原始紀錄"), ("簽署日期", "2026 年 8 月 1 日")]),
        ],
    },
    {
        "key": "improvement_plan",
        "filename": "GFES_小農改善專案計畫書_完整範例.pdf",
        "title": "小農永續改善專案計畫書",
        "number": "GFES-IP-202608-003",
        "role": "合作小農",
        "purpose": "公開募資用途、預算、里程碑與預期地方效益",
        "sections": [
            ("申請單位", [("小農編號", "farmer-001"), ("農場名稱", "禾日友善農園"), ("計畫主持人", "林美惠"), ("執行地點", "雲林縣斗六市")]),
            ("計畫摘要", [("計畫名稱", "節水灌溉改善計畫"), ("問題說明", "旱季用水量偏高，既有管線老化且灌溉分區控制不足。"), ("改善目標", "汰換滴灌管線並導入分區控制器，降低用水與人工作業。"), ("執行期間", "2026 年 9 月 1 日至 12 月 31 日"), ("募資目標", "96,000 綠點"), ("最低支持", "每次 300 綠點")]),
            ("工作項目與里程碑", [("第一階段", "完成田區測量、設備規格確認與採購｜2026-09-30"), ("第二階段", "完成管線汰換、控制器安裝與測試｜2026-11-15"), ("第三階段", "連續抄錄用水與運轉資料並完成成果回報｜2026-12-31")]),
            ("經費配置", [("設備與材料", "57,600 點｜60%"), ("安裝與改善", "24,000 點｜25%"), ("成果追蹤", "14,400 點｜15%"), ("合計", "96,000 點｜100%")]),
            ("預期效益", [("節水目標", "用水量降低 18%"), ("受益人數", "3 位農場工作者"), ("揭露方式", "每月回報水表與設備運轉紀錄"), ("地方效益", "提升旱季生產穩定度並形成可複製的節水示範")]),
            ("附件清單", [("附件一", "設備估價單.pdf"), ("附件二", "農產履歷.pdf"), ("附件三", "田區配置與改善前照片.pdf"), ("附件四", "農會輔導意見書.pdf")]),
        ],
    },
    {
        "key": "outcome_report",
        "filename": "GFES_改善專案成果回報_完整範例.pdf",
        "title": "改善專案成果回報暨查核表",
        "number": "GFES-OR-202612-003",
        "role": "合作小農",
        "purpose": "專案完成後回報節水、減碳、受益人數與成果佐證",
        "sections": [
            ("專案資料", [("專案編號", "water"), ("專案名稱", "節水灌溉改善計畫"), ("回報期間", "2026 年 9 月 1 日至 12 月 31 日"), ("執行狀態", "已完成"), ("執行單位", "禾日友善農園")]),
            ("成果摘要", [("節省用水", "76,000 公升"), ("估算減碳", "315 kg CO2e"), ("受益人數", "3 人"), ("完成率", "100%"), ("成果結論", "分區控制與滴灌管線已完成，旱季用水與作業時間均下降。")]),
            ("指標查核", [("農業用水", "基準 420 m³｜成果 344 m³｜水表前後期比較"), ("設備運轉", "基準 人工灌溉｜成果 分區自動控制｜控制器紀錄"), ("作業時間", "每週減少約 6 小時人工巡灌")]),
            ("附件清單", [("附件一", "完工與設備照片.pdf"), ("附件二", "水表紀錄.xlsx"), ("附件三", "設備發票.pdf"), ("附件四", "控制器運轉匯出紀錄.csv")]),
            ("填報聲明", [("填報人", "林美惠"), ("填報日期", "2026 年 12 月 31 日"), ("聲明", "以上成果均有原始紀錄可供平台與合作單位抽查。")]),
        ],
    },
    {
        "key": "institution_program",
        "filename": "GFES_綠點激勵計畫_完整範例.pdf",
        "title": "綠點激勵計畫與預算申請書",
        "number": "GFES-GI-2026-012",
        "role": "銀行／政府／企業",
        "purpose": "建立發點條件、預算、參與對象與 ESG 成果指標",
        "sections": [
            ("提案單位", [("機構編號", "institution-001"), ("單位名稱", "永續共好計畫辦公室"), ("承辦部門", "ESG 推動組"), ("計畫聯絡人", "永續專案經理")]),
            ("計畫內容", [("計畫名稱", "低碳通勤綠點"), ("獎勵行動", "搭乘大眾運輸或使用共享單車"), ("單次獎勵", "20 綠點"), ("計畫預算", "96,400 綠點"), ("執行期間", "2026 年 9 月 1 日至 12 月 31 日"), ("目標人次", "4,820 人次")]),
            ("資格與治理", [("資格規則", "完成交通紀錄驗證"), ("重複政策", "同日同帳號最多一次"), ("審核頻率", "每月"), ("異常處理", "重複、撤銷或無法驗證的紀錄不予發點"), ("預算控管", "達預算 80% 時發送預警，100% 時停止新發點")]),
            ("ESG 與成效指標", [("參與人次", "目標 4,820 人次"), ("估算減碳", "依公開運具排放係數估算 kg CO2e"), ("地方效益", "綠點可支持在地小農專案與農產兌換"), ("揭露頻率", "每月儀表板、季報與年度影響力摘要")]),
            ("附件與核決", [("附件一", "計畫預算明細.pdf"), ("附件二", "個資與資料交換說明.pdf"), ("附件三", "ESG 指標計算方法.pdf"), ("核決層級", "提案單位主管、財務與平台管理員")]),
        ],
    },
    {
        "key": "procurement_request",
        "filename": "GFES_永續採購需求_完整範例.pdf",
        "title": "永續採購需求與驗收規格書",
        "number": "GFES-PR-202608-005",
        "role": "銀行／政府／企業",
        "purpose": "建立採購數量、預算、履歷條件、配送與驗收規格",
        "sections": [
            ("採購單位", [("機構編號", "institution-001"), ("單位名稱", "永續共好計畫辦公室"), ("需求部門", "採購與員工福利組"), ("承辦人", "永續採購專員")]),
            ("採購需求", [("需求名稱", "員工永續福利小農箱"), ("品項類別", "友善農產箱"), ("需求數量", "200 箱"), ("預算綠點", "120,000 點"), ("配送區域", "台北市"), ("預計交付", "2026 年 9 月 30 日")]),
            ("供應資格", [("產銷履歷", "必要"), ("農藥殘留檢測", "必要"), ("在地距離優先", "50 公里內優先媒合"), ("包裝要求", "循環箱或可回收減塑包裝"), ("履約能力", "需提出批次供貨與低溫配送計畫")]),
            ("配送與驗收", [("配送方式", "依單位名冊分批配送"), ("驗收文件", "產銷履歷、出貨批次清單、配送簽收紀錄"), ("抽驗方式", "抽樣核對批次、數量、外觀與文件"), ("不合格處理", "限期補正、換貨或按比例扣減"), ("成果回報", "回報合作農戶、採購金額、配送批次與估算地方效益")]),
            ("附件清單", [("附件一", "品項與數量明細.xlsx"), ("附件二", "配送名冊範例.xlsx"), ("附件三", "供應商資格文件.pdf"), ("附件四", "驗收紀錄表.pdf")]),
        ],
    },
]


def register_font():
    pdfmetrics.registerFont(TTFont("GFES-TC", str(FONT_PATH), subfontIndex=0))


def esc(value):
    return str(value).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def build_pdf(spec):
    styles = getSampleStyleSheet()
    body = ParagraphStyle("Body", parent=styles["BodyText"], fontName="GFES-TC", fontSize=9, leading=14, textColor=colors.HexColor("#263d33"))
    small = ParagraphStyle("Small", parent=body, fontSize=7.5, leading=11, textColor=colors.HexColor("#6b7d74"))
    label = ParagraphStyle("Label", parent=body, fontSize=8, leading=12, textColor=colors.HexColor("#587064"))
    title = ParagraphStyle("Title", parent=body, fontSize=20, leading=28, alignment=TA_CENTER, textColor=colors.HexColor("#133f2f"))
    section_title = ParagraphStyle("Section", parent=body, fontSize=12, leading=16, textColor=colors.HexColor("#1a6547"))
    centered = ParagraphStyle("Centered", parent=small, alignment=TA_CENTER)

    output_path = OUTPUT_DIR / spec["filename"]
    doc = SimpleDocTemplate(str(output_path), pagesize=A4, leftMargin=15 * mm, rightMargin=15 * mm, topMargin=19 * mm, bottomMargin=15 * mm, title=spec["title"], author="GFES 綠色消費循環平台")
    story = []
    header = Table([[Paragraph("GFES", ParagraphStyle("Brand", parent=title, fontSize=17, textColor=colors.white)), Paragraph("GREEN CONSUMPTION CIRCULATION PLATFORM<br/><font size='8'>綠色消費循環平台・完整文件 PDF 範例</font>", ParagraphStyle("Header", parent=small, textColor=colors.white))]], colWidths=[32 * mm, 148 * mm])
    header.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#17563d")), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 10), ("TOPPADDING", (0, 0), (-1, -1), 9), ("BOTTOMPADDING", (0, 0), (-1, -1), 9), ("LINEAFTER", (0, 0), (0, 0), 0.5, colors.HexColor("#d7eadf"))]))
    story.extend([header, Spacer(1, 5 * mm), Paragraph(esc(spec["title"]), title), Spacer(1, 1.5 * mm), Paragraph(f"文件編號：{esc(spec['number'])}　｜　適用角色：{esc(spec['role'])}<br/>文件用途：{esc(spec['purpose'])}", centered), Spacer(1, 5 * mm)])

    for index, (name, rows) in enumerate(spec["sections"], 1):
        data = [[Paragraph(esc(field), label), Paragraph(esc(value), body)] for field, value in rows]
        table = Table(data, colWidths=[43 * mm, 137 * mm], repeatRows=0, hAlign="LEFT")
        table.setStyle(TableStyle([("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#edf5ea")), ("GRID", (0, 0), (-1, -1), 0.55, colors.HexColor("#c7d5ca")), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8), ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5)]))
        story.extend([Paragraph(f"{index}、{esc(name)}", section_title), Spacer(1, 1.5 * mm), table, Spacer(1, 4 * mm)])

    review = Table([
        [Paragraph("審核結果", label), Paragraph("□ 核准　□ 退回補件", body), Paragraph("審核日期", label), Paragraph("＿＿ 年 ＿＿ 月 ＿＿ 日", body)],
        [Paragraph("審核說明", label), Paragraph("＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿", body), Paragraph("審核人員", label), Paragraph("＿＿＿＿＿＿＿＿", body)],
    ], colWidths=[28 * mm, 62 * mm, 28 * mm, 62 * mm])
    review.setStyle(TableStyle([("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#edf5ea")), ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#edf5ea")), ("GRID", (0, 0), (-1, -1), 0.55, colors.HexColor("#c7d5ca")), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("LEFTPADDING", (0, 0), (-1, -1), 7), ("RIGHTPADDING", (0, 0), (-1, -1), 7), ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6)]))
    checklist = Table([
        [Paragraph("項次", label), Paragraph("送件檢核項目", label), Paragraph("申請人確認", label), Paragraph("管理員查驗", label)],
        [Paragraph("1", centered), Paragraph("必要欄位均已填寫，文件編號及日期清楚可辨", body), Paragraph("□ 完成", centered), Paragraph("□ 通過", centered)],
        [Paragraph("2", centered), Paragraph("附件為原始核發文件，且與本表所載資料一致", body), Paragraph("□ 完成", centered), Paragraph("□ 通過", centered)],
        [Paragraph("3", centered), Paragraph("身分證號、完整帳號及其他敏感資訊已適當遮罩", body), Paragraph("□ 完成", centered), Paragraph("□ 通過", centered)],
        [Paragraph("4", centered), Paragraph("已確認未以相同交易、批次或專案重複申請", body), Paragraph("□ 完成", centered), Paragraph("□ 通過", centered)],
    ], colWidths=[15 * mm, 105 * mm, 30 * mm, 30 * mm], repeatRows=1)
    checklist.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#dcecdc")), ("GRID", (0, 0), (-1, -1), 0.55, colors.HexColor("#c7d5ca")), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("LEFTPADDING", (0, 0), (-1, -1), 7), ("RIGHTPADDING", (0, 0), (-1, -1), 7), ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6)]))
    history = Table([
        [Paragraph("文件版本", label), Paragraph("1.0", body), Paragraph("範例產製日期", label), Paragraph("2026 年 8 月 10 日", body)],
        [Paragraph("保存期限", label), Paragraph("依平台及合作單位規範", body), Paragraph("資料狀態", label), Paragraph("正式格式範例／未送審", body)],
    ], colWidths=[28 * mm, 62 * mm, 28 * mm, 62 * mm])
    history.setStyle(TableStyle([("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#edf5ea")), ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#edf5ea")), ("GRID", (0, 0), (-1, -1), 0.55, colors.HexColor("#c7d5ca")), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("LEFTPADDING", (0, 0), (-1, -1), 7), ("RIGHTPADDING", (0, 0), (-1, -1), 7), ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6)]))
    story.extend([
        KeepTogether([Paragraph("送件完整性檢核", section_title), Spacer(1, 1.5 * mm), checklist]),
        Spacer(1, 4 * mm),
        KeepTogether([Paragraph("審核與核決欄", section_title), Spacer(1, 1.5 * mm), review]),
        Spacer(1, 4 * mm),
        KeepTogether([Paragraph("文件版本與保存資訊", section_title), Spacer(1, 1.5 * mm), history]),
        Spacer(1, 4 * mm),
        Paragraph("文件說明：本文件為 GFES 綠色消費循環平台之完整格式範例，用於前後台欄位對照、流程測試及送件準備；實際申請應檢附原始核發文件並依合作單位最新規範辦理。", small),
    ])

    def footer(canvas, document):
        canvas.saveState()
        if document.page > 1:
            canvas.setFillColor(colors.HexColor("#17563d"))
            canvas.rect(15 * mm, 282 * mm, 180 * mm, 7 * mm, fill=1, stroke=0)
            canvas.setFillColor(colors.white)
            canvas.setFont("GFES-TC", 8)
            canvas.drawString(19 * mm, 284.2 * mm, f"GFES｜{spec['title']}｜續頁")
        canvas.setStrokeColor(colors.HexColor("#b9cbbd"))
        canvas.line(15 * mm, 11 * mm, 195 * mm, 11 * mm)
        canvas.setFont("GFES-TC", 7)
        canvas.setFillColor(colors.HexColor("#66776e"))
        canvas.drawString(15 * mm, 7 * mm, f"GFES 綠色消費循環平台｜{spec['number']}")
        canvas.drawRightString(195 * mm, 7 * mm, f"第 {document.page} 頁")
        canvas.restoreState()

    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    (PUBLIC_DIR / spec["filename"]).write_bytes(output_path.read_bytes())


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    register_font()
    for spec in DOCUMENTS:
        build_pdf(spec)


if __name__ == "__main__":
    main()
