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
frames(60);const before=[P.x,P.y,P.z].map(v=>v.toFixed(1));P.x=10.5;P.z=10.5;P.y=25;P.vy=0;let low=99;for(let i=0;i<200;i++){frames(1);low=Math.min(low,P.y);}
console.log('fell from void: lowest y',low.toFixed(1),'now at',[P.x,P.y,P.z].map(v=>v.toFixed(1)).join(','),'(was',before.join(','),') hearts',P.hearts);