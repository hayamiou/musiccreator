// Créer un synthétiseur piano
const synth = new Tone.Synth().toDestination();

// Récupérer le bouton
const playBtn = document.getElementById("playBtn");

// Ajouter l'événement au clic
playBtn.addEventListener("click", async () => {
  // Important : Tone.js nécessite une interaction utilisateur avant de jouer du son
  await Tone.start();

  // Jouer la note G4 pendant 1 seconde
  synth.triggerAttackRelease("G4", "1s");

  console.log("Note G4 jouée !");
});

function importFile() {
  const file = document.getElementById("musicFile");
  const fileImported = file.files[0];
  console.log(file);
  console.log(fileImported.value);

  const reader = new FileReader();

  reader.onload = (event) => {
    const content = event.target.result;
    console.log(convertTxtToMusic(content));
  };

  reader.readAsText(fileImported, "utf-8");
}

class note {
  note;
  length;
  constructor(note, length) {
    this.note = note;
    this.length = length;
  }
}

function convertTxtToMusic(input) {
  let notes = [];
  const abc = input.split("\n");

  console.log(abc);

  abc.forEach((element) => {
    notes.push(new note(element.split(" ")[0], element.split(" ")[1]));
  });

  console.log(notes);
}
