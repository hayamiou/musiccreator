const synth = new Tone.Synth().toDestination();

class note {
  note;
  length;
  constructor(note, length) {
    this.note = note;
    this.length = length;
  }
}

// legacy conversion removed in favor of parsing.js

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
const importFeedback = document.getElementById('importFeedback');

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
    fileInput.addEventListener('change', () => {
        const file = fileInput.files && fileInput.files[0];
        handleImport(file);
    });
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
            if (evt === 'drop') {
                const dt = e.dataTransfer;
                const file = dt && dt.files && dt.files[0];
                handleImport(file);
            }
        });
    });
}

function handleImport(file) {
    clearFeedback();
    const isTxt = file && (file.type === 'text/plain' || (file.name && file.name.toLowerCase().endsWith('.txt')));
    if (!isTxt) {
        showError('Veuillez sélectionner un fichier .txt valide.');
        return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
        const content = event.target.result;
        try {
            const result = window.parseScoreWithReport ? window.parseScoreWithReport(content) : { events: [], errors: ['Parser indisponible'] };
            renderParsed(result.events, result.errors);
        } catch (err) {
            showError('Erreur lors du parsing.');
            console.error(err);
        }
    };
    reader.readAsText(file, 'utf-8');
}

function clearFeedback() {
    if (importFeedback) importFeedback.innerHTML = '';
}

function showError(message) {
    if (!importFeedback) return;
    importFeedback.innerHTML = `<div class="error">${message}</div>`;
}

function renderParsed(events, errors) {
    if (!importFeedback) return;
    const count = Array.isArray(events) ? events.length : 0;
    let html = '';
    if (count > 0) {
        html += '<div class="notes">';
        html += `<strong>${count} notes parsées</strong>`;
        html += '<ul>';
        events.slice(0, 100).forEach((ev) => {
            html += `<li>${ev.note} — ${ev.durationSec}s</li>`;
        });
        if (events.length > 100) {
            html += `<li>… (+${events.length - 100} autres)</li>`;
        }
        html += '</ul></div>';
    } else {
        html += '<div class="error">Aucune note valide trouvée.</div>';
    }
    if (Array.isArray(errors) && errors.length > 0) {
        html += `<div style="margin-top:8px;color:#6e6e73;">${errors.length} lignes ignorées.</div>`;
    }
    importFeedback.innerHTML = html;
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