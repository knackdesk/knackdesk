export function requireEnv(names, source = process.env) {
  const missing = names.filter((n) => !source[n] || source[n].trim() === "");
  if (missing.length > 0) throw new Error(`Missing env: ${missing.join(", ")}`);
  return Object.fromEntries(names.map((n) => [n, source[n]]));
}

export async function loadDotEnv(path = ".env") {
  const fs = await import("node:fs");
  if (!fs.existsSync(path)) return;
  for (const line of fs.readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}
