
// Correction: Les notes dièses (#) doivent être converties en format "C#6" => "C#6" (OK pour Tone.js), 
// mais Tone.js attend "C#6" et non "C#6" (donc pas de conversion à faire ici).
// Cependant, il faut s'assurer que le format est bien "C#6" (et pas "C♯6" ou "C#6" en minuscules).

(function attachParserToWindow() {
  // Autorise les notes blanches (A6, B7, etc.) et les notes noires (C#6, D#7, etc.)
  // Tone.js attend "C#6" (et non "C♯6" ni "C#6" en minuscules)
  const NOTE_REGEX = /^[A-G](#)?\d$/;

  // Convertit une note (ex: c#6, C#6, c6) en format Tone.js (C#6)
  function normalizeNoteToken(token) {
    if (!token) return "";
    let t = String(token).trim().toUpperCase();
    // Remplace les éventuels dièses unicode par #
    t = t.replace(/♯/g, "#");
    // Met la lettre en majuscule, le # si présent, et le chiffre
    // (déjà fait par toUpperCase, mais on s'assure du format)
    // Ex: c#6 -> C#6, d6 -> D6
    return t;
  }

  function isValidNoteToken(token) {
    if (!token) return false;
    const upper = normalizeNoteToken(token);
    // Accept valid notes and silence (0)
    return NOTE_REGEX.test(upper) || upper === "0";
  }

  function isSilence(token) {
    if (!token) return false;
    return normalizeNoteToken(token) === "0";
  }

  function tryParseDurationSeconds(token) {
    if (token == null) return null;
    const value = parseFloat(String(token).trim().replace(",", "."));
    if (!Number.isFinite(value)) return null;
    if (value <= 0) return null;
    return value;
  }

  function parseLine(line) {
    if (line == null) return null;
    const raw = String(line).trim();
    if (raw.length === 0) return null;
    const parts = raw.split(/\s+/);
    if (parts.length < 2) return null;

    const noteToken = parts[0];
    const durationToken = parts[1];

    if (!isValidNoteToken(noteToken)) return null;
    const duration = tryParseDurationSeconds(durationToken);
    if (duration == null) return null;

    // Correction ici : on normalise la note pour que "c#6" devienne "C#6"
    return {
      note: normalizeNoteToken(noteToken),
      duration,
      isSilence: isSilence(noteToken)
    };
  }

  function parseScore(text) {
    if (text == null) return [];
    const lines = String(text).split(/\r?\n/);
    const events = [];
    for (const line of lines) {
      const parsed = parseLine(line);
      if (parsed) events.push(parsed);
    }
    return events;
  }

  // Parses and also returns an array of error messages for diagnostics
  function parseScoreWithReport(text) {
    if (text == null) return { events: [], errors: ["No content"] };
    const lines = String(text).split(/\r?\n/);
    const events = [];
    const errors = [];
    lines.forEach((line, index) => {
      const parsed = parseLine(line);
      if (parsed) {
        events.push(parsed);
      } else {
        const trimmed = String(line).trim();
        if (trimmed.length > 0) {
          errors.push(`Ignored line ${index + 1}: "${trimmed}"`);
        }
      }
    });
    return { events, errors };
  }

  window.parseScore = parseScore;
  window.parseScoreWithReport = parseScoreWithReport;
  window.__scoreParser = { isValidNoteToken, parseLine, isSilence };
})();

