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
const slug = "restaurant-numbers-workbook";

// Cells checked for formulas:
// Recipes!E5 line cost, Recipes!G5 cost per portion, Menu!D5 food cost %, Menu!F5 price at target food cost,
// 'Weekly P&L'!H5 prime cost, Labour!E5 weekly staff cost, Summary!B3 blended food cost %.
const CELLS = { recipe_line: ["Recipes", "E5"], recipe_portion: ["Recipes", "G5"], menu_fc: ["Menu", "D5"],
  menu_target: ["Menu", "F5"], pnl_prime: ["Weekly P&L", "H5"], labour_cost: ["Labour", "E5"], summary_fc: ["Summary", "B3"] };

let out;
beforeAll(() => {
  out = mkdtempSync(join(tmpdir(), "rnkit-"));
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
  return JSON.parse(execFileSync(py, ["-c", script, join(out, `${slug}.xlsx`), JSON.stringify(CELLS)], { stdio: "pipe" }).toString());
}

describe("restaurant numbers workbook builder", () => {
  it("writes the xlsx, README and zip", () => {
    for (const f of [`${slug}.xlsx`, "README.md", `${slug}.zip`]) expect(existsSync(join(out, f))).toBe(true);
  });
  it("has the seven sheets in order", () => {
    expect(inspect().sheets).toEqual(["Start Here", "Settings", "Recipes", "Menu", "Weekly P&L", "Labour", "Summary"]);
  });
  it("uses formulas for recipe cost, menu food cost, prime cost, labour and summary", () => {
    const i = inspect();
    for (const s of ["Recipes", "Menu", "Weekly P&L", "Labour", "Summary"]) expect(i.formulas[s]).toBeGreaterThan(4);
    for (const k of Object.keys(CELLS)) expect(String(i.samples[k]), k).toMatch(/^=/);
  });
});
