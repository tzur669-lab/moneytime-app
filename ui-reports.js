// ---- REPORTS ----
function selPer(btn){vib();document.querySelectorAll('.pill').forEach(b=>b.classList.remove('active'));btn.classList.add('active');per=btn.dataset.p;document.getElementById('custPRow').style.display=per==='custom'?'block':'none';if(per!=='custom')updRep();}
function switchRTab(tab,btn){
  vib();
  document.querySelectorAll('.rtab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  rTab=tab;
  const pillsEl=document.querySelector('.pills');
  const custRow=document.getElementById('custPRow');
  const noPills=['cmp','arc','year'];
  if(pillsEl) pillsEl.style.display=noPills.includes(tab)?'none':'flex';
  if(custRow&&noPills.includes(tab)) custRow.style.display='none';
  updRep();
}
function updRep(){
  if(!document.getElementById('pg-rep').classList.contains('active'))return;
  const cont=document.getElementById('repContent');
  const noDateTabs=['cmp','arc','year'];
  if(noDateTabs.includes(rTab)){
    if(rTab==='cmp')renderCmp(cont);
    else if(rTab==='arc')renderArc(cont);
    else if(rTab==='year')renderYear(cont);
    return;
  }
  const dates=getPerDts(per);if(!dates.length)return;
  if(rTab==='gen')renderGen(dates,cont);
  else if(rTab==='jobs')renderJobs(dates,cont);
}

function getStyleTheme(){return D.gs().styleTheme||'default';}
function makeBarGradient(ctx,chartArea,c1,c2){const g=ctx.createLinearGradient(0,chartArea.bottom,0,chartArea.top);g.addColorStop(0,c1);g.addColorStop(1,c2);return g;}
function barColor(fallback){const st=getStyleTheme();if(st==='glass')return'rgba(0,229,255,0.55)';if(st==='minimal')return'#A78BFA';if(st==='gradient')return function(ctx){const{chart}=ctx;const{ctx:c,chartArea:a}=chart;if(!a)return'#7C3AED';return makeBarGradient(c,a,'#C026D3','#7C3AED');};return fallback||'#2563EB';}
function barColorArray(vals,maxI,normFb,highFb){const st=getStyleTheme();if(st==='glass')return vals.map((_,i)=>i===maxI?'rgba(0,229,255,0.95)':'rgba(0,229,255,0.5)');if(st==='minimal')return vals.map((_,i)=>i===maxI?'#7C3AED':'#A78BFA');if(st==='gradient')return vals.map((_,i)=>i===maxI?'#C026D3':'#8B5CF6');return vals.map((_,i)=>i===maxI?(highFb||'#10B981'):(normFb||'#2563EB'));}
function jobBarColors(jobs){const st=getStyleTheme();if(st==='glass')return jobs.map(()=>'rgba(0,229,255,0.55)');if(st==='minimal')return jobs.map(()=>'#A78BFA');if(st==='gradient')return function(ctx){const{chart}=ctx;const{ctx:c,chartArea:a}=chart;if(!a)return'#7C3AED';return makeBarGradient(c,a,'#C026D3','#7C3AED');};return jobs.map(j=>j.color);}
function lineColor(){const st=getStyleTheme();if(st==='glass')return'#00E5FF';if(st==='minimal')return'#7C3AED';if(st==='gradient')return'#A855F7';return'#10B981';}
function lineFill(){const st=getStyleTheme();if(st==='glass')return'rgba(0,229,255,0.12)';if(st==='minimal')return'rgba(124,58,237,0.10)';if(st==='gradient')return'rgba(168,85,247,0.12)';return'rgba(16,185,129,.1)';}
function barRadius(){return getStyleTheme()==='minimal'?12:6;}
function pbarStyle(color){const st=getStyleTheme();if(st==='glass')return'background:linear-gradient(90deg,#00B8D4,#00E5FF)';if(st==='minimal')return'background:linear-gradient(90deg,#7C3AED,#A78BFA)';if(st==='gradient')return'background:linear-gradient(90deg,#7C3AED,#C026D3)';return'background:'+color;}

const cOpts=dk=>{const st=getStyleTheme();if(st==='glass')return{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'rgba(8,14,30,0.85)',titleColor:'#00E5FF',bodyColor:'#94A3B8',borderColor:'rgba(0,229,255,0.35)',borderWidth:1,padding:10,cornerRadius:10}},scales:{x:{grid:{color:'rgba(0,229,255,0.07)',borderColor:'transparent'},ticks:{color:'#475569',font:{size:9,family:'Inter'},maxRotation:0}},y:{grid:{color:'rgba(0,229,255,0.07)',lineWidth:0.5},border:{dash:[3,3],color:'transparent'},ticks:{color:'#475569',font:{size:9,family:'Inter'}}}}};if(st==='minimal')return{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#fff',titleColor:'#1E1B4B',bodyColor:'#6B7280',borderColor:'rgba(167,139,250,0.3)',borderWidth:1,padding:10,cornerRadius:12}},scales:{x:{grid:{display:false},border:{display:false},ticks:{color:'#9CA3AF',font:{size:9,family:'Inter'},maxRotation:0}},y:{grid:{display:false},border:{display:false},ticks:{color:'#9CA3AF',font:{size:9,family:'Inter'}}}}};if(st==='gradient')return{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#4F1F9B',titleColor:'#fff',bodyColor:'rgba(255,255,255,0.8)',borderColor:'rgba(192,38,211,0.4)',borderWidth:1,padding:10,cornerRadius:10}},scales:{x:{grid:{color:'rgba(79,31,155,0.07)',borderColor:'transparent'},ticks:{color:'#64748B',font:{size:9,family:'Inter'},maxRotation:0}},y:{grid:{color:'rgba(79,31,155,0.07)',lineWidth:0.5},border:{dash:[3,3],color:'transparent'},ticks:{color:'#64748B',font:{size:9,family:'Inter'}}}}};return{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'transparent',borderColor:'transparent'},ticks:{color:dk?'#475569':'#94A3B8',font:{size:9,family:'Inter'},maxRotation:0}},y:{grid:{color:dk?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.04)',lineWidth:0.5},border:{dash:[3,3],color:'transparent'},ticks:{color:dk?'#475569':'#94A3B8',font:{size:9,family:'Inter'}}}}};};
function applyChartMods(opts){opts.animation={duration:800,easing:'easeInOutQuart'};if(!opts.plugins)opts.plugins={};if(!opts.plugins.tooltip)opts.plugins.tooltip={};opts.plugins.tooltip.callbacks={label:ctx=>{const v=ctx.parsed.y;if(v==null||isNaN(v))return ctx.formattedValue;return' ₪'+Math.round(v).toLocaleString('he-IL');}};return opts;}

function getPrevDates(dates){if(!dates.length)return[];const span=dates.length;const first=new Date(dates[0]);first.setDate(first.getDate()-span);return Array.from({length:span},(_,i)=>{const d=new Date(first);d.setDate(first.getDate()+i);return d;});}

function renderGen(dates,cont){
  const data=D.g();let th=0,tp=0;const lb=[],hd=[],pd2=[];
  dates.forEach(d=>{const k=fk(d);lb.push(`${d.getDate()}/${d.getMonth()+1}`);if(data[k]){const pr=cpDay(data[k]);th+=pr.allHours;tp+=pr.total;hd.push(pr.allHours);pd2.push(pr.total);}else{hd.push(0);pd2.push(0);}});
  const aH=dates.length?th/dates.length:0,aP=dates.length?tp/dates.length:0;
  const bestDayVal=Math.max(...pd2,0);const bestDayIdx=pd2.indexOf(bestDayVal);const bestDayLbl=bestDayIdx>=0&&bestDayVal>0?lb[bestDayIdx]:'-';const daysWorked=hd.filter(h=>h>0).length;const projMonthly=Math.round(aP*22);
  const dk=document.body.getAttribute('data-theme')==='dark';
  const ct=D.gs().chartType||'bar';
  const prevDts=getPrevDates(dates);let prevTp=0,prevTh=0;
  prevDts.forEach(d=>{const k=fk(d);if(data[k]){const pr=cpDay(data[k]);prevTp+=pr.total;prevTh+=pr.allHours;}});
  const trendP=prevTp>0?Math.round((tp-prevTp)/prevTp*100):null;
  const trendH=prevTh>0?Math.round((th-prevTh)/prevTh*100):null;
  const tBadge=t=>t===null?'':
    `<div style="font-size:10px;color:${t>=0?'var(--g)':'var(--r)'};margin-top:3px;font-weight:300">${t>=0?'▲':'▼'} ${Math.abs(t)}% לעומת הקודם</div>`;
  const chartCards=ct==='pie'?`
  <div class="card">
    <div class="csummary"><span>פילוח הכנסות לפי ימים</span><span style="color:var(--g)">סה"כ: <strong>₪${Math.round(tp).toLocaleString('he-IL')}</strong></span></div>
    <div class="cwrap" style="height:220px"><canvas id="hCh"></canvas></div>
    <div id="genPieLeg" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;justify-content:center"></div>
  </div>
  <div class="card">
    <div class="csummary"><span>שעות יומיות</span><span>ממוצע: <strong>${aH.toFixed(1)} ש'/יום</strong></span></div>
    <div class="cwrap"><canvas id="pCh"></canvas></div>
  </div>`:`
  <div class="card">
    <div class="csummary"><span>סה"כ: <strong>${th.toFixed(1)} ש'</strong></span><span>ממוצע: <strong>${aH.toFixed(1)} ש'/יום</strong></span></div>
    <div class="cwrap"><canvas id="hCh"></canvas></div>
  </div>
  <div class="card">
    <div class="csummary"><span>סה"כ: <strong>₪${Math.round(tp).toLocaleString('he-IL')}</strong></span><span>ממוצע: <strong>₪${Math.round(aP).toLocaleString('he-IL')}/יום</strong></span></div>
    <div class="cwrap"><canvas id="pCh"></canvas></div>
  </div>`;
  cont.innerHTML=`
  <div class="stats-row">
    <div class="scard"><div class="slbl">סה"כ שעות</div><div class="sval b">${th.toFixed(1)}</div>${tBadge(trendH)}</div>
    <div class="scard"><div class="slbl">סה"כ הכנסה</div><div class="sval g">₪${Math.round(tp).toLocaleString('he-IL')}</div>${tBadge(trendP)}</div>
  </div>
  <div class="insight-row">
    <div class="insight-chip"><div class="insight-val">${bestDayLbl}</div><div class="insight-lbl">יום שיא</div></div>
    <div class="insight-chip"><div class="insight-val">${daysWorked}</div><div class="insight-lbl">ימי עבודה</div></div>
    <div class="insight-chip"><div class="insight-val">₪${projMonthly.toLocaleString('he-IL')}</div><div class="insight-lbl">חיזוי חודשי</div></div>
  </div>
  ${chartCards}`;
  cont.querySelectorAll('.sval').forEach(el=>{const raw=el.textContent.replace(/[^\d.]/g,'');const target=parseFloat(raw);if(!target||isNaN(target))return;const prefix=el.textContent.includes('₪')?'₪':'';const suffix=el.textContent.includes("'")?` ש'`:'';let startTime=null;const dur=600;const step=ts=>{if(!el.isConnected)return;if(!startTime)startTime=ts;const p=Math.min((ts-startTime)/dur,1);el.textContent=prefix+Math.round(p*target).toLocaleString('he-IL')+suffix;if(p<1)requestAnimationFrame(step);};requestAnimationFrame(step);});
  if(hCh)hCh.destroy();if(pCh)pCh.destroy();
  const hEl=document.getElementById('hCh'),pEl=document.getElementById('pCh');
  const _PIE_COLS=['#2563EB','#10B981','#F59E0B','#8B5CF6','#EF4444','#06B6D4','#EC4899','#84CC16','#F97316'];
  if(ct==='pie'){
    const nzIdx=pd2.map((v,i)=>v>0?i:-1).filter(i=>i>=0);
    const pLb=nzIdx.map(i=>lb[i]);const pVl=nzIdx.map(i=>Math.round(pd2[i]));const pCl=nzIdx.map((_,i)=>_PIE_COLS[i%_PIE_COLS.length]);
    const tot=pVl.reduce((a,b)=>a+b,0);
    if(hEl)hCh=new Chart(hEl,{type:'doughnut',data:{labels:pLb,datasets:[{data:pVl,backgroundColor:pCl,borderWidth:0,hoverOffset:8}]},options:{responsive:true,maintainAspectRatio:false,animation:{duration:800,easing:'easeInOutQuart'},plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>{const v=ctx.parsed;const pct=tot>0?Math.round(v/tot*100):0;return` ₪${Math.round(v).toLocaleString('he-IL')} (${pct}%)`;}}}}}});
    const legEl=document.getElementById('genPieLeg');
    if(legEl)legEl.innerHTML=pLb.map((l,i)=>`<div style="display:flex;align-items:center;gap:4px;font-size:10px;color:var(--t2)"><div style="width:8px;height:8px;border-radius:50%;background:${pCl[i]};flex-shrink:0"></div><span>${l}</span></div>`).join('');
    if(pEl)pCh=new Chart(pEl,{type:'bar',data:{labels:lb,datasets:[{data:hd,backgroundColor:barColor('#2563EB'),borderRadius:barRadius(),borderSkipped:false,borderWidth:0}]},options:applyChartMods(cOpts(dk))});
  } else if(ct==='line'){
    if(hEl)hCh=new Chart(hEl,{type:'line',data:{labels:lb,datasets:[{data:hd,borderColor:lineColor(),backgroundColor:'transparent',tension:0.4,pointRadius:3,pointBackgroundColor:lineColor(),pointHoverRadius:6,pointHoverBackgroundColor:lineColor()}]},options:applyChartMods(cOpts(dk))});
    if(pEl)pCh=new Chart(pEl,{type:'line',data:{labels:lb,datasets:[{data:pd2,borderColor:lineColor(),backgroundColor:'transparent',tension:0.4,pointRadius:3,pointBackgroundColor:lineColor(),pointHoverRadius:6,pointHoverBackgroundColor:lineColor()}]},options:applyChartMods(cOpts(dk))});
  } else if(ct==='area'){
    if(hEl)hCh=new Chart(hEl,{type:'line',data:{labels:lb,datasets:[{data:hd,borderColor:lineColor(),backgroundColor:lineFill(),fill:true,tension:0.4,pointRadius:3,pointBackgroundColor:lineColor(),pointHoverRadius:6,pointHoverBackgroundColor:lineColor()}]},options:applyChartMods(cOpts(dk))});
    if(pEl)pCh=new Chart(pEl,{type:'line',data:{labels:lb,datasets:[{data:pd2,borderColor:lineColor(),backgroundColor:lineFill(),fill:true,tension:0.4,pointRadius:3,pointBackgroundColor:lineColor(),pointHoverRadius:6,pointHoverBackgroundColor:lineColor()}]},options:applyChartMods(cOpts(dk))});
  } else {
    if(hEl)hCh=new Chart(hEl,{type:'bar',data:{labels:lb,datasets:[{data:hd,backgroundColor:barColor('#2563EB'),borderRadius:barRadius(),borderSkipped:false,borderWidth:0}]},options:applyChartMods(cOpts(dk))});
    if(pEl)pCh=new Chart(pEl,{type:'line',data:{labels:lb,datasets:[{data:pd2,borderColor:lineColor(),backgroundColor:lineFill(),fill:true,tension:0.4,pointRadius:3,pointBackgroundColor:lineColor(),pointHoverRadius:6,pointHoverBackgroundColor:lineColor()}]},options:applyChartMods(cOpts(dk))});
  }
}

function renderJobs(dates,cont){
  const data=D.g(),s=D.gs(),jobs=s.jobs||[];
  const st=jobs.map(()=>({h:0,p:0}));let total=0;
  dates.forEach(d=>{const k=fk(d);if((data[k]?.hours||0)>0){const ji=data[k].jobIdx??0;if(st[ji]){const pr=cpDay(data[k]);st[ji].h+=pr.allHours;st[ji].p+=pr.total;total+=pr.total;}(data[k].extraJobs||[]).forEach(ej=>{const eji=ej.jobIdx??0;if(st[eji]){const er=cpExtra(ej.hours||0,ej.rate||0);st[eji].h+=ej.hours||0;st[eji].p+=er.base;total+=er.base;}});}});
  jobs.forEach((j,i)=>{const f=parseFloat(j.fixed)||0;if(f>0){st[i].p+=f;total+=f;}});
  const maxI=st.reduce((mx,_,i)=>st[i].p>(st[mx]?.p||0)?i:mx,0);
  const bestJobName=jobs.length>0&&total>0?jobs[maxI].name:'—';
  const totalDaysWorked=dates.filter(d=>{const k=fk(d);return(data[k]?.hours||0)>0;}).length;
  const avgDaily=totalDaysWorked>0?('₪'+Math.round(total/totalDaysWorked).toLocaleString('he-IL')):'—';
  const dk=document.body.getAttribute('data-theme')==='dark';
  let html=`<div class="stats-row"><div class="scard"><div class="slbl">סה"כ הכנסה</div><div class="sval g">₪${Math.round(total).toLocaleString('he-IL')}</div></div></div>`;
  html+=`<div class="insight-row"><div class="insight-chip"><div class="insight-val">${bestJobName}</div><div class="insight-lbl">מוביל</div></div><div class="insight-chip"><div class="insight-val">${totalDaysWorked}</div><div class="insight-lbl">ימי עבודה</div></div><div class="insight-chip"><div class="insight-val">${avgDaily}</div><div class="insight-lbl">ממוצע יומי</div></div></div>`;
  jobs.forEach((j,i)=>{
    const pct=total>0?Math.round(st[i].p/total*100):0;
    html+=`<div class="card" style="border-right:4px solid ${j.color}"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><div style="font-size:14px;font-weight:400">${j.name}</div>${i===maxI&&total>0?'<span style="background:var(--gl);color:var(--g);padding:3px 8px;border-radius:20px;font-size:11px;font-weight:300">★ מוביל</span>':''}</div>
    <div style="display:flex;gap:20px;margin-bottom:10px">
      <div><div class="slbl">שעות</div><div style="font-size:18px;font-weight:200;color:${j.color}">${st[i].h.toFixed(1)}</div></div>
      <div><div class="slbl">הכנסה</div><div style="font-size:20px;font-weight:300;color:var(--g)">₪${Math.round(st[i].p).toLocaleString('he-IL')}</div></div>
      <div><div class="slbl">% מסה"כ</div><div style="font-size:18px;font-weight:200;color:var(--t2)">${pct}%</div></div>
    </div>
    <div class="pbar-wrap"><div class="pbar-fill" style="width:${pct}%;${pbarStyle(j.color)}"></div></div></div>`;
  });
  html+=`<div class="card"><div class="csummary"><span>השוואה בין מקומות העבודה</span></div><div class="cwrap"><canvas id="jCh"></canvas></div></div>`;
  html+=`<div class="card"><div class="csummary"><span>פילוח הכנסות</span></div><div class="cwrap" style="height:220px"><canvas id="jobPieCh"></canvas></div><div id="jobPieLegend" style="display:flex;flex-wrap:wrap;gap:10px;margin-top:10px;justify-content:center;padding:0 4px"></div></div>`;
  cont.innerHTML=html;
  cont.querySelectorAll('.sval').forEach(el=>{const raw=el.textContent.replace(/[^\d.]/g,'');const target=parseFloat(raw);if(!target||isNaN(target))return;const prefix=el.textContent.includes('₪')?'₪':'';const suffix=el.textContent.includes("'")?` ש'`:'';let startTime=null;const dur=600;const step=ts=>{if(!el.isConnected)return;if(!startTime)startTime=ts;const p=Math.min((ts-startTime)/dur,1);el.textContent=prefix+Math.round(p*target).toLocaleString('he-IL')+suffix;if(p<1)requestAnimationFrame(step);};requestAnimationFrame(step);});
  if(jCh)jCh.destroy();
  jCh=new Chart(document.getElementById('jCh'),{type:'bar',data:{labels:jobs.map(j=>j.name),datasets:[{data:st.map(x=>Math.round(x.p)),backgroundColor:jobBarColors(jobs),borderRadius:barRadius(),borderSkipped:false,borderWidth:0}]},options:applyChartMods(cOpts(dk))});
  if(window.jobPieCh)window.jobPieCh.destroy();
  const pieCv=document.getElementById('jobPieCh');
  if(pieCv)window.jobPieCh=new Chart(pieCv,{type:'doughnut',data:{labels:jobs.map(j=>j.name),datasets:[{data:st.map(x=>Math.round(x.p)),backgroundColor:jobs.map(j=>j.color),borderWidth:0,hoverOffset:8}]},options:{responsive:true,maintainAspectRatio:false,animation:{duration:800,easing:'easeInOutQuart'},plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>{const v=ctx.parsed;const pct=total>0?Math.round(v/total*100):0;return` ₪${Math.round(v).toLocaleString('he-IL')} (${pct}%)`;}}}}}});
  const legEl=document.getElementById('jobPieLegend');
  if(legEl)legEl.innerHTML=jobs.map((j,i)=>`<div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--t2)"><div style="width:10px;height:10px;border-radius:50%;background:${j.color};flex-shrink:0"></div><span>${j.name}: ${total>0?Math.round(st[i].p/total*100):0}%</span></div>`).join('');
}

function renderCmp(cont,mode,p1,p2,p3){
  // mode: 'months'|'weeks'|'custom'
  // p1: selMonth(int), p2: selYear(str), p3: customMonths(JSON)
  const data=D.g(),dk=document.body.getAttribute('data-theme')==='dark',now=new Date();
  mode=mode||'months';
  const selMonth=p1!=null?parseInt(p1):now.getMonth();
  const selYear=p2||String(now.getFullYear());
  let cmpM=[];try{cmpM=JSON.parse(p3||'[]');}catch(e){}
  const allYears=[];for(let y=now.getFullYear();y>=2015;y--)allYears.push(String(y));
  const monthOpts=MN.map((m,i)=>`<option value="${i}"${i===selMonth?' selected':''}>${m}</option>`).join('');
  const yearOpts=allYears.map(y=>`<option value="${y}"${y===selYear?' selected':''}>${y}</option>`).join('');
  const cmpMStr=JSON.stringify(cmpM);
  const encCmpM=encodeURIComponent(cmpMStr);
  const picker=`<div class="card" style="padding:12px 14px;margin-bottom:10px">
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
      <button class="pill${mode==='months'?' active':''}" onclick="renderCmp(document.getElementById('repContent'),'months',${selMonth},'${selYear}','${cmpMStr}')">חודשים</button>
      <button class="pill${mode==='weeks'?' active':''}" onclick="renderCmp(document.getElementById('repContent'),'weeks',${selMonth},'${selYear}','${cmpMStr}')">שבועות בחודש</button>
      <button class="pill${mode==='custom'?' active':''}" onclick="renderCmp(document.getElementById('repContent'),'custom',${selMonth},'${selYear}','${cmpMStr}')">בחירה חופשית</button>
    </div>
    ${mode==='weeks'?`<div style="display:flex;gap:8px">
      <select onchange="renderCmp(document.getElementById('repContent'),'weeks',this.value,'${selYear}','${cmpMStr}')" style="flex:1;padding:7px;border-radius:8px;border:1px solid var(--bd);background:var(--s);color:var(--t);font-size:13px">${monthOpts}</select>
      <select onchange="renderCmp(document.getElementById('repContent'),'weeks',${selMonth},this.value,'${cmpMStr}')" style="flex:1;padding:7px;border-radius:8px;border:1px solid var(--bd);background:var(--s);color:var(--t);font-size:13px">${yearOpts}</select>
    </div>`:''}
    ${mode==='custom'?`<div><div style="font-size:11px;color:var(--t3);margin-bottom:6px">בחר חודשים:</div>
      <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px">${MN.map((m,i)=>{const sel=cmpM.includes(i);return`<button onclick="(function(){var cm=${cmpMStr};var ix=cm.indexOf(${i});if(ix>=0)cm.splice(ix,1);else cm.push(${i});renderCmp(document.getElementById('repContent'),'custom',${selMonth},'${selYear}',JSON.stringify(cm));})();return false" style="padding:4px 8px;border-radius:20px;border:1px solid var(--bd);background:${sel?'var(--b8)':'var(--s2)'};color:${sel?'#fff':'var(--t)'};font-size:11px;cursor:pointer">${m}</button>`;}).join('')}</div>
      <select onchange="renderCmp(document.getElementById('repContent'),'custom',${selMonth},this.value,'${cmpMStr}')" style="width:100%;padding:7px;border-radius:8px;border:1px solid var(--bd);background:var(--s);color:var(--t);font-size:13px">${yearOpts}</select>
    </div>`:''}
  </div>`;
  let lb=[],vals=[];
  if(mode==='months'){
    const groups={};
    Object.keys(data).forEach(k=>{const day=data[k],pr=cpDay(day),mk=k.substring(0,7);groups[mk]=(groups[mk]||0)+pr.total;});
    const sorted=Object.keys(groups).sort();
    lb=sorted.map(mk=>{const[y,m]=mk.split('-');return`${MN[parseInt(m)-1]} ${y.slice(2)}`;});
    vals=sorted.map(mk=>Math.round(groups[mk]));
  } else if(mode==='weeks'){
    const yr=parseInt(selYear),m=selMonth;
    const days=new Date(yr,m+1,0).getDate();
    const weeks=[{l:'שבוע 1',p:0},{l:'שבוע 2',p:0},{l:'שבוע 3',p:0},{l:'שבוע 4',p:0},{l:'שבוע 5',p:0}];
    for(let day=1;day<=days;day++){
      const k=`${yr}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      if(data[k]) weeks[Math.min(Math.floor((day-1)/7),4)].p+=cpDay(data[k]).total;
    }
    const actW=weeks.filter(w=>w.p>0);
    lb=(actW.length?actW:weeks.slice(0,4)).map(w=>w.l);
    vals=(actW.length?actW:weeks.slice(0,4)).map(w=>Math.round(w.p));
  } else if(mode==='custom'){
    if(!cmpM.length){if(cmpCh){cmpCh.destroy();cmpCh=null;}cont.innerHTML=picker+`<div class="card"><div class="empty"><div class="empty-ttl">בחר חודשים להשוואה</div></div></div>`;return;}
    const yr=parseInt(selYear);
    [...cmpM].sort((a,b)=>a-b).forEach(m=>{
      let tot=0;const days=new Date(yr,m+1,0).getDate();
      for(let day=1;day<=days;day++){const k=`${yr}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;if(data[k])tot+=cpDay(data[k]).total;}
      lb.push(`${MN[m]} ${selYear}`);vals.push(Math.round(tot));
    });
  }
  const maxV=Math.max(...vals,0),maxI=vals.indexOf(maxV);
  const titleTxt=mode==='weeks'?`שבועות — ${MN[selMonth]} ${selYear}`:mode==='custom'?`השוואה — ${selYear}`:'השוואת חודשים';
  cont.innerHTML=picker+`<div class="card"><div class="csummary"><span>${titleTxt}</span><span style="color:var(--g)">גבוה: <strong>${lb[maxI]||'-'} — ₪${maxV.toLocaleString('he-IL')}</strong></span></div><div class="cwrap"><canvas id="cmpCh"></canvas></div></div>`;
  if(cmpCh)cmpCh.destroy();
  const cmpCt=D.gs().chartType||'bar';
  const cmpEl=document.getElementById('cmpCh');
  if(cmpCt==='pie'){
    const _PC=['#2563EB','#10B981','#F59E0B','#8B5CF6','#EF4444','#06B6D4','#EC4899','#84CC16'];
    const tot=vals.reduce((a,b)=>a+b,0);
    cmpCh=new Chart(cmpEl,{type:'doughnut',data:{labels:lb,datasets:[{data:vals,backgroundColor:_PC.slice(0,vals.length),borderWidth:0,hoverOffset:8}]},options:{responsive:true,maintainAspectRatio:false,animation:{duration:800,easing:'easeInOutQuart'},plugins:{legend:{display:true,position:'bottom',labels:{font:{size:10,family:'Inter'},boxWidth:10,padding:8}},tooltip:{callbacks:{label:ctx=>{const v=ctx.parsed;const pct=tot>0?Math.round(v/tot*100):0;return` ₪${Math.round(v).toLocaleString('he-IL')} (${pct}%)`;}}}}}});
  } else if(cmpCt==='line'||cmpCt==='area'){
    cmpCh=new Chart(cmpEl,{type:'line',data:{labels:lb,datasets:[{data:vals,borderColor:lineColor(),backgroundColor:cmpCt==='area'?lineFill():'transparent',fill:cmpCt==='area',tension:0.4,pointRadius:4,pointBackgroundColor:lineColor(),pointHoverRadius:6,pointHoverBackgroundColor:lineColor()}]},options:applyChartMods(cOpts(dk))});
  } else {
    cmpCh=new Chart(cmpEl,{type:'bar',data:{labels:lb,datasets:[{data:vals,backgroundColor:barColorArray(vals,maxI,'#2563EB','#10B981'),borderRadius:barRadius(),borderSkipped:false,borderWidth:0}]},options:applyChartMods(cOpts(dk))});
  }
}

function renderArc(cont,selYear,selMonth){
  const data=D.g(),s=D.gs(),now=new Date();
  const allYears=[];
  for(let y=now.getFullYear();y>=2015;y--)allYears.push(String(y));
  const dataYears=new Set(Object.keys(data).map(k=>k.substring(0,4)));
  // months map
  const months={};
  Object.keys(data).forEach(k=>{
    const mk=k.substring(0,7),day=data[k],pr=cpDay(day);
    if(!months[mk])months[mk]={h:0,p:0,days:0};
    months[mk].h+=pr.allHours; months[mk].p+=pr.total; months[mk].days++;
  });
  (s.jobs||[]).forEach(j=>{const f=parseFloat(j.fixed)||0;if(f>0)Object.keys(months).forEach(mk=>months[mk].p+=f);});
  // ברירת מחדל: השנה הנוכחית שיש בה נתונים
  const availYears=allYears.filter(y=>dataYears.has(y));
  const curY=selYear||(availYears[0]||String(now.getFullYear()));
  const showAll=curY==='all';
  const yearOpts=['<option value="all"'+(showAll?' selected':'')+'>הכל (כל השנים)</option>']
    .concat(allYears.map(y=>`<option value="${y}"${y===curY?' selected':''}>${y}${dataYears.has(y)?' ✓':''}</option>`)).join('');
  const yearPicker=`<div style="display:flex;gap:8px;align-items:center;margin-bottom:12px">
    <label style="font-size:12px;font-weight:500;color:var(--t2);white-space:nowrap">שנה:</label>
    <select onchange="renderArc(document.getElementById('repContent'),this.value,null)" style="flex:1;padding:7px 10px;border-radius:8px;border:1px solid var(--bd);background:var(--s);color:var(--t);font-size:13px">${yearOpts}</select>
  </div>`;
  const sorted=Object.keys(months).sort().reverse().filter(mk=>showAll||mk.startsWith(curY));
  if(!sorted.length){
    cont.innerHTML=yearPicker+`<div class="card"><div class="empty"><div class="empty-ico" style="font-size:0"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div><div class="empty-ttl">אין נתונים עדיין</div></div></div>`;
    return;
  }
  // אם נבחר חודש ספציפי → תצוגת שבועות
  if(selMonth!=null){
    const [yStr,mStr]=selMonth.split('-');
    const yr=parseInt(yStr),m=parseInt(mStr)-1;
    const days=new Date(yr,m+1,0).getDate();
    const weeks=[{l:'שבוע 1',h:0,p:0},{l:'שבוע 2',h:0,p:0},{l:'שבוע 3',h:0,p:0},{l:'שבוע 4',h:0,p:0},{l:'שבוע 5',h:0,p:0}];
    for(let day=1;day<=days;day++){
      const k=`${yStr}-${mStr}-${String(day).padStart(2,'0')}`;
      if(data[k]){const pr=cpDay(data[k]);const wi=Math.min(Math.floor((day-1)/7),4);weeks[wi].h+=pr.allHours;weeks[wi].p+=pr.total;}
    }
    const dk=document.body.getAttribute('data-theme')==='dark';
    const mkTotal=months[selMonth]||{p:1};
    const backBtn=`<div style="cursor:pointer;display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--b6);margin-bottom:12px" onclick="renderArc(document.getElementById('repContent'),'${curY}',null)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15,18 9,12 15,6"/></svg> חזרה ל-${curY}</div>`;
    let wHtml=`<div class="card" style="margin-bottom:12px"><div style="font-size:14px;font-weight:400;margin-bottom:12px">${MN[m]} ${yStr} — שבועות</div>`;
    weeks.forEach((w,i)=>{
      if(i>=4&&w.h===0)return;
      const pct=mkTotal.p>0?Math.round(w.p/mkTotal.p*100):0;
      wHtml+=`<div class="arc-row"><div style="flex:1"><div class="arc-m">${w.l}</div><div class="pbar-wrap" style="margin-top:4px;height:4px"><div class="pbar-fill" style="width:${pct}%;${pbarStyle('var(--b6)')}"></div></div></div><div class="arc-h">${w.h.toFixed(1)} ש'</div><div class="arc-p">₪${Math.round(w.p).toLocaleString('he-IL')}</div></div>`;
    });
    wHtml+=`</div><div class="card"><div class="cwrap" style="height:160px"><canvas id="arcWeekCh"></canvas></div></div>`;
    cont.innerHTML=yearPicker+backBtn+wHtml;
    const actW=weeks.filter((w,i)=>i<4||w.h>0);
    if(window._arcWeekCh){try{window._arcWeekCh.destroy();}catch(e){}}
    const cv=document.getElementById('arcWeekCh');
    if(cv)window._arcWeekCh=new Chart(cv,{type:'bar',data:{labels:actW.map(w=>w.l),datasets:[{data:actW.map(w=>Math.round(w.p)),backgroundColor:barColor('#2563EB'),borderRadius:barRadius(),borderSkipped:false,borderWidth:0}]},options:{...cOpts(dk),animation:{duration:800,easing:'easeInOutQuart'},plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>{const v=ctx.parsed.y;if(v==null||isNaN(v))return ctx.formattedValue;return' ₪'+Math.round(v).toLocaleString('he-IL');}}}}}});
    return;
  }
  // תצוגה ראשית: כרטיסי שנה (רק ב-showAll) + רשימת חודשים
  const years={};
  sorted.forEach(mk=>{const y=mk.substring(0,4);if(!years[y])years[y]={h:0,p:0,months:0,best:{p:0,mk:''}};years[y].h+=months[mk].h;years[y].p+=months[mk].p;years[y].months++;if(months[mk].p>years[y].best.p)years[y].best={p:months[mk].p,mk};});
  let html=yearPicker;
  if(showAll){
    Object.keys(years).sort().reverse().forEach(y=>{
      const yr=years[y],avgM=yr.months>0?Math.round(yr.p/yr.months):0;
      const [bY,bM]=(yr.best.mk||'-').split('-');
      html+=`<div class="card" style="margin-bottom:12px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
          <div style="font-size:16px;font-weight:300">${y}</div>
          <div style="background:var(--b1);color:var(--b8);padding:4px 12px;border-radius:20px;font-size:12px;font-weight:400">${yr.months} חודשים</div>
        </div>
        <div class="stats-row" style="margin-bottom:12px">
          <div class="scard"><div class="slbl">סה"כ שעות</div><div class="sval b">${yr.h.toFixed(0)}</div></div>
          <div class="scard"><div class="slbl">סה"כ הכנסה</div><div class="sval g">₪${Math.round(yr.p).toLocaleString('he-IL')}</div></div>
        </div>
        <div class="stats-row" style="margin-bottom:8px">
          <div class="scard"><div class="slbl">ממוצע חודשי</div><div class="sval" style="color:var(--b6)">₪${avgM.toLocaleString('he-IL')}</div></div>
          <div class="scard"><div class="slbl">🏆 חודש שיא</div><div class="sval" style="font-size:14px;color:var(--am)">${bM?MN[parseInt(bM)-1]:'—'}</div></div>
        </div>
      </div>`;
    });
  }
  const maxP=Math.max(...sorted.map(mk=>months[mk].p),1);
  html+=`<div class="card"><div style="font-size:13px;font-weight:400;color:var(--t2);margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--bd)">ארכיון חודשי — לחץ לפירוט שבועי</div>`;
  sorted.forEach(mk=>{
    const[y,m]=mk.split('-');const pct=Math.round(months[mk].p/maxP*100);
    html+=`<div class="arc-row" style="cursor:pointer" onclick="renderArc(document.getElementById('repContent'),'${curY}','${mk}')">
      <div style="flex:1"><div class="arc-m" style="color:var(--b8)">${MN[parseInt(m)-1]} ${y} <span style="font-size:10px;color:var(--t3)">▸</span></div>
        <div class="pbar-wrap" style="margin-top:4px;height:4px"><div class="pbar-fill" style="width:${pct}%;${pbarStyle('var(--b6)')}"></div></div>
      </div>
      <div class="arc-h">${months[mk].h.toFixed(1)} ש'</div>
      <div class="arc-p">₪${Math.round(months[mk].p).toLocaleString('he-IL')}</div>
    </div>`;
  });
  html+=`</div>`;
  cont.innerHTML=html;
}

// ---- YEARLY STATS ----
function renderYear(cont,selectedYear){
  const data=D.g();
  const now=new Date();
  const thisYear=now.getFullYear();
  const allYears=[];
  for(let y=thisYear;y>=2015;y--)allYears.push(String(y));
  const dataYears=new Set(Object.keys(data).map(k=>k.substring(0,4)));
  const curY=selectedYear||String(thisYear);
  const yearSel=`<div style="margin-bottom:14px;display:flex;align-items:center;gap:10px">
    <label style="font-size:12px;font-weight:600;color:var(--t2)">שנה:</label>
    <select onchange="renderYear(document.getElementById('repContent'),this.value)" style="padding:7px 12px;border-radius:8px;border:1px solid var(--bd);background:var(--s);color:var(--t);font-family:'Inter',sans-serif;font-size:13px;font-weight:300;cursor:pointer;flex:1">
      ${allYears.map(y=>'<option value="'+y+'" '+(y===curY?'selected':'')+' '+(dataYears.has(y)?'':'style="color:var(--t3)"')+'>'+y+(dataYears.has(y)?' ✓':'')+'</option>').join('')}
    </select>
  </div>`;
  const months=Array.from({length:12},(_,i)=>({m:i,h:0,p:0,days:0}));
  let totalH=0,totalP=0,bestM=-1,bestP=0,worstM=-1,worstP=Infinity;
  Object.keys(data).forEach(k=>{
    if(!k.startsWith(curY))return;
    const d=data[k],mi=parseInt(k.split('-')[1])-1;
    if(mi<0||mi>11)return;
    const pr=cpDay(d);
    months[mi].h+=pr.allHours;months[mi].p+=pr.total;months[mi].days++;
    totalH+=pr.allHours;totalP+=pr.total;
  });
  months.forEach((m,i)=>{if(m.days>0&&m.p>bestP){bestP=m.p;bestM=i;}if(m.days>0&&m.p<worstP){worstP=m.p;worstM=i;}});
  const avgM=months.filter(m=>m.days>0).length;
  const avgMonthly=avgM>0?totalP/avgM:0;
  const dk=document.body.getAttribute('data-theme')==='dark';
  const lb=MN.map(n=>n.substring(0,3));
  const vals=months.map(m=>Math.round(m.p));
  const hvals=months.map(m=>parseFloat(m.h.toFixed(1)));
  cont.innerHTML=yearSel+`
  <div class="stats-row">
    <div class="scard"><div class="slbl">סה"כ ${curY}</div><div class="sval g">₪${Math.round(totalP).toLocaleString('he-IL')}</div></div>
    <div class="scard"><div class="slbl">שעות ${curY}</div><div class="sval b">${totalH.toFixed(1)}</div></div>
  </div>
  <div class="stats-row">
    <div class="scard"><div class="slbl">ממוצע חודשי</div><div class="sval" style="color:var(--am)">₪${Math.round(avgMonthly).toLocaleString('he-IL')}</div></div>
    <div class="scard"><div class="slbl">חודש שיא</div><div class="sval" style="color:var(--g);font-size:16px">${bestM>=0?MN[bestM]:'—'}</div></div>
  </div>
  <div class="card">
    <div class="csummary"><span>הכנסה חודשית ${curY}</span><span style="color:var(--g)">שיא: ${bestM>=0?MN[bestM]+' ₪'+Math.round(bestP).toLocaleString('he-IL'):'—'}</span></div>
    <div class="cwrap" style="height:180px"><canvas id="yrIncomeCh"></canvas></div>
  </div>
  <div class="card">
    <div class="csummary"><span style="display:flex;align-items:center;gap:5px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>שעות לפי חודש</span></div>
    <div class="cwrap" style="height:150px"><canvas id="yrHoursCh"></canvas></div>
  </div>
  <div class="card">
    <div style="font-size:13px;font-weight:400;margin-bottom:10px">פירוט חודשי ${curY}</div>
    ${months.map((m,i)=>m.days>0?'<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:0.5px solid var(--bd)"><div style="font-size:13px;font-weight:'+(i===bestM?'800':'600')+';color:'+(i===bestM?'var(--g)':'var(--t)')+'">'+(MN[i])+(i===bestM?' ★':'')+' </div><div style="text-align:left"><div style="font-size:13px;font-weight:400;color:var(--g)">&#8362;'+Math.round(m.p).toLocaleString('he-IL')+'</div><div style="font-size:10px;color:var(--t3)">'+m.h.toFixed(1)+' '+String.fromCharCode(1513)+"'"+' · '+m.days+' ימים</div></div></div>':'').join('')}
  </div>`;
  const bgColors=barColorArray(vals,bestM,'#2563EB','#10B981');
  const yrCt=D.gs().chartType||'bar';
  setTimeout(()=>{
    if(window.yrInCh){try{window.yrInCh.destroy();}catch(e){}}
    const c1=document.getElementById('yrIncomeCh');
    if(c1){
      if(yrCt==='pie'){
        const _PC=['#2563EB','#10B981','#F59E0B','#8B5CF6','#EF4444','#06B6D4','#EC4899','#84CC16','#F97316','#A855F7','#14B8A6','#F43F5E'];
        const tot=vals.reduce((a,b)=>a+b,0);
        const actIdx=vals.map((v,i)=>v>0?i:-1).filter(i=>i>=0);
        const pLb=actIdx.map(i=>lb[i]);const pVl=actIdx.map(i=>vals[i]);const pCl=actIdx.map((_,i)=>_PC[i%_PC.length]);
        window.yrInCh=new Chart(c1,{type:'doughnut',data:{labels:pLb,datasets:[{data:pVl,backgroundColor:pCl,borderWidth:0,hoverOffset:8}]},options:{responsive:true,maintainAspectRatio:false,animation:{duration:800,easing:'easeInOutQuart'},plugins:{legend:{display:true,position:'bottom',labels:{font:{size:10,family:'Inter'},boxWidth:10,padding:6}},tooltip:{callbacks:{label:ctx=>{const v=ctx.parsed;const pct=tot>0?Math.round(v/tot*100):0;return` ₪${Math.round(v).toLocaleString('he-IL')} (${pct}%)`;}}}}}});
      } else if(yrCt==='line'||yrCt==='area'){
        window.yrInCh=new Chart(c1,{type:'line',data:{labels:lb,datasets:[{data:vals,borderColor:lineColor(),backgroundColor:yrCt==='area'?lineFill():'transparent',fill:yrCt==='area',tension:0.4,pointRadius:3,pointBackgroundColor:lineColor(),pointHoverRadius:6,pointHoverBackgroundColor:lineColor()}]},options:{...cOpts(dk),animation:{duration:800,easing:'easeInOutQuart'},plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>{const v=ctx.parsed.y;if(v==null||isNaN(v))return ctx.formattedValue;return' ₪'+Math.round(v).toLocaleString('he-IL');}}}}}});
      } else {
        window.yrInCh=new Chart(c1,{type:'bar',data:{labels:lb,datasets:[{data:vals,backgroundColor:bgColors,borderRadius:barRadius(),borderSkipped:false,borderWidth:0}]},options:{...cOpts(dk),animation:{duration:800,easing:'easeInOutQuart'},plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>{const v=ctx.parsed.y;if(v==null||isNaN(v))return ctx.formattedValue;return' ₪'+Math.round(v).toLocaleString('he-IL');}}}}}});
      }
    }
    if(window.yrHrCh){try{window.yrHrCh.destroy();}catch(e){}}
    const c2=document.getElementById('yrHoursCh');
    if(c2){
      if(yrCt==='line'||yrCt==='area'){
        window.yrHrCh=new Chart(c2,{type:'line',data:{labels:lb,datasets:[{data:hvals,borderColor:lineColor(),backgroundColor:yrCt==='area'?lineFill():'transparent',fill:yrCt==='area',tension:0.4,pointRadius:3,pointBackgroundColor:lineColor(),pointHoverRadius:6,pointHoverBackgroundColor:lineColor()}]},options:{...cOpts(dk),animation:{duration:800,easing:'easeInOutQuart'},plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>{const v=ctx.parsed.y;if(v==null||isNaN(v))return ctx.formattedValue;return' '+v+' ש'+"'";}}}}}});
      } else {
        window.yrHrCh=new Chart(c2,{type:'bar',data:{labels:lb,datasets:[{data:hvals,backgroundColor:barColor('#3B82F6'),borderRadius:barRadius(),borderSkipped:false,borderWidth:0}]},options:{...cOpts(dk),animation:{duration:800,easing:'easeInOutQuart'},plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>{const v=ctx.parsed.y;if(v==null||isNaN(v))return ctx.formattedValue;return' ₪'+Math.round(v).toLocaleString('he-IL');}}}}}});
      }
    }
  },20);
}

// ---- COUPLE PAGE ----
function renderCouple(){
  const s=D.gs(),cont=document.getElementById('coupleContent');
  if(!s.pairCode){
    const pending=sessionStorage.getItem('pendingPair');
    if(!s.myCode){var _ss=D.gs();_ss.myCode=genCode();D.ss(_ss);}
    var _myName=s.myName||'אני';
    var _pName=s.partnerName||'פרטנר';
    if(pending){
      cont.innerHTML=
        '<div class="card" style="margin-top:8px">'+
        '<div style="text-align:center;padding:4px 0 16px">'+
        '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--b6)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="3"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.85"/></svg>'+
        '<div style="font-size:17px;font-weight:500;margin-top:10px;color:var(--t)">חיבור לפרטנר</div>'+
        '<div style="font-size:13px;color:var(--t2);margin-top:4px">קוד הפרטנר זוהה אוטומטית</div></div>'+
        '<div class="fg"><label class="fl">קוד הפרטנר</label>'+
        '<input type="text" class="fi" id="cplPairCode" value="'+pending+'" readonly style="text-align:center;font-size:20px;letter-spacing:8px;font-weight:500;background:rgba(16,185,129,0.1);border-color:var(--g);color:var(--g)"></div>'+
        '<div class="fg"><label class="fl">השם שלי</label>'+
        '<input type="text" class="fi" id="cplMyName" placeholder="השם שלך" value="'+_myName+'"></div>'+
        '<div class="fg"><label class="fl">שם הפרטנר</label>'+
        '<input type="text" class="fi" id="cplPartnerName" placeholder="שם הפרטנר" value="'+_pName+'"></div>'+
        '<button class="btn btn-p" onclick="doConnectFromCouplePage()" style="font-size:15px;padding:14px">התחבר לפרטנר</button>'+
        '<button class="btn" onclick="doCancelPairConnect()" style="margin-top:8px;background:var(--s2);color:var(--t2)">ביטול</button>'+
        '</div>';
    } else {
      cont.innerHTML=
        '<div class="empty"><div class="empty-ico" style="font-size:0"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>'+
        '<div class="empty-ttl">לא מחוברים לזוג</div>'+
        '<div class="empty-sub">שלח לפרטנר את הקישור שלך, או הזן את הקוד שלו</div>'+
        '<button class="btn btn-p" style="width:auto;padding:12px 28px;margin:20px auto 0;display:block" onclick="openPair()">חבר פרטנר</button>'+
        '</div>';
    }
    return;
  }
  // יש pairCode — בדוק אם פרטנר כבר חיבר
  const myD=D.g(),pd=D.gp();
  const partnerHasData=Object.keys(pd).length>0;
  if(!partnerHasData){
    // בדוק ב-Firebase
    checkPartnerConnected().then(function(connected){
      if(connected){
        // פרטנר חיבר — טען נתונים
        loadPartnerFromFirebase().then(function(got){
          if(got){renderCouple();showToast('הפרטנר התחבר! נטענו הנתונים ✅');}
        });
      } else {
        // פרטנר עוד לא חיבר — הצג הודעת המתנה
        const cont2=document.getElementById('coupleContent');
        if(cont2&&cont2.querySelector('.waiting-partner'))return;
        const waitDiv=document.createElement('div');
        waitDiv.className='waiting-partner';
        waitDiv.style.cssText='background:var(--s);border:1px solid var(--bd);border-radius:14px;padding:20px;text-align:center;margin-bottom:12px';
        waitDiv.innerHTML='<div style="font-size:28px;margin-bottom:8px">⏳</div>'
          +'<div style="font-size:15px;font-weight:500;color:var(--t);margin-bottom:6px">ממתינים לפרטנר</div>'
          +'<div style="font-size:12px;color:var(--t3)">שלח לפרטנר את הקישור שלך כדי שיתחבר מהצד שלו</div>';
        if(cont2)cont2.insertBefore(waitDiv,cont2.firstChild);
      }
    });
  }
  const dk=document.body.getAttribute('data-theme')==='dark';
  cont.innerHTML=`
  <div id="cplStats">
    <div class="couple-total"><div class="ct-lbl" id="cplPeriodLbl">הכנסה משותפת החודש</div><div class="ct-val" id="cplTotVal">₪0</div><div class="ct-sub" id="cplHoursLbl">0 + 0 שעות ביחד</div></div>
    <div class="ucard" id="cplMyCard" style="background:${s.myColor}18;border-color:${s.myColor}">
      <div class="uc-top"><div class="uc-av" style="background:${s.myColor}">${s.myName.charAt(0)}</div><div><div class="uc-name" style="color:${s.myColor}">${s.myName}</div><div class="uc-h" id="cplMyH">0 שעות</div></div></div>
      <div class="uc-money" id="cplMyP" style="color:${s.myColor}">₪0</div>
      <div class="pbar-wrap" style="margin-top:10px"><div class="pbar-fill" id="cplMyBar" style="width:50%;background:${s.myColor}"></div></div>
      <div style="font-size:11px;color:var(--t3);margin-top:4px" id="cplMyPct">50% מסה"כ</div>
    </div>
    <div class="ucard" id="cplPCard" style="background:${s.partnerColor}18;border-color:${s.partnerColor}">
      <div class="uc-top"><div class="uc-av" style="background:${s.partnerColor}">${s.partnerName.charAt(0)}</div><div><div class="uc-name" style="color:${s.partnerColor}">${s.partnerName}</div><div class="uc-h" id="cplPH">0 שעות</div></div></div>
      <div class="uc-money" id="cplPP" style="color:${s.partnerColor}">₪0</div>
      <div class="pbar-wrap" style="margin-top:10px"><div class="pbar-fill" id="cplPBar" style="width:50%;background:${s.partnerColor}"></div></div>
      <div style="font-size:11px;color:var(--t3);margin-top:4px" id="cplPPct">50% מסה"כ</div>
    </div>
  </div>
  <div class="card">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <div style="font-size:11px;color:var(--t2)">השוואה</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <select id="cplViewSel" onchange="renderCoupleChart()" style="padding:4px 8px;border-radius:6px;border:1px solid var(--bd);background:var(--s2);color:var(--t);font-family:'Inter',sans-serif;font-size:11px">
          <option value="month">חודש נוכחי</option>
          <option value="custom_month">בחר חודש</option>
          <option value="year">שנה נוכחית</option>
          <option value="custom_year">בחר שנה</option>
        </select>
        <select id="cplMonthSel" onchange="renderCoupleChart()" style="display:none;padding:4px 8px;border-radius:6px;border:1px solid var(--bd);background:var(--s2);color:var(--t);font-family:'Inter',sans-serif;font-size:11px">
          ${MN.map((m,i)=>'<option value="'+i+'">'+m+'</option>').join('')}
        </select>
        <select id="cplYearSel" onchange="renderCoupleChart()" style="display:none;padding:4px 8px;border-radius:6px;border:1px solid var(--bd);background:var(--s2);color:var(--t);font-family:'Inter',sans-serif;font-size:11px">
          ${Array.from({length:new Date().getFullYear()-2014},(_,i)=>new Date().getFullYear()-i).map(y=>'<option value="'+y+'">'+y+'</option>').join('')}
        </select>
      </div>
    </div>
    <div class="cwrap"><canvas id="cplCh"></canvas></div>
  </div>
  <div class="card">
    <div style="font-size:10px;color:var(--t3);margin-bottom:8px">קוד זוג: <strong style="letter-spacing:2px;color:var(--b8)">${s.pairCode}</strong></div>
    <button class="btn btn-g" onclick="manualSync()" style="margin-bottom:8px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> סנכרן פרטנר</button>
    <button class="btn btn-o" onclick="openPair()" style="font-size:12px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> הגדרות זוג</button>
  </div>`;
  renderCoupleChart();
  renderCoupleStats();
}

function getCplPeriodData(){
  const s=D.gs();
  const sel=document.getElementById('cplViewSel');
  const view=sel?sel.value:'month';
  const mSel=document.getElementById('cplMonthSel');
  const ySel=document.getElementById('cplYearSel');
  const myD=D.g(),pd=D.gp(),now=new Date();
  let myH=0,myP=0,pH=0,pP=0;
  let labels=[],myVals=[],pVals=[],periodLabel='';
  if(view==='month'||view==='custom_month'){
    const m=view==='custom_month'&&mSel?parseInt(mSel.value):now.getMonth();
    const y=now.getFullYear();
    periodLabel='הכנסה משותפת — '+MN[m]+' '+y;
    const days=new Date(y,m+1,0).getDate();
    const weeks=[{l:'ש1',my:0,p:0,mH:0,pH2:0},{l:'ש2',my:0,p:0,mH:0,pH2:0},
                 {l:'ש3',my:0,p:0,mH:0,pH2:0},{l:'ש4',my:0,p:0,mH:0,pH2:0}];
    for(let d=1;d<=days;d++){
      const k=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
      const wi=Math.min(Math.floor((d-1)/7),3);
      if(myD[k]){const v=cp(myD[k].hours,myD[k].rate,myD[k].bonuses).total;weeks[wi].my+=v;myP+=v;myH+=myD[k].hours||0;weeks[wi].mH+=myD[k].hours||0;}
      if(pd[k]){const v=cp(pd[k].hours,pd[k].rate||50,pd[k].bonuses).total;weeks[wi].p+=v;pP+=v;pH+=pd[k].hours||0;weeks[wi].pH2+=pd[k].hours||0;}
    }
    labels=weeks.map(w=>w.l);myVals=weeks.map(w=>Math.round(w.my));pVals=weeks.map(w=>Math.round(w.p));
  } else {
    const y=view==='year'?now.getFullYear():(ySel?parseInt(ySel.value):now.getFullYear());
    periodLabel='הכנסה משותפת — '+y;
    labels=MN.map(n=>n.substring(0,3));
    myVals=Array(12).fill(0);pVals=Array(12).fill(0);
    Object.keys(myD).forEach(k=>{
      if(!k.startsWith(String(y)))return;
      const d=myD[k],mi=parseInt(k.split('-')[1])-1;
      if(mi<0||mi>11)return;
      const v=cp(d.hours,d.rate,d.bonuses).total;
      myVals[mi]+=v;myP+=v;myH+=d.hours||0;
    });
    Object.keys(pd).forEach(k=>{
      if(!k.startsWith(String(y)))return;
      const d=pd[k],mi=parseInt(k.split('-')[1])-1;
      if(mi<0||mi>11)return;
      const v=cp(d.hours,d.rate||50,d.bonuses).total;
      pVals[mi]+=v;pP+=v;pH+=d.hours||0;
    });
    myVals=myVals.map(v=>Math.round(v));pVals=pVals.map(v=>Math.round(v));
  }
  return {myH,myP,pH,pP,labels,myVals,pVals,periodLabel};
}

function renderCoupleStats(){
  const s=D.gs();
  const {myH,myP,pH,pP,periodLabel}=getCplPeriodData();
  const tot=myP+pP;
  const myPct=tot>0?Math.round(myP/tot*100):50;
  const pPct=100-myPct;
  const el=id=>document.getElementById(id);
  if(el('cplPeriodLbl'))el('cplPeriodLbl').textContent=periodLabel;
  if(el('cplTotVal'))el('cplTotVal').textContent='₪'+Math.round(tot).toLocaleString('he-IL');
  if(el('cplHoursLbl'))el('cplHoursLbl').textContent=myH.toFixed(1)+' + '+pH.toFixed(1)+' שעות ביחד';
  if(el('cplMyH'))el('cplMyH').textContent=myH.toFixed(1)+' שעות';
  if(el('cplMyP'))el('cplMyP').textContent='₪'+Math.round(myP).toLocaleString('he-IL');
  if(el('cplMyBar'))el('cplMyBar').style.width=myPct+'%';
  if(el('cplMyPct'))el('cplMyPct').textContent=myPct+'% מסה"כ';
  if(el('cplPH'))el('cplPH').textContent=pH.toFixed(1)+' שעות';
  if(el('cplPP'))el('cplPP').textContent='₪'+Math.round(pP).toLocaleString('he-IL');
  if(el('cplPBar'))el('cplPBar').style.width=pPct+'%';
  if(el('cplPPct'))el('cplPPct').textContent=pPct+'% מסה"כ';
}

function renderCoupleChart(){
  const s=D.gs();
  const sel=document.getElementById('cplViewSel');
  if(!sel)return;
  const view=sel.value;
  const mSel=document.getElementById('cplMonthSel');
  const ySel=document.getElementById('cplYearSel');
  if(mSel)mSel.style.display=view==='custom_month'?'block':'none';
  if(ySel)ySel.style.display=view==='custom_year'?'block':'none';
  renderCoupleStats();
  const {labels,myVals,pVals}=getCplPeriodData();
  const dk=document.body.getAttribute('data-theme')==='dark';
  if(cplCh)cplCh.destroy();
  const canvas=document.getElementById('cplCh');if(!canvas)return;
  cplCh=new Chart(canvas,{type:'bar',data:{labels,datasets:[
    {label:s.myName,data:myVals,backgroundColor:s.myColor+'CC',borderRadius:barRadius(),borderSkipped:false,borderWidth:0},
    {label:s.partnerName,data:pVals,backgroundColor:s.partnerColor+'CC',borderRadius:barRadius(),borderSkipped:false,borderWidth:0}
  ]},options:{...cOpts(dk),animation:{duration:800,easing:'easeInOutQuart'},plugins:{legend:{display:true,labels:{font:{size:10,family:'Inter'},boxWidth:10,padding:10}},tooltip:{callbacks:{label:ctx=>{const v=ctx.parsed.y;if(v==null||isNaN(v))return ctx.formattedValue;return' ₪'+Math.round(v).toLocaleString('he-IL');}}}}}});
}
