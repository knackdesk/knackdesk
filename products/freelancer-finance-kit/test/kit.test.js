import { describe, it, expect, beforeAll } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdtempSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..", "..");
const py = join(root, ".venv", "bin", "python");
const builder = join(here, "..", "src", "build_kit.py");

let out;
beforeAll(() => {
  out = mkdtempSync(join(tmpdir(), "kit-"));
  execFileSync(py, [builder, "--out", out], { stdio: "pipe" });
});

function inspect() {
  const script = `
import json, sys, openpyxl
wb = openpyxl.load_workbook(sys.argv[1])
info = {"sheets": wb.sheetnames, "formulas": {}, "samples": {}}
for ws in wb.worksheets:
    n = 0
    for row in ws.iter_rows():
        for c in row:
            if isinstance(c.value, str) and c.value.startswith("="): n += 1
    info["formulas"][ws.title] = n
inv = wb["Invoices"]
info["samples"]["inv_due"] = inv["F5"].value
info["samples"]["inv_fee"] = inv["I5"].value
info["samples"]["settings_rate"] = wb["Settings"]["B4"].value
print(json.dumps(info))`;
  return JSON.parse(execFileSync(py, ["-c", script, join(out, "freelancer-finance-kit.xlsx")], { stdio: "pipe" }).toString());
}

describe("freelancer finance kit builder", () => {
  it("writes the xlsx, a README and a zip containing both", () => {
    expect(existsSync(join(out, "freelancer-finance-kit.xlsx"))).toBe(true);
    expect(existsSync(join(out, "README.md"))).toBe(true);
    expect(existsSync(join(out, "freelancer-finance-kit.zip"))).toBe(true);
    const list = execFileSync("unzip", ["-l", join(out, "freelancer-finance-kit.zip")]).toString();
    expect(list).toContain("freelancer-finance-kit.xlsx");
    expect(list).toContain("README.md");
  });
  it("has the seven sheets in order", () => {
    expect(inspect().sheets).toEqual(["Start Here", "Settings", "Invoices", "Rate Calculator", "Payment Schedule", "Expenses", "Summary"]);
  });
  it("uses formulas, not hardcoded results, in every working sheet", () => {
    const f = inspect().formulas;
    for (const s of ["Invoices", "Rate Calculator", "Payment Schedule", "Expenses", "Summary"]) expect(f[s]).toBeGreaterThan(5);
  });
  it("invoice due date and late fee are formulas referencing Settings", () => {
    const s = inspect().samples;
    expect(String(s.inv_due)).toMatch(/^=/);
    expect(String(s.inv_fee)).toMatch(/^=.*Settings/);
    expect(typeof s.settings_rate).toBe("number");
  });
});
