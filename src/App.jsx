import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  BookOpen, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  Zap,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Heart,
  Shuffle,
  Trophy,
  RefreshCw,
  Volume2,
  Wand2,
  HelpCircle,
  Loader2,
  Info
} from 'lucide-react';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Helper for Exponential Backoff
const fetchWithRetry = async (url, options, retries = 5, backoff = 1000) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
};

const generateFullWordPool = () => {
  return [
    { "word": "analyze", "grade": 8, "difficulty": "intermediate", "notions": ["academic"], "definition": "To examine something in detail to understand it.", "part_of_speech": "verb", "synonyms": ["examine", "study"], "antonyms": ["ignore"], "root": { "origin": "Greek", "root": "analusis", "meaning": "to break up" }, "memory_tip": "Loosening the parts to see how they fit.", "badges": ["word-wizard"], "example_sentence": "In science class, we will analyze the chemical composition." },
    { "word": "benevolent", "grade": 8, "difficulty": "intermediate", "notions": ["descriptive"], "definition": "Kind and helpful; well-meaning.", "part_of_speech": "adjective", "synonyms": ["kind", "generous"], "antonyms": ["malevolent"], "root": { "origin": "Latin", "root": "bene", "meaning": "well" }, "memory_tip": "Bene (good) + Volunteer.", "badges": ["etymologist"], "example_sentence": "The benevolent teacher spent her weekends tutoring." },
    { "word": "reluctant", "grade": 7, "difficulty": "easy", "notions": ["descriptive"], "definition": "Unwilling and hesitant.", "part_of_speech": "adjective", "synonyms": ["hesitant"], "antonyms": ["eager"], "root": { "origin": "Latin", "root": "luctari", "meaning": "to struggle" }, "memory_tip": "Wrestling with a decision.", "badges": [], "example_sentence": "She was reluctant to jump into the cold pool." },
    { "word": "contradict", "grade": 8, "difficulty": "easy", "notions": ["academic"], "definition": "To say the opposite; to be inconsistent.", "part_of_speech": "verb", "synonyms": ["disagree"], "antonyms": ["agree"], "root": { "origin": "Latin", "root": "contra + dict", "meaning": "against + speak" }, "memory_tip": "Speak against someone.", "badges": ["etymologist"], "example_sentence": "The evidence seems to contradict his statement." },
    { "word": "meticulous", "grade": 9, "difficulty": "hard", "notions": ["descriptive"], "definition": "Showing great attention to detail.", "part_of_speech": "adjective", "synonyms": ["careful"], "antonyms": ["sloppy"], "root": { "origin": "Latin", "root": "metus", "meaning": "fear" }, "memory_tip": "Afraid of making a mistake.", "badges": ["word-wizard"], "example_sentence": "Her meticulous preparation ensured success." },
    { "word": "ephemeral", "grade": 9, "difficulty": "hard", "notions": ["descriptive"], "definition": "Lasting for a very short time.", "part_of_speech": "adjective", "synonyms": ["fleeting"], "antonyms": ["permanent"], "root": { "origin": "Greek", "root": "epi + hemera", "meaning": "on + day" }, "memory_tip": "A mayfly lives only for a day.", "badges": ["etymologist"], "example_sentence": "The beauty of a rainbow is ephemeral." },
    { "word": "pandemonium", "grade": 9, "difficulty": "hard", "notions": ["descriptive"], "definition": "Wild and noisy disorder.", "part_of_speech": "noun", "synonyms": ["chaos"], "antonyms": ["order"], "root": { "origin": "Greek", "root": "pan + daimon", "meaning": "all + demon" }, "memory_tip": "Place of all demons.", "badges": ["etymologist"], "example_sentence": "Pandemonium broke out in the stadium." },
    { "word": "persistent", "grade": 7, "difficulty": "easy", "notions": ["descriptive"], "definition": "Continuing firmly in spite of difficulty.", "part_of_speech": "adjective", "synonyms": ["tenacious"], "antonyms": ["irresolute"], "root": { "origin": "Latin", "root": "per + sistere", "meaning": "through + to stand" }, "memory_tip": "Standing through challenges.", "badges": [], "example_sentence": "With persistent effort, she mastered the trick." },
    { "word": "ambiguous", "grade": 9, "difficulty": "hard", "notions": ["academic"], "definition": "Open to more than one interpretation.", "part_of_speech": "adjective", "synonyms": ["unclear"], "antonyms": ["explicit"], "root": { "origin": "Latin", "root": "ambi", "meaning": "both" }, "memory_tip": "Driven in both directions.", "badges": ["etymologist"], "example_sentence": "The ending of the movie was ambiguous." },
    { "word": "innovate", "grade": 8, "difficulty": "intermediate", "notions": ["stem"], "definition": "To introduce new methods or ideas.", "part_of_speech": "verb", "synonyms": ["pioneer"], "antonyms": ["stagnate"], "root": { "origin": "Latin", "root": "novus", "meaning": "new" }, "memory_tip": "Bringing in something new.", "badges": ["etymologist"], "example_sentence": "Companies must innovate to stay ahead." },
    { "word": "scrupulous", "grade": 9, "difficulty": "hard", "notions": ["academic"], "definition": "Diligent, thorough, and extremely attentive to details.", "part_of_speech": "adjective", "synonyms": ["meticulous"], "antonyms": ["careless"], "root": { "origin": "Latin", "root": "scrupus", "meaning": "sharp stone" }, "memory_tip": "Like having a sharp stone in your shoe that you can't ignore.", "badges": ["word-wizard"], "example_sentence": "The researcher was scrupulous in her data collection." }
  ];
};

const App = () => {
  const allWords = useMemo(() => generateFullWordPool(), []);
  
  const [difficulty, setDifficulty] = useState('all');
  const [roundWords, setRoundWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [doneWords, setDoneWords] = useState(new Set());
  const [missedWords, setMissedWords] = useState(new Set());

  // Gemini State
  const [aiContent, setAiContent] = useState({ story: "", quiz: null });
  const [loading, setLoading] = useState({ story: false, quiz: false, tts: false });
  const [errorMsg, setErrorMsg] = useState("");

  const fetchNewSet = useCallback(() => {
    let pool = allWords;
    if (difficulty !== 'all') {
      pool = allWords.filter(w => w.difficulty === difficulty);
    }
    const numToPick = Math.min(pool.length, 10);
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setRoundWords(shuffled.slice(0, numToPick));
    setCurrentIndex(0);
    setIsFlipped(false);
    setDoneWords(new Set());
    setMissedWords(new Set());
    setAiContent({ story: "", quiz: null });
  }, [difficulty, allWords]);

  useEffect(() => {
    fetchNewSet();
  }, [fetchNewSet]);

  const word = roundWords[currentIndex];

  // AI Feature: TTS
  const playTTS = async (text) => {
    if (loading.tts) return;
    setLoading(prev => ({ ...prev, tts: true }));
    try {
      const payload = {
        contents: [{ parts: [{ text: `Say naturally and clearly: ${text}` }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } }
        },
        model: "gemini-2.5-flash-preview-tts"
      };

      const result = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
        { method: 'POST', body: JSON.stringify(payload) }
      );

      const base64Data = result.candidates[0].content.parts[0].inlineData.data;
      const binaryData = atob(base64Data);
      const buffer = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) buffer[i] = binaryData.charCodeAt(i);

      // Create WAV (Assuming 24kHz PCM from Gemini TTS)
      const wavHeader = new ArrayBuffer(44);
      const view = new DataView(wavHeader);
      const sampleRate = 24000;
      view.setUint32(0, 0x52494646, false); 
      view.setUint32(4, 36 + buffer.length, true);
      view.setUint32(8, 0x57415645, false);
      view.setUint32(12, 0x666d7420, false);
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      view.setUint32(36, 0x64617461, false);
      view.setUint32(40, buffer.length, true);

      const blob = new Blob([wavHeader, buffer], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (e) {
      setErrorMsg("Audio service unavailable. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, tts: false }));
    }
  };

  // AI Feature: Story Generator
  const generateStory = async () => {
    setLoading(prev => ({ ...prev, story: true }));
    try {
      const prompt = `Write a 2-sentence micro-story using the word "${word.word}" in a way that makes its meaning obvious. Format: just the story text.`;
      const result = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        { method: 'POST', body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
      );
      setAiContent(prev => ({ ...prev, story: result.candidates[0].content.parts[0].text }));
    } catch (e) {
      setErrorMsg("Could not generate story.");
    } finally {
      setLoading(prev => ({ ...prev, story: false }));
    }
  };

  // AI Feature: Quiz Generator
  const generateQuiz = async () => {
    setLoading(prev => ({ ...prev, quiz: true }));
    try {
      const prompt = `Create a multiple choice question to test if someone understands the word "${word.word}". Include 4 options and identify the correct one.`;
      const schema = {
        type: "OBJECT",
        properties: {
          question: { type: "STRING" },
          options: { type: "ARRAY", items: { type: "STRING" } },
          answerIndex: { type: "NUMBER" }
        },
        required: ["question", "options", "answerIndex"]
      };

      const result = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json", responseSchema: schema }
          })
        }
      );
      setAiContent(prev => ({ ...prev, quiz: JSON.parse(result.candidates[0].content.parts[0].text) }));
    } catch (e) {
      setErrorMsg("Could not generate quiz.");
    } finally {
      setLoading(prev => ({ ...prev, quiz: false }));
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setAiContent({ story: "", quiz: null });
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % roundWords.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setAiContent({ story: "", quiz: null });
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + roundWords.length) % roundWords.length);
    }, 150);
  };

  const toggleFavorite = (e, wordText) => {
    e.stopPropagation();
    const next = new Set(favorites);
    if (next.has(wordText)) next.delete(wordText);
    else next.add(wordText);
    setFavorites(next);
  };

  if (!word) return <div className="p-20 text-center font-bold text-slate-400">Loading your word pool...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center font-sans text-slate-800">
      {/* AI Error Alert */}
      {errorMsg && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-xl z-[100] flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <Info size={18} />
          <span className="text-sm font-bold">{errorMsg}</span>
          <button onClick={() => setErrorMsg("")} className="ml-4 opacity-50 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Header Section */}
      <header className="max-w-4xl w-full flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <GraduationCap size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              VocabMaster AI <Sparkles size={18} className="text-indigo-400" />
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Grade 7-9 Builder</p>
          </div>
        </div>

        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
          {['all', 'easy', 'intermediate', 'hard'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setDifficulty(lvl)}
              className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${difficulty === lvl ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </header>

      {/* Stats and Refresh */}
      <div className="max-w-2xl w-full grid grid-cols-4 gap-3 mb-6">
        <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm text-center">
          <span className="block text-[10px] text-slate-400 font-black uppercase">Word</span>
          <span className="text-lg font-black">{currentIndex + 1}/10</span>
        </div>
        <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm text-center">
          <span className="block text-[10px] text-green-500 font-black uppercase tracking-tighter">Mastered</span>
          <span className="text-lg font-black text-green-600">{doneWords.size}</span>
        </div>
        <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm text-center">
          <span className="block text-[10px] text-red-500 font-black uppercase tracking-tighter">Missed</span>
          <span className="text-lg font-black text-red-600">{missedWords.size}</span>
        </div>
        <button 
          onClick={fetchNewSet}
          className="bg-indigo-50 hover:bg-indigo-100 px-4 py-3 rounded-2xl border border-indigo-100 flex flex-col items-center justify-center transition-all group active:scale-95"
        >
          <RefreshCw size={18} className="text-indigo-600 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-[10px] text-indigo-600 font-black uppercase mt-1">New Set</span>
        </button>
      </div>

      {/* The Card */}
      <div className="max-w-2xl w-full relative h-[500px] perspective-1000 group">
        <div 
          className={`relative w-full h-full transition-all duration-700 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* Front: Discovery */}
          <div onClick={() => setIsFlipped(true)} className="absolute inset-0 backface-hidden bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center justify-center p-12 text-center overflow-hidden">
            <button 
              onClick={(e) => toggleFavorite(e, word.word)}
              className="absolute top-8 right-8 p-3 rounded-2xl hover:bg-rose-50 transition-colors z-10"
            >
              <Heart size={24} className={`${favorites.has(word.word) ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-300'} transition-all`} />
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); playTTS(word.word); }}
              className={`absolute top-8 left-8 p-3 rounded-2xl hover:bg-indigo-50 transition-colors text-indigo-400 z-10 ${loading.tts ? 'animate-pulse' : ''}`}
            >
              {loading.tts ? <Loader2 className="animate-spin" size={24} /> : <Volume2 size={24} />}
            </button>

            <span className="text-indigo-500 font-bold tracking-[0.2em] text-[10px] uppercase mb-4 px-4 py-1.5 bg-indigo-50 rounded-full">
              {word.part_of_speech}
            </span>
            
            <h2 className="text-6xl font-black text-slate-800 tracking-tighter capitalize mb-8 group-hover:scale-105 duration-300">
              {word.word}
            </h2>

            <div className="flex gap-3">
              {word.badges.map(b => (
                <span key={b} className="flex items-center gap-1 text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-100 px-3 py-1 rounded-lg uppercase">
                  <Award size={12} /> {b}
                </span>
              ))}
            </div>

            <div className="absolute bottom-10 text-slate-300 flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest">Click to Flip</span>
              <RotateCcw size={16} className="animate-spin-slow" />
            </div>
          </div>

          {/* Back: Detail */}
          <div className="absolute inset-0 backface-hidden bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 flex flex-col text-white rotate-y-180 border-[6px] border-slate-800 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-3xl font-black tracking-tight capitalize">{word.word}</h3>
              <div className="flex gap-2">
                <button onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }} className="p-2 hover:bg-white/10 rounded-lg"><RotateCcw size={18} /></button>
                <button onClick={() => setMissedWords(prev => new Set(prev).add(word.word))} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg border border-red-500/40"><XCircle size={18} className="text-red-400" /></button>
                <button onClick={() => setDoneWords(prev => new Set(prev).add(word.word))} className="p-2 bg-green-500/20 hover:bg-green-500/40 rounded-lg border border-green-500/40"><CheckCircle2 size={18} className="text-green-400" /></button>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-lg leading-relaxed text-slate-200">{word.definition}</p>
              
              <div className="flex gap-2">
                <button 
                  onClick={generateStory}
                  disabled={loading.story}
                  className="flex-1 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-600/40 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  {loading.story ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                  ✨ AI Story
                </button>
                <button 
                  onClick={generateQuiz}
                  disabled={loading.quiz}
                  className="flex-1 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/40 border border-amber-600/40 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  {loading.quiz ? <Loader2 size={14} className="animate-spin" /> : <HelpCircle size={14} />}
                  ✨ AI Quiz
                </button>
              </div>

              {/* AI Content Displays */}
              {aiContent.story && (
                <div className="bg-indigo-600/10 p-4 rounded-2xl border border-indigo-600/20 animate-in fade-in zoom-in-95">
                  <span className="text-[10px] font-black uppercase text-indigo-400 block mb-1">Contextual Story</span>
                  <p className="text-sm italic text-indigo-50 leading-relaxed">"{aiContent.story}"</p>
                </div>
              )}

              {aiContent.quiz && (
                <div className="bg-amber-600/10 p-4 rounded-2xl border border-amber-600/20 animate-in fade-in zoom-in-95">
                  <span className="text-[10px] font-black uppercase text-amber-400 block mb-2">Pop Quiz</span>
                  <p className="text-sm font-bold mb-3">{aiContent.quiz.question}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {aiContent.quiz.options.map((opt, i) => (
                      <button 
                        key={i} 
                        onClick={() => {
                          if(i === aiContent.quiz.answerIndex) {
                            setAiContent(prev => ({...prev, quiz: {...prev.quiz, solved: true}}))
                          }
                        }}
                        className={`text-left px-3 py-2 rounded-lg text-xs transition-all ${
                          aiContent.quiz.solved && i === aiContent.quiz.answerIndex ? 'bg-green-500/40 border-green-500' : 'bg-white/5 hover:bg-white/10'
                        } border border-transparent`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/5 p-3 rounded-xl">
                <span className="text-[10px] font-black uppercase text-indigo-300 block mb-1">Etymology</span>
                <p className="text-[11px] italic">"{word.root.root}" — {word.root.meaning}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl">
                <span className="text-[10px] font-black uppercase text-amber-300 block mb-1">Mnemonics</span>
                <p className="text-[11px] leading-tight">{word.memory_tip}</p>
              </div>
            </div>
            
            <button 
              onClick={() => playTTS(`${word.word}. ${word.definition}`)}
              className="mt-auto w-full py-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center gap-2 text-xs font-bold transition-all"
            >
              {loading.tts ? <Loader2 className="animate-spin" size={14} /> : <Volume2 size={14} />}
              ✨ Speak with AI Voice
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-2xl w-full flex gap-4 mt-8">
        <button onClick={handlePrev} className="flex-1 bg-white hover:bg-slate-50 p-5 rounded-3xl shadow-sm border border-slate-200 font-black text-slate-600 flex justify-center items-center gap-3 active:scale-95 transition-all">
          <ChevronLeft size={20} /> Previous
        </button>
        <button onClick={handleNext} className="flex-1 bg-white hover:bg-slate-50 p-5 rounded-3xl shadow-sm border border-slate-200 font-black text-slate-600 flex justify-center items-center gap-3 active:scale-95 transition-all">
          Next Word <ChevronRight size={20} />
        </button>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1200px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
