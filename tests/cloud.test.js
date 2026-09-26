import test from 'node:test';
import assert from 'node:assert/strict';
import {cloudHandler} from '../cloud-handler.js';

function setup(){
  let row={version:0,state:{users:[],sessions:{},leagues:[],invites:[],revision:0}},conflicts=0;
  const store={load:async()=>structuredClone(row),limit:async()=>true,save:async(expected,value)=>{if(conflicts){conflicts--;return false;}if(expected!==row.version)return false;row={version:expected+1,state:structuredClone(value)};return true;}};
  const handler=cloudHandler(store);
  const call=async(path,data,cookie='',extra={})=>{const response=await handler(new Request('https://loc-one.vercel.app'+path,{method:data?'POST':'GET',headers:{origin:'https://loc-one.vercel.app','content-type':'application/json',cookie,...extra},body:data?JSON.stringify(data):undefined}));return {status:response.status,headers:response.headers,data:await response.json()};};
  let user=0;
  const signup=async()=>{const r=await call('/api/auth/signup',{name:'Manager '+(++user),email:`manager${user}@example.test`,password:'valid long password'});assert.equal(r.status,200);return {cookie:r.headers.get('set-cookie').split(';')[0],...r};};
  return {call,signup,store,conflict:()=>conflicts++,row:()=>row};
}

test('Hosted accounts, durable cookies, join codes, permissions, capacity and concurrent membership',async()=>{
  const s=setup(),owner=await s.signup();assert.match(owner.headers.get('set-cookie'),/Secure/);assert.match(owner.headers.get('set-cookie'),/HttpOnly/);
  const create=await s.call('/api/leagues',{name:'Friends championship',capacity:4,season:2026,sports:['NBA'],timer:30},owner.cookie),id=create.data.createdId;
  s.conflict();const generated=await s.call(`/api/leagues/${id}/joincode`,{action:'generate'},owner.cookie);assert.equal(generated.status,200);const code=generated.data.leagues[0].joinAccess.code;
  const guests=await Promise.all(Array.from({length:4},()=>s.signup()));
  const joins=await Promise.all(guests.map(g=>s.call('/api/join',{code},g.cookie)));
  assert.equal(joins.filter(r=>r.status===200).length,3);assert.equal(joins.filter(r=>r.status===422).length,1);
  const joined=joins.findIndex(r=>r.status===200),guest=guests[joined];
  assert.equal(joins[joined].data.leagues[0].joinAccess,undefined);
  assert.equal((await s.call(`/api/leagues/${id}/joincode`,{action:'revoke'},guest.cookie)).status,403);
  assert.equal((await s.call('/api/join',{code},guest.cookie)).status,200,'idempotent even when full');
  assert.equal((await s.call('/api/state')).data.leagues.length,0);
  assert.equal((await s.call(`/api/leagues/${id}/invite`,{emails:'friend@example.test'},owner.cookie)).status,422,'no unverified email membership');
  await s.call(`/api/leagues/${id}/joincode`,{action:'revoke'},owner.cookie);
  assert.equal((await s.call('/api/join',{code},guest.cookie)).status,422);
  const renewed=await s.call(`/api/leagues/${id}/joincode`,{action:'generate'},owner.cookie),newCode=renewed.data.leagues[0].joinAccess.code;
  assert.notEqual(newCode,code);
  const state=s.row().state;assert.notEqual(state.users[0].password,'valid long password');
  assert.ok(!JSON.stringify(generated.data).includes(state.users[0].password));
  state.leagues[0].joinAccess.expires=Date.now()-1;
  assert.equal((await s.call('/api/join',{code:newCode},guest.cookie)).status,422);
  assert.equal((await s.call('/api/auth/logout',{},owner.cookie)).status,200);
  assert.equal((await s.call('/api/state',null,owner.cookie)).data.user,null);
});

test('Hosted requests reject cross-origin writes, oversized bodies, and rate-limited attempts',async()=>{
  const s=setup();assert.equal((await s.call('/api/auth/signup',{},'',{origin:'https://evil.example'})).status,403);
  assert.equal((await s.call('/api/auth/signup',{name:'x'.repeat(33000)})).status,413);
  s.store.limit=async()=>false;assert.equal((await s.call('/api/auth/login',{})).status,429);
});

test('Hosted clock catches up all elapsed turns after every browser disconnects',async()=>{
  const s=setup(),owner=await s.signup();
  const made=await s.call('/api/leagues',{name:'Clock test',capacity:4,season:2026,sports:['NBA'],timer:30},owner.cookie),id=made.data.createdId;
  const code=(await s.call(`/api/leagues/${id}/joincode`,{action:'generate'},owner.cookie)).data.leagues[0].joinAccess.code;
  for(let n=0;n<3;n++){const g=await s.signup();await s.call('/api/join',{code},g.cookie);}
  await s.call(`/api/leagues/${id}/status`,{status:'live'},owner.cookie);
  s.row().state.leagues[0].deadline=Date.now()-130000;
  const result=await s.call('/api/state',null,owner.cookie);
  assert.equal(result.data.leagues[0].status,'complete');assert.equal(result.data.leagues[0].picks.length,4);
});
