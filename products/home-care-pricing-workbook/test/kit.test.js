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
const slug = "home-care-pricing-workbook";
const SHEETS = ["Start Here", "Settings", "Service Rates", "Caregivers", "Clients & Quotes", "Capacity & Turnover", "Summary"];

// Cells checked for formulas:
// 'Service Rates'!O5 bill rate at margin, Caregivers!K5 utilization %, 'Clients & Quotes'!Q5 weekly total,
// 'Capacity & Turnover'!B9 spare hours, 'Capacity & Turnover'!O16 turnover cost, Summary!B2 cost per billable hour.
const CELLS = { service_bill_rate: ["Service Rates", "O5"], caregiver_utilization: ["Caregivers", "K5"],
  client_weekly_total: ["Clients & Quotes", "Q5"], spare_hours: ["Capacity & Turnover", "B9"],
  turnover_cost: ["Capacity & Turnover", "O16"], summary_cost_per_hour: ["Summary", "B2"] };
// The client bill rate must look up the service level on Service Rates and fall back to the Settings default.
const EXTRA = { client_bill_rate: ["Clients & Quotes", "K5"] };

let out;
beforeAll(() => {
  out = mkdtempSync(join(tmpdir(), "homecarekit-"));
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
  return JSON.parse(execFileSync(py, ["-c", script, join(out, `${slug}.xlsx`), JSON.stringify({ ...CELLS, ...EXTRA })], { stdio: "pipe" }).toString());
}

describe("Home care agency pricing workbook builder", () => {
  it("writes the xlsx, README and zip", () => {
    for (const f of [`${slug}.xlsx`, "README.md", `${slug}.zip`]) expect(existsSync(join(out, f))).toBe(true);
  });
  it("has the seven sheets in order", () => {
    expect(inspect().sheets).toEqual(SHEETS);
  });
  it("uses formulas for settings, service rates, caregivers, clients, capacity and summary", () => {
    const i = inspect();
    for (const s of SHEETS.slice(1)) expect(i.formulas[s], s).toBeGreaterThan(4);
    for (const k of Object.keys(CELLS)) expect(String(i.samples[k]), k).toMatch(/^=/);
  });
  it("prices each client from Service Rates with the Settings default bill rate as fallback", () => {
    const f = String(inspect().samples.client_bill_rate);
    expect(f).toContain("'Service Rates'!");
    expect(f).toContain("Settings!$B$");
  });
});
