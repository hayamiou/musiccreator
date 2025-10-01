// Basic score parser: parses lines of "NOTE DURATION_SECONDS"
// - Accepts notes A–G followed by a single-digit octave (e.g., C4, D5, G3)


 (function attachParserToWindow() {
   const NOTE_REGEX = /^[A-G]\d$/; // e.g., C4, D5, G3 (no # or b)

  function isValidNoteToken(token) {
    if (!token) return false;
    const upper = String(token).trim().toUpperCase();
    if (upper === "UNKNOWN" || upper === "0") return false;
    return NOTE_REGEX.test(upper);
  }

  function tryParseDurationSeconds(token) {
    if (token == null) return null;
    const value = parseFloat(String(token).trim().replace(",", "."));
    if (!Number.isFinite(value)) return null;
    if (value <= 0) return null;
    return value;
  }

  // Parses a single line. Returns { note, durationSec } or null if invalid
  function parseLine(line) {
    if (line == null) return null;
    const raw = String(line).trim();
    if (raw.length === 0) return null;
    const parts = raw.split(/\s+/);
    if (parts.length < 2) return null;

    const noteToken = parts[0];
    const durationToken = parts[1];

    if (!isValidNoteToken(noteToken)) return null;
    const durationSec = tryParseDurationSeconds(durationToken);
    if (durationSec == null) return null;

    return {
      note: noteToken.trim().toUpperCase(),
      durationSec,
    };
  }

  // Parses entire text and returns only valid events
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

  // Expose API
  window.parseScore = parseScore;
  window.parseScoreWithReport = parseScoreWithReport;
  window.__scoreParser = { isValidNoteToken, parseLine };
})();


