import * as Tone from 'tone';
import { generateRandomMelody } from '../utils/midiUtils';

export const useMidiGenerator = () => {
  // Initialize Tone.js
  const synth = new Tone.Synth().toDestination();

  const playMelody = (key: string, octave: number = 4) => {
    const melody = generateRandomMelody(key, octave);
    const now = Tone.now();

    melody.forEach((step, index) => {
      synth.triggerAttackRelease(step.note, step.duration, now + index * 0.5);
    });
  };

  return { playMelody };
};