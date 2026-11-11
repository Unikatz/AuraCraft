const fs=require('fs');
const src=fs.readFileSync(require('path').join(__dirname,'.harness.js'),'utf8');
function stub(name='stub'){const store={};const f=function(){};return new Proxy(f,{
  get(t,p){if(p===Symbol.toPrimitive)return()=>0;if(p==='then')return undefined;if(p in store)return store[p];if(p==='length')return 0;if(p===Symbol.iterator)return function*(){};const s=stub(name+'.'+String(p));store[p]=s;return s;},
  set(t,p,v){store[p]=v;return true;},apply(){return stub(name+'()');},construct(){return stub('new '+name);}});}
const created=[];const listeners={win:{},doc:{},cv:{}};const els={};
function ctx2d(){const c=stub('ctx');c.createImageData=(w,h)=>({data:new Uint8ClampedArray(w*h*4)});c.getImageData=(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4)});c.measureText=()=>({width:50});c.createRadialGradient=()=>stub();c.createLinearGradient=()=>stub();return c;}
function el(id){const e=stub('el#'+id);e.getContext=()=>ctx2d();e.toDataURL=()=>'data:x';e.classList=stub();e.style=stub();e.addEventListener=(t,fn)=>{(e._l||(e._l={}))[t]=fn;};e.querySelector=()=>el('q');e.getBoundingClientRect=()=>({left:0,top:0,width:124,height:124});e.firstElementChild=stub();e.dataset={};return e;}
const btns=['break','place','jump','use','aura','run','67','bag','look'].map(a=>{const b=el('btn-'+a);b.dataset={act:a};return b;});
global.document={getElementById:id=>els[id]||(els[id]=el(id)),createElement:t=>{const e=el('new-'+t);created.push(e);return e;},querySelectorAll:()=>btns,querySelector:()=>null,addEventListener:(t,fn)=>{listeners.doc[t]=fn;},pointerLockElement:null,hidden:false,exitPointerLock(){}};
global.window={devicePixelRatio:1,innerWidth:1200,innerHeight:800,matchMedia:()=>({matches:false}),addEventListener:(t,fn)=>{listeners.win[t]=fn;}};
global.innerWidth=1200;global.innerHeight=800;
global.localStorage={getItem:()=>null,setItem:(k,v)=>{global.saved=v;}};
global.THREE=stub('THREE');
let rafCb=null;global.requestAnimationFrame=cb=>{rafCb=cb;};
global.performance={now:()=>T};let T=0;
const timers=[];global.setTimeout=(fn,ms)=>{timers.push([T+ms,fn]);return timers.length;};global.clearTimeout=()=>{};
function runTimers(){for(const t of timers.slice()){if(t[0]<=T){timers.splice(timers.indexOf(t),1);t[1]();}}}
const t0=Date.now();
eval(src);
console.log('init ok',Date.now()-t0,'ms');
T=40;runTimers();console.log('preview world loaded',Date.now()-t0,'ms');
const grassBtn=created.find(e=>e.id==='world-grass');grassBtn.onclick();T=200;runTimers();console.log('started grass',Date.now()-t0,'ms');
function frames(n){for(let i=0;i<n;i++){T+=16;rafCb(T);runTimers();}}
frames(30);

const t=window.__t,P=t.P;t.camera.position={x:0,y:0,z:0,set(a,b,c){this.x=a;this.y=b;this.z=c},copy(){}};
const kd=c=>listeners.win.keydown({code:c,repeat:false,preventDefault(){}}),ku=c=>listeners.win.keyup({code:c});
const kinds=()=>{const c={};for(const m of t.mobs){const k=m.kind==='animal'?m.opt.sp:m.kind;c[k]=(c[k]||0)+1;}return JSON.stringify(c);};
for(const w of ['grass','snow','desert','lava','food','dark','park']){const a=Date.now();t.loadWorld(w);const ms=Date.now()-a;frames(120);
  const v=t.village;let solids=t.isles.length;
  console.log(w.padEnd(7),ms+'ms','spawn',t.spawnPt.x,t.spawnPt.y,t.spawnPt.z,'player y',P.y.toFixed(1),'village',v&&[v.x,v.y,v.z].join(','),'isles',solids,'mobs',kinds());
  const vil=t.mobs.filter(m=>m.kind==='villager');console.log('        villagers y:',vil.map(m=>m.y.toFixed(1)+'@'+Math.hypot(m.x-v.x,m.z-v.z).toFixed(1)).join(' '),' animals stuck-in-block:',t.mobs.filter(m=>t.collides(m.x,m.y,m.z,.9)).length);}
// interactions in grass
t.loadWorld('grass');frames(30);
const vil=t.mobs.find(m=>m.kind==='villager');t.S.coins=50;t.S.inv[t.B.DIAMOND]=2;t.openTrade(vil);console.log('trade panel title:',els.ptitle.textContent);kd('Escape');
const an=t.mobs.find(m=>m.kind==='animal');const a0=t.S.aura;t.mobAction(an,'use');console.log('pet animal aura',a0,'->',t.S.aura);t.mobAction(an,'hit');console.log('animal flee',an.flee);
// fizzler: spawn near player, hit, wait
const before=t.mobs.length;
const fz=(()=>{t.S.time=.75;for(let k=0;k<40;k++){frames(80);const f=t.mobs.find(m=>m.kind==='fizzler');if(f)return f;}return null;})();
console.log('fizzler spawned at night?',!!fz,'dayF',t.dayF.toFixed(2));
if(fz){fz.x=P.x+6;fz.z=P.z;fz.y=P.y;const hb=P.hearts;t.mobAction(fz,'hit');console.log(' fuse',fz.fuse);frames(140);console.log(' fizzler gone?',fz.dead,'hearts',hb,'->',P.hearts);}
// sleep at night in a village bed
for(const m of t.mobs.slice())if(m.kind==='zombie'||m.kind==='fizzler'){m.dead=true;}
for(const m of t.mobs.slice())if(m.dead)t.mobs.splice(t.mobs.indexOf(m),1);
const hs=t.village.houses[0];let bed=null;for(let dz=-2;dz<=2;dz++)for(let dx=-2;dx<=2;dx++)if(t.get(hs.x+dx,t.village.y,hs.z+dz)===t.B.BED)bed=[hs.x+dx,t.village.y,hs.z+dz];
console.log('bed in house',JSON.stringify(bed));t.S.time=.8;frames(2);const a1=t.S.aura;t.goToSleep(...bed);console.log(' sleeping',t.sleepT>0);frames(200);console.log(' woke: time',t.S.time.toFixed(2),'aura +',t.S.aura-a1,'sitting',!!P.sit);
// zombies kept out of village houses
console.log('house interior isHouse:',t.isHouse(hs.x,t.village.y,hs.z));
// bounce pad in park
t.loadWorld('park');frames(30);let bp=null;for(let z=0;z<112&&!bp;z++)for(let x=0;x<112;x++){if(t.get(x,16,z)===t.B.BOUNCE&&!t.get(x,17,z)&&!t.get(x,18,z)){bp=[x,z];break;}}
P.x=bp[0]+.5;P.z=bp[1]+.5;P.y=24;P.vy=0;let landed=false,maxY=0,log=[];for(let i=0;i<200;i++){frames(1);if(!landed&&P.vy>0)landed=true;if(landed)maxY=Math.max(maxY,P.y);if(i%15==0)log.push(P.y.toFixed(1));}console.log("bounce: pad top y 17, max after landing",maxY.toFixed(1),log.join(" "));
console.log('saved bytes',(global.saved||'').length);
