/* Public-only reader; requests published cards through Supabase RLS. */
(function(){
'use strict';
const base=window.PP_CONFIG.supabaseUrl;
const key=window.PP_CONFIG.supabasePublishableKey;
const headers={apikey:key,Accept:'application/json'};
async function getPublicCard(slug){
 if(typeof slug!=='string'||slug.length>80||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))return null;
 const u=new URL(base+'/rest/v1/cards');
 u.searchParams.set('select','slug,display_name,job_title,public_email,phones,website,photo_path,published');
 u.searchParams.set('slug','eq.'+slug);u.searchParams.set('published','eq.true');u.searchParams.set('limit','1');
 const r=await fetch(u.toString(),{headers,cache:'no-store'});
 if(!r.ok)throw new Error('Unable to load published card (HTTP '+r.status+')');
 const rows=await r.json();return Array.isArray(rows)?rows[0]||null:null;
}
async function photoUrl(person){
 const p=person?.photo_path;
 if(typeof p!=='string'||!/^[0-9a-f-]{36}\/avatar(-[0-9]{13}-[0-9a-f]{16})?\.jpg$/.test(p))return '';
 const r=await fetch(base+'/storage/v1/object/sign/contact-photos/'+p,{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({expiresIn:3600})});
 if(!r.ok)throw new Error('Photo unavailable');
 const data=await r.json(),signed=data.signedURL||data.signedUrl||'';
 if(!signed)return '';
 if(signed.startsWith('https://'))return signed;
 return base+(signed.startsWith('/storage/v1/')?'':'/storage/v1')+(signed.startsWith('/')?'':'/')+signed;
}
window.PPBackend={getPublicCard,photoUrl};
})();