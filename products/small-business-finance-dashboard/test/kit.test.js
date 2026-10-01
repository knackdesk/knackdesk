import { describe, it, expect, beforeAll } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdtempSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..", "..");
const venv = join(root, ".venv", "bin", "python");
const py = existsSync(venv) ? venv : "python3";
const builder = join(here, "..", "src", "build_kit.py");

let out;
beforeAll(() => {
  out = mkdtempSync(join(tmpdir(), "fkit-"));
  execFileSync(py, [builder, "--out", out], { stdio: "pipe" });
});

function inspect() {
  const script = `
import json, sys, openpyxl
wb = openpyxl.load_workbook(sys.argv[1])
info = {"sheets": wb.sheetnames, "formulas": {}, "samples": {}}
for ws in wb.worksheets:
    info["formulas"][ws.title] = sum(1 for row in ws.iter_rows() for c in row if isinstance(c.value, str) and c.value.startswith("="))
info["samples"]["expense_total"] = wb["Expenses"]["N5"].value
info["samples"]["gross_profit"] = wb["Monthly P&L"]["D5"].value
info["samples"]["tax_set_aside"] = wb["Monthly P&L"]["K5"].value
info["samples"]["cumulative"] = wb["Monthly P&L"]["P6"].value
info["samples"]["summary_revenue"] = wb["Summary"]["B2"].value
print(json.dumps(info))`;
  return JSON.parse(execFileSync(py, ["-c", script, join(out, "small-business-finance-dashboard.xlsx")], { stdio: "pipe" }).toString());
}

describe("small business finance dashboard builder", () => {
  it("writes the xlsx, README and zip", () => {
    for (const f of ["small-business-finance-dashboard.xlsx", "README.md", "small-business-finance-dashboard.zip"]) expect(existsSync(join(out, f))).toBe(true);
  });
  it("has the five sheets in order", () => {
    expect(inspect().sheets).toEqual(["Start Here", "Settings", "Expenses", "Monthly P&L", "Summary"]);
  });
  it("uses formulas for expense totals, gross profit, tax set-aside, cumulative retained and summary", () => {
    const i = inspect();
    for (const s of ["Expenses", "Monthly P&L", "Summary"]) expect(i.formulas[s]).toBeGreaterThan(4);
    for (const k of ["expense_total", "gross_profit", "tax_set_aside", "cumulative", "summary_revenue"]) expect(String(i.samples[k])).toMatch(/^=/);
  });
});
