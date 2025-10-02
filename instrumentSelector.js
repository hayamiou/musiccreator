const sons = {
  violon:
    "https://raw.githubusercontent.com/hayamiou/musiccreator/main/assets/violin/violin_A4.mp3",
  piano:
    "https://raw.githubusercontent.com/hayamiou/musiccreator/main/assets/piano/piano_A4.mp3",
  guitare:
    "https://raw.githubusercontent.com/hayamiou/musiccreator/main/assets/guitar/guitar_A4.mp3",
};

const notes = ["A4", "B4", "C4", "D4"];




// Sampler global (sera recréé quand on change d’instrument)
let sampler;

// Fonction pour créer un sampler pour l’instrument choisi
async function createSampler(instrument) {
    if (sampler) {
        sampler.dispose();
        sampler = null;
    }
    const mapping = SAMPLE_SOURCES[instrument] || SAMPLE_SOURCES.piano;
    sampler = new Tone.Sampler(mapping).toDestination();
    await Tone.loaded();
    window.currentSampler = sampler;
}

// Boutons des notes
notes.forEach((note) => {
  const btn = document.getElementById(`playBtn${note}`);
  btn.addEventListener("click", async () => {
    await Tone.start();
    sampler.triggerAttackRelease(note, "1n");
    console.log(`Note ${note} jouée !`);
  });
});

// Changement d’instrument
function changerInstrument(instrument) {
  //selection.textContent = "Sélectionné : " + instrument;
  createSampler(instrument);
  console.log("Instrument changé pour :", instrument);
  const selectPiano = document.getElementById("piano");
  if (instrument === "piano") {
    selectPiano.style.display = "flex";
  } else {
    selectPiano.style.display = "none";
  }
}

// Récupération du texte de sélection
//const selection = document.getElementById("selection");

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

(function initExpose(){ window.currentSampler = sampler; })();
