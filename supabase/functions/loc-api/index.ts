import {cloudHandler} from '../../../cloud-handler.js';

const key=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}').default || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const root=Deno.env.get('SUPABASE_URL');
if(!key||!root)throw new Error('Database credentials are not configured.');
async function rpc(name:string,body:object={}) {
  const headers:Record<string,string>={apikey:key,'Content-Type':'application/json'};
  if(!key.startsWith('sb_secret_'))headers.Authorization=`Bearer ${key}`;
  const response=await fetch(`${root}/rest/v1/rpc/${name}`,{method:'POST',headers,body:JSON.stringify(body)});
  if(!response.ok)throw new Error(`Storage ${name} failed (${response.status}).`);
  return response.json();
}
// Custom authentication: hashed LOC sessions in Secure HttpOnly cookies, checked by the
// shared kernel for every private action; all database RPCs require the server secret.
Deno.serve(cloudHandler({
  load:()=>rpc('loc_load_state'),
  save:(expected:number,value:unknown)=>rpc('loc_save_state',{expected,value}),
  limit:(bucket:string,ceiling:number)=>rpc('loc_rate_limit',{bucket,ceiling})
}));
