// E2E verify: marquee Contact (2 arah) + background animasi (grid/aura/2 orb) + tombol Motion.
// Fase A: OS emulate "prefers-reduced-motion: reduce" (kondisi user asli):
//   default NYALA, klik OFF -> semua dekorasi berhenti, reload -> persist, klik ON -> jalan lagi.
// Fase B: media normal, tanpa preferensi -> default NYALA.
// Fase C: media normal + klik OFF -> harus berhenti juga (regression: dulu tidak).
//
// Jalankan: node scripts/verify-motion.cjs [url]   (default http://localhost:5199/)
// Catatan: dev server Vite bind IPv6 (::1) -> pakai "localhost", JANGAN "127.0.0.1".
//
// Isolasi & lifecycle:
// - Port CDP dipilih bebas (bukan fixed) + profil Chrome fresh di scratch Hermes
//   (bukan temp sistem) -> localStorage run sebelumnya tidak bocor.
// - Chrome milik script ini dibunuh scoped via `taskkill /PID <pid> /T /F` (hanya tree
//   milik script) di finally + watchdog total; tidak ada leftover process tree.
// - Tidak menyentuh proses Vite / browser lain.
const { spawn, spawnSync } = require('child_process');
const net = require('net');
const os = require('os');
const path = require('path');
const fs = require('fs');

const CHROME = path.join(os.homedir(), 'AppData', 'Local', 'ms-playwright', 'chromium-1243', 'chrome-win64', 'chrome.exe');
const URL = process.argv[2] || 'http://localhost:5199/';
const SCRATCH = process.env.HERMES_SCRATCH_DIR || path.join(os.homedir(), '.hermes', 'cache', 'scratch');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const freePort = () =>
  new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.once('error', reject);
    srv.listen(0, '127.0.0.1', () => {
      const port = srv.address().port;
      srv.close(() => resolve(port));
    });
  });

const SNAP = [
  '(function () {',
  '  var track = document.querySelector(".marquee-track:not(.reverse)");',
  '  var rev = document.querySelector(".marquee-track.reverse");',
  '  var btn = document.querySelector("footer button[aria-pressed]");',
  '  function anim(el) { return el ? getComputedStyle(el).animationName : "MISSING"; }',
  '  var spans = btn ? Array.prototype.map.call(btn.querySelectorAll("span"), function (s) { return s.textContent; }) : null;',
  '  return {',
  '    motion: document.documentElement.getAttribute("data-motion"),',
  '    ls: (function () { try { return localStorage.getItem("portfolio-motion"); } catch (e) { return "ERR"; } })(),',
  '    trackFound: !!track,',
  '    reverseFound: !!rev,',
  '    marqueeAnim: anim(track),',
  '    reverseAnim: anim(rev),',
  '    bgGridAnim: anim(document.querySelector(".animate-grid-pan")),',
  '    bgAuraAnim: anim(document.querySelector(".animate-aura")),',
  '    driftCount: document.querySelectorAll(".animate-drift, .animate-drift-reverse").length,',
  '    driftAnim: anim(document.querySelector(".animate-drift")),',
  '    driftReverseAnim: anim(document.querySelector(".animate-drift-reverse")),',
  '    pressed: btn ? btn.getAttribute("aria-pressed") : null,',
  '    btnSpans: spans ? spans.join("|") : null,',
  '    reduced: matchMedia("(prefers-reduced-motion: reduce)").matches',
  '  };',
  '})()',
].join('\n');

// Pengukuran "bergerak atau tidak": dua sampel computed 1.5s terpisah.
const MEASURE = {
  normalX: '(() => { var m = getComputedStyle(document.querySelector(".marquee-track:not(.reverse)")).transform; return m === "none" ? 0 : parseFloat(m.split(",")[4]); })()',
  reverseX: '(() => { var m = getComputedStyle(document.querySelector(".marquee-track.reverse")).transform; return m === "none" ? 0 : parseFloat(m.split(",")[4]); })()',
  gridPos: 'getComputedStyle(document.querySelector(".animate-grid-pan")).backgroundPosition',
  auraOpacity: 'getComputedStyle(document.querySelector(".animate-aura")).opacity',
  drift: 'getComputedStyle(document.querySelector(".animate-drift")).transform',
  driftReverse: 'getComputedStyle(document.querySelector(".animate-drift-reverse")).transform',
};

let cleanupDone = false;
let chrome = null;
let profile = null;
let ws = null;

const TASKKILL = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'taskkill.exe');

function killOwnedChrome() {
  // Bunuh HANYA chrome.exe yang CommandLine-nya mereferensikan profil unik run ini
  // (scoped ketat: tidak menyentuh browser lain). Return jumlah sisa (0 = bersih).
  if (!profile) return -1;
  const pat = profile.replace(/\\/g, '\\\\');
  const ps = [
    `$pat = '${pat}'`,
    `$all = Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -match $pat }`,
    `$all | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`,
    `Start-Sleep -Seconds 2`,
    `$left = Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -match $pat }`,
    `'OWNED_LEFT=' + ($left | Measure-Object).Count`,
  ].join('; ');
  const r = spawnSync('powershell', ['-NoProfile', '-Command', ps], { encoding: 'utf8', timeout: 30000 });
  const m = (r.stdout || '').match(/OWNED_LEFT=(\d+)/);
  return m ? Number(m[1]) : -1;
}

function cleanup() {
  if (cleanupDone) return;
  cleanupDone = true;
  try { if (ws) ws.close(); } catch { }
  if (chrome && chrome.pid) {
    // Percobaan 1: taskkill scoped ke PID yang kita spawn (path absolut).
    const t = spawnSync(TASKKILL, ['/PID', String(chrome.pid), '/T', '/F'], { encoding: 'utf8', timeout: 15000 });
    console.log('[cleanup] taskkill pid=' + chrome.pid + ' status=' + t.status + ' err=' + (((t.stderr || '').trim()) || (t.error && t.error.code) || '-'));
    try { chrome.kill(); } catch { }
  }
  // Percobaan 2 + verifikasi: kill by profil unik, lalu hapus profil scratch.
  const left = killOwnedChrome();
  console.log('[cleanup] OWNED_CHROME_LEFT=' + left);
  if (profile) {
    try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch { }
  }
  console.log('[cleanup] profil scratch dihapus: ' + (profile || '-'));
}

async function main() {
  fs.mkdirSync(SCRATCH, { recursive: true });
  profile = fs.mkdtempSync(path.join(SCRATCH, 'verify-motion-'));
  const port = await freePort();
  chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });

  let target = null;
  for (let i = 0; i < 50 && !target; i++) {
    await sleep(300);
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      target = list.find((t) => t.type === 'page');
    } catch { }
  }
  if (!target) throw new Error('CDP target tidak ketemu (chrome gagal start?)');

  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error('websocket CDP gagal')); });

  let seq = 0;
  const pending = new Map();
  const jsErrors = [];
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    else if (m.method === 'Runtime.exceptionThrown') {
      const d = m.params.exceptionDetails;
      jsErrors.push((d.exception && d.exception.description) || d.text);
    }
  };
  const send = (method, params = {}, timeoutMs = 15000) =>
    new Promise((res, rej) => {
      const id = ++seq;
      const timer = setTimeout(() => { pending.delete(id); rej(new Error(`CDP timeout: ${method} (${timeoutMs}ms)`)); }, timeoutMs);
      pending.set(id, (m) => {
        clearTimeout(timer);
        if (m.error) rej(new Error(`CDP error ${method}: ${m.error.message}`));
        else res(m);
      });
      ws.send(JSON.stringify({ id, method, params }));
    });
  const ev = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    const res = r.result;
    if (res && res.exceptionDetails) throw new Error('eval error: ' + JSON.stringify(res.exceptionDetails.exception || res.exceptionDetails.text));
    return res && res.result ? res.result.value : undefined;
  };
  const snap = () => ev(SNAP);
  const sample = async (expr) => { const a = await ev(expr); await sleep(1500); const b = await ev(expr); return { a, b, moving: a !== b }; };
  const moves = async () => {
    const [normal, reverse, grid, aura, drift, driftReverse] = await Promise.all([
      sample(MEASURE.normalX), sample(MEASURE.reverseX), sample(MEASURE.gridPos),
      sample(MEASURE.auraOpacity), sample(MEASURE.drift), sample(MEASURE.driftReverse),
    ]);
    return {
      normalLeft: normal.moving && normal.b < normal.a,      // marquee normal jalan ke kiri
      reverseRight: reverse.moving && reverse.b > reverse.a, // marquee reverse jalan ke kanan
      gridMoving: grid.moving,
      auraMoving: aura.moving,
      driftMoving: drift.moving,
      driftReverseMoving: driftReverse.moving,
      anyMoving: normal.moving || reverse.moving || grid.moving || aura.moving || drift.moving || driftReverse.moving,
    };
  };
  const clickToggle = () => ev('document.querySelector("footer button[aria-pressed]").click()');
  const waitContact = async () => {
    for (let i = 0; i < 100; i++) {
      await sleep(200);
      const ok = await ev('document.readyState === "complete" && !!document.querySelector("#contact .marquee-track")').catch(() => false);
      if (ok) return;
    }
    throw new Error('halaman/#contact tidak siap setelah ~20s — cek dev server (default http://localhost:5199/) hidup & URL benar');
  };
  const nav = async () => { await send('Page.navigate', { url: URL }, 20000); await waitContact(); await sleep(500); };

  await send('Page.enable');
  await send('Runtime.enable');

  const out = {};

  // ── Fase A: OS reduce-motion (kondisi user) ──
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await nav();
  out.A1_default = await snap();
  out.A1_move = await moves();

  await clickToggle(); await sleep(800);
  out.A2_afterOff = await snap();
  out.A2_move = await moves();

  await nav();
  out.A3_reloadOff = await snap();

  await clickToggle(); await sleep(800);
  out.A4_afterOn = await snap();
  out.A4_move = await moves();

  // ── Fase B: media normal, preferensi dibersihkan ──
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await ev('localStorage.removeItem("portfolio-motion")');
  await nav();
  out.B1_default = await snap();
  out.B1_move = await moves();

  // ── Fase C: media normal + klik OFF (regression: dulu nggak ngefek) ──
  await clickToggle(); await sleep(800);
  out.C1_off = await snap();
  out.C1_move = await moves();

  await nav();
  out.C2_reloadOff = await snap();

  out.jsErrors = jsErrors;

  // ── Penilaian ──
  const animsOn = (s) => s.marqueeAnim === 'marquee' && s.reverseAnim === 'marquee-reverse' && s.bgGridAnim === 'grid-pan' && s.bgAuraAnim === 'aura-pulse' && s.driftAnim === 'drift' && s.driftReverseAnim === 'drift-reverse';
  const running = (s, mv) => animsOn(s) && mv.normalLeft && mv.reverseRight && mv.gridMoving && mv.auraMoving && mv.driftMoving && mv.driftReverseMoving;
  const stopped = (s, mv) => s.marqueeAnim === 'none' && s.reverseAnim === 'none' && s.bgGridAnim === 'none' && s.bgAuraAnim === 'none' && s.driftAnim === 'none' && s.driftReverseAnim === 'none' && mv.anyMoving === false;

  const checks = [
    ['A1: marquee 2 arah + grid/aura/2 orb ketemu', out.A1_default.trackFound && out.A1_default.reverseFound && out.A1_default.driftCount === 2],
    ['A1: OS reduce-motion -> default NYALA (ON, bukan ikut OS)', out.A1_default.reduced === true && out.A1_default.motion === 'on' && out.A1_default.pressed === 'true' && out.A1_default.btnSpans === 'Motion|ON'],
    ['A1: ON -> marquee normal kiri + reverse kanan + background bergerak', running(out.A1_default, out.A1_move)],
    ['A2: klik OFF -> atribut/state/tombol OFF', out.A2_afterOff.motion === 'off' && out.A2_afterOff.ls === 'off' && out.A2_afterOff.pressed === 'false' && out.A2_afterOff.btnSpans === 'Motion|OFF'],
    ['A2: OFF -> semua dekorasi berhenti (anim none + nilai statis)', stopped(out.A2_afterOff, out.A2_move)],
    ['A3: OFF persist setelah reload', out.A3_reloadOff.motion === 'off' && out.A3_reloadOff.ls === 'off' && out.A3_reloadOff.marqueeAnim === 'none' && out.A3_reloadOff.bgGridAnim === 'none'],
    ['A4: klik ON -> semua jalan lagi', out.A4_afterOn.motion === 'on' && out.A4_afterOn.ls === 'on' && running(out.A4_afterOn, out.A4_move)],
    ['B1: media normal -> default NYALA + semua bergerak', out.B1_default.reduced === false && out.B1_default.motion === 'on' && running(out.B1_default, out.B1_move)],
    ['C1: media normal + OFF -> berhenti (regression fixed)', out.C1_off.motion === 'off' && stopped(out.C1_off, out.C1_move)],
    ['C2: OFF persist (media normal)', out.C2_reloadOff.motion === 'off' && out.C2_reloadOff.marqueeAnim === 'none'],
    ['Nol JS error', jsErrors.length === 0],
  ];

  console.log(JSON.stringify(out, null, 2));
  console.log('\n=== HASIL ===');
  let allOk = true;
  for (const [name, ok] of checks) {
    console.log((ok ? 'PASS' : 'FAIL') + '  ' + name);
    if (!ok) allOk = false;
  }
  console.log(allOk ? `\nSEMUA PASS (${checks.length}/${checks.length})` : '\nADA YANG FAIL');
  return allOk ? 0 : 1;
}

const watchdog = setTimeout(() => { console.error('WATCHDOG: batas total tercapai - cleanup + exit 2'); cleanup(); process.exit(2); }, 240000);
process.on('SIGINT', () => { cleanup(); process.exit(130); });
process.on('SIGTERM', () => { cleanup(); process.exit(143); });

main()
  .then((code) => { clearTimeout(watchdog); cleanup(); process.exit(code); })
  .catch((e) => { clearTimeout(watchdog); console.error('ERR', e); cleanup(); process.exit(2); });
