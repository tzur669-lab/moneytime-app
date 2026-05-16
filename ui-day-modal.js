// ---- DAY MODAL ----
function openDay(k){
  selDt=new Date(k);const data=D.g(),s=D.gs();
  const d=data[k]||{hours:'',rate:s.jobs?.[0]?.rate||50,note:'',bonuses:[],jobIdx:0,startTime:'',endTime:'',extraJobs:[]};
  document.getElementById('mDayTtl').textContent=k;
  document.getElementById('mDaySub').textContent=HC.f(selDt);
  document.getElementById('mNavTtl').textContent=k;
  document.getElementById('mNavSub').textContent=HC.f(selDt);
  const jsel=document.getElementById('dJob');
  jsel.innerHTML=(s.jobs||[]).map((j,i)=>`<option value="${i}"${i===(d.jobIdx||0)?' selected':''}>${j.name}</option>`).join('');
  document.getElementById('dH').value=d.hours||'';
  document.getElementById('dR').value=d.rate||'';
  document.getElementById('dS').value=d.startTime||'';
  document.getElementById('dE').value=d.endTime||'';
  document.getElementById('dNote').value=d.note||'';
  document.getElementById('dBonList').innerHTML='';
  (d.bonuses||[]).forEach(b=>addB(b.desc,b.amount));
  // איפוס picker בונוס קבוע
  var _picker=document.getElementById('dFbonPicker');
  var _pbtn=document.getElementById('fbonPickerBtn');
  if(_picker){_picker.style.display='none';}
  if(_pbtn){_pbtn.textContent='+ בונוס קבוע';}
  renderFbonChips();
  document.getElementById('dExtraJobList').innerHTML='';
  (d.extraJobs||[]).forEach(ej=>addExtraJob(ej.jobIdx,ej.hours,ej.rate,ej.startTime,ej.endTime));

  // עדכון banner רווח יומי
  updateDayProfit();

  // הנה השורה שהוספנו! מפעילה את סיכום הפרטנר לפני פתיחת החלון
  updatePartnerDaySummary();

  // הוסף event listeners לעדכון live של רווח יומי
  setTimeout(function(){
    var dH=document.getElementById('dH');
    var dR=document.getElementById('dR');
    if(dH&&!dH._profitListener){dH.addEventListener('input',updateDayProfit);dH._profitListener=true;}
    if(dR&&!dR._profitListener){dR.addEventListener('input',updateDayProfit);dR._profitListener=true;}
  },50);

  openM('mDay');
}

// ---- עדכון רווח יומי live ----
function updateDayProfit(){
  var banner=document.getElementById('dayProfitBanner');
  var amtEl=document.getElementById('dpAmount');
  var bdEl=document.getElementById('dpBreakdown');
  var dateEl=document.getElementById('dpDate');
  if(!banner||!amtEl)return;

  var h=parseFloat(document.getElementById('dH')?.value)||0;
  var r=parseFloat(document.getElementById('dR')?.value)||0;

  // קרא בונוסים מהרשימה
  var bons=[];
  document.querySelectorAll('#dBonList .brow').forEach(function(row){
    var amt=parseFloat(row.querySelector('.bamt')?.value)||0;
    var desc=row.querySelector('.bdesc')?.value||'';
    if(amt>0)bons.push({desc:desc,amount:amt});
  });

  // הצג תאריך
  if(dateEl&&selDt){
    var dn=['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
    dateEl.textContent=dn[selDt.getDay()]+', '+fk(selDt);
  }

  if(h===0&&r===0&&bons.length===0){
    banner.style.display='none';
    return;
  }

  var result=cp(h,r,bons);
  banner.style.cssText='display:flex;background:linear-gradient(135deg,var(--b0),var(--s2));border:1px solid var(--b1);border-radius:12px;padding:12px 14px;margin-bottom:14px;justify-content:space-between;align-items:center';
  amtEl.textContent='₪'+Math.round(result.total).toLocaleString('he-IL');

  // פירוט: בסיס + בונוסים
  var parts=[];
  if(result.base>0)parts.push('עבודה ₪'+Math.round(result.base).toLocaleString('he-IL'));
  if(result.bonus>0)parts.push('בונוסים ₪'+Math.round(result.bonus).toLocaleString('he-IL'));
  if(result.ot1>0)parts.push('שע"ן 125%: '+result.ot1.toFixed(1)+'ש\'');
  if(result.ot2>0)parts.push('שע"ן 150%: '+result.ot2.toFixed(1)+'ש\'');
  if(bdEl)bdEl.textContent=parts.join(' · ');
}
function onJobCh(){const s=D.gs(),ji=parseInt(document.getElementById('dJob').value);const j=s.jobs?.[ji];if(j)document.getElementById('dR').value=j.rate||'';}
function calcT(){const sv=document.getElementById('dS').value,ev=document.getElementById('dE').value;if(sv&&ev){const[sh,sm]=sv.split(':').map(Number),[eh,em]=ev.split(':').map(Number);let df=(eh+em/60)-(sh+sm/60);if(df<0)df+=24;document.getElementById('dH').value=df.toFixed(2);}}
function copyYest(){const y=new Date(selDt);y.setDate(y.getDate()-1);const d=D.g()[fk(y)];if(d)document.getElementById('dH').value=d.hours;}
function addB(desc='',amt=''){const list=document.getElementById('dBonList');const row=document.createElement('div');row.className='brow';const sd=String(desc).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');row.innerHTML=`<input type="text" class="fi bdesc" placeholder="סיבה" value="${sd}"><input type="number" class="fi bamt" placeholder="₪" value="${amt}"><button class="bdel" onclick="this.parentElement.remove();updateDayProfit()">×</button>`;
row.querySelector('.bamt').addEventListener('input',updateDayProfit);
list.appendChild(row);}
function addExtraJob(ji=0,h='',r='',st='',en=''){
  const s=D.gs();const list=document.getElementById('dExtraJobList');
  const row=document.createElement('div');
  row.className='ej-row';
  row.style.cssText='background:var(--s2);border:1px solid var(--bd);border-radius:10px;padding:10px;margin-bottom:8px;position:relative';
  const jobOpts=(s.jobs||[]).map((j,i)=>`<option value="${i}"${i===ji?' selected':''}>${j.name}</option>`).join('');
  row.innerHTML=`<button class="bdel" style="position:absolute;top:6px;left:6px;z-index:1" onclick="this.closest('.ej-row').remove()">×</button>
    <div class="fg" style="margin-bottom:6px"><label class="fl">מקום עבודה נוסף</label>
      <select class="fi ej-job" onchange="onExtraJobCh(this)">${jobOpts}</select></div>
    <div class="t2row">
      <div class="fg"><label class="fl">כניסה</label><input type="time" class="fi ej-start" value="${st||''}" onchange="calcExtraT(this)"></div>
      <div class="fg"><label class="fl">יציאה</label><input type="time" class="fi ej-end" value="${en||''}" onchange="calcExtraT(this)"></div>
    </div>
    <div class="t2row">
      <div class="fg"><label class="fl">שעות</label><input type="number" class="fi ej-hours" step="0.25" value="${h||''}" placeholder="0.00"></div>
      <div class="fg"><label class="fl">תעריף ₪</label><input type="number" class="fi ej-rate" value="${r||''}" placeholder="₪"></div>
    </div>`;
  list.appendChild(row);
}
function onExtraJobCh(sel){
  const s=D.gs(),ji=parseInt(sel.value)||0,j=s.jobs?.[ji];
  if(!j)return;
  const row=sel.closest('.ej-row');
  const rateEl=row?.querySelector('.ej-rate');
  if(rateEl&&!rateEl.value) rateEl.value=j.rate||'';
}
function calcExtraT(el){
  const row=el.closest('.ej-row');if(!row)return;
  const sv=row.querySelector('.ej-start').value,ev=row.querySelector('.ej-end').value;
  if(sv&&ev){const[sh,sm]=sv.split(':').map(Number),[eh,em]=ev.split(':').map(Number);let df=(eh+em/60)-(sh+sm/60);if(df<0)df+=24;row.querySelector('.ej-hours').value=df.toFixed(2);}
}
function saveDay(){
  const data=D.g(),bons=[];
  document.querySelectorAll('#dBonList .brow').forEach(r=>{const desc=r.querySelector('.bdesc').value,amt=parseFloat(r.querySelector('.bamt').value);if(amt>0)bons.push({desc:desc||'תוספת',amount:amt});});
  const extraJobs=[];
  document.querySelectorAll('#dExtraJobList .ej-row').forEach(row=>{
    const ji=parseInt(row.querySelector('.ej-job').value)||0;
    const h=parseFloat(row.querySelector('.ej-hours').value)||0;
    const r=parseFloat(row.querySelector('.ej-rate').value)||0;
    const st=row.querySelector('.ej-start').value||'';
    const en=row.querySelector('.ej-end').value||'';
    if(h>0) extraJobs.push({jobIdx:ji,hours:h,rate:r,startTime:st,endTime:en});
  });
  const k=fk(selDt);
  data[k]={hours:parseFloat(document.getElementById('dH').value)||0,rate:parseFloat(document.getElementById('dR').value)||0,note:document.getElementById('dNote').value,bonuses:bons,jobIdx:parseInt(document.getElementById('dJob').value)||0,startTime:document.getElementById('dS').value,endTime:document.getElementById('dE').value,extraJobs};
  D.s(data);closeM('mDay');renderCal();updRep();saveDr();flash();vib();
}
function navDay(delta){const d=new Date(selDt);d.setDate(d.getDate()+delta);closeM('mDay');openDay(fk(d));}
function updatePartnerDaySummary() {
  const summaryEl = document.getElementById('partnerDaySummary');
  if (!summaryEl) return;

  const settings = D.gs();

  // Check if paired
  if (!settings.pairCode || !settings.partnerCode) {
    summaryEl.style.display = 'none';
    return;
  }

  // Get selected date
  const date = selDt ? fk(selDt) : fk(new Date());
  const partnerData = D.gp()[date] || {};

  // חישוב בונוסים אמיתי מהמערך של הפרטנר
  let totalBonus = 0;
  if (partnerData.bonuses && Array.isArray(partnerData.bonuses)) {
    partnerData.bonuses.forEach(b => {
      totalBonus += parseFloat(b.amount) || 0;
    });
  }

  const hours = parseFloat(partnerData.hours) || 0;
  const rate = parseFloat(partnerData.rate) || 0;
  const base = hours * rate;

  // אם אין בכלל נתונים (לא שעות ולא בונוס), נסתיר הכל
  if (hours === 0 && totalBonus === 0) {
    summaryEl.style.display = 'none';
    return;
  }

  const total = base + totalBonus;

  // Update UI
  summaryEl.style.display = 'block';

  // Partner name
  document.getElementById('pdsPartnerName').textContent = settings.partnerName || 'פרטנר';

  // Total (Top)
  document.getElementById('pdsTotal').textContent = '₪' + total.toFixed(0);

  // שורת עבודה - מציגים רק אם יש כסף מעבודה
  const workRow = document.getElementById('pdsWorkRow');
  if (base > 0) {
    if(workRow) workRow.style.display = 'flex';
    document.getElementById('pdsBase').textContent = '₪' + base.toFixed(0);
  } else {
    if(workRow) workRow.style.display = 'none';
  }

  // שורת בונוסים - מציגים רק אם יש בונוס
  const bonusRow = document.getElementById('pdsBonusRow');
  if (totalBonus > 0) {
    if(bonusRow) bonusRow.style.display = 'flex';
    document.getElementById('pdsBonus').textContent = '₪' + totalBonus.toFixed(0);
  } else {
    if(bonusRow) bonusRow.style.display = 'none';
  }

  // Note (show only if exists)
  const noteEl = document.getElementById('pdsNote');
  if (partnerData.note && partnerData.note.trim()) {
    noteEl.style.display = 'block';
    noteEl.textContent = '📝 ' + partnerData.note;
  } else {
    noteEl.style.display = 'none';
  }
}
