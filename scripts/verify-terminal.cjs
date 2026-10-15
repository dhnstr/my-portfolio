const { spawn, spawnSync } = require('child_process');
const net = require('net');
const os = require('os');
const path = require('path');
const fs = require('fs');

const CHROME = path.join(os.homedir(), 'AppData', 'Local', 'ms-playwright', 'chromium-1243', 'chrome-win64', 'chrome.exe');
let TARGET_URL = process.argv[2];
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
let previewProcess = null;

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
    console.log('[cleanup] taskkill chrome pid=' + chrome.pid + ' status=' + t.status);
    try { chrome.kill(); } catch { }
  }
  if (previewProcess && previewProcess.pid) {
    const t = spawnSync(TASKKILL, ['/PID', String(previewProcess.pid), '/T', '/F'], { encoding: 'utf8', timeout: 15000 });
    console.log('[cleanup] taskkill preview pid=' + previewProcess.pid + ' status=' + t.status);
    try { previewProcess.kill(); } catch { }
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

async function isServerRunning(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(1500) });
    return res.ok || res.status === 200 || res.status === 304;
  } catch {
    return false;
  }
}

async function main() {
  // Check if target URL is provided or already alive
  if (!TARGET_URL) {
    TARGET_URL = 'http://localhost:5199/';
  }

  const serverAlive = await isServerRunning(TARGET_URL);
  if (!serverAlive) {
    const previewPort = await freePort();
    TARGET_URL = `http://127.0.0.1:${previewPort}/`;
    console.log(`[0] Spawning vite preview server on port ${previewPort}`);
    const projectRoot = path.resolve(__dirname, '..');
    const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    previewProcess = spawn(npxCmd, ['vite', 'preview', '--port', String(previewPort), '--strictPort'], {
      cwd: projectRoot,
      stdio: 'pipe',
      detached: false
    });

    let previewReady = false;
    for (let i = 0; i < 40; i++) {
      await sleep(300);
      if (await isServerRunning(TARGET_URL)) {
        previewReady = true;
        break;
      }
    }
    if (!previewReady) throw new Error('Vite preview server failed to start on ' + TARGET_URL);
  }

  fs.mkdirSync(SCRATCH, { recursive: true });
  profile = fs.mkdtempSync(path.join(SCRATCH, 'verify-terminal-'));
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

  console.log('[1] Navigating to', TARGET_URL);
  await send('Page.navigate', { url: TARGET_URL }, 20000);

  // Wait for #terminal section to render
  let ready = false;
  for (let i = 0; i < 60; i++) {
    await sleep(300);
    ready = await ev('document.readyState === "complete" && !!document.querySelector("#terminal")').catch(() => false);
    if (ready) break;
  }
  if (!ready) throw new Error('Timeout waiting for #terminal section to render');

  console.log('[2] Checking DOM elements for Interactive Developer Terminal');
  const domCheck = await ev(`({
    terminalSection: !!document.querySelector("#terminal"),
    terminalInput: !!document.querySelector("#terminal input"),
    navbarTerminalLink: Array.from(document.querySelectorAll("nav a, nav button, nav div")).some(el => (el.textContent || "").includes("Terminal")),
    quickChipsCount: document.querySelectorAll("#terminal button").length,
    tabLabel: document.querySelector("#terminal")?.textContent.includes("guest@dhanu.dev:~"),
    statusBadge: document.querySelector("#terminal")?.textContent.includes("bash v5.2"),
  })`);
  console.log('DOM check:', JSON.stringify(domCheck));

  if (!domCheck.terminalSection) throw new Error('Section #terminal missing');
  if (!domCheck.terminalInput) throw new Error('Terminal input element missing');
  if (!domCheck.navbarTerminalLink) throw new Error('Navbar Terminal link missing');

  console.log('[3] Testing Command Execution (help & whoami)');

  // Execute 'help' command using native React input setter & Enter keydown
  await ev(`(() => {
    const input = document.querySelector("#terminal input");
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(input, 'help');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
  })()`);
  await sleep(600);

  const helpCheck = await ev(`({
    hasHelpOutput: document.querySelector("#terminal")?.textContent.includes("Available Commands") || document.querySelector("#terminal")?.textContent.includes("whoami / bio"),
    linesCount: document.querySelectorAll("#terminal .font-mono").length,
  })`);
  console.log('Help command result:', JSON.stringify(helpCheck));
  if (!helpCheck.hasHelpOutput) throw new Error('Terminal failed to output help command response');

  // Execute 'whoami' command
  await ev(`(() => {
    const input = document.querySelector("#terminal input");
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(input, 'whoami');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
  })()`);
  await sleep(600);

  const whoamiCheck = await ev(`({
    hasWhoamiOutput: document.querySelector("#terminal")?.textContent.includes("Dhanu Satrio Darjanto") && document.querySelector("#terminal")?.textContent.includes("Fullstack Developer"),
  })`);
  console.log('Whoami command result:', JSON.stringify(whoamiCheck));
  if (!whoamiCheck.hasWhoamiOutput) throw new Error('Terminal failed to output whoami command response');

  // Test Quick Chips click (skills chip)
  await ev(`(() => {
    const chips = Array.from(document.querySelectorAll("#terminal button"));
    const skillsChip = chips.find(b => (b.textContent || "").trim() === "skills");
    if (skillsChip) skillsChip.click();
  })()`);
  await sleep(600);

  const chipCheck = await ev(`({
    hasSkillsOutput: document.querySelector("#terminal")?.textContent.includes("Core Technical Stack:") && document.querySelector("#terminal")?.textContent.includes("React 18"),
  })`);
  console.log('Quick chip click result:', JSON.stringify(chipCheck));
  if (!chipCheck.hasSkillsOutput) throw new Error('Terminal quick chip click failed to output skills');

  console.log('[4] Testing Viewport Responsiveness & Overflow');
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

  console.log('[5] Verifying JS errors during run');
  if (jsErrors.length > 0) {
    console.error('JS Errors encountered:', jsErrors);
    throw new Error('Uncaught JS errors found on page');
  }

  console.log('[6] ALL TERMINAL VERIFICATION CHECKS PASSED!');
  return { status: 'PASS', jsErrorsCount: jsErrors.length, domCheck, helpCheck, whoamiCheck };
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
