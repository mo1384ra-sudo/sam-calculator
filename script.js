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

function goBackToPage1() {
  document.getElementById("page1").classList.remove("hidden");
  document.getElementById("page2").classList.add("hidden");
  document.getElementById("page3").classList.add("hidden");
  document.getElementById("resultA").classList.add("hidden");
  document.getElementById("resultB").classList.add("hidden");
  document.getElementById("mode").value = "";
}

function goBackToIntro() {
  document.getElementById("introPage").classList.remove("hidden");
  goBackToPage1();
}

function calculateA() {
  const tank = parseFloat(document.getElementById("tankA").value);
  const dose = parseFloat(document.getElementById("doseA").value);
  if (tank && dose) {
    const pure = (tank * dose) / 1000;
    const resultEl = document.getElementById("resultA");
    resultEl.innerText = `✅ مقدار سم خالص: ${pure.toFixed(2)} سی‌سی`;
    resultEl.classList.remove("hidden");
  } else {
    alert("لطفاً تمام مقادیر را وارد کنید");
  }
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
