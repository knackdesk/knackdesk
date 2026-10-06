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
const slug = "msp-contract-pricing-workbook";

// Cells checked for formulas:
// Contracts!O5 margin %, Contracts!R5 price per user at target margin, Tickets!K5 cost per ticket,
// 'Blocks & Onboarding'!N5 block price, 'Blocks & Onboarding'!L20 onboarding fee, Summary!B2 loaded hourly cost.
const CELLS = { contract_margin: ["Contracts", "O5"], contract_target_price: ["Contracts", "R5"],
  ticket_cost: ["Tickets", "K5"], block_price: ["Blocks & Onboarding", "N5"],
  onboarding_fee: ["Blocks & Onboarding", "L20"], summary_rate: ["Summary", "B2"] };
// Shared tool allocation must read the per-unit tool cost row, not the total or fixed row.
const EXTRA = { unit_label: ["Tool Stack", "A29"], allocation: ["Contracts", "K5"] };

let out;
beforeAll(() => {
  out = mkdtempSync(join(tmpdir(), "mspkit-"));
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

describe("MSP contract pricing workbook builder", () => {
  it("writes the xlsx, README and zip", () => {
    for (const f of [`${slug}.xlsx`, "README.md", `${slug}.zip`]) expect(existsSync(join(out, f))).toBe(true);
  });
  it("has the seven sheets in order", () => {
    expect(inspect().sheets).toEqual(["Start Here", "Settings", "Tool Stack", "Contracts", "Tickets", "Blocks & Onboarding", "Summary"]);
  });
  it("uses formulas for settings, tools, contracts, tickets, blocks, onboarding and summary", () => {
    const i = inspect();
    for (const s of ["Settings", "Tool Stack", "Contracts", "Tickets", "Blocks & Onboarding", "Summary"]) expect(i.formulas[s]).toBeGreaterThan(4);
    for (const k of Object.keys(CELLS)) expect(String(i.samples[k]), k).toMatch(/^=/);
  });
  it("allocates shared tools from the per-unit tool cost row", () => {
    const i = inspect();
    expect(i.samples.unit_label).toBe("Per-unit tool cost per month");
    expect(i.samples.allocation).toContain("'Tool Stack'!$B$29");
  });
});
