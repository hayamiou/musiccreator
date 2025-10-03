const keys = {
  q: "C6",
  s: "D6",
  d: "E6",
  f: "F6",
  g: "G6",
  h: "A6",
  j: "B6",
  k: "C7",
  l: "D7",
  m: "E7",
  n: "F7",
  ",": "G7",
  ";": "A7",
  ":": "B7",
  "!": "C8",
  a: "C#6",
  z: "D#6",
  e: "F#6",
  r: "G#6",
  t: "A#6",
  y: "C#7",
  u: "D#7",
  i: "F#7",
  o: "G#7",
  p: "A#7",
};

const audioCtx = new AudioContext();
const activeOscillators = {};

function noteToFrequency(note) {
  const notes = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const match = note.match(/^([A-G]#?)(\d)$/);
  const pitch = match[1];
  const octave = parseInt(match[2]);
  const midi = (octave + 1) * 12 + notes.indexOf(pitch);
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function playNote(note) {
  const selectPiano = document.getElementById("piano");
  if (window.getComputedStyle(selectPiano).display === "none") {
    return;
  }
  const freq = noteToFrequency(note);
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  activeOscillators[note] = { osc, gain };
}

function stopNote(note) {
  if (activeOscillators[note]) {
    activeOscillators[note].gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioCtx.currentTime + 0.2
    );
    activeOscillators[note].osc.stop(audioCtx.currentTime + 0.2);
    delete activeOscillators[note];
  }
}

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  const note = keys[key];
  if (note && !activeOscillators[note] && isPlayed === undefined) {
    playNote(note);
    isPlayed = note;
    // record.push(note + " ");
    if (pressStart === null) {
      const now = performance.now();
      const gap = (now - lastRelease) / 1000;
      record.push("0 ");
      record.push(gap);
      record.push("\n");
      pressStart = now;
    }
    const el = document.getElementById(note);
    console.log(el);
    el.classList.add("highlight");
  }
});

let pressStart = null;
document.addEventListener("keyup", (e) => {
  const key = e.key.toLowerCase();
  const note = keys[key];
  if (note) {
    stopNote(note);
    if (pressStart !== null) {
      if (note === isPlayed) {
        const now = performance.now();
        const duration = (now - pressStart) / 1000;
        record.push(isPlayed + " ");
        record.push(duration);
        record.push("\n");
        pressStart = null;
        lastRelease = now;
      }
      isPlayed = undefined;
    }
    const el = document.getElementById(note);
    if (el) el.classList.remove("highlight");
  }
});

let isRecording = false;
let record = [];

function start_enregistrement() {
  isRecording = true;
  lastRelease = performance.now();
  const recBtn = document.getElementById("startRecBtn");
  const redCircle = document.getElementById("circle");
  recBtn.innerHTML = "Recording";
  recBtn.style.border = "2px solid red";
  redCircle.style.display = "none";
}

let defaultBtnText;

window.onload = () => {
  defaultBtnText = document.getElementById("startRecBtn").innerHTML;
};

function stop_enregistrement() {
  isRecording = false;
  const now = performance.now();
  const gap = (now - lastRelease) / 1000;
  record.push("0 ");
  record.push(gap);
  record.push("\n");
  const recBtn = document.getElementById("startRecBtn");
  const redCircle = document.getElementById("circle");
  recBtn.innerHTML = defaultBtnText;
  recBtn.style.border = "1px solid rgba(0, 0, 0, 0.08)";
  redCircle.style.display = "block";
}

function telechargement_enregistrement() {
  const file = new File(record, "melody.txt", {
    type: "text/plain",
  });
  const url = window.URL.createObjectURL(file);

  const link = document.createElement("a");
  link.href = url;
  link.download = "melody.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
  record = [];
}

let isPlayed = undefined;

let lastRelease = performance.now();
