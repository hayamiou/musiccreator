
const sons = {
  violon:
    "https://raw.githubusercontent.com/hayamiou/musiccreator/main/assets/violin/violin_A4.mp3",
  piano:
    "https://raw.githubusercontent.com/hayamiou/musiccreator/develop/assets/piano/piano_A4.wav",
  guitare:
    "https://raw.githubusercontent.com/hayamiou/musiccreator/main/assets/guitar/guitar_A4.mp3",
};

// Sampler global (sera recréé quand on change d’instrument)
let sampler;

// Fonction pour créer un sampler pour l’instrument choisi
async function createSampler(instrument) {
    sampler = new Tone.Sampler(
        {
            "A4": sons[instrument]
        }
    ).toDestination();
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
changerInstrument("violon");

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
  const key = e.key.toLowerCase();
  const note = keys[key];
  if (note) {
    playNote(note);
    console.log(note);
    const el = document.getElementById(note);
    console.log(el)
    el.classList.add("highlight");
  }
});

document.addEventListener("keyup", (e) => {
  const key = e.key.toLowerCase();
  const note = keys[key];
  if (note) {
    const el = document.getElementById(note);
    if (el) el.classList.remove("highlight");
  }
});
