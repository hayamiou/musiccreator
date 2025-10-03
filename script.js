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
    defaultButton.classList.add("selected");
  }
  
  const importToggle = document.getElementById("importToggle");
  const importDropdown = document.getElementById("importDropdown");
  const chooseFileBtn = document.getElementById("chooseFileBtn");
  const fileInput = document.getElementById("fileInput");
  const dropzone = document.getElementById("dropzone");
  const importFeedback = document.getElementById("importFeedback");
  
  // === Play toggle bouton ===
  const playToggle = document.getElementById("playToggle");
  let isPlaying = false;
  
  // Au départ, le bouton est désactivé (déjà "disabled" dans le HTML)
  if (playToggle) {
    playToggle.disabled = true;
  }
  
  function closeImportDropdown() {
    if (importDropdown && importToggle) {
      importDropdown.classList.remove("open");
      importToggle.setAttribute("aria-expanded", "false");
      importDropdown.setAttribute("aria-hidden", "true");
    }
  }
  
  if (importToggle && importDropdown) {
    importToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !importDropdown.classList.contains("open");
      importDropdown.classList.toggle("open", willOpen);
      importToggle.setAttribute("aria-expanded", String(willOpen));
      importDropdown.setAttribute("aria-hidden", String(!willOpen));
    });
  
    document.addEventListener("click", (e) => {
      if (!importDropdown.contains(e.target) && e.target !== importToggle) {
        closeImportDropdown();
      }
    });
  }
  
  if (chooseFileBtn && fileInput) {
    chooseFileBtn.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", () => {
      const file = fileInput.files && fileInput.files[0];
      handleImport(file);
    });
  }
  
  if (dropzone) {
    ["dragenter", "dragover"].forEach((evt) => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropzone.style.borderColor = "rgba(0,0,0,0.25)";
        dropzone.style.background = "#ededf3";
      });
    });
    ["dragleave", "drop"].forEach((evt) => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropzone.style.borderColor = "rgba(0,0,0,0.12)";
        dropzone.style.background = "#f7f7fa";
        if (evt === "drop") {
          const dt = e.dataTransfer;
          const file = dt && dt.files && dt.files[0];
          handleImport(file);
        }
      });
    });
  }
  
  function handleImport(file) {
    clearFeedback();
    const isTxt =
      file &&
      (file.type === "text/plain" ||
        (file.name && file.name.toLowerCase().endsWith(".txt")));
    if (!isTxt) {
      showError("Veuillez sélectionner un fichier .txt valide.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      try {
        const result = window.parseScoreWithReport
          ? window.parseScoreWithReport(content)
          : { events: [], errors: ["Parser indisponible"] };
        renderParsed(
          result.events,
          result.errors,
          file && file.name ? file.name : undefined
        );
      } catch (err) {
        showError("Erreur lors du parsing.");
        console.error(err);
      }
    };
    reader.readAsText(file, "utf-8");
  }
  
  function clearFeedback() {
    if (importFeedback) importFeedback.innerHTML = "";
  }
  
  function showError(message) {
    if (!importFeedback) return;
    importFeedback.innerHTML = `<div class="error">${message}</div>`;
  }
  
  let parsedEvents = [];
  let part = null;
  let durationDivider = 1.0;
  
  const durationDividerInput = document.getElementById("durationDivider");
  const durationDividerValue = document.getElementById("durationDividerValue");
  if (durationDividerInput) {
    const updateDivider = () => {
        const raw = parseFloat(durationDividerInput.value);
        durationDivider = Number.isFinite(raw) && raw > 0 ? raw : 1.0;
        if (durationDividerValue)
          durationDividerValue.textContent = `${durationDivider.toFixed(1)}×`;
      
        // === Nouveau : ajuster la vitesse en temps réel ===
        Tone.Transport.bpm.value = 120 * durationDivider;
    };
    durationDividerInput.addEventListener("input", updateDivider);
    updateDivider();
  }
  
  function buildEventsFromParsed(parsedArray) {
    let currentTime = 0;
    return parsedArray.map((ev) => {
      const adjustedDuration = ev.duration / (durationDivider || 1.0);
      const event = {
        time: currentTime,
        note: ev.note,
        duration: adjustedDuration,
      };
      currentTime += adjustedDuration;
      return event;
    });
  }
  
  function playParsedOnce(parsedArray) {
    if (!Array.isArray(parsedArray) || parsedArray.length === 0) return;
    if (part) {
      part.dispose();
      part = null;
    }
    const events = buildEventsFromParsed(parsedArray);
    part = new Tone.Part((time, value) => {
      if (value.note !== "0") {
        const sampler = window.currentSampler;
        if (sampler && sampler.loaded) {
          const keyEl = document.getElementById(value.note);
          sampler.triggerAttackRelease(value.note, "1n", time);
          if (keyEl){
            keyEl.classList.add("highlight");
            setTimeout(() => keyEl.classList.remove("highlight"), 300);
          }
          

        } else {
          const synthTmp = new Tone.Synth().toDestination();
          synthTmp.triggerAttackRelease(value.note, "1n", time);
        }
      }
    }, events).start(0);
    Tone.Transport.stop();
    Tone.Transport.seconds = 0;
    Tone.Transport.start();
  }
  
  function stopParsed() {
    Tone.Transport.stop();
    if (part) {
      part.dispose();
      part = null;
    }
  }
  
  // === Gestion Play/Stop ===
  if (playToggle) {
    playToggle.addEventListener("click", async () => {
      await Tone.start();
      if (!isPlaying) {
        playParsedOnce(parsedEvents);
        playToggle.classList.add("is-playing");
        isPlaying = true;
      } else {
        stopParsed();
        playToggle.classList.remove("is-playing");
        isPlaying = false;
      }
    });
  }
  
  // Capture des événements parsés depuis renderParsed
  const _origRenderParsed = renderParsed;
  renderParsed = function (events, errors, filename) {
    parsedEvents = Array.isArray(events) ? events : [];
    _origRenderParsed(events, errors, filename);
  
    // Activer ou désactiver le bouton selon s’il y a des notes
    if (playToggle) {
      playToggle.disabled = parsedEvents.length === 0;
      if (parsedEvents.length === 0) {
        // reset état playing si on réimporte un fichier vide
        playToggle.classList.remove("is-playing");
        isPlaying = false;
      }
    }
  };
  
  function renderParsed(events, errors, filename) {
    if (!importFeedback) return;
    const count = Array.isArray(events) ? events.length : 0;
    console.log("Parsed notes:", events);
    let html = "";
    if (filename) {
      html += `<div style="margin-bottom:6px;color:#1d1d1f;"><strong>Fichier :</strong> ${filename}</div>`;
    }
    if (!count) {
      html += '<div class="error">Aucune note valide trouvée.</div>';
    }
    if (Array.isArray(errors) && errors.length > 0) {
      html += `<div style="margin-top:8px;color:#6e6e73;">${errors.length} lignes ignorées.</div>`;
    }
    importFeedback.innerHTML = html;
  }
  