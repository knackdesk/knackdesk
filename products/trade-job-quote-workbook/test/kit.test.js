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
  out = mkdtempSync(join(tmpdir(), "tjkit-"));
  execFileSync(py, [builder, "--out", out], { stdio: "pipe" });
});

function inspect() {
  const script = `
import json, sys, openpyxl
wb = openpyxl.load_workbook(sys.argv[1])
info = {"sheets": wb.sheetnames, "formulas": {}, "samples": {}}
for ws in wb.worksheets:
    info["formulas"][ws.title] = sum(1 for row in ws.iter_rows() for c in row if isinstance(c.value, str) and c.value.startswith("="))
info["samples"]["quote_price"] = wb["Quote"]["B49"].value
info["samples"]["change_price"] = wb["Change Orders"]["J5"].value
info["samples"]["revised_total"] = wb["Change Orders"]["K6"].value
info["samples"]["job_profit"] = wb["Jobs"]["N5"].value
info["samples"]["summary_profit"] = wb["Summary"]["B5"].value
print(json.dumps(info))`;
  return JSON.parse(execFileSync(py, ["-c", script, join(out, "trade-job-quote-workbook.xlsx")], { stdio: "pipe" }).toString());
}

describe("trade job quote workbook builder", () => {
  it("writes the xlsx, README and zip", () => {
    for (const f of ["trade-job-quote-workbook.xlsx", "README.md", "trade-job-quote-workbook.zip"]) expect(existsSync(join(out, f))).toBe(true);
  });
  it("has the six sheets in order", () => {
    expect(inspect().sheets).toEqual(["Start Here", "Settings", "Quote", "Change Orders", "Jobs", "Summary"]);
  });
  it("uses formulas for the quote price, change prices, revised totals, job profit and summary", () => {
    const i = inspect();
    for (const s of ["Quote", "Change Orders", "Jobs", "Summary"]) expect(i.formulas[s]).toBeGreaterThan(4);
    for (const k of ["quote_price", "change_price", "revised_total", "job_profit", "summary_profit"]) expect(String(i.samples[k])).toMatch(/^=/);
  });
});
