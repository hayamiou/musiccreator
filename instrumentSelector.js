//sons
const sons = {
  "piano": "https://tonejs.github.io/audio/berklee/gong_1.mp3",
  "guitare": "https://tonejs.github.io/audio/berklee/Bang_Tin_1.mp3",
  "violon": "https://tonejs.github.io/audio/berklee/violin_bounce1.mp3"
};

// Fonction pour changer l'instrument sélectionné :
// Met à jour le texte de sélection et charge le son correspondant dans le player
function changerInstrument(instrument) {
    selection.textContent = "Sélectionné : " + instrument;
    player.load(sons[instrument])
}

//initialiser le player
const player = new Tone.Player(
    sons["piano"]
).toDestination();

// Récupérer le bouton Play 
// TODO : à suppr et remplacer par un vrai piano
const playBtn = document.getElementById('playBtn');

// Ajouter l'événement au clic du bouton Play
playBtn.addEventListener('click', async () => {

    Tone.loaded().then(() => {
        player.start();
    });

    console.log('Note G4 jouée !');
});

// Récupération du texte de sélection d'instrument
// Exemple : "Sélectionné : guitare"
const selection = document.getElementById("selection");

// Ajout des écouteurs d'événement
document.getElementById("instrumentPiano").addEventListener("click", () => changerInstrument("piano"));
document.getElementById("instrumentViolon").addEventListener("click", () => changerInstrument("violon"));
document.getElementById("instrumentGuitare").addEventListener("click", () => changerInstrument("guitare"));

// Initialisation avec l'instrument par défaut
changerInstrument("Piano")