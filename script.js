let people = [];

const $ = (selector) => document.querySelector(selector);
const card = $('#card');
const params = new URLSearchParams(window.location.search);
const previewMode = false;
let current = null;
let vcardUrl = null;
const knownQR = new Set(['meital-fishhaut','shlomo-lebowitz','avi-maurer','mark-roth','leah-groner','aviva-wallick','daniel-sherman','michul-halperin']);
function fromRecord(row) {
  return {id:row.slug, name:row.display_name, title:row.job_title,
    email:row.public_email, phones:row.phones||[], qrUrl:row.website||'https://pantrypackers.org/',
    photo_path:row.photo_path||null, photo_url:row.photo_preview||''};
}
function showUnavailable(message) {
  document.title = 'Card unavailable | Pantry Packers';
  $('.wallet-content').innerHTML = '<div class="unavailable"><h2>Card unavailable</h2><p></p></div>';
  $('.unavailable p').textContent = message;
}
function dial(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) return '+972' + digits.slice(1);
  if (digits.length === 10 && !digits.startsWith('972')) return '+1' + digits;
  return '+' + digits;
}
// Use the person's first and last name (not titles or parenthetical nicknames).
function initialsFor(name) {
  const parts = name.replace(/\([^)]*\)/g, '').trim().split(/\s+/)
    .filter(part => part && !/^(rabbi|rab\.?|dr\.?|mr\.?|mrs\.?|ms\.?)$/i.test(part));
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (parts[0] || 'PP').slice(0, 2).toUpperCase();
}
// Skip honorifics and nicknames when choosing the first name for the button.
// Examples: Rabbi Mark Roth -> Mark; Avraham (Avi) Maurer -> Avraham.
function firstNameFor(name) {
  const parts = name.replace(/\([^)]*\)/g, '').trim().split(/\s+/)
    .filter(part => part && !/^(rabbi|rab\.?|dr\.?|mr\.?|mrs\.?|ms\.?)$/i.test(part));
  return parts[0] || name;
}
// The Save Contact avatar follows the editable contact photo. This helper is
// intentionally isolated from the V10 card artwork, flip animation and vCard.
// Both a staged preview image and a previously saved photo are supported.
let saveAvatarRequest = 0;
function syncSaveContactAvatar(person) {
  const avatar = $('#save-initials');
  const request = ++saveAvatarRequest;
  const isActive = () => request === saveAvatarRequest && current === person;
  const showInitials = () => {
    if (isActive()) avatar.textContent = initialsFor(person.name);
  };
  // Immediate fallback for first load, image removal, employee switch or error.
  showInitials();
  const showImage = (url) => {
    if (!isActive() || !url) return;
    const image = document.createElement('img');
    image.className = 'contact-avatar-image';
    image.alt = '';
    image.decoding = 'async';
    image.onload = () => { if (isActive()) avatar.replaceChildren(image); };
    image.onerror = showInitials;
    image.src = url;
  };
  if (person.photo_url) {
    showImage(person.photo_url);
  } else if (person.photo_path && window.PPBackend) {
    Promise.resolve(window.PPBackend.photoUrl(person)).then(url => {
      if (!isActive()) return;
      person.photo_url = url || '';
      showImage(person.photo_url);
    }).catch(showInitials);
  }
}

// Measure the unclipped label, even when the previous card was narrower.
// A temporary, visually hidden copy keeps this accurate with the active font.
function measureSaveLabel(label) {
  const ruler = label.cloneNode(true);
  const style = getComputedStyle(label);
  ruler.style.cssText = 'position:fixed;left:-10000px;top:-10000px;display:inline-block;visibility:hidden;pointer-events:none;white-space:nowrap;max-width:none;width:max-content;overflow:visible;text-overflow:clip;margin:0;padding:0;border:0';
  ruler.style.font = style.font;
  ruler.style.letterSpacing = style.letterSpacing;
  document.body.append(ruler);
  const width = Math.ceil(ruler.getBoundingClientRect().width);
  ruler.remove();
  return width;
}
function updateActionPanelWidth() {
  const dock = $('#action-panel');
  const label = $('#save-text');
  const save = $('#save');
  const avatar = $('#save-initials');
  const actions = [...document.querySelectorAll('#quick-actions a')].filter(a => !a.hidden);
  const actionStyles = getComputedStyle($('#quick-actions'));
  const itemWidth = actions.length ? actions[0].getBoundingClientRect().width : 46;
  const minActionGap = parseFloat(actionStyles.columnGap) || 10;
  const iconRowWidth = actions.length * itemWidth + Math.max(0, actions.length - 1) * minActionGap;
  // Keep at least a small, intentional space between avatar and label,
  // with the existing 10px right inset on the text unchanged.
  const saveStyles = getComputedStyle(save);
  const labelStyles = getComputedStyle(label);
  const insetWidth = parseFloat(saveStyles.paddingLeft) + parseFloat(saveStyles.paddingRight)
    + parseFloat(saveStyles.borderLeftWidth) + parseFloat(saveStyles.borderRightWidth)
    + parseFloat(labelStyles.paddingRight) + avatar.getBoundingClientRect().width + 12;
  const available = Math.floor($('.card-scene').getBoundingClientRect().width);
  if (!available) return;
  // Normal text size is preferred. On exceptionally narrow screens, only
  // reduce the label font if needed, never the icon tap targets.
  label.style.fontSize = '';
  let textWidth = measureSaveLabel(label);
  const normalSize = parseFloat(getComputedStyle(label).fontSize);
  for (let size = normalSize; textWidth + insetWidth > available && size > 11; ) {
    size = Math.max(11, size - .5);
    label.style.fontSize = `${size}px`;
    textWidth = measureSaveLabel(label);
  }
  const desiredWidth = Math.ceil(Math.max(iconRowWidth, textWidth + insetWidth));
  dock.style.setProperty('--dock-width', `${Math.min(available, desiredWidth)}px`);
}

function render(id, preserveFlip = false) {
  current = people.find(person => person.id === id) || people[0];
  if (!current) return;
  document.title = `${current.name} | Pantry Packers`;
  syncSaveContactAvatar(current);
  $('#save-text').textContent = `Save ${firstNameFor(current.name)} Contact`;
  $('#save').setAttribute('aria-label', `Save ${current.name} as a contact`);
  $('#name').textContent = current.name;
  $('#job').textContent = current.title;
  // Use the approved QR PNGs where the destination has not changed.
  // New/changed destinations use an external QR service in this prototype.
  const original = current.id === 'aviva-wallick' ? 'https://give.pantrypackers.org/' : 'https://pantrypackers.org/';
  $('#qr').src = knownQR.has(current.id) && current.qrUrl === original
    ? `../assets/qr-${current.id}.png`
    : `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=0&data=${encodeURIComponent(current.qrUrl)}`;
  $('#qr').alt = `Website QR code for ${current.name}`;
  $('#qr-link').href = current.qrUrl;
  $('#qr-link').setAttribute('aria-label', `Open ${current.qrUrl}`);
  const contacts = $('#contacts');
  contacts.replaceChildren();
  const emailRow = document.createElement('div');
  emailRow.className = 'contact';
  const emailIcon = document.createElement('img');
  emailIcon.src = '../assets/contact-icon.png'; emailIcon.alt = '';
  const emailLink = document.createElement('a');
  emailLink.href = `mailto:${current.email}`;
  if (previewMode) emailLink.target = '_top';
  emailLink.textContent = current.email;
  emailRow.append(emailIcon,emailLink); contacts.append(emailRow);
  current.phones.forEach((phone) => {
    const row = document.createElement('div'); row.className = 'contact';
    const icon = document.createElement('img'); icon.src='../assets/contact-icon.png'; icon.alt='';
    const details = document.createElement('span'); details.className = 'contact-copy';
    const link = document.createElement('a'); link.textContent=phone.number;
    if (phone.type === 'whatsapp') {
      link.href = `https://wa.me/${dial(phone.number).replace(/\D/g,'')}`;
      link.target='_blank'; link.rel='noopener noreferrer';
    } else {link.href=`tel:${dial(phone.number)}`;}
    details.append(link);
    if (phone.label) {
      const badge = document.createElement('span');
      badge.className = 'contact-badge';
      badge.textContent = phone.label;
      details.append(badge);
    }
    row.append(icon,details);contacts.append(row);
  });
  $('#email-action').href=`mailto:${current.email}`;
  if (previewMode) $('#email-action').target='_top';
  const callable = current.phones.find(p=>p.type !== 'whatsapp');
  $('#call-action').hidden = !callable;
  $('#sms-action').hidden = !callable;
  if(callable) {$('#call-action').href=`tel:${dial(callable.number)}`;$('#sms-action').href=`sms:${dial(callable.number)}`;}
  const wa = current.phones.find(p=>p.type === 'whatsapp');
  $('#whatsapp-action').hidden = !wa;
  if(wa) $('#whatsapp-action').href=`https://wa.me/${dial(wa.number).replace(/\D/g,'')}`;
  $('#site-action').href=current.qrUrl;
  // The save button and icon row always share a width.  A long first name
  // expands the pill; the extra room becomes *space between* the round icons.
  // Crucially, measure the entire label instead of its clipped bounding box.
  updateActionPanelWidth();
  if(vcardUrl) URL.revokeObjectURL(vcardUrl);
  vcardUrl=URL.createObjectURL(new Blob([makeVCard(current)],{type:'text/vcard;charset=utf-8'}));
  $('#save').href=vcardUrl;
  $('#save').download=`${current.id}.vcf`;
  if (!preserveFlip) setFlipped(false);
  requestAnimationFrame(fitBackContent);
}
// Preserve the reference layout while keeping every text box inside its zone.
// The contact section is fixed to the bottom; any extra rows grow *upward*.
// Typography shrinks only if actual rendered content would overflow / collide.
function fitBackContent() {
  const face = $('.back');
  const column = $('#left-column');
  const identity = $('#identity');
  const contacts = $('#contacts');
  const qr = $('#qrblock');
  const name = $('#name');
  const job = $('#job');
  const blessing = $('.blessing');
  const scalable = [name, job, ...contacts.querySelectorAll('.contact'), blessing];
  scalable.forEach(el => { el.style.fontSize = ''; });
  const bases = scalable.map(el => parseFloat(getComputedStyle(el).fontSize));
  const rect = el => el.getBoundingClientRect();
  const within = (inner, outer, slack = .6) => inner.left >= outer.left - slack &&
    inner.right <= outer.right + slack && inner.top >= outer.top - slack &&
    inner.bottom <= outer.bottom + slack;
  const fits = () => {
    const f = rect(face), c = rect(column), i = rect(identity), ct = rect(contacts), q = rect(qr);
    const requiredGap = Math.min(8, f.width * .012);
    if (!within(i,c) || !within(ct,c) || i.bottom + requiredGap > ct.top) return false;
    if (!within(c,f) || !within(q,f)) return false;
    // Text never crosses into the graphic/QR area or past the safety margins.
    if (name.scrollWidth > name.clientWidth + 1 || job.scrollWidth > job.clientWidth + 1) return false;
    if (blessing.scrollWidth > blessing.clientWidth + 1) return false;
    for (const row of contacts.querySelectorAll('.contact')) {
      if (!within(rect(row), c)) return false;
      for (const anchor of row.querySelectorAll('a')) {
        if (anchor.scrollWidth > anchor.clientWidth + 1) return false;
      }
    }
    return true;
  };
  // Step down in small increments only if the original type cannot fit.
  for (let step = 100; step >= 50; step -= 2) {
    const scale = step / 100;
    scalable.forEach((el, i) => { el.style.fontSize = `${(bases[i] * scale).toFixed(2)}px`; });
    if (fits()) { face.dataset.fit = String(step); reportFit(); return; }
  }
  face.dataset.fit = 'overflow';
  reportFit();
  console.warn('Card content needs editorial shortening:', current?.id);
}
function reportFit() {
  if(previewMode && window.parent !== window) {
    const targetOrigin = location.protocol === 'file:' ? '*' : location.origin;
    window.parent.postMessage({type:'PP_CARD_FIT',cardId:current?.id,fit:$('.back').dataset.fit},targetOrigin);
  }
}
window.addEventListener('resize', () => requestAnimationFrame(() => { fitBackContent(); updateActionPanelWidth(); }));
if (document.fonts) document.fonts.ready.then(() => requestAnimationFrame(() => { fitBackContent(); updateActionPanelWidth(); }));
function setFlipped(flipped) {
  card.classList.toggle('flipped', flipped);
  card.setAttribute('aria-pressed', String(flipped));
  $('#flip').setAttribute('aria-pressed',String(flipped));
  $('#flipLabel').textContent=flipped?'Show Card Front':'View Contact Details';
}
function makeVCard(person, photoBase64) {
  const escape = value => String(value||'').replace(/\\/g,'\\\\').replace(/,/g,'\\,').replace(/;/g,'\\;').replace(/\n/g,'\\n');
  const lines=['BEGIN:VCARD','VERSION:3.0',`FN:${escape(person.name)}`,
    `ORG:Pantry Packers`,`TITLE:${escape(person.title)}`,
    `EMAIL;TYPE=WORK:${escape(person.email)}`,
    ...person.phones.map(p=>`TEL;TYPE=WORK:${dial(p.number)}`),
    `URL:${escape(person.qrUrl)}`, ...(photoBase64 ? [`PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}`] : []), 'END:VCARD'];
  return lines.map(line => line.length <= 74 ? line : line.match(/.{1,74}/g).join('\r\n ')).join('\r\n')+'\r\n';
}
$('#flip').addEventListener('click',()=>setFlipped(!card.classList.contains('flipped')));
card.addEventListener('click',event=>{if(!event.target.closest('a')) setFlipped(!card.classList.contains('flipped'));});
card.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&!event.target.closest('a')){event.preventDefault();setFlipped(!card.classList.contains('flipped'));}});
// Trusted same-origin dashboard messages update only the preview iframe.
window.addEventListener('message',event=>{
  if(!previewMode || event.source!==window.parent || !event.data || event.data.type!=='PP_CARD_PREVIEW') return;
  if(location.protocol!=='file:' && event.origin!==location.origin)return;
  const person=event.data.card;
  if(!person || typeof person.id!=='string' || typeof person.name!=='string')return;
  people=[person];render(person.id,true);
});
async function loadCard() {
  // The editor sends draft details to the iframe; no public employee list is embedded.
  if(previewMode){setFlipped(true);return;}
  const requested = document.documentElement.getAttribute('data-employee');
  if(!requested){showUnavailable('No employee card was specified.');return;}
  if(window.PPBackend){
    try{
      const record=await window.PPBackend.getPublicCard(requested);
      if(!record){showUnavailable('This card does not exist or is not published.');return;}
      people=[fromRecord(record)];render(people[0].id);return;
    }catch(error){showUnavailable('Could not load this card. Please try again.');console.error(error);return;}
  }
  render(requested);
}
async function contactPhotoAsBase64(url) {
  if(!url) return '';
  if(url.startsWith('data:image/jpeg;base64,')) return url.split(',')[1];
  const response=await fetch(url);
  if(!response.ok) throw new Error('Could not load contact photo');
  const bytes=new Uint8Array(await response.arrayBuffer());
  let text=''; for(let i=0;i<bytes.length;i+=8192)text+=String.fromCharCode(...bytes.slice(i,i+8192));
  return btoa(text);
}
$('#save').addEventListener('click',async event=>{
  if(!current?.photo_url && !current?.photo_path)return;
  event.preventDefault();
  const person=current;
  try {
    if(!person.photo_url && window.PPBackend) person.photo_url=await window.PPBackend.photoUrl(person);
    const encoded=await contactPhotoAsBase64(person.photo_url);
    const href=URL.createObjectURL(new Blob([makeVCard(person,encoded)],{type:'text/vcard;charset=utf-8'}));
    const link=document.createElement('a');link.href=href;link.download=`${person.id}.vcf`;
    document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(href),10000);
  } catch(error) {
    // Contact details stay downloadable even if the photo CDN is unavailable.
    console.warn('Photo could not be attached to vCard:',error);
    const link=document.createElement('a');link.href=vcardUrl;link.download=`${person.id}.vcf`;
    document.body.append(link);link.click();link.remove();
  }
});
loadCard();
