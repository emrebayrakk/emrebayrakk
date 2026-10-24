// Profil README'si (Türkçe + İngilizce) ve SVG görselleri üretir. GitHub Action bunu birkaç saatte bir çalıştırır.
// Kullanım: node generate.mjs            (GITHUB_TOKEN varsa onu, yoksa git'in kayıtlı kimliğini kullanır)
//           node generate.mjs --offline  (yalnızca data/profile.json önbelleğinden üretir)
//   → README.md (TR), README.en.md (EN), assets/*.svg, assets/tr/*.svg, assets/en/*.svg, data/profile.json
// Dinamik kısımlar GitHub GraphQL'den gelir: pinned repolar, son commit'ler, dil dağılımı, katkı sayıları.
// Tasarım: bir IDE. Başlık bir editör penceresi, "şu an" bir terminal, pinned repolar dosya sekmeleri,
// diller bir analiz paneli, istatistikler bir derleme çıktısı. Her görselin açık ve koyu sürümü vardır.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const USER = 'emrebayrakk';
const SITE = 'https://emrebayrak.com.tr';
const OFFLINE = process.argv.includes('--offline');

// ------------------------------------------------------------------ DATA (elle düzenlenen kısım)

const SHARED = {
  first: 'Emre',
  last: 'Bayrak',
  role: '.NET Developer',
  links: [
    { id: 'web', label: 'emrebayrak.com.tr', href: SITE, icon: 'globe' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/eemmrree/', icon: 'linkedin' },
    { id: 'instagram', label: 'dev.emrebayrak', href: 'https://www.instagram.com/dev.emrebayrak/', icon: 'instagram' }
  ],
  // Araç zinciri: skillicons.dev kimlikleri (ikonlar data/icons altında önbelleğe alınır).
  toolchain: [
    ['languages', [['cs', 'C#'], ['java', 'Java'], ['go', 'Go'], ['ts', 'TypeScript'], ['js', 'JavaScript']]],
    ['backend', [['dotnet', '.NET'], ['nodejs', 'Node.js'], ['rabbitmq', 'RabbitMQ'], ['elasticsearch', 'Elastic']]],
    ['frontend', [['react', 'React'], ['angular', 'Angular'], ['electron', 'Electron']]],
    ['data', [['postgres', 'PostgreSQL'], ['mysql', 'MySQL'], ['mongodb', 'MongoDB'], ['redis', 'Redis']]],
    ['devops', [['docker', 'Docker'], ['githubactions', 'Actions'], ['azure', 'Azure'], ['git', 'Git'], ['visualstudio', 'VS'], ['vscode', 'VS Code']]]
  ]
};

const LANG = {
  tr: {
    file: 'README.md', locale: 'tr-TR',
    bio: ['Temiz mimari, dağıtık sistemler', 've ben uyurken çalışan araçlar.'],
    chips: ['localhost', "2021'den beri"],
    comment: '// .NET geliştirici · temiz mimari · dağıtık sistemler',
    lastPush: 'son push',
    headerAlt: 'Emre Bayrak — .NET Developer. Temiz mimari, dağıtık sistemler ve ben uyurken çalışan araçlar.',
    regions: { now: 'Şu an', pinned: 'Sabitlenen projeler', langs: 'Diller', tools: 'Araç zinciri', stats: 'İstatistik' },
    notes: { now: (n) => `son ${n} commit`, pinned: (n) => `${n} repo`, langs: (n) => `${n} public repo`, tools: () => 'stack', stats: () => 'son 12 ay' },
    nowTitle: 'git log — tüm repolar',
    nowAlt: (rows) => 'Son commit\'ler: ' + rows.map((r) => `${r.repo} (${r.message})`).join('; '),
    langsTitle: 'Dil dağılımı · tüm public repolar',
    langsAlt: (top) => 'Dil dağılımı: ' + top.map((l) => `${l.name} %${l.pct}`).join(', '),
    toolGroups: { languages: 'Diller', backend: 'Backend', frontend: 'Frontend', data: 'Veri', devops: 'DevOps & araçlar' },
    toolsAlt: 'Araç zinciri: C#, Java, Go, TypeScript, JavaScript, .NET, Node.js, RabbitMQ, Elasticsearch, React, Angular, Electron, PostgreSQL, MySQL, MongoDB, Redis, Docker, GitHub Actions, Azure, Git, Visual Studio, VS Code',
    stats: (s) => [
      `${fmt(s.contributions, 'tr-TR')} katkı · son 12 ay`,
      `${fmt(s.commits, 'tr-TR')} commit · ${s.langs} programlama dili`,
      `${fmt(s.repos, 'tr-TR')} public repo · ${fmt(s.stars, 'tr-TR')} yıldız`,
      `GitHub'da ${s.since}'den beri`
    ],
    buildOk: 'Derleme başarılı · 0 uyarı · 0 hata',
    statsAlt: (s) => `Son 12 ayda ${s.contributions} katkı, ${s.commits} commit, ${s.repos} public repo, ${s.stars} yıldız.`,
    updated: 'üretildi', stars: 'yıldız', updatedRepo: 'güncellendi',
    allRepos: 'tüm repolar →', snakeAlt: 'Katkı grafiği yılanı',
    switchAlt: 'Türkçe · Switch to English',
    footer: 'generate.mjs + GitHub Actions ile otomatik güncellenir'
  },
  en: {
    file: 'README.en.md', locale: 'en-US',
    bio: ['Clean architecture, distributed', 'systems and tools that run while I sleep.'],
    chips: ['localhost', 'since 2021'],
    comment: '// .NET developer · clean code · distributed systems',
    lastPush: 'last push',
    headerAlt: 'Emre Bayrak — .NET Developer. Clean architecture, distributed systems and tools that run while I sleep.',
    regions: { now: 'Now', pinned: 'Pinned projects', langs: 'Languages', tools: 'Toolchain', stats: 'Stats' },
    notes: { now: (n) => `last ${n} commits`, pinned: (n) => `${n} repos`, langs: (n) => `${n} public repos`, tools: () => 'stack', stats: () => 'last 12 months' },
    nowTitle: 'git log — all repositories',
    nowAlt: (rows) => 'Latest commits: ' + rows.map((r) => `${r.repo} (${r.message})`).join('; '),
    langsTitle: 'Language breakdown · all public repositories',
    langsAlt: (top) => 'Languages: ' + top.map((l) => `${l.name} ${l.pct}%`).join(', '),
    toolGroups: { languages: 'Languages', backend: 'Backend', frontend: 'Frontend', data: 'Data', devops: 'DevOps & tools' },
    toolsAlt: 'Toolchain: C#, Java, Go, TypeScript, JavaScript, .NET, Node.js, RabbitMQ, Elasticsearch, React, Angular, Electron, PostgreSQL, MySQL, MongoDB, Redis, Docker, GitHub Actions, Azure, Git, Visual Studio, VS Code',
    stats: (s) => [
      `${fmt(s.contributions, 'en-US')} contributions · last 12 months`,
      `${fmt(s.commits, 'en-US')} commits · ${s.langs} languages`,
      `${fmt(s.repos, 'en-US')} public repositories · ${fmt(s.stars, 'en-US')} stars`,
      `on GitHub since ${s.since}`
    ],
    buildOk: 'Build succeeded · 0 warnings · 0 errors',
    statsAlt: (s) => `${s.contributions} contributions in the last 12 months, ${s.commits} commits, ${s.repos} public repositories, ${s.stars} stars.`,
    updated: 'generated', stars: 'stars', updatedRepo: 'updated',
    allRepos: 'all repositories →', snakeAlt: 'Contribution snake',
    switchAlt: 'English · Türkçe sürüme geç',
    footer: 'auto-updated by generate.mjs + GitHub Actions'
  }
};

const LANG_URL = { tr: `https://github.com/${USER}`, en: `https://github.com/${USER}/${USER}/blob/main/README.en.md` };

// ------------------------------------------------------------------ tema

const THEMES = {
  dark: {
    win: '#10141b', chrome: '#0b0f15', panel: '#141922', line: '#232b37', gutter: '#4a5361', hl: '#161c26',
    text: '#d8dee8', muted: '#8d98a8', faint: '#5d6878',
    kw: '#ff7ab2', type: '#6bdcff', str: '#a8e26b', num: '#ffc66d', fn: '#b39dff', comment: '#6a7586',
    accent: '#6bdcff', onAccent: '#06141b', ok: '#5fd38d'
  },
  light: {
    win: '#ffffff', chrome: '#f3f5f8', panel: '#f8fafc', line: '#dde3ea', gutter: '#a3acb8', hl: '#f1f6fb',
    text: '#1c2532', muted: '#566373', faint: '#8a94a3',
    kw: '#c4206e', type: '#0a76a0', str: '#3b7a12', num: '#9b5d06', fn: '#6f42c1', comment: '#8a94a3',
    accent: '#0a76a0', onAccent: '#ffffff', ok: '#1a7f45'
  }
};

const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans',Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,'SF Mono','JetBrains Mono',Menlo,Consolas,'Liberation Mono',monospace";
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmt = (n, loc) => new Intl.NumberFormat(loc).format(n);
const sansW = (s, size) => [...s].reduce((w, c) => w + (/[A-ZÇĞİÖŞÜMW]/.test(c) ? 0.66 : /[ilıj.,'·|:;!]/.test(c) ? 0.3 : c === ' ' ? 0.3 : 0.56), 0) * size;
const monoW = (s, size) => [...s].length * size * 0.6;
const truncMono = (s, size, max) => { let t = String(s); if (monoW(t, size) <= max) return t; while (t && monoW(t + '…', size) > max) t = t.slice(0, -1); return t.trimEnd() + '…'; };
function wrapSans(text, size, max, lines) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const out = [''];
  for (const w of words) {
    const cand = out.at(-1) ? out.at(-1) + ' ' + w : w;
    if (sansW(cand, size) <= max || !out.at(-1)) out[out.length - 1] = cand;
    else out.push(w);
  }
  if (out.length > lines) { out.length = lines; let last = out[lines - 1]; while (sansW(last + '…', size) > max) last = last.slice(0, -1); out[lines - 1] = last.trimEnd() + '…'; }
  return out.filter(Boolean);
}

const svg = (w, h, body, css = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">
<style>
.sans{font-family:${SANS}}.mono{font-family:${MONO}}.pre{white-space:pre}
.caret{animation:blink 1.05s steps(1) infinite}@keyframes blink{50%{opacity:0}}
${css}
@media (prefers-reduced-motion: reduce){*{animation:none!important}}
</style>
${body}
</svg>
`;

// Pencere çerçevesi: başlık çubuğu, trafik ışıkları ve sekmeler/başlık.
function frame(x, y, w, h, t, { title = '', tabs = null, rx = 14 } = {}) {
  let s = `<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" rx="${rx}" fill="${t.win}" stroke="${t.line}"/>
<path d="M${x + 0.5} ${y + 34}V${y + rx}a${rx - 0.5} ${rx - 0.5} 0 0 1 ${rx - 0.5}-${rx - 0.5}H${x + w - rx}a${rx - 0.5} ${rx - 0.5} 0 0 1 ${rx - 0.5} ${rx - 0.5}V${y + 34}z" fill="${t.chrome}"/>
<line x1="${x}" y1="${y + 34}" x2="${x + w}" y2="${y + 34}" stroke="${t.line}"/>
<circle cx="${x + 18}" cy="${y + 17}" r="5" fill="#ff5f57"/><circle cx="${x + 35}" cy="${y + 17}" r="5" fill="#febc2e"/><circle cx="${x + 52}" cy="${y + 17}" r="5" fill="#28c840"/>`;
  if (tabs) {
    let tx = x + 72;
    for (const [label, on] of tabs) {
      const tw = monoW(label, 11.5) + 28;
      s += on
        ? `<path d="M${tx} ${y + 34}V${y + 10}a4 4 0 0 1 4-4H${tx + tw - 4}a4 4 0 0 1 4 4V${y + 34}z" fill="${t.win}" stroke="${t.line}"/><rect x="${tx + 1}" y="${y + 33}" width="${tw - 2}" height="3" fill="${t.win}"/><rect x="${tx + 1}" y="${y + 6}" width="${tw - 2}" height="2" fill="${t.accent}"/>`
        : '';
      s += `<text x="${tx + 14}" y="${y + 25}" class="mono" font-size="11.5" fill="${on ? t.text : t.faint}">${esc(label)}</text>`;
      tx += tw + 4;
    }
  } else if (title) {
    s += `<text x="${x + 72}" y="${y + 21.5}" class="mono" font-size="11.5" letter-spacing=".6" fill="${t.muted}">${esc(title)}</text>`;
  }
  return s;
}

// ------------------------------------------------------------------ görseller

function header(L, t, D) {
  const W = 900, H = 440;
  const wx = 352, wy = 18, ww = 546, wh = 404;
  const T = (type, text) => [type, text];
  const P = (s) => T('p', s);
  const code = [
    [T('c', L.comment)],
    [T('k', 'namespace'), P(' '), T('t', 'EmreBayrak'), P(';')],
    [],
    [T('k', 'public sealed record '), T('t', 'Developer'), P(' : '), T('t', 'IEngineer')],
    [P('{')],
    [P('    '), T('k', 'public '), T('t', 'string'), P(' Name     => '), T('s', '"Emre Bayrak"'), P(';')],
    [P('    '), T('k', 'public '), T('t', 'string'), P(' Role     => '), T('s', `"${SHARED.role}"`), P(';')],
    [P('    '), T('k', 'public '), T('t', 'string'), P(' Location => '), T('s', '"localhost"'), P(';')],
    [P('    '), T('k', 'public '), T('t', 'int'), P('    Since    => '), T('n', String(D.since)), P(';')],
    [P('    '), T('k', 'public '), T('t', 'string'), P('[] Stack => ['), T('s', '"C#"'), P(', '), T('s', '".NET"'), P(', '), T('s', '"React"'), P(', '), T('s', '"Go"'), P('];')],
    [],
    [P('    '), T('k', 'public '), T('t', 'Task'), P(' '), T('f', 'ShipAsync'), P('() => '), T('t', 'Tools'), P('.'), T('f', 'RunWhileISleepAsync'), P('();')],
    [P('}')]
  ];
  const color = { k: t.kw, t: t.type, s: t.str, n: t.num, f: t.fn, c: t.comment, p: t.text };
  const ex = wx + 40, top = wy + 34 + 30, lh = 21.5, size = 12.5;
  const active = 11;
  const lines = code.map((toks, i) => {
    const y = top + 16 + i * lh;
    const spans = toks.map(([k, s]) => `<tspan fill="${color[k]}"${k === 'c' ? ' font-style="italic"' : ''}>${esc(s)}</tspan>`).join('');
    const len = toks.reduce((a, [, s]) => a + [...s].length, 0);
    return `${i === active ? `<rect x="${ex}" y="${y - 15}" width="${wx + ww - ex - 1}" height="${lh}" fill="${t.hl}"/>` : ''}
<text x="${ex + 30}" y="${y}" text-anchor="end" class="mono" font-size="11.5" fill="${i === active ? t.muted : t.gutter}">${i + 1}</text>
<text x="${ex + 44}" y="${y}" class="mono pre" xml:space="preserve" font-size="${size}">${spans}</text>
${i === active ? `<rect x="${(ex + 45 + len * size * 0.6).toFixed(1)}" y="${y - 12}" width="2" height="16" fill="${t.accent}" class="caret"/>` : ''}`;
  }).join('\n');
  // etkinlik çubuğu
  const act = [0, 1, 2, 3].map((i) => {
    const y = wy + 34 + 18 + i * 38;
    const on = i === 0;
    const icons = [
      `<path d="M-6-8h8l4 4v12h-12z" stroke="currentColor" stroke-width="1.6"/>`,
      `<circle cx="-1" cy="-1" r="5.5" stroke="currentColor" stroke-width="1.6"/><path d="M3 3l4.5 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`,
      `<circle cx="-4" cy="-6" r="2.2" stroke="currentColor" stroke-width="1.5"/><circle cx="-4" cy="7" r="2.2" stroke="currentColor" stroke-width="1.5"/><circle cx="5" cy="-1" r="2.2" stroke="currentColor" stroke-width="1.5"/><path d="M-4-3.8v8.6M5 1.2c0 3-4 3-8 3.6" stroke="currentColor" stroke-width="1.5"/>`,
      `<path d="M-5-7l11 7-11 7z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>`
    ][i];
    return `<g transform="translate(${wx + 20} ${y + 10})" color="${on ? t.text : t.faint}">${icons}</g>${on ? `<rect x="${wx + 1}" y="${y - 2}" width="2" height="24" fill="${t.accent}"/>` : ''}`;
  }).join('');
  const sb = wy + wh - 26;
  const push = D.recent[0];
  const right = push ? `↑ ${L.lastPush}: ${push.repo} · ${push.when}` : '';
  const body = `
<text x="6" y="64" class="mono" font-size="12.5" fill="${t.faint}"><tspan fill="${t.accent}">~/${USER}</tspan>  ⎇ main</text>
<text x="0" y="150" class="sans" font-size="76" font-weight="800" letter-spacing="-3.4" fill="${t.text}">${SHARED.first}</text>
<text x="0" y="226" class="sans" font-size="76" font-weight="800" letter-spacing="-3.4" fill="${t.text}">${SHARED.last}</text>
<rect x="${(sansW(SHARED.last, 76) - 3.4 * SHARED.last.length + 10).toFixed(1)}" y="170" width="14" height="56" fill="${t.accent}" class="caret"/>
<text x="4" y="266" class="mono" font-size="15" font-weight="700" fill="${t.accent}">${esc(SHARED.role)}</text>
${L.bio.map((b, i) => `<text x="4" y="${296 + i * 23}" class="sans" font-size="15.5" fill="${t.muted}">${esc(b)}</text>`).join('')}
${(() => { let x = 4; return L.chips.map((c) => { const w = monoW(c, 11.5) + 22; const s = `<rect x="${x}" y="356" width="${w}" height="26" rx="7" fill="${t.panel}" stroke="${t.line}"/><text x="${x + 11}" y="373" class="mono" font-size="11.5" fill="${t.muted}">${esc(c)}</text>`; x += w + 8; return s; }).join(''); })()}
${frame(wx, wy, ww, wh, t, { tabs: [['Profile.cs', true], ['Stack.json', false], ['README.md', false]] })}
<rect x="${wx + 1}" y="${wy + 35}" width="38" height="${wh - 62}" fill="${t.chrome}"/>
<line x1="${wx + 39}" y1="${wy + 35}" x2="${wx + 39}" y2="${sb}" stroke="${t.line}"/>
${act}
<text x="${ex + 14}" y="${wy + 52}" class="mono" font-size="11" fill="${t.faint}">EmreBayrak › Developer.cs › <tspan fill="${t.muted}">ShipAsync()</tspan></text>
${lines}
<path d="M${wx + 0.5} ${sb}H${wx + ww - 0.5}V${wy + wh - 14}a13.5 13.5 0 0 1-13.5 13.5H${wx + 14}a13.5 13.5 0 0 1-13.5-13.5z" fill="${t.accent}"/>
<text x="${wx + 14}" y="${sb + 17}" class="mono" font-size="11" font-weight="600" fill="${t.onAccent}">⎇ main   ✓ 0</text>
<text x="${wx + ww - 14}" y="${sb + 17}" text-anchor="end" class="mono" font-size="11" fill="${t.onAccent}">${esc(truncMono(right, 11, ww - 150))}</text>`;
  return svg(W, H, body);
}

function langSwitch(active, t) {
  const W = 124, H = 34;
  const seg = (code, x) => {
    const on = code === active;
    return `<rect x="${x}" y="4" width="56" height="26" rx="7" fill="${on ? t.accent : 'none'}"/>` +
      `<text x="${x + 28}" y="21.5" text-anchor="middle" class="mono" font-size="12" font-weight="700" letter-spacing="1.2" fill="${on ? t.onAccent : t.muted}">${code.toUpperCase()}</text>`;
  };
  return svg(W, H, `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="10" fill="${t.win}" stroke="${t.line}"/>${seg('tr', 5)}${seg('en', 63)}`);
}

// Bölüm başlığı: "#region Sabitlenen projeler ········ // 6 repo"
function region(name, note, t) {
  const W = 900, H = 34;
  const x2 = 20 + monoW('#region ', 14) + monoW(name, 14);
  const nw = monoW('// ' + note, 12.5);
  return svg(W, H, `<text x="2" y="22" class="mono pre" xml:space="preserve" font-size="14"><tspan fill="${t.kw}">#region</tspan><tspan fill="${t.text}" font-weight="700"> ${esc(name)}</tspan></text>
<line x1="${x2.toFixed(1)}" y1="17" x2="${(W - nw - 14).toFixed(1)}" y2="17" stroke="${t.line}" stroke-dasharray="1 6" stroke-linecap="round" stroke-width="2"/>
<text x="${W - 2}" y="21.5" text-anchor="end" class="mono" font-size="12.5" font-style="italic" fill="${t.comment}">// ${esc(note)}</text>`);
}

// Terminal: son commit'ler.
function terminal(L, t, D) {
  const rows = D.recent;
  const W = 900, rh = 30, top = 34 + 30;
  const H = top + 26 + rows.length * rh + 46;
  const tabs = ['TERMINAL', 'OUTPUT', 'PROBLEMS'];
  let tx = 72;
  const tabEls = tabs.map((n, i) => { const s = `<text x="${tx}" y="22" class="mono" font-size="11" letter-spacing="1" font-weight="${i ? 400 : 700}" fill="${i ? t.faint : t.text}">${n}</text>${i ? '' : `<rect x="${tx}" y="31" width="${monoW(n, 11) + 10}" height="2" fill="${t.accent}"/>`}`; tx += monoW(n, 11) + 30; return s; }).join('');
  const body = rows.map((r, i) => {
    const y = top + 30 + i * rh;
    const msg = truncMono(r.message, 12.5, 860 - 330 - monoW(r.when, 12) - 24);
    return `<text x="24" y="${y}" class="mono" font-size="12.5" fill="${t.num}">${esc(r.oid)}</text>
<circle cx="${100}" cy="${y - 4.5}" r="5" fill="${r.color || t.faint}"/>
<text x="114" y="${y}" class="mono" font-size="12.5" font-weight="700" fill="${t.type}">${esc(truncMono(r.repo, 12.5, 200))}</text>
<text x="330" y="${y}" class="mono" font-size="12.5" fill="${t.text}">${esc(msg)}</text>
<text x="876" y="${y}" text-anchor="end" class="mono" font-size="12" fill="${t.faint}">${esc(r.when)}</text>`;
  }).join('\n');
  const endY = top + 30 + rows.length * rh + 6;
  return svg(W, H, `${frame(0, 0, W, H, t)}
${tabEls}
<text x="${W - 18}" y="22" text-anchor="end" class="mono" font-size="11" fill="${t.faint}">${esc(L.nowTitle)}</text>
<text x="24" y="${top}" class="mono pre" xml:space="preserve" font-size="12.5"><tspan fill="${t.ok}">❯</tspan><tspan fill="${t.text}"> git log </tspan><tspan fill="${t.str}">--author=${USER}</tspan><tspan fill="${t.text}"> --all-repos -n ${rows.length}</tspan></text>
${body}
<text x="24" y="${endY + 10}" class="mono" font-size="12.5" fill="${t.ok}">❯</text>
<rect x="38" y="${endY - 1}" width="8" height="15" fill="${t.text}" class="caret"/>`);
}

// Pinned repo kartı: dosya sekmesi + açıklama + dil çubuğu.
function pinned(p, L, t) {
  const W = 440, H = 216;
  const total = p.languages.reduce((a, l) => a + l.size, 0) || 1;
  let bx = 20;
  const bar = p.languages.map((l) => { const w = Math.max(3, (l.size / total) * 400); const s = `<rect x="${bx.toFixed(1)}" y="152" width="${w.toFixed(1)}" height="7" fill="${l.color || t.faint}"/>`; bx += w; return s; }).join('');
  let lx = 20;
  const legend = p.languages.slice(0, 3).map((l) => {
    const label = `${l.name} ${((l.size / total) * 100).toFixed(1)}%`;
    const s = `<circle cx="${lx + 4}" cy="${178.5}" r="4" fill="${l.color || t.faint}"/><text x="${lx + 13}" y="182.5" class="mono" font-size="11" fill="${t.muted}">${esc(label)}</text>`;
    lx += monoW(label, 11) + 30;
    return s;
  }).join('');
  const desc = wrapSans(p.description || '—', 13.5, 400, 3);
  const meta = `★ ${p.stars}   ⑂ ${p.forks}`;
  const name = truncMono(p.name, 13.5, 400 - monoW(meta, 11.5) - 50);
  return svg(W, H, `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="12" fill="${t.win}" stroke="${t.line}"/>
<path d="M.5 38V12A11.5 11.5 0 0 1 12 .5H428A11.5 11.5 0 0 1 439.5 12V38z" fill="${t.chrome}"/>
<line x1="0" y1="38" x2="${W}" y2="38" stroke="${t.line}"/>
<g transform="translate(18 12)" stroke="${t.muted}" stroke-width="1.5" stroke-linejoin="round"><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1H12v12H2.5A1.5 1.5 0 0 0 1 14.5z"/><path d="M1 14.5A1.5 1.5 0 0 1 2.5 13H12v2.5H2.5"/></g>
<text x="40" y="24" class="mono" font-size="13.5" font-weight="700" fill="${t.text}">${esc(name)}</text>
<text x="${W - 18}" y="24" text-anchor="end" class="mono" font-size="11.5" fill="${t.muted}">${esc(meta)}</text>
${desc.map((d, i) => `<text x="20" y="${68 + i * 21}" class="sans" font-size="13.5" fill="${t.muted}">${esc(d)}</text>`).join('')}
<clipPath id="b"><rect x="20" y="152" width="400" height="7" rx="3.5"/></clipPath>
<g clip-path="url(#b)">${bar}</g>
${legend}
<text x="20" y="205" class="mono" font-size="10.5" fill="${t.faint}">${esc(L.updatedRepo)} ${esc(p.when)}</text>`);
}

// Dil dağılımı: yığılmış çubuk + iki sütunlu tablo.
function languages(L, t, D) {
  const W = 900;
  const top = D.languages.slice(0, 8);
  const rows = Math.ceil(top.length / 2);
  const H = 34 + 100 + rows * 34 + 18;
  let bx = 24;
  const bar = D.languages.map((l) => { const w = (l.pct / 100) * 852; const s = `<rect x="${bx.toFixed(1)}" y="88" width="${Math.max(w, 2).toFixed(1)}" height="12" fill="${l.color || t.faint}"/>`; bx += w; return s; }).join('');
  const cells = top.map((l, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 24 + col * 438, y = 140 + row * 34;
    return `<circle cx="${x + 6}" cy="${y - 4}" r="5.5" fill="${l.color || t.faint}"/>
<text x="${x + 20}" y="${y}" class="mono" font-size="13" font-weight="600" fill="${t.text}">${esc(l.name)}</text>
<rect x="${x + 170}" y="${y - 8}" width="180" height="6" rx="3" fill="${t.panel}" stroke="${t.line}" stroke-width=".8"/>
<rect x="${x + 170}" y="${y - 8}" width="${Math.max(3, (l.pct / top[0].pct) * 180).toFixed(1)}" height="6" rx="3" fill="${l.color || t.faint}"/>
<text x="${x + 410}" y="${y}" text-anchor="end" class="mono" font-size="12.5" fill="${t.muted}">${l.pct.toFixed(1)}%</text>`;
  }).join('\n');
  return svg(W, H, `${frame(0, 0, W, H, t, { title: 'ANALYZER · ' + L.langsTitle })}
<text x="24" y="70" class="mono" font-size="12" fill="${t.comment}" font-style="italic">// ${esc(fmt(Math.round(D.totalBytes / 1024), L.locale))} KB · ${esc(L.notes.langs(D.stats.repos))}</text>
<clipPath id="lb"><rect x="24" y="88" width="852" height="12" rx="6"/></clipPath>
<g clip-path="url(#lb)">${bar}</g>
${cells}`);
}

// Araç zinciri: gruplar halinde ikonlar (ikonlar SVG içine gömülü).
function toolchain(L, t, icons) {
  const W = 900, rowH = 84, x0 = 210;
  const H = 34 + 18 + SHARED.toolchain.length * rowH + 6;
  const rows = SHARED.toolchain.map(([group, items], r) => {
    const y = 34 + 18 + r * rowH;
    const label = L.toolGroups[group];
    const icons_ = items.map(([id, name], i) => {
      const x = x0 + i * 112;
      const data = icons[id] ? `data:image/svg+xml;base64,${Buffer.from(icons[id]).toString('base64')}` : '';
      return `${data ? `<image x="${x + 28}" y="${y + 6}" width="40" height="40" href="${data}"/>` : ''}
<text x="${x + 48}" y="${y + 64}" text-anchor="middle" class="mono" font-size="11" fill="${t.muted}">${esc(name)}</text>`;
    }).join('');
    return `${r ? `<line x1="24" y1="${y - 4}" x2="${W - 24}" y2="${y - 4}" stroke="${t.line}" stroke-dasharray="2 5"/>` : ''}
<text x="24" y="${y + 32}" class="mono pre" xml:space="preserve" font-size="12.5"><tspan fill="${t.kw}">using</tspan><tspan fill="${t.type}"> ${esc(label)}</tspan><tspan fill="${t.text}">;</tspan></text>
${icons_}`;
  }).join('\n');
  return svg(W, H, `${frame(0, 0, W, H, t, { title: 'Stack.json' })}
${rows}`);
}

// Derleme çıktısı: katkı sayıları.
function stats(L, t, D) {
  const W = 900;
  const lines = L.stats(D.stats);
  const H = 34 + 30 + lines.length * 28 + 70;
  const body = lines.map((s, i) => `<text x="40" y="${34 + 58 + i * 28}" class="mono pre" xml:space="preserve" font-size="13"><tspan fill="${t.ok}">✓</tspan><tspan fill="${t.text}">  ${esc(s)}</tspan></text>`).join('\n');
  const yEnd = 34 + 58 + lines.length * 28 + 14;
  return svg(W, H, `${frame(0, 0, W, H, t, { title: 'OUTPUT · Build' })}
<text x="24" y="${34 + 30}" class="mono pre" xml:space="preserve" font-size="13"><tspan fill="${t.ok}">❯</tspan><tspan fill="${t.text}"> dotnet build </tspan><tspan fill="${t.str}">${USER}.csproj</tspan></text>
${body}
<rect x="24" y="${yEnd}" width="${W - 48}" height="34" rx="8" fill="${t.ok}" opacity=".12"/>
<text x="40" y="${yEnd + 22}" class="mono" font-size="13" font-weight="700" fill="${t.ok}">${esc(L.buildOk)}</text>`);
}

const ICONS = {
  globe: (c) => `<circle cx="11" cy="11" r="8.5" stroke="${c}" stroke-width="1.7"/><path d="M2.5 11h17M11 2.5c2.6 2.4 3.9 5.2 3.9 8.5s-1.3 6.1-3.9 8.5c-2.6-2.4-3.9-5.2-3.9-8.5S8.4 4.9 11 2.5z" stroke="${c}" stroke-width="1.7"/>`,
  linkedin: (c) => `<rect x="2" y="2" width="18" height="18" rx="4" stroke="${c}" stroke-width="1.7"/><path d="M7 9.5V15M7 6.8v.1M10.5 15v-3.2c0-1.5.9-2.3 2-2.3s1.9.8 1.9 2.3V15M10.5 9.5V15" stroke="${c}" stroke-width="1.7" stroke-linecap="round"/>`,
  instagram: (c) => `<rect x="2.5" y="2.5" width="17" height="17" rx="5" stroke="${c}" stroke-width="1.7"/><circle cx="11" cy="11" r="4" stroke="${c}" stroke-width="1.7"/><circle cx="15.8" cy="6.2" r="1" fill="${c}"/>`
};

function linkPill(l, t) {
  const H = 42;
  const W = Math.round(monoW(l.label, 13) + 74);
  return svg(W, H, `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="10" fill="${t.win}" stroke="${t.line}"/>
<g transform="translate(12 10)">${ICONS[l.icon](t.accent)}</g>
<text x="44" y="26" class="mono" font-size="13" font-weight="600" fill="${t.text}">${esc(l.label)}</text>
<text x="${W - 14}" y="26" text-anchor="end" class="mono" font-size="13" fill="${t.faint}">↗</text>`);
}

// ------------------------------------------------------------------ veri

function token() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  const r = spawnSync('git', ['credential', 'fill'], { input: 'protocol=https\nhost=github.com\n\n', encoding: 'utf8' });
  const m = /^password=(.*)$/m.exec(String(r.stdout || ''));
  return m ? m[1].trim() : '';
}

const QUERY = `query($login:String!){ user(login:$login){
  createdAt
  pinnedItems(first:6, types:REPOSITORY){ nodes{ ... on Repository { name description url stargazerCount forkCount pushedAt
    languages(first:6, orderBy:{field:SIZE, direction:DESC}){ edges{ size node{ name color } } } } } }
  recent: repositories(first:15, ownerAffiliations:OWNER, privacy:PUBLIC, isFork:false, orderBy:{field:PUSHED_AT, direction:DESC}){ nodes{ name url pushedAt primaryLanguage{ name color }
    defaultBranchRef{ target{ ... on Commit { history(first:1){ nodes{ abbreviatedOid messageHeadline committedDate } } } } } } }
  all: repositories(first:100, ownerAffiliations:OWNER, privacy:PUBLIC, isFork:false){ totalCount nodes{ name stargazerCount
    languages(first:10){ edges{ size node{ name color } } } } }
  contributionsCollection{ totalCommitContributions totalPullRequestContributions contributionCalendar{ totalContributions } }
} }`;

async function fetchRaw() {
  const tok = token();
  if (!tok) throw new Error('no token');
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json', 'User-Agent': `${USER}-profile` },
    body: JSON.stringify({ query: QUERY, variables: { login: USER } })
  });
  const j = await res.json();
  if (!res.ok || j.errors || !j.data || !j.data.user) throw new Error('graphql: ' + res.status + ' ' + JSON.stringify(j.errors || j.message || ''));
  return j.data.user;
}

async function fetchIcons() {
  const dir = path.join(HERE, 'data', 'icons');
  fs.mkdirSync(dir, { recursive: true });
  const out = {};
  for (const [, items] of SHARED.toolchain) {
    for (const [id] of items) {
      const f = path.join(dir, `${id}.svg`);
      if (!fs.existsSync(f) && !OFFLINE) {
        try {
          const r = await fetch(`https://skillicons.dev/icons?i=${id}`);
          const s = await r.text();
          if (r.ok && s.length > 400) fs.writeFileSync(f, s);
        } catch { /* ikon yoksa ad yazılır */ }
      }
      if (fs.existsSync(f)) out[id] = fs.readFileSync(f, 'utf8');
    }
  }
  return out;
}

function shape(u) {
  const recent = u.recent.nodes
    .filter((r) => r.name !== USER && r.defaultBranchRef && r.defaultBranchRef.target && r.defaultBranchRef.target.history.nodes[0])
    .map((r) => { const c = r.defaultBranchRef.target.history.nodes[0]; return { repo: r.name, color: r.primaryLanguage && r.primaryLanguage.color, oid: c.abbreviatedOid, message: c.messageHeadline, at: c.committedDate }; })
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 5);
  const pins = u.pinnedItems.nodes.map((p) => ({
    name: p.name, url: p.url, description: p.description, stars: p.stargazerCount, forks: p.forkCount, at: p.pushedAt,
    languages: p.languages.edges.map((e) => ({ name: e.node.name, color: e.node.color, size: e.size }))
  }));
  const bytes = {};
  const colors = {};
  let stars = 0;
  for (const r of u.all.nodes) {
    if (r.name === USER) continue;
    stars += r.stargazerCount;
    for (const e of r.languages.edges) { bytes[e.node.name] = (bytes[e.node.name] || 0) + e.size; colors[e.node.name] = e.node.color; }
  }
  const totalBytes = Object.values(bytes).reduce((a, b) => a + b, 0) || 1;
  const languages = Object.entries(bytes).sort((a, b) => b[1] - a[1]).map(([name, size]) => ({ name, color: colors[name], pct: (size / totalBytes) * 100 }));
  const cc = u.contributionsCollection;
  return {
    since: new Date(u.createdAt).getUTCFullYear(),
    recent, pins, languages, totalBytes,
    stats: { contributions: cc.contributionCalendar.totalContributions, commits: cc.totalCommitContributions, prs: cc.totalPullRequestContributions, repos: u.all.totalCount, stars, langs: languages.length, since: new Date(u.createdAt).getUTCFullYear() }
  };
}

// Gün düzeyinde göreli zaman (her çalıştırmada değişmesin diye saat yok).
function when(iso, locale, now) {
  const days = Math.floor((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - Date.parse(iso.slice(0, 10))) / 864e5);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  if (days < 30) return rtf.format(-days, 'day');
  if (days < 365) return rtf.format(-Math.round(days / 30), 'month');
  return rtf.format(-Math.round(days / 365), 'year');
}

// ------------------------------------------------------------------ yazım

const cacheFile = path.join(HERE, 'data', 'profile.json');
let raw;
if (OFFLINE) raw = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
else {
  try {
    raw = await fetchRaw();
    fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
    fs.writeFileSync(cacheFile, JSON.stringify(raw, null, 1) + '\n');
  } catch (e) {
    console.warn('GitHub API kullanılamadı, önbellek kullanılıyor:', e.message);
    raw = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  }
}
const base = shape(raw);
const icons = await fetchIcons();
const now = new Date();

const ASSETS = path.join(HERE, 'assets');
fs.rmSync(ASSETS, { recursive: true, force: true });
for (const d of ['', 'tr', 'en']) fs.mkdirSync(path.join(ASSETS, d), { recursive: true });
const write = (rel, content) => fs.writeFileSync(path.join(ASSETS, rel), content);

const localized = {};
for (const [code, L] of Object.entries(LANG)) {
  localized[code] = {
    ...base,
    recent: base.recent.map((r) => ({ ...r, when: when(r.at, L.locale, now) })),
    pins: base.pins.map((p) => ({ ...p, when: when(p.at, L.locale, now) }))
  };
}

for (const [mode, t] of Object.entries(THEMES)) {
  for (const l of SHARED.links) write(`link-${l.id}-${mode}.svg`, linkPill(l, t));
  for (const [code, L] of Object.entries(LANG)) {
    const D = localized[code];
    write(`${code}/header-${mode}.svg`, header(L, t, D));
    write(`${code}/switch-${mode}.svg`, langSwitch(code, t));
    write(`${code}/now-${mode}.svg`, terminal(L, t, D));
    write(`${code}/languages-${mode}.svg`, languages(L, t, D));
    write(`${code}/toolchain-${mode}.svg`, toolchain(L, t, icons));
    write(`${code}/stats-${mode}.svg`, stats(L, t, D));
    const notes = { now: D.recent.length, pinned: D.pins.length, langs: D.stats.repos, tools: 0, stats: 0 };
    for (const key of Object.keys(L.regions)) write(`${code}/region-${key}-${mode}.svg`, region(L.regions[key], L.notes[key](notes[key]), t));
    for (const p of D.pins) write(`${code}/pin-${p.name}-${mode}.svg`, pinned(p, L, t));
  }
}

const pic = (dark, light, alt, attrs) => `<picture><source media="(prefers-color-scheme: dark)" srcset="${dark}"><img src="${light}" alt="${esc(alt)}" ${attrs}></picture>`;
const themed = (b, alt, attrs) => pic(`${b}-dark.svg`, `${b}-light.svg`, alt, attrs);

function readme(code) {
  const L = LANG[code];
  const D = localized[code];
  const other = code === 'tr' ? 'en' : 'tr';
  const A = `assets/${code}`;
  const pairs = [];
  for (let i = 0; i < D.pins.length; i += 2) pairs.push(D.pins.slice(i, i + 2));
  const top = D.languages.slice(0, 6).map((l) => ({ name: l.name, pct: l.pct.toFixed(1) }));
  return `<!-- Bu dosya generate.mjs tarafından üretilir; elle düzenleme. / Generated by generate.mjs; do not edit by hand. -->
<p align="right"><a href="${LANG_URL[other]}">${themed(`${A}/switch`, L.switchAlt, 'height="34"')}</a></p>

${themed(`${A}/header`, L.headerAlt, 'width="100%"')}

<p>
${SHARED.links.map((l) => `<a href="${l.href}">${themed(`assets/link-${l.id}`, l.label, 'height="42"')}</a>`).join('\n')}
</p>

${themed(`${A}/region-now`, L.regions.now, 'width="100%"')}

<a href="https://github.com/${USER}?tab=repositories&sort=updated">${themed(`${A}/now`, L.nowAlt(D.recent), 'width="100%"')}</a>

${themed(`${A}/region-pinned`, L.regions.pinned, 'width="100%"')}

${pairs.map((pair) => `<p>
${pair.map((p) => `<a href="${p.url}">${themed(`${A}/pin-${p.name}`, `${p.name} — ${p.description || ''}`, 'width="49%"')}</a>`).join('\n')}
</p>`).join('\n')}

<sub><a href="https://github.com/${USER}?tab=repositories">${L.allRepos}</a></sub>

${themed(`${A}/region-langs`, L.regions.langs, 'width="100%"')}

${themed(`${A}/languages`, L.langsAlt(top), 'width="100%"')}

${themed(`${A}/region-tools`, L.regions.tools, 'width="100%"')}

${themed(`${A}/toolchain`, L.toolsAlt, 'width="100%"')}

${themed(`${A}/region-stats`, L.regions.stats, 'width="100%"')}

${themed(`${A}/stats`, L.statsAlt(D.stats), 'width="100%"')}

${pic(`https://raw.githubusercontent.com/${USER}/${USER}/output/github-snake-dark.svg`, `https://raw.githubusercontent.com/${USER}/${USER}/output/github-snake.svg`, L.snakeAlt, 'width="100%"')}

<p align="center"><sub>// ${L.footer} · ${L.updated} ${now.toISOString().slice(0, 10)}</sub></p>
`;
}

for (const code of Object.keys(LANG)) fs.writeFileSync(path.join(HERE, LANG[code].file), readme(code));
console.log(`ok · ${base.pins.length} pinned · ${base.recent.length} recent · ${base.languages.length} languages`);
