// ---- REPORT HISTORY ----
function _saveToReportHistory(html, type) {
  try {
    var hist = JSON.parse(localStorage.getItem('reportHistory') || '[]');
    hist.unshift({
      id: Date.now(), type: type || 'pdf',
      date: new Date().toLocaleDateString('he-IL'),
      time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
      html: html
    });
    if (hist.length > 20) hist = hist.slice(0, 20);
    localStorage.setItem('reportHistory', JSON.stringify(hist));
  } catch (e) { }
}

function closeReportHistoryOverlay() {
  var el = document.getElementById('reportHistoryOverlay');
  if (el) el.remove();
}

function openReportHistoryOverlay() {
  var hist = [];
  try { hist = JSON.parse(localStorage.getItem('reportHistory') || '[]'); } catch (e) { }
  var ex = document.getElementById('reportHistoryOverlay'); if (ex) ex.remove();
  var ov = document.createElement('div');
  ov.id = 'reportHistoryOverlay';
  ov.style.cssText = 'position:fixed;inset:0;z-index:9999;background:var(--bg);display:flex;flex-direction:column;overflow:hidden';
  var tb = document.createElement('div');
  tb.style.cssText = 'background:#1E3A8A;color:#fff;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0';
  tb.innerHTML = '<span style="font-size:15px;font-weight:500">דוחות שמורים</span>'
    + '<button onclick="closeReportHistoryOverlay()" style="background:rgba(239,68,68,.8);border:none;color:#fff;padding:8px 14px;border-radius:8px;font-size:13px;cursor:pointer">✕ סגור</button>';
  var body = document.createElement('div');
  body.style.cssText = 'flex:1;overflow-y:auto;padding:16px';
  var icons = {
    pdf: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>',
    xlsx: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    table: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>'
  };
  var labels = { pdf: 'PDF', xlsx: 'Excel', table: 'טבלה' };
  if (!hist.length) {
    body.innerHTML = '<div style="text-align:center;padding:40px 0;color:var(--t3);font-size:14px">אין דוחות שמורים עדיין.<br>צור דוח PDF או Excel — יישמר כאן אוטומטית.</div>';
  } else {
    body.innerHTML = '<div class="card" style="padding:10px 14px">' + hist.map(function (r, i) {
      return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;' + (i > 0 ? 'border-top:0.5px solid var(--bd)' : '') + '">'
        + '<div style="display:flex;align-items:center;gap:10px"><span style="display:flex;align-items:center">' + (icons[r.type] || icons.pdf) + '</span>'
        + '<div><div style="font-size:13px;font-weight:500;color:var(--t)">' + (labels[r.type] || r.type) + ' — ' + r.date + '</div>'
        + '<div style="font-size:11px;color:var(--t3)">' + r.time + '</div></div></div>'
        + '<div style="display:flex;gap:6px">'
        + '<button class="btn btn-sm" style="padding:5px 12px;font-size:12px" onclick="openSavedReport(' + i + ')">צפה</button>'
        + '<button class="btn btn-sm" style="padding:5px 10px;font-size:12px;background:var(--s2);color:var(--t2)" onclick="deleteSavedReport(' + i + ')">✕</button>'
        + '</div></div>';
    }).join('') + '</div>';
  }
  ov.appendChild(tb); ov.appendChild(body);
  document.body.appendChild(ov);
}

function openSavedReport(i) {
  try {
    var hist = JSON.parse(localStorage.getItem('reportHistory') || '[]');
    var r = hist[i]; if (!r) return;
    var ex = document.getElementById('reportOverlay'); if (ex) ex.remove();
    var ov = document.createElement('div');
    ov.id = 'reportOverlay';
    ov.style.cssText = 'position:fixed;inset:0;z-index:10000;background:#fff;display:flex;flex-direction:column;overflow:hidden';
    var labels = { pdf: 'דוח PDF', xlsx: 'דוח Excel', table: 'טבלת נתונים' };
    var tb = document.createElement('div');
    tb.style.cssText = 'background:#1E3A8A;color:#fff;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;gap:8px';
    var tl = document.createElement('span'); tl.style.cssText = 'font-size:13px;flex:1';
    tl.textContent = (labels[r.type] || 'דוח') + ' — ' + r.date + ' ' + r.time;
    var bs = document.createElement('button');
    bs.style.cssText = 'background:rgba(255,255,255,.22);border:none;color:#fff;padding:9px 14px;border-radius:8px;font-size:13px;cursor:pointer';
    bs.textContent = '📤 שתף';
    var bc = document.createElement('button');
    bc.style.cssText = 'background:rgba(239,68,68,.8);border:none;color:#fff;padding:9px 14px;border-radius:8px;font-size:13px;cursor:pointer';
    bc.textContent = '✕ סגור';
    tb.appendChild(tl); tb.appendChild(bs); tb.appendChild(bc);
    var fr = document.createElement('iframe');
    fr.style.cssText = 'flex:1;border:none;width:100%;background:#fff';
    ov.appendChild(tb); ov.appendChild(fr);
    document.body.appendChild(ov);
    bc.addEventListener('click', function () { var el = document.getElementById('reportOverlay'); if (el) el.remove(); });
    bs.addEventListener('click', function () {
      var blob = new Blob([r.html], { type: 'text/html;charset=utf-8' });
      _shareFile(blob, 'report_' + r.date.replace(/[^0-9]/g, '_') + '.html');
    });
    try { fr.contentDocument.open(); fr.contentDocument.write(r.html); fr.contentDocument.close(); }
    catch (e) { fr.srcdoc = r.html; }
  } catch (e) { console.error(e); }
}

function deleteSavedReport(i) {
  try {
    var hist = JSON.parse(localStorage.getItem('reportHistory') || '[]');
    hist.splice(i, 1);
    localStorage.setItem('reportHistory', JSON.stringify(hist));
    openReportHistoryOverlay();
  } catch (e) { }
}

// ---- PDF ----
function tpdf(id) { const el = document.getElementById(id); el.classList.toggle('on'); el.textContent = el.classList.contains('on') ? '✓' : ''; }
function txlsx(id) { const el = document.getElementById(id); el.classList.toggle('on'); el.textContent = el.classList.contains('on') ? '✓' : ''; }

function genPDF() {
  if (!window.jspdf && !window.jsPDF) {
    var sc = document.createElement('script');
    sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    sc.onload = function () { _buildPDF(); };
    sc.onerror = function () { _buildPDF(); };
    document.head.appendChild(sc);
    showToast('טוען...');
    return;
  }
  _buildPDF();
}

function _buildPDF() {
  try {
    var pr = document.getElementById('pdfPer').value;
    var dates;
    if (pr === 'all') {
      var allK = Object.keys(D.g()).sort();
      if (!allK.length) { showToast('אין נתונים'); return; }
      dates = [];
      var s0 = new Date(allK[0]), e0 = new Date(allK[allK.length - 1]);
      for (var d0 = new Date(s0); d0 <= e0; d0.setDate(d0.getDate() + 1)) dates.push(new Date(d0));
    } else {
      dates = getDts(pr, 'pdfS', 'pdfE');
    }
    var data = D.g(), s = D.gs(), pd = D.gp();
    var name = document.getElementById('pdfNm').value || s.myName || 'דוח';
    var iH = document.getElementById('po1').classList.contains('on');
    var iR = document.getElementById('po2').classList.contains('on');
    var iN = document.getElementById('po4').classList.contains('on');
    var iP = document.getElementById('po5').classList.contains('on') && s.pairCode;
    var today = new Date().toLocaleDateString('he-IL');
    var th = 0, tp = 0, ptp = 0;
    var rows = '';
    dates.forEach(function (d) {
      var k = fk(d);
      if (!(data[k] && data[k].hours > 0)) return;
      var pp = cp(data[k].hours, data[k].rate, data[k].bonuses);
      th += data[k].hours; tp += pp.total;
      var row = '<tr>';
      row += '<td>' + k + '</td>';
      if (iH) row += '<td>' + data[k].hours.toFixed(1) + '</td>';
      if (iR) row += '<td>' + data[k].rate + '</td>';
      row += '<td><strong>' + Math.round(pp.total).toLocaleString('he-IL') + '</strong></td>';
      if (iN) row += '<td>' + (data[k].note || '') + '</td>';
      if (iP) {
        var pp3 = pd[k];
        if (pp3 && pp3.hours > 0) { var pr3 = cp(pp3.hours, pp3.rate || 50, pp3.bonuses); ptp += pr3.total; row += '<td>' + Math.round(pr3.total).toLocaleString('he-IL') + '</td>'; }
        else row += '<td>-</td>';
      }
      row += '</tr>';
      rows += row;
    });
    var headers = '<th>תאריך</th>';
    if (iH) headers += '<th>שעות</th>';
    if (iR) headers += '<th>תעריף</th>';
    headers += '<th>סה"כ ₪</th>';
    if (iN) headers += '<th>הערה</th>';
    if (iP) headers += '<th>פרטנר ₪</th>';
    var summary = 'סה"כ: ' + th.toFixed(1) + ' שעות | ' + name + ': ₪' + Math.round(tp).toLocaleString('he-IL');
    if (iP) summary += ' | פרטנר: ₪' + Math.round(ptp).toLocaleString('he-IL') + ' | יחד: ₪' + Math.round(tp + ptp).toLocaleString('he-IL');
    var html = '<!DOCTYPE html><html dir="rtl" lang="he"><head><meta charset="UTF-8">'
      + '<meta name="viewport" content="width=device-width,initial-scale=1">'
      + '<title>דוח שעות - ' + name + '</title>'
      + '<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;padding:20px;color:#0F172A;direction:rtl}'
      + '.header{background:#1E3A8A;color:#fff;padding:20px;border-radius:12px;margin-bottom:20px;text-align:center}'
      + '.header h1{font-size:22px;margin-bottom:4px}.header p{font-size:13px;opacity:.8}'
      + 'table{width:100%;border-collapse:collapse;margin-bottom:20px}'
      + 'th{background:#DBEAFE;color:#1E3A8A;padding:10px 8px;text-align:right;font-size:13px}'
      + 'td{padding:9px 8px;border-bottom:1px solid #E2E8F0;font-size:13px}tr:nth-child(even){background:#F8FAFF}'
      + '.summary{background:#1E3A8A;color:#fff;padding:14px 20px;border-radius:10px;text-align:center;font-size:14px;font-weight:bold}'
      + '@media print{.no-print{display:none}}</style></head><body>'
      + '<div class="header"><h1>דוח שעות עבודה</h1><p>' + name + ' | ' + today + '</p></div>'
      + '<table><thead><tr>' + headers + '</tr></thead><tbody>' + rows + '</tbody></table>'
      + '<div class="summary">' + summary + '</div>'
      + '<p style="text-align:center;font-size:10px;color:#94A3B8;padding:8px">tzur669@gmail.com</p></body></html>';
    closeM('mPDF');
    vib();
    _showReportInApp(html, 'pdf');
  } catch (e) {
    console.error('PDF error:', e);
    alert('שגיאה: ' + e.message);
  }
}

var _pdfHtml = '';

function _showReportInApp(html, type) {
  _saveToReportHistory(html, type || 'pdf');
  var existing = document.getElementById('reportOverlay'); if (existing) existing.remove();
  var overlay = document.createElement('div');
  overlay.id = 'reportOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#fff;display:flex;flex-direction:column;overflow:hidden';
  var topbar = document.createElement('div');
  topbar.style.cssText = 'background:#1E3A8A;color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;gap:8px';
  var title = document.createElement('span'); title.style.cssText = 'font-size:14px;font-weight:400;flex:1'; title.textContent = 'דוח שעות';
  var btnShare = document.createElement('button');
  btnShare.style.cssText = 'background:rgba(255,255,255,.22);border:none;color:#fff;padding:9px 16px;border-radius:8px;font-size:13px;font-weight:400;cursor:pointer;white-space:nowrap';
  btnShare.innerHTML = '📤 שתף';
  var btnClose = document.createElement('button');
  btnClose.style.cssText = 'background:rgba(239,68,68,.8);border:none;color:#fff;padding:9px 14px;border-radius:8px;font-size:13px;font-weight:400;cursor:pointer;white-space:nowrap';
  btnClose.innerHTML = '✕ סגור';
  topbar.appendChild(title); topbar.appendChild(btnShare); topbar.appendChild(btnClose);
  var frame = document.createElement('iframe');
  frame.id = 'rFrame';
  frame.style.cssText = 'flex:1;border:none;width:100%;background:#fff';
  overlay.appendChild(topbar); overlay.appendChild(frame);
  document.body.appendChild(overlay);
  btnClose.addEventListener('click', function () { var el = document.getElementById('reportOverlay'); if (el) el.remove(); });
  _pdfHtml = html;
  btnShare.addEventListener('click', function () {
    var blob = new Blob([_pdfHtml], { type: 'text/html;charset=utf-8' });
    _shareFile(blob, 'hours_report_' + new Date().toISOString().slice(0, 10) + '.html');
  });
  try { frame.contentDocument.open(); frame.contentDocument.write(html); frame.contentDocument.close(); }
  catch (e) { frame.srcdoc = html; }
}

// ---- EXPORT JSON / CSV / XLSX ----
function expJSON() {
  var data = JSON.stringify({ workData: D.g(), settings: D.gs() }, null, 2);
  _shareFile(new Blob([data], { type: 'application/json' }), 'backup_' + new Date().toISOString().slice(0, 10) + '.json');
}

function expCSV() {
  var per = document.getElementById('csvPer') ? document.getElementById('csvPer').value : 'all';
  var dates = null;
  if (per !== 'all') {
    dates = getDts(per, 'csvS', 'csvE');
    if (!dates.length) { showToast('בחר טווח תאריכים תקין'); return; }
  }
  closeM('mCSV');
  _showTableReport(false, dates);
}

function expXLSX() {
  var per = document.getElementById('xlsxPer') ? document.getElementById('xlsxPer').value : 'all';
  var dates = null;
  if (per !== 'all') {
    dates = getDts(per, 'xlsxS', 'xlsxE');
    if (!dates.length) { showToast('בחר טווח תאריכים תקין'); return; }
  }
  var opts = {
    rate: document.getElementById('xo1') ? document.getElementById('xo1').classList.contains('on') : true,
    ot: D.gs().calcOvertime && (document.getElementById('xo2') ? document.getElementById('xo2').classList.contains('on') : false),
    bonus: document.getElementById('xo3') ? document.getElementById('xo3').classList.contains('on') : true,
    note: document.getElementById('xo4') ? document.getElementById('xo4').classList.contains('on') : false,
    job: document.getElementById('xo5') ? document.getElementById('xo5').classList.contains('on') : false,
    partner: document.getElementById('xo6') ? document.getElementById('xo6').classList.contains('on') : false
  };
  closeM('mXLSX');
  _showTableReport(true, dates, opts);
}

function _showTableReport(detailed, filterDates, xlsxOpts) {
  var d = D.g(), s = D.gs(), jobs = s.jobs || [], pd = D.gp();
  var HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  var today = new Date().toLocaleDateString('he-IL');
  var totalH = 0, totalP = 0, totalBase = 0, totalPartner = 0;
  var rows = '';
  var allKeys = Object.keys(d).sort();
  var activeSet = filterDates ? new Set(filterDates.map(function (dt) { return fk(dt); })) : null;
  var ox = xlsxOpts || { rate: true, ot: false, bonus: true, note: false, job: false, partner: false };

  var maxExtra = 0;
  allKeys.forEach(function (k) {
    if (activeSet && !activeSet.has(k)) return;
    var r = d[k];
    var _b = (r.bonuses || []).reduce(function (a, x) { return a + (parseFloat(x.amount) || 0); }, 0);
    if (!(r.hours > 0) && !(_b > 0)) return;
    maxExtra = Math.max(maxExtra, (r.extraJobs || []).length);
  });

  allKeys.forEach(function (k) {
    if (activeSet && !activeSet.has(k)) return;
    var r = d[k]; if (!(r.hours > 0)) return;
    var pr = cp(r.hours, r.rate, r.bonuses);
    var dayTot = cpDay(r);
    var dt = new Date(k);
    var jobName = ((jobs[r.jobIdx || 0]) || {}).name || 'ראשי';
    var bon = (r.bonuses || []).reduce(function (s2, b) { return s2 + (parseFloat(b.amount) || 0); }, 0);
    totalH += dayTot.allHours; totalBase += dayTot.base; totalP += dayTot.total;
    rows += '<tr>';
    rows += '<td>' + (detailed ? '<strong>' : '') + k + (detailed ? '</strong>' : '') + '</td>';
    rows += '<td style="color:#64748B">' + HE[dt.getDay()] + '</td>';
    rows += '<td style="font-weight:600;color:#1E3A8A">' + r.hours + '</td>';
    if (detailed && ox.rate) rows += '<td style="color:#475569">' + r.rate + '</td>';
    if (detailed && ox.ot) {
      rows += '<td style="color:#475569">' + (pr.reg || r.hours).toFixed(1) + '</td>';
      rows += '<td style="color:#F59E0B;font-weight:500">' + (pr.ot1 || 0).toFixed(1) + '</td>';
      rows += '<td style="color:#EF4444;font-weight:500">' + (pr.ot2 || 0).toFixed(1) + '</td>';
    }
    var extras = r.extraJobs || [];
    for (var ei = 0; ei < maxExtra; ei++) {
      if (extras[ei]) {
        var ej = extras[ei]; var ejr = cpExtra(ej.hours || 0, ej.rate || 0);
        rows += '<td style="color:#0EA5E9;font-weight:500">' + ej.hours + '</td>';
        rows += '<td style="color:#0EA5E9">\u20aa' + Math.round(ejr.base).toLocaleString('he-IL') + '</td>';
      } else { rows += '<td style="color:#CBD5E1">-</td><td style="color:#CBD5E1">-</td>'; }
    }
    rows += '<td style="font-weight:600;color:#1E3A8A;font-size:13px">\u20aa' + Math.round(pr.base).toLocaleString('he-IL') + '</td>';
    rows += '<td style="color:#D97706;font-weight:500">' + (bon > 0 ? '\u20aa' + bon.toFixed(0) : '-') + '</td>';
    rows += '<td style="font-weight:700;color:#166534;font-size:13px">\u20aa' + Math.round(dayTot.total).toLocaleString('he-IL') + '</td>';
    if (detailed && ox.note) rows += '<td style="color:#64748B">' + (r.note || '') + '</td>';
    if (detailed && ox.job) rows += '<td style="color:#475569">' + jobName + '</td>';
    if (detailed && ox.partner) {
      var pp = pd[k];
      if (pp && pp.hours > 0) { var ppr = cp(pp.hours, pp.rate || 50, pp.bonuses); totalPartner += ppr.total; rows += '<td style="color:#0EA5E9;font-weight:500">\u20aa' + Math.round(ppr.total).toLocaleString('he-IL') + '</td>'; }
      else rows += '<td style="color:#94A3B8">-</td>';
    }
    rows += '</tr>';
  });

  // שורת סיכום
  rows += '<tr style="background:#1E3A8A;color:white;font-weight:bold;font-size:13px">';
  rows += '<td>סיכום כללי</td><td></td>';
  rows += '<td>' + totalH.toFixed(1) + '</td>';
  if (detailed && ox.rate) rows += '<td></td>';
  if (detailed && ox.ot) rows += '<td></td><td></td><td></td>';
  for (var ei = 0; ei < maxExtra; ei++) rows += '<td></td><td></td>';
  rows += '<td>₪' + Math.round(totalBase).toLocaleString('he-IL') + '</td>';
  rows += '<td>₪' + Math.round(totalP - totalBase).toLocaleString('he-IL') + '</td>';
  rows += '<td>₪' + Math.round(totalP).toLocaleString('he-IL') + '</td>';
  if (detailed && ox.note) rows += '<td></td>';
  if (detailed && ox.job) rows += '<td></td>';
  if (detailed && ox.partner) rows += '<td>' + (totalPartner > 0 ? '₪' + Math.round(totalPartner).toLocaleString('he-IL') : '') + '</td>';
  rows += '</tr>';

  if (detailed && ox.partner && totalPartner > 0) {
    var colsCount = 3 + (detailed && ox.rate ? 1 : 0) + (detailed && ox.ot ? 3 : 0) + (maxExtra * 2) + 3 + (detailed && ox.note ? 1 : 0) + (detailed && ox.job ? 1 : 0);
    rows += '<tr style="background:#2563EB;color:white;font-weight:bold;font-size:14px">';
    rows += '<td colspan="' + colsCount + '" style="text-align:left;padding-left:15px">סך הכל שכר משותף (שלי + פרטנר):</td>';
    rows += '<td>₪' + Math.round(totalP + totalPartner).toLocaleString('he-IL') + '</td>';
    rows += '</tr>';
  }

  var HEL = ['\u05d0', '\u05d1', '\u05d2', '\u05d3', '\u05d4'];
  var headerCols = '<th>\u05ea\u05d0\u05e8\u05d9\u05da</th><th>\u05d9\u05d5\u05dd</th><th>\u05e9\u05e2\u05d5\u05ea \u05e2\u05d1 \u05d0</th>';
  if (detailed && ox.rate) headerCols += '<th>\u05ea\u05e2\u05e8\u05d9\u05e3</th>';
  if (detailed && ox.ot) headerCols += '<th>\u05e8\u05d2\u05d9\u05dc\u05d5\u05ea</th><th>125%</th><th>150%</th>';
  for (var ei2 = 0; ei2 < maxExtra; ei2++) { var lbl = HEL[ei2 + 1] || String(ei2 + 2); headerCols += '<th>\u05e9\u05e2\u05d5\u05ea \u05e2\u05d1 ' + lbl + '</th><th>\u05e1\u05db\u05d5\u05dd ' + lbl + ' \u20aa</th>'; }
  headerCols += '<th>\u05e2\u05d1 \u05d0 \u20aa</th><th>\u05d1\u05d5\u05e0\u05d5\u05e1 \u20aa</th><th>\u05e1\u05d4"\u05db \u20aa</th>';
  if (detailed && ox.note) headerCols += '<th>\u05d4\u05e2\u05e8\u05d4</th>';
  if (detailed && ox.job) headerCols += '<th>\u05e2\u05d1\u05d5\u05d3\u05d4</th>';
  if (detailed && ox.partner) headerCols += '<th>\u05e4\u05e8\u05d8\u05e0\u05e8 \u20aa</th>';

  var title = detailed ? '\u05d3\u05d5\u05d7 \u05de\u05e4\u05d5\u05e8\u05d8 Excel' : '\u05d3\u05d5\u05d7 CSV';

  // CSV
  var hdr = ['\u05ea\u05d0\u05e8\u05d9\u05da', '\u05d9\u05d5\u05dd', '\u05e9\u05e2\u05d5\u05ea \u05e2\u05d1 \u05d0'];
  if (detailed && ox.rate) hdr.push('\u05ea\u05e2\u05e8\u05d9\u05e3');
  if (detailed && ox.ot) hdr = hdr.concat(['\u05e8\u05d2\u05d9\u05dc\u05d5\u05ea', '125%', '150%']);
  for (var ei3 = 0; ei3 < maxExtra; ei3++) { var lbl2 = HEL[ei3 + 1] || String(ei3 + 2); hdr.push('\u05e9\u05e2\u05d5\u05ea \u05e2\u05d1 ' + lbl2); hdr.push('\u05e1\u05db\u05d5\u05dd ' + lbl2 + ' \u20aa'); }
  hdr.push('\u05e2\u05d1 \u05d0 \u20aa', '\u05d1\u05d5\u05e0\u05d5\u05e1 \u20aa', '\u05e1\u05d4"\u05db \u20aa');
  if (detailed && ox.note) hdr.push('\u05d4\u05e2\u05e8\u05d4');
  if (detailed && ox.job) hdr.push('\u05e2\u05d1\u05d5\u05d3\u05d4');
  if (detailed && ox.partner) hdr.push('\u05e4\u05e8\u05d8\u05e0\u05e8');
  var csvLines = [hdr.join(',')];
  allKeys.forEach(function (k) {
    if (activeSet && !activeSet.has(k)) return;
    var r = d[k];
    var bon = (r.bonuses || []).reduce(function (s2, b) { return s2 + (parseFloat(b.amount) || 0); }, 0);
    if (!(r.hours > 0) && !(bon > 0)) return;
    var pr = cp(r.hours, r.rate, r.bonuses);
    var dayTot = cpDay(r);
    var dt = new Date(k);
    var jobName = ((jobs[r.jobIdx || 0]) || {}).name || '\u05e8\u05d0\u05e9\u05d9';
    var cols = [k, HE[dt.getDay()], r.hours];
    if (detailed && ox.rate) cols.push(r.rate);
    if (detailed && ox.ot) cols = cols.concat([(pr.reg || r.hours).toFixed(1), (pr.ot1 || 0).toFixed(1), (pr.ot2 || 0).toFixed(1)]);
    var extras2 = r.extraJobs || [];
    for (var ei4 = 0; ei4 < maxExtra; ei4++) { if (extras2[ei4]) { var ej2 = extras2[ei4]; var ejr2 = cpExtra(ej2.hours || 0, ej2.rate || 0); cols.push(ej2.hours); cols.push(Math.round(ejr2.base)); } else { cols.push(''); cols.push(''); } }
    cols.push(Math.round(pr.base), bon.toFixed(0), Math.round(dayTot.total));
    if (detailed && ox.note) cols.push(r.note || '');
    if (detailed && ox.job) cols.push(jobName);
    if (detailed && ox.partner) { var pp = pd[k]; cols.push(pp && pp.hours > 0 ? Math.round(cp(pp.hours, pp.rate || 50, pp.bonuses).total) : ''); }
    csvLines.push(cols.map(function (cv) { return '"' + String(cv).replace(/"/g, '""') + '"'; }).join(','));
  });
  csvLines.push('');
  var sumCols = ['סיכום כללי', '', totalH.toFixed(1)];
  if (detailed && ox.rate) sumCols.push('');
  if (detailed && ox.ot) sumCols = sumCols.concat(['', '', '']);
  for (var ei5 = 0; ei5 < maxExtra; ei5++) { sumCols.push(''); sumCols.push(''); }
  sumCols.push(Math.round(totalBase), Math.round(totalP - totalBase), Math.round(totalP));
  if (detailed && ox.note) sumCols.push('');
  if (detailed && ox.job) sumCols.push('');
  if (detailed && ox.partner) sumCols.push(totalPartner > 0 ? Math.round(totalPartner) : '');
  csvLines.push(sumCols.map(function (cv) { return '"' + String(cv).replace(/"/g, '""') + '"'; }).join(','));
  if (detailed && ox.partner && totalPartner > 0) {
    var partnerSumCols = Array(sumCols.length - 1).fill('');
    partnerSumCols[0] = 'סך הכל משותף (שלי + פרטנר):';
    partnerSumCols.push(Math.round(totalP + totalPartner));
    csvLines.push(partnerSumCols.map(function (cv) { return '"' + String(cv).replace(/"/g, '""') + '"'; }).join(','));
  }
  var csvText = '\uFEFF' + csvLines.join('\r\n');

  var htmlContent = '<!DOCTYPE html><html dir="rtl" lang="he"><head><meta charset="UTF-8">'
    + '<meta name="viewport" content="width=device-width,initial-scale=1"><title>' + title + '</title>'
    + '<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:13px;color:#0F172A;direction:rtl;padding:12px;overflow-x:auto}'
    + 'table{width:100%;border-collapse:collapse;min-width:460px;margin-bottom:16px}'
    + 'th{background:#1E3A8A;color:#fff;padding:10px 8px;text-align:right;white-space:nowrap;font-size:12px;font-weight:600;border-bottom:3px solid #1D4ED8}'
    + 'td{padding:9px 8px;border-bottom:1px solid #E2E8F0;white-space:nowrap;font-size:12px;vertical-align:middle}'
    + 'tr:nth-child(even) td{background:#F8FAFF}tr:hover td{background:#EFF6FF}'
    + '.summary{background:linear-gradient(135deg,#1E3A8A,#2563EB);color:#fff;padding:14px 20px;text-align:center;font-weight:700;font-size:15px;border-radius:10px;margin-top:4px}'
    + '.summary span{opacity:.8;font-weight:400;font-size:12px;display:block;margin-top:4px}'
    + '</style></head><body>'
    + '<table><thead><tr>' + headerCols + '</tr></thead><tbody>' + rows + '</tbody></table>'
    + '<div class="summary">\u05e1\u05d4"\u05db: ' + totalH.toFixed(1) + ' \u05e9\u05e2\u05d5\u05ea | \u05e2\u05d1\u05d5\u05d3\u05d4: \u20aa' + Math.round(totalBase).toLocaleString('he-IL') + ' | \u05d1\u05d5\u05e0\u05d5\u05e1: \u20aa' + Math.round(totalP - totalBase).toLocaleString('he-IL') + ' | \u05e1\u05d4"\u05db: \u20aa' + Math.round(totalP).toLocaleString('he-IL')
    + (detailed && ox.partner && totalPartner > 0 ? ' | \u05d1\u05d9\u05d7\u05d3: \u20aa' + Math.round(totalP + totalPartner).toLocaleString('he-IL') : '')
    + '<span>' + today + '</span></div></body></html>';

  var existing = document.getElementById('reportOverlay'); if (existing) existing.remove();
  var overlay = document.createElement('div');
  overlay.id = 'reportOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#fff;display:flex;flex-direction:column;overflow:hidden';
  var topbar = document.createElement('div');
  topbar.style.cssText = 'background:#166534;color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;gap:8px';
  var titleEl = document.createElement('span'); titleEl.style.cssText = 'font-size:14px;font-weight:400;flex:1'; titleEl.textContent = title;
  var btnShare = document.createElement('button');
  btnShare.style.cssText = 'background:rgba(255,255,255,.22);border:none;color:#fff;padding:9px 16px;border-radius:8px;font-size:13px;font-weight:400;cursor:pointer;white-space:nowrap';
  btnShare.textContent = '\ud83d\udce4 \u05e9\u05ea\u05e3';
  var btnClose = document.createElement('button');
  btnClose.style.cssText = 'background:rgba(239,68,68,.8);border:none;color:#fff;padding:9px 14px;border-radius:8px;font-size:13px;font-weight:400;cursor:pointer;white-space:nowrap';
  btnClose.textContent = '\u2715 \u05e1\u05d2\u05d5\u05e8';
  topbar.appendChild(titleEl); topbar.appendChild(btnShare); topbar.appendChild(btnClose);
  var frame = document.createElement('iframe');
  frame.style.cssText = 'flex:1;border:none;width:100%;background:#fff';
  overlay.appendChild(topbar); overlay.appendChild(frame);
  document.body.appendChild(overlay);
  _saveToReportHistory(htmlContent, detailed ? 'xlsx' : 'table');
  btnClose.addEventListener('click', function () { var el = document.getElementById('reportOverlay'); if (el) el.remove(); });
  btnShare.addEventListener('click', function () {
    var fileName = (detailed ? 'hours_detailed' : 'hours') + '_' + new Date().toISOString().slice(0, 10) + '.csv';
    _shareFile(new Blob([csvText], { type: 'text/csv;charset=utf-8' }), fileName);
  });
  try { frame.contentDocument.open(); frame.contentDocument.write(htmlContent); frame.contentDocument.close(); } catch (e) { frame.srcdoc = htmlContent; }
}

// ---- RESTORE ----
function triggerRestore(type) {
  var input = document.getElementById('restoreFileInput');
  input.accept = type === 'csv' ? '.csv' : '.json';
  input.value = '';
  input.style.display = 'block';
  input.style.position = 'fixed';
  input.style.top = '-100px';
  input.click();
  setTimeout(function () { input.style.display = 'none'; input.style.position = ''; input.style.top = ''; }, 500);
}

function setRestoreStatus(msg, isErr) {
  var el = document.getElementById('restore-status');
  if (!el) return;
  el.style.display = 'block';
  el.style.color = isErr ? 'var(--r)' : 'var(--g)';
  el.textContent = msg;
  if (!isErr) setTimeout(function () { el.style.display = 'none'; }, 3000);
}

function restoreData(e) {
  var file = e.target.files && e.target.files[0];
  if (!file) { setRestoreStatus('לא נבחר קובץ', true); return; }
  var ext = file.name.split('.').pop().toLowerCase();
  var reader = new FileReader();
  reader.onerror = function () { setRestoreStatus('שגיאה בקריאת הקובץ', true); };
  reader.onload = function (ev) {
    var text = ev.target.result;
    try {
      if (ext === 'json') { _restoreFromJSON(text); }
      else if (ext === 'csv') { _restoreFromCSV(text); }
      else { _restoreFromJSON(text); }
    } catch (err) { setRestoreStatus('שגיאה: ' + err.message, true); }
  };
  reader.readAsText(file, 'utf-8');
}

function _restoreFromJSON(text) {
  text = text.replace(/^\uFEFF/, '').trim();
  var p;
  try { p = JSON.parse(text); } catch (e) { setRestoreStatus('קובץ JSON לא תקין: ' + e.message, true); return; }
  var existing = D.g(), s = D.gs();
  var defaultRate = ((s.jobs && s.jobs[0] && s.jobs[0].rate) || 50);
  var restoredDays = 0, restoredSettings = false;
  if (Array.isArray(p)) {
    p.forEach(function (item) {
      if (!item || !item.date) return;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date)) return;
      var hours = parseFloat(item.hours) || 0;
      if (hours <= 0) return;
      existing[item.date] = Object.assign({}, existing[item.date] || {}, { hours: hours, rate: parseFloat(item.rate) || defaultRate, note: item.note || '' });
      restoredDays++;
    });
  } else if (p.workData && typeof p.workData === 'object') {
    Object.assign(existing, p.workData);
    restoredDays = Object.keys(p.workData).length;
    if (p.settings && typeof p.settings === 'object') {
      var cur = D.gs();
      var merged = Object.assign({}, p.settings);
      if (cur.myUID) merged.myUID = cur.myUID;
      D.ss(merged); restoredSettings = true;
    }
  } else if (typeof p === 'object') {
    var keys = Object.keys(p);
    var dateKeys = keys.filter(function (k) { return /^\d{4}-\d{2}-\d{2}$/.test(k); });
    if (dateKeys.length > 0) { dateKeys.forEach(function (k) { existing[k] = Object.assign({}, existing[k] || {}, p[k]); restoredDays++; }); }
    else { setRestoreStatus('פורמט JSON לא מוכר', true); return; }
  }
  if (restoredDays === 0 && !restoredSettings) { setRestoreStatus('הקובץ ריק או לא מכיל נתוני שעות', true); return; }
  D.s(existing);
  setRestoreStatus('✅ שוחזרו ' + restoredDays + ' ימים' + (restoredSettings ? ' + הגדרות' : ''));
  setTimeout(function () { location.reload(); }, 1000);
}

function _restoreFromCSV(text) {
  text = text.replace(/^\uFEFF/, '').trim();
  var lines = text.split(/\r?\n/).filter(function (l) { return l.trim(); });
  if (lines.length < 2) { setRestoreStatus('קובץ CSV ריק', true); return; }
  function parseLine(line) {
    var cols = [], cur = '', inQ = false;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { cols.push(cur.trim()); cur = ''; }
      else { cur += ch; }
    }
    cols.push(cur.trim()); return cols;
  }
  var headers = parseLine(lines[0]).map(function (h) { return h.replace(/^"|"$/g, '').toLowerCase().trim(); });
  function findCol() { for (var a = 0; a < arguments.length; a++) { var idx = headers.indexOf(arguments[a]); if (idx !== -1) return idx; } return -1; }
  var iDate = findCol('date', 'תאריך'), iHours = findCol('hours', 'שעות'), iRate = findCol('rate', 'תעריף'), iNote = findCol('note', 'הערה', 'notes');
  if (iDate === -1) iDate = 0; if (iHours === -1) iHours = 1;
  var existing = D.g(), s = D.gs(), defaultRate = ((s.jobs && s.jobs[0] && s.jobs[0].rate) || 50), count = 0;
  for (var i = 1; i < lines.length; i++) {
    var cols = parseLine(lines[i]).map(function (v) { return v.replace(/^"|"$/g, '').trim(); });
    if (cols.length < 2) continue;
    var dateStr = cols[iDate] || '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) continue;
    var hours = parseFloat(cols[iHours]) || 0; if (hours <= 0) continue;
    var rate = iRate !== -1 ? (parseFloat(cols[iRate]) || defaultRate) : defaultRate;
    var note = iNote !== -1 ? (cols[iNote] || '') : '';
    existing[dateStr] = Object.assign({}, existing[dateStr] || {}, { hours: hours, rate: rate, note: note });
    count++;
  }
  if (count === 0) { setRestoreStatus('לא נמצאו נתונים. ודא שיש עמודות Date ו-Hours', true); return; }
  D.s(existing);
  setRestoreStatus('✅ שוחזרו ' + count + ' ימים מ-CSV');
  setTimeout(function () { location.reload(); }, 1000);
}

async function restoreFromDrive() {
  if (!aToken) { alert('חבר תחילה את חשבון Google Drive'); return; }
  setRestoreStatus('מחפש גיבוי ב-Drive...');
  document.getElementById('restore-status').style.display = 'block';
  try { await loadDr(); setRestoreStatus('✅ שוחזר מ-Google Drive בהצלחה!'); setTimeout(function () { location.reload(); }, 1000); }
  catch (e) { setRestoreStatus('שגיאה: ' + e.message, true); }
}

function execDel() {
  if (!confirm('האם אתה בטוח?')) return;
  const r = document.getElementById('delR').value;
  if (r === 'all') { D.s({}); location.reload(); return; }
  let data = D.g();
  getDts(r, 'delS', 'delE').forEach(d => delete data[fk(d)]);
  D.s(data); closeM('mDel'); renderCal(); updRep(); saveDr(); vib();
}

// ---- SHARE ----
function _blobToBase64(blob) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onloadend = function () { resolve(reader.result.split(',')[1]); };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function _shareFile(blob, fileName) {
  if (window.CapFS && window.CapShare) {
    try {
      var b64 = await _blobToBase64(blob);
      await window.CapFS.writeFile({ path: fileName, data: b64, directory: 'CACHE', recursive: true });
      var uriRes = await window.CapFS.getUri({ path: fileName, directory: 'CACHE' });
      await window.CapShare.share({ title: fileName, url: uriRes.uri, dialogTitle: 'שתף דוח' });
      return;
    } catch (e) { console.log('Capacitor share failed:', e); }
  }
  try {
    var file = new File([blob], fileName, { type: blob.type || 'application/octet-stream' });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: fileName });
      return;
    }
  } catch (e) { if (e.name === 'AbortError') return; }
  try {
    if (navigator.share) { await navigator.share({ title: 'דוח שעות עבודה', text: 'הדוח מוכן לשיתוף' }); return; }
  } catch (e) { if (e.name === 'AbortError') return; }
  try {
    if (navigator.clipboard) { await navigator.clipboard.writeText('הדוח מוכן. פתח את האפליקציה לצפייה.'); showToast('הדוח מוכן לצפייה בתוך האפליקציה'); return; }
  } catch (e) { }
  showToast('שיתוף אינו נתמך בדפדפן זה');
}
