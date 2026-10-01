"""Build the Landlord Rent & Expense Tracker workbook, README and zip. Usage: build_kit.py --out DIR"""
import argparse, datetime as dt, os, zipfile
from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

FONT = "Arial"
BLUE = Font(name=FONT, color="0000FF"); BLACK = Font(name=FONT); BOLD = Font(name=FONT, bold=True)
TITLE = Font(name=FONT, bold=True, size=14); MUTED = Font(name=FONT, italic=True, color="666666")
YELLOW = PatternFill("solid", fgColor="FFFF00"); HEAD = PatternFill("solid", fgColor="E7E6E6")
MONEY = '#,##0.00;(#,##0.00);"-"'; DATE = "yyyy-mm-dd"; PCT = '0.00"%"'
PROP_ROWS = (5, 14)      # 10 properties
RENT_ROWS = (5, 304)     # 300 rent rows
EXP_ROWS = (5, 304)


def head(ws, row, labels, widths=None):
    for i, label in enumerate(labels, start=1):
        c = ws.cell(row=row, column=i, value=label); c.font = BOLD; c.fill = HEAD
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    if widths:
        for i, w in enumerate(widths, start=1): ws.column_dimensions[get_column_letter(i)].width = w


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


def build_start(ws):
    ws.column_dimensions["A"].width = 100
    label(ws, "A1", "Landlord Rent & Expense Tracker", bold=True).font = TITLE
    label(ws, "A2", "by Knackdesk · knackdesk.com", muted=True)
    lines = ["", "HOW TO USE",
        "1. Properties: one row per unit. Give each a short code (A, B, C...) and enter rent, tenant, lease dates, deposit held and purchase price.",
        "2. Rent Log: one row per rent period per property. Enter the property code, due date, amount due, amount paid and paid date. Days late, outstanding and status are calculated.",
        "3. Expenses: one row per cost, with the property code and a category.",
        "4. Summary: rent due, collected, outstanding, expenses, net income and gross and net yield per property and for the whole portfolio.",
        "", "LEGEND",
        "Blue text = a cell you type into.   Black text = a formula, leave it alone.   Yellow fill = key inputs.",
        "Each table has one example row to overwrite. Property codes must match between sheets exactly.",
        "", "NOTES",
        "Days late count from the due date to today for unpaid rows, or to the paid date for paid rows. 'Today' recalculates when the file opens.",
        "Gross yield = annual rent due ÷ purchase price. Net yield = (annual rent due − expenses logged for the year) ÷ purchase price.",
        "This workbook does arithmetic only. Deposit, notice, rent-control and tax rules vary by country and city; it is not legal or tax advice.",
        "Support: hello@knackdesk.com"]
    for i, t in enumerate(lines, start=3): label(ws, f"A{i}", t, bold=t.isupper() and t != "")


def build_properties(ws):
    lo, hi = PROP_ROWS
    label(ws, "A1", "Properties", bold=True).font = TITLE
    label(ws, "A2", "Today (auto)"); fx(ws, "B2", "=TODAY()", DATE)
    head(ws, 4, ["Code", "Address", "Tenant", "Monthly rent", "Lease start", "Lease end", "Deposit held", "Purchase price", "Notes"], [8, 34, 20, 14, 13, 13, 14, 16, 30])
    for r in range(lo, hi + 1):
        for col in "ABCDEFGHI": ws[f"{col}{r}"].font = BLUE
        ws[f"D{r}"].number_format = MONEY; ws[f"G{r}"].number_format = MONEY; ws[f"H{r}"].number_format = MONEY
        ws[f"E{r}"].number_format = DATE; ws[f"F{r}"].number_format = DATE
    today = dt.date.today()
    inp(ws, f"A{lo}", "A", key=True); inp(ws, f"B{lo}", "12 Example Street, Flat 2"); inp(ws, f"C{lo}", "J. Example")
    inp(ws, f"D{lo}", 1200, MONEY); inp(ws, f"E{lo}", today.replace(day=1) - dt.timedelta(days=200), DATE); inp(ws, f"F{lo}", today.replace(day=1) + dt.timedelta(days=165), DATE)
    inp(ws, f"G{lo}", 1200, MONEY); inp(ws, f"H{lo}", 200000, MONEY)
    ws.freeze_panes = "A5"


def build_rent(ws):
    lo, hi = RENT_ROWS; plo, phi = PROP_ROWS
    label(ws, "A1", "Rent Log", bold=True).font = TITLE
    label(ws, "A2", "Outstanding total", bold=True); fx(ws, "B2", f"=SUM(H{lo}:H{hi})", MONEY, bold=True)
    label(ws, "C2", "Rows overdue", bold=True); fx(ws, "D2", f'=COUNTIF(I{lo}:I{hi},"Overdue")', "0", bold=True)
    head(ws, 4, ["Property code", "Period (month)", "Due date", "Amount due", "Amount paid", "Paid date", "Days late", "Outstanding", "Status", "Note"], [13, 14, 13, 13, 13, 13, 11, 13, 11, 28])
    dv = DataValidation(type="list", formula1=f"=Properties!$A${plo}:$A${phi}", allow_blank=True); ws.add_data_validation(dv)
    for r in range(lo, hi + 1):
        for col in "ABCDEFJ": ws[f"{col}{r}"].font = BLUE
        ws[f"B{r}"].number_format = "mmm yyyy"; ws[f"C{r}"].number_format = DATE; ws[f"F{r}"].number_format = DATE
        ws[f"D{r}"].number_format = MONEY; ws[f"E{r}"].number_format = MONEY
        dv.add(f"A{r}")
        fx(ws, f"G{r}", f'=IF(C{r}="",0,IF(E{r}>=D{r},MAX(0,IF(F{r}="",0,F{r}-C{r})),MAX(0,Properties!$B$2-C{r})))', "0")
        fx(ws, f"H{r}", f'=IF(C{r}="",0,MAX(0,D{r}-E{r}))', MONEY)
        fx(ws, f"I{r}", f'=IF(C{r}="","",IF(H{r}<=0,"Paid",IF(G{r}>0,"Overdue","Due")))')
    today = dt.date.today()
    first = today.replace(day=1)
    inp(ws, f"A{lo}", "A"); inp(ws, f"B{lo}", first - dt.timedelta(days=31), "mmm yyyy"); inp(ws, f"C{lo}", first - dt.timedelta(days=31), DATE)
    inp(ws, f"D{lo}", 1200, MONEY); inp(ws, f"E{lo}", 1200, MONEY); inp(ws, f"F{lo}", first - dt.timedelta(days=29), DATE)
    inp(ws, f"A{lo+1}", "A"); inp(ws, f"B{lo+1}", first, "mmm yyyy"); inp(ws, f"C{lo+1}", first, DATE); inp(ws, f"D{lo+1}", 1200, MONEY); inp(ws, f"E{lo+1}", 0, MONEY)
    ws.freeze_panes = "A5"


def build_expenses(ws):
    lo, hi = EXP_ROWS; plo, phi = PROP_ROWS
    label(ws, "A1", "Expenses", bold=True).font = TITLE
    label(ws, "A2", "Total", bold=True); fx(ws, "B2", f"=SUM(E{lo}:E{hi})", MONEY, bold=True)
    head(ws, 4, ["Date", "Property code", "Category", "Description", "Amount", "Year"], [13, 13, 18, 40, 13, 8])
    dv = DataValidation(type="list", formula1=f"=Properties!$A${plo}:$A${phi}", allow_blank=True); ws.add_data_validation(dv)
    cats = DataValidation(type="list", formula1='"Repairs,Insurance,Management fee,Mortgage interest,Utilities,Service charge,Tax,Legal,Other"', allow_blank=True); ws.add_data_validation(cats)
    for r in range(lo, hi + 1):
        for col in "ABCDE": ws[f"{col}{r}"].font = BLUE
        ws[f"A{r}"].number_format = DATE; ws[f"E{r}"].number_format = MONEY
        dv.add(f"B{r}"); cats.add(f"C{r}")
        fx(ws, f"F{r}", f'=IF(A{r}="","",YEAR(A{r}))', "0")
    inp(ws, f"A{lo}", dt.date.today() - dt.timedelta(days=12), DATE); inp(ws, f"B{lo}", "A"); inp(ws, f"C{lo}", "Repairs"); inp(ws, f"D{lo}", "Example: boiler service"); inp(ws, f"E{lo}", 95, MONEY)
    ws.freeze_panes = "A5"


def build_summary(ws):
    plo, phi = PROP_ROWS; rlo, rhi = RENT_ROWS; elo, ehi = EXP_ROWS
    label(ws, "A1", "Summary", bold=True).font = TITLE
    label(ws, "A2", "Year"); inp(ws, "B2", dt.date.today().year, "0", key=True, note="Expenses and rent are summed for this calendar year.")
    head(ws, 4, ["Code", "Address", "Rent due (year)", "Rent collected (year)", "Outstanding", "Expenses (year)", "Net income (year)", "Gross yield", "Net yield"], [8, 30, 15, 17, 13, 15, 16, 12, 12])
    for i, pr in enumerate(range(plo, phi + 1)):
        r = 5 + i
        fx(ws, f"A{r}", f'=IF(Properties!A{pr}="","",Properties!A{pr})')
        fx(ws, f"B{r}", f'=IF(Properties!A{pr}="","",Properties!B{pr})')
        fx(ws, f"C{r}", f'=IF(A{r}="","",SUMIFS(\'Rent Log\'!$D${rlo}:$D${rhi},\'Rent Log\'!$A${rlo}:$A${rhi},A{r},\'Rent Log\'!$C${rlo}:$C${rhi},">="&DATE($B$2,1,1),\'Rent Log\'!$C${rlo}:$C${rhi},"<"&DATE($B$2+1,1,1)))', MONEY)
        fx(ws, f"D{r}", f'=IF(A{r}="","",SUMIFS(\'Rent Log\'!$E${rlo}:$E${rhi},\'Rent Log\'!$A${rlo}:$A${rhi},A{r},\'Rent Log\'!$C${rlo}:$C${rhi},">="&DATE($B$2,1,1),\'Rent Log\'!$C${rlo}:$C${rhi},"<"&DATE($B$2+1,1,1)))', MONEY)
        fx(ws, f"E{r}", f'=IF(A{r}="","",SUMIFS(\'Rent Log\'!$H${rlo}:$H${rhi},\'Rent Log\'!$A${rlo}:$A${rhi},A{r}))', MONEY)
        fx(ws, f"F{r}", f'=IF(A{r}="","",SUMIFS(Expenses!$E${elo}:$E${ehi},Expenses!$B${elo}:$B${ehi},A{r},Expenses!$F${elo}:$F${ehi},$B$2))', MONEY)
        fx(ws, f"G{r}", f'=IF(A{r}="","",C{r}-F{r})', MONEY)
        fx(ws, f"H{r}", f'=IF(OR(A{r}="",Properties!H{pr}=0,Properties!H{pr}=""),"",ROUND(Properties!D{pr}*12/Properties!H{pr}*100,2))', PCT)
        fx(ws, f"I{r}", f'=IF(OR(A{r}="",Properties!H{pr}=0,Properties!H{pr}=""),"",ROUND((Properties!D{pr}*12-F{r})/Properties!H{pr}*100,2))', PCT)
    label(ws, "A16", "Portfolio", bold=True)
    for col in "CDEFG": fx(ws, f"{col}16", f"=SUM({col}5:{col}14)", MONEY, bold=True)
    fx(ws, "H16", f'=IFERROR(ROUND(SUMPRODUCT(Properties!D{plo}:D{phi})*12/SUM(Properties!H{plo}:H{phi})*100,2),"")', PCT, bold=True)
    fx(ws, "I16", f'=IFERROR(ROUND((SUMPRODUCT(Properties!D{plo}:D{phi})*12-F16)/SUM(Properties!H{plo}:H{phi})*100,2),"")', PCT, bold=True)
    label(ws, "A18", "Gross yield = annual rent due ÷ purchase price. Net yield deducts the expenses logged for the chosen year. Yields are blank until a purchase price is entered.", muted=True)


README = """# Landlord Rent & Expense Tracker

Thank you for buying the tracker. Open `landlord-rent-tracker.xlsx` in Excel (2010 or later), Google Sheets (File > Import) or Apple Numbers.

1. **Properties:** one row per unit with a short code (A, B, C...). Codes link the sheets together.
2. **Rent Log:** one row per rent period per property; days late, outstanding and status are calculated.
3. **Expenses:** one row per cost with the property code and a category.
4. **Summary:** pick the year; rent, expenses, net income and yields per property update automatically.

Blue text = type here. Black text = formula, leave it alone. Each table has one example row to overwrite.

No macros, no tracking. Arithmetic only; deposit, notice, rent-control and tax rules vary by country and city. Licensed for personal or single-business use; please do not redistribute.

Questions: hello@knackdesk.com · Free tools: https://knackdesk.com
"""


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--out", required=True); args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)
    wb = Workbook(); ws = wb.active; ws.title = "Start Here"; build_start(ws)
    build_properties(wb.create_sheet("Properties")); build_rent(wb.create_sheet("Rent Log")); build_expenses(wb.create_sheet("Expenses")); build_summary(wb.create_sheet("Summary"))
    for sheet in wb.worksheets:
        for row in sheet.iter_rows():
            for c in row:
                if c.value is not None and c.font.name != FONT:
                    c.font = Font(name=FONT, bold=c.font.bold, italic=c.font.italic, color=c.font.color, size=c.font.size)
    xlsx = os.path.join(args.out, "landlord-rent-tracker.xlsx"); wb.save(xlsx)
    readme = os.path.join(args.out, "README.md")
    with open(readme, "w") as f: f.write(README)
    with zipfile.ZipFile(os.path.join(args.out, "landlord-rent-tracker.zip"), "w", zipfile.ZIP_DEFLATED) as z:
        z.write(xlsx, "landlord-rent-tracker.xlsx"); z.write(readme, "README.md")
    print(f"built {xlsx}")


if __name__ == "__main__":
    main()
