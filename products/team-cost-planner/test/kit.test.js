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
  out = mkdtempSync(join(tmpdir(), "tkit-"));
  execFileSync(py, [builder, "--out", out], { stdio: "pipe" });
});

function inspect() {
  const script = `
import json, sys, openpyxl
wb = openpyxl.load_workbook(sys.argv[1])
info = {"sheets": wb.sheetnames, "formulas": {}, "samples": {}}
for ws in wb.worksheets:
    info["formulas"][ws.title] = sum(1 for row in ws.iter_rows() for c in row if isinstance(c.value, str) and c.value.startswith("="))
info["samples"]["team_total_annual"] = wb["Team"]["I41"].value
info["samples"]["team_cost_per_hour"] = wb["Team"]["L5"].value
info["samples"]["raise_new_salary"] = wb["Raises"]["F5"].value
info["samples"]["pto_balance"] = wb["PTO"]["J5"].value
info["samples"]["turnover_per_leaver"] = wb["Hiring & Turnover"]["B30"].value
print(json.dumps(info))`;
  return JSON.parse(execFileSync(py, ["-c", script, join(out, "team-cost-planner.xlsx")], { stdio: "pipe" }).toString());
}

describe("team cost planner builder", () => {
  it("writes the xlsx, README and zip", () => {
    for (const f of ["team-cost-planner.xlsx", "README.md", "team-cost-planner.zip"]) expect(existsSync(join(out, f))).toBe(true);
  });
  it("has the six sheets in order", () => {
    expect(inspect().sheets).toEqual(["Start Here", "Settings", "Team", "Raises", "PTO", "Hiring & Turnover"]);
  });
  it("uses formulas for team cost, raises, PTO balance and turnover", () => {
    const i = inspect();
    for (const s of ["Team", "Raises", "PTO", "Hiring & Turnover"]) expect(i.formulas[s]).toBeGreaterThan(4);
    for (const k of ["team_total_annual", "team_cost_per_hour", "raise_new_salary", "pto_balance", "turnover_per_leaver"]) expect(String(i.samples[k])).toMatch(/^=/);
  });
});
