// the computer plays daily levels for many different dates
const { chromium, devices } = require('playwright');
const DAYS = +process.argv[2] || 12, RUNS = +process.argv[3] || 3;
(async()=>{
 const b = await chromium.launch();
 const ctx = await b.newContext({ ...devices['iPhone 13'] });
 const p = await ctx.newPage();
 const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 let html = require('fs').readFileSync('crypt-compact.html','utf8');
 html = '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>[hidden]{display:none!important}body{margin:0}</style>' + html;
 html = html.replace("reset();\nresize();", "window.__day = (off) => { const d = new Date(2026, 9, 25 + off); buildDaily(d); return { num: DAILY.num, name: DAILY.name, twist: DAILY.twist.name, hp: DAILY.phase.hp, labels: DAILY.labels.join(', ') }; };\nwindow.__sim = (maxSec) => { bot.on = true; start(); let t = 0; while (t < maxSec && state !== 'over' && state !== 'won'){ update(1/120); t += 1/120; } return { state, left: boss.hp/boss.max, time: +time.toFixed(1), ...stats }; };\nreset();\nresize();");
 require('fs').writeFileSync('simtest.html', html);
 await p.goto('file://'+process.cwd()+'/simtest.html');
 await p.waitForTimeout(800);
 let totW = 0, totN = 0;
 for (let d=0; d<DAYS; d++){
   const info = await p.evaluate(o=>__day(o), d);
   const res = []; for (let i=0;i<RUNS;i++) res.push(await p.evaluate(()=>__sim(400)));
   const w = res.filter(r=>r.state==='won').length; totW += w; totN += RUNS;
   const hits = (res.reduce((a,r)=>a+r.hits,0)/RUNS).toFixed(1), tm = (res.reduce((a,r)=>a+r.time,0)/RUNS).toFixed(0);
   console.log(`#${info.num} ${info.name} | ${info.twist} | ${info.hp}hp | ${info.labels} -> won ${w}/${RUNS}, hits ${hits}, ${tm}s`);
 }
 console.log('TOTAL', totW, '/', totN, 'errors', JSON.stringify(errs.slice(0,3)));
 await b.close();})();
