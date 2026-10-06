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
const slug = "salon-pricing-workbook";

// Cells checked for formulas:
// 'Service Menu'!H5 floor price, 'Service Menu'!I5 suggested price, 'Booth vs Commission'!B12 booth take-home,
// 'Booth vs Commission'!B16 break-even revenue, 'Weekly Log'!K5 lost revenue, Capacity!B11 max appointments,
// Summary!B2 target hourly rate.
const CELLS = { menu_floor: ["Service Menu", "H5"], menu_suggested: ["Service Menu", "I5"],
  booth_takehome: ["Booth vs Commission", "B12"], booth_breakeven: ["Booth vs Commission", "B16"],
  log_lost: ["Weekly Log", "K5"], capacity_max: ["Capacity", "B11"], summary_rate: ["Summary", "B2"] };

let out;
beforeAll(() => {
  out = mkdtempSync(join(tmpdir(), "spkit-"));
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

describe("salon pricing workbook builder", () => {
  it("writes the xlsx, README and zip", () => {
    for (const f of [`${slug}.xlsx`, "README.md", `${slug}.zip`]) expect(existsSync(join(out, f))).toBe(true);
  });
  it("has the seven sheets in order", () => {
    expect(inspect().sheets).toEqual(["Start Here", "Settings", "Service Menu", "Booth vs Commission", "Weekly Log", "Capacity", "Summary"]);
  });
  it("uses formulas for settings, menu pricing, booth vs commission, the log, capacity and summary", () => {
    const i = inspect();
    for (const s of ["Settings", "Service Menu", "Booth vs Commission", "Weekly Log", "Capacity", "Summary"]) expect(i.formulas[s]).toBeGreaterThan(4);
    for (const k of Object.keys(CELLS)) expect(String(i.samples[k]), k).toMatch(/^=/);
  });
});
