export function experienceAction(l,u,action,b,{requireThat:check,clean,id,activity}){
 l.articles ||= [];l.alertPreferences ||= {};
 if(action==='alertpreferences'){
  check(Array.isArray(b.sports)&&b.sports.every(s=>l.sports.includes(s)),'Choose sports included in this league.');
  const prior=l.alertPreferences[u.id]||{};l.alertPreferences[u.id]={...prior,sports:[...new Set(b.sports)],results:!!b.results,content:!!b.content,drafts:!!b.drafts};return {};
 }
 if(action==='readupdates'){
  check(Array.isArray(b.ids)&&b.ids.length<=200,'Choose at most 200 updates.');
  const prefs=l.alertPreferences[u.id] ||= {};prefs.read=[...new Set([...(prefs.read||[]),...b.ids.map(x=>clean(x,200))])].slice(-500);return {};
 }
 if(action==='article'){
  const existing=b.id?l.articles.find(x=>x.id===b.id):null;
  if(b.id)check(existing&&existing.authorId===u.id,'Only the author can edit this article.');
  check(['draft','published'].includes(b.status),'Choose draft or published.');check(clean(b.title,160).length>=3,'Enter a title of at least 3 characters.','title');check(clean(b.body,10000).length>=10,'Write at least 10 characters.','body');
  check(!b.sport||l.sports.includes(b.sport),'Choose an included sport.','sport');
  const source=clean(b.source,1000);if(source){let url;try{url=new URL(source);}catch{}check(url&&['https:','http:'].includes(url.protocol)&&!url.username&&!url.password,'Use an http or https source URL without credentials.','source');}
  check(existing||l.articles.length<200,'This league has reached its 200-article limit. Edit an existing article.');
  const value={id:existing?.id||id(),authorId:u.id,authorName:u.name,title:clean(b.title,160),body:clean(b.body,10000),sport:b.sport||'',source,status:b.status,created:existing?.created||Date.now(),updated:Date.now(),featured:existing?.featured||false};
  if(existing)Object.assign(existing,value);else l.articles.unshift(value);
  if(value.status==='published')activity(l,u.id,'Published league article: '+value.title);return {};
 }
 if(action==='featurearticle'){
  check(l.owner===u.id,'Only the commissioner can feature an article.');const article=l.articles.find(x=>x.id===b.id&&x.status==='published');check(article,'Choose a published article.');article.featured=!!b.featured;return {};
 }
 return null;
}
