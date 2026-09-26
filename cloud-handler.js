import {createKernel} from './app-kernel.js';
import crypto from 'node:crypto';

// Storage is injected so CAS conflicts and authorization can be tested without a cloud account.
export function cloudHandler(store, {origin='https://loc-one.vercel.app'}={}) {
  return async request => {
    const headers=new Headers({'Content-Type':'application/json','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});
    const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
    try {
      const url=new URL(request.url);
      url.pathname=url.pathname.replace(/^\/(?:functions\/v1\/)?loc-api(?=\/)/,'');
      if(!url.pathname.startsWith('/api/'))return json({error:'Not found.'},404);
      if(!['GET','POST'].includes(request.method))return json({error:'Method not supported.'},405);
      if(request.method==='POST'&&request.headers.get('origin')!==origin)return json({error:'Cross-origin request rejected.'},403);
      if(request.method==='POST'&&!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'Use a JSON request.'},415);
      let body={};
      if(request.method==='POST') {
        // Stream with a bound, rather than allocating an unbounded body first.
        const reader=request.body?.getReader();let size=0,text='';const decoder=new TextDecoder();
        if(reader)while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>32000){await reader.cancel();return json({error:'Request too large.'},413);}text+=decoder.decode(value,{stream:true});}
        try {body=JSON.parse(text+decoder.decode()||'{}');}catch{return json({error:'Invalid request.'},400);}
        if(!body||typeof body!=='object'||Array.isArray(body))return json({error:'Invalid request.'},400);
      }
      const hash=v=>crypto.createHash('sha256').update(v).digest('hex');
      const ip=request.headers.get('x-forwarded-for')?.split(',')[0].trim()||'unknown';
      if(request.method==='POST') {
        if(!await store.limit('ip:'+hash(ip),60))return json({error:'Too many attempts. Wait a minute and retry.'},429);
        if(url.pathname.startsWith('/api/auth/')&&body.email&& !await store.limit('account:'+hash(String(body.email).trim().toLowerCase()),15))return json({error:'Too many account attempts. Wait a minute and retry.'},429);
      }
      // Every attempt gets its own state. A successful compare-and-swap is the only commit point.
      // Cookies and success responses are withheld until the transaction is durable.
      for(let attempt=0;attempt<8;attempt++) {
        const row=await store.load();
        let dirty=false;
        const kernel=createKernel(row.state,{hosted:true,save:()=>{dirty=true;}});
        const req={method:request.method,headers:{cookie:request.headers.get('cookie')||''},socket:{remoteAddress:ip}};
        const pending=new Headers(headers);
        const res={setHeader:(key,value)=>pending.set(key,value)};
        let result,error,exported;
        try {
          kernel.advanceClocks();
          if(request.method==='GET'&&/^\/api\/leagues\/[^/]+\/export$/.test(url.pathname))exported=kernel.exportLeague(req,url);
          else result=kernel.api(req,res,url.pathname,body,kernel.readSession(req));
        }catch(e){error=e;}
        if(dirty&&!await store.save(row.version,kernel.getState()))continue;
        if(error)throw error;
        if(exported){pending.set('Content-Type',exported.format==='recap'?'text/plain; charset=utf-8':'text/csv; charset=utf-8');pending.set('Content-Disposition',`attachment; filename="LOC-${exported.format}.${exported.format==='recap'?'txt':'csv'}"`);return new Response(exported.content,{headers:pending});}
        return new Response(JSON.stringify(result),{headers:pending});
      }
      return json({error:'The workspace is busy. Please retry your change.'},409);
    }catch(error){
      if(!error.status)console.error('LOC request failed:',error.message);
      return json({error:error.status?error.message:'Unable to reach saved data. Please retry.',field:error.field},error.status||503);
    }
  };
}
