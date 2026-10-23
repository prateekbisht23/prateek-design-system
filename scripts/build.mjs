// Generates tokens/tokens.css and site/tokens.data.js from tokens/tokens.json.
// tokens.json is the single source of truth. No dependencies: `node scripts/build.mjs`.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(readFileSync(join(root, 'tokens/tokens.json'), 'utf8'));

const themes = tokens.color.themes.map((t) => t.id);
const [first, ...rest] = themes;
const cssVal = (v) => (/^\{.+\}$/.test(v) ? `var(--${v.slice(1, -1)})` : v);
const pick = (value, theme) => (typeof value === 'string' ? value : value[theme] ?? value[first]);

function themed(theme, onlyChanged) {
  const lines = [];
  for (const fam of ['color', 'shadow']) {
    for (const t of tokens[fam]?.tokens ?? []) {
      const v = pick(t.value, theme);
      if (onlyChanged && typeof t.value === 'string' && !/^\{/.test(t.value)) continue;
      lines.push(`  --${t.name}: ${cssVal(v)};`);
    }
  }
  return lines.join('\n');
}

const statics = [];
for (const [fam, list] of Object.entries(tokens)) {
  if (['color', 'shadow', 'type', 'name', 'version'].includes(fam) || !list?.tokens) continue;
  for (const t of list.tokens) statics.push(`  --${t.name}: ${t.value};`);
}
for (const [k, v] of Object.entries(tokens.type.families)) statics.push(`  --font-${k}: ${v};`);

const styleClasses = [];
for (const g of tokens.type.groups) {
  for (const s of g.styles) {
    const fam = s.family ?? g.family;
    styleClasses.push(
      `.t-${s.name} { font-family: var(--font-${fam}); font-size: ${s.fontSize}; line-height: ${s.lineHeight}; font-weight: ${s.fontWeight};` +
        (s.letterSpacing ? ` letter-spacing: ${s.letterSpacing};` : '') + ' }'
    );
  }
}

let css = `/* ${tokens.name} — generated from tokens/tokens.json by scripts/build.mjs. Do not edit by hand. */\n\n`;
css += `:root {\n  color-scheme: light;\n${themed(first)}\n${statics.join('\n')}\n}\n\n`;
for (const theme of rest) {
  const block = `${themed(theme, true)}\n  color-scheme: ${theme};`;
  css += `@media (prefers-color-scheme: ${theme}) {\n  :root:not([data-theme="${first}"]) {\n${block.replace(/^/gm, '  ')}\n  }\n}\n\n`;
  css += `:root[data-theme="${theme}"] {\n${block}\n}\n\n`;
}
css += styleClasses.join('\n') + '\n';

writeFileSync(join(root, 'tokens/tokens.css'), css);
writeFileSync(
  join(root, 'site/tokens.data.js'),
  `/* generated from tokens/tokens.json by scripts/build.mjs */\nwindow.PK_TOKENS = ${JSON.stringify(tokens, null, 2)};\n`
);
// Components: one source, two outputs (classic script for plain HTML, ES module for bundlers).
const compSrc = readFileSync(join(root, 'components/src/components.js'), 'utf8');
const names = /^\s*var api = \{([^}]*)\}/m.exec(compSrc)[1].split(',').map((p) => p.split(':')[0].trim());
const header = `/* @ds-bundle: ${JSON.stringify({ format: 4, namespace: 'Prateek', components: names.map((name) => ({ name })) })} */`;
writeFileSync(
  join(root, 'components/bundle.js'),
  `${header}\n/* generated from components/src/components.js by scripts/build.mjs */\n(function () {\n${compSrc}\n  var api = createPrateek(window.React);\n  window.Prateek = window.Prateek || {};\n  for (var n in api) window.Prateek[n] = api[n];\n})();\n`
);
writeFileSync(
  join(root, 'components/index.mjs'),
  `'use client';\n/* generated from components/src/components.js by scripts/build.mjs */\nimport * as React from 'react';\n\n${compSrc}\nconst api = createPrateek(React);\nexport const { ${names.join(', ')} } = api;\nexport default api;\n`
);

// Guidelines for the web view: DESIGN.md and every components/<Name>/README.md.
import { readdirSync, existsSync } from 'node:fs';
const docs = { design: readFileSync(join(root, 'DESIGN.md'), 'utf8'), components: {} };
for (const name of readdirSync(join(root, 'components'))) {
  const p = join(root, 'components', name, 'README.md');
  if (existsSync(p)) docs.components[name] = readFileSync(p, 'utf8');
}
writeFileSync(
  join(root, 'site/docs.data.js'),
  `/* generated from DESIGN.md and components/<name>/README.md by scripts/build.mjs */\nwindow.PK_DOCS = ${JSON.stringify(docs, null, 2)};\n`
);

console.log('wrote tokens/tokens.css, site/tokens.data.js, site/docs.data.js');
