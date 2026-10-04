// Generates a gentle 30s demo loop WAV (mono 22050 Hz 16-bit)
const fs = require('fs');
const sr = 22050, dur = 30, n = sr * dur;
const data = Buffer.alloc(44 + n * 2);
data.write('RIFF', 0); data.writeUInt32LE(36 + n * 2, 4); data.write('WAVE', 8);
data.write('fmt ', 12); data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20);
data.writeUInt16LE(1, 22); data.writeUInt32LE(sr, 24); data.writeUInt32LE(sr * 2, 28);
data.writeUInt16LE(2, 32); data.writeUInt16LE(16, 34);
data.write('data', 36); data.writeUInt32LE(n * 2, 40);
// Am7 - Fmaj7 - Cmaj7 - G6 arpeggio, 2 bars each chord = 7.5s per chord
const chords = [[220, 261.63, 329.63, 392], [174.61, 220, 261.63, 329.63], [130.81, 164.81, 196, 246.94], [196, 246.94, 293.66, 329.63]];
const seg = dur / chords.length;
for (let i = 0; i < n; i++) {
  const t = i / sr;
  const chord = chords[Math.min(chords.length - 1, Math.floor(t / seg))];
  const step = Math.floor((t % seg) / (seg / 8)) % 4; // 8th-note arpeggio pattern
  const f = chord[step] * (step === 3 ? 2 : 1) / (step === 3 ? 1 : 1);
  const env = Math.exp(-((t % (seg / 8)) * 3.2));
  let s = Math.sin(2 * Math.PI * f * t) * env * 0.28;
  s += Math.sin(2 * Math.PI * f * 2.001 * t) * env * 0.08; // soft octave shimmer
  // low pad
  s += Math.sin(2 * Math.PI * chord[0] / 2 * t) * 0.05;
  // master fade in/out
  const fade = Math.min(1, t / 1.5) * Math.min(1, (dur - t) / 2.5);
  const v = Math.max(-1, Math.min(1, s * fade * 0.9));
  data.writeInt16LE(Math.round(v * 32767 * 0.8), 44 + i * 2);
}
fs.writeFileSync('public/audio/demo-loop.wav', data);
console.log('WAV written', data.length, 'bytes');
