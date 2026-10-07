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
const slug = "interior-design-pricing-workbook";
const SHEETS = ["Start Here", "Settings", "Fee Builder", "Procurement", "Room Fees", "Budget Plan", "Summary"];

// Cells checked for formulas:
// 'Fee Builder'!T5 design fee, 'Fee Builder'!W5 percentage fee − design fee, Procurement!S5 margin %,
// 'Room Fees'!K5 room fee, 'Budget Plan'!O5 remaining, Summary!B2 hourly rate needed.
const CELLS = { fee_design_fee: ["Fee Builder", "T5"], fee_pct_difference: ["Fee Builder", "W5"],
  procurement_margin: ["Procurement", "S5"], room_fee: ["Room Fees", "K5"],
  budget_remaining: ["Budget Plan", "O5"], summary_rate_needed: ["Summary", "B2"] };
// The design fee must be priced at the rate used on Settings.
const EXTRA = { fee_base: ["Fee Builder", "R5"] };

let out;
beforeAll(() => {
  out = mkdtempSync(join(tmpdir(), "interiorkit-"));
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

describe("Interior design pricing workbook builder", () => {
  it("writes the xlsx, README and zip", () => {
    for (const f of [`${slug}.xlsx`, "README.md", `${slug}.zip`]) expect(existsSync(join(out, f))).toBe(true);
  });
  it("has the seven sheets in order", () => {
    expect(inspect().sheets).toEqual(SHEETS);
  });
  it("uses formulas for settings, fees, procurement, rooms, budgets and summary", () => {
    const i = inspect();
    for (const s of SHEETS.slice(1)) expect(i.formulas[s], s).toBeGreaterThan(4);
    for (const k of Object.keys(CELLS)) expect(String(i.samples[k]), k).toMatch(/^=/);
  });
  it("prices the base fee at the rate used on Settings", () => {
    expect(String(inspect().samples.fee_base)).toContain("Settings!$B$");
  });
});
