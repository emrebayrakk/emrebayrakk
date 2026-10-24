// Profil README'si (Türkçe + İngilizce) ve SVG görselleri üretir.
// Kullanım: node generate.mjs
//   → README.md (TR), README.en.md (EN), assets/*.svg (ortak), assets/tr/*.svg, assets/en/*.svg
// Konsept: "canlı sistem haritası". Profil, çalışan bir servis ağı gibi okunur: başlıkta merkez düğüm (EB)
// ile projeler arasında mesaj paketleri akar; projeler servis kartları, teknolojiler bir veri yolu
// boyunca dizilmiş şeritlerdir. Her görselin açık ve koyu tema sürümü vardır.
// Metinleri değiştirmek için yalnızca DATA bölümünü düzenle.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const USER = 'emrebayrakk';
const SITE = 'https://emrebayrak.com.tr';

// ------------------------------------------------------------------ DATA

const SHARED = {
  name: 'Emre Bayrak',
  initials: 'EB',
  links: [
    { id: 'web', label: 'emrebayrak.com.tr', href: SITE, icon: 'globe' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/eemmrree/', icon: 'linkedin' },
    { id: 'instagram', label: 'dev.emrebayrak', href: 'https://www.instagram.com/dev.emrebayrak/', icon: 'instagram' }
  ],
  // Veri yolu şeritleri (dıştan içe değil, isteğin akış sırasıyla): uç → çekirdek → veri → mesajlaşma.
  lanes: [
    ['React', 'Angular', 'Blazor', 'ASP.NET Web API', 'TypeScript'],
    ['C#', 'Java', 'Go', 'Clean Architecture', 'DDD', 'SOLID', 'Design patterns'],
    ['EF Core', 'Dapper', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch'],
    ['RabbitMQ', 'Hangfire', 'Docker', 'JWT', 'FluentValidation', 'Caching']
  ],
  // short: başlıktaki ağ haritasında görünen kısa ad; active: şu an üzerinde çalışılan.
  projects: [
    { repo: 'x-instagram-automation', short: 'x-insta', chips: ['JavaScript', 'Chrome MV3', 'Electron'], active: true },
    { repo: 'EMaster', short: 'EMaster', chips: ['.NET', 'React', 'Clean Arch.'] },
    { repo: 'VehiclesControl', short: 'Vehicles', chips: ['C#', 'RabbitMQ', 'Blazor'] },
    { repo: 'ElasticSearchDotnetMinimalAPI', short: 'Elastic', chips: ['.NET', 'Elasticsearch', 'Docker'] },
    { repo: 'FinTrack', short: 'FinTrack', chips: ['Blazor', 'C#', 'REST'] },
    { repo: 'SystemInfoTool', short: 'SysInfo', chips: ['Go', 'CLI', 'Windows'] }
  ]
};

const LANG = {
  tr: {
    file: 'README.md',
    kicker: 'şu an: x-instagram-automation üzerinde',
    tagline: ['.NET yazılım geliştirici. Temiz mimari,', 'dağıtık sistemler ve ben uyurken', 'çalışan araçlar yazıyorum.'],
    meta: 'localhost  ·  backend & full-stack  ·  2021\'den beri GitHub\'da',
    headerAlt: 'Emre Bayrak — .NET yazılım geliştirici. Temiz mimari, dağıtık sistemler ve ben uyurken çalışan araçlar yazıyorum.',
    sections: {
      events: ['şu an', 'olay akışı'],
      services: ['projeler', `${SHARED.projects.length} servis`],
      stack: ['teknolojiler', 'istek yolu'],
      telemetry: ['aktivite', 'github']
    },
    events: [
      ['building', 'x-instagram-automation — X ve Instagram için Chrome eklentisi, planlar'],
      ['learning', 'Elasticsearch, RabbitMQ ve dağıtık sistemler'],
      ['into', 'Clean Architecture, microservices, performans'],
      ['offline', 'kitap ve oyun']
    ],
    eventsAlt: 'Şu an: x-instagram-automation geliştiriyorum; Elasticsearch, RabbitMQ ve dağıtık sistemler öğreniyorum; Clean Architecture, microservices ve performansla ilgileniyorum; boş zamanımda kitap ve oyun.',
    lanes: [['UÇ', 'arayüz & API'], ['ÇEKİRDEK', 'dil & tasarım'], ['VERİ', 'depolama & arama'], ['MESAJLAŞMA', 'kuyruk, iş, altyapı']],
    stackAlt: 'Teknolojiler, bir isteğin yolu boyunca: uç (React, Angular, Blazor, ASP.NET Web API, TypeScript), çekirdek (C#, Java, Go, Clean Architecture, DDD, SOLID), veri (EF Core, Dapper, PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch), mesajlaşma (RabbitMQ, Hangfire, Docker, JWT, FluentValidation, Caching).',
    stackNote: 'Teknolojilerimi bir isteğin izlediği yol gibi diziyorum: arayüzden girer, çekirdekte işlenir, veride kalır, kuyrukla dağılır.',
    status: { active: 'geliştiriliyor', stable: 'yayında' },
    descs: {
      'x-instagram-automation': ['X ve Instagram için Chrome eklentisi:', 'filtreli takip, beğeni, zamanlı planlar.'],
      EMaster: ['Clean Architecture ile gelir-gider takibi;', '.NET Web API + React arayüz.'],
      VehiclesControl: ['Şablon proje: EF Core + Dapper, RabbitMQ,', 'JWT, Hangfire, Blazor ve testler.'],
      ElasticSearchDotnetMinimalAPI: ['Minimal API ile Elasticsearch ve Kibana,', 'Docker üzerinde.'],
      FinTrack: ['Borsa İstanbul verilerini Bigpara API', 'üzerinden gösteren Blazor uygulaması.'],
      SystemInfoTool: ['Sistem bilgisi, kapanma zamanlayıcı ve', 'kaynak kullanımı için Go aracı.']
    },
    allRepos: 'tüm repolar →',
    statsAlt: 'GitHub istatistikleri', langsAlt: 'En çok kullanılan diller', snakeAlt: 'Katkı grafiği yılanı',
    statsLocale: 'tr',
    switchAlt: 'Türkçe · Switch to English',
    footer: 'uğradığın için teşekkürler — emrebayrak.com.tr'
  },
  en: {
    file: 'README.en.md',
    kicker: 'now: shipping x-instagram-automation',
    tagline: ['.NET developer. I build clean', 'architecture, distributed systems and', 'tools that run while I sleep.'],
    meta: 'localhost  ·  backend & full-stack  ·  on GitHub since 2021',
    headerAlt: 'Emre Bayrak — .NET developer. I build clean architecture, distributed systems and tools that run while I sleep.',
    sections: {
      events: ['now', 'event stream'],
      services: ['projects', `${SHARED.projects.length} services`],
      stack: ['stack', 'request path'],
      telemetry: ['activity', 'github']
    },
    events: [
      ['building', 'x-instagram-automation — Chrome extension for X and Instagram, with plans'],
      ['learning', 'Elasticsearch, RabbitMQ and distributed systems'],
      ['into', 'Clean Architecture, microservices, performance'],
      ['offline', 'books and games']
    ],
    eventsAlt: "Now: building x-instagram-automation; learning Elasticsearch, RabbitMQ and distributed systems; into Clean Architecture, microservices and performance; offline: books and games.",
    lanes: [['EDGE', 'UI & API'], ['CORE', 'language & design'], ['DATA', 'storage & search'], ['MESSAGING', 'queues, jobs, infra']],
    stackAlt: 'Tech stack along the path of a request: edge (React, Angular, Blazor, ASP.NET Web API, TypeScript), core (C#, Java, Go, Clean Architecture, DDD, SOLID), data (EF Core, Dapper, PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch), messaging (RabbitMQ, Hangfire, Docker, JWT, FluentValidation, Caching).',
    stackNote: 'I lay out my stack the way a request travels: it enters at the edge, is handled in the core, lands in data and fans out through queues.',
    status: { active: 'in development', stable: 'shipped' },
    descs: {
      'x-instagram-automation': ['Chrome extension for X and Instagram:', 'filtered follow, likes, scheduled plans.'],
      EMaster: ['Income & expense tracker with Clean', 'Architecture; .NET Web API + React UI.'],
      VehiclesControl: ['Template: EF Core + Dapper, RabbitMQ,', 'JWT, Hangfire, Blazor and tests.'],
      ElasticSearchDotnetMinimalAPI: ['Minimal API with Elasticsearch and', 'Kibana, running on Docker.'],
      FinTrack: ['Blazor app showing Borsa Istanbul', 'market data via the Bigpara API.'],
      SystemInfoTool: ['Go tool for system info, a shutdown', 'timer and resource usage.']
    },
    allRepos: 'all repositories →',
    statsAlt: 'GitHub stats', langsAlt: 'Most used languages', snakeAlt: 'Contribution snake',
    statsLocale: 'en',
    switchAlt: 'English · Türkçe sürüme geç',
    footer: 'thanks for stopping by — emrebayrak.com.tr'
  }
};

// Dil geçişi bağlantıları: Türkçe sürüm profil sayfasında görünür, İngilizce sürüm dosya olarak açılır.
const LANG_URL = { tr: `https://github.com/${USER}`, en: `https://github.com/${USER}/${USER}/blob/main/README.en.md` };

// ------------------------------------------------------------------ tema
// Liman laciverti panel, sinyal turkuazı (akan istek) ve kuyruk mercanı (şu an üzerinde çalışılan).

const THEMES = {
  dark: {
    panel: '#0d1822', panel2: '#112130', line: '#1d3242', dots: '#173040', text: '#e8f0f5', muted: '#8aa2b3', faint: '#5b7487',
    signal: '#34d8c3', queue: '#ff8a65', onSignal: '#04201c', glow: 0.22
  },
  light: {
    panel: '#f6fafb', panel2: '#ffffff', line: '#d3e1e8', dots: '#dbe7ed', text: '#0f1f2b', muted: '#506676', faint: '#7d919f',
    signal: '#0d8a7b', queue: '#d4552f', onSignal: '#ffffff', glow: 0.14
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
@media (prefers-reduced-motion: reduce){*{animation:none!important}.pkt{display:none}}
</style>
${body}
</svg>
`;

const dotGrid = (id, t) => `<defs><pattern id="${id}" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.1" fill="${t.dots}"/></pattern></defs>`;

function chip(x, y, label, t, { h = 26, size = 12.5, fill = t.panel2, color = t.text, stroke = t.line } = {}) {
  const w = Math.round(sansW(label, size) + 22);
  return {
    w,
    el: `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${fill}" stroke="${stroke}"/>` +
      `<text x="${x + w / 2}" y="${y + h / 2 + size * 0.36}" text-anchor="middle" class="sans" font-size="${size}" fill="${color}">${esc(label)}</text></g>`
  };
}

// Mesaj paketi: yol boyunca giden küçük nokta (SMIL; hareketi azalt açıksa gizlenir).
function packet(pathId, color, dur, begin, reverse, r = 3.2) {
  const dir = reverse ? ' keyPoints="1;0" keyTimes="0;1" calcMode="linear"' : '';
  return `<circle class="pkt" r="${r}" fill="${color}" opacity="0"><animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite"${dir}><mpath href="#${pathId}"/></animateMotion>` +
    `<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.85;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></circle>`;
}

// ------------------------------------------------------------------ görseller

// Başlık: solda ad ve tanıtım, sağda canlı ağ haritası (merkez EB, çevrede projeler).
function header(L, t) {
  const W = 900, H = 380;
  const hub = { x: 712, y: 190 };
  const spots = [[598, 82], [826, 78], [866, 190], [826, 304], [598, 300], [566, 190]];
  const nodes = SHARED.projects.map((p, i) => ({ ...p, x: spots[i][0], y: spots[i][1] }));
  const edges = nodes.map((n, i) => {
    const mx = (hub.x + n.x) / 2, my = (hub.y + n.y) / 2;
    const dx = n.x - hub.x, dy = n.y - hub.y;
    const bend = i % 2 ? 0.18 : -0.18;
    const cx = mx - dy * bend, cy = my + dx * bend;
    return `<path id="e${i}" d="M${hub.x} ${hub.y} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${n.x} ${n.y}" stroke="${t.line}" stroke-width="1.4"/>`;
  }).join('\n');
  const packets = nodes.map((n, i) => {
    const color = n.active ? t.queue : t.signal;
    const d = (2.4 + (i % 3) * 0.55).toFixed(2);
    return packet(`e${i}`, color, d, (i * 0.37).toFixed(2), false) + packet(`e${i}`, color, d, (i * 0.37 + d / 2).toFixed(2), true, 2.4);
  }).join('\n');
  const nodeEls = nodes.map((n) => {
    const c = n.active ? t.queue : t.signal;
    const lw = monoW(n.short, 10.5);
    const below = n.y > hub.y + 10 || (n.y > hub.y - 10 && n.y < hub.y + 10);
    const ly = below ? n.y + 24 : n.y - 16;
    return `<g>
  <circle cx="${n.x}" cy="${n.y}" r="13" fill="${c}" opacity="${t.glow}"/>
  <circle cx="${n.x}" cy="${n.y}" r="6.5" fill="${t.panel2}" stroke="${c}" stroke-width="2.2"/>
  ${n.active ? `<circle cx="${n.x}" cy="${n.y}" r="13" stroke="${c}" stroke-width="1.4" class="ping"/>` : ''}
  <rect x="${(n.x - lw / 2 - 6).toFixed(1)}" y="${ly - 12}" width="${(lw + 12).toFixed(1)}" height="17" rx="5" fill="${t.panel}" opacity=".92"/>
  <text x="${n.x}" y="${ly}" text-anchor="middle" class="mono" font-size="10.5" fill="${n.active ? c : t.muted}">${esc(n.short)}</text>
</g>`;
  }).join('\n');
  const tag = L.tagline.map((line, i) => `<text x="44" y="${196 + i * 27}" class="sans" font-size="18.5" fill="${t.muted}">${esc(line)}</text>`).join('\n');
  const css = `.ping{transform-origin:center;transform-box:fill-box;animation:ping 2.4s ease-out infinite}
@keyframes ping{0%{opacity:.9;transform:scale(.6)}100%{opacity:0;transform:scale(1.9)}}
.hub{transform-origin:center;transform-box:fill-box;animation:breathe 3.2s ease-in-out infinite}
@keyframes breathe{0%,100%{opacity:.18;transform:scale(1)}50%{opacity:.34;transform:scale(1.12)}}
.cursor{animation:blink 1.1s steps(1) infinite}@keyframes blink{50%{opacity:0}}`;
  return svg(W, H, `${dotGrid('g', t)}
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="22" fill="${t.panel}" stroke="${t.line}"/>
<rect x="500" y="1" width="399" height="${H - 2}" rx="22" fill="url(#g)"/>
<rect x="500" y="1" width="60" height="${H - 2}" fill="${t.panel}" opacity=".0"/>
<g>
  <circle cx="54" cy="66" r="4.5" fill="${t.queue}"/>
  <circle cx="54" cy="66" r="9" stroke="${t.queue}" stroke-width="1.2" class="ping"/>
  <text x="70" y="70.5" class="mono" font-size="12.5" fill="${t.muted}">${esc(L.kicker)}</text>
</g>
<text x="40" y="150" class="sans" font-size="64" font-weight="800" letter-spacing="-2.6" fill="${t.text}">${esc(SHARED.name)}<tspan fill="${t.signal}">.</tspan></text>
${tag}
<line x1="44" y1="300" x2="470" y2="300" stroke="${t.line}"/>
<text x="44" y="330" class="mono" font-size="12" fill="${t.faint}">${esc(L.meta)}</text>
${edges}
${packets}
<circle cx="${hub.x}" cy="${hub.y}" r="52" fill="${t.signal}" class="hub"/>
<circle cx="${hub.x}" cy="${hub.y}" r="34" fill="${t.signal}"/>
<text x="${hub.x}" y="${hub.y + 7}" text-anchor="middle" class="sans" font-size="20" font-weight="800" letter-spacing="-.5" fill="${t.onSignal}">${SHARED.initials}</text>
${nodeEls}`, css);
}

function langSwitch(active, t) {
  const W = 124, H = 34;
  const seg = (code, x) => {
    const on = code === active;
    return `<rect x="${x}" y="4" width="56" height="26" rx="8" fill="${on ? t.signal : 'none'}"/>` +
      `<text x="${x + 28}" y="21.5" text-anchor="middle" class="mono" font-size="12" font-weight="700" letter-spacing="1.2" fill="${on ? t.onSignal : t.muted}">${code.toUpperCase()}</text>`;
  };
  return svg(W, H, `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="11" fill="${t.panel}" stroke="${t.line}"/>${seg('tr', 5)}${seg('en', 63)}`);
}

// Bölüm başlığı: "▸ projeler ────────── 6 servis"
function sectionLabel([label, note], t) {
  const W = 900, H = 36;
  const lw = monoW(label, 14.5);
  const nw = monoW(note, 12);
  return svg(W, H, `<path d="M3 12l7 6-7 6" stroke="${t.signal}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
<text x="20" y="23.5" class="mono" font-size="14.5" font-weight="700" fill="${t.text}">${esc(label)}</text>
<line x1="${(32 + lw).toFixed(1)}" y1="18" x2="${(W - nw - 14).toFixed(1)}" y2="18" stroke="${t.line}" stroke-dasharray="2 5"/>
<text x="${W}" y="22.5" text-anchor="end" class="mono" font-size="12" fill="${t.faint}">${esc(note)}</text>`);
}

// Olay akışı: her satır bir olay (anahtar + açıklama); "building" mercan, diğerleri turkuaz.
function events(L, t) {
  const W = 900, row = 46, top = 16;
  const H = top * 2 + L.events.length * row - 6;
  const rows = L.events.map(([k, v], i) => {
    const y = top + i * row;
    const c = i === 0 ? t.queue : t.signal;
    const kw = monoW(k, 12.5) + 22;
    return `<g>
  <circle cx="30" cy="${y + 18}" r="${i === 0 ? 5 : 4}" fill="${i === 0 ? c : t.panel2}" stroke="${c}" stroke-width="2"/>
  ${i === 0 ? `<circle cx="30" cy="${y + 18}" r="10" stroke="${c}" stroke-width="1.2" class="ping"/>` : ''}
  <rect x="52" y="${y + 5}" width="${kw.toFixed(1)}" height="26" rx="7" fill="${c}" opacity="${i === 0 ? 0.16 : 0.1}"/>
  <text x="${(52 + kw / 2).toFixed(1)}" y="${y + 22.5}" text-anchor="middle" class="mono" font-size="12.5" font-weight="700" fill="${c}">${esc(k)}</text>
  <text x="182" y="${y + 23}" class="sans" font-size="15" fill="${t.text}">${esc(v)}</text>
</g>`;
  }).join('\n');
  const css = `.ping{transform-origin:center;transform-box:fill-box;animation:ping 2.4s ease-out infinite}
@keyframes ping{0%{opacity:.9;transform:scale(.6)}100%{opacity:0;transform:scale(1.9)}}`;
  return svg(W, H, `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="18" fill="${t.panel}" stroke="${t.line}"/>
<line x1="30" y1="${top + 18}" x2="30" y2="${top + 18 + (L.events.length - 1) * row}" stroke="${t.line}" stroke-width="2"/>
${rows}`, css);
}

// Servis kartı: durum, ad, iki satır açıklama, teknolojiler.
function service(p, desc, L, t) {
  const W = 440, H = 182;
  const c = p.active ? t.queue : t.signal;
  const status = p.active ? L.status.active : L.status.stable;
  const sw = monoW(status, 11) + 30;
  let x = 22;
  const chips = p.chips.map((label) => { const ch = chip(x, 136, label, t, { h: 24, size: 12 }); x += ch.w + 7; return ch.el; }).join('');
  const name = p.repo.length > 24 ? 22 : 24;
  const css = p.active ? `.ping{transform-origin:center;transform-box:fill-box;animation:ping 2.4s ease-out infinite}
@keyframes ping{0%{opacity:.9;transform:scale(.6)}100%{opacity:0;transform:scale(2.2)}}` : '';
  return svg(W, H, `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="16" fill="${t.panel}" stroke="${t.line}"/>
<rect x="1" y="22" width="3.5" height="44" rx="1.75" fill="${c}"/>
<rect x="22" y="20" width="${sw.toFixed(1)}" height="22" rx="11" fill="${c}" opacity=".12"/>
<circle cx="34" cy="31" r="3.6" fill="${c}"/>
${p.active ? `<circle cx="34" cy="31" r="6" stroke="${c}" stroke-width="1.2" class="ping"/>` : ''}
<text x="44" y="35" class="mono" font-size="11" font-weight="700" fill="${c}">${esc(status)}</text>
<path d="M${W - 36} 25l9 9-9 9" stroke="${t.faint}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<text x="22" y="${name === 24 ? 78 : 77}" class="sans" font-size="${name}" font-weight="750" letter-spacing="-.6" fill="${t.text}">${esc(p.repo)}</text>
<text x="22" y="103" class="sans" font-size="13.5" fill="${t.muted}">${esc(desc[0])}</text>
<text x="22" y="122" class="sans" font-size="13.5" fill="${t.muted}">${esc(desc[1])}</text>
${chips}`, css);
}

// Teknoloji şeritleri: soldaki veri yolu boyunca paketler aşağı akar; her şerit bir katman.
function stack(L, t) {
  const W = 900, chipX = 250, maxX = W - 22, lineH = 36;
  let y = 22;
  const lanes = [];
  SHARED.lanes.forEach((labels, i) => {
    const rows = [[]];
    let x = chipX;
    for (const label of labels) {
      const w = Math.round(sansW(label, 13) + 24);
      if (x + w > maxX && rows.at(-1).length) { rows.push([]); x = chipX; }
      rows.at(-1).push({ label, x });
      x += w + 8;
    }
    const h = rows.length * lineH + 18;
    lanes.push({ i, y, h, rows });
    y += h + 10;
  });
  const H = y + 12;
  const busX = 34;
  const body = lanes.map(({ i, y: ly, h, rows }) => {
    const mid = ly + h / 2;
    const [name, note] = L.lanes[i];
    const chips = rows.map((r, ri) => r.map(({ label, x }) => chip(x, ly + 9 + ri * lineH, label, t, { h: 28, size: 13 }).el).join('')).join('');
    return `<g>
  <rect x="64" y="${ly}" width="${W - 64 - 8}" height="${h}" rx="14" fill="${t.panel2}" stroke="${t.line}"/>
  <line x1="${busX}" y1="${mid}" x2="64" y2="${mid}" stroke="${t.line}" stroke-width="1.4"/>
  <circle cx="${busX}" cy="${mid}" r="6" fill="${t.panel}" stroke="${t.signal}" stroke-width="2.2"/>
  <text x="86" y="${mid - 3}" class="mono" font-size="12.5" font-weight="700" letter-spacing="1.4" fill="${t.signal}">${esc(name)}</text>
  <text x="86" y="${mid + 15}" class="sans" font-size="12.5" fill="${t.muted}">${esc(note)}</text>
  ${chips}
</g>`;
  }).join('\n');
  const first = lanes[0], last = lanes.at(-1);
  const y1 = first.y + first.h / 2, y2 = last.y + last.h / 2;
  return svg(W, H, `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="20" fill="${t.panel}" stroke="${t.line}"/>
<path id="bus" d="M${busX} ${y1 - 10} L${busX} ${y2 + 10}" stroke="${t.line}" stroke-width="2"/>
${packet('bus', t.signal, 3.6, 0, false, 3.4)}${packet('bus', t.signal, 3.6, 1.2, false, 3.4)}${packet('bus', t.queue, 3.6, 2.4, false, 3.4)}
${body}`);
}

const ICONS = {
  globe: (c) => `<circle cx="11" cy="11" r="8.5" stroke="${c}" stroke-width="1.7"/><path d="M2.5 11h17M11 2.5c2.6 2.4 3.9 5.2 3.9 8.5s-1.3 6.1-3.9 8.5c-2.6-2.4-3.9-5.2-3.9-8.5S8.4 4.9 11 2.5z" stroke="${c}" stroke-width="1.7"/>`,
  linkedin: (c) => `<rect x="2" y="2" width="18" height="18" rx="4" stroke="${c}" stroke-width="1.7"/><path d="M7 9.5V15M7 6.8v.1M10.5 15v-3.2c0-1.5.9-2.3 2-2.3s1.9.8 1.9 2.3V15M10.5 9.5V15" stroke="${c}" stroke-width="1.7" stroke-linecap="round"/>`,
  instagram: (c) => `<rect x="2.5" y="2.5" width="17" height="17" rx="5" stroke="${c}" stroke-width="1.7"/><circle cx="11" cy="11" r="4" stroke="${c}" stroke-width="1.7"/><circle cx="15.8" cy="6.2" r="1" fill="${c}"/>`
};

function linkPill(l, t) {
  const H = 44;
  const W = Math.round(sansW(l.label, 14.5) + 82);
  return svg(W, H, `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="12" fill="${t.panel}" stroke="${t.line}"/>
<rect x="6" y="6" width="32" height="32" rx="9" fill="${t.signal}" opacity=".14"/>
<g transform="translate(11 11)">${ICONS[l.icon](t.signal)}</g>
<text x="50" y="27" class="sans" font-size="14.5" font-weight="650" fill="${t.text}">${esc(l.label)}</text>
<path d="M${W - 22} 17l6 5-6 5" stroke="${t.faint}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`);
}

// ------------------------------------------------------------------ yazım

const ASSETS = path.join(HERE, 'assets');
fs.rmSync(ASSETS, { recursive: true, force: true });
for (const d of ['', 'tr', 'en']) fs.mkdirSync(path.join(ASSETS, d), { recursive: true });
const write = (rel, content) => fs.writeFileSync(path.join(ASSETS, rel), content);

for (const [mode, t] of Object.entries(THEMES)) {
  for (const l of SHARED.links) write(`link-${l.id}-${mode}.svg`, linkPill(l, t));
  for (const [code, L] of Object.entries(LANG)) {
    write(`${code}/header-${mode}.svg`, header(L, t));
    write(`${code}/switch-${mode}.svg`, langSwitch(code, t));
    write(`${code}/events-${mode}.svg`, events(L, t));
    write(`${code}/stack-${mode}.svg`, stack(L, t));
    for (const [key, val] of Object.entries(L.sections)) write(`${code}/label-${key}-${mode}.svg`, sectionLabel(val, t));
    for (const p of SHARED.projects) write(`${code}/service-${p.repo}-${mode}.svg`, service(p, L.descs[p.repo], L, t));
  }
}

// ------------------------------------------------------------------ README

const pic = (dark, light, alt, attrs) => `<picture><source media="(prefers-color-scheme: dark)" srcset="${dark}"><img src="${light}" alt="${esc(alt)}" ${attrs}></picture>`;
const themed = (base, alt, attrs) => pic(`${base}-dark.svg`, `${base}-light.svg`, alt, attrs);

function statsUrls(dark, locale) {
  const c = dark
    ? 'title_color=34d8c3&text_color=8aa2b3&icon_color=ff8a65'
    : 'title_color=0d8a7b&text_color=506676&icon_color=d4552f';
  const common = `bg_color=00000000&hide_border=true&${c}&locale=${locale}`;
  return {
    stats: `https://github-readme-stats.vercel.app/api?username=${USER}&show_icons=true&rank_icon=percentile&${common}`,
    langs: `https://github-readme-stats.vercel.app/api/top-langs/?username=${USER}&layout=compact&langs_count=8&${common}`
  };
}

function readme(code) {
  const L = LANG[code];
  const other = code === 'tr' ? 'en' : 'tr';
  const A = `assets/${code}`;
  const sd = statsUrls(true, L.statsLocale), sl = statsUrls(false, L.statsLocale);
  const pairs = [];
  for (let i = 0; i < SHARED.projects.length; i += 2) pairs.push(SHARED.projects.slice(i, i + 2));
  return `<p align="right"><a href="${LANG_URL[other]}">${themed(`${A}/switch`, L.switchAlt, 'height="34"')}</a></p>

${themed(`${A}/header`, L.headerAlt, 'width="100%"')}

<p>
${SHARED.links.map((l) => `<a href="${l.href}">${themed(`assets/link-${l.id}`, l.label, 'height="44"')}</a>`).join('\n')}
</p>

<br/>

${themed(`${A}/label-events`, L.sections.events[0], 'width="100%"')}

<a href="https://github.com/${USER}/x-instagram-automation">${themed(`${A}/events`, L.eventsAlt, 'width="100%"')}</a>

<br/><br/>

${themed(`${A}/label-services`, L.sections.services[0], 'width="100%"')}

${pairs.map((pair) => `<p>
${pair.map((p) => `<a href="https://github.com/${USER}/${p.repo}">${themed(`${A}/service-${p.repo}`, `${p.repo} — ${L.descs[p.repo].join(' ')}`, 'width="49%"')}</a>`).join('\n')}
</p>`).join('\n')}

<sub><a href="https://github.com/${USER}?tab=repositories">${L.allRepos}</a></sub>

<br/><br/>

${themed(`${A}/label-stack`, L.sections.stack[0], 'width="100%"')}

${themed(`${A}/stack`, L.stackAlt, 'width="100%"')}

<sub>${L.stackNote}</sub>

<br/><br/>

${themed(`${A}/label-telemetry`, L.sections.telemetry[0], 'width="100%"')}

<p>
${pic(sd.stats, sl.stats, L.statsAlt, 'height="165"')}
${pic(sd.langs, sl.langs, L.langsAlt, 'height="165"')}
</p>

${pic(`https://raw.githubusercontent.com/${USER}/${USER}/output/github-snake-dark.svg`, `https://raw.githubusercontent.com/${USER}/${USER}/output/github-snake.svg`, L.snakeAlt, 'width="100%"')}

<p align="center"><sub>// ${L.footer}</sub></p>
`;
}

for (const code of Object.keys(LANG)) fs.writeFileSync(path.join(HERE, LANG[code].file), readme(code));
console.log('ok');
