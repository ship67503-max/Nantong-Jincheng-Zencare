import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, readdirSync, mkdirSync } from 'node:fs';
import path from 'node:path';

test('all built SEO documents retain canonical and avoid unconditional video/Pixel fetches', () => {
  let count = 0;
  const walk = directory => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.name === 'index.html') {
        const html = readFileSync(file, 'utf8');
        assert.match(html, /rel="canonical"/);
        assert.doesNotMatch(html, /<video\b|as="video"|facebook\.com\/tr/);
        count++;
      }
    }
  };
  walk('dist');
  assert.equal(count, 376, 'main route coverage is preserved');
});

test('integrated desktop/mobile consent, videos, product routes and inquiry events (isolated mocks)', async () => {
  const built = spawnSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--outDir', 'output/integration-dist'], {
    env:{...process.env,VITE_TURNSTILE_SITE_KEY:'1x00000000000000000000AA'}, encoding:'utf8',
  });
  assert.equal(built.status,0,built.stderr);
  const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4193', '--strictPort', '--outDir', 'output/integration-dist'], { stdio: ['ignore', 'pipe', 'pipe'] });
  let browser;
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(Error('preview startup timeout')), 10000);
      server.stdout.on('data', data => { if (data.toString().includes('4193')) { clearTimeout(timer); resolve(); } });
      server.on('exit', code => { clearTimeout(timer); reject(Error('preview exited ' + code)); });
    });
    browser = await chromium.launch({ headless: true });
    for (const viewport of [{ width: 1365, height: 900 }, { width: 390, height: 844 }]) {
      const context = await browser.newContext({ viewport });
      let saved = true, fail = false, requests = 0, sdk = 0;
      const media = [], errors = [];
      await context.addInitScript(() => {
        window.turnstile = {
          render(container, options) { setTimeout(() => options.callback('mock-human-token'), 0); return 1; },
          reset() {}, remove() {},
        };
      });
      // No production API, analytics service, real captcha or customer records are contacted.
      await context.route('**/*', async route => {
        const u = new URL(route.request().url());
        if (u.hostname === 'www.jczcare.com') {
          if (u.pathname === '/api/contact') {
            requests++;
            await new Promise(resolve => setTimeout(resolve, 100));
            return route.fulfill({ status: fail ? 500 : 200, json: fail ? {success:false} : { success:true, deliveryConfirmed:true, saved, leadEventId:saved ? '12345678-1234-4234-8234-123456789abc' : undefined } });
          }
          if (u.pathname.startsWith('/videos/')) media.push(u.pathname);
          const response = await context.request.get('http://127.0.0.1:4193' + u.pathname + u.search);
          return route.fulfill({ response });
        }
        if (u.hostname === 'connect.facebook.net') {
          sdk++;
          return route.fulfill({ contentType:'application/javascript', body:'window.__metaCalls=Array.from(window.fbq.queue,x=>Array.from(x));window.fbq.callMethod=function(){window.__metaCalls.push(Array.from(arguments));};' });
        }
        return route.abort();
      });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      const calls = () => page.evaluate(() => window.__metaCalls || []);
      const events = async name => (await calls()).filter(x => x[0] === 'trackSingle' && x[2] === name);
      await page.goto('https://www.jczcare.com/', { waitUntil:'domcontentloaded' });
      await page.getByRole('button', {name:'Reject marketing',exact:true}).click();
      assert.equal(sdk,0);
      assert.ok(!media.some(x=>x.includes('factory-profile')), 'below-fold factory is not fetched');
      if (viewport.width < 768) {
        assert.ok(!media.some(x=>x.includes('hero-background')), 'mobile hero is poster-only until interaction');
        await page.locator('.home-product-hero').dispatchEvent('pointerdown');
      }
      await page.waitForFunction(() => {const v=document.querySelector('.home-product-hero-video');return v && !v.paused && v.currentTime>0.1;});
      assert.equal(media.filter(x=>x.includes('hero-background-2-720p-v2.webm')).length,1);
      await page.getByRole('button', {name:'Marketing cookie settings',exact:true}).click();
      await page.getByRole('button', {name:'Allow Meta marketing',exact:true}).click();
      await page.waitForFunction(()=>window.__metaCalls);
      assert.equal((await calls()).filter(x=>x[0]==='init').length,1);
      assert.equal((await events('PageView')).length,1);
      await page.locator('.about-video').scrollIntoViewIfNeeded();
      await page.waitForFunction(()=>{const v=document.querySelector('.about-video video');return v && !v.paused && v.currentTime>0.1;});
      assert.equal(media.filter(x=>x.includes('factory-profile')).length,1);
      assert.equal((await events('PageView')).length,1,'video lifecycle never sends a PageView');
      mkdirSync('output/integration',{recursive:true});
      await page.screenshot({path:`output/integration/home-${viewport.width}.png`,fullPage:true});
      await page.goto('https://www.jczcare.com/products/disposable-pet-pads', {waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>window.__metaCalls);
      assert.equal((await events('PageView')).length,1);
      assert.equal((await events('ViewContent')).length,1);
      assert.equal(await page.locator('video').count(),0);
      assert.equal(await page.locator('h1').count(),1);
      // Also cover a catalog series and a catalog detail: only detail gets ViewContent.
      await page.goto('https://www.jczcare.com/products/pet-training-pads', {waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>window.__metaCalls);
      assert.equal((await events('PageView')).length,1);
      assert.equal((await events('ViewContent')).length,0,'series listing is not a product detail');
      await page.goto('https://www.jczcare.com/products/pet-training-pads/standard-pet-urine-pads', {waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>window.__metaCalls);
      assert.equal((await events('ViewContent')).length,1,'catalog detail has ViewContent');
      assert.equal(await page.locator('h1').count(),1);
      const fill = async () => {
        const form=page.locator('form[aria-label="OEM inquiry form"]');
        await form.locator('input[name="name"]').fill('INTEGRATION TEST');
        if (!(await form.locator('details').getAttribute('open') !== null)) await form.locator('summary').click();
        await form.locator('input[name="email"]').fill('audit@example.com');
        await form.locator('input[name="phone"]').fill('+1 555 010 1000');
        await form.locator('select[name="product"]').selectOption({index:1});
        return form;
      };
      for (const scenario of ['saved','unsaved','failed']) {
        saved=scenario==='saved'; fail=scenario==='failed'; requests=0;
        await page.goto('https://www.jczcare.com/request-product-plan',{waitUntil:'domcontentloaded'});
        const form=await fill();
        await page.waitForFunction(()=>window.__metaCalls);
        await form.evaluate(f=>{f.requestSubmit();f.requestSubmit();});
        await page.waitForFunction(()=>document.querySelector('.inquiry-success-card') || document.querySelector('.form-message.error'));
        await page.waitForTimeout(200);
        assert.equal(requests,1,'repeat click sends one request');
        assert.equal((await events('Lead')).length,scenario==='saved'?1:0,scenario);
        const ga=await page.evaluate(()=>Array.from(window.dataLayer||[],x=>Array.from(x)));
        assert.equal(ga.filter(x=>x[0]==='event'&&x[1]==='generate_lead').length,scenario==='failed'?0:1);
        if (scenario==='saved') {
          assert.ok(!JSON.stringify(await calls()).includes('audit@example.com'));
          await page.screenshot({path:`output/integration/inquiry-${viewport.width}.png`,fullPage:true});
        }
      }
      await page.getByRole('button',{name:'Marketing cookie settings',exact:true}).click();
      await page.getByRole('button',{name:'Reject marketing',exact:true}).click();
      assert.ok((await calls()).some(x=>x[0]==='consent'&&x[1]==='revoke'));
      assert.deepEqual(errors,[]);
      await context.close();
    }
  } finally { await browser?.close(); server.kill(); }
});
