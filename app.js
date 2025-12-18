const RULES = [
  {
    id: "R1",
    if: { gejala: "Bintik-bintik", efek: "Muka berminyak", usia: "10-18" },
    then: { penyakit: "Jerawat", kode: "P04", solusi: "Facial, Obat Jerawat" }
  },
  {
    id: "R2",
    if: { gejala: "Bintik-bintik", efek: "Sakit disentuh", tampilan: "Warna hitam" },
    then: { penyakit: "Skintag", kode: "P03", solusi: "Operasi Laser" }
  },
  {
    id: "R3",
    if: { gejala: "Bintik-bintik", efek: "Muka berminyak", usia: ">40" },
    then: { penyakit: "Skintag", kode: "P03", solusi: "Operasi Laser" }
  },
  {
    id: "R4",
    if: { gejala: "Benjolan", usia: ">40" },
    then: { penyakit: "Skintag", kode: "P03", solusi: "Operasi Laser" }
  },
  {
    id: "R5",
    if: { gejala: "Bintik-bintik", efek: "Sakit disentuh", usia: "10-18", tampilan: "Lainnya" },
    then: { penyakit: "Jerawat", kode: "P04", solusi: "Facial, Obat Jerawat" }
  }
  ,
  {
    id: "R6",
    if: { gejala: "Kulit kemerahan", usia: "10-18", tampilan: "Warna hitam" },
    then: { penyakit: "Skintag", kode: "P03", solusi: "Operasi Laser" }
  },
  {
    id: "R7",
    if: { gejala: "Kulit kemerahan", usia: "10-18", tampilan: "Lainnya" },
    then: { penyakit: "Jerawat", kode: "P04", solusi: "Facial, Obat Jerawat" }
  },
  {
    id: "R10",
    if: { gejala: "Kulit kemerahan", efek: "Sakit disentuh" },
    then: { penyakit: "Rosacea", kode: "P05", solusi: "Konsultasi dermatologis, obat topikal" }
  },
  {
    id: "R11",
    if: { gejala: "Kulit kemerahan", efek: "Muka berminyak" },
    then: { penyakit: "Millia", kode: "P06", solusi: "Eksfoliasi ringan, tindakan kecil oleh profesional" }
  }
  ,
  {
    id: "R8",
    if: { gejala: "Benjolan", efek: "Muka berminyak", usia: ">40", tampilan: "Warna hitam" },
    then: { penyakit: "Skintag", kode: "P03", solusi: "Operasi Laser" }
  },
  {
    id: "R9",
    if: { gejala: "Benjolan", efek: "Sakit disentuh", usia: "10-18" },
    then: { penyakit: "Jerawat", kode: "P04", solusi: "Facial, Obat Jerawat" }
  }
];


const state = {
  currentIndex: 0,
  answers: {
    gejala: null,    
    efek: null,      
    tampilan: null,   
    usia: null        
  }
};

const el = (id) => document.getElementById(id);

const ui = {
  btnStart: el("btnStart"),
  btnReset: el("btnReset"),
  wizard: el("wizard"),
  stepArea: el("stepArea"),
  btnBack: el("btnBack"),
  btnNext: el("btnNext"),
  progressBar: el("progressBar"),
  result: el("result"),
  resultBody: el("resultBody")
};

function shallowCopy(obj){ return JSON.parse(JSON.stringify(obj)); }

function getSteps() {

  const steps = [];

  steps.push({
    key: "gejala",
    title: "Gejala utama yang paling terlihat?",
    desc: "Pilih yang paling dominan",
    options: [
      { value: "Bintik-bintik", hint: "Muncul bintik-bintik pada area wajah." },
      { value: "Benjolan", hint: "Muncul benjolan kecil pada wajah." },
      { value: "Kulit kemerahan", hint: "Terdapat area kemerahan pada wajah." },
    ]
  });

  if (state.answers.gejala === "Bintik-bintik") {
    steps.push({
      key: "efek",
      title: "Efek yang dirasakan/terlihat?",
      desc: "Jawab sesuai kondisi yang paling dekat.",
      options: [
        { value: "Muka berminyak", hint: "Wajah terlihat berminyak (kadang kusam)." },
        { value: "Sakit disentuh", hint: "Terasa nyeri saat disentuh." },
      ]
    });

    if (state.answers.efek === "Muka berminyak") {
      steps.push({
        key: "usia",
        title: "Kelompok usia penderita?",
        desc: "Rule di jurnal memakai rentang usia tertentu.",
        options: [
          { value: "10-18", hint: "Jika usia 10 sampai 18 tahun." },
          { value: ">40", hint: "Jika usia lebih dari 40 tahun." },
          { value: "Lainnya", hint: "Jika usia di luar itu (contoh: 19–40)." },
        ]
      });
    } else if (state.answers.efek === "Sakit disentuh") {
      steps.push({
        key: "usia",
        title: "Kelompok usia penderita?",
        desc: "Pilih kelompok usia (umur muda akan menampilkan pilihan warna).",
        options: [
          { value: "10-18", hint: "Jika usia 10 sampai 18 tahun (muda)." },
          { value: ">40", hint: "Jika usia lebih dari 40 tahun." },
          { value: "Lainnya", hint: "Jika usia di luar itu (contoh: 19–40)." },
        ]
      });

      if (state.answers.usia === "10-18") {
        steps.push({
          key: "tampilan",
          title: "Tampilan dominan (warna)?",
          desc: "Pilih warna tampilan; warna hitam mengarah ke Skintag.",
          options: [
            { value: "Warna hitam", hint: "Bintik tampak berwarna hitam." },
            { value: "Lainnya", hint: "Selain hitam (misal merah/putih)." },
          ]
        });
      }
    }
  }

  if (state.answers.gejala === "Benjolan") {
    // For Benjolan: first ask effect (muka berminyak / sakit disentuh)
    steps.push({
      key: "efek",
      title: "Efek yang dirasakan/terlihat?",
      desc: "Pilih yang paling dekat dengan kondisi benjolan.",
      options: [
        { value: "Muka berminyak", hint: "Wajah terlihat berminyak (kadang kusam)." },
        { value: "Sakit disentuh", hint: "Terasa nyeri saat disentuh." },
      ]
    });

    if (state.answers.efek === "Muka berminyak") {
      steps.push({
        key: "usia",
        title: "Kelompok usia penderita?",
        desc: "Untuk benjolan + muka berminyak, usia tua (>40) akan menampilkan pilihan warna.",
        options: [
          { value: ">40", hint: "Jika usia lebih dari 40 tahun (tua)." },
          { value: "Lainnya", hint: "Jika usia di bawah/sama dengan 40." },
          { value: "10-18", hint: "Jika usia 10 sampai 18 tahun." },
        ]
      });

      if (state.answers.usia === ">40") {
        steps.push({
          key: "tampilan",
          title: "Tampilan dominan (warna)?",
          desc: "Pilih warna tampilan; warna hitam mengarah ke Skintag.",
          options: [
            { value: "Warna hitam", hint: "Ada bagian gelap/hitam." },
            { value: "Lainnya", hint: "Selain hitam (misal merah/putih)." },
          ]
        });
      }
    } else if (state.answers.efek === "Sakit disentuh") {
      // sakit disentuh -> ask usia; if usia muda (10-18) -> final diagnosis Jerawat
      steps.push({
        key: "usia",
        title: "Kelompok usia penderita?",
        desc: "Untuk benjolan + sakit disentuh, usia muda (10-18) mengarah ke Jerawat.",
        options: [
          { value: "10-18", hint: "Jika usia 10 sampai 18 tahun (muda)." },
          { value: ">40", hint: "Jika usia lebih dari 40 tahun." },
          { value: "Lainnya", hint: "Jika usia di luar itu (contoh: 19–40)." },
        ]
      });
    }
  }

  if (state.answers.gejala === "Kulit kemerahan") {
    // For Kulit kemerahan: ask effect (muka berminyak / sakit disentuh)
    steps.push({
      key: "efek",
      title: "Efek yang dirasakan/terlihat?",
      desc: "Pilih yang paling dekat (untuk kulit kemerahan).",
      options: [
        { value: "Muka berminyak", hint: "Wajah terlihat berminyak (kadang kusam)." },
        { value: "Sakit disentuh", hint: "Terasa nyeri saat disentuh." },
      ]
    });
  }

  return steps;
}

function setProgress(current, total){
  const pct = total === 0 ? 0 : Math.round((current / total) * 100);
  ui.progressBar.style.width = `${pct}%`;
}

function renderStep() {
  const steps = getSteps();
  const total = steps.length;
  const idx = Math.min(state.currentIndex, total - 1);
  state.currentIndex = idx;

  setProgress(idx, Math.max(total - 1, 1));

  const step = steps[idx];
  const selectedValue = state.answers[step.key];

  ui.stepArea.innerHTML = `
    <h3 class="step__q">${step.title}</h3>
    <p class="step__desc">${step.desc}</p>
    <div class="options" role="list">
      ${step.options.map(opt => `
        <button class="option ${selectedValue === opt.value ? "option--selected": ""}"
          data-key="${step.key}"
          data-value="${opt.value}"
          role="listitem"
          type="button">
          <div class="option__title">${opt.value}</div>
          <p class="option__hint">${opt.hint}</p>
        </button>
      `).join("")}
    </div>
  `;

  ui.btnBack.disabled = idx === 0;
  ui.btnNext.disabled = !selectedValue;

  ui.btnNext.textContent = (idx === total - 1) ? "Lihat Hasil" : "Lanjut";
}

function resetAll() {
  state.currentIndex = 0;
  state.answers = { gejala: null, efek: null, tampilan: null, usia: null };

  ui.wizard.hidden = true;
  ui.result.hidden = true;

  ui.btnReset.disabled = true;
  ui.btnStart.disabled = false;

  ui.progressBar.style.width = "0%";
}

function startWizard() {
  ui.wizard.hidden = false;
  ui.result.hidden = true;

  ui.btnReset.disabled = false;
  ui.btnStart.disabled = true;

  state.currentIndex = 0;
  renderStep();
  ui.wizard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function clearDependentAnswers(changedKey){
  if (changedKey === "gejala") {
    state.answers.efek = null;
    state.answers.tampilan = null;
    state.answers.usia = null;
  }
  if (changedKey === "efek") {
    state.answers.tampilan = null;
    state.answers.usia = null;
  }
  if (changedKey === "tampilan") {
  }
  if (changedKey === "usia") {
    // when usia changes, dependent tampilan (color) should reset
    state.answers.tampilan = null;
  }
}

function matchRule() {

  const a = state.answers;
  for (const rule of RULES) {
    let ok = true;
    for (const key of Object.keys(rule.if)) {
      if (a[key] !== rule.if[key]) { ok = false; break; }
    }
    if (ok) return rule;
  }
  return null;
}

function explainWhyNotDetected() {
  const a = state.answers;
  const reasons = [];

  if (a.gejala === "Bintik-bintik" && a.efek === "Muka berminyak" && a.usia === "Lainnya") {
    reasons.push("Rule jurnal yang ditampilkan hanya memetakan bintik-bintik + muka berminyak untuk usia 10–18 atau >40.");
  }
  if (a.gejala === "Bintik-bintik" && a.efek === "Sakit disentuh" && a.tampilan === "Lainnya") {
    reasons.push("Rule jurnal yang ditampilkan hanya memetakan bintik-bintik + sakit disentuh untuk tampilan warna hitam.");
  }
  if (a.gejala === "Benjolan" && a.usia === "Lainnya") {
    reasons.push("Rule benjolan pada jurnal yang ditampilkan hanya untuk usia >40.");
  }
  if (a.gejala === "Benjolan" && a.efek === "Muka berminyak") {
    if (a.usia && a.usia !== ">40") {
      reasons.push("Untuk benjolan + muka berminyak, rule yang dipetakan pada dataset mengarah ke usia >40.");
    } else if (a.usia === ">40" && !a.tampilan) {
      reasons.push("Pilih tampilan warna (misal 'Warna hitam') untuk melengkapi rule benjolan + muka berminyak.");
    }
  }
  if (a.gejala === "Benjolan" && a.efek === "Sakit disentuh") {
    if (a.usia && a.usia !== "10-18") {
      reasons.push("Untuk benjolan + sakit disentuh, rule pada dataset mengarah ke usia muda (10-18)." );
    }
  }
  if (a.gejala === "Kulit kemerahan") {
    if (a.efek === "Sakit disentuh" || a.efek === "Muka berminyak") {
      // handled by new rules R10/R11
    } else {
      reasons.push("Pilih 'Muka berminyak' atau 'Sakit disentuh' untuk gejala 'Kulit kemerahan'.");
    }
  }
  if (reasons.length === 0) {
    reasons.push("Tidak ada kombinasi rule yang cocok dengan jawaban yang dipilih.");
  }

  return reasons.map(r => `• ${r}`).join("<br/>");
}

function renderResult() {
  const rule = matchRule();
  const a = state.answers;

  if (rule) {
    ui.resultBody.innerHTML = `
      <h3>${rule.then.penyakit}</h3>

      <div class="kv">
        <div class="k">Gejala</div><div class="v">${a.gejala ?? "-"}</div>
        <div class="k">Efek</div><div class="v">${a.efek ?? "-"}</div>
        <div class="k">Tampilan</div><div class="v">${a.tampilan ?? "-"}</div>
        <div class="k">Usia</div><div class="v">${a.usia ?? "-"}</div>
      </div>

      <div class="callout">
        <p><b>Kode penyakit:</b> ${rule.then.kode}</p>
        <p><b>Saran solusi (ringkas):</b> ${rule.then.solusi}</p>
      </div>
    `;
  } else {
    ui.resultBody.innerHTML = `
      <h3>Tidak ada yang cocok</h3>

      <div class="kv">
        <div class="k">Gejala</div><div class="v">${a.gejala ?? "-"}</div>
        <div class="k">Efek</div><div class="v">${a.efek ?? "-"}</div>
        <div class="k">Tampilan</div><div class="v">${a.tampilan ?? "-"}</div>
        <div class="k">Usia</div><div class="v">${a.usia ?? "-"}</div>
      </div>

    `;
  }

  ui.result.hidden = false;
  ui.result.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ====== Events ====== */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".option");
  if (!btn) return;

  const key = btn.dataset.key;
  const value = btn.dataset.value;

  const prev = state.answers[key];
  state.answers[key] = value;
  if (prev !== value) clearDependentAnswers(key);

  renderStep();
});

ui.btnStart.addEventListener("click", startWizard);
ui.btnReset.addEventListener("click", resetAll);

ui.btnBack.addEventListener("click", () => {
  state.currentIndex = Math.max(0, state.currentIndex - 1);
  renderStep();
});

ui.btnNext.addEventListener("click", () => {
  const steps = getSteps();
  const total = steps.length;
  const idx = state.currentIndex;

  if (idx >= total - 1) {
    renderResult();
    return;
  }

  state.currentIndex = Math.min(total - 1, idx + 1);
  renderStep();
});

resetAll();
