const sons = {
  violon:
    "https://raw.githubusercontent.com/hayamiou/musiccreator/synthToPiano/assets/violin/violin_C7_v2.wav",
  piano:
    "https://raw.githubusercontent.com/hayamiou/musiccreator/synthToPiano/assets/piano/piano_C7.mp3",
  guitare:
    "https://raw.githubusercontent.com/hayamiou/musiccreator/synthToPiano/assets/guitar/guitar_C7.wav ",
};

// Sampler global (sera recréé quand on change d’instrument)
let sampler;

// Fonction pour créer un sampler pour l’instrument choisi
async function createSampler(instrument) {
  sampler = new Tone.Sampler({
    C7: sons[instrument],
  }).toDestination();
}

// Changement d’instrument
function changerInstrument(instrument) {
  //selection.textContent = "Sélectionné : " + instrument;
  createSampler(instrument);
  console.log("Instrument changé pour :", instrument);
  /* const selectPiano = document.getElementById("piano");
  if (instrument === "piano") {
    selectPiano.style.display = "flex";
  } else {
    selectPiano.style.display = "none";*/
}

// Boutons d’instruments
document
  .getElementById("pianoBtn")
  .addEventListener("click", () => changerInstrument("piano"));
document
  .getElementById("violinBtn")
  .addEventListener("click", () => changerInstrument("violon"));
document
  .getElementById("guitarBtn")
  .addEventListener("click", () => changerInstrument("guitare"));

// Init avec instrument par défaut
changerInstrument("piano");

(function initExpose() {
  window.currentSampler = sampler;
})();

document.getElementById("pianoBtn").click();

const keys = {
  q: "C6",
  s: "D6",
  d: "E6",
  f: "F6",
  g: "G6",
  h: "A6",
  j: "B6",
  k: "C7",
  l: "D7",
  m: "E7",
  n: "F7",
  ",": "G7",
  ";": "A7",
  ":": "B7",
  "!": "C8",
  a: "C#6",
  z: "D#6",
  e: "F#6",
  r: "G#6",
  t: "A#6",
  y: "C#7",
  u: "D#7",
  i: "F#7",
  o: "G#7",
  p: "A#7",
};

async function playNote(note) {
  /* const selectPiano = document.getElementById("piano");
  if (window.getComputedStyle(selectPiano).display === "none") {
    return;
  } */
  await Tone.start();
  sampler.triggerAttackRelease(note, "1n");
  console.log(`Note ${note} jouée !`);
}

document.addEventListener("keydown", (e) => {
  const active = document.activeElement;
  if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) return;

  const key = e.key.toLowerCase();
  const note = keys[key];
  if (note && isPlayed === undefined) {
    playNote(note);
    isPlayed = note;
    // record.push(note + " ");
    if (pressStart === null) {
      const now = performance.now();
      const gap = (now - lastRelease) / 1000;
      record.push("0 ");
      record.push(gap);
      record.push("\n");
      pressStart = now;
    }
    const el = document.getElementById(note);
    console.log(el);
    el.classList.add("highlight");
  }
});

let pressStart = null;
document.addEventListener("keyup", (e) => {
  const active = document.activeElement;
  if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) return;
  const key = e.key.toLowerCase();
  const note = keys[key];
  if (note) {
    if (pressStart !== null) {
      if (note === isPlayed) {
        const now = performance.now();
        const duration = (now - pressStart) / 1000;
        record.push(isPlayed + " ");
        record.push(duration);
        record.push("\n");
        pressStart = null;
        lastRelease = now;
      }
      isPlayed = undefined;
    }
    const el = document.getElementById(note);
    if (el) el.classList.remove("highlight");
  }
});

let isRecording = false;
let record = [];

function start_enregistrement() {
  record = [];
  isRecording = true;
  lastRelease = performance.now();
  const recBtn = document.getElementById("startRecBtn");
  const redCircle = document.getElementById("circle");
  recBtn.innerHTML = "Recording";
  recBtn.style.border = "2px solid red";
  redCircle.style.display = "none";
}

let defaultBtnText;

window.onload = () => {
  defaultBtnText = document.getElementById("startRecBtn").innerHTML;
};

function stop_enregistrement() {
  isRecording = false;
  const now = performance.now();
  const gap = (now - lastRelease) / 1000;
  record.push("0 ");
  record.push(gap);
  record.push("\n");
  const recBtn = document.getElementById("startRecBtn");
  const redCircle = document.getElementById("circle");
  recBtn.innerHTML = defaultBtnText;
  recBtn.style.border = "1px solid rgba(0, 0, 0, 0.08)";
  redCircle.style.display = "block";
}

// === Ajout d'un modal pour choisir le nom du fichier avant téléchargement ===

function telechargement_enregistrement() {
  // Vérifie si le modal existe déjà, sinon le crée
  let modal = document.getElementById("filenameModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "filenameModal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.background = "rgba(0,0,0,0.35)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "9999";

    // Contenu du modal
    const box = document.createElement("div");
    box.style.background = "#fff";
    box.style.padding = "28px 24px 20px 24px";
    box.style.borderRadius = "12px";
    box.style.boxShadow = "0 4px 32px rgba(0,0,0,0.18)";
    box.style.minWidth = "320px";
    box.style.display = "flex";
    box.style.flexDirection = "column";
    box.style.alignItems = "stretch";
    box.style.gap = "12px";

    const label = document.createElement("label");
    label.textContent = "Nom du fichier :";
    label.style.fontWeight = "500";
    label.setAttribute("for", "filenameInput");

    const input = document.createElement("input");
    input.type = "text";
    input.id = "filenameInput";
    input.value = "melody.txt";
    input.style.fontSize = "16px";
    input.style.padding = "8px";
    input.style.border = "1px solid #ccc";
    input.style.borderRadius = "6px";
    input.style.marginBottom = "8px";

    // Pour focus auto
    setTimeout(() => input.focus(), 50);

    const btnRow = document.createElement("div");
    btnRow.style.display = "flex";
    btnRow.style.justifyContent = "flex-end";
    btnRow.style.gap = "10px";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Annuler";
    cancelBtn.style.background = "#f5f5f7";
    cancelBtn.style.border = "none";
    cancelBtn.style.padding = "8px 16px";
    cancelBtn.style.borderRadius = "6px";
    cancelBtn.style.cursor = "pointer";
    cancelBtn.onclick = () => {
      document.body.removeChild(modal);
    };

    const okBtn = document.createElement("button");
    okBtn.textContent = "Télécharger";
    okBtn.style.background = "#1d1d1f";
    okBtn.style.color = "#fff";
    okBtn.style.border = "none";
    okBtn.style.padding = "8px 16px";
    okBtn.style.borderRadius = "6px";
    okBtn.style.cursor = "pointer";
    okBtn.onclick = () => {
      let filename = input.value.trim();
      if (!filename) filename = "melody.txt";
      if (!filename.toLowerCase().endsWith(".txt")) filename += ".txt";
      telecharger_record_avec_nom(filename);
      document.body.removeChild(modal);
    };

    // Entrée clavier: Enter = OK, Escape = Annuler
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        okBtn.click();
      } else if (e.key === "Escape") {
        cancelBtn.click();
      }
    });

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(okBtn);

    box.appendChild(label);
    box.appendChild(input);
    box.appendChild(btnRow);

    modal.appendChild(box);
    document.body.appendChild(modal);
  } else {
    // Si déjà présent, le réaffiche (sécurité)
    modal.style.display = "flex";
    const input = modal.querySelector("#filenameInput");
    if (input) {
      input.value = "melody.txt";
      setTimeout(() => input.focus(), 50);
    }
  }
}

// Fonction utilitaire pour télécharger le fichier avec le nom choisi
function telecharger_record_avec_nom(filename) {
  const file = new File(record, filename, {
    type: "text/plain",
  });
  const url = window.URL.createObjectURL(file);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
  record = [];
}

let isPlayed = undefined;

let lastRelease = performance.now();
