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
const slug = "staffing-agency-margin-workbook";
const SHEETS = ["Start Here", "Settings", "Perm Placements", "Temp Assignments", "Desk Performance", "Rebate Reserve", "Summary"];

// Cells checked for formulas:
// 'Perm Placements'!O5 net fee, 'Perm Placements'!R5 margin %, 'Temp Assignments'!P5 gross margin %,
// 'Desk Performance'!Q5 fill rate %, 'Rebate Reserve'!O5 expected reserve, Summary!B4 recruiter cost per hour.
const CELLS = { perm_net_fee: ["Perm Placements", "O5"], perm_margin_pct: ["Perm Placements", "R5"],
  temp_margin_pct: ["Temp Assignments", "P5"], fill_rate: ["Desk Performance", "Q5"],
  expected_reserve: ["Rebate Reserve", "O5"], summary_cost_per_hour: ["Summary", "B4"] };
// Delivery cost must read the recruiter cost per hour from Settings.
const EXTRA = { perm_delivery: ["Perm Placements", "P5"] };

let out;
beforeAll(() => {
  out = mkdtempSync(join(tmpdir(), "staffkit-"));
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

describe("Staffing agency margin workbook builder", () => {
  it("writes the xlsx, README and zip", () => {
    for (const f of [`${slug}.xlsx`, "README.md", `${slug}.zip`]) expect(existsSync(join(out, f))).toBe(true);
  });
  it("has the seven sheets in order", () => {
    expect(inspect().sheets).toEqual(SHEETS);
  });
  it("uses formulas for settings, placements, temps, desk performance, reserve and summary", () => {
    const i = inspect();
    for (const s of SHEETS.slice(1)) expect(i.formulas[s], s).toBeGreaterThan(4);
    for (const k of Object.keys(CELLS)) expect(String(i.samples[k]), k).toMatch(/^=/);
  });
  it("costs placement delivery at the Settings recruiter cost per hour", () => {
    expect(inspect().samples.perm_delivery).toContain("Settings!$B$");
  });
});
