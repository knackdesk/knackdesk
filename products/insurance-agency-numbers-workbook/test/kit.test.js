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
const slug = "insurance-agency-numbers-workbook";
const SHEETS = ["Start Here", "Settings", "Book by Line", "Producers", "Acquisition", "Commission Splits", "Summary"];

// Cells checked for formulas:
// 'Book by Line'!M5 retention %, 'Book by Line'!P5 annual renewal commission, Producers!I5 compensation ratio %,
// Acquisition!O5 cost per policy, 'Commission Splits'!N5 agent net after fee, Summary!B3 retention %.
const CELLS = { book_retention: ["Book by Line", "M5"], book_renewal_commission: ["Book by Line", "P5"],
  producer_comp_ratio: ["Producers", "I5"], acquisition_cost_per_policy: ["Acquisition", "O5"],
  split_agent_net: ["Commission Splits", "N5"], summary_retention: ["Summary", "B3"] };
// The default renewal commission % on each line must come from Settings.
const EXTRA = { book_default_renewal: ["Book by Line", "F5"] };

let out;
beforeAll(() => {
  out = mkdtempSync(join(tmpdir(), "insurancekit-"));
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

describe("Insurance agency numbers workbook builder", () => {
  it("writes the xlsx, README and zip", () => {
    for (const f of [`${slug}.xlsx`, "README.md", `${slug}.zip`]) expect(existsSync(join(out, f))).toBe(true);
  });
  it("has the seven sheets in order", () => {
    expect(inspect().sheets).toEqual(SHEETS);
  });
  it("uses formulas for settings, book, producers, acquisition, splits and summary", () => {
    const i = inspect();
    for (const s of SHEETS.slice(1)) expect(i.formulas[s], s).toBeGreaterThan(4);
    for (const k of Object.keys(CELLS)) expect(String(i.samples[k]), k).toMatch(/^=/);
  });
  it("takes the default renewal commission % from Settings", () => {
    expect(String(inspect().samples.book_default_renewal)).toContain("Settings!$B$");
  });
});
