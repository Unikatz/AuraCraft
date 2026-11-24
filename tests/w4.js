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
// Checks for build 2026.11-w4: creatures in the way when placing (feedback issues 1 and 4), Help says Gloomies (issue 3),
// the 30-minute stretch break and the tips for grown-ups (H1, H4). R2 (unknown blocks) is checked in rollback.js.
const t=window.__t,P=t.P,B=t.B;const cam={x:0,y:0,z:0,set(a,b,c){},copy(){}};t.camera.position=cam;
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1;};
const kd=c=>listeners.win.keydown({code:c,repeat:false,preventDefault(){}});
const toastTxt=()=>String(document.getElementById('toast').textContent);const clr=()=>{document.getElementById('toast').textContent='';};
for(const m of t.mobs.slice())if(m.kind==='zombie'||m.kind==='fizzler')t.mobs.splice(t.mobs.indexOf(m),1);
t.S.time=.3;
const X0=20,Z0=20,FY=50;for(let z=Z0;z<Z0+30;z++)for(let x=X0;x<X0+30;x++){t.setBlock(x,FY,z,B.CONCRETE,0,false);for(let y=FY+1;y<FY+7;y++)t.setBlock(x,y,z,0,0,false);}
frames(1);
const aim=(ex,ey,ez,tx,ty,tz)=>{cam.x=ex;cam.y=ey;cam.z=ez;const dx=tx-ex,dy=ty-ey,dz=tz-ez;P.yaw=Math.atan2(-dx,-dz);P.pitch=Math.atan2(dy,Math.hypot(dx,dz));};
const dog=t.mobs.find(t.isPet);let an=t.mobs.find(m=>m.kind==='animal');
if(!an){an=t.addMob('animal',X0+1.5,FY+1,Z0+1.5,null,{sp:0});}
ok(!!dog&&!!an,'a pet and a wild creature are on the isle');
const park=()=>{for(const m of t.mobs){m.x=2.5;m.z=2.5;m.y=80;m.vy=0;}};
const put=(m,x,z)=>{m.x=x+.5;m.z=z+.5;m.y=FY+1;m.vy=0;m.nap=null;m.love=0;};
P.x=X0+2.5;P.z=Z0+25.5;P.y=FY+1;P.vy=0;P.sit=null;t.S.slot=t.S.hotbar.indexOf(B.CONCRETE);
// 1) wild creature between the player and the target: Place aims past it and the block goes in
park();let tx=X0+10,tz=Z0+5;put(an,tx,tz+1);clr();
aim(tx+.5,FY+1.6,tz+3.5,tx+.5,FY+1.02,tz-.5);t.doPlace();
ok(t.get(tx,FY+1,tz-1)===B.CONCRETE&&!/likes you/.test(toastTxt()),'wild creature in front of the target: block placed behind it, creature not petted ("'+toastTxt()+'")');
ok(Math.floor(an.x)===tx&&Math.floor(an.z)===tz+1,'wild creature in front: not moved');
// 2) wild creature in the target square: no block, a message, creature not moved
park();tx=X0+15;tz=Z0+5;put(an,tx,tz);clr();
aim(tx+.5,FY+4.5,tz+3.5,tx+.5,FY+1.02,tz+.5);t.doPlace();
ok(t.get(tx,FY+1,tz)===0&&toastTxt()==='Something is in the way','wild creature in the target square: no block, message "'+toastTxt()+'"');
ok(Math.floor(an.x)===tx&&Math.floor(an.z)===tz,'wild creature in the target square: not moved');
// 3) Use still pets a wild creature
T+=1500;frames(1);park();tx=X0+20;tz=Z0+5;put(an,tx,tz);clr();P.x=tx+.5;P.z=tz+3.5;
aim(tx+.5,FY+1.6,tz+3.5,tx+.5,an.y+an.parts.hc,tz+.5);t.doUse();
ok(/likes you/.test(toastTxt()),'Use still pets a wild creature: "'+toastTxt()+'"');
// 4) pets still step aside
park();tx=X0+5;tz=Z0+12;put(dog,tx,tz);P.x=X0+2.5;P.z=Z0+25.5;
aim(tx+.5,FY+3.6,tz+3.5,tx+.5,FY+1.02,tz+.5);t.doPlace();
ok(t.get(tx,FY+1,tz)===B.CONCRETE&&!(Math.floor(dog.x)===tx&&Math.floor(dog.z)===tz),'pet in the target square still hops aside and the block goes in');
// 5) the pet never hops into water or lava: every free square beside it is water or lava except one
for(const[fl,nm]of[[B.WATER,'water'],[B.LAVA,'lava']]){
  park();tx=nm==='water'?X0+12:X0+20;tz=Z0+12;
  for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++)if(dx||dz)t.setBlock(tx+dx,FY+1,tz+dz,fl,0,false);
  t.setBlock(tx+1,FY+1,tz+1,0,0,false);put(dog,tx,tz);
  aim(tx+.5,FY+4.5,tz-2.5,tx+.5,FY+1.02,tz+.5);t.doPlace();
  const inF=[B.WATER,B.LAVA].includes(t.get(Math.floor(dog.x),Math.floor(dog.y+.05),Math.floor(dog.z)));
  ok(!inF&&Math.floor(dog.x)===tx+1&&Math.floor(dog.z)===tz+1,'pet next to '+nm+' hops to the one dry square, never into '+nm);
  // all water or lava: no hop, no block, message
  t.setBlock(tx+1,FY+1,tz+1,fl,0,false);t.setBlock(tx,FY+1,tz,0,0,false);put(dog,tx,tz);clr();
  t.doPlace();
  ok(t.get(tx,FY+1,tz)===0&&Math.floor(dog.x)===tx&&Math.floor(dog.z)===tz&&toastTxt()==='Something is in the way','pet surrounded by '+nm+': stays put, no block, message');}
// 6) Help never says "zombie", and has the tips for grown-ups (H4)
t.openHelp();const help=String(els.pbody.innerHTML);t.closePanel();
ok(help.length>500&&!/zombie/i.test(help)&&/Gloomies are red/.test(help)&&/Hit Gloomies/.test(help),'Help says Gloomies and never "zombie"');
ok(/For grown-ups/.test(help)&&/Under 2 hours/.test(help)&&/hour before bed/.test(help)&&/mealtimes screen-free/.test(help)&&/MOH Grow Well SG/.test(help),'Help has the For grown-ups tips with their sources');
// 7) H1 stretch break after 30 minutes of play
park();P.x=X0+2.5;P.z=Z0+25.5;P.y=FY+1;P.vy=0;const BRK=t.BRK;
ok(BRK.play>0&&BRK.play<60&&!BRK.on,'play time counts while playing ('+BRK.play.toFixed(1)+' s), no break yet');
BRK.play=1799;global.saved=null;frames(30);ok(!BRK.on,'no break before 30 minutes');
frames(50);ok(BRK.on&&t.paused&&global.saved&&BRK.left>19,'break shows at 30 minutes; the world is saved and paused');
frames(600);ok(BRK.on&&BRK.left>0&&BRK.left<12,'countdown runs ('+BRK.left.toFixed(1)+' s left)');
t.closePanel();kd('Escape');t.openBag();ok(BRK.on&&t.paused&&els.ptitle.textContent==='Stretch break','break cannot be closed or replaced before the countdown ends');
frames(700);ok(BRK.on&&BRK.left===0&&BRK.ready,'countdown ends at 0, Keep playing ready');
t.closePanel();ok(!BRK.on&&!t.paused&&BRK.play===0,'Keep playing closes the break and resets the timer');
// a Gloomy near: the break waits up to 2 more minutes, then the world is fully paused
frames(5);const z=t.addMob('zombie',P.x+3,FY+1,P.z-2);BRK.play=1800;frames(3);
ok(!BRK.on&&BRK.wait>0,'Gloomy within 10 blocks: the break waits');
BRK.wait=119.5;frames(40);ok(BRK.on&&t.paused,'after 2 minutes of waiting the break shows anyway');
const zp=[z.x,z.y,z.z].join(),h0=P.hearts,dp=[dog.x,dog.y,dog.z].join();frames(600);
ok([z.x,z.y,z.z].join()===zp&&P.hearts===h0&&[dog.x,dog.y,dog.z].join()===dp,'while the break shows nothing moves and nothing can hurt the player or pet');
frames(800);t.closePanel();t.mobs.splice(t.mobs.indexOf(z),1);
// 5 minutes away counts as a break
BRK.play=1500;document.hidden=true;listeners.doc.visibilitychange();T+=299000;document.hidden=false;listeners.doc.visibilitychange();
ok(BRK.play===1500,'under 5 minutes away: timer kept');
document.hidden=true;listeners.doc.visibilitychange();T+=300000;document.hidden=false;listeners.doc.visibilitychange();
ok(BRK.play===0,'5 minutes away: timer reset');
