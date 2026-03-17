# VocabMaster AI Integration Plan

## Overview
Integrate the complete VocabMaster AI React application with your boonsup.github.io webpage. This involves setting up React 18, Tailwind CSS, Lucide icons, and connecting the Gemini API for AI features (TTS, story generation, quiz generation).

## Current State Analysis

### Existing Files
- ✅ [`index.html`](../index.html) - Basic HTML shell, already references `src/main.jsx`
- ✅ [`src/App.jsx`](../src/App.jsx:1) - Basic VocabMaster skeleton (will be replaced)
- ✅ [`src/main.jsx`](../src/main.jsx:1) - Uses React 17 API (needs update)
- ✅ [`.env`](../.env:1) - Contains `VITE_GEMINI_API_KEY`
- ⚠️ [`package.json`](../package.json:1) - Incomplete (only has homepage property)
- ❌ No Tailwind CSS configuration
- ❌ No CSS entry file

### Technology Stack Required
- **React 18** - Latest React with createRoot API
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library (18 icons used in the app)
- **PostCSS & Autoprefixer** - CSS processing for Tailwind

### Key Features to Implement
1. **Flashcard System** - Interactive vocabulary learning with flip animation
2. **AI Story Generator** - Uses Gemini API to create contextual stories
3. **AI Quiz Generator** - Creates multiple-choice questions using Gemini API
4. **Text-to-Speech** - Gemini TTS for pronunciation
5. **Progress Tracking** - Mastered/Missed word counters
6. **Difficulty Filtering** - Easy/Intermediate/Hard levels
7. **Favorites System** - Save preferred words

## Implementation Steps

### 1. Setup Dependencies

**Create complete [`package.json`](../package.json)**
```json
{
  "name": "vocabmaster-ai",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "homepage": "https://boonsup.github.io/engpro7",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.5",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16"
  }
}
```

**Required Lucide Icons** (18 total):
- BookOpen, Award, ChevronLeft, ChevronRight, RotateCcw
- Sparkles, Zap, GraduationCap, CheckCircle2, XCircle
- Heart, Shuffle, Trophy, RefreshCw, Volume2
- Wand2, HelpCircle, Loader2

### 2. Configure Tailwind CSS

**Create [`tailwind.config.js`](../tailwind.config.js)**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 4s linear infinite',
      }
    },
  },
  plugins: [],
}
```

**Create [`postcss.config.js`](../postcss.config.js)**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 3. Create CSS Entry Point

**Create [`src/index.css`](../src/index.css)**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles for 3D card flip */
@layer utilities {
  .perspective-1000 {
    perspective: 1200px;
  }
  
  .transform-style-3d {
    transform-style: preserve-3d;
  }
  
  .backface-hidden {
    backface-visibility: hidden;
  }
  
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
}

/* Custom scrollbar for dark card */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
```

### 4. Update React Entry Point

**Update [`src/main.jsx`](../src/main.jsx:1)**
```javascript
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 5. Update App Component

**Replace [`src/App.jsx`](../src/App.jsx:1)** with provided code, but modify line 19:
```javascript
// Change from:
const apiKey = ""; // Provided at runtime

// To:
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
```

This ensures the app uses the API key from [`.env`](../.env:1) file.

### 6. Update HTML

**Update [`index.html`](../index.html:1)** metadata:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="VocabMaster AI - Grade 7-9 vocabulary builder with AI-powered stories, quizzes, and text-to-speech">
    <title>VocabMaster AI - Interactive Vocabulary Builder</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

### 7. Configure Vite for GitHub Pages

**Update [`vite.config.js`](../vite.config.js:1)** (if deploying to subdirectory):
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/engpro7/', // Match package.json homepage path
});
```

## API Integration Details

### Gemini API Endpoints Used

1. **Text-to-Speech (TTS)**
   - Model: `gemini-2.5-flash-preview-tts`
   - Returns: Base64 encoded audio (24kHz PCM)
   - Conversion: Converts to WAV format in browser

2. **Story Generation**
   - Model: `gemini-2.5-flash-preview-09-2025`
   - Input: Word + prompt
   - Output: 2-sentence contextual story

3. **Quiz Generation**
   - Model: `gemini-2.5-flash-preview-09-2025`
   - Uses structured JSON schema
   - Returns: Question, 4 options, correct answer index

### Retry Strategy
- Implements exponential backoff (5 retries, starting at 1s)
- Handles rate limiting gracefully

## Data Structure

### Word Object Schema
```javascript
{
  word: String,           // "analyze"
  grade: Number,          // 8
  difficulty: String,     // "easy" | "intermediate" | "hard"
  notions: [String],      // ["academic"]
  definition: String,
  part_of_speech: String, // "verb" | "adjective" | "noun"
  synonyms: [String],
  antonyms: [String],
  root: {
    origin: String,       // "Greek"
    root: String,         // "analusis"
    meaning: String       // "to break up"
  },
  memory_tip: String,
  badges: [String],       // ["word-wizard", "etymologist"]
  example_sentence: String
}
```

### Sample Word Pool
11 words included (grades 7-9):
- **Easy**: reluctant, persistent, contradict
- **Intermediate**: analyze, benevolent, innovate
- **Hard**: meticulous, ephemeral, pandemonium, ambiguous, scrupulous

## User Interface Components

### Main Views

1. **Header**
   - Logo with GraduationCap icon
   - Difficulty filter buttons (All/Easy/Intermediate/Hard)

2. **Stats Dashboard**
   - Current word position (1/10)
   - Mastered count (green)
   - Missed count (red)
   - New Set refresh button

3. **Flashcard (Front)**
   - Large word display (6xl font)
   - Part of speech badge
   - Achievement badges
   - Favorite heart button (top-right)
   - TTS speaker button (top-left)
   - Flip instruction

4. **Flashcard (Back - Dark Mode)**
   - Word definition
   - AI Story button (with loading state)
   - AI Quiz button (with loading state)
   - Etymology box
   - Mnemonics box
   - Mark as Missed/Mastered buttons
   - Full TTS button (word + definition)
   - Flip back button

5. **Navigation**
   - Previous/Next word buttons

### Interactive Features
- 3D flip animation (CSS transform)
- Smooth transitions
- Loading spinners for AI operations
- Color-coded success/error states
- Responsive design (mobile-friendly)

## Setup & Testing

### Installation Steps
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
Ensure [`.env`](../.env:1) contains:
```
VITE_GEMINI_API_KEY=AIzaSyDlbV7Os9SZszzJjW13kUgwqCXNm68BsM4
```

### Testing Checklist
- [ ] App renders without errors
- [ ] Difficulty filters work
- [ ] Card flip animation smooth
- [ ] Navigation buttons functional
- [ ] TTS plays audio correctly
- [ ] AI Story generates (with API key)
- [ ] AI Quiz generates and validates answers
- [ ] Favorites toggle works
- [ ] Mastered/Missed tracking works
- [ ] New Set button refreshes words
- [ ] Responsive on mobile devices

## Deployment to GitHub Pages

### Build Command
```bash
npm run build
```

This creates a `dist/` folder with optimized static files.

### Deployment Options

**Option 1: Manual Deployment**
```bash
# Build the project
npm run build

# Deploy dist folder to gh-pages branch
# (Use your preferred method)
```

**Option 2: GitHub Actions**
Create `.github/workflows/deploy.yml` for automatic deployment on push.

### Verification
After deployment, visit:
`https://boonsup.github.io/engpro7/`

## Architecture Diagram

```mermaid
graph TD
    A[index.html] -->|loads| B[src/main.jsx]
    B -->|imports| C[src/App.jsx]
    B -->|imports| D[src/index.css]
    D -->|uses| E[Tailwind CSS]
    C -->|uses| F[React 18 Hooks]
    C -->|imports| G[Lucide Icons]
    C -->|calls| H[Gemini API]
    H -->|TTS| I[Audio Output]
    H -->|Story| J[AI Content]
    H -->|Quiz| J
    C -->|manages| K[Word Pool State]
    C -->|renders| L[Flashcard UI]
    L -->|displays| M[Front: Word]
    L -->|displays| N[Back: Details + AI]
```

## Critical Notes

⚠️ **API Key Security**: The API key is currently in `.env` which is fine for development. For production, consider:
- Server-side proxy to hide the key
- Rate limiting per user
- API key rotation

⚠️ **Missing Icon Import**: The code uses an `Info` icon on line 261 but doesn't import it. Either:
- Remove the error notification feature
- Or add: `import { Info } from 'lucide-react';`

⚠️ **Tailwind Animations**: Some Tailwind classes like `animate-in`, `fade-in`, `slide-in-from-top-4`, `zoom-in-95` may require the `@tailwindcss/forms` plugin or custom configuration.

## Success Criteria

✅ React app successfully renders in browser  
✅ Tailwind styles apply correctly  
✅ All 18 Lucide icons display  
✅ Flashcard flip animation works  
✅ API calls to Gemini succeed  
✅ Audio plays from TTS  
✅ Story and quiz generate properly  
✅ Navigation and filtering functional  
✅ Responsive on mobile and desktop  

## Next Steps After Implementation

1. Test all AI features thoroughly
2. Add more words to the pool (currently 11)
3. Consider data persistence (localStorage)
4. Add user progress tracking
5. Implement spaced repetition algorithm
6. Add achievement system
7. Create user accounts (optional)
8. Add social sharing features

---

**Estimated Files to Create/Modify:**
- ✏️ Modify: `package.json`, `index.html`, `vite.config.js`
- ✏️ Replace: `src/App.jsx`, `src/main.jsx`
- ✨ Create: `tailwind.config.js`, `postcss.config.js`, `src/index.css`

**Total: 7 files** (3 new, 4 modified)
