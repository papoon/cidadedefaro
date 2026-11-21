#!/usr/bin/env node
// check-site.mjs — Verificações de consistência do site (sem dependências).
//
// Erros (falham o CI):
//   - chaves presentes só em pt.json ou só em en.json
//   - chaves data-i18n / data-i18n2 usadas em HTML que não existem nos JSON
//   - páginas em htmlPages (vite.config.js) sem entrada em sitemap.xml, sem link na
//     navegação/rodapé, ou fora do precache de sw.js
// Avisos (não falham):
//   - valores idênticos em PT e EN (possível tradução esquecida)
//
// Uso: node scripts/check-site.mjs [--warnings]   (--warnings lista os avisos um a um)

import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(resolve(ROOT, p), 'utf8');

const errors = [];
const warnings = [];

// Páginas que, de propósito, não aparecem em todos os sítios.
// favoritos.html é pessoal (localStorage) e não tem valor para indexação.
const NOT_IN_SITEMAP = new Set(['offline.html', 'demo-alertas.html', 'favoritos.html']);
const NOT_IN_NAV = new Set(['offline.html', 'demo-alertas.html']);
// index.html e offline.html estão em PRECACHE_URLS; páginas legais não precisam de offline.
const NOT_IN_SW = new Set(['politica-privacidade.html', 'termos-condicoes.html', 'declaracao-acessibilidade.html']);

// Valores que são legitimamente iguais em PT e EN (nomes próprios, siglas, números, etc.).
const SAME_VALUE_OK = /^[\d\s+()€.,:%/–-]*$|^(Faro Formoso|Email|E-mail|SNS 24|112|OK|Wi-Fi|PWA|GitHub|OpenStreetMap|Leaflet)$/i;

// ---------- i18n ----------
function flatten(obj, prefix = '', out = new Map()) {
    for (const [k, v] of Object.entries(obj)) {
        const key = prefix ? `${prefix}.${k}` : k;
        if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
        else out.set(key, v);
    }
    return out;
}

const pt = flatten(JSON.parse(read('assets/lang/pt.json')));
const en = flatten(JSON.parse(read('assets/lang/en.json')));

for (const key of pt.keys()) if (!en.has(key)) errors.push(`i18n: "${key}" existe em pt.json mas não em en.json`);
for (const key of en.keys()) if (!pt.has(key)) errors.push(`i18n: "${key}" existe em en.json mas não em pt.json`);

for (const [key, value] of pt) {
    if (typeof value !== 'string' || en.get(key) !== value) continue;
    if (value.trim().length < 4 || SAME_VALUE_OK.test(value.trim())) continue;
    warnings.push(`i18n: "${key}" tem o mesmo valor em PT e EN ("${value.slice(0, 60)}")`);
}

const htmlFiles = [
    ...readdirSync(ROOT).filter((f) => f.endsWith('.html')),
    ...readdirSync(resolve(ROOT, 'src/partials')).filter((f) => f.endsWith('.html')).map((f) => `src/partials/${f}`)
];

const usedKeys = new Map(); // key -> ficheiro onde foi visto
for (const file of htmlFiles) {
    const html = read(file);
    for (const m of html.matchAll(/data-i18n2?="([^"]+)"/g)) {
        if (!usedKeys.has(m[1])) usedKeys.set(m[1], file);
    }
}
for (const [key, file] of usedKeys) {
    if (!pt.has(key)) errors.push(`i18n: "${key}" usado em ${file} mas não existe em pt.json`);
    if (!en.has(key)) errors.push(`i18n: "${key}" usado em ${file} mas não existe em en.json`);
}

// ---------- páginas ----------
const viteConfig = read('vite.config.js');
const pagesBlock = viteConfig.match(/const htmlPages\s*=\s*\[([\s\S]*?)\]/);
if (!pagesBlock) {
    errors.push('vite.config.js: não foi possível encontrar o array htmlPages');
} else {
    const pages = [...pagesBlock[1].matchAll(/'([^']+\.html)'/g)].map((m) => m[1]);
    const rootHtml = readdirSync(ROOT).filter((f) => f.endsWith('.html'));

    for (const f of rootHtml) {
        if (!pages.includes(f)) errors.push(`vite.config.js: ${f} existe na raiz mas não está em htmlPages (não vai ser construída)`);
    }

    const sitemap = read('sitemap.xml');
    const chrome = read('src/partials/navigation.html') + read('src/partials/footer.html');
    const sw = read('sw.js');

    for (const page of pages) {
        if (page === 'index.html') continue;
        if (!NOT_IN_SITEMAP.has(page) && !sitemap.includes(`/${page}</loc>`)) {
            errors.push(`sitemap.xml: falta a página ${page}`);
        }
        if (!NOT_IN_NAV.has(page) && !chrome.includes(`href="${page}"`)) {
            errors.push(`navegação: ${page} não tem link em src/partials/navigation.html nem footer.html`);
        }
        if (!NOT_IN_SW.has(page) && !sw.includes(`'./${page}'`)) {
            errors.push(`sw.js: ${page} não está em PRECACHE_URLS/HTML_PAGES (não funciona offline)`);
        }
    }
}

// ---------- resultado ----------
const showWarnings = process.argv.includes('--warnings');
if (showWarnings) for (const w of warnings) console.warn(`⚠️  ${w}`);
else if (warnings.length) console.warn(`⚠️  ${warnings.length} aviso(s) — correr com --warnings para os listar.`);
for (const e of errors) console.error(`❌ ${e}`);
console.log(`\n${errors.length} erro(s), ${warnings.length} aviso(s).`);
process.exit(errors.length ? 1 : 0);
