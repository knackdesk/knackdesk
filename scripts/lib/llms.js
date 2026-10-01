const SITE = "https://knackdesk.com";

const SUMMARY =
  "Knackdesk makes small, single-purpose web tools and spreadsheet kits for freelancers, contractors and small businesses. " +
  "The tools cover invoicing and payment terms, rates and pricing, cash planning, time and pay, and rent and property. " +
  "They are free, run entirely in the browser, need no account and send nothing to a server. " +
  "Every formula is unit-tested. Results are arithmetic only, not legal, tax or financial advice.";

const price = (cents) => `$${(cents / 100).toFixed(0)}`;

function header() {
  return `# Knackdesk\n\n> ${SUMMARY}\n`;
}

function kitsSection(kits) {
  if (kits.length === 0) return "";
  const lines = kits.map(({ data }) => `- [${data.name}](${data.polar_url}): ${data.tagline} (${price(data.price_cents)}, one-time)`);
  return `\n## Kits\n\n${lines.join("\n")}\n`;
}

function categoriesSection(categories) {
  if (!categories || categories.length === 0) return "";
  return `\n## Categories\n\n${categories.map((c) => `- [${c.heading}](${SITE}${c.path})`).join("\n")}\n`;
}

function aboutSection() {
  return `\n## About\n\n- [About Knackdesk](${SITE}/about/): who makes the tools, how they are checked, and how to report an error\n- [Contact](${SITE}/contact/): hello@knackdesk.com\n`;
}

const toolLine = ({ data }) => `- [${data.name}](${SITE}/${data.slug}/): ${data.tagline}`;
const split = (items) => ({
  tools: items.filter(({ data }) => data.lane === "tool"),
  kits: items.filter(({ data }) => data.lane === "digital"),
});

export function renderLlmsTxt(items, categories = []) {
  const { tools, kits } = split(items);
  return `${header()}${categoriesSection(categories)}\n## Tools\n\n${tools.map(toolLine).join("\n")}\n${kitsSection(kits)}${aboutSection()}`;
}

export function renderLlmsFullTxt(items, details = {}, categories = []) {
  const { tools, kits } = split(items);
  const blocks = tools.map((item) => {
    const d = details[item.data.slug] || {};
    const extra = [d.definition, d.formula].filter(Boolean).map((l) => `  ${l}`);
    return [toolLine(item), ...extra].join("\n");
  });
  return `${header()}${categoriesSection(categories)}\n## Tools\n\n${blocks.join("\n")}\n${kitsSection(kits)}${aboutSection()}`;
}
