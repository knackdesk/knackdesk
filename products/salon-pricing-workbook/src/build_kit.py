"""Build the Salon & Appointment Pricing Workbook, README and zip.
Usage: build_kit.py --out DIR [--zip-only]  (--zip-only re-zips an existing, recalculated xlsx with the README)"""
import argparse, datetime as dt, os, zipfile
from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

SLUG = "salon-pricing-workbook"
FONT = "Arial"
BLUE = Font(name=FONT, color="0000FF"); BLACK = Font(name=FONT); BOLD = Font(name=FONT, bold=True)
TITLE = Font(name=FONT, bold=True, size=14); MUTED = Font(name=FONT, italic=True, color="666666")
YELLOW = PatternFill("solid", fgColor="FFFF00"); HEAD = PatternFill("solid", fgColor="E7E6E6")
MONEY = '#,##0.00;(#,##0.00);"-"'; PCT = '0.00"%"'; DATE = "yyyy-mm-dd"; INT0 = "0"; HRS = "0.0"
MENU_ROWS = (5, 44); WEEK_ROWS = (5, 56)
S = "Settings!$B$"  # settings cell prefix
CATEGORIES = '"hair,colour,nails,skin,massage,barber,training,tutoring,other"'
SM = "'Service Menu'!"; BC = "'Booth vs Commission'!"; WL = "'Weekly Log'!"
# Settings rows (column B): referenced by every other sheet.
R_OVERHEAD = 8; R_INCOME = 9; R_WEEKS = 10; R_HOURS = 11; R_BILLABLE = 12; R_MARGIN = 13; R_PRODUCT = 14
R_TICKET = 15; R_PAYROLL = 16; R_BOOTH = 17; R_COMMISSION = 18; R_NOSHOW_FEE = 19; R_BILL_HRS = 20; R_RATE = 21


def head(ws, row, labels, widths=None):
    for i, text in enumerate(labels, start=1):
        c = ws.cell(row=row, column=i, value=text); c.font = BOLD; c.fill = HEAD
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


def blank(ws, r, cols, fmts=None):
    for col in cols:
        ws[f"{col}{r}"].font = BLUE
        if fmts and col in fmts: ws[f"{col}{r}"].number_format = fmts[col]


def rows_block(ws, rows, bold_rows=()):
    """Write (row, label, formula, format, note) lines as label / bold formula / muted note."""
    for r, name, f, fmt, note in rows:
        b = r in bold_rows
        label(ws, f"A{r}", name, bold=b); fx(ws, f"B{r}", f, fmt, bold=b)
        if note: label(ws, f"C{r}", note, muted=True)


def build_start(ws):
    ws.column_dimensions["A"].width = 100
    label(ws, "A1", "Salon & Appointment Pricing Workbook", bold=True).font = TITLE
    label(ws, "A2", "by Knackdesk · knackdesk.com", muted=True)
    lines = ["", "HOW TO USE",
        "1. Settings: your monthly overhead line by line, take-home income goal, working weeks, hours, billable share, profit margin, product cost %, average ticket, booth rent, commission split and no-show fee. Every other sheet reads them.",
        "2. Service Menu: one row per service with category, minutes, product cost, current price and weekly units. Time cost, floor price, suggested price, the gap to your current price and weekly revenue and gross profit are calculated.",
        "3. Booth vs Commission: compares your monthly take-home renting a booth against working on commission, shows the verdict, the break-even revenue and five revenue scenarios.",
        "4. Weekly Log: one row per week with appointments booked, no-shows, late cancellations, revenue and costs. No-show rate, lost revenue, fees recovered and net are calculated, with totals and a 4-week trailing average.",
        "5. Capacity: how many appointments fit in your week from your hours, average service length and buffer time, the revenue ceiling, and your latest logged week against what you expect.",
        "6. Summary: target hourly rate, services priced below floor, weekly menu revenue and gross profit, best and worst margin services, the booth vs commission verdict, no-show losses and expected appointments.",
        "", "LEGEND",
        "Blue text = a cell you type into.   Black text = a formula, leave it alone.   Yellow fill = key inputs.",
        "", "DEFINITIONS",
        "Target hourly rate = (total monthly overhead + monthly take-home income goal) ÷ billable hours per month. Billable hours per month = hours per week × billable % × working weeks per year ÷ 12.",
        "Floor price = target hourly rate × service minutes ÷ 60 + product cost per service. Below it, the service does not cover your time, overhead and income goal. Suggested price = floor price × (1 + profit margin %).",
        "Booth rent % of revenue = monthly booth rent ÷ monthly revenue: the share of what you take that goes on the chair before anything else.",
        "Break-even revenue for commission vs booth rent = monthly booth rent ÷ (1 − commission % you keep − product cost %). Above it, renting a booth leaves you more; below it, commission does.",
        "No-show cost = (no-shows + late cancellations) × average ticket. Fees recovered = the same count × your no-show fee, assuming you charge it every time.",
        "Capacity = the most appointments that fit in your hours: hours per week × 60 ÷ (average service minutes + buffer minutes). Expected appointments = capacity × billable %.",
        "The targets in Settings are your own; this workbook does not supply industry benchmarks. Set them from your own history and plan.",
        "Support: hello@knackdesk.com",
        "Arithmetic only; not financial advice."]
    for i, t in enumerate(lines, start=3): label(ws, f"A{i}", t, bold=t.isupper() and t != "")


def build_settings(ws):
    ws.column_dimensions["A"].width = 44; ws.column_dimensions["B"].width = 14; ws.column_dimensions["C"].width = 80
    label(ws, "A1", "Settings", bold=True).font = TITLE
    overhead = [("Rent or booth fee (monthly)", 1200, "Example default 1,200 a month. Your room, chair or booth cost; leave 0 here if you pay booth rent weekly and set it in row 17 instead."),
                ("Products and supplies (monthly)", 300, "Example default 300 a month. Backbar, towels and consumables not charged per service."),
                ("Insurance (monthly)", 80, "Example default 80 a month. Liability and equipment cover."),
                ("Software and booking (monthly)", 60, "Example default 60 a month. Booking app, card fees subscription, accounting."),
                ("Marketing (monthly)", 100, "Example default 100 a month. Ads, listings, printing."),
                ("Other overhead (monthly)", 160, "Example default 160 a month. Training, phone, laundry, anything else.")]
    for i, (name, val, note) in enumerate(overhead, start=2):
        label(ws, f"A{i}", name); inp(ws, f"B{i}", val, MONEY, key=True); label(ws, f"C{i}", note, muted=True)
    label(ws, f"A{R_OVERHEAD}", "Total monthly overhead", bold=True)
    fx(ws, f"B{R_OVERHEAD}", "=SUM(B2:B7)", MONEY, bold=True)
    label(ws, f"C{R_OVERHEAD}", "formula: sum of the six overhead rows above", muted=True)
    rows = [(R_INCOME, "Monthly take-home income goal", 4000, MONEY, True, "Example default 4,000 a month. What you want to pay yourself before personal tax."),
            (R_WEEKS, "Working weeks per year", 48, INT0, True, "Default 48: 52 weeks less 4 weeks of holiday, sickness and training."),
            (R_HOURS, "Hours worked per week", 40, HRS, True, "Default 40. All hours at work, including admin and gaps."),
            (R_BILLABLE, "Share of hours that are billable %", 75, PCT, True, "Default 75. The share of your hours spent on paid services; the rest is cleaning, admin, gaps and no-shows."),
            (R_MARGIN, "Profit margin % to add on services", 20, PCT, True, "Default 20. Added on top of the floor price to give the suggested price."),
            (R_PRODUCT, "Product cost % of revenue", 10, PCT, True, "Default 10. Used on Booth vs Commission: product you buy yourself when renting a booth."),
            (R_TICKET, "Average ticket", 65, MONEY, True, "Default 65. Average spend per appointment; used for no-show cost and capacity revenue."),
            (R_PAYROLL, "Payroll taxes and benefits %", 0, PCT, False, "Default 0. Only if you pay yourself or staff through payroll: added on top of the income goal in the target hourly rate."),
            (R_BOOTH, "Weekly booth rent", 300, MONEY, True, "Default 300 a week. Used on Booth vs Commission (× 52 ÷ 12 for a monthly figure)."),
            (R_COMMISSION, "Commission % you keep (commission salon)", 45, PCT, True, "Default 45. Your share of service revenue when working on commission; the salon keeps the rest and supplies product."),
            (R_NOSHOW_FEE, "No-show fee", 25, MONEY, True, "Default 25. Charged per no-show or late cancellation; used on the Weekly Log.")]
    for r, name, val, fmt, key, note in rows:
        label(ws, f"A{r}", name); inp(ws, f"B{r}", val, fmt, key=key); label(ws, f"C{r}", note, muted=True)
    ws[f"B{R_BILLABLE}"].comment = Comment("Assumption: nobody bills every hour at work. 75% leaves a quarter for cleaning, admin, gaps and no-shows.", "Knackdesk")
    ws[f"B{R_WEEKS}"].comment = Comment("Assumption: 4 weeks a year off for holiday, sickness and training.", "Knackdesk")
    derived = [(R_BILL_HRS, "Billable hours per month", f"=ROUND(B{R_HOURS}*B{R_BILLABLE}/100*B{R_WEEKS}/12,2)", "0.00",
                "formula: hours per week × billable % × working weeks ÷ 12"),
               (R_RATE, "Target hourly rate", f"=IFERROR(ROUND((B{R_OVERHEAD}+B{R_INCOME}*(1+B{R_PAYROLL}/100))/B{R_BILL_HRS},2),0)", MONEY,
                "formula: (total overhead + income goal, plus payroll % if any) ÷ billable hours per month"),
               (R_RATE + 1, "Overhead per billable hour", f"=IFERROR(ROUND(B{R_OVERHEAD}/B{R_BILL_HRS},2),0)", MONEY,
                "formula: total overhead ÷ billable hours per month (the part of the rate that only keeps the doors open)"),
               (R_RATE + 2, "Target rate per minute", f"=ROUND(B{R_RATE}/60,4)", "0.0000",
                "formula: target hourly rate ÷ 60")]
    rows_block(ws, derived, bold_rows=(R_BILL_HRS, R_RATE))


def build_menu(ws):
    lo, hi = MENU_ROWS; tot = hi + 1
    label(ws, "A1", "Service Menu", bold=True).font = TITLE
    label(ws, "A2", "One row per service. Time cost uses the target hourly rate from Settings; suggested price adds your profit margin to the floor price.", muted=True)
    head(ws, 4, ["Service", "Category", "Minutes", "Product cost per service", "Current price", "Weekly units", "Time cost",
                 "Floor price", "Suggested price", "Gap (current − suggested)", "Weekly revenue", "Weekly gross profit", "Gross profit per minute"],
         [28, 12, 10, 13, 12, 10, 11, 11, 12, 14, 13, 14, 13])
    dv = DataValidation(type="list", formula1=CATEGORIES, allow_blank=True); ws.add_data_validation(dv)
    for r in range(lo, hi + 1):
        blank(ws, r, "ABCDEF", {"C": INT0, "D": MONEY, "E": MONEY, "F": INT0}); dv.add(f"B{r}")
        g = f'=IF(A{r}="","",{{}})'
        fx(ws, f"G{r}", g.format(f"ROUND({S}{R_RATE}*C{r}/60,2)"), MONEY)
        fx(ws, f"H{r}", g.format(f"G{r}+D{r}"), MONEY)
        fx(ws, f"I{r}", g.format(f"ROUND(H{r}*(1+{S}{R_MARGIN}/100),2)"), MONEY)
        fx(ws, f"J{r}", g.format(f"E{r}-I{r}"), MONEY)
        fx(ws, f"K{r}", g.format(f"ROUND(E{r}*F{r},2)"), MONEY)
        fx(ws, f"L{r}", g.format(f"ROUND((E{r}-D{r})*F{r},2)"), MONEY)
        fx(ws, f"M{r}", g.format(f'IFERROR(ROUND((E{r}-D{r})/C{r},3),"")'), "0.000")
    sample = [("Women's cut", "hair", 45, 4, 55, 12), ("Full colour", "colour", 120, 22, 140, 5),
              ("Beard trim", "barber", 20, 1, 22, 15), ("Personal training session", "training", 60, 0, 60, 10),
              ("Men's cut", "barber", 30, 2, 30, 6), ("Gel manicure", "nails", 45, 5, 40, 3),
              ("Express facial", "skin", 30, 6, 45, 2), ("Deep tissue massage", "massage", 60, 3, 75, 2)]
    for i, (name, cat, mins, prod, price, units) in enumerate(sample):
        r = lo + i
        inp(ws, f"A{r}", name); inp(ws, f"B{r}", cat); inp(ws, f"C{r}", mins, INT0, key=True)
        inp(ws, f"D{r}", prod, MONEY); inp(ws, f"E{r}", price, MONEY, key=True); inp(ws, f"F{r}", units, INT0)
    ws[f"D{lo}"].comment = Comment("Product used per service at cost (colour, gloves, foils, wax). Overhead products go on Settings.", "Knackdesk")
    label(ws, f"A{tot}", "Total", bold=True)
    fx(ws, f"C{tot}", f"=SUMPRODUCT(C{lo}:C{hi},F{lo}:F{hi})", INT0, bold=True)
    fx(ws, f"F{tot}", f"=SUM(F{lo}:F{hi})", INT0, bold=True)
    for col in "KL": fx(ws, f"{col}{tot}", f"=SUM({col}{lo}:{col}{hi})", MONEY, bold=True)
    label(ws, f"A{tot+1}", "Minutes column total = weekly minutes booked (minutes × weekly units)", muted=True)
    ws.freeze_panes = "B5"


def build_booth(ws):
    m_tot = MENU_ROWS[1] + 1
    for col, w in zip("ABCDE", [44, 16, 18, 22, 24]): ws.column_dimensions[col].width = w
    label(ws, "A1", "Booth vs Commission", bold=True).font = TITLE
    label(ws, "A2", "Renting a booth: you keep revenue less booth rent and product. Commission: you keep your commission share and the salon supplies product.", muted=True)
    rows_block(ws, [(4, "Monthly revenue from Service Menu", f"=ROUND({SM}K{m_tot}*52/12,2)", MONEY, "weekly revenue × 52 ÷ 12")])
    label(ws, "A5", "or type your own monthly revenue")
    inp(ws, "B5", None, MONEY, key=True, note="Leave empty to use the Service Menu figure above; any number here takes precedence.")
    label(ws, "C5", "optional override; leave empty to use the line above", muted=True)
    rows = [(6, "Monthly revenue used", '=IF(B5="",B4,B5)', MONEY, "your override if typed, otherwise the Service Menu figure"),
            (7, "Weekly booth rent", f"={S}{R_BOOTH}", MONEY, "from Settings"),
            (8, "Booth rent monthly", "=ROUND(B7*52/12,2)", MONEY, "weekly rent × 52 ÷ 12"),
            (9, "Product cost % of revenue", f"={S}{R_PRODUCT}", PCT, "from Settings; paid by you when renting a booth"),
            (10, "Commission % you keep", f"={S}{R_COMMISSION}", PCT, "from Settings"),
            (11, "Booth rent % of revenue", '=IFERROR(ROUND(B8/B6*100,2),"n/a")', PCT, "booth rent monthly ÷ monthly revenue"),
            (12, "Booth rent take-home (monthly)", "=ROUND(B6-B8-B6*B9/100,2)", MONEY, "revenue − booth rent − revenue × product %"),
            (13, "Commission take-home (monthly)", "=ROUND(B6*B10/100,2)", MONEY, "revenue × commission % you keep"),
            (14, "Difference (booth − commission)", "=B12-B13", MONEY, "positive: booth rent leaves you more"),
            (15, "Verdict", '=IF(ROUND(B14,2)>0,"Booth rent pays more",IF(ROUND(B14,2)<0,"Commission pays more","Both pay the same"))', None, None),
            (16, "Break-even monthly revenue", '=IF(1-B10/100-B9/100<=0,"n/a",IFERROR(ROUND(B8/(1-B10/100-B9/100),2),"n/a"))', MONEY,
             "booth rent monthly ÷ (1 − commission % − product %); above it booth rent pays more")]
    rows_block(ws, rows, bold_rows=(12, 13, 15, 16))
    label(ws, "A18", "Revenue scenarios", bold=True).font = TITLE
    head(ws, 19, ["Revenue change %", "Monthly revenue", "Booth take-home", "Commission take-home", "Better option"])
    for i, pct in enumerate([-20, -10, 0, 10, 20]):
        r = 20 + i
        inp(ws, f"A{r}", pct, PCT)
        fx(ws, f"B{r}", f"=ROUND($B$6*(1+A{r}/100),2)", MONEY)
        fx(ws, f"C{r}", f"=ROUND(B{r}-$B$8-B{r}*$B$9/100,2)", MONEY)
        fx(ws, f"D{r}", f"=ROUND(B{r}*$B$10/100,2)", MONEY)
        fx(ws, f"E{r}", f'=IF(C{r}>D{r},"Booth rent",IF(C{r}<D{r},"Commission","Same"))')
    ws["A20"].comment = Comment("Scenario steps are editable: type any % change against the monthly revenue used.", "Knackdesk")


def build_log(ws):
    lo, hi = WEEK_ROWS; tot = hi + 1; avg = hi + 2
    label(ws, "A1", "Weekly Log", bold=True).font = TITLE
    label(ws, "A2", "One row per week, filled top down. Lost revenue uses the average ticket and fees recovered use the no-show fee from Settings.", muted=True)
    head(ws, 4, ["Week start", "Appointments booked", "No-shows", "Late cancellations", "Revenue", "Product spend",
                 "Booth rent or overhead paid", "Tips (optional)", "Completed appointments", "No-show rate %", "Lost revenue",
                 "Fees recovered", "Net", "Revenue per completed appointment"],
         [12, 12, 10, 12, 12, 12, 14, 11, 13, 11, 12, 12, 12, 15])
    fm = {c: MONEY for c in "EFGH"}; fm.update({"A": DATE, "B": INT0, "C": INT0, "D": INT0})
    for r in range(lo, hi + 1):
        blank(ws, r, "ABCDEFGH", fm)
        g = f'=IF(A{r}="","",{{}})'
        fx(ws, f"I{r}", g.format(f"B{r}-C{r}-D{r}"), INT0)
        fx(ws, f"J{r}", g.format(f"IFERROR(ROUND((C{r}+D{r})/B{r}*100,2),0)"), PCT)
        fx(ws, f"K{r}", g.format(f"ROUND((C{r}+D{r})*{S}{R_TICKET},2)"), MONEY)
        fx(ws, f"L{r}", g.format(f"ROUND((C{r}+D{r})*{S}{R_NOSHOW_FEE},2)"), MONEY)
        fx(ws, f"M{r}", g.format(f"E{r}-F{r}-G{r}"), MONEY)
        fx(ws, f"N{r}", g.format(f'IFERROR(ROUND(E{r}/I{r},2),"")'), MONEY)
    ws[f"L{lo}"].comment = Comment("Assumes you charge the no-show fee for every no-show and late cancellation.", "Knackdesk")
    start = dt.date(dt.date.today().year, 8, 1); start += dt.timedelta(days=(7 - start.weekday()) % 7)
    sample = [(32, 2, 1, 1950, 195, 300, 120), (34, 1, 2, 2080, 205, 300, 135), (30, 3, 0, 1840, 180, 300, 110),
              (33, 2, 2, 1990, 198, 300, 125), (35, 1, 1, 2210, 220, 300, 150), (31, 2, 1, 1900, 190, 300, 115)]
    for i, row in enumerate(sample):
        r = lo + i
        inp(ws, f"A{r}", start + dt.timedelta(weeks=i), DATE)
        for col, val in zip("BCDEFGH", row): inp(ws, f"{col}{r}", val, fm.get(col), key=(i == 0 and col in "BE"))
    label(ws, f"A{tot}", "Total", bold=True)
    for col in "BCDEFGHIKLM": fx(ws, f"{col}{tot}", f"=SUM({col}{lo}:{col}{hi})", fm.get(col, MONEY if col in "KLM" else INT0), bold=True)
    label(ws, f"A{avg}", "4-week average", bold=True)
    n = f"COUNT($A${lo}:$A${hi})"
    for col in "BCDEFGHIKLM":
        rng = f"${col}${lo}:${col}${hi}"
        fx(ws, f"{col}{avg}", f"=IFERROR(ROUND(AVERAGE(INDEX({rng},MAX(1,{n}-3)):INDEX({rng},{n})),2),0)",
           MONEY if col in "EFGHKLM" else "0.0", bold=True)
    for r in (tot, avg):
        fx(ws, f"J{r}", f"=IFERROR(ROUND((C{r}+D{r})/B{r}*100,2),0)", PCT, bold=True)
        fx(ws, f"N{r}", f"=IFERROR(ROUND(E{r}/I{r},2),0)", MONEY, bold=True)
    ws[f"A{avg}"].comment = Comment("Average of the last four filled weeks; fill weeks top down with no gaps.", "Knackdesk")
    ws.freeze_panes = "B5"


def build_capacity(ws):
    ml, mh = MENU_ROWS; wl, wh = WEEK_ROWS
    ws.column_dimensions["A"].width = 44; ws.column_dimensions["B"].width = 14; ws.column_dimensions["C"].width = 70
    label(ws, "A1", "Capacity", bold=True).font = TITLE
    label(ws, "A2", "How many appointments fit in your week, and what they could earn.", muted=True)
    rows_block(ws, [(4, "Hours worked per week", f"={S}{R_HOURS}", HRS, "from Settings"),
                    (5, "Share of hours that are billable %", f"={S}{R_BILLABLE}", PCT, "from Settings"),
                    (6, "Average service minutes from Service Menu",
                     f"=IFERROR(ROUND(SUMPRODUCT({SM}C{ml}:C{mh},{SM}F{ml}:F{mh})/SUM({SM}F{ml}:F{mh}),1),0)", HRS,
                     "weighted by weekly units")])
    label(ws, "A7", "or type your own average service minutes")
    inp(ws, "B7", None, HRS, key=True, note="Leave empty to use the weighted average from the Service Menu; any number here takes precedence.")
    label(ws, "C7", "optional override; leave empty to use the line above", muted=True)
    label(ws, "A9", "Buffer minutes between appointments")
    inp(ws, "B9", 10, INT0, key=True, note="Assumption: 10 minutes to clean, reset and take payment between clients.")
    label(ws, "C9", "default 10: cleaning, reset and payment", muted=True)
    rows = [(8, "Average service minutes used", '=IF(B7="",B6,B7)', HRS, "your override if typed, otherwise the Service Menu figure"),
            (10, "Slot minutes", "=B8+B9", HRS, "service minutes + buffer"),
            (11, "Max appointments per week", "=IFERROR(INT(B4*60/B10),0)", INT0, "hours × 60 ÷ slot minutes, rounded down"),
            (12, "Expected appointments per week", "=ROUND(B11*B5/100,0)", INT0, "max appointments × billable %"),
            (13, "Average ticket", f"={S}{R_TICKET}", MONEY, "from Settings"),
            (14, "Revenue ceiling per week", "=ROUND(B11*B13,2)", MONEY, "max appointments × average ticket"),
            (15, "Expected revenue per week", "=ROUND(B12*B13,2)", MONEY, "expected appointments × average ticket"),
            (17, "Booked appointments, latest logged week",
             f'=IF(COUNT({WL}A{wl}:A{wh})=0,"n/a",IFERROR(INDEX({WL}B{wl}:B{wh},MATCH(MAX({WL}A{wl}:A{wh}),{WL}A{wl}:A{wh},0)),"n/a"))',
             INT0, "the row with the latest week start date on the Weekly Log"),
            (18, "Booked vs expected", '=IFERROR(B17-B12,"n/a")', '0;-0;0', "positive: busier than expected")]
    rows_block(ws, rows, bold_rows=(11, 12, 15, 17))


def build_summary(ws):
    ml, mh = MENU_ROWS; m_tot = mh + 1; w_tot = WEEK_ROWS[1] + 1
    ws.column_dimensions["A"].width = 40; ws.column_dimensions["B"].width = 24; ws.column_dimensions["C"].width = 60
    label(ws, "A1", "Summary", bold=True).font = TITLE
    m = lambda col: f"{SM}{col}{ml}:{col}{mh}"
    rows = [(2, "Target hourly rate", f"={S}{R_RATE}", MONEY, "from Settings"),
            (3, "Billable hours per month", f"={S}{R_BILL_HRS}", "0.00", "from Settings"),
            (4, "Services on the menu", f"=COUNTA({m('A')})", INT0, None),
            (5, "Services priced below floor", f'=SUMPRODUCT(({m("A")}<>"")*({m("E")}<{m("H")}))', INT0, "current price below floor price"),
            (6, "Services priced below suggested", f'=COUNTIF({m("J")},"<0")', INT0, "gap column below zero"),
            (7, "Weekly revenue from menu", f"={SM}K{m_tot}", MONEY, None),
            (8, "Weekly gross profit from menu", f"={SM}L{m_tot}", MONEY, "revenue less product cost"),
            (9, "Highest-margin service", f'=IFERROR(INDEX({m("A")},MATCH(MAX({m("M")}),{m("M")},0)),"")', None, "highest gross profit per minute"),
            (10, "Lowest-margin service", f'=IFERROR(INDEX({m("A")},MATCH(MIN({m("M")}),{m("M")},0)),"")', None, "lowest gross profit per minute: re-price first"),
            (11, "Booth vs commission", f"={BC}B15", None, None),
            (12, "Break-even monthly revenue", f"={BC}B16", MONEY, "above it booth rent pays more"),
            (13, "Lost revenue to no-shows (logged weeks)", f"={WL}K{w_tot}", MONEY, "Weekly Log total"),
            (14, "No-show fees recovered (logged weeks)", f"={WL}L{w_tot}", MONEY, "Weekly Log total"),
            (15, "Expected appointments per week", "=Capacity!B12", INT0, "from Capacity")]
    rows_block(ws, rows, bold_rows=tuple(r for r, *_ in rows))


README = """# Salon & Appointment Pricing Workbook

Thank you for buying the workbook. Open `salon-pricing-workbook.xlsx` in Excel (2010 or later), Google Sheets (File > Import) or Apple Numbers.

1. **Settings:** your monthly overhead line by line, take-home income goal, working weeks, hours, billable share, profit margin, product cost %, average ticket, booth rent, commission split and no-show fee; your target hourly rate follows.
2. **Service Menu:** services with minutes, product cost, current price and weekly units; time cost, floor price, suggested price, the gap and weekly revenue and gross profit follow.
3. **Booth vs Commission:** monthly take-home renting a booth against working on commission, the verdict, the break-even revenue and five revenue scenarios.
4. **Weekly Log:** appointments, no-shows, late cancellations, revenue and costs per week with no-show rate, lost revenue, fees recovered, net, totals and a 4-week average.
5. **Capacity:** maximum and expected appointments per week from your hours, service length and buffer, the revenue ceiling and your latest week against expected.
6. **Summary:** target hourly rate, services below floor, best and worst margin services, booth vs commission verdict, no-show losses and expected appointments.

Blue text = type here. Black text = formula, leave it alone. Definitions are on the Start Here sheet.

No macros, no tracking. Arithmetic only, not financial advice; the targets are your own, not industry benchmarks. Licensed for personal or single-business use; please do not redistribute.

Questions: hello@knackdesk.com · Free tools: https://knackdesk.com
"""


def build_workbook(xlsx):
    wb = Workbook(); ws = wb.active; ws.title = "Start Here"; build_start(ws)
    build_settings(wb.create_sheet("Settings")); build_menu(wb.create_sheet("Service Menu"))
    build_booth(wb.create_sheet("Booth vs Commission")); build_log(wb.create_sheet("Weekly Log"))
    build_capacity(wb.create_sheet("Capacity")); build_summary(wb.create_sheet("Summary"))
    for sheet in wb.worksheets:
        for row in sheet.iter_rows():
            for c in row:
                if c.value is not None and c.font.name != FONT:
                    c.font = Font(name=FONT, bold=c.font.bold, italic=c.font.italic, color=c.font.color, size=c.font.size)
    wb.save(xlsx)


def write_zip(out, xlsx):
    readme = os.path.join(out, "README.md")
    with open(readme, "w") as f: f.write(README)
    with zipfile.ZipFile(os.path.join(out, f"{SLUG}.zip"), "w", zipfile.ZIP_DEFLATED) as z:
        z.write(xlsx, f"{SLUG}.xlsx"); z.write(readme, "README.md")


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--out", required=True)
    ap.add_argument("--zip-only", action="store_true", help="re-zip the existing (recalculated) xlsx with the README")
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)
    xlsx = os.path.join(args.out, f"{SLUG}.xlsx")
    if args.zip_only:
        if not os.path.exists(xlsx): raise SystemExit(f"missing {xlsx}; build it first")
    else:
        build_workbook(xlsx)
    write_zip(args.out, xlsx)
    print(f"{'zipped' if args.zip_only else 'built'} {xlsx}")


if __name__ == "__main__":
    main()
