
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
        const linesText = events.slice(0, 100)
            .map((ev) => `  { note: "${ev.note}", duration: ${ev.duration} },`)
            .join('\n');
        const arrayText = `const parsedNotes = [\n${linesText}\n];`;
        html += '<div class="notes">';
        html += `<strong>${count} notes parsées</strong>`;
        html += `<pre>${arrayText}</pre>`;
        if (events.length > 100) {
            html += `<div style="margin-top:4px;color:#6e6e73;">… (+${events.length - 100} autres)</div>`;
        }
        html += '</div>';
    } else {
        html += '<div class="error">Aucune note valide trouvée.</div>';
    }
    if (Array.isArray(errors) && errors.length > 0) {
        html += `<div style="margin-top:8px;color:#6e6e73;">${errors.length} lignes ignorées.</div>`;
    }
    importFeedback.innerHTML = html;
}



