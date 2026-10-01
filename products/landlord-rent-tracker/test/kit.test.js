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
info["samples"]["rent_days_late"] = wb["Rent Log"]["G5"].value
info["samples"]["rent_outstanding"] = wb["Rent Log"]["H5"].value
info["samples"]["summary_yield"] = wb["Summary"]["H5"].value
print(json.dumps(info))`;
  return JSON.parse(execFileSync(py, ["-c", script, join(out, "landlord-rent-tracker.xlsx")], { stdio: "pipe" }).toString());
}

describe("landlord rent tracker builder", () => {
  it("writes the xlsx, README and zip", () => {
    for (const f of ["landlord-rent-tracker.xlsx", "README.md", "landlord-rent-tracker.zip"]) expect(existsSync(join(out, f))).toBe(true);
  });
  it("has the five sheets in order", () => {
    expect(inspect().sheets).toEqual(["Start Here", "Properties", "Rent Log", "Expenses", "Summary"]);
  });
  it("calculates days late, outstanding and yield with formulas referencing other sheets", () => {
    const i = inspect();
    for (const s of ["Rent Log", "Expenses", "Summary"]) expect(i.formulas[s]).toBeGreaterThan(5);
    expect(String(i.samples.rent_days_late)).toMatch(/^=/);
    expect(String(i.samples.rent_outstanding)).toMatch(/^=/);
    expect(String(i.samples.summary_yield)).toMatch(/^=.*Properties/);
  });
});
