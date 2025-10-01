// Créer un synthétiseur piano
const synth = new Tone.Synth().toDestination();


const instrumentButtons = document.querySelectorAll('.instrument-btn');
let currentInstrument = 'piano';

instrumentButtons.forEach((button) => {
    button.addEventListener('click', () => {
        instrumentButtons.forEach((b) => b.classList.remove('selected'));
        button.classList.add('selected');
        currentInstrument = button.getAttribute('data-instrument');
        console.log('Instrument sélectionné :', currentInstrument);
    });
});

const defaultButton = document.querySelector('[data-instrument="piano"]');
if (defaultButton) {
    defaultButton.classList.add('selected');
}

// Import dropdown toggle and basic interactions
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

// Basic dropzone highlight (no actual file handling yet)
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