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
  out = mkdtempSync(join(tmpdir(), "okit-"));
  execFileSync(py, [builder, "--out", out], { stdio: "pipe" });
});

function inspect() {
  const script = `
import json, sys, openpyxl
wb = openpyxl.load_workbook(sys.argv[1])
info = {"sheets": wb.sheetnames, "formulas": {}, "samples": {}}
for ws in wb.worksheets:
    info["formulas"][ws.title] = sum(1 for row in ws.iter_rows() for c in row if isinstance(c.value, str) and c.value.startswith("="))
o = wb["Orders"]
info["samples"]["order_fees"] = o["I5"].value
info["samples"]["order_profit"] = o["J5"].value
info["samples"]["summary_profit"] = wb["Summary"]["F5"].value
info["samples"]["ads_breakeven"] = wb["Ads"]["F5"].value
print(json.dumps(info))`;
  return JSON.parse(execFileSync(py, ["-c", script, join(out, "online-seller-profit-tracker.xlsx")], { stdio: "pipe" }).toString());
}

describe("online seller profit tracker builder", () => {
  it("writes the xlsx, README and zip", () => {
    for (const f of ["online-seller-profit-tracker.xlsx", "README.md", "online-seller-profit-tracker.zip"]) expect(existsSync(join(out, f))).toBe(true);
  });
  it("has the six sheets in order", () => {
    expect(inspect().sheets).toEqual(["Start Here", "Settings", "Products", "Orders", "Summary", "Ads"]);
  });
  it("calculates order fees and profit from Settings and Products, and summaries from Orders", () => {
    const i = inspect();
    for (const s of ["Orders", "Summary", "Ads"]) expect(i.formulas[s]).toBeGreaterThan(5);
    expect(String(i.samples.order_fees)).toMatch(/^=.*Settings/);
    expect(String(i.samples.order_profit)).toMatch(/^=/);
    expect(String(i.samples.summary_profit)).toMatch(/^=.*Orders/);
    expect(String(i.samples.ads_breakeven)).toMatch(/^=/);
  });
});
