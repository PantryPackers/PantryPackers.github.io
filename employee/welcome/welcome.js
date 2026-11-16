(()=>{'use strict';
const $=s=>document.querySelector(s),slug=document.documentElement.dataset.employee,base='https://pantrypackers.github.io/',link=base+encodeURIComponent(slug)+'/';
const btn=$('#copy-link'),qrBtn=$('#download-qr'),cardHost=$('#card-preview'),faq=[...document.querySelectorAll('.faq details')];let user=null,card=null,shadow=null;
$('#card-url').textContent=link.replace('https://','');$('#open-card').href=link;
function downloadQr(){
 const status=$('#qr-status');
 const original='../../../assets/qr-'+slug+'.png';
 const a=document.createElement('a');
 a.href=original;a.download='pantry-packers-'+slug+'-original-qr.png';
 document.body.append(a);a.click();a.remove();
 status.textContent='Download original QR image';
}
qrBtn.addEventListener('click',downloadQr);
$('#download-qr-help').addEventListener('click',downloadQr);
btn.addEventListener('click',async()=>{let ok=false;try{await navigator.clipboard.writeText(link);ok=true}catch(_){const ta=document.createElement('textarea');ta.value=link;ta.style.position='fixed';ta.style.left='-9999px';document.body.append(ta);ta.select();try{ok=!!document.execCommand('copy')}catch(_){}ta.remove()}btn.querySelector('.tile-detail').textContent=ok?'Link copied!':'Copy unavailable — use Open Digital Card'});
function mountExactCard(){
  shadow=cardHost.attachShadow({mode:'open'});
  // The canonical card stylesheet is reused without copying or redesigning the artwork.
  shadow.innerHTML=`
    <link rel="stylesheet" href="../../../styles.css">
    <style>:host{display:block;width:100%;--navy:#1e2d49;--orange:#f28b13;--canvas:#f2f1f6;--muted:#888991}
      .card-scene{width:min(100%,430px);margin-inline:auto}
      .flip-button{margin-left:auto;margin-right:auto}
      .face{isolation:isolate}
      @media(prefers-reduced-motion:reduce){.card-inner{transition:none}}
    </style>
    <div class="card-scene"><div class="card" id="card" role="button" tabindex="0" aria-label="Flip business card" aria-pressed="false">
      <div class="card-inner" id="card-inner">
        <div class="face front" aria-label="Front of card"><img src="../../../assets/card-front.png" alt="Pantry Packers logo"></div>
        <div class="face back" aria-label="Contact details"><img class="background" src="../../../assets/card-back.png" alt="">
          <div class="left-column" id="left-column"><div class="identity" id="identity"><div class="name" id="name"></div><div class="job" id="job"></div></div><div class="contacts" id="contacts"></div></div>
          <div class="qrblock" id="qrblock"><a id="qr-link" target="_blank" rel="noopener noreferrer" aria-label="Visit website"><img id="qr" alt="Website QR code"></a>
            <div class="blessing"><span class="blessing-top">Those that Bless you</span><span class="blessing-bottom">will be blessed</span></div><div class="goldline"></div>
          </div>
        </div>
      </div></div></div>
    <button class="flip-button" id="flip" type="button" aria-pressed="false">
      <span class="flip-icon" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><path d="M47.5 20.5A21 21 0 0 0 12 28"></path><path d="M11 17v11h11M16.5 43.5A21 21 0 0 0 52 36"></path><path d="M53 47V36H42"></path></svg></span><span id="flipLabel">View Contact Details</span>
    </button>`;
  const q=s=>shadow.querySelector(s);
  card=q('#card');
  const setFlipped=flipped=>{card.classList.toggle('flipped',flipped);card.setAttribute('aria-pressed',String(flipped));q('#flip').setAttribute('aria-pressed',String(flipped));q('#flipLabel').textContent=flipped?'Show Card Front':'View Contact Details'};
  q('#flip').addEventListener('click',()=>setFlipped(!card.classList.contains('flipped')));
  card.addEventListener('click',e=>{if(!e.target.closest('a'))setFlipped(!card.classList.contains('flipped'))});
  card.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.target.closest('a')){e.preventDefault();setFlipped(!card.classList.contains('flipped'))}});
  shadow.querySelector('link').addEventListener('load',()=>requestAnimationFrame(fitBackContent));
  window.addEventListener('resize',()=>requestAnimationFrame(fitBackContent));
  if(document.fonts)document.fonts.ready.then(()=>requestAnimationFrame(fitBackContent));
}
function fitBackContent(){
  if(!shadow)return;
  const q=s=>shadow.querySelector(s),face=q('.back'),column=q('#left-column'),identity=q('#identity'),contacts=q('#contacts'),qr=q('#qrblock'),name=q('#name'),job=q('#job'),blessing=q('.blessing');
  const scalable=[name,job,...contacts.querySelectorAll('.contact'),blessing];
  scalable.forEach(el=>{el.style.fontSize=''});
  const bases=scalable.map(el=>parseFloat(getComputedStyle(el).fontSize));
  if(bases.some(n=>!Number.isFinite(n)))return;
  const rect=el=>el.getBoundingClientRect();
  const within=(inner,outer,slack=.6)=>inner.left>=outer.left-slack&&inner.right<=outer.right+slack&&inner.top>=outer.top-slack&&inner.bottom<=outer.bottom+slack;
  const fits=()=>{
    const f=rect(face),c=rect(column),i=rect(identity),ct=rect(contacts),qbox=rect(qr),gap=Math.min(8,f.width*.012);
    if(!within(i,c)||!within(ct,c)||i.bottom+gap>ct.top||!within(c,f)||!within(qbox,f))return false;
    if(name.scrollWidth>name.clientWidth+1||job.scrollWidth>job.clientWidth+1||blessing.scrollWidth>blessing.clientWidth+1)return false;
    for(const row of contacts.querySelectorAll('.contact')){if(!within(rect(row),c))return false;for(const a of row.querySelectorAll('a'))if(a.scrollWidth>a.clientWidth+1)return false}
    return true;
  };
  for(let step=100;step>=50;step-=2){const scale=step/100;scalable.forEach((el,i)=>{el.style.fontSize=(bases[i]*scale).toFixed(2)+'px'});if(fits()){face.dataset.fit=String(step);return}}
  face.dataset.fit='overflow';console.warn('Welcome card content may need shorter text',slug);
}
faq.forEach(d=>d.addEventListener('toggle',()=>{if(d.open)faq.forEach(other=>{if(other!==d)other.open=false})}));
function dial(phone){const digits=(phone||'').replace(/\D/g,'');return digits.startsWith('0')?'+972'+digits.slice(1):digits.length===10&&!digits.startsWith('972')?'+1'+digits:'+'+digits}
function render(person){
  user=person;$('#person-name').textContent=person.display_name;$('#person-role').textContent=person.job_title||'';
  document.title=person.display_name+' | Your card is ready';
  mountExactCard();
  const q=s=>shadow.querySelector(s);
  q('#name').textContent=person.display_name;q('#job').textContent=person.job_title||'';
  const contacts=q('#contacts');contacts.replaceChildren();
  const add=(value,href,badge)=>{
    const row=document.createElement('div');row.className='contact';
    const icon=document.createElement('img');icon.src='../../../assets/contact-icon.png';icon.alt='';
    const wrap=document.createElement('span');wrap.className='contact-copy';
    const anchor=document.createElement('a');anchor.textContent=value;anchor.href=href;
    if(href.startsWith('https://')){anchor.target='_blank';anchor.rel='noopener noreferrer'}
    wrap.append(anchor);
    if(badge){const item=document.createElement('span');item.className='contact-badge';item.textContent=badge;wrap.append(item)}
    row.append(icon,wrap);contacts.append(row);
  };
  if(person.public_email)add(person.public_email,'mailto:'+person.public_email);
  (Array.isArray(person.phones)?person.phones:[]).forEach(phone=>{if(!phone||typeof phone.number!=='string')return;const p=dial(phone.number);add(phone.number,phone.type==='whatsapp'?'https://wa.me/'+p.replace(/\D/g,''):'tel:'+p,phone.label)});
  const website=person.website||'https://pantrypackers.org/';
  const original=slug==='aviva-wallick'?'https://give.pantrypackers.org/':'https://pantrypackers.org/';
  q('#qr').src=website===original?'../../../assets/qr-'+slug+'.png':'https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=0&data='+encodeURIComponent(website);
  q('#qr').alt='Website QR code for '+person.display_name;q('#qr-link').href=website;
  requestAnimationFrame(fitBackContent);
}
async function start(){try{const record=await window.PPBackend.getPublicCard(slug);if(!record){document.querySelector('main').innerHTML='<p class="unavailable">This employee card is not available.</p>';return}render(record)}catch(e){console.error(e);$('#person-name').textContent='Pantry Packers';$('#person-role').textContent='Card information could not be loaded';}}
start();
})();