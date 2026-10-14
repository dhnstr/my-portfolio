// Screenshot section Contact (dark) + ukur lebar marquee-track (cek seamless loop).
// Jalankan: node scripts/shot-contact.cjs [url] [out.png]   (default http://localhost:5199/)
// Catatan: dev server Vite bind IPv6 (::1) -> pakai "localhost", JANGAN "127.0.0.1".
//
// Isolasi & lifecycle: port CDP bebas + profil fresh di scratch Hermes; Chrome milik
// script dibunuh scoped via `taskkill /PID <pid> /T /F` di finally + watchdog; tidak
// menyentuh proses Vite / browser lain.
const { spawn, spawnSync } = require('child_process');
const net = require('net');
const os = require('os');
const path = require('path');
const fs = require('fs');

const CHROME = path.join(os.homedir(), 'AppData', 'Local', 'ms-playwright', 'chromium-1243', 'chrome-win64', 'chrome.exe');
const URL = process.argv[2] || 'http://localhost:5199/';
const OUT = process.argv[3] || path.join(__dirname, 'contact-dark.png');
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
  profile = fs.mkdtempSync(path.join(SCRATCH, 'shot-contact-'));
  const port = await freePort();
  chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run', '--disable-gpu', '--window-size=1440,900', 'about:blank'], { stdio: 'ignore' });

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
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
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

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: URL }, 20000);
  for (let i = 0; i < 100; i++) {
    await sleep(200);
    const ok = await ev('document.readyState === "complete" && !!document.querySelector("#contact .marquee-track")').catch(() => false);
    if (ok) break;
    if (i === 99) throw new Error('halaman tidak siap setelah ~20s');
  }

  const measure = await ev('(function () { var band = document.querySelector(".marquee-band"); var track = document.querySelector(".marquee-track"); return { bandWidth: band ? band.clientWidth : null, trackWidth: track ? track.scrollWidth : null, halfWidth: track ? Math.round(track.scrollWidth / 2) : null, items: track ? track.children.length : null }; })()');
  console.log('MEASURE:', JSON.stringify(measure));

  await ev('document.querySelector("#contact").scrollIntoView({ block: "start" })');
  await sleep(2500);

  const shot = await send('Page.captureScreenshot', { format: 'png' }, 20000);
  fs.writeFileSync(OUT, Buffer.from(shot.result.data, 'base64'));
  console.log('SAVED:', OUT);
}

const watchdog = setTimeout(() => { console.error('WATCHDOG: batas total tercapai - cleanup + exit 2'); cleanup(); process.exit(2); }, 180000);
process.on('SIGINT', () => { cleanup(); process.exit(130); });
process.on('SIGTERM', () => { cleanup(); process.exit(143); });

main()
  .then(() => { clearTimeout(watchdog); cleanup(); process.exit(0); })
  .catch((e) => { clearTimeout(watchdog); console.error('ERR', e); cleanup(); process.exit(2); });
