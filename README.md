# VocabMaster AI 🎓✨

An intelligent vocabulary learning application for grades 7-9, powered by Google's Gemini AI. Master new words through interactive flashcards, AI-generated stories, quizzes, and natural text-to-speech pronunciation.

![VocabMaster AI](https://img.shields.io/badge/React-18.2.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.5-38B2AC)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

### Core Learning Experience
- **📚 1000+ Vocabulary Words** - Loaded from JSON database for grades 7-9
- **🎴 3D Flashcard System** - Interactive cards with smooth flip animations
- **🎯 Difficulty Levels** - Filter by Easy, Intermediate, or Hard
- **📊 Persistent Progress Tracking** - Mastered/missed counts saved across sessions
- **🧠 Smart Word Selection** - Mastered words appear 80% less often for optimal review
- **💾 Auto-Save** - Progress automatically saved to browser localStorage
- **🔄 Reset Progress** - Clear all data and start fresh anytime
- **❤️ Favorites System** - Save your preferred words for quick review

### AI-Powered Features (Gemini API)
- **🔊 Text-to-Speech** - Natural pronunciation using Gemini TTS
- **📖 Story Generator** - AI creates contextual micro-stories using the word
- **❓ Quiz Generator** - Intelligent multiple-choice questions to test understanding
- **🔄 Smart Retry Logic** - Exponential backoff for API reliability

### Rich Word Information
- **Etymology** - Word origins and roots (Greek, Latin, etc.)
- **Mnemonics** - Memory tips to help retention
- **Part of Speech** - Grammatical classification
- **Synonyms & Antonyms** - Related words
- **Example Sentences** - Real-world usage
- **Achievement Badges** - Word Wizard, Etymologist badges

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- Google Gemini API key ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/boonsup/boonsup.github.io.git
   cd boonsup.github.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   Navigate to: `http://localhost:5173/`

## 📖 Usage

### Learning Workflow

1. **Browse Words**
   - Use difficulty filters (All/Easy/Intermediate/Hard)
   - Navigate with Previous/Next buttons

2. **Study Front of Card**
   - View the vocabulary word
   - Click speaker icon for pronunciation
   - Note the part of speech badge
   - Add to favorites with heart icon

3. **Flip Card for Details**
   - Click card to see definition
   - Review etymology and mnemonics
   - Mark as Mastered (✓) or Missed (✗)

4. **Enhance Learning with AI**
   - **✨ AI Story**: Generate a contextual story
   - **✨ AI Quiz**: Test your understanding
   - **🔊 Speak with AI Voice**: Hear full definition

5. **Track Progress**
   - Monitor mastered word count (green)
   - Review missed words (red)
   - Generate new word sets with refresh button

## 🛠️ Technology Stack

### Frontend
- **React 18.2** - UI library with hooks
- **Tailwind CSS 3.3** - Utility-first styling
- **Lucide React** - Icon library (19 icons)
- **Vite 5.0** - Build tool and dev server

### AI Integration
- **Google Gemini API** - Multiple services:
  - `gemini-2.5-flash-preview-tts` - Text-to-speech
  - `gemini-2.5-flash-preview-09-2025` - Content generation

### Features & APIs
- **CSS 3D Transforms** - Card flip animations
- **Web Audio API** - Audio playback
- **Fetch API** - Network requests with retry logic
- **LocalStorage** - Favorites persistence (planned)

## 📁 Project Structure

```
boonsup.github.io/
├── src/
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # React entry point
│   └── index.css            # Tailwind + custom styles
├── data/
│   └── vocab1000.json       # Extended vocabulary (optional)
├── plans/
│   └── vocabmaster-integration-plan.md
├── public/                  # Static assets
├── index.html               # HTML entry point
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── .env                     # Environment variables (gitignored)
├── .gitignore              # Git ignore rules
├── SETUP.md                # Testing & troubleshooting guide
└── README.md               # This file
```

## 🎨 Design Highlights

### Color Scheme
- **Primary**: Indigo 600 (`#4F46E5`)
- **Background**: Slate 50 (`#F8FAFC`)
- **Dark Card**: Slate 900 (`#0F172A`)
- **Success**: Green 600 (`#16A34A`)
- **Error**: Red 500 (`#EF4444`)

### Typography
- **Headings**: Black weight (900), tight tracking
- **Body**: Sans-serif, leading-relaxed
- **Word Display**: 6xl size (60px), capitalized

### Animations
- **Card Flip**: 700ms 3D transform
- **Transitions**: Scale, opacity, color changes
- **Loading**: Pulse and spin effects

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

### GitHub Pages (Automatic)

The project uses **GitHub Actions** for automatic deployment to:
```
https://boonsup.github.io/
```

#### Quick Deploy Steps:
1. Enable GitHub Pages in repository settings (Source: GitHub Actions)
2. Add `VITE_GEMINI_API_KEY` to repository secrets
3. Push to `main` branch
4. GitHub Actions automatically builds and deploys

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for complete deployment guide including:
- Automatic deployment with GitHub Actions
- Manual deployment options
- Environment variable configuration
- Custom domain setup
- Troubleshooting tips

### Build Locally

```bash
npm run build
```

The build creates an optimized `dist/` folder ready for deployment.

### Environment Variables in Production

⚠️ **Security Note**: API keys are stored as GitHub Secrets during deployment. For enhanced security, consider:
- Server-side proxy to hide API keys
- Rate limiting per user
- API key rotation
- User authentication

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Installation, testing checklist, troubleshooting
- **[Implementation Plan](plans/vocabmaster-integration-plan.md)** - Architecture details

## 🐛 Common Issues

### API Key Not Working
- Verify `.env` contains `VITE_GEMINI_API_KEY=your_key`
- Restart dev server after changing `.env`
- Check API key is active on [Google AI Studio](https://ai.google.dev/)

### Styles Not Loading
- Ensure Tailwind is properly configured
- Check `src/main.jsx` imports `./index.css`
- Clear browser cache and restart server

### Audio Not Playing
- Check browser console for errors
- Verify browser supports Web Audio API
- Test in Chrome (recommended browser)
- Check browser autoplay policies

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Roadmap

### Upcoming Features
- [ ] Add 100+ more vocabulary words
- [ ] Implement spaced repetition algorithm
- [ ] Add user accounts and cloud sync
- [ ] Create achievement system with leaderboards
- [ ] Support multiple grade levels (4-12)
- [ ] Multi-language support
- [ ] Offline mode with service workers
- [ ] Export progress reports (PDF/CSV)
- [ ] Flashcard sharing between users
- [ ] Dark/Light theme toggle

## 🏆 Word Database

### Word Source
- **Primary**: `data/vocab1000.json` - 1000+ curated words
- **Fallback**: 3 embedded words if JSON loading fails
- **Dynamic Loading**: Words loaded on app start
- **Auto-Difficulty**: Inferred from grade level if not specified

### Word Properties
Each word includes:
- Word text and definition
- Part of speech (noun, verb, adjective, etc.)
- Grade level (7-9)
- Difficulty rating (easy/intermediate/hard)
- Notions (academic, descriptive, etc.)
- Etymology (origin, root, meaning)
- Memory tip (mnemonic device)
- Synonyms and antonyms
- Example sentence showing usage
- Achievement badges (word-wizard, etymologist, etc.)

### Smart Selection Algorithm
- **New words**: 100% probability of selection
- **Mastered words**: 20% probability (80% reduction)
- **Weighted random**: Ensures variety while focusing on unmastered words
- **Persistent tracking**: Progress saved in browser localStorage

## 📊 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Fully Supported |
| Firefox | 88+     | ✅ Fully Supported |
| Safari  | 14+     | ✅ Supported |
| Edge    | 90+     | ✅ Fully Supported |
| IE 11   | -       | ❌ Not Supported |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Boonsup**
- GitHub: [@boonsup](https://github.com/boonsup)
- Website: [boonsup.github.io](https://boonsup.github.io/)

## 🙏 Acknowledgments

- **Google Gemini AI** - For powerful AI capabilities
- **React Team** - For the amazing framework
- **Tailwind CSS** - For rapid UI development
- **Lucide Icons** - For beautiful iconography
- **Vite Team** - For blazingly fast build tool

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check [SETUP.md](SETUP.md) for troubleshooting
- Review [implementation plan](plans/vocabmaster-integration-plan.md)

---

**Made with ❤️ for vocabulary learners everywhere**

*Happy Learning! 📚✨*
