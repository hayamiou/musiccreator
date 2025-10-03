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
  window.gameRegisterUserNote?.(note);
  console.log(`Note ${note} jouée !`);
}

document.addEventListener("keydown", (e) => {
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

function telechargement_enregistrement() {
  const file = new File(record, "melody.txt", {
    type: "text/plain",
  });
  const url = window.URL.createObjectURL(file);

  const link = document.createElement("a");
  link.href = url;
  link.download = "melody.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
  record = [];
}

let isPlayed = undefined;

let lastRelease = performance.now();
