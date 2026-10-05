import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const destination = path.join(root, "static/img/diagrams");
const manifestPath = path.join(root, "assets/diagrams/manifest.json");
const digest = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");
const check = process.argv.includes("--check");
const diagrams = new Map();
async function collect(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) await collect(filename);
    else if (/\.mdx?$/.test(filename)) {
      const text = await fs.readFile(filename, "utf8");
      for (const match of text.matchAll(
        /^```mermaid[^\S\n]*\n([\s\S]*?)^```[^\S\n]*$/gm,
      )) {
        const source = match[1].trim() + "\n";
        const title = source.match(/^\s*accTitle:\s*(.+)$/m)?.[1]?.trim();
        const description = source.match(/^\s*accDescr:\s*(.+)$/m)?.[1]?.trim();
        if (!title || !description)
          throw new Error(`${filename}: Mermaid needs accTitle and accDescr`);
        const id = digest(source).slice(0, 16);
        const previous = diagrams.get(id);
        diagrams.set(id, {
          id,
          source,
          title,
          description,
          pages: [...(previous?.pages || []), path.relative(root, filename)],
        });
      }
    }
  }
}
await collect(path.join(root, "docs"));
let previous = {};
try {
  previous = JSON.parse(await fs.readFile(manifestPath, "utf8"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
if (check) {
  if (
    JSON.stringify(Object.keys(previous).sort()) !==
    JSON.stringify([...diagrams.keys()].sort())
  )
    throw new Error("Mermaid inventory changed; run npm run diagrams:render");
  for (const [id, diagram] of diagrams) {
    const record = previous[id];
    if (
      record.sourceHash !== digest(diagram.source) ||
      record.title !== diagram.title ||
      record.description !== diagram.description
    )
      throw new Error(`${id}: stale diagram metadata`);
    if (
      (await fs.readFile(path.join(destination, id + ".mmd"), "utf8")) !==
      diagram.source
    )
      throw new Error(`${id}: stale Mermaid source asset`);
    for (const theme of ["light", "dark"]) {
      const svg = await fs.readFile(
        path.join(destination, `${id}-${theme}.svg`),
        "utf8",
      );
      if (digest(svg) !== record[theme].hash)
        throw new Error(`${id}: changed ${theme} SVG; regenerate`);
    }
  }
  console.log(
    `Verified ${diagrams.size} Mermaid diagrams and their SVG/source assets`,
  );
  process.exit(0);
}
await fs.mkdir(destination, { recursive: true });
const explicit = process.env.AUTHCRUNCH_DIAGRAM_BROWSER;
const options = { headless: true };
if (explicit) options.executablePath = explicit;
else if (process.platform === "darwin")
  options.executablePath =
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
else options.channel = "chrome";
const browser = await chromium.launch(options);
const manifest = {};
try {
  const page = await browser.newPage({
    viewport: { width: 1600, height: 1000 },
  });
  await page.setContent(
    '<!doctype html><html lang="en"><head><meta charset="utf-8"></head><body></body></html>',
  );
  await page.addScriptTag({
    path: path.join(root, "node_modules/mermaid/dist/mermaid.min.js"),
  });
  for (const [id, diagram] of [...diagrams].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    const record = {
      sourceHash: digest(diagram.source),
      title: diagram.title,
      description: diagram.description,
      pages: diagram.pages,
    };
    for (const theme of ["light", "dark"]) {
      const rendered = await page.evaluate(
        async ({ id, source, theme }) => {
          const dark = theme === "dark";
          const ink = dark ? "#eef2f8" : "#172b4d",
            muted = dark ? "#bdcbe0" : "#52627a";
          const surface = dark ? "#17253b" : "#f1f5fc",
            accent = dark ? "#94b9ff" : "#245bca";
          document.body.replaceChildren();
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: "strict",
            theme: "base",
            htmlLabels: false,
            deterministicIds: true,
            deterministicIDSeed: id + "-" + theme,
            fontFamily: "Arial, sans-serif",
            fontSize: 16,
            themeVariables: {
              darkMode: dark,
              dropShadow: "none",
              background: dark ? "#101c2e" : "#ffffff",
              primaryColor: surface,
              primaryTextColor: ink,
              primaryBorderColor: accent,
              secondaryColor: surface,
              tertiaryColor: surface,
              lineColor: muted,
              textColor: ink,
              actorBkg: surface,
              actorBorder: accent,
              actorTextColor: ink,
              actorLineColor: muted,
              signalColor: ink,
              signalTextColor: ink,
              labelBoxBkgColor: surface,
              labelBoxBorderColor: accent,
              labelTextColor: ink,
              loopTextColor: ink,
              noteBkgColor: surface,
              noteBorderColor: muted,
              noteTextColor: ink,
            },
            flowchart: {
              htmlLabels: false,
              curve: "linear",
              nodeSpacing: 28,
              rankSpacing: 36,
            },
            sequence: {
              useMaxWidth: true,
              wrap: true,
              actorMargin: 32,
              width: 145,
              height: 50,
              messageMargin: 30,
              noteMargin: 12,
              diagramMarginX: 16,
              diagramMarginY: 16,
            },
          });
          const { svg } = await mermaid.render(
            "diagram-" + id + "-" + theme,
            source,
          );
          const parsed = new DOMParser().parseFromString(svg, "image/svg+xml");
          const element = parsed.documentElement;
          const [, , width, height] = element
            .getAttribute("viewBox")
            .split(/\s+/)
            .map(Number);
          return { svg, width: Math.ceil(width), height: Math.ceil(height) };
        },
        { id, source: diagram.source, theme },
      );
      if (
        /<script\b|(?:href|src)=["'](?:https?:|javascript:)|\son\w+=["']/i.test(
          rendered.svg,
        )
      )
        throw new Error(`${id}: external/active SVG content is not permitted`);
      await fs.writeFile(
        path.join(destination, `${id}-${theme}.svg`),
        rendered.svg + "\n",
      );
      record[theme] = {
        width: rendered.width,
        height: rendered.height,
        hash: digest(rendered.svg + "\n"),
      };
    }
    await fs.writeFile(path.join(destination, id + ".mmd"), diagram.source);
    manifest[id] = record;
  }
} finally {
  await browser.close();
}
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
for (const id of Object.keys(previous).filter((id) => !diagrams.has(id)))
  for (const suffix of ["-light.svg", "-dark.svg", ".mmd"])
    await fs.rm(path.join(destination, id + suffix), { force: true });
console.log(
  `Rendered ${diagrams.size} Mermaid diagrams in light and dark themes`,
);
