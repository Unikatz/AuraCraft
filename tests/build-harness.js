// Builds tests/.harness.js: the game's script from index.html plus a small hook
// that lets the tests reach inside it. Run by tests/run.sh.
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const i=html.indexOf("\n(()=>{\n'use strict';"),j=html.indexOf('</script>',i);
if(i<0||j<0){console.error('Could not find the game script in index.html');process.exit(1);}
const src=html.slice(i,j),k=src.lastIndexOf('})();');
fs.writeFileSync(path.join(__dirname,'.harness.js'),src.slice(0,k)+fs.readFileSync(path.join(__dirname,'hook.js'),'utf8')+src.slice(k));
console.log('harness built from index.html');
