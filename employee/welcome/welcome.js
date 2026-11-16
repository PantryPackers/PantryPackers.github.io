
(()=>{'use strict';
const slug=document.documentElement.dataset.employee;
const cardURL='https://pantrypackers.github.io/'+slug+'/';
const assetRoot='https://pantrypackers.github.io/assets/';
const rawRoot='https://raw.githubusercontent.com/PantryPackers/PantryPackers.github.io/main/assets/';
let person=JSON.parse(document.documentElement.dataset.person);
const root=document.querySelector('#card-host');
const shadow=root.attachShadow({mode:'open'});
shadow.innerHTML=`<style>
:host{display:block;width:100%;--navy:#1e2d49;--orange:#f28b13;--canvas:#f2f1f6;--muted:#888991;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue",Arial,sans-serif;color:#202127;-webkit-font-smoothing:antialiased}
*{box-sizing:border-box}
.card-scene{width:min(100%,430px);margin:0 auto;perspective:1500px;-webkit-perspective:1500px;container-type:inline-size}
.card{width:100%;aspect-ratio:1062/590;cursor:pointer;filter:drop-shadow(0 17px 24px rgba(18,20,29,.19)) drop-shadow(0 3px 5px rgba(18,20,29,.12))}
.card:focus-visible{outline:3px solid #1285ff;outline-offset:6px;border-radius:20px}
.card-inner{position:relative;width:100%;height:100%;transform-style:preserve-3d;-webkit-transform-style:preserve-3d;transition:transform 680ms cubic-bezier(.2,.72,.24,1);border-radius:19px}
.card.flipped .card-inner{transform:rotateY(180deg)}
.face{position:absolute;inset:0;overflow:hidden;border:1px solid rgba(0,0,0,.08);border-radius:19px;background:#fff;backface-visibility:hidden;-webkit-backface-visibility:hidden;transform-style:flat;-webkit-transform-style:flat}
.front{transform:rotateY(0deg)}.back{transform:rotateY(180deg);--safe-inset:12px;--left-start:12.2%;--top-start:23.5%;--contacts-bottom:13.7%;--name-right:37.2%;color:var(--navy)}
.face>img{display:block;width:100%;height:100%;object-fit:fill}
.left-column{position:absolute;left:max(var(--safe-inset),var(--left-start));right:var(--name-right);top:var(--top-start);bottom:var(--contacts-bottom);display:flex;flex-direction:column;justify-content:space-between;gap:clamp(5px,1.65cqw,8px);min-width:0;min-height:0;overflow:visible}
.identity{flex:0 1 auto;min-width:0;max-width:100%}
.name{margin:0;color:var(--navy);font-family:Georgia,"Times New Roman",serif;font-size:5.38cqw;font-weight:700;line-height:1.035;letter-spacing:-.032em;overflow-wrap:break-word;word-break:normal}
.job{margin-top:.05cqw;color:var(--navy);font-size:3.14cqw;font-weight:400;line-height:1.16;letter-spacing:.005em;overflow-wrap:break-word}
.contacts{display:flex;flex-direction:column;align-items:stretch;gap:.52cqw;flex:0 0 auto;min-width:0;max-width:100%;color:var(--navy)}
.contact{display:flex;align-items:flex-start;gap:.65cqw;min-width:0;max-width:100%;font-size:2.63cqw;font-weight:400;line-height:1.10;letter-spacing:.005em}
.contact img{display:block;width:3.03cqw;height:auto;object-fit:contain;flex:0 0 auto;margin-top:.12em}
.contact a{min-width:0;max-width:100%;color:inherit;text-decoration:none;overflow-wrap:anywhere}
.contact-copy{min-width:0;max-width:100%;display:flex;flex-wrap:wrap;align-items:center;gap:.34em .55em;line-height:1.08}
.contact-badge{display:inline-flex;align-items:center;justify-content:center;min-height:1.55em;padding:.1em .52em;border:.08em solid rgba(242,139,19,.9);border-radius:999px;color:#d97800;background:rgba(255,255,255,.72);font-size:.56em;font-weight:600;line-height:1;letter-spacing:.015em;white-space:nowrap;vertical-align:middle}
.qrblock{position:absolute;left:64.9%;right:var(--safe-inset);bottom:11.55%;display:flex;align-items:center;gap:1cqw;min-width:0;padding-bottom:1.1cqw;color:var(--navy)}
.qrblock>a{display:block;width:6.3cqw;flex:0 0 6.3cqw;min-width:0;line-height:0}.qrblock img{display:block;width:100%;aspect-ratio:1;object-fit:contain}
.blessing{position:relative;flex:1;min-width:0;color:var(--navy);font-family:Georgia,"Times New Roman",serif;font-style:italic;align-self:flex-end;line-height:1;letter-spacing:-.03em;white-space:nowrap;display:flex;flex-direction:column;align-items:flex-start}
.blessing-top{font-size:1.82cqw;font-weight:600;letter-spacing:-.018em}.blessing-bottom{margin-top:-.06cqw;font-size:2.78cqw;font-weight:700;letter-spacing:-.036em}
.goldline{position:absolute;left:0;right:0;bottom:0;height:1px;background:#e99a24}
.flip-button{display:flex;flex-direction:column;align-items:center;gap:7px;margin:16px auto 0;padding:0;border:0;color:var(--muted);background:transparent;font:inherit;cursor:pointer}
.flip-icon{display:grid;width:64px;height:64px;place-items:center;border:2px solid #1285ff;border-radius:50%;color:#1285ff;transition:transform 250ms ease,background 250ms ease}
.flip-icon svg{width:39px;height:39px;stroke:currentColor;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;fill:none}
.flip-button:hover .flip-icon{background:rgba(18,133,255,.08);transform:rotate(-12deg)}
#flipLabel{font-size:19px;font-weight:400;letter-spacing:-.035em}
@media(max-width:480px){.flip-button{margin-top:12px}.flip-icon{width:50px;height:50px}.flip-icon svg{width:30px;height:30px}#flipLabel{font-size:16px}}
@media(prefers-reduced-motion:reduce){.card-inner{transition:none}.flip-icon{transition:none}}
</style>
<div class="card-scene"><div class="card" role="button" tabindex="0" aria-label="Flip business card" aria-pressed="false"><div class="card-inner">
<div class="face front" aria-label="Front of card"><img id="art-front" alt="Original Pantry Packers business card front"></div>
<div class="face back" aria-label="Contact details"><img class="background" id="art-back" alt=""><div class="left-column" id="left-column"><div class="identity" id="identity"><div class="name" id="name"></div><div class="job" id="job"></div></div><div class="contacts" id="contacts"></div></div><div class="qrblock" id="qrblock"><a id="qr-link" target="_blank" rel="noopener noreferrer" aria-label="Visit website"><img id="qr" alt="Website QR code"></a><div class="blessing"><span class="blessing-top">Those that Bless you</span><span class="blessing-bottom">will be blessed</span></div><div class="goldline"></div></div></div>
</div></div></div>
<button class="flip-button" id="flip" type="button" aria-pressed="false"><span class="flip-icon" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><path d="M47.5 20.5A21 21 0 0 0 12 28"/><path d="M11 17v11h11M16.5 43.5A21 21 0 0 0 52 36"/><path d="M53 47V36H42"/></svg></span><span id="flipLabel">View Contact Details</span></button>`;
const $=s=>shadow.querySelector(s);
const card=$('.card');
let isFlipped=false;
function setFlipped(on){isFlipped=!!on;card.classList.toggle('flipped',isFlipped);card.setAttribute('aria-pressed',String(isFlipped));$('#flip').setAttribute('aria-pressed',String(isFlipped));$('#flipLabel').textContent=isFlipped?'Show Card Front':'View Contact Details'}
$('#flip').addEventListener('click',()=>setFlipped(!isFlipped));
card.addEventListener('click',e=>{if(!e.target.closest('a'))setFlipped(!isFlipped)});
card.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.target.closest('a')){e.preventDefault();setFlipped(!isFlipped)}});
function setSource(img,filename){img.src=assetRoot+filename;img.addEventListener('error',function once(){img.removeEventListener('error',once);img.src=rawRoot+filename},{once:true})}
setSource($('#art-front'),'card-front.png');setSource($('#art-back'),'card-back.png');setSource($('#qr'),'qr-'+slug+'.png');
$('#qr-link').href=person.website;
$('#name').textContent=person.name;$('#job').textContent=person.job;
const contacts=$('#contacts');
function contact(label,href){const row=document.createElement('div');row.className='contact';const icon=document.createElement('img');icon.alt='';setSource(icon,'contact-icon.png');const a=document.createElement('a');a.href=href;a.textContent=label;const span=document.createElement('span');span.className='contact-copy';span.append(a);row.append(icon,span);contacts.append(row)}
contact(person.email,'mailto:'+person.email);
for(const phone of person.phones){const digits=phone.number.replace(/\D/g,'');const normalized=digits.startsWith('0')?'+972'+digits.slice(1):'+'+digits;contact(phone.number,'tel:'+normalized)}
function fitBackContent(){
 const face=$('.back'),column=$('#left-column'),identity=$('#identity'),contactBlock=$('#contacts'),qr=$('#qrblock'),name=$('#name'),job=$('#job'),blessing=$('.blessing');
 const scalable=[name,job,...contactBlock.querySelectorAll('.contact'),blessing];
 scalable.forEach(e=>e.style.fontSize='');const bases=scalable.map(e=>parseFloat(getComputedStyle(e).fontSize));if(bases.some(n=>!Number.isFinite(n)))return;
 const rect=e=>e.getBoundingClientRect();const within=(a,b,x=.6)=>a.left>=b.left-x&&a.right<=b.right+x&&a.top>=b.top-x&&a.bottom<=b.bottom+x;
 const fits=()=>{const f=rect(face),c=rect(column),i=rect(identity),ct=rect(contactBlock),q=rect(qr),gap=Math.min(8,f.width*.012);if(!within(i,c)||!within(ct,c)||i.bottom+gap>ct.top||!within(c,f)||!within(q,f))return false;if(name.scrollWidth>name.clientWidth+1||job.scrollWidth>job.clientWidth+1||blessing.scrollWidth>blessing.clientWidth+1)return false;for(const row of contactBlock.querySelectorAll('.contact')){if(!within(rect(row),c))return false;for(const a of row.querySelectorAll('a'))if(a.scrollWidth>a.clientWidth+1)return false}return true};
 for(let step=100;step>=50;step-=2){const scale=step/100;scalable.forEach((e,i)=>e.style.fontSize=(bases[i]*scale).toFixed(2)+'px');if(fits()){face.dataset.fit=String(step);return}}
 face.dataset.fit='overflow';
}
requestAnimationFrame(fitBackContent);window.addEventListener('resize',()=>requestAnimationFrame(fitBackContent));if(document.fonts)document.fonts.ready.then(()=>requestAnimationFrame(fitBackContent));
for(const img of [$('#art-front'),$('#art-back')])img.addEventListener('load',()=>requestAnimationFrame(fitBackContent));
// Only one accordion item may remain open; the first is expanded initially.
const items=[...document.querySelectorAll('.faq-item')];
items.forEach((item,index)=>{item.open=index===0});
items.forEach(item=>item.addEventListener('toggle',()=>{if(item.open)items.forEach(other=>{if(other!==item)other.open=false})}));
const copy=document.querySelector('#copy-link'),copyStatus=document.querySelector('#copy-status');
copy.addEventListener('click',async()=>{let success=false;try{if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');await navigator.clipboard.writeText(cardURL);success=true}catch(e){const field=document.createElement('textarea');field.value=cardURL;field.style.cssText='position:fixed;left:-9999px;top:0';document.body.append(field);field.focus();field.select();try{success=!!document.execCommand('copy')}catch(_){}field.remove()}copyStatus.textContent=success?'Link copied!':'Copy unavailable — open your card to share the link';copyStatus.style.color=success?'#15814c':'#9b504f';});

// If an employee's published record changes, refresh the Welcome card details
// without requiring a new URL. Only RLS-visible published records are read.
if(window.PPBackend&&typeof window.PPBackend.getPublicCard==='function'){
 window.PPBackend.getPublicCard(slug).then(record=>{
  if(!record){
    document.querySelector('#card-host').replaceChildren();
    document.querySelector('.employee').textContent='Card unavailable';
    document.querySelector('.role').textContent='This employee card is not currently published.';
    return;
  }
  person={name:record.display_name,job:record.job_title||'',email:record.public_email||'',phones:record.phones||[],website:record.website||'https://pantrypackers.org/'};
  document.querySelector('.employee').textContent=person.name;
  document.querySelector('.role').textContent=person.job;
  document.title=person.name+' | Your card is ready · Pantry Packers';
  $('#name').textContent=person.name;$('#job').textContent=person.job;
  $('#qr-link').href=person.website;
  contacts.replaceChildren();
  if(person.email)contact(person.email,'mailto:'+person.email);
  for(const phone of person.phones){
   if(!phone||typeof phone.number!=='string')continue;
   const digits=phone.number.replace(/\D/g,'');
   const normalized=digits.startsWith('0')?'+972'+digits.slice(1):digits.length===10&&!digits.startsWith('972')?'+1'+digits:'+'+digits;
   contact(phone.number,phone.type==='whatsapp'?'https://wa.me/'+normalized.replace(/\D/g,''):'tel:'+normalized);
  }
  requestAnimationFrame(fitBackContent);
 }).catch(error=>console.warn('Using cached public contact details for Welcome page',error));
}
})();
