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
const sent=[];globalThis.fetch=(u,o)=>{sent.push([u,o]);return Promise.resolve({});};
const st=()=>t.tut?t.tut.step:'done';const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1;};
frames(60);ok(st()===0&&els.qStep.textContent==='Quick guide · 1 of 8','guide starts: '+els.qStep.textContent);
const cv=els.game;cv._l.pointerdown({pointerType:'mouse',button:0,clientX:0,clientY:0,pointerId:1});for(let i=0;i<30;i++)cv._l.pointermove({pointerType:'mouse',clientX:i*20,clientY:0});cv._l.pointerup({pointerType:'mouse',pointerId:1});P.yaw=0;P.pitch=0;
frames(3);ok(st()===1,'look -> walk');
const s=t.tut.site;
kd('KeyW');let k=0;while(st()===1&&k<400){frames(1);k++;}ku('KeyW');ok(st()===2&&els.qTitle.textContent==='Break a block','walk -> '+els.qTitle.textContent);
P.x=s.jb.x+.5;P.z=s.jb.z+.5;P.y=s.jb.y+1;P.pitch=-1.55;frames(3);t.doBreak();frames(5);ok(st()===3,'break -> pick a block');
t.openBag();t.tutEv('bag');kd('Escape');frames(2);ok(st()===4,'bag -> place');
P.pitch=-0.5;for(let i=0;i<8&&st()===4;i++){P.yaw=i*1.1;frames(2);t.doPlace();frames(2);}ok(st()===5,'place 3 -> house: '+els.qStep.textContent);
frames(5);P.x=s.ox+2.5;P.z=s.oz+6.5;P.y=s.base+1;frames(5);
let n=0;while(t.build&&n<80){frames(1);const g=t.nextG;if(!g){frames(1);continue;}t.placeGhost(g);n++;}frames(5);ok(st()===6&&els.qTitle.textContent==='Sleep in your bed','house ('+n+' blocks) -> '+els.qTitle.textContent+' | '+els.qStep.textContent);
for(const m of t.mobs.slice())if(m.kind==='zombie'||m.kind==='fizzler')t.mobs.splice(t.mobs.indexOf(m),1);
t.goToSleep(s.ox+2,s.base+1,s.oz+2);frames(260);ok(st()===7&&els.qStep.textContent==='Quick guide · 8 of 8','sleep -> '+els.qTitle.textContent+' | '+els.qStep.textContent);
const c0=t.S.coins;P.x=t.spawnPt.x+15;P.z=t.spawnPt.z+5;P.y=40;frames(300);kd('KeyR');ku('KeyR');frames(5);
ok(st()==='done'&&t.S.tutDone===true&&t.S.coins===c0+67&&!!t.S.tipSite,'core guide ends after 8 steps, +67 coins, tutDone '+t.S.tutDone);
// More tips
T+=2000;runTimers();frames(5);
t.openTips();ok(els.ptitle.textContent==='More tips','More tips panel opens');kd('Escape');frames(2);
t.startTips();frames(3);ok(st()===8&&els.qStep.textContent==='More tips · 1 of 12','tips start: '+els.qStep.textContent+' '+els.qTitle.textContent);
const jb=t.tut.site.jb;ok(t.get(jb.x,jb.y,jb.z)===t.B.WOOD,'wooden block put back for the jump tip');
P.x=jb.x+.5;P.z=jb.z+.5;P.y=jb.y+1.3;frames(40);ok(st()===9,'jump -> door');
t.tutEv('door');t.tutEv('sit');ok(st()===11,'door, sit -> torch');
t.toggleTorch();frames(1);t.tutEv('pet');t.tutEv('craft');ok(st()===14,'torch, pet, craft -> popper');
frames(3);const g=t.ghosts[0];ok(!!g,'popper ghost shown');t.placeGhost(g);frames(2);P.x=g.x+.5;P.z=g.z+2.5;P.y=g.y;t.explode(g.x,g.y,g.z,3.2);frames(5);ok(st()===15&&!!t.tut.site.tre,'popper -> treasure');
const tr=t.tut.site.tre;t.openTreasure(tr.x,tr.y,tr.z);frames(3);t.tutEv('sell');kd('KeyF');frames(260);ku('KeyF');t.emote67();frames(2);ok(st()===19,'treasure, sell, farm, 6 7 -> isle: step '+st());
t.loadWorld('food');t.tutEv('world');frames(100);ok(st()==='done'&&t.S.tipsDone===true,'all 12 tips done');
// old saves map onto the new order
ok(t.EVK_OLD.every(e=>t.EVK.indexOf(e)>=0)&&t.EVK.indexOf(t.EVK_OLD[7])===9&&t.EVK.indexOf(t.EVK_OLD[18])===7,'old guide positions map to new steps');
// look speed
const turn=()=>{P.yaw=0;kd('ArrowLeft');frames(30);ku('ArrowLeft');return P.yaw;};t.S.look=1;const a=turn();t.S.look=.6;const b=turn();t.S.look=1.5;const c=turn();t.S.look=1;
ok(Math.abs(b/a-.6)<.02&&Math.abs(c/a-1.5)<.02,'look speed slow/normal/fast = '+[b,a,c].map(v=>v.toFixed(2)).join(' / '));
// feedback: no free text, no name
t.sendFeedback('confusing','Turning and looking');const pl=JSON.parse(sent[0][1].body);
ok(sent.length===1&&sent[0][1].mode==='no-cors'&&pl.product==='aura-isles'&&pl.kind==='confusing'&&pl.name===''&&pl.title==='Something is hard: Turning and looking'&&pl.details.includes(t.VERSION),'feedback payload: '+JSON.stringify(pl));
ok(Object.keys(pl).sort().join()==='details,device,kind,name,product,title','feedback sends only fixed fields');
