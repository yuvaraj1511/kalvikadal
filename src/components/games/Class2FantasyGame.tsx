import React, { useState } from 'react';
import { Volume2, CheckCircle2, RotateCcw, Sparkles, Heart } from 'lucide-react';
import { Language } from '../../types';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface Class2FantasyGameProps {
  lang: Language;
  onEarnStar: () => void;
}

const WORD_QUESTIONS = [
  {
    incompleteWord: 'யா _ ை',
    fullWordTa: 'யானை',
    fullWordEn: 'Elephant',
    icon: '🐘',
    missingLetter: 'னை',
    options: ['னை', 'மை', 'கை'],
    factTa: 'யானை நிலத்தில் வாழும் மிகப்பெரிய விலங்கு!',
    factEn: 'Elephant is the largest living land animal!'
  },
  {
    incompleteWord: 'ம _ ல்',
    fullWordTa: 'மயில்',
    fullWordEn: 'Peacock',
    icon: '🦚',
    missingLetter: 'யி',
    options: ['யி', 'ரி', 'தி'],
    factTa: 'மயில் இந்தியாவின் தேசியப் பறவை!',
    factEn: 'Peacock is the national bird of India!'
  },
  {
    incompleteWord: 'சி _ கம்',
    fullWordTa: 'சிங்கம்',
    fullWordEn: 'Lion',
    icon: '🦁',
    missingLetter: 'ங்',
    options: ['ங்', 'ம்', 'ண்'],
    factTa: 'சிங்கம் காட்டின் அரசன் என அழைக்கப்படுகிறது!',
    factEn: 'The lion is known as the king of the jungle!'
  },
  {
    incompleteWord: 'மு _ ல்',
    fullWordTa: 'முயல்',
    fullWordEn: 'Rabbit',
    icon: '🐇',
    missingLetter: 'ய',
    options: ['ய', 'ம', 'ட'],
    factTa: 'முயல் கேரட் சாப்பிட மிகவும் விரும்பும்!',
    factEn: 'Rabbits love to munch fresh carrots!'
  }
];

const MATH_QUESTIONS = [
  {
    questionTa: 'வானவில் தோட்டத்தில் 5 மாயாஜால பட்டாம்பூச்சிகள் உள்ளன. மேலும் 4 பட்டாம்பூச்சிகள் வந்து சேர்ந்தன. மொத்தம் எத்தனை?',
    questionEn: 'There are 5 magical butterflies in the meadow. 4 more flew in. How many in total?',
    calc: '5 + 4',
    correctAnswer: 9,
    options: [7, 8, 9],
    iconsA: ['🦋', '🦋', '🦋', '🦋', '🦋'],
    iconsB: ['🦋', '🦋', '🦋', '🦋']
  },
  {
    questionTa: 'மரக்கிளையில் 8 பழங்கள் இருந்தன. மந்திரக்குட்டி 3 பழங்களை உண்டுவிட்டது. மீதம் எத்தனை பழங்கள்?',
    questionEn: 'There were 8 magic fruits on the tree. The friendly creature ate 3. How many are left?',
    calc: '8 - 3',
    correctAnswer: 5,
    options: [4, 5, 6],
    iconsA: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎'],
    iconsB: ['❌', '❌', '❌']
  },
  {
    questionTa: 'மலர் சோலையில் 6 நீல மலர்களும், 6 மஞ்சள் மலர்களும் மலர்ந்தன. மொத்த மலர்கள் எத்தனை?',
    questionEn: '6 blue flowers and 6 yellow flowers bloomed. How many flowers altogether?',
    calc: '6 + 6',
    correctAnswer: 12,
    options: [10, 12, 14],
    iconsA: ['💙', '💙', '💙', '💙', '💙', '💙'],
    iconsB: ['💛', '💛', '💛', '💛', '💛', '💛']
  }
];

export const Class2FantasyGame: React.FC<Class2FantasyGameProps> = ({ lang, onEarnStar }) => {
  const [activeTab, setActiveTab] = useState<'words' | 'math'>('words');
  const [wordIdx, setWordIdx] = useState(0);
  const [mathIdx, setMathIdx] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; msg: string } | null>(null);

  const curWord = WORD_QUESTIONS[wordIdx];
  const curMath = MATH_QUESTIONS[mathIdx];

  const handleWordAnswer = (chosen: string) => {
    if (chosen === curWord.missingLetter) {
      sound.playSuccess();
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
      setFeedback({
        isCorrect: true,
        msg: lang === 'ta'
          ? `அருமை! '${curWord.fullWordTa}' (${curWord.fullWordEn}) சரியாக அமைந்தது!`
          : `Awesome! Spelled '${curWord.fullWordTa}' (${curWord.fullWordEn}) correctly!`
      });
      onEarnStar();
      setTimeout(() => {
        setFeedback(null);
        if (wordIdx < WORD_QUESTIONS.length - 1) {
          setWordIdx(wordIdx + 1);
        } else {
          setWordIdx(0);
        }
      }, 1600);
    } else {
      sound.playWrong();
      setFeedback({
        isCorrect: false,
        msg: lang === 'ta' ? 'தவறான எழுத்து! மீண்டும் முயற்சிக்கவும்.' : 'Not quite! Try another letter.'
      });
    }
  };

  const handleMathAnswer = (chosen: number) => {
    if (chosen === curMath.correctAnswer) {
      sound.playSuccess();
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
      setFeedback({
        isCorrect: true,
        msg: lang === 'ta' ? `சரியான விடை! ${curMath.calc} = ${curMath.correctAnswer}` : `Spot on! ${curMath.calc} = ${curMath.correctAnswer}`
      });
      onEarnStar();
      setTimeout(() => {
        setFeedback(null);
        if (mathIdx < MATH_QUESTIONS.length - 1) {
          setMathIdx(mathIdx + 1);
        } else {
          setMathIdx(0);
        }
      }, 1600);
    } else {
      sound.playWrong();
      setFeedback({
        isCorrect: false,
        msg: lang === 'ta' ? 'எண்ணிக்கையை சரிபார்த்து விடையளியுங்கள்!' : 'Count carefully and try again!'
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-pink-200 shadow-md p-4 sm:p-6">
      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-pink-200 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('words');
              setFeedback(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'words'
                ? 'bg-fuchsia-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-pink-100'
            }`}
          >
            🦄 {lang === 'ta' ? 'விலங்கு சொல் தோட்டம்' : 'Animal Word Meadow'}
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('math');
              setFeedback(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'math'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-pink-100'
            }`}
          >
            🌈 {lang === 'ta' ? 'வானவில் கூட்டல் சோலை' : 'Rainbow Math'}
          </button>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            setWordIdx(0);
            setMathIdx(0);
            setFeedback(null);
          }}
          className="text-xs text-slate-500 hover:text-pink-800 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{lang === 'ta' ? 'மறுதொடக்கம்' : 'Restart'}</span>
        </button>
      </div>

      {/* Tab 1: Animal Words */}
      {activeTab === 'words' && (
        <div>
          <div className="bg-gradient-to-r from-pink-400 via-fuchsia-500 to-purple-500 rounded-2xl p-6 text-white text-center shadow-inner mb-6">
            <div className="text-xs font-bold uppercase tracking-widest text-pink-100 mb-1">
              {lang === 'ta' ? 'விடுபட்ட எழுத்தை நிரப்புக' : 'Fill in the Missing Letter'} ({wordIdx + 1}/{WORD_QUESTIONS.length})
            </div>

            <div className="text-6xl sm:text-7xl my-2 drop-shadow-md animate-pulse">
              {curWord.icon}
            </div>

            <div className="flex items-center justify-center gap-3 my-3">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-wider bg-white/20 backdrop-blur-xs px-6 py-2 rounded-2xl">
                {curWord.incompleteWord}
              </span>
              <button
                onClick={() => {
                  sound.playPop();
                  sound.speak(curWord.fullWordTa, 'ta-IN');
                }}
                title={lang === 'ta' ? 'உச்சரிப்பு கேட்க' : 'Listen'}
                className="p-3 bg-white/30 hover:bg-white/50 backdrop-blur-xs rounded-full transition-transform active:scale-90 cursor-pointer shadow-xs"
              >
                <Volume2 className="w-6 h-6 text-white" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-pink-100 mt-2">
              {lang === 'ta' ? curWord.factTa : curWord.factEn}
            </p>
          </div>

          {/* Letter Options */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {curWord.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleWordAnswer(opt)}
                className="py-5 px-6 bg-pink-50 hover:bg-pink-100 border-2 border-pink-300 rounded-2xl text-2xl font-black text-fuchsia-900 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Rainbow Math Meadow */}
      {activeTab === 'math' && (
        <div>
          <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 rounded-2xl p-6 text-white text-center shadow-inner mb-6">
            <div className="text-xs font-bold uppercase tracking-widest text-purple-100 mb-1">
              {lang === 'ta' ? 'எளிய கணித புதிர்' : 'Math Riddle'} ({mathIdx + 1}/{MATH_QUESTIONS.length})
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white max-w-xl mx-auto my-3 leading-relaxed">
              {lang === 'ta' ? curMath.questionTa : curMath.questionEn}
            </h3>

            {/* Visual counters */}
            <div className="bg-white/20 backdrop-blur-xs p-4 rounded-xl max-w-lg mx-auto my-4 flex flex-wrap items-center justify-center gap-3">
              <div className="flex gap-1.5 flex-wrap justify-center">
                {curMath.iconsA.map((ic, i) => (
                  <span key={i} className="text-2xl sm:text-3xl hover:scale-125 transition-transform cursor-pointer">
                    {ic}
                  </span>
                ))}
              </div>
              <span className="text-2xl font-black px-2">{curMath.calc.includes('+') ? '+' : '-'}</span>
              <div className="flex gap-1.5 flex-wrap justify-center">
                {curMath.iconsB.map((ic, i) => (
                  <span key={i} className="text-2xl sm:text-3xl hover:scale-125 transition-transform cursor-pointer">
                    {ic}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-wider">
              {curMath.calc} = ?
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {curMath.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleMathAnswer(opt)}
                className="py-4 px-6 bg-pink-50 hover:bg-pink-100 border-2 border-pink-300 rounded-2xl text-2xl font-black text-fuchsia-900 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer font-mono"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`mt-6 p-4 rounded-xl text-center font-bold text-sm sm:text-base flex items-center justify-center gap-2 animate-fadeIn ${
            feedback.isCorrect
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-rose-100 text-rose-900 border border-rose-300'
          }`}
        >
          {feedback.isCorrect ? <Heart className="w-5 h-5 text-emerald-600 fill-emerald-600" /> : <Sparkles className="w-5 h-5 text-rose-600" />}
          <span>{feedback.msg}</span>
        </div>
      )}
    </div>
  );
};
