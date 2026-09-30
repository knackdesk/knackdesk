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
  out = mkdtempSync(join(tmpdir(), "pkit-"));
  execFileSync(py, [builder, "--out", out], { stdio: "pipe" });
});

function inspect() {
  const script = `
import json, sys, openpyxl
wb = openpyxl.load_workbook(sys.argv[1])
info = {"sheets": wb.sheetnames, "formulas": {}, "samples": {}}
for ws in wb.worksheets:
    info["formulas"][ws.title] = sum(1 for row in ws.iter_rows() for c in row if isinstance(c.value, str) and c.value.startswith("="))
info["samples"]["card_rush"] = wb["Rate Card"]["C5"].value
info["samples"]["quote_total"] = wb["Quote Builder"]["F24"].value
info["samples"]["retainer_fee"] = wb["Retainer"]["B8"].value
print(json.dumps(info))`;
  return JSON.parse(execFileSync(py, ["-c", script, join(out, "freelance-pricing-kit.xlsx")], { stdio: "pipe" }).toString());
}

describe("freelance pricing kit builder", () => {
  it("writes the xlsx, README and zip", () => {
    for (const f of ["freelance-pricing-kit.xlsx", "README.md", "freelance-pricing-kit.zip"]) expect(existsSync(join(out, f))).toBe(true);
  });
  it("has the six sheets in order", () => {
    expect(inspect().sheets).toEqual(["Start Here", "Rates", "Rate Card", "Quote Builder", "Retainer", "Revenue Plan"]);
  });
  it("uses formulas in every working sheet and references Rates from the card and quote", () => {
    const i = inspect();
    for (const s of ["Rates", "Rate Card", "Quote Builder", "Retainer", "Revenue Plan"]) expect(i.formulas[s]).toBeGreaterThan(3);
    expect(String(i.samples.card_rush)).toMatch(/^=.*Rates/);
    expect(String(i.samples.quote_total)).toMatch(/^=/);
    expect(String(i.samples.retainer_fee)).toMatch(/^=/);
  });
});
