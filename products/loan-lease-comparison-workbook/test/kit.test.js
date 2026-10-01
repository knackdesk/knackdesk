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
  out = mkdtempSync(join(tmpdir(), "lkit-"));
  execFileSync(py, [builder, "--out", out], { stdio: "pipe" });
});

function inspect() {
  const script = `
import json, sys, openpyxl
wb = openpyxl.load_workbook(sys.argv[1])
info = {"sheets": wb.sheetnames, "formulas": {}, "samples": {}}
for ws in wb.worksheets:
    info["formulas"][ws.title] = sum(1 for row in ws.iter_rows() for c in row if isinstance(c.value, str) and c.value.startswith("="))
info["samples"]["apr"] = wb["Loan Compare"]["B14"].value
info["samples"]["rank"] = wb["Loan Compare"]["B16"].value
info["samples"]["schedule_payment"] = wb["Schedule"]["D14"].value
info["samples"]["interest_saved"] = wb["Schedule"]["B12"].value
info["samples"]["buy_total"] = wb["Lease vs Buy"]["B12"].value
info["samples"]["dscr"] = wb["DSCR"]["B5"].value
print(json.dumps(info))`;
  return JSON.parse(execFileSync(py, ["-c", script, join(out, "loan-lease-comparison-workbook.xlsx")], { stdio: "pipe" }).toString());
}

describe("loan and lease comparison workbook builder", () => {
  it("writes the xlsx, README and zip", () => {
    for (const f of ["loan-lease-comparison-workbook.xlsx", "README.md", "loan-lease-comparison-workbook.zip"]) expect(existsSync(join(out, f))).toBe(true);
  });
  it("has the five sheets in order", () => {
    expect(inspect().sheets).toEqual(["Start Here", "Loan Compare", "Schedule", "Lease vs Buy", "DSCR"]);
  });
  it("uses formulas for APR, ranking, schedule payments, interest saved, buy total and DSCR", () => {
    const i = inspect();
    for (const s of ["Loan Compare", "Schedule", "Lease vs Buy", "DSCR"]) expect(i.formulas[s]).toBeGreaterThan(4);
    expect(i.formulas["Schedule"]).toBeGreaterThan(2000);
    for (const k of ["apr", "rank", "schedule_payment", "interest_saved", "buy_total", "dscr"]) expect(String(i.samples[k])).toMatch(/^=/);
  });
});
