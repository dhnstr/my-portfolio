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

let cleanupDone = false;
let chrome = null;
let profile = null;
let ws = null;

const TASKKILL = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'taskkill.exe');

function killOwnedChrome() {
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
    const t = spawnSync(TASKKILL, ['/PID', String(chrome.pid), '/T', '/F'], { encoding: 'utf8', timeout: 15000 });
    console.log('[cleanup] taskkill pid=' + chrome.pid + ' status=' + t.status);
    try { chrome.kill(); } catch { }
  }
  const left = killOwnedChrome();
  console.log('[cleanup] OWNED_CHROME_LEFT=' + left);
  if (profile) {
    try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch { }
  }
  console.log('[cleanup] scratch profile cleaned');
}

process.on('exit', cleanup);
process.on('SIGINT', () => { cleanup(); process.exit(1); });
process.on('SIGTERM', () => { cleanup(); process.exit(1); });

async function main() {
  fs.mkdirSync(SCRATCH, { recursive: true });
  profile = fs.mkdtempSync(path.join(SCRATCH, 'verify-showreel-'));
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
  if (!target) throw new Error('CDP target not found');

  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error('WebSocket CDP failed')); });

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
      const timer = setTimeout(() => { pending.delete(id); rej(new Error(`CDP timeout: ${method}`)); }, timeoutMs);
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

  console.log('[1] Navigating to', URL);
  await send('Page.navigate', { url: URL }, 20000);

  // Wait for #showreel section to render
  let ready = false;
  for (let i = 0; i < 60; i++) {
    await sleep(300);
    ready = await ev('document.readyState === "complete" && !!document.querySelector("#showreel")').catch(() => false);
    if (ready) break;
  }
  if (!ready) throw new Error('Timeout waiting for #showreel section to render');

  console.log('[2] Checking DOM elements for Remotion Showreel');
  const domCheck = await ev(`({
    showreelSection: !!document.querySelector("#showreel"),
    remotionPlayer: !!document.querySelector("#showreel [data-remotion-player]") || !!document.querySelector("#showreel video") || !!document.querySelector("#showreel .aspect-video"),
    navbarShowreelLink: Array.from(document.querySelectorAll("nav a, nav button, nav div")).some(el => (el.textContent || "").includes("Showreel")),
    sceneButtons: document.querySelectorAll("#showreel button").length,
    bentoCards: document.querySelectorAll("#showreel .grid > div").length,
  })`);
  console.log('DOM check:', JSON.stringify(domCheck));

  if (!domCheck.showreelSection) throw new Error('Section #showreel missing');
  if (!domCheck.navbarShowreelLink) throw new Error('Navbar Showreel link missing');

  console.log('[3] Testing Viewport Responsiveness & Overflow');
  const viewports = [
    { name: 'Mobile', width: 390, height: 844 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1440, height: 900 }
  ];

  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 800,
    });
    await sleep(400);

    const overflowInfo = await ev(`({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      overflowDiff: document.documentElement.scrollWidth - window.innerWidth
    })`);

    console.log(`Viewport ${vp.name} (${vp.width}px):`, JSON.stringify(overflowInfo));
    if (overflowInfo.hasHorizontalOverflow) {
      throw new Error(`Horizontal overflow detected at ${vp.name} (${vp.width}px): diff=${overflowInfo.overflowDiff}px`);
    }
  }

  console.log('[4] Verifying JS errors during run');
  if (jsErrors.length > 0) {
    console.error('JS Errors encountered:', jsErrors);
    throw new Error('Uncaught JS errors found on page');
  }

  console.log('[5] ALL SHOWREEL VERIFICATION CHECKS PASSED!');
  return { status: 'PASS', jsErrorsCount: jsErrors.length, domCheck };
}

main()
  .then((res) => {
    console.log('RESULT: PASS');
    cleanup();
    process.exit(0);
  })
  .catch((err) => {
    console.error('RESULT: FAIL -', err.message);
    cleanup();
    process.exit(1);
  });
