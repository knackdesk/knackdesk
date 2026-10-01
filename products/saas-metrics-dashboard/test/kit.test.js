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
  out = mkdtempSync(join(tmpdir(), "skit-"));
  execFileSync(py, [builder, "--out", out], { stdio: "pipe" });
});

function inspect() {
  const script = `
import json, sys, openpyxl
wb = openpyxl.load_workbook(sys.argv[1])
info = {"sheets": wb.sheetnames, "formulas": {}, "samples": {}}
for ws in wb.worksheets:
    info["formulas"][ws.title] = sum(1 for row in ws.iter_rows() for c in row if isinstance(c.value, str) and c.value.startswith("="))
info["samples"]["plans_mrr_total"] = wb["Plans"]["E16"].value
info["samples"]["monthly_nrr"] = wb["Monthly Metrics"]["L5"].value
info["samples"]["ltv"] = wb["Unit Economics"]["B10"].value
info["samples"]["runway_months"] = wb["Runway"]["B7"].value
print(json.dumps(info))`;
  return JSON.parse(execFileSync(py, ["-c", script, join(out, "saas-metrics-dashboard.xlsx")], { stdio: "pipe" }).toString());
}

describe("saas metrics dashboard builder", () => {
  it("writes the xlsx, README and zip", () => {
    for (const f of ["saas-metrics-dashboard.xlsx", "README.md", "saas-metrics-dashboard.zip"]) expect(existsSync(join(out, f))).toBe(true);
  });
  it("has the five sheets in order", () => {
    expect(inspect().sheets).toEqual(["Start Here", "Plans", "Monthly Metrics", "Unit Economics", "Runway"]);
  });
  it("uses formulas for totals, NRR, LTV and runway", () => {
    const i = inspect();
    for (const s of ["Plans", "Monthly Metrics", "Unit Economics", "Runway"]) expect(i.formulas[s]).toBeGreaterThan(4);
    for (const k of ["plans_mrr_total", "monthly_nrr", "ltv", "runway_months"]) expect(String(i.samples[k])).toMatch(/^=/);
  });
});
