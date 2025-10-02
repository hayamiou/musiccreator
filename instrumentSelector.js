
const sons = {
    "violon": "https://raw.githubusercontent.com/hayamiou/musiccreator/main/assets/violin/violin_A4.mp3",
    "piano": "https://raw.githubusercontent.com/hayamiou/musiccreator/main/assets/piano/piano_A4.mp3",
    "guitare": "https://raw.githubusercontent.com/hayamiou/musiccreator/main/assets/guitar/guitar_A4.mp3"
};


const notes = ["A4", "B4", "C4", "D4"];

// Sampler global (sera recréé quand on change d’instrument)
let sampler;

// Fonction pour créer un sampler pour l’instrument choisi
function createSampler(instrument) {
    sampler = new Tone.Sampler(
        {
            "A4": sons[instrument]
        }
    ).toDestination();
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
}

// Récupération du texte de sélection
//const selection = document.getElementById("selection");

// Boutons d’instruments
document.getElementById("pianoBtn").addEventListener("click", () => changerInstrument("piano"));
document.getElementById("violinBtn").addEventListener("click", () => changerInstrument("violon"));
document.getElementById("guitarBtn").addEventListener("click", () => changerInstrument("guitare"));

// Init avec instrument par défaut
changerInstrument("piano");
