# MidiShuffle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A web app that generates random MIDI melodies in a selected key, with random note durations and Docker-based local testing.

**Architecture:**
- Client-side Single-Page Application (SPA) using React + TypeScript.
- MIDI generation and playback with Tone.js.
- Docker container for local development environment (NGINX + Node.js for build process).

**Tech Stack:**
- Frontend: React, TypeScript, Tone.js
- Styling: Tailwind CSS
- Build: Vite (for fast iterations)
- Docker: NGINX as reverse proxy for the React app

**Notes:**
- All documentation will be in English.
- No Git commands will be executed; changes will be provided for manual review and commit.

---

## File Structure

```bash
midishuffle/
├── docker/
│   ├── nginx/
│   │   └── nginx.conf
│   └── Dockerfile
├── src/
│   ├── components/
│   │   ├── KeySelector.tsx
│   │   ├── GenerateButton.tsx
│   │   ├── MidiPlayer.tsx
│   │   └── ExportButton.tsx
│   ├── hooks/
│   │   └── useMidiGenerator.ts
│   ├── utils/
│   │   └── midiUtils.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── Dockerfile
```

---

## Tasks

### Task 1: Project Scaffolding with Vite

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`

- [ ] **Step 1: Create Vite project

```bash
npm create vite@latest midishuffle -- --template react-ts
cd midishuffle
```

- [ ] **Step 2: Install dependencies

```bash
npm install tone @types/tone
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- [ ] **Step 3: Configure Tailwind CSS

Create/replace `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add Tailwind to `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 4: Provide files for manual Git commit

The following files will be created and ready for manual Git commit:
- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `src/main.tsx`
- `src/App.tsx`

---

### Task 2: Docker Setup for Local Development

**Files:**
- Create: `docker/Dockerfile`
- Create: `docker/nginx/nginx.conf`
- Create: `Dockerfile`
- Create: `.dockerignore`

- [ ] **Step 1: Create `.dockerignore`

```text
node_modules
.env
Dockerfile
.dockerignore
```

- [ ] **Step 2: Create `docker/nginx/nginx.conf`

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

- [ ] **Step 3: Create `docker/Dockerfile` for Node.js

```dockerfile
FROM node:22-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

- [ ] **Step 4: Create root `Dockerfile`

```dockerfile
# Use the Dockerfile in docker/ directory
FROM node:22-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

- [ ] **Step 5: Build and start Docker container

```bash
docker build -t midishuffle .
docker run -p 8080:80 midishuffle
```

- [ ] **Step 6: Provide files for manual Git commit

The following files will be created and ready for manual Git commit:
- `.dockerignore`
- `docker/Dockerfile`
- `docker/nginx/nginx.conf`
- `Dockerfile`

---

### Task 3: MIDI Generation Logic with Tone.js

**Files:**
- Create: `src/utils/midiUtils.ts`
- Create: `src/hooks/useMidiGenerator.ts`

- [ ] **Step 1: Create `midiUtils.ts`

```typescript
export const NOTES_IN_SCALE = {
  'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  'C#': ['C#', 'D#', 'F', 'F#', 'G#', 'A#', 'C'],
  // Additional keys here...
};

export const generateRandomMelody = (key: string, length: number = 16) => {
  const scale = NOTES_IN_SCALE[key] || NOTES_IN_SCALE['C'];
  const octave = 4;
  const notes = scale.map(note => `${note}${octave}`);

  // Random notes and durations
  return Array(length).fill(0).map(() => {
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    const randomDuration = ['4n', '8n', '16n'][Math.floor(Math.random() * 3)];
    return { note: randomNote, duration: randomDuration };
  });
};
```

- [ ] **Step 2: Create `useMidiGenerator.ts` hook

```typescript
import * as Tone from 'tone';
import { generateRandomMelody } from '../utils/midiUtils';

export const useMidiGenerator = () => {
  const playMelody = (key: string) => {
    const melody = generateRandomMelody(key);
    const synth = new Tone.Synth().toDestination();

    const now = Tone.now();
    melody.forEach((step, index) => {
      synth.triggerAttackRelease(step.note, step.duration, now + index * 0.5);
    });
  };

  return { playMelody };
};
```

- [ ] **Step 3: Test MIDI generation

Add temporary test code to `App.tsx`:

```typescript
import { useMidiGenerator } from './hooks/useMidiGenerator';

function App() {
  const { playMelody } = useMidiGenerator();

  const handleTest = () => {
    playMelody('C');
  };

  return (
    <div>
      <button onClick={handleTest}>Test MIDI</button>
    </div>
  );
}
```

- [ ] **Step 4: Provide files for manual Git commit

The following files will be created/modified and ready for manual Git commit:
- `src/utils/midiUtils.ts`
- `src/hooks/useMidiGenerator.ts`
- `src/App.tsx`

---

### Task 4: Implement UI Components

**Files:**
- Create: `src/components/KeySelector.tsx`
- Create: `src/components/GenerateButton.tsx`
- Create: `src/components/MidiPlayer.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create `KeySelector.tsx`

```typescript
import { useState } from 'react';

export const KeySelector = ({ onSelect }: { onSelect: (key: string) => void }) => {
  const [selectedKey, setSelectedKey] = useState('C');
  const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value;
    setSelectedKey(key);
    onSelect(key);
  };

  return (
    <select value={selectedKey} onChange={handleChange}>
      {keys.map(key => (
        <option key={key} value={key}>{key}</option>
      ))}
    </select>
  );
};
```

- [ ] **Step 2: Create `GenerateButton.tsx`

```typescript
import { useMidiGenerator } from '../hooks/useMidiGenerator';

export const GenerateButton = ({ key }: { key: string }) => {
  const { playMelody } = useMidiGenerator();

  const handleClick = () => {
    playMelody(key);
  };

  return (
    <button onClick={handleClick} className="bg-blue-500 text-white p-2 rounded">
      Generate Melody
    </button>
  );
};
```

- [ ] **Step 3: Create `MidiPlayer.tsx` (Placeholder for future enhancements)

```typescript
export const MidiPlayer = () => {
  return (
    <div className="border p-4">
      <p>MIDI Player (Playback is automatic)</p>
    </div>
  );
};
```

- [ ] **Step 4: Update `App.tsx`

```typescript
import { useState } from 'react';
import { KeySelector } from './components/KeySelector';
import { GenerateButton } from './components/GenerateButton';
import { MidiPlayer } from './components/MidiPlayer';

function App() {
  const [selectedKey, setSelectedKey] = useState('C');

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">MidiShuffle</h1>
      <div className="mb-4">
        <label className="block mb-2">Key:</label>
        <KeySelector onSelect={setSelectedKey} />
      </div>
      <div className="mb-4">
        <GenerateButton key={selectedKey} />
      </div>
      <MidiPlayer />
    </div>
  );
}
```

- [ ] **Step 5: Provide files for manual Git commit

The following files will be created/modified and ready for manual Git commit:
- `src/components/KeySelector.tsx`
- `src/components/GenerateButton.tsx`
- `src/components/MidiPlayer.tsx`
- `src/App.tsx`

---

### Task 5: Add Export Functionality

**Files:**
- Create: `src/components/ExportButton.tsx`
- Modify: `src/hooks/useMidiGenerator.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Extend `useMidiGenerator.ts`

```typescript
import { generateRandomMelody } from '../utils/midiUtils';
import * as Tone from 'tone';

export const useMidiGenerator = () => {
  const playMelody = (key: string) => {
    const melody = generateRandomMelody(key);
    const synth = new Tone.Synth().toDestination();

    const now = Tone.now();
    melody.forEach((step, index) => {
      synth.triggerAttackRelease(step.note, step.duration, now + index * 0.5);
    });
  };

  const exportMelody = async (key: string) => {
    const melody = generateRandomMelody(key);
    // TODO: Implement MIDI export with MidiWriterJS or Tone.js
    console.log("Export functionality will be implemented later", melody);
  };

  return { playMelody, exportMelody };
};
```

- [ ] **Step 2: Create `ExportButton.tsx`

```typescript
import { useMidiGenerator } from '../hooks/useMidiGenerator';

export const ExportButton = ({ key }: { key: string }) => {
  const { exportMelody } = useMidiGenerator();

  const handleClick = () => {
    exportMelody(key);
  };

  return (
    <button onClick={handleClick} className="bg-green-500 text-white p-2 rounded ml-2">
      Export MIDI
    </button>
  );
};
```

- [ ] **Step 3: Update `App.tsx`

```typescript
import { ExportButton } from './components/ExportButton';

// Inside the return statement of App:
<div className="mb-4 flex">
  <GenerateButton key={selectedKey} />
  <ExportButton key={selectedKey} />
</div>
```

- [ ] **Step 4: Provide files for manual Git commit

The following files will be created/modified and ready for manual Git commit:
- `src/components/ExportButton.tsx`
- `src/hooks/useMidiGenerator.ts`
- `src/App.tsx`

---

### Task 6: Docker Testing and Final Validation

- [ ] **Step 1: Rebuild and start Docker container

```bash
docker build -t midishuffle .
docker run -p 8080:80 midishuffle
```

- [ ] **Step 2: Test the app in the browser

Open [http://localhost:8080](http://localhost:8080) and verify:
- Key selection works.
- Melody plays after clicking "Generate Melody".
- UI is responsive and user-friendly.

- [ ] **Step 3: Provide files for manual Git commit

All modified files will be ready for manual Git commit.
