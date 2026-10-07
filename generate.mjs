// Profil README'si (Türkçe + İngilizce) ve SVG görselleri üretir.
// Kullanım: node generate.mjs
//   → README.md (TR), README.en.md (EN), assets/*.svg (ortak), assets/tr/*.svg, assets/en/*.svg
// Her görselin açık ve koyu tema sürümü vardır. Metinleri değiştirmek için yalnızca DATA bölümünü düzenle.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const USER = 'emrebayrakk';
const SITE = 'https://emrebayrak.com.tr';

// ------------------------------------------------------------------ DATA

const SHARED = {
  name: 'Emre Bayrak',
  prompt: 'dotnet run --profile',
  links: [
    { id: 'web', label: 'emrebayrak.com.tr', href: SITE, icon: 'globe' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/eemmrree/', icon: 'linkedin' },
    { id: 'instagram', label: 'dev.emrebayrak', href: 'https://www.instagram.com/dev.emrebayrak/', icon: 'instagram' }
  ],
  // Soğan katmanları dıştan içe; çipler iki dilde aynı.
  layerChips: [
    ['React', 'Angular', 'Blazor', 'ASP.NET Web API', 'TypeScript'],
    ['EF Core', 'Dapper', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'RabbitMQ', 'Elasticsearch', 'Docker'],
    ['Use cases', 'FluentValidation', 'JWT', 'Hangfire', 'Caching'],
    ['C#', 'Java', 'Go', 'DDD', 'SOLID', 'Design patterns']
  ],
  layerNames: ['PRESENTATION', 'INFRASTRUCTURE', 'APPLICATION', 'DOMAIN'],
  projects: [
    { repo: 'x-instagram-automation', chips: ['JavaScript', 'Chrome MV3', 'Electron'] },
    { repo: 'EMaster', chips: ['.NET', 'React', 'Clean Arch.'] },
    { repo: 'VehiclesControl', chips: ['C#', 'RabbitMQ', 'Blazor'] },
    { repo: 'ElasticSearchDotnetMinimalAPI', chips: ['.NET', 'Elasticsearch', 'Docker'] },
    { repo: 'FinTrack', chips: ['Blazor', 'C#', 'REST'] },
    { repo: 'SystemInfoTool', chips: ['Go', 'CLI', 'Windows'] }
  ]
};

const LANG = {
  tr: {
    file: 'README.md',
    tagline: '.NET yazılım geliştirici — temiz mimari, dağıtık sistemler ve ben uyurken çalışan araçlar.',
    meta: ['konum: localhost', 'odak: backend · full-stack', 'github: 2021\'den beri'],
    layerNotes: ['arayüz & API', 'veri & mesajlaşma', 'iş akışları', 'çekirdek'],
    core: 'bağımlılıklar içeri doğru akar',
    sections: { now: 'şu an', stack: 'katmanlar', projects: 'projeler', activity: 'aktivite' },
    now: [
      ['building', '[x-instagram-automation](https://github.com/emrebayrakk/x-instagram-automation) — X & Instagram için Chrome eklentisi, görev sırası'],
      ['learning', 'Elasticsearch, RabbitMQ ve dağıtık sistemler'],
      ['into', 'Clean Architecture, microservices, performans'],
      ['offline', 'kitap 📚 · oyun 🎮']
    ],
    stackNote: 'Teknolojilerimi Clean Architecture\'ı düşündüğüm gibi diziyorum: çekirdekte dil ve tasarım ilkeleri, dışa doğru altyapı ve arayüz.',
    stackAlt: 'Teknolojiler, Clean Architecture katmanları olarak: Domain, Application, Infrastructure, Presentation',
    descs: {
      'x-instagram-automation': ['X ve Instagram için Chrome eklentisi:', 'filtreli takip, beğeni, görev sırası.'],
      EMaster: ['Clean Architecture ile gelir-gider takibi;', '.NET Web API + React arayüz.'],
      VehiclesControl: ['Şablon proje: EF Core + Dapper, RabbitMQ,', 'JWT, Hangfire, Blazor ve testler.'],
      ElasticSearchDotnetMinimalAPI: ['Minimal API ile Elasticsearch ve Kibana,', 'Docker üzerinde.'],
      FinTrack: ['Borsa İstanbul verilerini Bigpara API', 'üzerinden gösteren Blazor uygulaması.'],
      SystemInfoTool: ['Sistem bilgisi, kapanma zamanlayıcı ve', 'kaynak kullanımı için Go aracı.']
    },
    allRepos: 'tüm repolar →',
    statsAlt: 'GitHub istatistikleri', langsAlt: 'En çok kullanılan diller', snakeAlt: 'Katkı grafiği yılanı',
    statsLocale: 'tr',
    footer: '// uğradığın için teşekkürler — emrebayrak.com.tr'
  },
  en: {
    file: 'README.en.md',
    tagline: '.NET developer — clean architecture, distributed systems and tools that run while I sleep.',
    meta: ['location: localhost', 'focus: backend · full-stack', 'github: since 2021'],
    layerNotes: ['UI & API', 'data & messaging', 'workflows', 'core'],
    core: 'dependencies point inward',
    sections: { now: 'now', stack: 'layers', projects: 'projects', activity: 'activity' },
    now: [
      ['building', '[x-instagram-automation](https://github.com/emrebayrakk/x-instagram-automation) — Chrome extension for X & Instagram with a task queue'],
      ['learning', 'Elasticsearch, RabbitMQ and distributed systems'],
      ['into', 'Clean Architecture, microservices, performance'],
      ['offline', 'books 📚 · games 🎮']
    ],
    stackNote: 'I lay out my stack the way I think about Clean Architecture: language and design principles at the core, infrastructure and UI towards the edges.',
    stackAlt: 'Tech stack as Clean Architecture layers: Domain, Application, Infrastructure, Presentation',
    descs: {
      'x-instagram-automation': ['Chrome extension for X and Instagram:', 'filtered follow, likes, task queue.'],
      EMaster: ['Income & expense tracker with Clean', 'Architecture; .NET Web API + React UI.'],
      VehiclesControl: ['Template: EF Core + Dapper, RabbitMQ,', 'JWT, Hangfire, Blazor and tests.'],
      ElasticSearchDotnetMinimalAPI: ['Minimal API with Elasticsearch and', 'Kibana, running on Docker.'],
      FinTrack: ['Blazor app showing Borsa Istanbul', 'market data via the Bigpara API.'],
      SystemInfoTool: ['Go tool for system info, a shutdown', 'timer and resource usage.']
    },
    allRepos: 'all repositories →',
    statsAlt: 'GitHub stats', langsAlt: 'Most used languages', snakeAlt: 'Contribution snake',
    statsLocale: 'en',
    footer: '// thanks for stopping by — emrebayrak.com.tr'
  }
};

// Dil geçişi bağlantıları: Türkçe sürüm profil sayfasında görünür, İngilizce sürüm dosya olarak açılır.
const LANG_URL = { tr: `https://github.com/${USER}`, en: `https://github.com/${USER}/${USER}/blob/main/README.en.md` };

// ------------------------------------------------------------------ tema

const THEMES = {
  dark: {
    text: '#e6edf3', muted: '#8b949e', faint: '#6e7681', line: '#30363d', card: '#161b22', chipBg: '#0d1117',
    accent: '#a78bfa', onAccent: '#0d1117', accent2: '#f0b429', ring: '#a78bfa', ringAlpha: [0.03, 0.05, 0.08, 0.13]
  },
  light: {
    text: '#1f2328', muted: '#59636e', faint: '#818b98', line: '#d0d7de', card: '#f6f8fa', chipBg: '#ffffff',
    accent: '#6d28d9', onAccent: '#ffffff', accent2: '#b7791f', ring: '#6d28d9', ringAlpha: [0.025, 0.045, 0.07, 0.11]
  }
};

const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans',Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono',monospace";
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Kaba metin genişliği tahmini (SVG'de ölçüm yok).
const sansW = (s, size) => [...s].reduce((w, c) => w + (/[A-ZÇĞİÖŞÜMW]/.test(c) ? 0.66 : /[ilıj.,'·|]/.test(c) ? 0.3 : c === ' ' ? 0.3 : 0.56), 0) * size;
const monoW = (s, size, spacing = 0) => [...s].length * (size * 0.6 + spacing);

const svg = (w, h, body, extraCss = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">
<style>
.sans{font-family:${SANS}}.mono{font-family:${MONO}}
${extraCss}
@media (prefers-reduced-motion: reduce){*{animation:none!important}}
</style>
${body}
</svg>
`;

function chip(x, y, label, t, { h = 26, size = 13, fill = t.card } = {}) {
  const w = Math.round(sansW(label, size) + 24);
  return {
    w,
    el: `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${t.line}"/>` +
      `<text x="${x + w / 2}" y="${y + h / 2 + size * 0.35}" text-anchor="middle" class="sans" font-size="${size}" fill="${t.text}">${esc(label)}</text></g>`
  };
}

// ------------------------------------------------------------------ başlık

function header(L, t) {
  const W = 1000, H = 290;
  const prompt = '~/emre';
  const py = 46;
  const cursorX = monoW(prompt + ' ', 15) + monoW('▸ ', 15) + monoW(SHARED.prompt, 15) + 4;
  // Sağdaki amblem: aşağıdaki katman diyagramının küçük hali (iç içe dört kare).
  const ex = 836, ey = 26, es = 150;
  const rings = [0, 1, 2, 3].map((i) => {
    const inset = i * 19;
    const s = es - inset * 2;
    return `<rect x="${ex + inset}" y="${ey + inset}" width="${s}" height="${s}" rx="${22 - i * 4}" fill="${t.ring}" fill-opacity="${t.ringAlpha[i] * 2}" stroke="${i === 0 ? t.accent : t.line}" ${i === 0 ? 'class="orbit"' : ''}/>`;
  }).join('');
  const core = `<rect x="${ex + es / 2 - 12}" y="${ey + es / 2 - 12}" width="24" height="24" rx="6" fill="${t.accent}"/>`;
  let mx = 0;
  const meta = L.meta.map((m, i) => {
    const [k, v] = m.split(': ');
    const out = `<text x="${mx}" y="262" class="mono" font-size="13"><tspan fill="${t.faint}">${esc(k)}:</tspan><tspan fill="${t.muted}"> ${esc(v)}</tspan></text>` +
      (i < L.meta.length - 1 ? `<text x="${mx + monoW(m, 13) + 12}" y="262" class="mono" font-size="13" fill="${t.line}">/</text>` : '');
    mx += monoW(m, 13) + 34;
    return out;
  }).join('');
  const css = `.cursor{animation:blink 1.1s steps(1) infinite}@keyframes blink{50%{opacity:0}}
.orbit{stroke-dasharray:6 7;animation:dash 14s linear infinite}@keyframes dash{to{stroke-dashoffset:-260}}`;
  return svg(W, H, `
<text x="0" y="${py}" class="mono" font-size="15"><tspan fill="${t.accent}">${prompt}</tspan><tspan fill="${t.faint}"> ▸ </tspan><tspan fill="${t.text}">${esc(SHARED.prompt)}</tspan></text>
<rect class="cursor" x="${cursorX}" y="${py - 13}" width="9" height="17" fill="${t.accent2}"/>
<text x="-3" y="148" class="sans" font-size="78" font-weight="800" letter-spacing="-3" fill="${t.text}">${esc(SHARED.name)}</text>
<text x="0" y="198" class="sans" font-size="20" fill="${t.muted}">${esc(L.tagline)}</text>
<line x1="0" y1="228" x2="${W}" y2="228" stroke="${t.line}"/>
${meta}
${rings}${core}`, css);
}

// ------------------------------------------------------------------ dil geçişi

function langSwitch(active, t) {
  const W = 112, H = 36, seg = 52;
  const part = (code, x) => {
    const on = code === active;
    return `${on ? `<rect x="${x}" y="4" width="${seg}" height="28" rx="14" fill="${t.accent}"/>` : ''}` +
      `<text x="${x + seg / 2}" y="23" text-anchor="middle" class="mono" font-size="13" font-weight="700" letter-spacing="1" fill="${on ? t.onAccent : t.muted}">${code.toUpperCase()}</text>`;
  };
  return svg(W, H, `
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="18" fill="${t.card}" stroke="${t.line}"/>
${part('tr', 4)}${part('en', 56)}`);
}

// ------------------------------------------------------------------ bölüm başlığı

function sectionLabel(text, t) {
  const W = 1000, H = 44;
  const tw = monoW('// ' + text, 15, 1);
  return svg(W, H, `
<text x="0" y="27" class="mono" font-size="15" letter-spacing="1"><tspan fill="${t.accent}">//</tspan><tspan fill="${t.text}"> ${esc(text)}</tspan></text>
<line x1="${tw + 18}" y1="22" x2="${W}" y2="22" stroke="${t.line}"/>`);
}

// ------------------------------------------------------------------ katman diyagramı (imza)

function layers(L, t) {
  const W = 1000;
  const INSET = 28, PADX = 22, GAP = 8, ROWH = 36, BOTTOM = 18, CORE = 92;
  const parts = [];
  let y = 0;
  const geo = SHARED.layerNames.map((name, i) => {
    const note = L.layerNotes[i];
    const x = i * INSET;
    const w = W - 2 * x;
    const startX = x + PADX + monoW(name, 12, 2) + 14 + sansW(note, 13) + 22;
    const maxX = x + w - PADX;
    const rows = [[]];
    let cx = startX;
    for (const c of SHARED.layerChips[i]) {
      const cw = Math.round(sansW(c, 13) + 24);
      if (cx + cw > maxX && rows[rows.length - 1].length) { rows.push([]); cx = startX; }
      rows[rows.length - 1].push({ c, x: cx });
      cx += cw + GAP;
    }
    const g = { x, y, w, rows, name, note };
    y += 18 + rows.length * ROWH;
    return g;
  });
  const coreTop = y;
  const H = coreTop + CORE + BOTTOM * (geo.length - 1) + 2;
  geo.forEach((g, i) => {
    const h = H - g.y - BOTTOM * i - 1;
    parts.push(`<rect x="${g.x + 0.5}" y="${g.y + 0.5}" width="${g.w - 1}" height="${h}" rx="${18 - i * 2}" fill="${t.ring}" fill-opacity="${t.ringAlpha[i]}" stroke="${i === geo.length - 1 ? t.accent : t.line}"/>`);
    const ly = g.y + 18 + ROWH / 2 + 4;
    parts.push(`<text x="${g.x + PADX}" y="${ly}" class="mono" font-size="12" letter-spacing="2" fill="${t.accent}" font-weight="600">${g.name}</text>`);
    parts.push(`<text x="${g.x + PADX + monoW(g.name, 12, 2) + 14}" y="${ly}" class="sans" font-size="13" fill="${t.faint}">${esc(g.note)}</text>`);
    g.rows.forEach((row, r) => row.forEach(({ c, x }) => parts.push(chip(x, g.y + 18 + r * ROWH, c, t).el)));
  });
  parts.push(`<text x="${W / 2}" y="${coreTop + CORE / 2 + 6}" text-anchor="middle" class="mono" font-size="13" fill="${t.faint}"><tspan fill="${t.accent}">→ →</tspan>  ${esc(L.core)}  <tspan fill="${t.accent}">← ←</tspan></text>`);
  return svg(W, H, parts.join('\n'));
}

// ------------------------------------------------------------------ proje kartları

function card(p, desc, t) {
  const W = 500, H = 196;
  const chips = [];
  let x = 26;
  for (const c of p.chips) { const ch = chip(x, 146, c, t, { h: 24, size: 12, fill: t.chipBg }); chips.push(ch.el); x += ch.w + 8; }
  const title = p.repo.length > 24 ? 21 : 24;
  return svg(W, H, `
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="16" fill="${t.card}" stroke="${t.line}"/>
<text x="26" y="38" class="mono" font-size="12" fill="${t.faint}">${USER}/</text>
<text x="26" y="72" class="sans" font-size="${title}" font-weight="700" letter-spacing="-0.4" fill="${t.text}">${esc(p.repo)}</text>
<text x="26" y="102" class="sans" font-size="14" fill="${t.muted}">${esc(desc[0])}</text>
<text x="26" y="123" class="sans" font-size="14" fill="${t.muted}">${esc(desc[1] || '')}</text>
${chips.join('')}
<g transform="translate(456 24)" stroke="${t.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16L16 4M7 4h9v9"/></g>`);
}

// ------------------------------------------------------------------ bağlantı düğmeleri

const ICONS = {
  globe: (c) => `<circle cx="11" cy="11" r="8.5" stroke="${c}" stroke-width="1.6"/><path d="M2.5 11h17M11 2.5c2.6 2.4 3.9 5.2 3.9 8.5s-1.3 6.1-3.9 8.5c-2.6-2.4-3.9-5.2-3.9-8.5S8.4 4.9 11 2.5z" stroke="${c}" stroke-width="1.6"/>`,
  linkedin: (c) => `<rect x="2" y="2" width="18" height="18" rx="4" stroke="${c}" stroke-width="1.6"/><path d="M7 9.5V15M7 6.8v.1M10.5 15v-3.2c0-1.5.9-2.3 2-2.3s1.9.8 1.9 2.3V15M10.5 9.5V15" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>`,
  instagram: (c) => `<rect x="2.5" y="2.5" width="17" height="17" rx="5" stroke="${c}" stroke-width="1.6"/><circle cx="11" cy="11" r="4" stroke="${c}" stroke-width="1.6"/><circle cx="15.8" cy="6.2" r="1" fill="${c}"/>`
};

function linkPill(l, t) {
  const H = 44;
  const W = Math.round(sansW(l.label, 14) + 74);
  return svg(W, H, `
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="22" fill="${t.card}" stroke="${t.line}"/>
<g transform="translate(18 11)">${ICONS[l.icon](t.accent)}</g>
<text x="50" y="27" class="sans" font-size="14" font-weight="600" fill="${t.text}">${esc(l.label)}</text>`);
}

// ------------------------------------------------------------------ çıktı

const ASSETS = path.join(HERE, 'assets');
fs.rmSync(ASSETS, { recursive: true, force: true });
for (const d of ['', 'tr', 'en']) fs.mkdirSync(path.join(ASSETS, d), { recursive: true });
const write = (rel, content) => fs.writeFileSync(path.join(ASSETS, rel), content);

for (const [mode, t] of Object.entries(THEMES)) {
  SHARED.links.forEach((l) => write(`link-${l.id}-${mode}.svg`, linkPill(l, t)));
  for (const [code, L] of Object.entries(LANG)) {
    write(`${code}/header-${mode}.svg`, header(L, t));
    write(`${code}/layers-${mode}.svg`, layers(L, t));
    write(`${code}/switch-${mode}.svg`, langSwitch(code, t));
    for (const [key, text] of Object.entries(L.sections)) write(`${code}/label-${key}-${mode}.svg`, sectionLabel(text, t));
    SHARED.projects.forEach((p) => write(`${code}/card-${p.repo}-${mode}.svg`, card(p, L.descs[p.repo], t)));
  }
}

// Açık/koyu temaya göre değişen görsel.
const pic = (name, alt, attrs = '') =>
  `<picture><source media="(prefers-color-scheme: dark)" srcset="assets/${name}-dark.svg"><img src="assets/${name}-light.svg" alt="${esc(alt)}" ${attrs}></picture>`;

function statsUrls(dark, locale) {
  const c = dark ? THEMES.dark : THEMES.light;
  const q = `bg_color=00000000&hide_border=true&title_color=${c.accent.slice(1)}&text_color=${c.muted.slice(1)}&icon_color=${c.accent2.slice(1)}&locale=${locale}`;
  return {
    stats: `https://github-readme-stats.vercel.app/api?username=${USER}&show_icons=true&rank_icon=percentile&${q}`,
    langs: `https://github-readme-stats.vercel.app/api/top-langs/?username=${USER}&layout=compact&langs_count=8&${q}`
  };
}

function readme(code) {
  const L = LANG[code];
  const other = code === 'tr' ? 'en' : 'tr';
  const sd = statsUrls(true, L.statsLocale);
  const sl = statsUrls(false, L.statsLocale);
  const cards = SHARED.projects.map((p) => `<a href="https://github.com/${USER}/${p.repo}">${pic(`${code}/card-${p.repo}`, p.repo, 'width="49%"')}</a>`);
  const rows = [];
  for (let i = 0; i < cards.length; i += 2) rows.push(cards.slice(i, i + 2).join('\n'));
  return `<p align="right"><a href="${LANG_URL[other]}">${pic(`${code}/switch`, code === 'tr' ? 'Türkçe · Switch to English' : 'English · Türkçe sürüme geç', 'height="34"')}</a></p>

${pic(`${code}/header`, `${SHARED.name} — ${L.tagline}`, 'width="100%"')}

<p>
${SHARED.links.map((l) => `<a href="${l.href}">${pic(`link-${l.id}`, l.label, 'height="40"')}</a>`).join('\n')}
</p>

<br/>

${pic(`${code}/label-now`, L.sections.now, 'width="100%"')}

| | |
|---|---|
${L.now.map(([k, v]) => `| \`${k}\` | ${v} |`).join('\n')}

<br/>

${pic(`${code}/label-stack`, L.sections.stack, 'width="100%"')}

${pic(`${code}/layers`, L.stackAlt, 'width="100%"')}

<sub>${esc(L.stackNote)}</sub>

<br/><br/>

${pic(`${code}/label-projects`, L.sections.projects, 'width="100%"')}

<p>
${rows.join('\n</p>\n<p>\n')}
</p>

<sub><a href="https://github.com/${USER}?tab=repositories">${esc(L.allRepos)}</a></sub>

<br/><br/>

${pic(`${code}/label-activity`, L.sections.activity, 'width="100%"')}

<p>
<picture><source media="(prefers-color-scheme: dark)" srcset="${sd.stats}"><img src="${sl.stats}" alt="${esc(L.statsAlt)}" height="165"></picture>
<picture><source media="(prefers-color-scheme: dark)" srcset="${sd.langs}"><img src="${sl.langs}" alt="${esc(L.langsAlt)}" height="165"></picture>
</p>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/${USER}/${USER}/output/github-snake-dark.svg">
  <img src="https://raw.githubusercontent.com/${USER}/${USER}/output/github-snake.svg" alt="${esc(L.snakeAlt)}" width="100%">
</picture>

<sub>${esc(L.footer)}</sub>
`;
}

for (const code of Object.keys(LANG)) fs.writeFileSync(path.join(HERE, LANG[code].file), readme(code));
const count = (d) => fs.readdirSync(d, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? count(path.join(d, e.name)) : 1), 0);
console.log(`README.md + README.en.md + ${count(ASSETS)} svg üretildi`);
