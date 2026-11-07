// win rate by skill level, across several days
const { chromium, devices } = require('playwright');
const DAYS = +process.argv[2] || 6, N = +process.argv[3] || 3;
(async()=>{
 const b = await chromium.launch(); const p = await (await b.newContext(devices['iPhone 13'])).newPage();
 const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 let html = require('fs').readFileSync('crypt-compact.html','utf8');
 html = html.replace("const BOT_SLOP = 22;\nconst BOT_REPLAN = 0.2;\nconst BOT_MISS = 0.12;", "let BOT_SLOP = 22;\nlet BOT_REPLAN = 0.2;\nlet BOT_MISS = 0.12; let BOT_REACT = 1;");
 html = html.replace("b.botT = 0.05 + Math.random()*0.11;", "b.botT = (0.05 + Math.random()*0.11)*BOT_REACT;");
 html = html.replace("reset();\nresize();", `window.__run = (day, miss, slop, react, replan, n) => { buildDaily(new Date(2026, 9, 25 + day)); BOT_MISS = miss; BOT_SLOP = slop; BOT_REACT = react; BOT_REPLAN = replan; let w = 0, dmg = 0, to = 0, T = 0; for (let k = 0; k < n; k++){ bot.on = true; start(); let t = 0; while (t < 420 && state !== 'over' && state !== 'won'){ update(1/120); t += 1/120; } if (state === 'won') w++; else if (state !== 'over') to++; T += time; dmg += 100 - Math.max(0, hero.hp); } return { w, dmg: dmg/n, to, T: T/n }; };
reset();
resize();`);
 html = '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>[hidden]{display:none!important}body{margin:0}</style>' + html;
 require('fs').writeFileSync('skilltest2.html', html);
 await p.goto('file://'+process.cwd()+'/skilltest2.html'); await p.waitForTimeout(800);
 const levels = [['novice', .35, 60, 1.8, .35], ['casual', .22, 40, 1.4, .27], ['average', .12, 22, 1.0, .2]];
 for (const [name, m, s, r, rp] of levels){
   let w = 0, n = 0, dmg = 0, to = 0, T = 0;
   for (let d = 0; d < DAYS; d++){ const res = await p.evaluate(a => __run(...a), [d*2, m, s, r, rp, N]); w += res.w; n += N; dmg += res.dmg*N; to += res.to; T += res.T*N; }
   console.log(name.padEnd(8), `${w}/${n}`, Math.round(w/n*100) + '%', 'damage', Math.round(dmg/n), 'timeouts', to, 'avg time', Math.round(T/n) + 's');
 }
 console.log('errors', JSON.stringify(errs.slice(0,3))); await b.close();})();
