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
const slug = "event-catering-quote-workbook";

// Cells checked for formulas:
// Quote!D9 menu event total, Quote!B38 servers needed, Quote!B50 price at target margin,
// Bar!E6 beer cost, Events!L5 first-row profit, Summary!B5 profit.
const CELLS = { quote_menu_total: ["Quote", "D9"], quote_servers: ["Quote", "B38"], quote_price: ["Quote", "B50"],
  bar_cost: ["Bar", "E6"], events_profit: ["Events", "L5"], summary_profit: ["Summary", "B5"] };

let out;
beforeAll(() => {
  out = mkdtempSync(join(tmpdir(), "eckit-"));
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
  return JSON.parse(execFileSync(py, ["-c", script, join(out, `${slug}.xlsx`), JSON.stringify(CELLS)], { stdio: "pipe" }).toString());
}

describe("event catering quote workbook builder", () => {
  it("writes the xlsx, README and zip", () => {
    for (const f of [`${slug}.xlsx`, "README.md", `${slug}.zip`]) expect(existsSync(join(out, f))).toBe(true);
  });
  it("has the six sheets in order", () => {
    expect(inspect().sheets).toEqual(["Start Here", "Settings", "Quote", "Bar", "Events", "Summary"]);
  });
  it("uses formulas for menu, staffing, price, bar, event profit and summary", () => {
    const i = inspect();
    for (const s of ["Quote", "Bar", "Events", "Summary"]) expect(i.formulas[s]).toBeGreaterThan(4);
    for (const k of Object.keys(CELLS)) expect(String(i.samples[k]), k).toMatch(/^=/);
  });
});
