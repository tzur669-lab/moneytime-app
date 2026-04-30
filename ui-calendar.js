function navCal(d){
  vib();
  if(_calView==='week'){curDt.setDate(curDt.getDate()+(d*7));}
  else if(_calView==='day'){curDt.setDate(curDt.getDate()+d);}
  else{curDt.setMonth(curDt.getMonth()+d);}
  renderCal();
}

function renderCal(){
  // נקה תצוגות קודמות
  var existing;
  existing=document.getElementById('calWeekBody');if(existing)existing.remove();
  existing=document.getElementById('calDayBody');if(existing)existing.remove();
  
  var _grid=document.getElementById('calGrid');
  var _legend=document.getElementById('calLegend');
  
  // בדוק איזו תצוגה להציג
  if(_calView==='week'){if(_grid)_grid.style.display='none';if(_legend)_legend.style.display='none';renderWeekView();updHdrSub();return;}
  if(_calView==='day'){if(_grid)_grid.style.display='none';if(_legend)_legend.style.display='none';renderDayView();updHdrSub();return;}
  
  // תצוגת חודש — קוד מקורי
  if(_grid)_grid.style.display='grid';
  if(_legend)_legend.style.display='flex';
  
  const y=curDt.getFullYear(),m=curDt.getMonth();
  document.getElementById('calTitle').textContent=MN[m];
  const yearEl=document.getElementById('calYear');if(yearEl)yearEl.textContent=y;
  const grid=document.getElementById('calGrid');grid.innerHTML='';
  const data=D.g(),pd=D.gp(),s=D.gs(),tk=fk(new Date()),today=new Date();today.setHours(0,0,0,0);
  ['א','ב','ג','ד','ה','ו','ש'].forEach(d=>{const h=document.createElement('div');h.className='chc';h.textContent=d+"'";grid.appendChild(h);});
  const first=new Date(y,m,1).getDay();
  for(let i=0;i<first;i++)grid.appendChild(document.createElement('div'));
  const days=new Date(y,m+1,0).getDate();let miss=0;
  for(let d=1;d<=days;d++){
    const dt=new Date(y,m,d),k=fk(dt);
    const hasMe=(data[k]?.hours||0)>0,hasPrt=(pd[k]?.hours||0)>0;
    const isT=k===tk,isPast=dt<today&&!isT,isWd=dt.getDay()!==6;
    const isMiss=s.showMissing&&isPast&&isWd&&!hasMe;
    if(isMiss)miss++;
    const c=document.createElement('div');
    c.className='cc'+(isT?' today':isMiss?' missing':hasMe?' has-data':'');
    c.onclick=()=>{vib();openDay(k);};
    let html='';
    if(data[k]?.note||(data[k]?.bonuses?.length>0)){const col=s.jobs?.[data[k]?.jobIdx||0]?.color||'#1E3A8A';html+=`<div class="cc-dot" style="background:${col}"></div>`;}
    html+=`<div class="cc-top"><div class="cc-num">${d}</div></div><div class="cc-heb">${HC.f(dt)}</div>`;
    const bars=[];
    if(hasMe){const col=s.jobs?.[data[k]?.jobIdx||0]?.color||'#1E3A8A';bars.push(`<div class="cc-bar" style="background:${col}"></div>`);}
    if(hasMe&&(data[k].extraJobs||[]).length>0){(data[k].extraJobs||[]).forEach(ej=>{const ecol=s.jobs?.[ej.jobIdx||0]?.color||'#0EA5E9';bars.push(`<div class="cc-bar" style="background:${ecol}"></div>`);});}
    if(hasPrt)bars.push(`<div class="cc-bar" style="background:${s.partnerColor}"></div>`);
    if(bars.length)html+=`<div class="cc-bars">${bars.join('')}</div>`;
    else if(hasMe){const _eh=(data[k].extraJobs||[]).reduce((a,ej)=>a+(ej.hours||0),0);const _ah=((data[k].hours||0)+_eh);html+=`<div class="cc-h">${_ah%1===0?_ah:_ah.toFixed(1)}ש'</div>`;}
    c.innerHTML=html;grid.appendChild(c);
  }
  const mb=document.getElementById('missBanner');
  if(miss>0&&D.gs().showMissing){mb.innerHTML=`<div class="miss-banner"><span style="display:flex;align-items:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span><div class="miss-banner-txt"><strong>${miss} ימים ללא רישום</strong>לחץ על יום מסומן לתיקון</div></div>`;}
  else{mb.innerHTML='';}
  updHdrSub();
  // הצג באנר חיבור פרטנר אם לא מחוברים ולא נדחה
  const pb=document.getElementById('pairBanner');
  if(pb){
    const sNow=D.gs();
    const dismissed=localStorage.getItem('pairBannerDismissed');
    pb.style.display=(!sNow.pairCode && !dismissed)?'flex':'none';
  }
}

function renderWeekView(){
  var body=document.getElementById('calViewBody');
  if(!body)return;
  var legend=document.getElementById('calLegend');
  if(legend)legend.style.display='none';
  var grid=document.getElementById('calGrid');
  if(grid)grid.style.display='none';

  // מצא ראשון השבוע (ראשון = 0)
  var d=new Date(curDt);
  var day=d.getDay(); // 0=ראשון
  d.setDate(d.getDate()-day); // חזור לראשון

  var data=D.g(),s=D.gs(),pd=D.gp();
  var today=new Date();today.setHours(0,0,0,0);
  var tk=fk(today);

  // חשב מקסימום שעות בשבוע לסקאלת הbar
  var maxH=0;
  for(var i=0;i<7;i++){
    var dd=new Date(d);dd.setDate(d.getDate()+i);
    var k=fk(dd);
    var pr=cpDay(data[k]);
    if(pr.allHours>maxH)maxH=pr.allHours;
  }
  if(maxH<1)maxH=1;

  var DN=['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
  var html='<div class="wv-list">';
  for(var i=0;i<7;i++){
    var dd=new Date(d);dd.setDate(d.getDate()+i);
    var k=fk(dd);
    var pr=cpDay(data[k]);
    var hasData=pr.allHours>0;
    var isToday=k===tk;
    var isPast=dd<today&&!isToday;
    var isMiss=s.showMissing&&isPast&&dd.getDay()!==6&&!hasData;
    var cls='wv-row'+(hasData?' wv-has':'')+(isToday?' wv-today':'')+(isMiss?' wv-miss':'');
    var pct=Math.round((pr.allHours/maxH)*100);
    var hrsStr=hasData?(pr.allHours%1===0?pr.allHours:pr.allHours.toFixed(1))+"ש'":'—';
    var payStr=hasData?'₪'+Math.round(pr.total).toLocaleString('he-IL'):'';
    html+='<div class="'+cls+'" onclick="vib();openDay(\''+k+'\')">'+
      '<span class="wv-name"'+(isToday?' style="color:var(--b6);font-weight:500"':'')+'>'+DN[dd.getDay()]+'</span>'+
      '<span class="wv-date"'+(isToday?' style="color:var(--b6)"':'')+'>'+dd.getDate()+'</span>'+
      '<div class="wv-bar-wrap"><div class="wv-bar-fill" style="width:'+pct+'%"></div></div>'+
      '<span class="wv-hrs">'+hrsStr+'</span>'+
      '<span class="wv-pay">'+payStr+'</span>'+
    '</div>';
  }
  html+='</div>';

  // כותרת: טווח תאריכים השבוע
  var wEnd=new Date(d);wEnd.setDate(d.getDate()+6);
  var titleStr=d.getDate()+'–'+wEnd.getDate()+' '+MN[wEnd.getMonth()];
  var yearStr=wEnd.getFullYear();
  document.getElementById('calTitle').textContent=titleStr;
  var yearEl=document.getElementById('calYear');if(yearEl)yearEl.textContent=yearStr;

  var existing=document.getElementById('calWeekBody');
  if(existing)existing.remove();
  var div=document.createElement('div');
  div.id='calWeekBody';
  div.innerHTML=html;
  body.appendChild(div);
}

function renderDayView(){
  var body=document.getElementById('calViewBody');
  if(!body)return;
  var legend=document.getElementById('calLegend');
  if(legend)legend.style.display='none';
  var grid=document.getElementById('calGrid');
  if(grid)grid.style.display='none';

  var data=D.g(),s=D.gs();
  var k=fk(curDt);
  var pr=cpDay(data[k]);
  var hasData=pr.allHours>0;
  var DN=['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
  var dayName=DN[curDt.getDay()];
  var dateStr=curDt.getDate()+' '+MN[curDt.getMonth()]+' '+curDt.getFullYear();

  document.getElementById('calTitle').textContent=dayName+', '+curDt.getDate();
  var yearEl=document.getElementById('calYear');if(yearEl)yearEl.textContent=MN[curDt.getMonth()]+' '+curDt.getFullYear();

  var html='<div class="dv-card">';
  if(!hasData){
    html+='<div class="dv-empty">אין נתונים ליום זה<br><span style="font-size:10px;color:var(--b6);cursor:pointer" onclick="openDay(\''+k+'\')">+ הוסף</span></div>';
  } else {
    var rate=(data[k]&&data[k].rate)||0;
    html+='<div class="dv-metrics">'+
      '<div class="dv-metric"><div class="dv-metric-val">'+(pr.allHours%1===0?pr.allHours:pr.allHours.toFixed(1))+'</div><div class="dv-metric-lbl">שעות</div></div>'+
      '<div class="dv-metric"><div class="dv-metric-val">₪'+Math.round(pr.total).toLocaleString('he-IL')+'</div><div class="dv-metric-lbl">שכר</div></div>'+
      '<div class="dv-metric"><div class="dv-metric-val">₪'+rate+'</div><div class="dv-metric-lbl">תעריף</div></div>'+
    '</div>';
    // פרטי שעות נוספות
    if(pr.ot1>0)html+='<div class="dv-detail"><div class="dv-dot" style="background:var(--b5)"></div><span>שע"ן 125%</span><span class="dv-val">'+pr.ot1.toFixed(2)+'ש\'</span></div>';
    if(pr.ot2>0)html+='<div class="dv-detail"><div class="dv-dot" style="background:var(--b7)"></div><span>שע"ן 150%</span><span class="dv-val">'+pr.ot2.toFixed(2)+'ש\'</span></div>';
    // בונוסים
    var bons=data[k].bonuses||[];
    bons.forEach(function(b){
      if(!b||!b.amount)return;
      html+='<div class="dv-detail"><div class="dv-dot" style="background:var(--g)"></div><span>'+(b.name||'בונוס')+'</span><span class="dv-val">₪'+Math.round(b.amount).toLocaleString('he-IL')+'</span></div>';
    });
    // הערה
    if(data[k].note)html+='<div class="dv-detail"><div class="dv-dot" style="background:var(--t3)"></div><span>'+data[k].note+'</span></div>';
    // כפתור עריכה
    html+='<div style="text-align:center;margin-top:10px"><button onclick="openDay(\''+k+'\')" style="padding:6px 16px;border-radius:8px;border:1px solid var(--b1);background:var(--b0);color:var(--b6);font-size:11px;cursor:pointer">עריכה</button></div>';
  }
  html+='</div>';

  var existing=document.getElementById('calDayBody');
  if(existing)existing.remove();
  var div=document.createElement('div');
  div.id='calDayBody';
  div.innerHTML=html;
  body.appendChild(div);
}

function goToday(){vib();curDt=new Date();renderCal();}
function jumpDate(){const v=document.getElementById('jDate').value;if(v){curDt=new Date(v);renderCal();}}
function updHdrSub(){
  const data=D.g(),s=D.gs();
  const mk=`${curDt.getFullYear()}-${String(curDt.getMonth()+1).padStart(2,'0')}`;
  const now=new Date();
  const isCurrentMonth=mk===`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  let h=0,p=0;
  Object.keys(data).forEach(k=>{if(k.startsWith(mk)){const _pr=cpDay(data[k]);h+=_pr.allHours;p+=_pr.total;}});
  if(isCurrentMonth)(s.jobs||[]).forEach(j=>p+=parseFloat(j.fixed)||0);
  const label=isCurrentMonth?'החודש':`${MN[curDt.getMonth()]} ${curDt.getFullYear()}`;
  document.getElementById('hdrSub').textContent=`${label}: ${h.toFixed(1)} ש' | ₪${Math.round(p).toLocaleString('he-IL')}`;
}
