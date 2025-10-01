const synth = new Tone.Synth().toDestination();

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

const instrumentButtons = document.querySelectorAll(".instrument-btn");
let currentInstrument = "piano";


instrumentButtons.forEach((button) => {
  button.addEventListener("click", () => {
    instrumentButtons.forEach((b) => b.classList.remove("selected"));
    button.classList.add("selected");
    currentInstrument = button.getAttribute("data-instrument");
    console.log("Instrument sélectionné :", currentInstrument);
  });
});

const defaultButton = document.querySelector('[data-instrument="piano"]');
if (defaultButton) {
    defaultButton.classList.add('selected');
}

const importToggle = document.getElementById('importToggle');
const importDropdown = document.getElementById('importDropdown');
const chooseFileBtn = document.getElementById('chooseFileBtn');
const fileInput = document.getElementById('fileInput');
const dropzone = document.getElementById('dropzone');

function closeImportDropdown() {
    if (importDropdown && importToggle) {
        importDropdown.classList.remove('open');
        importToggle.setAttribute('aria-expanded', 'false');
        importDropdown.setAttribute('aria-hidden', 'true');
    }
}

if (importToggle && importDropdown) {
    importToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const willOpen = !importDropdown.classList.contains('open');
        importDropdown.classList.toggle('open', willOpen);
        importToggle.setAttribute('aria-expanded', String(willOpen));
        importDropdown.setAttribute('aria-hidden', String(!willOpen));
    });

    document.addEventListener('click', (e) => {
        if (!importDropdown.contains(e.target) && e.target !== importToggle) {
            closeImportDropdown();
        }
    });
}

if (chooseFileBtn && fileInput) {
    chooseFileBtn.addEventListener('click', () => fileInput.click());
}

if (dropzone) {
    ['dragenter', 'dragover'].forEach((evt) => {
        dropzone.addEventListener(evt, (e) => {
            e.preventDefault();
            dropzone.style.borderColor = 'rgba(0,0,0,0.25)';
            dropzone.style.background = '#ededf3';
        });
    });
    ['dragleave', 'drop'].forEach((evt) => {
        dropzone.addEventListener(evt, (e) => {
            e.preventDefault();
            dropzone.style.borderColor = 'rgba(0,0,0,0.12)';
            dropzone.style.background = '#f7f7fa';
        });
    });
}


const synth2 = new Tone.Synth().toDestination();

const playBtn = document.getElementById('playBtn');

playBtn.addEventListener('click', async () => {
    await Tone.start();
    
    synth.triggerAttackRelease("G4", "0.1s");
    
    console.log('Note G4 jouée !');
});

const playBtn1 = document.getElementById('playBtn1');

playBtn1.addEventListener('click', async () => {
    await Tone.start();
    
    synth.triggerAttackRelease("G5", "0.1s");
    
    console.log('Note G5 jouée !');
});

const playBtn2 = document.getElementById('playBtn2');

playBtn2.addEventListener('click', async () => {
    await Tone.start();
    
    synth.triggerAttackRelease("G6", "0.1s");
    
    console.log('Note G6 jouée !');
});


const playBtn3 = document.getElementById('playBtn3');

playBtn3.addEventListener('click', async () => {
    await Tone.start();
    
    synth.triggerAttackRelease("G7", "0.1s");
    
    console.log('Note G7 jouée !');
});