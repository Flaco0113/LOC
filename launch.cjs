const {spawn} = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
if(fs.existsSync(path.join(__dirname,'.env')))process.loadEnvFile(path.join(__dirname,'.env'));
const url = 'http://localhost:4173';
async function running() {
  try {
    const response = await fetch('http://127.0.0.1:4173/api/state', {signal:AbortSignal.timeout(1000)});
    return response.ok && Array.isArray((await response.json()).sports);
  } catch { return false; }
}
(async () => {
  if (!await running()) {
    const local = path.join(__dirname,'.local');
    fs.mkdirSync(local,{recursive:true});
    const out = fs.openSync(path.join(local,'server.log'),'a');
    const err = fs.openSync(path.join(local,'server-error.log'),'a');
    const server = spawn(process.execPath,[path.join(__dirname,'server.js')],{
      cwd:__dirname,detached:true,windowsHide:true,stdio:['ignore',out,err]
    });
    server.unref();
    fs.closeSync(out);fs.closeSync(err);
    fs.writeFileSync(path.join(local,'server.pid'),String(server.pid));
    let ready = false;
    for(let attempt=0;attempt<20;attempt++) {
      if(await running()){ready=true;break;}
      await new Promise(resolve=>setTimeout(resolve,250));
    }
    if(!ready)throw new Error('LOC did not start. See .local/server-error.log.');
  }
  console.log(`LOC is running at ${url}`);
  if(!process.argv.includes('--no-browser')) {
    const opener = spawn('rundll32.exe',['url.dll,FileProtocolHandler',url],{detached:true,windowsHide:true,stdio:'ignore'});
    opener.on('error',()=>console.log(`Open ${url} in your browser.`));
    opener.unref();
  }
})().catch(error=>{console.error(error.message);process.exitCode=1;});
