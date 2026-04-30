// ---- SETTINGS ----
function setColor(c){
  const s=D.gs(); s.colorTheme=c; D.ss(s);
  applyColorTheme(c);
  vib();
}

function applyColorTheme(c){
  document.documentElement.removeAttribute('data-color');
  const savedTheme=D.gs().theme||'light';
  document.body.setAttribute('data-theme', savedTheme==='dark'?'dark':'');
  if(!savedTheme||savedTheme==='light') document.body.removeAttribute('data-theme');
  if(c && c!=='blue') document.documentElement.setAttribute('data-color',c);
  document.querySelectorAll('.tpick').forEach(el=>el.classList.remove('sel'));
  const el=document.getElementById('tc-'+c);
  if(el) el.classList.add('sel');
  const colors={blue:'#1E3A8A',green:'#166534',purple:'#4C1D95',black:'#0F172A',orange:'#C2410C',pink:'#9F1239',teal:'#134E4A'};
  document.getElementById('metaTC').content=colors[c]||'#1E3A8A';
}

function renderSettings(){
  const _vEl=document.getElementById('updSetVer');
  if(_vEl)_vEl.textContent=APP_VERSION;
  const s=D.gs();
  const c=s.colorTheme||'blue';
  document.querySelectorAll('.tpick').forEach(el=>el.classList.remove('sel'));
  document.getElementById('tc-'+c)?.classList.add('sel');
  document.getElementById('togOT').checked=!!s.calcOvertime;
  document.getElementById('togMiss').checked=s.showMissing!==false;
  document.getElementById('drOff').style.display=aToken?'none':'block';
  document.getElementById('drOn').style.display=aToken?'block':'none';
  renderJobsCont();
  renderFixedBonuses();
}
function setSetting(k,v){const s=D.gs();s[k]=v;D.ss(s);if(k==='showMissing')renderCal();if(k==='calcOvertime')_updXo2State();vib();}
function _updXo2State(){
  const s=D.gs();
  const el=document.getElementById('xo2');
  if(!el)return;
  const wrap=el.closest('.pdfopt');
  if(!wrap)return;
  if(!s.calcOvertime){
    if(el.classList.contains('on')){el.classList.remove('on');el.textContent='';}
    wrap.style.opacity='0.4';
    wrap.style.pointerEvents='none';
  } else {
    wrap.style.opacity='';
    wrap.style.pointerEvents='';
  }
}
function renderJobsCont(){
  const s=D.gs(),cont=document.getElementById('jobsCont');
  cont.innerHTML=(s.jobs||[]).map((j,i)=>`
  <div class="jcard" style="border-right:4px solid ${j.color}">
    ${(s.jobs||[]).length>1?'<button class="btn-del-j" onclick="delJob('+i+')">×</button>':''}
    <div class="jcard-top"><div class="jcbadge" style="background:${j.color}"></div><input class="jname" value="${j.name}" onchange="updJ(${i},'name',this.value)"></div>
    <div class="jnums">
      <div class="fg" style="margin:0"><label class="fl">תעריף שעתי (₪)</label><input type="number" class="fi" value="${j.rate}" onchange="updJ(${i},'rate',this.value)" placeholder="₪/שעה"></div>
      <div class="fg" style="margin:0"><label class="fl">סכום קבוע חודשי (₪)</label><input type="number" class="fi" value="${j.fixed||0}" onchange="updJ(${i},'fixed',this.value)" placeholder="₪/חודש"></div>
    </div>
    <div class="fl" style="margin-bottom:6px">צבע</div>
    <div class="crow">${JC.map(c=>'<div class="cdot'+(c===j.color?' sel':'')+'" data-color="'+c+'" style="background:'+c+'" onclick="updJC('+i+',this.dataset.color,this)"></div>').join('')}</div>
  </div>`).join('');
  document.getElementById('addJobBtn').style.display=(s.jobs||[]).length>=3?'none':'inline-flex';
}
function addJob(){const s=D.gs();if((s.jobs||[]).length>=3)return;s.jobs.push({name:`עבודה ${(s.jobs||[]).length+1}`,color:JC[(s.jobs||[]).length%JC.length],rate:50,fixed:0});D.ss(s);renderJobsCont();vib();if(typeof aToken!=='undefined'&&aToken)saveDr();}
function delJob(i){const s=D.gs();s.jobs.splice(i,1);D.ss(s);renderJobsCont();if(typeof aToken!=='undefined'&&aToken)saveDr();}
function updJ(i,f,v){
  const s=D.gs();
  s.jobs[i][f]=f==='name'?v:(parseFloat(v)||0);
  D.ss(s);
  clearTimeout(window._jobSaveT);
  window._jobSaveT=setTimeout(function(){if(typeof aToken!=='undefined'&&aToken)saveDr();},1200);
}
function updJC(i,col,el){
  el.closest('.crow').querySelectorAll('.cdot').forEach(d=>d.classList.remove('sel'));
  el.classList.add('sel');
  const s=D.gs();
  if(s.jobs&&s.jobs[i]){
    s.jobs[i].color=col;
    D.ss(s);
    if(typeof aToken!=='undefined'&&aToken)saveDr();
    const card=el.closest('.jcard');
    if(card){const badge=card.querySelector('.jcbadge');if(badge)badge.style.background=col;}
    if(card)card.style.borderRightColor=col;
  }
}

// ---- FIXED BONUSES ----
function renderFixedBonuses(){
  const s=D.gs(),cont=document.getElementById('fbonCont');
  if(!cont)return;
  const fbs=s.fixedBonuses||[];
  if(!fbs.length){
    cont.innerHTML='<div style="font-size:12px;color:var(--t3);text-align:center;padding:8px 0">אין בונוסים קבועים עדיין</div>';
    return;
  }
  cont.innerHTML=fbs.map((fb,i)=>`
    <div class="fbon-row">
      <input class="fbon-name" value="${(fb.name||'').replace(/"/g,'&quot;')}" placeholder="שם הבונוס" oninput="updFixedBonus(${i},'name',this.value)" onchange="updFixedBonus(${i},'name',this.value)">
      <input type="number" class="fbon-amt" value="${fb.amount||''}" placeholder="₪" oninput="updFixedBonus(${i},'amount',this.value)" onchange="updFixedBonus(${i},'amount',this.value)">
      <button class="fbon-del" onclick="delFixedBonus(${i})">×</button>
    </div>`).join('');
}
function addFixedBonus(){
  const s=D.gs();
  if(!s.fixedBonuses)s.fixedBonuses=[];
  s.fixedBonuses.push({name:'',amount:0});
  D.ss(s);renderFixedBonuses();vib();
  if(typeof aToken!=='undefined'&&aToken)saveDr();
}
function updFixedBonus(i,f,v){
  const s=D.gs();
  if(!s.fixedBonuses||!s.fixedBonuses[i])return;
  s.fixedBonuses[i][f]=f==='name'?v:(parseFloat(v)||0);
  D.ss(s);
  clearTimeout(window._fbonSaveT);
  window._fbonSaveT=setTimeout(function(){if(typeof aToken!=='undefined'&&aToken)saveDr();},1200);
}
function delFixedBonus(i){
  const s=D.gs();
  if(!s.fixedBonuses)return;
  s.fixedBonuses.splice(i,1);D.ss(s);renderFixedBonuses();vib();
  if(typeof aToken!=='undefined'&&aToken)saveDr();
}
function renderFbonChips(){
  const s=D.gs(),cont=document.getElementById('dFbonChips');
  if(!cont)return;
  const fbs=(s.fixedBonuses||[]).filter(fb=>fb.name&&fb.amount>0);
  if(!fbs.length){cont.innerHTML='';return;}
  cont.style.marginBottom='8px';
  cont.innerHTML='<div style="font-size:10px;color:var(--t3);margin-bottom:5px">בונוסים קבועים:</div>'+
    fbs.map(function(fb){
      var n=fb.name.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
      return '<button class="fbon-chip" onclick="addB(\''+n+'\','+fb.amount+');vib()" style="font-size:12px;padding:6px 13px">+ '+fb.name+' <strong>&#8362;'+fb.amount+'</strong></button>';
    }).join('');
}
function toggleFbonPicker(){
  var picker=document.getElementById('dFbonPicker');
  var btn=document.getElementById('fbonPickerBtn');
  if(!picker)return;
  if(picker.style.display==='none'||picker.style.display===''){
    var s=D.gs();
    var fbs=(s.fixedBonuses||[]).filter(function(fb){return fb.name&&fb.amount>0;});
    if(!fbs.length){
      picker.innerHTML='<div style="font-size:12px;color:var(--t3);text-align:center;padding:4px 0">אין בונוסים קבועים מוגדרים</div>';
    } else {
      picker.innerHTML='<div style="font-size:10px;color:var(--t3);margin-bottom:6px">בחר בונוס קבוע:</div>'+
        fbs.map(function(fb){
          var n=fb.name.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
          return '<button class="fbon-chip" onclick="addB(\''+n+'\','+fb.amount+');toggleFbonPicker();vib()" style="font-size:12px;padding:6px 13px;display:block;width:100%;text-align:right;margin-bottom:4px">+ '+fb.name+' <strong style=\"float:left\">&#8362;'+fb.amount+'</strong></button>';
        }).join('');
    }
    picker.style.display='block';
    if(btn)btn.textContent='✕ סגור';
  } else {
    picker.style.display='none';
    if(btn)btn.textContent='+ בונוס קבוע';
  }
}
