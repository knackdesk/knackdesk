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
  out = mkdtempSync(join(tmpdir(), "akit-"));
  execFileSync(py, [builder, "--out", out], { stdio: "pipe" });
});

function inspect() {
  const script = `
import json, sys, openpyxl
wb = openpyxl.load_workbook(sys.argv[1])
info = {"sheets": wb.sheetnames, "formulas": {}, "samples": {}}
for ws in wb.worksheets:
    info["formulas"][ws.title] = sum(1 for row in ws.iter_rows() for c in row if isinstance(c.value, str) and c.value.startswith("="))
info["samples"]["rate_margin"] = wb["Rate Card"]["D5"].value
info["samples"]["quote_total"] = wb["Quote"]["B38"].value
info["samples"]["quote_blended"] = wb["Quote"]["B39"].value
info["samples"]["project_profit"] = wb["Projects"]["K5"].value
info["samples"]["summary_profit"] = wb["Summary"]["B5"].value
print(json.dumps(info))`;
  return JSON.parse(execFileSync(py, ["-c", script, join(out, "agency-quote-profit-tracker.xlsx")], { stdio: "pipe" }).toString());
}

describe("agency quote and profit tracker builder", () => {
  it("writes the xlsx, README and zip", () => {
    for (const f of ["agency-quote-profit-tracker.xlsx", "README.md", "agency-quote-profit-tracker.zip"]) expect(existsSync(join(out, f))).toBe(true);
  });
  it("has the six sheets in order", () => {
    expect(inspect().sheets).toEqual(["Start Here", "Settings", "Rate Card", "Quote", "Projects", "Summary"]);
  });
  it("uses formulas for rate margin, quote total, blended rate, project profit and summary", () => {
    const i = inspect();
    for (const s of ["Rate Card", "Quote", "Projects", "Summary"]) expect(i.formulas[s]).toBeGreaterThan(4);
    for (const k of ["rate_margin", "quote_total", "quote_blended", "project_profit", "summary_profit"]) expect(String(i.samples[k])).toMatch(/^=/);
  });
});
