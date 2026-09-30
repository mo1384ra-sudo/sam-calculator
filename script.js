function enterApp() {
  document.getElementById("introPage").classList.add("hidden");
  document.getElementById("page1").classList.remove("hidden");
}

function goToPage() {
  const mode = document.getElementById("mode").value;
  document.getElementById("page1").classList.add("hidden");
  document.getElementById("page2").classList.toggle("hidden", mode !== 'a');
  document.getElementById("page3").classList.toggle("hidden", mode !== 'b');
}


function calculateB() {
  const tank = parseFloat(document.getElementById("tankB").value);
  const dose = parseFloat(document.getElementById("doseB").value);
  const width = parseFloat(document.getElementById("widthB").value);
  const speed = parseFloat(document.getElementById("speedB").value);
  const flow30 = parseFloat(document.getElementById("flowB").value);

  if (tank && dose && width && speed && flow30) {
    const pure = (dose * tank * width * speed) / (10000 * flow30);
    const resultEl = document.getElementById("resultB");
    resultEl.innerText = `✅ مقدار سم خالص: ${pure.toFixed(2)} کیلوگرم یا لیتر`;
    resultEl.classList.remove("hidden");
  } else {
    alert("لطفاً تمام فیلدها را تکمیل کنید");
  }
}

// مودال‌ها
function openNozzleHelp() {
  document.getElementById("helpModalNozzle").classList.remove("hidden");
}
function closeNozzleHelp() {
  document.getElementById("helpModalNozzle").classList.add("hidden");
}
function openSpeedHelp() {
  document.getElementById("helpModalSpeed").classList.remove("hidden");
}
function closeSpeedHelp() {
  document.getElementById("helpModalSpeed").classList.add("hidden");
}
function openDoseHelp() {
  document.getElementById("helpModalDose").classList.remove("hidden");
}
function closeDoseHelp() {
  document.getElementById("helpModalDose").classList.add("hidden");
}
// ==========================================
// داشبورد و ناوبری
// ==========================================
function backToDashboard() {
  document.querySelectorAll('#introPage, #page1, #page2, #page3, #pageWater, #pageArea, #pageHistory, #pageHelp')
    .forEach(el => el.classList.add('hidden'));
  document.getElementById('introPage').classList.remove('hidden');
  // پاک کردن فیلدها
  document.querySelectorAll('input').forEach(i => {
    i.value = '';
    i.classList.remove('input-error');
  });
  document.querySelectorAll('.error-msg').forEach(e => e.classList.remove('show'));
  document.querySelectorAll('#resultA, #resultB, #resultWater, #resultArea').forEach(r => r.classList.add('hidden'));
  document.getElementById('mode').value = '';
}

// ==========================================
// هشدار خطا زیر فیلدها
// ==========================================
function showError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const err = document.getElementById('err-' + fieldId);
  if (input) input.classList.add('input-error');
  if (err) {
    if (message) err.textContent = '⚠️ ' + message;
    err.classList.add('show');
  }
}

function clearErrors(fields) {
  fields.forEach(id => {
    const input = document.getElementById(id);
    const err = document.getElementById('err-' + id);
    if (input) input.classList.remove('input-error');
    if (err) err.classList.remove('show');
  });
}

function isPositive(value) {
  const n = parseFloat(value);
  return !isNaN(n) && n > 0;
}

// ==========================================
// تاریخچه محاسبات
// ==========================================
function saveToHistory(type, result, unit) {
  const history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
  const now = new Date();
  const date = now.toLocaleDateString('fa-IR');
  const time = now.toLocaleTimeString('fa-IR', {hour: '2-digit', minute: '2-digit'});
  
  history.unshift({
    type: type,
    result: result,
    unit: unit,
    date: date,
    time: time,
    timestamp: now.getTime()
  });
  
  localStorage.setItem('calcHistory', JSON.stringify(history.slice(0, 50)));
}

function openHistory() {
  document.querySelectorAll('#introPage, #page1, #page2, #page3, #pageWater, #pageArea, #pageHelp')
    .forEach(el => el.classList.add('hidden'));
  document.getElementById('pageHistory').classList.remove('hidden');
  renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
  const container = document.getElementById('historyContent');
  
  if (history.length === 0) {
    container.innerHTML = '<div class="history-empty">هنوز محاسبه‌ای ثبت نشده است.</div>';
    return;
  }
  
  let html = '<table class="history-table"><thead><tr><th>تاریخ</th><th>نوع</th><th>نتیجه</th></tr></thead><tbody>';
  history.forEach(h => {
    html += `<tr>
      <td>${h.date}<br><small style="opacity:0.7">${h.time || ''}</small></td>
      <td>${h.type}</td>
      <td><strong>${h.result} ${h.unit}</strong></td>
    </tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}

function clearHistory() {
  if (confirm('آیا از پاک کردن تمام سابقه مطمئن هستید؟')) {
    localStorage.removeItem('calcHistory');
    renderHistory();
  }
}

// ==========================================
// محاسبه آب موردنیاز
// ==========================================
function openWaterCalc() {
  document.querySelectorAll('#introPage, #page1, #page2, #page3, #pageArea, #pageHistory, #pageHelp')
    .forEach(el => el.classList.add('hidden'));
  document.getElementById('pageWater').classList.remove('hidden');
}

function calculateWater() {
  clearErrors(['poisonAmount', 'concentration']);
  
  const amount = parseFloat(document.getElementById('poisonAmount').value);
  const conc = parseFloat(document.getElementById('concentration').value);
  
  let hasError = false;
  if (!isPositive(amount)) { showError('poisonAmount', 'مقدار سم را وارد کنید'); hasError = true; }
  if (!isPositive(conc)) { showError('concentration', 'غلظت باید بیشتر از صفر باشد'); hasError = true; }
  if (hasError) return;
  
  const water = (amount * 1000) / conc;
  const resultEl = document.getElementById('resultWater');
  resultEl.innerHTML = `✅ مقدار آب موردنیاز: <strong>${water.toFixed(1)} لیتر</strong><br>
    <small style="opacity:0.8">فرمول: (${amount} × 1000) ÷ ${conc} = ${water.toFixed(1)}</small>`;
  resultEl.classList.remove('hidden');
  
  saveToHistory('آب موردنیاز', water.toFixed(1), 'لیتر');
}

// ==========================================
// محاسبه مساحت زمین
// ==========================================
function openAreaCalc() {
  document.querySelectorAll('#introPage, #page1, #page2, #page3, #pageWater, #pageHistory, #pageHelp')
    .forEach(el => el.classList.add('hidden'));
  document.getElementById('pageArea').classList.remove('hidden');
}

function toggleAreaMethod() {
  const method = document.getElementById('areaMethod').value;
  document.getElementById('rectInputs').classList.toggle('hidden', method !== 'rect');
  document.getElementById('hectareInput').classList.toggle('hidden', method !== 'hectare');
}

function calculateArea() {
  const method = document.getElementById('areaMethod').value;
  clearErrors(['landLength', 'landWidth', 'hectareDirect']);
  
  let areaSquareMeters = 0;
  let formula = '';
  
  if (method === 'rect') {
    const len = parseFloat(document.getElementById('landLength').value);
    const wid = parseFloat(document.getElementById('landWidth').value);
    let hasError = false;
    if (!isPositive(len)) { showError('landLength', 'طول را وارد کنید'); hasError = true; }
    if (!isPositive(wid)) { showError('landWidth', 'عرض را وارد کنید'); hasError = true; }
    if (hasError) return;
    
    areaSquareMeters = len * wid;
    formula = `${len} × ${wid} = ${areaSquareMeters} مترمربع`;
  } else {
    const ha = parseFloat(document.getElementById('hectareDirect').value);
    if (!isPositive(ha)) { showError('hectareDirect', 'مساحت را وارد کنید'); return; }
    areaSquareMeters = ha * 10000;
    formula = `${ha} هکتار = ${areaSquareMeters} مترمربع`;
  }
  
  const hectare = areaSquareMeters / 10000;
  const resultEl = document.getElementById('resultArea');
  resultEl.innerHTML = `✅ مساحت زمین:<br>
    <strong>${areaSquareMeters.toLocaleString('fa-IR')} مترمربع</strong><br>
    <strong>${hectare.toFixed(2)} هکتار</strong><br>
    <small style="opacity:0.8">${formula}</small>`;
  resultEl.classList.remove('hidden');
  
  saveToHistory('مساحت زمین', hectare.toFixed(2), 'هکتار');
}

// ==========================================
// راهنما
// ==========================================
function openHelp() {
  document.querySelectorAll('#introPage, #page1, #page2, #page3, #pageWater, #pageArea, #pageHistory')
    .forEach(el => el.classList.add('hidden'));
  document.getElementById('pageHelp').classList.remove('hidden');
}

// ==========================================
// نسخه‌ی به‌روز شده calculateA و calculateB
// ==========================================
function calculateA() {
  clearErrors(['tankA', 'doseA']);
  const tank = parseFloat(document.getElementById('tankA').value);
  const dose = parseFloat(document.getElementById('doseA').value);
  
  let hasError = false;
  if (!isPositive(tank)) { showError('tankA', 'حجم مخزن باید بیشتر از صفر باشد'); hasError = true; }
  if (!isPositive(dose)) { showError('doseA', 'میزان توصیه‌شده را وارد کنید'); hasError = true; }
  if (hasError) return;
  
  const pure = (tank * dose) / 1000;
  const resultEl = document.getElementById('resultA');
  resultEl.innerHTML = `✅ مقدار سم خالص: <strong>${pure.toFixed(2)} سی‌سی</strong><br>
    <small style="opacity:0.8">فرمول: (${tank} × ${dose}) ÷ 1000 = ${pure.toFixed(2)}</small>`;
  resultEl.classList.remove('hidden');
  
  saveToHistory('غلظتی', pure.toFixed(2), 'سی‌سی');
}

function calculateB() {
  clearErrors(['tankB', 'doseB', 'widthB', 'speedB', 'flowB']);
  
  const tank = parseFloat(document.getElementById('tankB').value);
  const dose = parseFloat(document.getElementById('doseB').value);
  const width = parseFloat(document.getElementById('widthB').value);
  const speed = parseFloat(document.getElementById('speedB').value);
  const flow30 = parseFloat(document.getElementById('flowB').value);
  
  let hasError = false;
  if (!isPositive(tank)) { showError('tankB', 'حجم مخزن را وارد کنید'); hasError = true; }
  if (!isPositive(dose)) { showError('doseB', 'مقدار توصیه‌شده را وارد کنید'); hasError = true; }
  if (!isPositive(width)) { showError('widthB', 'عرض سمپاشی را وارد کنید'); hasError = true; }
  if (!isPositive(speed)) { showError('speedB', 'سرعت حرکت را وارد کنید'); hasError = true; }
  if (!isPositive(flow30)) { showError('flowB', 'جمع دبی نازل‌ها را وارد کنید'); hasError = true; }
  if (hasError) return;
  
  const pure = (dose * tank * width * speed) / (10000 * flow30);
  const resultEl = document.getElementById('resultB');
  resultEl.innerHTML = `✅ مقدار سم خالص: <strong>${pure.toFixed(2)} کیلوگرم یا لیتر</strong>`;
  resultEl.classList.remove('hidden');
  
  saveToHistory('هکتاری', pure.toFixed(2), 'کیلوگرم/لیتر');
}
