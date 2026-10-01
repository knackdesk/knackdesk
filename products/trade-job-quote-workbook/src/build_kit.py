"""Build the Trade Job Quote & Change Order Workbook, README and zip. Usage: build_kit.py --out DIR"""
import argparse, os, zipfile
from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

FONT = "Arial"
BLUE = Font(name=FONT, color="0000FF"); BLACK = Font(name=FONT); BOLD = Font(name=FONT, bold=True)
TITLE = Font(name=FONT, bold=True, size=14); MUTED = Font(name=FONT, italic=True, color="666666")
YELLOW = PatternFill("solid", fgColor="FFFF00"); HEAD = PatternFill("solid", fgColor="E7E6E6")
MONEY = '#,##0.00;(#,##0.00);"-"'; PCT = '0.00"%"'
MAT_ROWS = (6, 20); LAB_ROWS = (23, 32); SUB_ROWS = (35, 40); CO_ROWS = (5, 24); JOB_ROWS = (5, 40)
S = "Settings!$B$"; CO = "'Change Orders'!"


def head(ws, row, labels, widths=None, col=1):
    for i, label in enumerate(labels, start=col):
        c = ws.cell(row=row, column=i, value=label); c.font = BOLD; c.fill = HEAD
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    if widths:
        for i, w in enumerate(widths, start=col): ws.column_dimensions[get_column_letter(i)].width = w


def inp(ws, ref, value, fmt=None, key=False, note=None):
    c = ws[ref]; c.value = value; c.font = BLUE
    if fmt: c.number_format = fmt
    if key: c.fill = YELLOW
    if note: c.comment = Comment(note, "Knackdesk")
    return c


def fx(ws, ref, formula, fmt=None, bold=False):
    c = ws[ref]; c.value = formula; c.font = BOLD if bold else BLACK
    if fmt: c.number_format = fmt
    return c


def label(ws, ref, text, bold=False, muted=False):
    c = ws[ref]; c.value = text; c.font = BOLD if bold else (MUTED if muted else BLACK); return c


def blank(ws, r, cols, fmts=None):
    for col in cols:
        ws[f"{col}{r}"].font = BLUE
        if fmts and col in fmts: ws[f"{col}{r}"].number_format = fmts[col]


def build_start(ws):
    ws.column_dimensions["A"].width = 100
    label(ws, "A1", "Trade Job Quote & Change Order Workbook", bold=True).font = TITLE
    label(ws, "A2", "by Knackdesk · knackdesk.com", muted=True)
    lines = ["", "HOW TO USE",
        "1. Settings: your labour cost rate, overhead percentage, target profit margin, markups for change orders and subcontractors, and the deposit share.",
        "2. Quote: list materials (quantity × unit cost), labour tasks (hours at your cost rate) and subcontractors. Overhead and margin roll up into the quote price, profit, markup and deposit. Copy the sheet for each new quote.",
        "3. Change Orders: one row per change with materials, hours and subcontractor cost. Your markups give the change price; the revised contract total updates after every row.",
        "4. Jobs: one row per job with quoted price, change orders, actual materials, hours and subs, invoiced and paid. Cost, overhead, profit, margin and outstanding are calculated.",
        "5. Summary: totals and margins across jobs, outstanding balances and how many jobs fell below the target margin.",
        "", "LEGEND",
        "Blue text = a cell you type into.   Black text = a formula, leave it alone.   Yellow fill = key inputs.",
        "Blue cells that already contain a formula (rates and markups pulled from Settings) may be overwritten per line.",
        "", "DEFINITIONS",
        "Direct cost = materials + labour hours × cost rate + subcontractors. Overhead = direct cost × overhead %. Total cost = direct + overhead.",
        "Quote price = total cost ÷ (1 − margin %). Profit = price − total cost. Markup = profit ÷ total cost.",
        "Change price = (materials + hours × rate) × (1 + markup) + subs × (1 + sub markup). Revised total = original + all change orders.",
        "Fixed figures, before tax. Arithmetic only; not legal, contract or tax advice. Support: hello@knackdesk.com"]
    for i, t in enumerate(lines, start=3): label(ws, f"A{i}", t, bold=t.isupper() and t != "")


def build_settings(ws):
    ws.column_dimensions["A"].width = 44; ws.column_dimensions["B"].width = 14; ws.column_dimensions["C"].width = 64
    label(ws, "A1", "Settings", bold=True).font = TITLE
    rows = [("Labour cost rate per hour", 45, MONEY, "What an hour costs you: wages, contributions, paid downtime. Not what you charge."),
            ("Overhead (% of direct cost)", 15, "0.00", "A year of overhead ÷ a year of direct job cost."),
            ("Target profit margin (% of price)", 20, "0.00", "Profit as a share of the quote price."),
            ("Subcontractor markup (%)", 10, "0.00", "Applied to subcontractor cost on quotes and change orders."),
            ("Change-order markup on own work (%)", 35, "0.00", "Markup on materials and labour in change orders; usually your standard markup."),
            ("Deposit (% of quote)", 30, "0.00", "Shown on the quote as the deposit to request.")]
    for i, (name, val, fmt, note) in enumerate(rows, start=2):
        label(ws, f"A{i}", name); inp(ws, f"B{i}", val, fmt, key=True); label(ws, f"C{i}", note, muted=True)


def build_quote(ws):
    label(ws, "A1", "Quote", bold=True).font = TITLE
    label(ws, "A2", "Client"); inp(ws, "B2", "Example Homeowner", key=True)
    label(ws, "A3", "Job"); inp(ws, "B3", "Kitchen refit", key=True)
    ws.column_dimensions["A"].width = 36; ws.column_dimensions["B"].width = 12; ws.column_dimensions["C"].width = 12; ws.column_dimensions["D"].width = 14
    mlo, mhi = MAT_ROWS; llo, lhi = LAB_ROWS; slo, shi = SUB_ROWS
    head(ws, 5, ["Material", "Quantity", "Unit cost", "Line cost"])
    for r in range(mlo, mhi + 1):
        blank(ws, r, "ABC", {"B": "0.00", "C": MONEY}); fx(ws, f"D{r}", f'=IF(A{r}="","",ROUND(B{r}*C{r},2))', MONEY)
    for i, (n, q, c) in enumerate([("Base units", 6, 95), ("Worktop (m)", 4, 60), ("Fixings and sundries", 1, 120)]):
        inp(ws, f"A{mlo+i}", n, key=(i == 0)); inp(ws, f"B{mlo+i}", q, "0.00", key=(i == 0)); inp(ws, f"C{mlo+i}", c, MONEY, key=(i == 0))
    head(ws, 22, ["Labour task", "Hours", "Cost rate", "Labour cost"])
    for r in range(llo, lhi + 1):
        blank(ws, r, "AB", {"B": "0.00"}); fx(ws, f"C{r}", f'=IF(A{r}="","",{S}2)', MONEY).font = BLUE; fx(ws, f"D{r}", f'=IF(A{r}="","",ROUND(B{r}*C{r},2))', MONEY)
    for i, (n, h) in enumerate([("Strip out", 4), ("Fit units and worktop", 10), ("Finishing", 2)]):
        inp(ws, f"A{llo+i}", n, key=(i == 0)); inp(ws, f"B{llo+i}", h, "0.00", key=(i == 0))
    head(ws, 34, ["Subcontractor", "Cost"])
    for r in range(slo, shi + 1): blank(ws, r, "AB", {"B": MONEY})
    inp(ws, f"A{slo}", "Electrician", key=True); inp(ws, f"B{slo}", 300, MONEY, key=True)
    rows = [(43, "Materials", f"=SUM(D{mlo}:D{mhi})", False), (44, "Labour", f"=SUM(D{llo}:D{lhi})", False), (45, "Subcontractors (at cost)", f"=SUM(B{slo}:B{shi})", False),
            (46, "Direct cost", "=B43+B44+B45", False), (47, "Overhead", f"=ROUND(B46*{S}3/100,2)", False), (48, "Total cost", "=B46+B47", True),
            (49, "QUOTE PRICE", f"=ROUND(B48/(1-{S}4/100),2)", True), (50, "Profit", "=B49-B48", True), (51, "Markup on total cost %", '=IFERROR(ROUND(B50/B48*100,2),"")', False),
            (52, "Deposit to request", f"=ROUND(B49*{S}7/100,2)", True), (53, "Subcontractor markup included?", "", False)]
    for r, name, f, bold in rows:
        label(ws, f"A{r}", name, bold=bold)
        if f: fx(ws, f"B{r}", f, PCT if "%" in name else MONEY, bold=bold)
    ws["B53"].value = None
    label(ws, "A53", "Subcontractors are priced at cost here and covered by the margin; apply a separate sub markup on change orders.", muted=True)
    ws.freeze_panes = "A6"


def build_change_orders(ws):
    lo, hi = CO_ROWS
    label(ws, "A1", "Change Orders", bold=True).font = TITLE
    label(ws, "A2", "Original contract price"); inp(ws, "B2", "=Quote!B49", MONEY, key=True, note="Defaults to the Quote sheet; overwrite with the signed contract figure.")
    head(ws, 4, ["#", "Description", "Materials", "Hours", "Cost rate", "Subcontractors", "Own cost", "Own markup", "Sub markup", "Change price", "Revised contract total", "% of original"],
         [5, 30, 12, 9, 11, 14, 12, 12, 11, 13, 16, 11])
    for r in range(lo, hi + 1):
        blank(ws, r, "BCDF", {"C": MONEY, "D": "0.00", "F": MONEY})
        fx(ws, f"A{r}", f'=IF(B{r}="","",{r-lo+1})', "0")
        fx(ws, f"E{r}", f'=IF(B{r}="","",{S}2)', MONEY).font = BLUE
        fx(ws, f"G{r}", f'=IF(B{r}="","",ROUND(C{r}+D{r}*E{r},2))', MONEY)
        fx(ws, f"H{r}", f'=IF(B{r}="","",ROUND(G{r}*{S}6/100,2))', MONEY)
        fx(ws, f"I{r}", f'=IF(B{r}="","",ROUND(F{r}*{S}5/100,2))', MONEY)
        fx(ws, f"J{r}", f'=IF(B{r}="","",G{r}+H{r}+F{r}+I{r})', MONEY)
        prev = "$B$2" if r == lo else f"K{r-1}"
        fx(ws, f"K{r}", f'=IF(B{r}="","",{prev}+J{r})', MONEY)
        fx(ws, f"L{r}", f'=IF(B{r}="","",IFERROR(ROUND(J{r}/$B$2*100,2),""))', PCT)
    for i, (d, m, h, s) in enumerate([("Extra double socket", 40, 1.5, 120), ("Upgrade worktop", 260, 2, 0)]):
        inp(ws, f"B{lo+i}", d, key=(i == 0)); inp(ws, f"C{lo+i}", m, MONEY); inp(ws, f"D{lo+i}", h, "0.00"); inp(ws, f"F{lo+i}", s, MONEY)
    label(ws, f"A{hi+1}", "Totals", bold=True); fx(ws, f"J{hi+1}", f"=SUM(J{lo}:J{hi})", MONEY, bold=True)
    label(ws, f"A{hi+2}", "Revised contract total", bold=True); fx(ws, f"J{hi+2}", f"=$B$2+J{hi+1}", MONEY, bold=True)
    label(ws, f"A{hi+3}", "All changes as % of original", bold=True); fx(ws, f"J{hi+3}", f'=IFERROR(ROUND(J{hi+1}/$B$2*100,2),"")', PCT, bold=True)
    ws.freeze_panes = "C5"


def build_jobs(ws):
    lo, hi = JOB_ROWS; tot = hi + 1
    label(ws, "A1", "Jobs", bold=True).font = TITLE
    label(ws, "A2", "One row per job. Enter actual materials, hours and subcontractor cost as the job runs; profit and margin update.", muted=True)
    head(ws, 4, ["Job", "Client", "Status", "Quoted price", "Change orders", "Contract total", "Actual materials", "Actual hours", "Cost rate", "Actual subs", "Direct cost", "Overhead", "Total cost", "Profit", "Margin %", "Invoiced", "Paid", "Outstanding"],
         [22, 16, 10, 13, 12, 13, 13, 11, 10, 12, 12, 11, 12, 12, 10, 12, 12, 12])
    dv = DataValidation(type="list", formula1='"quoted,active,done,lost"', allow_blank=True); ws.add_data_validation(dv)
    for r in range(lo, hi + 1):
        blank(ws, r, "ABCDEGHJPQ", {"D": MONEY, "E": MONEY, "G": MONEY, "H": "0.0", "J": MONEY, "P": MONEY, "Q": MONEY}); dv.add(f"C{r}")
        fx(ws, f"F{r}", f'=IF(A{r}="","",D{r}+E{r})', MONEY)
        fx(ws, f"I{r}", f'=IF(A{r}="","",{S}2)', MONEY).font = BLUE
        fx(ws, f"K{r}", f'=IF(A{r}="","",ROUND(G{r}+H{r}*I{r}+J{r},2))', MONEY)
        fx(ws, f"L{r}", f'=IF(A{r}="","",ROUND(K{r}*{S}3/100,2))', MONEY)
        fx(ws, f"M{r}", f'=IF(A{r}="","",K{r}+L{r})', MONEY)
        fx(ws, f"N{r}", f'=IF(A{r}="","",F{r}-M{r})', MONEY)
        fx(ws, f"O{r}", f'=IF(A{r}="","",IFERROR(ROUND(N{r}/F{r}*100,2),""))', PCT)
        fx(ws, f"R{r}", f'=IF(A{r}="","",P{r}-Q{r})', MONEY)
    sample = [("Kitchen refit", "Example Homeowner", "active", 3000, 450, 980, 18, 300, 3450, 1035), ("Bathroom tiling", "Sample Ltd", "done", 1800, 0, 520, 14, 0, 1800, 1800), ("Garden wall", "Demo Client", "done", 2400, 200, 900, 20, 250, 2600, 2600)]
    for i, row in enumerate(sample):
        r = lo + i
        for col, v in zip("ABCDEGHJPQ", row):
            inp(ws, f"{col}{r}", v, {"D": MONEY, "E": MONEY, "G": MONEY, "J": MONEY, "P": MONEY, "Q": MONEY, "H": "0.0"}.get(col), key=(i == 0 and col in "ADG"))
    label(ws, f"A{tot}", "Totals", bold=True)
    for col in "DEFGJKLMNPQR": fx(ws, f"{col}{tot}", f"=SUM({col}{lo}:{col}{hi})", MONEY, bold=True)
    fx(ws, f"H{tot}", f"=SUM(H{lo}:H{hi})", "0.0", bold=True)
    fx(ws, f"O{tot}", f'=IFERROR(ROUND(N{tot}/F{tot}*100,2),"")', PCT, bold=True)
    ws.freeze_panes = "C5"


def build_summary(ws):
    lo, hi = JOB_ROWS; tot = hi + 1
    ws.column_dimensions["A"].width = 44; ws.column_dimensions["B"].width = 16; ws.column_dimensions["C"].width = 44
    label(ws, "A1", "Summary", bold=True).font = TITLE
    rows = [(2, "Jobs tracked", f"=COUNTA(Jobs!A{lo}:A{hi})", "0", None),
            (3, "Contract value (quotes + change orders)", f"=Jobs!F{tot}", MONEY, None),
            (4, "Total cost including overhead", f"=Jobs!M{tot}", MONEY, None),
            (5, "Profit", f"=Jobs!N{tot}", MONEY, None),
            (6, "Overall margin %", '=IFERROR(ROUND(B5/B3*100,2),"")', PCT, "profit ÷ contract value"),
            (7, "Target margin % (Settings)", f"={S}4", PCT, None),
            (8, "Jobs below the target margin", f'=COUNTIF(Jobs!O{lo}:O{hi},"<"&{S}4)', "0", None),
            (9, "Change orders as % of quoted prices", f'=IFERROR(ROUND(Jobs!E{tot}/Jobs!D{tot}*100,2),"")', PCT, None),
            (10, "Hours worked", f"=Jobs!H{tot}", "0.0", None),
            (11, "Average profit per hour", '=IFERROR(ROUND(B5/B10,2),"")', MONEY, "profit ÷ hours"),
            (12, "Invoiced", f"=Jobs!P{tot}", MONEY, None),
            (13, "Paid", f"=Jobs!Q{tot}", MONEY, None),
            (14, "Outstanding", f"=Jobs!R{tot}", MONEY, None)]
    for r, name, f, fmt, note in rows:
        label(ws, f"A{r}", name, bold=True); fx(ws, f"B{r}", f, fmt, bold=True)
        if note: label(ws, f"C{r}", note, muted=True)


README = """# Trade Job Quote & Change Order Workbook

Thank you for buying the workbook. Open `trade-job-quote-workbook.xlsx` in Excel (2010 or later), Google Sheets (File > Import) or Apple Numbers.

1. **Settings:** labour cost rate, overhead, target margin, markups and deposit share.
2. **Quote:** materials, labour tasks and subcontractors by line; price, profit, markup and deposit roll up. Duplicate the sheet per quote.
3. **Change Orders:** one row per change; the change price and revised contract total update after each row.
4. **Jobs:** quoted price plus change orders against actual cost; profit, margin and outstanding per job.
5. **Summary:** totals across jobs and the number below your target margin.

Blue text = type here. Black text = formula, leave it alone. Definitions are on the Start Here sheet.

No macros, no tracking. Figures before tax. Arithmetic only, not legal, contract or tax advice. Licensed for personal or single-business use; please do not redistribute.

Questions: hello@knackdesk.com · Free tools: https://knackdesk.com
"""


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--out", required=True); args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)
    wb = Workbook(); ws = wb.active; ws.title = "Start Here"; build_start(ws)
    build_settings(wb.create_sheet("Settings")); build_quote(wb.create_sheet("Quote")); build_change_orders(wb.create_sheet("Change Orders")); build_jobs(wb.create_sheet("Jobs")); build_summary(wb.create_sheet("Summary"))
    for sheet in wb.worksheets:
        for row in sheet.iter_rows():
            for c in row:
                if c.value is not None and c.font.name != FONT:
                    c.font = Font(name=FONT, bold=c.font.bold, italic=c.font.italic, color=c.font.color, size=c.font.size)
    xlsx = os.path.join(args.out, "trade-job-quote-workbook.xlsx"); wb.save(xlsx)
    readme = os.path.join(args.out, "README.md")
    with open(readme, "w") as f: f.write(README)
    with zipfile.ZipFile(os.path.join(args.out, "trade-job-quote-workbook.zip"), "w", zipfile.ZIP_DEFLATED) as z:
        z.write(xlsx, "trade-job-quote-workbook.xlsx"); z.write(readme, "README.md")
    print(f"built {xlsx}")


if __name__ == "__main__":
    main()
