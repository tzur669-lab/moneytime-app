// ---- CONSTANTS ----
const JC=['#1E3A8A','#2563EB','#10B981','#F59E0B','#EF4444','#8B5CF6'];
const MN=['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
const CID='57616527068-9ogg9tnmgcku8icu5bjkvd7e48b9hujs.apps.googleusercontent.com';
const SCOPES='https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email';let curDt=new Date(), selDt=null, mType='', per='7', rTab='gen';
let hCh,pCh,cmpCh,cplCh,jCh;
let aToken=null, tClient=null, dProm=null, tInt=null;

// ---- STORAGE ----
const DEF_S={jobs:[{name:'עבודה ראשית',color:'#1E3A8A',rate:50,fixed:0}],calcOvertime:false,showMissing:true,myName:'אני',myColor:'#1E3A8A',partnerName:'פרטנר',partnerColor:'#10B981',pairCode:null,partnerCode:null,myUID:null,theme:'light',styleTheme:'default',fixedBonuses:[]};
const D={
  g:()=>{try{return JSON.parse(localStorage.getItem('wd')||'{}');}catch{return {};}},
  s:d=>{localStorage.setItem('wd',JSON.stringify(d));localStorage.setItem('wdts',Date.now());},
  gs:()=>{try{return Object.assign({},DEF_S,JSON.parse(localStorage.getItem('settings')||'{}'));}catch{return {...DEF_S};}},
  ss:s=>localStorage.setItem('settings',JSON.stringify(s)),
  gp:()=>{try{return JSON.parse(localStorage.getItem('pd')||'{}');}catch{return {};}},
  sp:d=>localStorage.setItem('pd',JSON.stringify(d))
};
const fk=d=>{const dt=d instanceof Date?d:new Date(d);return`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;};

// ---- HEBREW CAL ----
const HC=(()=>{
  const g=n=>{const o=['','א','ב','ג','ד','ה','ו','ז','ח','ט'],t=['','י','כ','ל','מ','נ','ס','ע','פ','צ'];if(n===15)return'ט״ו';if(n===16)return'ט״ז';let r=(t[Math.floor((n%100)/10)]||'')+(o[n%10]||'');return r.length>1?r.slice(0,-1)+'״'+r.slice(-1):r+'׳';};
  return{f:d=>{try{const f=new Intl.DateTimeFormat('he-IL-u-ca-hebrew',{day:'numeric',month:'short'});let dy='',mo='';for(const p of f.formatToParts(d)){if(p.type==='day'){const n=parseInt(p.value);dy=isNaN(n)?p.value:g(n);}if(p.type==='month')mo=p.value;}return dy+' '+mo;}catch{return '';}}};
})();

// ---- PROFIT ----
function cp(h,r,b=[]){
  const s=D.gs();
  h=parseFloat(h)||0; r=parseFloat(r)||0;
  let reg=h,ot1=0,ot2=0;
  let base;
  if(s.calcOvertime&&h>8){
    reg=8; ot1=Math.min(h-8,2); ot2=Math.max(h-10,0);
    base=(reg*r)+(ot1*r*1.25)+(ot2*r*1.5);
  } else {
    base=h*r;
  }
  const bon=(b||[]).reduce((a,x)=>a+(parseFloat(x.amount)||0),0);
  return{base,bonus:bon,total:base+bon,reg,ot1,ot2};
}
// חישוב עבודה נוספת — OT נפרד, ללא בונוסים
function cpExtra(h,r){
  const s=D.gs();
  h=parseFloat(h)||0; r=parseFloat(r)||0;
  let reg=h,ot1=0,ot2=0,base;
  if(s.calcOvertime&&h>8){
    reg=8; ot1=Math.min(h-8,2); ot2=Math.max(h-10,0);
    base=(reg*r)+(ot1*r*1.25)+(ot2*r*1.5);
  } else { base=h*r; }
  return{base,reg,ot1,ot2};
}
// סה"כ יום — עבודה ראשית + כל עבודות נוספות
function cpDay(dayData){
  if(!dayData) return{total:0,base:0,bonus:0,hours:0,extraHours:0,allHours:0};
  const main=cp(dayData.hours||0, dayData.rate||0, dayData.bonuses||[]);
  let extraBase=0, extraHours=0;
  (dayData.extraJobs||[]).forEach(ej=>{
    const r=cpExtra(ej.hours||0, ej.rate||0);
    extraBase+=r.base; extraHours+=ej.hours||0;
  });
  return{total:main.total+extraBase, base:main.base+extraBase, bonus:main.bonus,
         hours:dayData.hours||0, extraHours, allHours:(dayData.hours||0)+extraHours, main};
}

// ---- DATES ----
function getDts(r,sId,eId){
  const t=new Date();let st=new Date(t),en=new Date(t);
  if(r==='7'){st=new Date(t);st.setDate(t.getDate()-6);}
  else if(r==='14'){st=new Date(t);st.setDate(t.getDate()-13);}
  else if(r==='week'){st.setDate(t.getDate()-t.getDay());en.setDate(st.getDate()+6);}
  else if(r==='month'){st=new Date(t.getFullYear(),t.getMonth(),1);en=new Date(t.getFullYear(),t.getMonth()+1,0);}
  else if(r==='lastMonth'){st=new Date(t.getFullYear(),t.getMonth()-1,1);en=new Date(t.getFullYear(),t.getMonth(),0);}
  else if(r==='custom'){const sv=document.getElementById(sId)?.value,ev=document.getElementById(eId)?.value;if(!sv||!ev)return[];const[sy,sm,sd]=sv.split('-').map(Number);const[ey,em,ed]=ev.split('-').map(Number);st=new Date(sy,sm-1,sd);en=new Date(ey,em-1,ed);if(isNaN(st.getTime())||isNaN(en.getTime())||st>en)return[];}
  const res=[];for(let d=new Date(st);d<=en;d.setDate(d.getDate()+1))res.push(new Date(d));return res;
}
function getPerDts(p){
  return getDts(p,'rS','rE');
}
