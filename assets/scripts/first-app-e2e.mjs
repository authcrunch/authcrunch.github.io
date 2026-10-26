import assert from 'node:assert/strict';
import {spawn, execFileSync} from 'node:child_process';
import {createHash, randomUUID} from 'node:crypto';
import {once} from 'node:events';
import {createReadStream} from 'node:fs';
import fs from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';
import {chromium, request} from 'playwright-core';

const root = fileURLToPath(new URL('../../', import.meta.url));
const {values} = parseArgs({options: {
  binary: {type:'string'}, output: {type:'string'}, browser: {type:'string'},
}});
if (!values.binary) throw new Error('Usage: npm run test:first-app -- --binary /path/to/authcrunch [--browser /path/to/chrome]');
const binary = path.resolve(values.binary);
const out = values.output ? path.resolve(values.output) : path.join(root, 'tmp/first-app-e2e', new Date().toISOString().replaceAll(':','-') + '-' + randomUUID().slice(0,8));
const config = path.join(root, 'assets/conf/getting-started/Caddyfile');
const original = await fs.readFile(config, 'utf8');
const origin = 'https://localhost:8443';
const password = 'LocalDemoPassword123!';
const accessName = 'AUTHTEST_ACCESS_TOKEN';
const sessionName = 'AUTHTEST_SESSION_ID';
await fs.access(binary);
await fs.mkdir(path.dirname(out), {recursive:true});
await fs.mkdir(out); // Never overwrite an earlier report.
const runtime = path.join(out, 'runtime');
const summary = {status:'running', startedAt:new Date().toISOString(), config:'assets/conf/getting-started/Caddyfile', cases:[], checks:[], provenance:{}, cleanup:{}};
let child, browser, client, serverLog = '', interrupted = false;

async function hash(filename) {
  const digest = createHash('sha256');
  for await (const chunk of createReadStream(filename)) digest.update(chunk);
  return digest.digest('hex');
}
async function portFree(port) {
  const server = net.createServer();
  await new Promise((resolve,reject) => { server.once('error',reject); server.listen(port,'127.0.0.1',resolve); });
  await new Promise((resolve,reject) => server.close(error => error ? reject(error) : resolve()));
}
function check(condition, label, observed) {
  summary.checks.push({label, passed:Boolean(condition), ...(observed === undefined ? {} : {observed})});
  assert.ok(condition,label);
}
function command(args) {
  return execFileSync(binary,args,{encoding:'utf8',timeout:15000,maxBuffer:8*1024*1024});
}
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
async function report() {
  await fs.writeFile(path.join(out,'summary.json'), JSON.stringify(summary,null,2)+'\n');
  const cards = summary.cases.map(item => `<section><h2>${escape(item.profile)} · ${escape(item.name)} <small>${escape(item.status)}</small></h2>${item.error ? `<pre>${escape(item.error)}</pre>` : ''}<div class="steps">${item.steps.map(step => `<figure><a href="${escape(step.image)}"><img src="${escape(step.image)}" alt="${escape(step.label)}" loading="lazy"></a><figcaption><strong>${escape(step.label)}</strong><p>${escape(step.expected)}</p><code>${escape(step.url)}</code></figcaption></figure>`).join('')}</div></section>`).join('');
  await fs.writeFile(path.join(out,'index.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>First app · Browser validation</title><style>body{font:16px/1.6 system-ui;margin:0;background:#f4f7fc;color:#172b4d}main{max-width:1280px;margin:auto;padding:40px 24px}h1{font-size:40px;letter-spacing:-.04em}h2{font-size:23px}small{float:right;font-size:14px}.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:20px}section{margin:40px 0}figure{margin:0;border:1px solid #dce3ed;border-radius:12px;overflow:hidden;background:white}img{display:block;width:100%;height:auto}figcaption{padding:18px}figcaption p{margin:8px 0}code,pre{font-size:12px;overflow-wrap:anywhere;white-space:pre-wrap}a{color:#245bca}li{margin-bottom:8px}</style><main><p>AUTHCRUNCH · ACTUAL BROWSER RUN</p><h1>Protect your first app.</h1><p>Result: <strong>${escape(summary.status)}</strong> · ${summary.cases.filter(item=>item.status==='passed').length}/${summary.cases.length} browser cases passed.</p><p>Canonical Caddyfile, local password forms, desktop and mobile Chromium. Select a screenshot for the full image.</p><p><a href="summary.json">Checks and provenance</a> · <a href="caddy.log">Sanitized runtime log</a></p>${summary.error ? `<pre>${escape(summary.error)}</pre>` : ''}${cards}<section><h2>Assertions</h2><ul>${summary.checks.map(item=>`<li>${item.passed ? 'PASS' : 'FAIL'} · ${escape(item.label)}${item.observed===undefined ? '' : ': '+escape(JSON.stringify(item.observed))}</li>`).join('')}</ul></section></main></html>`);
}
async function start() {
  await portFree(8443);
  await portFree(5555);
  await fs.mkdir(runtime);
  const env = {...process.env};
  for (const name of Object.keys(env)) if (name.startsWith('E2E_LOGIN_') || name === 'AUTHCRUNCH_DEMO_SECRET') delete env[name];
  child = spawn(binary,['run','--adapter','caddyfile','--config',config],{cwd:runtime,env,stdio:['ignore','pipe','pipe']});
  child.stdout.on('data',chunk => { serverLog += chunk; });
  child.stderr.on('data',chunk => { serverLog += chunk; });
  let launchError;
  child.once('error',error => { launchError = error; });
  for (let attempt=0; attempt<100; attempt++) {
    if (interrupted) throw new Error('Interrupted');
    if (launchError) throw launchError;
    if (child.exitCode!==null) throw new Error('AuthCrunch exited during startup; inspect caddy.log');
    try { if ((await fetch('http://localhost:5555/?domain=localhost')).status===200) return; } catch {}
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  throw new Error('Timed out waiting for AuthCrunch');
}
const interrupt = () => { interrupted = true; if (browser) void browser.close().catch(()=>{}); if (child?.exitCode===null) child.kill('SIGTERM'); };
process.once('SIGINT',interrupt);
process.once('SIGTERM',interrupt);

async function runCase(profile,name,action) {
  const item = {profile,name,status:'running',steps:[]};
  summary.cases.push(item);
  const directory = path.join(out,profile,name);
  await fs.mkdir(directory,{recursive:true});
  const context = await browser.newContext({
    ignoreHTTPSErrors:true, locale:'en-US', colorScheme:'light', reducedMotion:'reduce',
    viewport:profile==='desktop' ? {width:1440,height:1000} : {width:390,height:844},
    isMobile:profile==='mobile',hasTouch:profile==='mobile',deviceScaleFactor:1,
  });
  context.setDefaultTimeout(10000);
  context.setDefaultNavigationTimeout(15000);
  const errors=[];
  context.on('page',page => {
    page.on('pageerror',error => errors.push(error.message));
    page.on('response',response => {
      if (response.status()>=500 || (response.status()>=400 && ['script','stylesheet','image','font'].includes(response.request().resourceType()))) errors.push(`${response.status()} ${response.url()}`);
    });
  });
  await context.route('**/*',route => {
    if (new URL(route.request().url()).origin===origin) return route.continue();
    errors.push(`Unexpected external request: ${route.request().url()}`);
    return route.abort();
  });
  let page = await context.newPage();
  async function capture(label,expected) {
    const image = path.join(directory,`${String(item.steps.length+1).padStart(2,'0')}-${label.toLowerCase().replaceAll(/[^a-z0-9]+/g,'-')}.png`);
    await page.screenshot({path:image,fullPage:true,animations:'disabled'});
    const step = {label,expected,url:page.url(),image:path.relative(out,image).split(path.sep).join('/')};
    const focused = image.replace(/\.png$/,'-focus.png');
    const card = page.locator('.app-container');
    if (await card.count() === 1 && await card.isVisible()) {
      await card.screenshot({path:focused,animations:'disabled'});
      step.focusImage=path.relative(out,focused).split(path.sep).join('/');
    } else if (profile==='desktop' && (await page.textContent('body')).includes('You reached the protected app.')) {
      await page.screenshot({path:focused,clip:{x:0,y:0,width:720,height:180},animations:'disabled'});
      step.focusImage=path.relative(out,focused).split(path.sep).join('/');
    }
    item.steps.push(step);
  }
  async function identify(username='alice') {
    await page.locator('#username').fill(username);
    await page.locator('button[type=submit]').first().click();
    await page.locator('input[type=password]').waitFor();
  }
  async function signIn(username='alice') {
    await page.goto(origin+'/');
    await identify(username);
    await page.locator('input[type=password]').fill(password);
    await page.locator('button[type=submit]').first().click();
    await page.waitForURL(origin+'/');
  }
  try {
    await action({context,get page(){return page;},setPage(value){page=value;},capture,identify,signIn});
    check(errors.length===0,`${profile}/${name}: no page errors, failed assets, server errors, or external traffic`,errors);
    item.status='passed';
  } catch (error) {
    item.status='failed';
    item.error=error.stack || String(error);
    try { await capture('Failure','This case did not pass; inspect its error.'); } catch {}
  } finally {
    await context.close();
    await report();
  }
}

try {
  summary.provenance = {
    binary, binarySha256:await hash(binary), configSha256:await hash(config),
    caddyVersion:command(['version']).trim(), securityVersion:command(['security','version']).trim(),
    sourceRevision:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),
  };
  check(command(['fmt',config])===original,'Canonical Caddyfile is formatted');
  const adapted=command(['adapt','--adapter','caddyfile','--config',config]);
  JSON.parse(adapted);
  check(true,'Canonical Caddyfile adapts');
  await start();
  client=await request.newContext({ignoreHTTPSErrors:true});
  for (const [query,status] of [['?domain=localhost',200],['?domain=example.test',400],['',400]]) check((await fetch('http://localhost:5555/'+query)).status===status,'Certificate approval '+(query||'missing domain'),status);
  check((await client.get(origin+'/healthz')).status()===200,'Public health endpoint is reachable');
  const ca=path.join(runtime,'data/caddy/pki/authorities/local/root.crt');
  const verified=execFileSync('curl',['--silent','--show-error','--cacert',ca,'-o','/dev/null','-w','%{http_code}',origin+'/healthz'],{encoding:'utf8',timeout:10000});
  check(verified==='200','HTTPS verifies against the generated local CA');
  for (const appPath of ['/','/reports/child']) {
    const response=await client.get(origin+appPath,{maxRedirects:0});
    check(response.status()===302,'Anonymous app request redirects: '+appPath,response.status());
  }
  check((await client.get(origin+'/auth',{maxRedirects:0})).status()===308,'Bare /auth redirects to /auth/');
  browser=await chromium.launch(values.browser ? {executablePath:values.browser,headless:true} : {channel:'chrome',headless:true});
  summary.provenance.browser=browser.version();
  for (const profile of ['desktop','mobile']) {
    if (interrupted) throw new Error('Interrupted');
    await runCase(profile,'login-session-logout',async session => {
      await session.page.goto(origin+'/');
      await session.page.locator('#username').waitFor();
      await session.capture('Open the protected app','An anonymous request redirects to the username form.');
      await session.identify();
      await session.page.locator('input[type=password]').fill(password);
      await session.capture('Complete the password challenge','Enter the demo password. The field masks its contents.');
      await session.page.locator('button[type=submit]').first().click();
      await session.page.waitForURL(origin+'/');
      check((await session.page.textContent('body')).trim()==='You reached the protected app.',profile+': app displays its protected response');
      await session.capture('Reach the protected app','HTTP 200 at /. The policy allows Alice through authp/user.');
      const cookies=await session.context.cookies(origin);
      for (const name of [accessName,sessionName]) {
        const cookie=cookies.find(cookie=>cookie.name===name);
        check(Boolean(cookie?.secure && cookie.httpOnly && cookie.sameSite==='Lax' && cookie.path==='/'),`${profile}: ${name} has expected scope and flags`,cookie && {name:cookie.name,domain:cookie.domain,path:cookie.path,secure:cookie.secure,httpOnly:cookie.httpOnly,sameSite:cookie.sameSite});
      }
      const access=cookies.find(cookie=>cookie.name===accessName);
      const claims=JSON.parse(Buffer.from(access.value.split('.')[1],'base64url').toString());
      check(claims.exp>claims.iat && claims.exp-claims.iat<=300,profile+': token lifetime is at most 300 seconds');
      await session.page.reload();
      check((await session.page.textContent('body')).includes('You reached the protected app.'),profile+': reload retains access');
      const other=await session.context.newPage();
      await other.goto(origin+'/reports/child');
      check((await other.textContent('body')).includes('You reached the protected app.'),profile+': a second tab and nested route retain access');
      await other.close();
      await session.page.goto(origin+'/auth/');
      await session.page.getByRole('link',{name:'Example app'}).waitFor();
      await session.capture('Open the authenticated portal','Applications includes Example app, linking to /. Sign Out ends this browser login.');
      check(await session.page.getByRole('link',{name:'Example app'}).getAttribute('href')==='/',profile+': Applications links to root');
      await session.page.locator('a[href="/auth/logout"]').click();
      await session.page.locator('#username').waitFor();
      check(!(await session.context.cookies(origin)).some(cookie=>cookie.name===accessName),profile+': logout removes the browser access cookie');
      await session.page.goto(origin+'/');
      await session.page.locator('#username').waitFor();
      await session.capture('Require login after sign-out','A new app request returns to the username form.');
      check((await session.context.request.get(origin+'/',{maxRedirects:0})).status()===302,profile+': app requires login after logout');
    });
    await runCase(profile,'incorrect-password',async session => {
      await session.page.goto(origin+'/');
      await session.identify();
      await session.page.locator('input[type=password]').fill('IncorrectDemoPassword!');
      const [response]=await Promise.all([
        session.page.waitForResponse(response=>response.request().method()==='POST' && response.url().includes('/sandbox/')),
        session.page.locator('button[type=submit]').first().click(),
      ]);
      check(response.status()===401,profile+': incorrect password returns 401',response.status());
      check(!(await session.context.cookies(origin)).some(cookie=>cookie.name===accessName),profile+': failed login issues no access cookie');
      await session.capture('Reject an incorrect password','HTTP 401. No access cookie is issued, and the app remains protected.');
      check((await session.context.request.get(origin+'/',{maxRedirects:0})).status()===302,profile+': failed login cannot access the app');
    });
    await runCase(profile,'tampered-token',async session => {
      await session.signIn();
      check((await session.context.request.get(origin+'/',{maxRedirects:0})).status()===200,profile+': original issued token grants access before tampering');
      const cookie=(await session.context.cookies(origin)).find(cookie=>cookie.name===accessName);
      const [header,payload,signature]=cookie.value.split('.');
      const changed=(signature[0]==='A' ? 'B' : 'A')+signature.slice(1);
      await session.context.addCookies([{...cookie,value:`${header}.${payload}.${changed}`}]);
      await session.page.goto(origin+'/');
      await session.page.locator('#username').waitFor();
      await session.capture('Reject an altered token','Changing the signature of the real cookie prevents access and returns to login.');
      check(!(await session.page.textContent('body')).includes('You reached the protected app.'),profile+': altered signature cannot reach the app');
    });
    await runCase(profile,'bob-default-access',async session => {
      await session.signIn('bob');
      check((await session.context.request.get(origin+'/',{maxRedirects:0})).status()===200,profile+': default authp/user rule allows Bob');
      await session.capture('Allow the second demo user','Bob also has authp/user. The default policy allows both demo users.');
    });
  }
  summary.status=summary.cases.length===8 && summary.cases.every(item=>item.status==='passed') && !interrupted ? 'passed' : 'failed';
} catch (error) {
  summary.status='failed';
  summary.error=error.stack || String(error);
} finally {
  const cleanupErrors=[];
  async function cleanup(action) {
    try { await action(); } catch(error) { cleanupErrors.push(String(error)); }
  }
  // Attempt each cleanup even when another resource fails to close.
  await cleanup(async()=>{ if(browser) await browser.close(); });
  await cleanup(async()=>{ if(client) await client.dispose(); });
  const running=()=>child?.pid && child.exitCode===null && child.signalCode===null;
  async function waitForExit(timeout) {
    let timer;
    try { await Promise.race([once(child,'exit'),new Promise((_,reject)=>{ timer=setTimeout(()=>reject(new Error('Runtime shutdown timed out')),timeout); })]); }
    finally { clearTimeout(timer); }
  }
  await cleanup(async()=>{
    if(running()) {
      child.kill('SIGTERM');
      try { await waitForExit(10000); }
      catch(error) {
        if(!running()) throw error;
        child.kill('SIGKILL');await waitForExit(5000);
        summary.cleanup.forcedTermination=true;
      }
    }
    if(child) summary.cleanup.runtimeExitCode=child.exitCode;
  });
  await cleanup(async()=>{
    if(running()) throw new Error('Runtime is still running; private storage retained');
    await fs.rm(runtime,{recursive:true,force:true});summary.cleanup.runtimeRemoved=true;
  });
  await cleanup(async()=>{
    if(child?.pid) { await portFree(8443);await portFree(5555);summary.cleanup.portsReleased=true; }
  });
  await cleanup(async()=>check(await fs.readFile(config,'utf8')===original,'Canonical Caddyfile is unchanged by the test'));
  if(cleanupErrors.length) { summary.status='failed';summary.cleanup.errors=cleanupErrors; }
  process.removeListener('SIGINT',interrupt);
  process.removeListener('SIGTERM',interrupt);
  const redacted=serverLog.replaceAll(password,'[demo password]').replaceAll(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,'[JWT]');
  await fs.writeFile(path.join(out,'caddy.log'),redacted);
  summary.finishedAt=new Date().toISOString();
  await report();
  console.log(`${summary.status.toUpperCase()}: ${summary.cases.filter(item=>item.status==='passed').length}/${summary.cases.length} browser cases. Report: ${path.join(out,'index.html')}`);
  process.exitCode=summary.status==='passed' ? 0 : 1;
}
