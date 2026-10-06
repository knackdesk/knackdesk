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
const slug = "dental-practice-numbers-workbook";
const SHEETS = ["Start Here", "Settings", "Monthly P&L", "Provider Production", "Hygiene", "Chairs & New Patients", "Summary"];

// Cells checked for formulas:
// 'Monthly P&L'!N5 overhead %, 'Provider Production'!K5 profit per hour, Hygiene!J5 margin %,
// 'Chairs & New Patients'!G5 chair utilization %, 'Chairs & New Patients'!F22 cost per new patient, Summary!B5 overhead %.
const CELLS = { overhead_pct: ["Monthly P&L", "N5"], profit_per_hour: ["Provider Production", "K5"],
  hygiene_margin: ["Hygiene", "J5"], chair_utilization: ["Chairs & New Patients", "G5"],
  cost_per_new_patient: ["Chairs & New Patients", "F22"], summary_overhead: ["Summary", "B5"] };

let out;
beforeAll(() => {
  out = mkdtempSync(join(tmpdir(), "dentalkit-"));
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

describe("Dental practice numbers workbook builder", () => {
  it("writes the xlsx, README and zip", () => {
    for (const f of [`${slug}.xlsx`, "README.md", `${slug}.zip`]) expect(existsSync(join(out, f))).toBe(true);
  });
  it("has the seven sheets in order", () => {
    expect(inspect().sheets).toEqual(SHEETS);
  });
  it("uses formulas for settings, P&L, providers, hygiene, chairs, new patients and summary", () => {
    const i = inspect();
    for (const s of SHEETS.slice(1)) expect(i.formulas[s], s).toBeGreaterThan(4);
    for (const k of Object.keys(CELLS)) expect(String(i.samples[k]), k).toMatch(/^=/);
  });
});
