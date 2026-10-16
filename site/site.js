/* HN Consulting Engineering - language switch, cookie banner, contact form */
(function(){
  var KEY='hn_cookie_consent', LK='hn_lang';
  function gs(k){try{return localStorage.getItem(k)}catch(e){return null}}
  function ss(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  window.hnConsent=gs(KEY);

  var T={
    el:{
      banner:'Ο ιστότοπος αποθηκεύει μόνο την επιλογή σας για τα cookies και τη γλώσσα και δεν χρησιμοποιεί cookies παρακολούθησης ή διαφήμισης. Αν προστεθούν στο μέλλον προαιρετικά εργαλεία (π.χ. στατιστικά), θα ενεργοποιηθούν μόνο με τη συγκατάθεσή σας. Δείτε την <a href="cookies.html">Πολιτική Cookies</a> και την <a href="privacy.html">Πολιτική Απορρήτου</a>.',
      acc:'Αποδοχή',rej:'Απόρριψη',aria:'Συγκατάθεση cookies',
      sending:'Αποστολή...',send:'Αποστολή',
      ok:'Ευχαριστούμε! Το μήνυμά σας εστάλη. Θα επικοινωνήσουμε σύντομα.',
      err:'Κάτι πήγε στραβά. Παρακαλούμε στείλτε email στο hn.engcon@gmail.com.'
    },
    en:{
      banner:'This website only stores your cookie and language choices and does not use tracking or advertising cookies. If optional tools (e.g. statistics) are added in the future, they will only be enabled with your consent. See our <a href="cookies.html">Cookie Policy</a> and <a href="privacy.html">Privacy Policy</a>.',
      acc:'Accept',rej:'Reject',aria:'Cookie consent',
      sending:'Sending...',send:'Send',
      ok:'Thank you! Your message has been sent. We will get back to you shortly.',
      err:'Something went wrong. Please email us at hn.engcon@gmail.com.'
    }
  };

  function initialLang(){
    var s=gs(LK); if(s==='el'||s==='en')return s;
    var n=(navigator.language||'el').toLowerCase();
    return n.indexOf('el')===0?'el':'en';
  }
  var lang=initialLang();
  function t(k){return T[lang][k]}

  function applyLang(l,persist){
    lang=l; if(persist)ss(LK,l);
    document.documentElement.lang=l;
    var els=document.querySelectorAll('[data-en]');
    for(var i=0;i<els.length;i++){
      var e=els[i];
      if(e.tagName==='META'){
        if(!e.getAttribute('data-el'))e.setAttribute('data-el',e.getAttribute('content'));
        e.setAttribute('content',l==='en'?e.getAttribute('data-en'):e.getAttribute('data-el'));
        continue;
      }
      if(e.getAttribute('data-el')===null)e.setAttribute('data-el',e.innerHTML);
      e.innerHTML=l==='en'?e.getAttribute('data-en'):e.getAttribute('data-el');
    }
    var bs=document.querySelectorAll('.lang button');
    for(var j=0;j<bs.length;j++)bs[j].className=bs[j].getAttribute('data-lang')===l?'on':'';
    var msg=document.getElementById('cfMsg'); if(msg){msg.textContent='';msg.className=''}
    if(document.getElementById('cb')){close();show()}
  }

  // ---- cookie banner ----
  var css=document.createElement('style');
  css.textContent='#cb{position:fixed;left:16px;right:16px;bottom:16px;max-width:760px;margin:0 auto;background:#1f3a56;color:#fff;border-radius:16px;padding:20px 22px;box-shadow:0 12px 40px rgba(0,0,0,.35);z-index:9999;font:15px/1.5 "Segoe UI",Roboto,Arial,sans-serif;border-top:4px solid #3fb56c}#cb p{margin:0 0 14px;color:#e6eef8}#cb a{color:#8fd0ff}#cb .b{display:flex;gap:10px;flex-wrap:wrap}#cb button{flex:1;min-width:140px;padding:11px 18px;border-radius:999px;border:2px solid #fff;background:#fff;color:#1f3a56;font:700 15px inherit;cursor:pointer}#cb button:hover{background:#ffb300;border-color:#ffb300}';
  document.head.appendChild(css);
  function close(){var e=document.getElementById('cb');if(e)e.remove()}
  function show(){
    if(document.getElementById('cb'))return;
    var d=document.createElement('div');d.id='cb';d.setAttribute('role','dialog');d.setAttribute('aria-label',t('aria'));
    d.innerHTML='<p>'+t('banner')+'</p><div class="b"><button id="cbA">'+t('acc')+'</button><button id="cbR">'+t('rej')+'</button></div>';
    document.body.appendChild(d);
    document.getElementById('cbA').onclick=function(){ss(KEY,'accepted');window.hnConsent='accepted';close()};
    document.getElementById('cbR').onclick=function(){ss(KEY,'rejected');window.hnConsent='rejected';close()};
  }

  document.addEventListener('DOMContentLoaded',function(){
    applyLang(lang);
    var lb=document.querySelectorAll('.lang button');
    for(var i=0;i<lb.length;i++)lb[i].addEventListener('click',function(){applyLang(this.getAttribute('data-lang'),true)});
    if(!gs(KEY))show();
    var s=document.getElementById('cookieSettings');
    if(s)s.addEventListener('click',function(e){e.preventDefault();show()});

    // ---- contact form ----
    var f=document.getElementById('contactForm');
    if(!f)return;
    var ENDPOINT='https://formspree.io/f/mzedkgnb';
    var msg=document.getElementById('cfMsg'),btn=document.getElementById('cfBtn'),bt=document.getElementById('cfBtnT');
    f.addEventListener('submit',function(e){
      e.preventDefault();msg.className='';msg.textContent='';
      if(!f.checkValidity()){f.reportValidity();return}
      if(f.elements._gotcha.value)return;
      btn.disabled=true;bt.innerHTML=t('sending');
      fetch(ENDPOINT,{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},
        body:JSON.stringify({name:f.name.value,email:f.email.value,phone:f.phone.value,message:f.message.value,consent:'Accepted the Privacy Policy',language:lang})})
      .then(function(r){if(!r.ok)throw 0;f.reset();msg.className='ok';msg.textContent=t('ok')})
      .catch(function(){msg.className='err';msg.textContent=t('err')})
      .finally(function(){btn.disabled=false;bt.innerHTML=t('send')});
    });
  });
})();
