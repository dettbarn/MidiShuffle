// Scales for all 12 major keys
const NOTES_IN_SCALE: Record<string, string[]> = {
  'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  'C#': ['C#', 'D#', 'F', 'F#', 'G#', 'A#', 'B#'],
  'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
  'D#': ['D#', 'F', 'G', 'G#', 'A#', 'C', 'D'],
  'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
  'F': ['F', 'G', 'A', 'A#', 'C', 'D', 'E'],
  'F#': ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'F'],
  'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  'G#': ['G#', 'A#', 'C', 'C#', 'D#', 'F', 'G'],
  'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
  'A#': ['A#', 'C', 'D', 'D#', 'F', 'G', 'A'],
  'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
};

// Generate a random melody in a selected key and octave
export const generateRandomMelody = (
  key: string,
  octave: number = 4,
  length: number = 16
): { note: string; duration: string }[] => {
  const scale = NOTES_IN_SCALE[key] || NOTES_IN_SCALE['C'];
  const notes = scale.map(note => `${note}${octave}`);
  const durations = ['4n', '8n', '16n', '2n', '8n.', '16n.'];

  return Array(length).fill(0).map(() => {
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    const randomDuration = durations[Math.floor(Math.random() * durations.length)];
    return { note: randomNote, duration: randomDuration };
  });
};