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
// Checks for build 2026.11-w3: a pet in the way hops aside (feedback issue 1) and a 2-high glass door opens with one press (feedback issue 2).
const t=window.__t,P=t.P,B=t.B;const cam={x:0,y:0,z:0,set(a,b,c){},copy(){}};t.camera.position=cam;
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1;};
const toastTxt=()=>els.toast?String(els.toast.textContent):'';
for(const m of t.mobs.slice())if(m.kind==='zombie'||m.kind==='fizzler')t.mobs.splice(t.mobs.indexOf(m),1);
t.S.time=.3;
// a test area in the sky: floor at y 50, air from 51 to 56
const X0=20,Z0=20,FY=50;for(let z=Z0;z<Z0+30;z++)for(let x=X0;x<X0+30;x++){t.setBlock(x,FY,z,B.CONCRETE,0,false);for(let y=FY+1;y<FY+7;y++)t.setBlock(x,y,z,0,0,false);}
frames(1);
const aim=(ex,ey,ez,tx,ty,tz)=>{cam.x=ex;cam.y=ey;cam.z=ez;const dx=tx-ex,dy=ty-ey,dz=tz-ez;P.yaw=Math.atan2(-dx,-dz);P.pitch=Math.atan2(dy,Math.hypot(dx,dz));};
const pets=t.mobs.filter(m=>m.kind==='dog'||m.kind==='cat');ok(pets.length>0,'a pet is on the isle: '+pets.map(m=>m.name).join(', '));
const dog=pets[0];const others=t.mobs.filter(m=>m!==dog);const park=()=>{for(const m of others){m.x=2.5;m.z=2.5;m.y=80;}};
P.x=X0+2.5;P.z=Z0+25.5;P.y=FY+1;P.vy=0;P.sit=null;t.S.slot=t.S.hotbar.indexOf(B.CONCRETE);t.S.inv[B.CONCRETE]=(t.S.inv[B.CONCRETE]||0)+20;
// 1) pet stands in the target square: it hops to a free square beside it and the block is placed
park();let tx=X0+7,tz=Z0+7;dog.x=tx+.5;dog.z=tz+.5;dog.y=FY+1;dog.vy=0;dog.nap=null;
aim(tx+.5,FY+3.6,tz+3.5,tx+.5,FY+1.02,tz+.5);t.doPlace();
ok(t.get(tx,FY+1,tz)===B.CONCRETE,'block placed where the pet stood');
ok(!(Math.floor(dog.x)===tx&&Math.floor(dog.z)===tz)&&Math.abs(Math.floor(dog.x)-tx)<=1&&Math.abs(Math.floor(dog.z)-tz)<=1,'pet hopped to a square beside it: '+[Math.floor(dog.x),Math.floor(dog.z)].join(','));
ok(Math.floor(dog.y+.05)===FY+1&&!t.collides(dog.x,dog.y,dog.z,.9),'pet stands on the floor, not inside a block (y '+dog.y+')');
// 2) walled-in pet: no block placed, message shown, pet stays
tx=X0+15;tz=Z0+7;for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++)if(dx||dz)for(const y of[FY+1,FY+2])t.setBlock(tx+dx,y,tz+dz,B.CONCRETE,0,false);
dog.x=tx+.5;dog.z=tz+.5;dog.y=FY+1;dog.vy=0;els.toast&&(els.toast.textContent='');
aim(tx+.5,FY+4.5,tz+.5,tx+.5,FY+1.02,tz+.5);t.doPlace();
ok(t.get(tx,FY+1,tz)===0,'walled-in pet: no block placed');
ok(toastTxt()==='Something is in the way','walled-in pet: message "'+toastTxt()+'"');
ok(Math.floor(dog.x)===tx&&Math.floor(dog.z)===tz,'walled-in pet stays where it is');
// 3) another creature in the way: never silent, never moved
const an=t.mobs.find(m=>m.kind==='animal');
if(an){tx=X0+7;tz=Z0+15;an.x=tx+.5;an.z=tz+.5;an.y=FY+1;an.vy=0;els.toast&&(els.toast.textContent='');
  aim(tx+.06,FY+4.5,tz+.06,tx+.06,FY+1.02,tz+.06);t.doPlace();
  ok(t.get(tx,FY+1,tz)===0&&Math.floor(an.x)===tx&&Math.floor(an.z)===tz,'other creature in the way: no block placed, creature not moved');
  ok(toastTxt()==='Something is in the way'||/likes you/.test(toastTxt()),'other creature in the way: the game says something ("'+toastTxt()+'")');
  an.y=80;}
else ok(true,'no wild creature on this isle to check (skipped)');
// 4) with a block in hand, Place aims through the pet; Use still pets it
tx=X0+20;tz=Z0+15;dog.x=tx+.5;dog.z=tz+.5;dog.y=FY+1;dog.vy=0;
els.toast.textContent='';aim(tx+.5,FY+1.6,tz+3.5,tx+.5,FY+1.02,tz-.5);const a0=t.S.aura;t.doPlace();
ok(t.S.aura-a0!==2&&!/loves you/.test(toastTxt())&&t.get(tx,FY+1,tz-1)===B.CONCRETE,'Place with a block in hand aims through the pet and places the block behind it');
T+=1500;frames(1);dog.x=tx+.5;dog.z=tz+.5;dog.y=FY+1;dog.vy=0;dog.nap=null;
aim(tx+.5,FY+1.6,tz+3.5,tx+.5,FY+1.3,tz+.5);const a1=t.S.aura;t.doUse();
ok(t.S.aura-a1===2&&/loves you/.test(toastTxt()),'Use still pets the pet: "'+toastTxt()+'"');
// ---- glass door ----
for(const m of t.mobs){m.x=2.5;m.z=2.5;m.y=80;}
const G=B.GLASS,O=B.GLASS_OPEN,gx=X0+5,gz=Z0+22;
const col=(n)=>[1,2,3].slice(0,n).map(k=>t.get(gx,FY+k,gz));
const setCol=ids=>{for(let k=1;k<=3;k++)t.setBlock(gx,FY+k,gz,ids[k-1]||0,0,true);};
const use=y=>{P.x=gx+.5;P.z=gz+4.5;P.y=FY+1;aim(gx+.5,FY+1.6,gz+3.5,gx+.5,y+.5,gz+1);t.doUse();};
setCol([G,G]);use(FY+1);ok(col(2).join()===[O,O].join(),'press the bottom of a closed pair: both open');
use(FY+2);ok(col(2).join()===[G,G].join(),'press the top of an open pair: both close');
setCol([O,G]);use(FY+2);ok(col(2).join()===[O,O].join(),'mixed pair, press the closed top: both end open');
setCol([G,O]);use(FY+2);ok(col(2).join()===[G,G].join(),'mixed pair, press the open top: both end closed');
setCol([O,G]);use(FY+1);ok(col(2).join()===[G,G].join(),'mixed pair, press the open bottom: both end closed');
// doorway check on both blocks
setCol([O,O]);const tryClose=(py,y)=>{P.x=gx+.5;P.z=gz+.5;P.y=py;els.toast.textContent='';aim(gx+.5,FY+1.6,gz+3.5,gx+.5,y+.5,gz+1);t.doUse();};
tryClose(FY+1,FY+2);ok(col(2).join()===[O,O].join()&&toastTxt()==='Step out of the doorway first','player in the doorway: pressing the top does not close the pair');
tryClose(FY+2.5,FY+1);ok(col(2).join()===[O,O].join()&&toastTxt()==='Step out of the doorway first','player only in the top block: pressing the bottom does not close the pair');
tryClose(FY+1-P.h+.5,FY+2);ok(col(2).join()===[O,O].join()&&toastTxt()==='Step out of the doorway first','player only in the bottom block: pressing the top does not close the pair');
// a third stacked glass block never moves
setCol([G,G,G]);use(FY+1);ok(col(3).join()===[O,O,G].join(),'3 stacked, press the bottom: only the bottom two open');
setCol([G,G,G]);use(FY+2);ok(col(3).join()===[O,O,G].join(),'3 stacked, press the middle: it opens with the one below, the top stays shut');
setCol([G,G,G]);use(FY+3);ok(col(3).join()===[G,O,O].join(),'3 stacked, press the top: it opens with the one below, the bottom stays shut');
// a single window still works on its own
setCol([G]);use(FY+1);ok(col(2).join()===[O,0].join(),'single glass block opens on its own');
console.log('saved bytes',(global.saved||'').length);
