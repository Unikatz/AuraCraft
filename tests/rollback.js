// Rollback check: can players go back to the `stable` version without losing anything?
// 1. Every block this version lets players place must also exist in `stable`.
//    A new block ships first as noplace:true (stable-safe), and becomes placeable one release later.
// 2. A save made by this version (one of every placeable block, coins, settings) loads in
//    `stable` with no errors and nothing lost, and the save `stable` writes back loads here again.
// Needs the stable branch: git fetch origin stable. Usage: node rollback.js
const fs=require('fs'),path=require('path'),os=require('os'),{execFileSync}=require('child_process');

if(process.argv[2]==='worker')return worker(...process.argv.slice(3));

const root=path.join(__dirname,'..'),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'rollback-'));
let stableHtml;
for(const ref of ['origin/stable','stable']){try{stableHtml=execFileSync('git',['show',ref+':index.html'],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore'],maxBuffer:64e6});break;}catch(e){}}
if(!stableHtml){console.log('FAIL could not read index.html from the stable branch. Run: git fetch origin stable');process.exit(1);}
const NEW=path.join(root,'index.html'),OLD=path.join(tmp,'stable.html');fs.writeFileSync(OLD,stableHtml);
const run=(...a)=>{const r=require('child_process').spawnSync(process.execPath,[__filename,'worker',...a],{encoding:'utf8',timeout:170000});const out=(r.stdout||'')+(r.stderr||'');if(r.status!==0)console.log(out.trim());return{ok:r.status===0,out};};
let fail=0;const f=p=>path.join(tmp,p);

// 1. blocks
const nb=run(NEW,'blocks','-',f('new-blocks.json')),ob=run(OLD,'blocks','-',f('old-blocks.json'));
if(!nb.ok||!ob.ok){console.log('FAIL could not list blocks');process.exit(1);}
const NBk=JSON.parse(fs.readFileSync(f('new-blocks.json'))),OBk=JSON.parse(fs.readFileSync(f('old-blocks.json')));
const added=Object.keys(NBk).filter(id=>!OBk[id]);
for(const id of added){
  if(NBk[id].noplace)console.log('PASS new block',NBk[id].name,'(id '+id+') is not placeable yet, so stable stays safe');
  else{fail=1;console.log('FAIL new block',NBk[id].name,'(id '+id+') can be placed but stable does not know it. Ship it with noplace:true first and make it placeable in the next release.');}}
for(const id of Object.keys(OBk))if(!NBk[id]){fail=1;console.log('FAIL block id',id,'('+OBk[id].name+') exists in stable but was removed. Never remove or reuse a block id.');}
if(!added.length)console.log('PASS no new block ids compared with stable');

// 2. save round trip: this version -> stable -> this version
const steps=[[NEW,'make','-','s1.json','this version makes a save'],[OLD,'load','s1.json','s2.json','stable loads it (rollback)'],[NEW,'load','s2.json','s3.json','this version loads what stable saved (roll forward)']];
for(const[h,mode,i,o,label]of steps){const r=run(h,mode,i==='-'?'-':f(i),f(o),f('check.json'));
  const bad=!r.ok||/^FAIL/m.test(r.out);console.log(bad?'FAIL':'PASS',label);if(bad){fail=1;console.log(r.out.split('\n').filter(l=>/^FAIL/.test(l)).slice(0,8).join('\n'));break;}}
fs.rmSync(tmp,{recursive:true,force:true});
process.exit(fail);

function worker(htmlP,mode,inP,outP,chkP){
  const html=fs.readFileSync(htmlP,'utf8');const i=html.indexOf("\n(()=>{\n'use strict';"),j=html.indexOf('</script>',i);
  if(i<0||j<0){console.log('FAIL could not find the game script');process.exit(1);}
  let src=html.slice(i,j);const k=src.lastIndexOf('})();');
  src=src.slice(0,k)+"window.__rb={P,get,setBlock,S,persist,B,DEF,get curType(){return curType}};\n"+src.slice(k);
  function stub(name='stub'){const store={};const fn=function(){};return new Proxy(fn,{get(t,p){if(p===Symbol.toPrimitive)return()=>0;if(p==='then')return undefined;if(p in store)return store[p];if(p==='length')return 0;if(p===Symbol.iterator)return function*(){};const s=stub(name+'.'+String(p));store[p]=s;return s;},set(t,p,v){store[p]=v;return true;},apply(){return stub(name+'()');},construct(){return stub('new '+name);}});}
  const created=[],listeners={win:{},doc:{}},els={};
  function ctx2d(){const c=stub('ctx');c.createImageData=(w,h)=>({data:new Uint8ClampedArray(w*h*4)});c.getImageData=(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4)});c.measureText=()=>({width:50});c.createRadialGradient=()=>stub();c.createLinearGradient=()=>stub();return c;}
  function el(id){const e=stub('el#'+id);e.getContext=()=>ctx2d();e.toDataURL=()=>'data:x';e.classList=stub();e.style=stub();e.addEventListener=(t,fn)=>{(e._l||(e._l={}))[t]=fn;};e.querySelector=()=>el('q');e.querySelectorAll=()=>[];e.getBoundingClientRect=()=>({left:0,top:0,width:124,height:124});e.firstElementChild=stub();e.dataset={};return e;}
  const btns=['break','place','jump','use','aura','run','67','bag','look'].map(a=>{const b=el('btn-'+a);b.dataset={act:a};return b;});
  global.document={getElementById:id=>els[id]||(els[id]=el(id)),createElement:t=>{const e=el('new-'+t);created.push(e);return e;},querySelectorAll:()=>btns,querySelector:()=>null,addEventListener:(t,fn)=>{listeners.doc[t]=fn;},pointerLockElement:null,hidden:false,exitPointerLock(){}};
  global.window={devicePixelRatio:1,innerWidth:1200,innerHeight:800,matchMedia:()=>({matches:false}),addEventListener:(t,fn)=>{listeners.win[t]=fn;}};
  global.innerWidth=1200;global.innerHeight=800;
  let saved=inP==='-'?null:fs.readFileSync(inP,'utf8');
  global.localStorage={getItem:()=>saved,setItem:(k,v)=>{saved=v;}};
  global.THREE=stub('THREE');let rafCb=null;global.requestAnimationFrame=cb=>{rafCb=cb;};
  let T=0;global.performance={now:()=>T};const timers=[];global.setTimeout=(fn,ms)=>{timers.push([T+ms,fn]);return timers.length;};global.clearTimeout=()=>{};
  const runTimers=()=>{for(const t of timers.slice())if(t[0]<=T){timers.splice(timers.indexOf(t),1);t[1]();}};
  const frames=n=>{for(let q=0;q<n;q++){T+=16;rafCb&&rafCb(T);runTimers();}};
  const fail=(m)=>{console.log('FAIL '+m);process.exit(1);};
  process.on('uncaughtException',e=>fail('the game crashed: '+String(e&&e.stack||e).split('\n').slice(0,2).join(' / ')));
  eval(src);const t=window.__rb;
  if(mode==='blocks'){const o={};t.DEF.forEach((d,id)=>{if(id&&d)o[id]={name:d.name,noplace:!!d.noplace};});fs.writeFileSync(outP,JSON.stringify(o));return;}
  T=40;runTimers();const btn=created.find(e=>e.id==='world-grass');if(!btn)fail('no grass world button');
  btn.onclick();T=200;runTimers();frames(60);
  if(mode==='make'){
    const x0=Math.floor(t.P.x)+3,z0=Math.floor(t.P.z)+3,blocks=[];let n=0;
    t.DEF.forEach((d,id)=>{if(!id||!d||d.noplace||d.fluid||d.shape==='pet')return;const x=x0+(n%12)*2,z=z0+Math.floor(n/12)*2;n++;let y=60;while(y>1&&!t.get(x,y-1,z))y--;t.setBlock(x,y,z,id,0,true);blocks.push([x,y,z,id,d.name]);});
    t.S.coins=(t.S.coins||0)+123;t.S.look=1.5;t.persist();frames(30);t.persist();
    fs.writeFileSync(chkP,JSON.stringify({blocks,coins:t.S.coins,look:t.S.look}));
    console.log('PASS placed',blocks.length,'blocks');
  }else{
    const c=JSON.parse(fs.readFileSync(chkP,'utf8'));let lost=c.blocks.filter(([x,y,z,id])=>t.get(x,y,z)!==id);
    if(lost.length)fail(lost.length+' blocks lost or changed, e.g. '+lost.slice(0,3).map(b=>b[4]).join(', '));
    if(t.S.coins!==c.coins)fail('coins changed from '+c.coins+' to '+t.S.coins);
    if(t.S.look!==c.look)fail('a saved setting was dropped (look speed '+c.look+' became '+t.S.look+')');
    frames(300);t.persist();console.log('PASS',c.blocks.length,'blocks, coins and settings kept');
  }
  fs.writeFileSync(outP,saved||'');
}
