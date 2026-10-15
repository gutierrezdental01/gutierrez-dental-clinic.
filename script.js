const CLINIC_EMAIL = "gutierrezdental01@gmail.com";
const form = document.querySelector('#bookingForm');
const AVAILABILITY_URL = 'https://script.google.com/macros/s/AKfycbxLf_VMDguy98ae-3tSDTcOUYOHDafFrAwIYJTBZ04yLIZfNbD179YtpKQI8YNxWXMA_Q/exec';
const timeSelect = document.querySelector('#time');
const availabilityStatus = document.querySelector('#availabilityStatus');
let verifiedSlot = null;
let requestVersion = 0;
const dateInput = document.querySelector('#date');
const nav = document.querySelector('#navigation');
const menuButton = document.querySelector('.menu-toggle');
document.querySelector('#year').textContent = new Date().getFullYear();
function localISODate(d) { const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${day}`; }
dateInput.min = localISODate(new Date());
dateInput.addEventListener('change', () => { const d = new Date(dateInput.value+'T12:00:00'); if(d.getDay()===0){ dateInput.setCustomValidity('The clinic is closed on Sundays. Please choose Monday to Saturday.'); } else { dateInput.setCustomValidity(''); } dateInput.reportValidity(); });
menuButton.addEventListener('click', () => { const isOpen=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(isOpen));menuButton.textContent=isOpen?'✕':'☰'; });
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.textContent='☰';}));
document.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => { document.querySelector('#service').value=({ 'Dental Checkup / Consultation':'consultation', 'Cleaning / Oral Prophylaxis':'cleaning', 'Fillings / Root Canal Consultation':'consultation', 'Braces Consultation':'braces_consultation', 'Teeth Whitening Consultation':'whitening', 'Missing Tooth / Prosthesis Consultation':'prosthesis_consultation', 'Wisdom Tooth / Extraction Consultation':'consultation', 'HMO Benefits Inquiry':'consultation', 'Other Dental Concern':'consultation' }[button.dataset.service] || 'consultation'); document.querySelector('#service').dispatchEvent(new Event('change')); document.querySelector('#book').scrollIntoView({behavior:'smooth'}); }));
document.querySelectorAll('[data-prefill]').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#service').value='consultation'; document.querySelector('#service').dispatchEvent(new Event('change'));}));
form.addEventListener('submit', async e=>{
 e.preventDefault(); if(!form.reportValidity()) return; if(!verifiedSlot || timeSelect.disabled || timeSelect.value!==verifiedSlot){availabilityStatus.textContent='Please select a verified available time first.';availabilityStatus.className='availability-status error';return;}
 const data=new FormData(form);
 const requested=new Date(data.get('date')+'T12:00:00');
 if(requested.getDay()===0){dateInput.setCustomValidity('Please choose a day from Monday to Saturday.');dateInput.reportValidity();return;}
 const prettyDate=requested.toLocaleDateString('en-PH',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
 const msg=`Hello Gutierrez Dental Health Clinic,\n\nI'd like to request an appointment.\n\nName: ${data.get('patientName')}\nMobile: ${data.get('contact')}\nService: ${data.get('service')}\nPreferred date: ${prettyDate}\nPreferred time: ${data.get('time')}\nHMO: ${data.get('hmo')}\nAdditional note: ${data.get('message')||'None'}\n\nPlease contact me to confirm availability. Thank you!`;
 const subject='Dental appointment request - '+data.get('patientName');
 document.querySelector('#bookingText').value=msg;
 document.querySelector('#bookingInstructions').textContent='Click “Open email app” to create your message, then press Send in your email app. If no email app opens, copy the request and email it to '+CLINIC_EMAIL+'. This form does not automatically send or save bookings.';
 document.querySelector('#openMessenger').href='mailto:'+CLINIC_EMAIL+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(msg);

 document.querySelector('#bookingResult').hidden=false;
 document.querySelector('#bookingResult').scrollIntoView({behavior:'smooth',block:'nearest'});
});
document.querySelector('#copyRequest').addEventListener('click',async()=>{
 const text=document.querySelector('#bookingText').value;const button=document.querySelector('#copyRequest');
 try {await navigator.clipboard.writeText(text);button.textContent='Copied! ✓';} catch {const el=document.querySelector('#bookingText');el.focus();el.select();button.textContent='Select & copy the text';}
 setTimeout(()=>{button.textContent='Copy booking message';},2500);
});

// Show the HMO information panel without collecting sensitive ID/account data.
const hmoField = document.querySelector('#hmoSelect');
const hmoIntake = document.querySelector('#hmoIntake');
function updateHmoIntake(){ hmoIntake.hidden = hmoField.value === 'Not using HMO'; }
hmoField.addEventListener('change', updateHmoIntake);
updateHmoIntake();

// The Apps Script endpoint needs the read-only JSONP adapter in APPS-SCRIPT-NEXT-STEP.txt.
// Without it, the form fails closed and does not present unverified availability.
function requestAvailability(date, procedure) {
  return new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    const callbackName='gutierrezAvailabilityCallback';
    const timeout=setTimeout(()=>cleanup(new Error('Availability check timed out')),12000);
    function cleanup(error,data){clearTimeout(timeout);script.remove();delete window[callbackName];if(error)reject(error);else resolve(data);}
    window[callbackName]=data=>cleanup(null,data);
    script.onerror=()=>cleanup(new Error('Calendar service could not be reached'));
    script.src=AVAILABILITY_URL+'?date='+encodeURIComponent(date)+'&procedure='+encodeURIComponent(procedure)+'&callback='+callbackName+'&v='+Date.now();
    document.head.appendChild(script);
  });
}
async function refreshSlots(){
 const v=++requestVersion;verifiedSlot=null;timeSelect.innerHTML='<option value="">Choose service and date first</option>';timeSelect.disabled=true;
 const date=dateInput.value,procedure=document.querySelector('#service').value;
 if(!date||!procedure){availabilityStatus.textContent='Choose a service and date to check appointment availability.';return;}
 const d=new Date(date+'T12:00:00');
 if(d.getDay()===0){availabilityStatus.textContent='Closed on Sundays. Please choose Monday to Saturday.';availabilityStatus.className='availability-status error';return;}
 availabilityStatus.textContent='Checking Google Calendar availability…';availabilityStatus.className='availability-status';
 try{const result=await requestAvailability(date,procedure);if(v!==requestVersion)return;
   if(!result||result.success!==true||!Array.isArray(result.slots))throw new Error('Invalid availability response');
   timeSelect.innerHTML='<option value="">Choose an available time</option>';
   let open=0;for(const slot of result.slots){const opt=document.createElement('option');opt.value=slot.time;opt.textContent=slot.time+(slot.available?'':' — Unavailable');opt.disabled=!slot.available;timeSelect.appendChild(opt);if(slot.available)open++;}
   timeSelect.disabled=open===0;availabilityStatus.textContent=open?`${open} possible start times. Final booking requires receptionist confirmation.`:'No available slots for this service and date. Try another day.';availabilityStatus.className='availability-status '+(open?'success':'error');
 }catch(error){if(v!==requestVersion)return;availabilityStatus.textContent='Live calendar is not connected yet. Please call or message the clinic for scheduling.';availabilityStatus.className='availability-status error';}
}
document.querySelector('#service').addEventListener('change',refreshSlots);
dateInput.addEventListener('change',refreshSlots);
timeSelect.addEventListener('change',()=>{verifiedSlot=timeSelect.value||null;});
