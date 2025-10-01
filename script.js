// Créer un synthétiseur piano
const synth = new Tone.Synth().toDestination();

// Récupérer le bouton
const playBtn = document.getElementById('playBtn');

// Ajouter l'événement au clic
playBtn.addEventListener('click', async () => {
    // Important : Tone.js nécessite une interaction utilisateur avant de jouer du son
    await Tone.start();
    
    // Jouer la note G4 pendant 1 seconde
    synth.triggerAttackRelease("G4", "1s");
    
    console.log('Note G4 jouée !');
});
