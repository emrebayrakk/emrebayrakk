// Profil README'si ve SVG görselleri üretir.
// Kullanım: node generate.mjs   → README.md ve assets/*.svg (açık + koyu tema) oluşur.
// Metinleri değiştirmek için yalnızca aşağıdaki DATA bölümünü düzenle.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const USER = 'emrebayrakk';

// ------------------------------------------------------------------ DATA

const DATA = {
  name: 'Emre Bayrak',
  prompt: 'dotnet run --profile',
  tagline: '.NET yazılım geliştirici — temiz mimari, dağıtık sistemler ve ben uyurken çalışan araçlar.',
  meta: ['location: localhost', 'focus: backend · full-stack', 'github: since 2021'],
  links: [
    { id: 'web', label: 'emrebayrak.com', href: 'https://emrebayrak.com', icon: 'globe' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/eemmrree/', icon: 'linkedin' },
    { id: 'instagram', label: 'dev.emrebayrak', href: 'https://www.instagram.com/dev.emrebayrak/', icon: 'instagram' }
  ],
  // Soğan: dıştan içe. Bağımlılıklar içeri doğru akar.
  layers: [
    { name: 'PRESENTATION', note: 'arayüz & API', chips: ['React', 'Angular', 'Blazor', 'ASP.NET Web API', 'TypeScript'] },
    { name: 'INFRASTRUCTURE', note: 'veri & mesajlaşma', chips: ['EF Core', 'Dapper', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'RabbitMQ', 'Elasticsearch', 'Docker'] },
    { name: 'APPLICATION', note: 'iş akışları', chips: ['Use cases', 'FluentValidation', 'JWT', 'Hangfire', 'Caching'] },
    { name: 'DOMAIN', note: 'çekirdek', chips: ['C#', 'Java', 'Go', 'DDD', 'SOLID', 'Design patterns'] }
  ],
  now: [
    ['building', '[x-instagram-automation](https://github.com/emrebayrakk/x-instagram-automation) — X & Instagram için Chrome eklentisi, görev sırası'],
    ['learning', 'Elasticsearch, RabbitMQ ve dağıtık sistemler'],
    ['into', 'Clean Architecture, microservices, performans'],
    ['offline', 'kitap 📚 · oyun 🎮']
  ],
  projects: [
    { repo: 'x-instagram-automation', desc: ['X ve Instagram için Chrome eklentisi:', 'filtreli takip, beğeni, görev sırası.'], chips: ['JavaScript', 'Chrome MV3', 'Electron'] },
    { repo: 'EMaster', desc: ['Clean Architecture ile gelir-gider takibi;', '.NET Web API + React arayüz.'], chips: ['.NET', 'React', 'Clean Arch.'] },
    { repo: 'VehiclesControl', desc: ['Şablon proje: EF Core + Dapper, RabbitMQ,', 'JWT, Hangfire, Blazor ve testler.'], chips: ['C#', 'RabbitMQ', 'Blazor'] },
    { repo: 'ElasticSearchDotnetMinimalAPI', desc: ['Minimal API ile Elasticsearch ve Kibana,', 'Docker üzerinde.'], chips: ['.NET', 'Elasticsearch', 'Docker'] },
    { repo: 'FinTrack', desc: ['Borsa İstanbul verilerini Bigpara API', 'üzerinden gösteren Blazor uygulaması.'], chips: ['Blazor', 'C#', 'REST'] },
    { repo: 'SystemInfoTool', desc: ['Sistem bilgisi, kapanma zamanlayıcı ve', 'kaynak kullanımı için Go aracı.'], chips: ['Go', 'CLI', 'Windows'] }
  ],
  footer: '// uğradığın için teşekkürler — emrebayrak.com'
};

// ------------------------------------------------------------------ tema

const THEMES = {
  dark: {
    text: '#e6edf3', muted: '#8b949e', faint: '#6e7681', line: '#30363d', card: '#161b22',
    accent: '#a78bfa', accent2: '#f0b429', ring: '#a78bfa', ringAlpha: [0.03, 0.05, 0.08, 0.13]
  },
  light: {
    text: '#1f2328', muted: '#59636e', faint: '#818b98', line: '#d0d7de', card: '#f6f8fa',
    accent: '#6d28d9', accent2: '#b7791f', ring: '#6d28d9', ringAlpha: [0.025, 0.045, 0.07, 0.11]
  }
};

const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans',Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono',monospace";
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Kaba metin genişliği tahmini (SVG'de ölçüm yok).
const sansW = (s, size) => [...s].reduce((w, c) => w + (/[A-ZÇĞİÖŞÜMW]/.test(c) ? 0.66 : /[ilıj.,'·|]/.test(c) ? 0.3 : c === ' ' ? 0.3 : 0.56), 0) * size;
const monoW = (s, size, spacing = 0) => [...s].length * (size * 0.6 + spacing);

const svg = (w, h, body, t, extraCss = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">
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

function header(t) {
  const W = 1000, H = 290;
  const prompt = '~/emre';
  const px = 0, py = 46;
  const p1 = monoW(prompt + ' ', 15);
  const p2 = monoW('▸ ', 15);
  const cmdW = monoW(DATA.prompt, 15);
  // Sağdaki amblem: aşağıdaki katman diyagramının küçük hali (iç içe dört kare).
  const ex = 836, ey = 26, es = 150;
  const rings = [0, 1, 2, 3].map((i) => {
    const inset = i * 19;
    const s = es - inset * 2;
    return `<rect x="${ex + inset}" y="${ey + inset}" width="${s}" height="${s}" rx="${22 - i * 4}" fill="${t.ring}" fill-opacity="${t.ringAlpha[i] * 2}" stroke="${i === 0 ? t.accent : t.line}" ${i === 0 ? 'class="orbit"' : ''}/>`;
  }).join('');
  const core = `<rect x="${ex + es / 2 - 12}" y="${ey + es / 2 - 12}" width="24" height="24" rx="6" fill="${t.accent}"/>`;
  const meta = DATA.meta.map((m, i) => {
    const x = DATA.meta.slice(0, i).reduce((a, s) => a + monoW(s, 13) + 34, 0);
    const [k, v] = m.split(': ');
    return `<text x="${x}" y="262" class="mono" font-size="13"><tspan fill="${t.faint}">${esc(k)}:</tspan><tspan fill="${t.muted}"> ${esc(v)}</tspan></text>` +
      (i < DATA.meta.length - 1 ? `<text x="${x + monoW(m, 13) + 12}" y="262" class="mono" font-size="13" fill="${t.line}">/</text>` : '');
  }).join('');
  const css = `.cursor{animation:blink 1.1s steps(1) infinite}@keyframes blink{50%{opacity:0}}
.orbit{stroke-dasharray:6 7;animation:dash 14s linear infinite}@keyframes dash{to{stroke-dashoffset:-260}}`;
  const body = `
<text x="${px}" y="${py}" class="mono" font-size="15"><tspan fill="${t.accent}">${prompt}</tspan><tspan fill="${t.faint}"> ▸ </tspan><tspan fill="${t.text}">${esc(DATA.prompt)}</tspan></text>
<rect class="cursor" x="${px + p1 + p2 + cmdW + 4}" y="${py - 13}" width="9" height="17" fill="${t.accent2}"/>
<text x="-3" y="148" class="sans" font-size="78" font-weight="800" letter-spacing="-3" fill="${t.text}">${esc(DATA.name)}</text>
<text x="0" y="198" class="sans" font-size="20" fill="${t.muted}">${esc(DATA.tagline)}</text>
<line x1="0" y1="228" x2="${W}" y2="228" stroke="${t.line}"/>
${meta}
${rings}${core}`;
  return svg(W, H, body, t, css);
}

// ------------------------------------------------------------------ bölüm başlığı

function sectionLabel(text, t) {
  const W = 1000, H = 44;
  const tw = monoW('// ' + text, 15, 1);
  return svg(W, H, `
<text x="0" y="27" class="mono" font-size="15" letter-spacing="1"><tspan fill="${t.accent}">//</tspan><tspan fill="${t.text}"> ${esc(text)}</tspan></text>
<line x1="${tw + 18}" y1="22" x2="${W}" y2="22" stroke="${t.line}"/>`, t);
}

// ------------------------------------------------------------------ katman diyagramı (imza)

function layers(t) {
  const W = 1000;
  const INSET = 28, PADX = 22, GAP = 8, ROWH = 36, BOTTOM = 18, CORE = 92;
  const parts = [];
  let y = 0;
  const geo = DATA.layers.map((L, i) => {
    const x = i * INSET;
    const w = W - 2 * x;
    const labelW = monoW(L.name, 12, 2) + 14 + sansW(L.note, 13) + 22;
    const startX = x + PADX + labelW;
    const maxX = x + w - PADX;
    // çipleri satırlara böl
    const rows = [[]];
    let cx = startX;
    for (const c of L.chips) {
      const cw = Math.round(sansW(c, 13) + 24);
      if (cx + cw > maxX && rows[rows.length - 1].length) { rows.push([]); cx = startX; }
      rows[rows.length - 1].push({ c, x: cx });
      cx += cw + GAP;
    }
    const band = 18 + rows.length * ROWH;
    const g = { x, y, w, band, rows, L };
    y += band;
    return g;
  });
  const coreTop = y;
  const H = coreTop + CORE + BOTTOM * (DATA.layers.length - 1) + 2;
  geo.forEach((g, i) => {
    const bottomInset = BOTTOM * i;
    const h = H - g.y - bottomInset - 1;
    parts.push(`<rect x="${g.x + 0.5}" y="${g.y + 0.5}" width="${g.w - 1}" height="${h}" rx="${18 - i * 2}" fill="${t.ring}" fill-opacity="${t.ringAlpha[i]}" stroke="${i === geo.length - 1 ? t.accent : t.line}"/>`);
    const ly = g.y + 18 + ROWH / 2 + 4;
    parts.push(`<text x="${g.x + PADX}" y="${ly}" class="mono" font-size="12" letter-spacing="2" fill="${t.accent}" font-weight="600">${g.L.name}</text>`);
    parts.push(`<text x="${g.x + PADX + monoW(g.L.name, 12, 2) + 14}" y="${ly}" class="sans" font-size="13" fill="${t.faint}">${esc(g.L.note)}</text>`);
    g.rows.forEach((row, r) => row.forEach(({ c, x }) => parts.push(chip(x, g.y + 18 + r * ROWH, c, t).el)));
  });
  // çekirdek: bağımlılık yönü
  const cy = coreTop + CORE / 2 + 6;
  parts.push(`<text x="${W / 2}" y="${cy}" text-anchor="middle" class="mono" font-size="13" fill="${t.faint}"><tspan fill="${t.accent}">→ →</tspan>  bağımlılıklar içeri doğru akar  <tspan fill="${t.accent}">← ←</tspan></text>`);
  return svg(W, H, parts.join('\n'), t);
}

// ------------------------------------------------------------------ proje kartları

function card(p, t) {
  const W = 500, H = 196;
  const chips = [];
  let x = 26;
  for (const c of p.chips) { const ch = chip(x, 146, c, t, { h: 24, size: 12, fill: t.ring === '#a78bfa' ? '#0d1117' : '#ffffff' }); chips.push(ch.el); x += ch.w + 8; }
  const title = p.repo.length > 24 ? 21 : 24;
  return svg(W, H, `
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="16" fill="${t.card}" stroke="${t.line}"/>
<text x="26" y="38" class="mono" font-size="12" fill="${t.faint}">${USER}/</text>
<text x="26" y="72" class="sans" font-size="${title}" font-weight="700" letter-spacing="-0.4" fill="${t.text}">${esc(p.repo)}</text>
<text x="26" y="102" class="sans" font-size="14" fill="${t.muted}">${esc(p.desc[0])}</text>
<text x="26" y="123" class="sans" font-size="14" fill="${t.muted}">${esc(p.desc[1] || '')}</text>
${chips.join('')}
<g transform="translate(456 24)" stroke="${t.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16L16 4M7 4h9v9"/></g>`, t);
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
<text x="50" y="27" class="sans" font-size="14" font-weight="600" fill="${t.text}">${esc(l.label)}</text>`, t);
}

// ------------------------------------------------------------------ çıktı

const ASSETS = path.join(HERE, 'assets');
fs.mkdirSync(ASSETS, { recursive: true });
const write = (name, content) => fs.writeFileSync(path.join(ASSETS, name), content);

for (const [mode, t] of Object.entries(THEMES)) {
  write(`header-${mode}.svg`, header(t));
  write(`layers-${mode}.svg`, layers(t));
  for (const [key, text] of [['now', 'şu an'], ['stack', 'katmanlar'], ['projects', 'projeler'], ['activity', 'aktivite']]) {
    write(`label-${key}-${mode}.svg`, sectionLabel(text, t));
  }
  DATA.projects.forEach((p) => write(`card-${p.repo}-${mode}.svg`, card(p, t)));
  DATA.links.forEach((l) => write(`link-${l.id}-${mode}.svg`, linkPill(l, t)));
}

// Açık/koyu temaya göre değişen görsel.
const pic = (name, alt, attrs = '') =>
  `<picture><source media="(prefers-color-scheme: dark)" srcset="assets/${name}-dark.svg"><img src="assets/${name}-light.svg" alt="${esc(alt)}" ${attrs}></picture>`;

const stat = (dark) => {
  const c = dark ? THEMES.dark : THEMES.light;
  const q = `bg_color=00000000&hide_border=true&title_color=${c.accent.slice(1)}&text_color=${c.muted.slice(1)}&icon_color=${c.accent2.slice(1)}`;
  return {
    stats: `https://github-readme-stats.vercel.app/api?username=${USER}&show_icons=true&rank_icon=percentile&${q}`,
    langs: `https://github-readme-stats.vercel.app/api/top-langs/?username=${USER}&layout=compact&langs_count=8&${q}`
  };
};
const sd = stat(true), sl = stat(false);

const cards = DATA.projects.map((p) =>
  `<a href="https://github.com/${USER}/${p.repo}">${pic(`card-${p.repo}`, p.repo, 'width="49%"')}</a>`);
const cardRows = [];
for (let i = 0; i < cards.length; i += 2) cardRows.push(cards.slice(i, i + 2).join('\n'));

const readme = `${pic('header', `${DATA.name} — ${DATA.tagline}`, 'width="100%"')}

<p>
${DATA.links.map((l) => `<a href="${l.href}">${pic(`link-${l.id}`, l.label, 'height="40"')}</a>`).join('\n')}
</p>

<br/>

${pic('label-now', 'şu an', 'width="100%"')}

| | |
|---|---|
${DATA.now.map(([k, v]) => `| \`${k}\` | ${v} |`).join('\n')}

<br/>

${pic('label-stack', 'katmanlar', 'width="100%"')}

${pic('layers', 'Teknolojiler, Clean Architecture katmanları olarak: Domain, Application, Infrastructure, Presentation', 'width="100%"')}

<sub>Teknolojilerimi Clean Architecture'ı düşündüğüm gibi diziyorum: çekirdekte dil ve tasarım ilkeleri, dışa doğru altyapı ve arayüz.</sub>

<br/><br/>

${pic('label-projects', 'projeler', 'width="100%"')}

<p>
${cardRows.join('\n</p>\n<p>\n')}
</p>

<sub><a href="https://github.com/${USER}?tab=repositories">tüm repolar →</a></sub>

<br/><br/>

${pic('label-activity', 'aktivite', 'width="100%"')}

<p>
<picture><source media="(prefers-color-scheme: dark)" srcset="${sd.stats}"><img src="${sl.stats}" alt="GitHub istatistikleri" height="165"></picture>
<picture><source media="(prefers-color-scheme: dark)" srcset="${sd.langs}"><img src="${sl.langs}" alt="En çok kullanılan diller" height="165"></picture>
</p>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/${USER}/${USER}/output/github-snake-dark.svg">
  <img src="https://raw.githubusercontent.com/${USER}/${USER}/output/github-snake.svg" alt="Katkı grafiği yılanı" width="100%">
</picture>

<sub>${esc(DATA.footer)}</sub>
`;
fs.writeFileSync(path.join(HERE, 'README.md'), readme);
console.log('README.md + ' + fs.readdirSync(ASSETS).length + ' svg üretildi');
