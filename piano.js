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
  if (keys[key] && !activeOscillators[keys[e.key]]) {
    playNote(keys[key]);
  }
});

document.addEventListener("keyup", (e) => {
  const key = e.key.toLowerCase();
  if (keys[key]) {
    stopNote(keys[key]);
  }
});
