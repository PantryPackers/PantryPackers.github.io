(()=>{'use strict';
const $=s=>document.querySelector(s),slug=document.documentElement.dataset.employee,base='https://pantrypackers.github.io/',link=base+encodeURIComponent(slug)+'/';
const btn=$('#copy-link'),qrBtn=$('#download-qr'),cardHost=$('#card-preview'),faq=[...document.querySelectorAll('.faq details')];let user=null,card=null,shadow=null;
$('#card-url').textContent=link.replace('https://','');$('#open-card').href=link;
const qrData={
'avi-maurer':'0000000000000000000000000000000000000000001fd916e7f0082924120805d179097402ea8092ba0174894f5d008275e320807f55555fc0003e74a00016e57db4b00d8b47b3780392617bec00d2871a500174d71d980005124951002ddc3d5d002500415d801e4bc4ddc0088470bad80054ad64d80096bb8a240165e9260d00b91dcfa0801978ac98c0113c4a5420135cda5f10000a9b58c007f7e7ed48020bd5c63e0174cfe7f600bab49317805d58c45b00208e92be201fdd5ea14000000000000000000000000000000000000000000',
'aviva-wallick':'0000000000000000000000000000000000000000001fce9e67f00823f48a0805d727bd7402eb0a22ba01754ac25d0082b1cc20807f55555fc00036c9e00017c9e947c0021483b378039f49165800764859bc006ec249980030a38d27807f5f2a30802a16a73b8014e64b6b100ecdef9768055dce54d800c47fa57e01fc9f1fbb00f42d6530805947d643802f4c4185a01777b87fb0000a49c8a807f2f96d50020b7c5e3e01755069fb00baf78fce805d7a08580020872f9b801fd9ca722000000000000000000000000000000000000000000',
'daniel-sherman':'0000000000000000000000000000000000000000001fdecd87f00829e30a0805d6302d7402e98eb2ba0175cb005d0082319320807f55555fc0000768800013f159297003d7ff50e003d4685e7c016436cd4801af7aa7610079aa3902001fdeaf5f00174e22f5a00ffc606f800e5f97e6a801bf8b8fb400f42a4c3800965f6e2900e4e4431c00515e3e92c02a575646e01df8413f80000c9c48b007f52ecd58020bebfe3c017549aff200baf2e2d4805d10a9edc020880e97e01fdfba3b0000000000000000000000000000000000000000000',
'leah-groner':'0000000000000000000000000000000000000000001fd57de7f00827856a0805d1e0917402ea49b4ba017554f95d0082d6d020807f55555fc00034f1200011730aef900c52723470015ece38280173abd68001d6ac71780051b093d6005f425bb08031221f9a0011de68c520029f7e5070077a694ba80323e42bc600ec892658008d9a795300075fa7c4800266f960001e50dbdf00000bb808b007f60e75600209c7d2260175c251f800ba6e93b9005d18799e00209f9779001fdc29f81000000000000000000000000000000000000000000',
'mark-roth':'000000000000000000000000000000000000001fcbf67f0082f7b20805d38c97402e9e88ba017542f5d0082695a0807f5555fc00019180001547881200f598ea4801956055c0223dd184005fc98eb00b5c68a4802b5c102c03e457634002eeb9cb003988ea6804db101cc01869395401472fbf00000b058b807f363d6c02093b236017527df000ba2889b805d6b24e402092574401fd9bbdb00000000000000000000000000000000000000',
'meital-fishhaut':'0000000000000000000000000000000000000000001fcb4587f0082ee48a0805d6e7bd7402eae412ba01745ac65d008240c8a0807f55555fc0002888a000105be96ce000893b10e0009089375800e58c497c01756ff36000d5728b278053e82a7b800c6bc4b5a013ffcb6b10065a3f966800b078adb4030473a4be011f9313bb00b9c4eb18004b15d60380201e80e180197a633f30000cf9c8a807f3f95d50020942663c01743869fb00ba2a89df805d3365efc02085eecf801fdeca7a2000000000000000000000000000000000000000000',
'michul-halperin':'0000000000000000000000000000000000000000001fc59ee7f00826f48a0805d5e7ad7402ebca28ba01750ac25d008281cc20807f55555fc0003cc9800017c9e947c0030303b36806d389275800a408593c01b65245bb00c1138d318053602a7b800a77273b8013ddcb4b100fde6f976803bdce55d80055f7b47e00860f12bb00d59d6522805b1dd642802c4ac1818014ceb87f000008e988a807f1c95d50020b4c5e3e0175e469fb00bae98dc9805d640859002095af83801fdcca7aa000000000000000000000000000000000000000000',
'shlomo-lebowitz':'0000000000000000000000000000000000000000001fc9efa7f0082933d20805d1fbcd7402e83becba0175ddda5d008205bda0807f55555fc0001dd5a00015479881200f52c4ef18055695469c039079962201475558c9004437fef6804f59ed29c033763b2a4014e3baac00030fa88b08001ad2361c006096736201d6440fca00253314e3805f64115dc0152fdd924013d2c99f10000d6e98d807f2f52d540209a59a2201757775fa00ba45fc0a805d5dcf46402090b3e2401fd2bbbd3000000000000000000000000000000000000000000'
};
function qrCanvas(){const hex=qrData[slug];if(!hex)throw Error('QR unavailable');const size=slug==='mark-roth'?37:41;const bits=BigInt('0x'+hex).toString(2).padStart(size*size,'0');if(bits.length!==size*size)throw Error('Unexpected QR length');const scale=12,canvas=document.createElement('canvas');canvas.width=canvas.height=size*scale;const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#000';for(let i=0;i<bits.length;i++)if(bits[i]==='1')ctx.fillRect((i%size)*scale,Math.floor(i/size)*scale,scale,scale);return canvas;}
function downloadQr(){const status=$('#qr-status');try{const canvas=qrCanvas();const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='pantry-packers-'+slug+'-card-qr.png';document.body.append(a);a.click();a.remove();status.textContent='QR download started'}catch(err){status.textContent='QR unavailable';console.error(err)}}
qrBtn.addEventListener('click',downloadQr);$('#download-qr-help').addEventListener('click',downloadQr);
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
  (Array.isArray(person.phones)?person.phones:[]).forEach(phone=>{if(!phone||typeof phone.number!=='string')return;const p=dial(phone.number);add(phone.number,phone.type==='whatsapp'?'https://wa.me/'+p.replace(/\\D/g,''):'tel:'+p,phone.label)});
  const website=person.website||'https://pantrypackers.org/';
  const original=slug==='aviva-wallick'?'https://give.pantrypackers.org/':'https://pantrypackers.org/';
  q('#qr').src=website===original?'../../../assets/qr-'+slug+'.png':'https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=0&data='+encodeURIComponent(website);
  q('#qr').alt='Website QR code for '+person.display_name;q('#qr-link').href=website;
  requestAnimationFrame(fitBackContent);
}
async function start(){try{const record=await window.PPBackend.getPublicCard(slug);if(!record){document.querySelector('main').innerHTML='<p class="unavailable">This employee card is not available.</p>';return}render(record)}catch(e){console.error(e);$('#person-name').textContent='Pantry Packers';$('#person-role').textContent='Card information could not be loaded';}}
start();
})();