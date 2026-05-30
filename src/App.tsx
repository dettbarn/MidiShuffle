import { useMidiGenerator } from './hooks/useMidiGenerator';

function App() {
  const { playMelody } = useMidiGenerator();

  const handleTest = () => {
    playMelody('C', 4);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">MidiShuffle</h1>
      <button
        onClick={handleTest}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Test MIDI Melody
      </button>
    </div>
  );
}

export default App;
