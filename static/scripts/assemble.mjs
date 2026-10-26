import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticRoot = path.resolve(__dirname, "..");
const pagesRoot = path.join(staticRoot, "pages");
const partialsRoot = path.join(staticRoot, "partials");

const headerTemplate = fs.readFileSync(path.join(partialsRoot, "header.html"), "utf8");
const footerTemplate = fs.readFileSync(path.join(partialsRoot, "footer.html"), "utf8");

const year = String(new Date().getFullYear());

function extractTitle(body) {
  const match = body.match(/<!--\s*title:\s*(.+?)\s*-->/i);
  return match ? match[1].trim() : "ebma AI";
}

function stripTitleComment(body) {
  return body.replace(/<!--\s*title:\s*.+?\s*-->\s*/i, "").trim();
}

function replacePlaceholders(html, root) {
  const header = headerTemplate.replaceAll("{{ROOT}}", root);
  const footer = footerTemplate.replaceAll("{{ROOT}}", root).replaceAll("{{YEAR}}", year);
  return html
    .replaceAll("{{HEADER}}", header)
    .replaceAll("{{FOOTER}}", footer)
    .replaceAll("{{ROOT}}", root)
    .replaceAll("{{YEAR}}", year);
}

function wrapShell(title, body, root) {
  const content = replacePlaceholders(body, root);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${root}css/styles.css" />
  <link rel="icon" href="${root}assets/favicon.ico" />
</head>
<body style="--font-body: 'Inter', sans-serif; --font-display: 'Space Grotesk', sans-serif;">
<script src="${root}js/config.js"></script>
<script src="${root}js/api.js"></script>
${content}
<script src="${root}js/site.js"></script>
</body>
</html>
`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function assembleFile(relativePath, root, outRelative) {
  const srcPath = path.join(pagesRoot, relativePath);
  const raw = fs.readFileSync(srcPath, "utf8");
  const title = extractTitle(raw);
  const body = stripTitleComment(raw);
  const wrapped = wrapShell(title, body, root);
  const outPath = path.join(staticRoot, outRelative);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, wrapped, "utf8");
  console.log(`Wrote ${outRelative}`);
}

function collectHtmlFiles(dir, base = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectHtmlFiles(full, rel));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(rel.replace(/\\/g, "/"));
    }
  }
  return files;
}

const pageFiles = collectHtmlFiles(pagesRoot);

for (const rel of pageFiles) {
  const isProduct = rel.startsWith("products/");
  const root = isProduct ? "../" : "";
  const outRel = rel;
  assembleFile(rel, root, outRel);
}

console.log(`Assembled ${pageFiles.length} page(s).`);
