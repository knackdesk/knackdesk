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
const slug = "bookkeeping-pricing-workbook";

// Cells checked for formulas:
// 'Package Builder'!M5 recommended fee, 'Package Builder'!N5 gap, 'Catch-Up Quotes'!M5 quote total,
// Capacity!B16 max clients, 'Realization Log'!K5 overall realization %, Summary!B2 cost-recovery rate.
const CELLS = { builder_recommended: ["Package Builder", "M5"], builder_gap: ["Package Builder", "N5"],
  catchup_total: ["Catch-Up Quotes", "M5"], capacity_max: ["Capacity", "B16"],
  log_overall: ["Realization Log", "K5"], summary_rate: ["Summary", "B2"] };

let out;
beforeAll(() => {
  out = mkdtempSync(join(tmpdir(), "bpkit-"));
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

describe("bookkeeping pricing workbook builder", () => {
  it("writes the xlsx, README and zip", () => {
    for (const f of [`${slug}.xlsx`, "README.md", `${slug}.zip`]) expect(existsSync(join(out, f))).toBe(true);
  });
  it("has the seven sheets in order", () => {
    expect(inspect().sheets).toEqual(["Start Here", "Settings", "Package Builder", "Catch-Up Quotes", "Capacity", "Realization Log", "Summary"]);
  });
  it("uses formulas for settings, packages, catch-up quotes, capacity, realization and summary", () => {
    const i = inspect();
    for (const s of ["Settings", "Package Builder", "Catch-Up Quotes", "Capacity", "Realization Log", "Summary"]) expect(i.formulas[s]).toBeGreaterThan(4);
    for (const k of Object.keys(CELLS)) expect(String(i.samples[k]), k).toMatch(/^=/);
  });
});
