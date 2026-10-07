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
const slug = "law-firm-pricing-workbook";
const SHEETS = ["Start Here", "Settings", "Timekeepers", "Flat Fee Pricer", "Matter Tracker", "Lock-Up & Contingency", "Summary"];

// Cells checked for formulas:
// Timekeepers!N5 cost rate, 'Flat Fee Pricer'!P5 flat fee, 'Matter Tracker'!N5 fees variance %,
// 'Lock-Up & Contingency'!H5 lock-up days, 'Lock-Up & Contingency'!M22 net fee to firm, Summary!B3 average cost rate.
const CELLS = { cost_rate: ["Timekeepers", "N5"], flat_fee: ["Flat Fee Pricer", "P5"],
  fees_variance_pct: ["Matter Tracker", "N5"], lock_up_days: ["Lock-Up & Contingency", "H5"],
  contingency_net_fee: ["Lock-Up & Contingency", "M22"], summary_cost_rate: ["Summary", "B3"] };
// Flat fee role cost rates must average the Timekeepers cost rate by role.
const EXTRA = { partner_rate: ["Flat Fee Pricer", "B2"] };

let out;
beforeAll(() => {
  out = mkdtempSync(join(tmpdir(), "lawkit-"));
  execFileSync(py, [builder, "--out", out], { stdio: "pipe" });
});

function inspect() {
  const script = `
import json, sys, openpyxl
wb = openpyxl.load_workbook(sys.argv[1]); cells = json.loads(sys.argv[2])
info = {"sheets": wb.sheetnames, "formulas": {}, "samples": {}}
for ws in wb.worksheets:
    info["formulas"][ws.title] = sum(1 for row in ws.iter_rows() for c in row if isinstance(c.value, str) and c.value.startswith("="))
for k, (s, ref) in cells.items():
    info["samples"][k] = wb[s][ref].value
print(json.dumps(info, default=str))`;
  return JSON.parse(execFileSync(py, ["-c", script, join(out, `${slug}.xlsx`), JSON.stringify({ ...CELLS, ...EXTRA })], { stdio: "pipe" }).toString());
}

describe("Law firm pricing workbook builder", () => {
  it("writes the xlsx, README and zip", () => {
    for (const f of [`${slug}.xlsx`, "README.md", `${slug}.zip`]) expect(existsSync(join(out, f))).toBe(true);
  });
  it("has the seven sheets in order", () => {
    expect(inspect().sheets).toEqual(SHEETS);
  });
  it("uses formulas for settings, timekeepers, flat fees, matters, lock-up, contingency and summary", () => {
    const i = inspect();
    for (const s of SHEETS.slice(1)) expect(i.formulas[s], s).toBeGreaterThan(4);
    for (const k of Object.keys(CELLS)) expect(String(i.samples[k]), k).toMatch(/^=/);
  });
  it("averages the partner cost rate from the Timekeepers sheet by role", () => {
    const i = inspect();
    expect(i.samples.partner_rate).toContain("AVERAGEIF(Timekeepers!$B$5:$B$24");
    expect(i.samples.partner_rate).toContain("Timekeepers!$N$5:$N$24");
  });
});
