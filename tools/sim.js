// fast headless balance test: the computer plays N full games at a fixed 60 fps step
const { chromium, devices } = require('playwright');
const N = +process.argv[2] || 12;
(async()=>{
 const b = await chromium.launch();
 const ctx = await b.newContext({ ...devices['iPhone 13'] });
 const p = await ctx.newPage();
 const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 let html = require('fs').readFileSync('crypt-compact.html','utf8');
 html = '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>[hidden]{display:none!important}body{margin:0}</style>' + html;
 html = html.replace("reset();\nresize();", "window.__sim = (maxSec) => { bot.on = true; start(); let t = 0; while (t < maxSec && state !== 'over' && state !== 'won'){ update(1/120); t += 1/120; } return { state, phase: boss.phase, bossHp: boss.hp, heroHp: hero.hp, time: +time.toFixed(1), real: +t.toFixed(1), ...stats }; };\nreset();\nresize();");
 require('fs').writeFileSync('simtest.html', html);
 await p.goto('file://'+process.cwd()+'/simtest.html');
 await p.waitForTimeout(800);
 const res = [];
 for (let i=0;i<N;i++){ res.push(await p.evaluate(()=>__sim(600))); }
 const wins = res.filter(r=>r.state==='won').length;
 console.log('wins', wins, '/', N);
 const avg = k => (res.reduce((a,r)=>a+r[k],0)/N).toFixed(1);
 console.log('phase reached avg', avg('phase'), '| hits', avg('hits'), '| perfects', avg('perfects'), '| grazes', avg('grazes'), '| dodges', avg('dodges'), '| lanterns', avg('lanterns'), '| triples', avg('triples'), '| garlic', avg('garlic'), '| kicks', avg('kicks'), '| game time', avg('time'));
 console.log(res.map(r=>`${r.state[0]}${r.phase}:${Math.round(r.bossHp)}:${r.killer||(r.cause||'').split(' ').pop()}`).join(' ')); console.log('openHits', avg('openHits'), 'blocked', avg('blocked'), 'shatters', avg('shatters'), 'shards', avg('shards'), 'pins', avg('pins'));
 console.log('errors', JSON.stringify(errs.slice(0,3)));
 await b.close();})();
