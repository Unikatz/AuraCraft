const fs=require('fs');
const src=fs.readFileSync(require('path').join(__dirname,'.harness.js'),'utf8');
function stub(name='stub'){const store={};const f=function(){};return new Proxy(f,{
  get(t,p){if(p===Symbol.toPrimitive)return()=>0;if(p==='then')return undefined;if(p in store)return store[p];if(p==='length')return 0;if(p===Symbol.iterator)return function*(){};const s=stub(name+'.'+String(p));store[p]=s;return s;},
  set(t,p,v){store[p]=v;return true;},apply(){return stub(name+'()');},construct(){return stub('new '+name);}});}
const created=[];const listeners={win:{},doc:{},cv:{}};const els={};
function ctx2d(){const c=stub('ctx');c.createImageData=(w,h)=>({data:new Uint8ClampedArray(w*h*4)});c.getImageData=(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4)});c.measureText=()=>({width:50});c.createRadialGradient=()=>stub();c.createLinearGradient=()=>stub();return c;}
function el(id){const e=stub('el#'+id);e.getContext=()=>ctx2d();e.toDataURL=()=>'data:x';e.classList=stub();e.style=stub();e.addEventListener=(t,fn)=>{(e._l||(e._l={}))[t]=fn;};e.querySelector=()=>el('q');e.getBoundingClientRect=()=>({left:0,top:0,width:124,height:124});e.firstElementChild=stub();e.dataset={};return e;}
const btns=['break','place','jump','use','aura','run','67','bag','look'].map(a=>{const b=el('btn-'+a);b.dataset={act:a};return b;});
global.document={getElementById:id=>els[id]||(els[id]=el(id)),createElement:t=>{const e=el('new-'+t);created.push(e);return e;},querySelectorAll:()=>btns,addEventListener:(t,fn)=>{listeners.doc[t]=fn;},pointerLockElement:null,hidden:false,exitPointerLock(){}};
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
frames(10);const sx=Math.floor(P.x),sz=Math.floor(P.z),sy=Math.floor(P.y);console.log('start',P.x,P.y,P.z,'ground',P.ground);
// 1) dig a 1x1 hole 4 deep under the player and drop in
for(let d=1;d<=4;d++)t.setBlock(sx,sy-d,sz,0,0,false);frames(60);console.log('in hole y',P.y.toFixed(2),'(start',sy,')');
P.yaw=0;kd('KeyW');frames(20);console.log(' walk only y',P.y.toFixed(2));
kd('Space');frames(120);ku('Space');ku('KeyW');frames(30);console.log(' climb result y',P.y.toFixed(2),'escaped?',P.y>=sy-0.01, 'pos',P.x.toFixed(2),P.z.toFixed(2));
// 2) jump onto a single block in front
const bx=Math.floor(P.x),bz=Math.floor(P.z),by=Math.floor(P.y);
for(let d=1;d<=3;d++)for(let e=-1;e<=1;e++){/*clear path*/}
t.setBlock(bx,by,bz-2,8,0,true);t.setBlock(bx,by+1,bz-2,0,0,false);t.setBlock(bx,by+2,bz-2,0,0,false);t.setBlock(bx,by+1,bz-1,0,0,false);t.setBlock(bx,by,bz-1,0,0,false);
P.x=bx+.5;P.z=bz+.5;P.yaw=0;frames(20);const y0=P.y;kd('KeyW');frames(50);ku('KeyW');frames(20);console.log('step test: from',y0.toFixed(2),'to',P.y.toFixed(2),'at z',P.z.toFixed(2));
// 3) stuck inside a block -> pushed out
const cx=Math.floor(P.x),cy=Math.floor(P.y),cz=Math.floor(P.z);t.setBlock(cx,cy,cz,8,0,true);t.setBlock(cx,cy+1,cz,8,0,true);frames(3);console.log('embedded -> y',P.y.toFixed(2),'collides',t.collides(P.x,P.y,P.z));
// 4) pillar: look straight down, place under feet while jumping
P.x=30.5;P.z=30.5;P.y=50;frames(150);const yb=P.y;const fx0=Math.floor(P.x),fz0=Math.floor(P.z);console.log("pillar start",yb,"below",t.get(fx0,Math.floor(yb)-1,fz0));P.pitch=-1.55;t.S.slot=2;for(let k=0;k<4;k++){kd("Space");frames(14);ku("Space");t.doPlace();frames(40);console.log(" after place",P.y.toFixed(2),"col",[0,1,2,3,4].map(d=>t.get(fx0,Math.floor(yb)+d,fz0)).join(","));}
// 5) go home
P.x=10.5;P.z=10.5;P.y=60;frames(200);kd('KeyR');ku('KeyR');frames(10);console.log('home ->',P.x.toFixed(1),P.y.toFixed(1),P.z.toFixed(1),'spawn',t.spawnPt.x,t.spawnPt.y,t.spawnPt.z);
frames(50);console.log('where:',els.whereA.innerHTML,'|',els.whereB.textContent);
