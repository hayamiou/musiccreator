//sons
const sons = {
    "violon": "https://raw.githubusercontent.com/hayamiou/musiccreator/main/assets/violin/violin_A4.mp3",
    "piano": "https://raw.githubusercontent.com/hayamiou/musiccreator/main/assets/piano/piano_A4.mp3",
    "guitare": "https://raw.githubusercontent.com/hayamiou/musiccreator/main/assets/guitar/guitar_A4.mp3"
};


const notes = ["A4", "B4", "C4", "D4"];

notes.forEach((note, index) => {
    const btn = document.getElementById(`playBtn${index}`);
    btn.addEventListener('click', async () => {
        pitchShift.pitch = index
        player.start();
        console.log(`Note ${note} jouée !`);
    });
});

// Fonction pour changer l'instrument sélectionné :
// Met à jour le texte de sélection et charge le son correspondant dans le player
function changerInstrument(instrument) {
    selection.textContent = "Sélectionné : " + instrument;
    player.load(sons[instrument])
    console.log("Instrument changé pour :", instrument);
}

//initialiser le player
const player = new Tone.Player(
    sons["piano"]
).toDestination();
const pitchShift = new Tone.PitchShift().toDestination();
player.connect(pitchShift);

// Récupérer le bouton Play 
// TODO : à suppr et remplacer par un vrai piano
const playBtn = document.getElementById('playBtnA4');


// Récupération du texte de sélection d'instrument
// Exemple : "Sélectionné : guitare"
const selection = document.getElementById("selection");

// Ajout des écouteurs d'événement
document.getElementById("pianoBtn").addEventListener("click", () => changerInstrument("piano"));
document.getElementById("violonBtn").addEventListener("click", () => changerInstrument("violon"));
document.getElementById("guitarBtn").addEventListener("click", () => changerInstrument("guitare"));

// Initialisation avec l'instrument par défaut
changerInstrument("Piano")