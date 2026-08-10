from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "pdf"
PUBLIC_DIR = ROOT / "public" / "documents"
FONT_PATH = Path("C:/Windows/Fonts/msjh.ttc")


def register_fonts():
    if not FONT_PATH.exists():
        raise FileNotFoundError(f"Traditional Chinese font not found: {FONT_PATH}")
    pdfmetrics.registerFont(TTFont("GFES-TC", str(FONT_PATH), subfontIndex=0))


def p(text, style):
    return Paragraph(str(text).replace("&", "&amp;"), style)


def make_pdf(filename, document_number, action_title, reward_points, action_rows, attachment_rows):
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    styles = getSampleStyleSheet()
    body = ParagraphStyle("BodyTC", parent=styles["BodyText"], fontName="GFES-TC", fontSize=9.5, leading=15, textColor=colors.HexColor("#263d33"))
    small = ParagraphStyle("SmallTC", parent=body, fontSize=7.5, leading=11, textColor=colors.HexColor("#64766d"))
    label = ParagraphStyle("LabelTC", parent=body, fontSize=8, leading=12, textColor=colors.HexColor("#567064"))
    value = ParagraphStyle("ValueTC", parent=body, fontSize=9.5, leading=14, textColor=colors.HexColor("#153d2e"))
    heading = ParagraphStyle("HeadingTC", parent=body, fontSize=12, leading=16, textColor=colors.HexColor("#18553d"), spaceAfter=6)
    title = ParagraphStyle("TitleTC", parent=body, fontSize=21, leading=28, alignment=TA_CENTER, textColor=colors.HexColor("#123f2e"))
    centered = ParagraphStyle("CenterTC", parent=small, alignment=TA_CENTER)

    def field_table(rows, widths=(38 * mm, 62 * mm, 38 * mm, 42 * mm)):
        data = []
        for left_label, left_value, right_label, right_value in rows:
            data.append([p(left_label, label), p(left_value, value), p(right_label, label), p(right_value, value)])
        table = Table(data, colWidths=list(widths), hAlign="LEFT")
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#edf5ea")),
            ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#edf5ea")),
            ("GRID", (0, 0), (-1, -1), 0.55, colors.HexColor("#cbd9ce")),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 7),
            ("RIGHTPADDING", (0, 0), (-1, -1), 7),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ]))
        return table

    output_path = OUTPUT_DIR / filename
    doc = SimpleDocTemplate(
        str(output_path), pagesize=A4,
        leftMargin=15 * mm, rightMargin=15 * mm,
        topMargin=13 * mm, bottomMargin=15 * mm,
        title="GFES 消費者綠色行動證明繳交表",
        author="GFES 綠色消費循環平台",
    )

    story = []
    header = Table([
        [p("GFES", ParagraphStyle("Brand", parent=title, fontSize=17, textColor=colors.white)),
         p("GREEN CONSUMPTION CIRCULATION PLATFORM<br/><font size='8'>綠色消費循環平台・正式文件格式範例</font>", ParagraphStyle("HeaderText", parent=small, textColor=colors.white, alignment=TA_LEFT))]
    ], colWidths=[32 * mm, 148 * mm])
    header.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#17563d")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
        ("LINEAFTER", (0, 0), (0, 0), 0.5, colors.HexColor("#d7eadf")),
    ]))
    story.extend([header, Spacer(1, 5 * mm), p("消費者綠色行動證明繳交表", title), Spacer(1, 1 * mm), p(f"文件編號：{document_number}　｜　文件狀態：正式範例（供欄位與附件格式對照）", centered), Spacer(1, 4 * mm)])

    story.extend([
        p("壹、申請人基本資料", heading),
        field_table([
            ("平台帳號", "consumer-001", "申請人", "林子晴"),
            ("所在縣市", "台北市", "行政區", "大安區"),
            ("聯絡信箱", "consumer@gfes.tw", "送件日期", "2026 年 8 月 10 日"),
        ]),
        Spacer(1, 3 * mm),
        p("貳、綠色行動申請內容", heading),
        field_table([
            ("行動類別", action_title, "申請綠點", f"{reward_points} 點"),
            ("行動日期", action_rows[0][1], "發生地點", action_rows[0][3]),
            *action_rows[1:],
        ]),
        Spacer(1, 3 * mm),
        p("參、附件與查驗資料", heading),
    ])

    attachment_table = Table(
        [[p("項次", label), p("附件／查驗欄位", label), p("文件識別資訊", label), p("檢附狀態", label)]] +
        [[p(index + 1, centered), p(name, value), p(reference, small), p(status, centered)] for index, (name, reference, status) in enumerate(attachment_rows)],
        colWidths=[15 * mm, 67 * mm, 70 * mm, 28 * mm],
    )
    attachment_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#dcecdc")),
        ("GRID", (0, 0), (-1, -1), 0.55, colors.HexColor("#c4d3c7")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.extend([attachment_table, Spacer(1, 3 * mm)])

    story.extend([
        p("肆、申請人聲明", heading),
        Table([[p("本人確認上述資料與所附證明文件均屬實，並同意 GFES 綠色消費循環平台依行動規則進行查驗。若資料不完整、重複申請或與原始紀錄不符，平台得退回補件或不予發放綠點。", body)]], colWidths=[180 * mm], style=TableStyle([
            ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#9eb7a5")),
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f6faf5")),
            ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ("RIGHTPADDING", (0, 0), (-1, -1), 10),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ])),
        Spacer(1, 3 * mm),
        p("伍、管理員審核欄", heading),
        field_table([
            ("審核結果", "□ 核准　□ 退回補件", "核發點數", "＿＿＿＿ 點"),
            ("審核說明", "＿＿＿＿＿＿＿＿＿＿＿＿", "審核日期", "＿＿ 年 ＿＿ 月 ＿＿ 日"),
            ("審核人員", "＿＿＿＿＿＿＿＿", "查驗編號", "＿＿＿＿＿＿＿＿＿＿"),
        ]),
        Spacer(1, 3 * mm),
        p("文件說明：本文件為 GFES 平台正式繳交格式範例，用於展示必要欄位與佐證要求；不代表政府機關、金融機構或公用事業核發之證明。實際送件仍應檢附原始交易、票證、帳單或產品效能資料。", small),
    ])

    def footer(canvas, document):
        canvas.saveState()
        canvas.setStrokeColor(colors.HexColor("#b9cbbd"))
        canvas.line(15 * mm, 11 * mm, 195 * mm, 11 * mm)
        canvas.setFont("GFES-TC", 7)
        canvas.setFillColor(colors.HexColor("#66776e"))
        canvas.drawString(15 * mm, 7 * mm, f"GFES 綠色消費循環平台｜{document_number}")
        canvas.drawRightString(195 * mm, 7 * mm, f"第 {document.page} 頁")
        canvas.restoreState()

    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    (PUBLIC_DIR / filename).write_bytes(output_path.read_bytes())


def main():
    register_fonts()
    make_pdf(
        "GFES_環保杯行動證明_正式範例.pdf",
        "GFES-CA-20260810-001",
        "使用環保杯",
        10,
        [
            ("行動日期", "2026 年 8 月 10 日 09:18", "發生地點", "台北市大安區・綠田生活咖啡"),
            ("商店交易序號", "GT-20260810-0918", "消費金額", "新臺幣 95 元"),
            ("容器類型", "消費者自備可重複使用杯", "店家確認碼", "CUP-DAAN-0810-026"),
        ],
        [
            ("電子發票／交易明細", "發票號碼 AB12345678・交易時間 09:18", "已檢附"),
            ("合作店家行動確認", "店家代碼 GFES-M-DAAN-008・確認碼 CUP-DAAN-0810-026", "已驗證"),
            ("原始照片（非必要）", "僅在無數位交易紀錄時作補充佐證", "免附"),
        ],
    )
    make_pdf(
        "GFES_電子帳單行動證明_正式範例.pdf",
        "GFES-CA-20260810-002",
        "改用電子帳單",
        50,
        [
            ("行動日期", "2026 年 8 月 9 日", "發生地點", "線上服務／台北市大安區"),
            ("服務單位", "台北綠能公用事業（範例）", "帳戶末四碼", "4827"),
            ("生效期別", "2026 年 9 月帳單起", "申請確認碼", "EBILL-20260809-4827"),
        ],
        [
            ("電子帳單啟用通知", "通知編號 EBILL-20260809-4827・寄送信箱已遮罩", "已檢附"),
            ("服務帳戶資料", "客戶編號末四碼 4827・不得上傳完整身分證號", "已核對"),
            ("最近一期帳單", "僅核對服務單位與帳戶歸屬，金額可遮罩", "已檢附"),
        ],
    )
    make_pdf(
        "GFES_大眾運輸行動證明_正式範例.pdf",
        "GFES-CA-20260810-003",
        "搭乘大眾運輸",
        80,
        [
            ("行動日期", "2026 年 8 月 8 日 08:05", "發生地點", "台北捷運・大安站至台北車站"),
            ("電子票證識別", "卡號末四碼 7316", "運具類型", "捷運"),
            ("乘車紀錄序號", "TR-20260808-7316", "查驗期間", "2026 年 8 月 8 日"),
        ],
        [
            ("電子票證乘車紀錄", "僅顯示卡號末四碼、進出站與交易時間", "已檢附"),
            ("運輸業者交易序號", "TR-20260808-7316・不得上傳完整票證卡號", "已核對"),
            ("行程說明", "大安站 08:05 進站・台北車站 08:19 出站", "已檢附"),
        ],
    )
    make_pdf(
        "GFES_節能家電行動證明_正式範例.pdf",
        "GFES-CA-20260810-004",
        "購買節能家電",
        600,
        [
            ("行動日期", "2026 年 8 月 6 日", "發生地點", "台北市大安區・永續家電通路（範例）"),
            ("產品類別", "一級能效變頻冷氣", "廠牌／型號", "GREEN-AIR GA-36A（範例）"),
            ("發票號碼", "CD87654321", "能源效率分級", "第 1 級"),
        ],
        [
            ("統一發票／購買證明", "發票號碼 CD87654321・購買日期 2026-08-06", "已檢附"),
            ("能源效率標示", "能源效率分級標示號碼 EE-2026-GA36A", "已核對"),
            ("產品保證書或序號頁", "產品序號僅顯示末六碼 482731", "已檢附"),
        ],
    )
    alias_name = "GFES_消費者綠色行動證明_正式範例.pdf"
    source_name = "GFES_環保杯行動證明_正式範例.pdf"
    (PUBLIC_DIR / alias_name).write_bytes((PUBLIC_DIR / source_name).read_bytes())


if __name__ == "__main__":
    main()
