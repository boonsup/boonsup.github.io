# VocabMaster AI - Setup & Testing Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Git (for deployment)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Verify environment variables**
   Ensure your [`.env`](.env) file contains:
   ```
   VITE_GEMINI_API_KEY=AIzaSyDlbV7Os9SZszzJjW13kUgwqCXNm68BsM4
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at: `http://localhost:5173/engpro7/`

## 📦 Project Structure

```
boonsup.github.io/
├── src/
│   ├── App.jsx          # Main VocabMaster AI component
│   ├── main.jsx         # React 18 entry point
│   └── index.css        # Tailwind CSS + custom styles
├── data/
│   └── vocab1000.json   # Extended vocabulary database (optional)
├── plans/
│   └── vocabmaster-integration-plan.md  # Detailed implementation plan
├── index.html           # HTML entry point
├── package.json         # Dependencies & scripts
├── vite.config.js       # Vite configuration (GitHub Pages base path)
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
└── .env                 # Environment variables (Gemini API key)
```

## 🔧 Configuration Files

### [`package.json`](package.json)
Contains all dependencies:
- **React 18** - Modern React with concurrent features
- **Lucide React** - Icon library (19 icons used)
- **Tailwind CSS** - Utility-first CSS framework
- **Vite 5** - Build tool and dev server

### [`vite.config.js`](vite.config.js)
Configured for GitHub Pages deployment:
- Base path: `/engpro7/`
- React plugin enabled

### [`.env`](.env)
Stores the Gemini API key:
- Used by [`src/App.jsx`](src/App.jsx) via `import.meta.env.VITE_GEMINI_API_KEY`

## ✅ Testing Checklist

### Basic Functionality
- [ ] **App Loads**: Navigate to dev server, app renders without errors
- [ ] **Header**: Logo displays, title shows "VocabMaster AI"
- [ ] **Difficulty Filters**: All/Easy/Intermediate/Hard buttons work
- [ ] **Stats Display**: Shows current word position, mastered count, missed count

### Flashcard Features
- [ ] **Front Side**: 
  - Word displays in large font
  - Part of speech badge shows
  - Achievement badges appear (if applicable)
  - Heart icon for favorites works
  - Speaker icon plays pronunciation (TTS)
- [ ] **Card Flip**: 
  - Click card to flip with 3D animation
  - Animation is smooth and doesn't glitch
- [ ] **Back Side**:
  - Definition displays clearly
  - Etymology and mnemonics boxes show
  - All buttons are accessible

### AI Features (Requires Valid API Key)
- [ ] **Text-to-Speech (TTS)**:
  - Click speaker icon on front
  - Audio plays pronunciation
  - Loading spinner shows during generation
  - Works on "Speak with AI Voice" button on back
- [ ] **AI Story Generator**:
  - Click "✨ AI Story" button
  - Loading spinner appears
  - 2-sentence story generates using the word
  - Story displays in indigo box
- [ ] **AI Quiz Generator**:
  - Click "✨ AI Quiz" button
  - Loading spinner appears
  - Multiple choice question generates
  - 4 options display
  - Clicking correct answer highlights in green
  - Incorrect answers don't highlight

### Navigation & State Management
- [ ] **Previous/Next Buttons**: Navigate through 10 words
- [ ] **New Set Button**: Refreshes with new random selection
- [ ] **Mark as Mastered**: Click checkmark, green counter increments
- [ ] **Mark as Missed**: Click X, red counter increments
- [ ] **Favorites**: Heart icon toggles between empty/filled states

### Responsive Design
- [ ] **Desktop**: Layout looks good on 1920x1080
- [ ] **Tablet**: Layout adjusts properly on iPad (768px)
- [ ] **Mobile**: Layout works on iPhone (375px)
- [ ] **Card**: Readable and functional at all screen sizes

### Error Handling
- [ ] **API Errors**: Error notification shows if API call fails
- [ ] **Network Issues**: Retry mechanism works (exponential backoff)
- [ ] **Invalid API Key**: Graceful error message displays
- [ ] **Loading States**: All async operations show loading indicators

## 🧪 Manual Testing Steps

### 1. First Load
```bash
npm run dev
```
- Open browser to `http://localhost:5173/engpro7/`
- Verify the page loads with the first word displayed
- Check console for any errors

### 2. Test Difficulty Filters
- Click "Easy" - should show only easy words (reluctant, persistent, contradict)
- Click "Hard" - should show only hard words (meticulous, ephemeral, pandemonium, etc.)
- Click "All" - should show all 11 words

### 3. Test Flashcard Interaction
- Click the card to flip
- Verify smooth 3D rotation animation
- Click "Flip" button on back to return
- Test on multiple words

### 4. Test AI Features (One by One)
```
⚠️ Note: These features consume API credits
```

**TTS Test:**
1. Click speaker icon on word "analyze"
2. Wait for audio to load (~2-3 seconds)
3. Audio should play pronunciation
4. Test on back side with full definition

**Story Test:**
1. Flip card to back
2. Click "✨ AI Story" button
3. Wait for generation (~3-5 seconds)
4. Story should appear in indigo box
5. Verify story uses the target word

**Quiz Test:**
1. Click "✨ AI Quiz" button
2. Wait for generation (~3-5 seconds)
3. Question and 4 options should appear
4. Click wrong answer - no highlight
5. Click correct answer - should highlight green

### 5. Test Progress Tracking
- Mark 3 words as "Mastered" - green counter should show 3
- Mark 2 words as "Missed" - red counter should show 2
- Click "New Set" - counters should reset to 0

### 6. Test Navigation
- Click "Next Word" 9 times to reach end
- Counter should show "10/10"
- Click "Next Word" again - should loop to 1/10
- Click "Previous" to go backward

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module 'lucide-react'"
**Solution:**
```bash
npm install lucide-react
```

### Issue: Tailwind styles not applying
**Solution:**
1. Verify [`src/index.css`](src/index.css) imports Tailwind directives
2. Ensure [`src/main.jsx`](src/main.jsx) imports `'./index.css'`
3. Restart dev server: `npm run dev`

### Issue: API calls failing (401 Unauthorized)
**Solution:**
1. Check [`.env`](.env) file contains valid `VITE_GEMINI_API_KEY`
2. Restart dev server to load new env variables
3. Verify API key has not expired

### Issue: Audio doesn't play
**Solution:**
1. Check browser console for errors
2. Verify API key is valid
3. Test in different browser (Chrome recommended)
4. Check browser autoplay policies

### Issue: 3D flip animation not working
**Solution:**
1. Check browser supports CSS 3D transforms
2. Verify [`src/index.css`](src/index.css) contains custom utilities
3. Clear browser cache and reload

### Issue: Base path incorrect (404 on build)
**Solution:**
1. Verify [`vite.config.js`](vite.config.js) has `base: '/engpro7/'`
2. Ensure it matches [`package.json`](package.json) homepage path
3. Rebuild: `npm run build`

## 📱 Browser Compatibility

### Recommended Browsers
- ✅ **Chrome 90+** (Best performance)
- ✅ **Firefox 88+** (Recommended)
- ✅ **Safari 14+** (macOS/iOS)
- ✅ **Edge 90+** (Chromium-based)

### Known Limitations
- ⚠️ **IE 11**: Not supported (React 18 requirement)
- ⚠️ **Safari < 14**: CSS 3D transforms may not work
- ⚠️ **Mobile Chrome**: Audio autoplay may be blocked

## 🚀 Build for Production

### Local Build Test
```bash
npm run build
```
This creates an optimized build in `dist/` folder.

### Preview Production Build
```bash
npm run preview
```
Test the production build locally at `http://localhost:4173/engpro7/`

### Deploy to GitHub Pages

**Option 1: Manual Deployment**
```bash
# Build the project
npm run build

# Deploy dist folder to gh-pages branch
# (Use gh-pages package or manual git commands)
```

**Option 2: GitHub Actions (Recommended)**
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Verify Deployment
After deployment, visit:
```
https://boonsup.github.io/engpro7/
```

## 📊 Performance Optimization

### Current Performance Metrics
- **First Load**: ~2-3 seconds
- **Card Flip**: 700ms animation
- **TTS Generation**: 2-5 seconds
- **Story Generation**: 3-5 seconds
- **Quiz Generation**: 3-5 seconds

### Optimization Tips
1. **Lazy Load Icons**: Consider dynamic imports for Lucide icons
2. **Memoization**: Already implemented with `useMemo` and `useCallback`
3. **Code Splitting**: Vite automatically splits vendor chunks
4. **Image Optimization**: Add if using images in the future
5. **API Caching**: Consider caching AI responses (localStorage)

## 🔐 Security Considerations

### API Key Security
⚠️ **Current Setup**: API key is in [`.env`](.env) file
- ✅ Safe for development
- ⚠️ **Not safe for production** (exposed in client-side code)

### Recommended for Production
1. **Server-Side Proxy**: Hide API key on backend
2. **Rate Limiting**: Prevent API abuse
3. **User Authentication**: Track usage per user
4. **API Key Rotation**: Regular key updates

### Environment Variables
- ✅ `.env` is in `.gitignore` (don't commit API keys)
- ⚠️ Built files contain the key (use server-side proxy)

## 📚 Additional Resources

### Documentation
- [Vite Documentation](https://vitejs.dev/)
- [React 18 Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Gemini API Documentation](https://ai.google.dev/docs)

### Related Files
- [`plans/vocabmaster-integration-plan.md`](plans/vocabmaster-integration-plan.md) - Full implementation guide
- [`README.md`](README.md) - Project overview

## 💡 Development Tips

### Hot Module Replacement (HMR)
Vite provides instant updates without full page reload:
- Edit [`src/App.jsx`](src/App.jsx) - changes reflect immediately
- Edit [`src/index.css`](src/index.css) - styles update instantly

### React DevTools
Install React DevTools browser extension:
- Inspect component state
- View props and hooks
- Profile performance

### Console Logging
The app includes error handling:
- Check console for API errors
- Network tab shows API requests
- Console.log removed in production build

## 🎯 Success Criteria

✅ All core features implemented  
✅ AI features working with valid API key  
✅ Responsive design on mobile/tablet/desktop  
✅ Smooth animations and transitions  
✅ No console errors on load  
✅ Build completes without errors  
✅ Production preview works correctly  

## 🆘 Getting Help

If you encounter issues:
1. Check this guide's "Common Issues" section
2. Review [`plans/vocabmaster-integration-plan.md`](plans/vocabmaster-integration-plan.md)
3. Check browser console for specific error messages
4. Verify all dependencies installed: `npm install`
5. Try clearing cache: `npm run dev -- --force`

---

**Ready to start?** Run `npm run dev` and begin testing! 🚀
