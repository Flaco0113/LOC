import {createKernel} from './app-kernel.js';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { recordOutcome } from './metrics.js';
import { mailConfiguration } from './mail.js';
const mailConfig=mailConfiguration();

const root = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.LOC_DATA_DIR || path.join(root, '.local');
fs.mkdirSync(dataDir, { recursive: true });
const dataFile = path.join(dataDir, 'store.json');
let db = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, 'utf8')) : { users: [], sessions: {}, leagues: [], invites: [], revision: 0 };
const port = Number(process.env.PORT || 4173);
const kernel=createKernel(db,{mailConfig,dataDir,save(value){db=value;fs.writeFileSync(`${dataFile}.tmp`,JSON.stringify(db,null,2));fs.renameSync(`${dataFile}.tmp`,dataFile);}});
const {api,readSession,advanceClocks,flushMail}=kernel;
const fail=(status,message)=>{throw Object.assign(new Error(message),{status});};
async function body(req){let text="";for await(const chunk of req){text+=chunk;if(text.length>32000)fail(413,"Request too large.");}try{return JSON.parse(text||"{}");}catch{fail(400,"Invalid request.");}}
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon'};
const server=http.createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');res.setHeader('Cache-Control','no-store');
  res.setHeader('Content-Security-Policy',"default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'");
  try {
    const host=req.headers.host;
    if(![`localhost:${port}`,`127.0.0.1:${port}`].includes(host))fail(403,'Localhost access only.');
    const url=new URL(req.url,`http://${host}`);if(req.method==='POST'&&url.pathname.startsWith('/api/')){const began=Date.now();res.on('finish',()=>{try{recordOutcome(dataDir,url.pathname,res.statusCode,Date.now()-began);}catch{console.error('Could not save aggregate outcome metrics.');}});}
    const exportMatch=url.pathname.match(/^\/api\/leagues\/([^/]+)\/export$/);
    if(exportMatch&&req.method==='GET'){
      const {format,content}=kernel.exportLeague(req,url);
      res.setHeader('Content-Type',format==='recap'?'text/plain; charset=utf-8':'text/csv; charset=utf-8');res.setHeader('Content-Disposition','attachment; filename="LOC-'+format+(format==='recap'?'.txt':'.csv')+'"');res.end(content);return;
    }
    if(url.pathname.startsWith('/api/')) {
      if(req.method==='POST'&&req.headers.origin&&req.headers.origin!==`http://${host}`)fail(403,'Cross-origin request rejected.');
      const b=req.method==='POST'?await body(req):{};advanceClocks();const result=api(req,res,url.pathname,b,readSession(req));res.setHeader('Content-Type','application/json');res.end(JSON.stringify(result));return;
    }
    if(req.method!=='GET')fail(405,'Method not supported.');
    const allowed=['/experience-model.js','/experience-ui.js','/product-model.js','/product-ui.js','/ui-state.js','/script.js','/styles.css','/favicon.svg']; let file;
    if(allowed.includes(url.pathname))file=path.join(root,url.pathname.slice(1));
    else if(url.pathname==='/assets/loc-hero.png')file=path.join(root,'assets','loc-hero.png');
    else if(!path.extname(url.pathname)||url.pathname==='/index.html')file=path.join(root,'index.html');
    else fail(404,'Not found.');
    res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));
  } catch(error){res.statusCode=error.status||500;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error:error.status?error.message:'Unable to save this change. Please retry.',field:error.field}));if(!error.status)console.error(error);}
});
const mailTimer=setInterval(()=>flushMail().catch(()=>{}),1000);
const timer=setInterval(()=>{try{advanceClocks();}catch(e){console.error('Clock save failed:',e.message);}},500);
server.listen(port,'127.0.0.1',()=>console.log(`LOC local: http://localhost:${port} · data: ${dataDir}`));
function stop(){clearInterval(timer);clearInterval(mailTimer);server.close(()=>process.exit(0));}
process.on('SIGTERM',stop);process.on('SIGINT',stop);
