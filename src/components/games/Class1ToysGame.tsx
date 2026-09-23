import React, { useState } from 'react';
import { Volume2, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { Language } from '../../types';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface Class1ToysGameProps {
  lang: Language;
  onEarnStar: () => void;
}

const VOWEL_QUESTIONS = [
  {
    letter: 'அ',
    soundText: 'அ',
    wordTa: 'அணில்',
    wordEn: 'Squirrel',
    icon: '🐿️',
    options: [
      { text: 'அணில் (Squirrel)', icon: '🐿️', correct: true },
      { text: 'ஆடு (Goat)', icon: '🐐', correct: false },
      { text: 'இலை (Leaf)', icon: '🍃', correct: false }
    ]
  },
  {
    letter: 'ஆ',
    soundText: 'ஆ',
    wordTa: 'ஆலமரம்',
    wordEn: 'Banyan Tree',
    icon: '🌳',
    options: [
      { text: 'உரல் (Mortar)', icon: '🥣', correct: false },
      { text: 'ஆலமரம் (Banyan Tree)', icon: '🌳', correct: true },
      { text: 'எலி (Mouse)', icon: '🐁', correct: false }
    ]
  },
  {
    letter: 'இ',
    soundText: 'இ',
    wordTa: 'இலை',
    wordEn: 'Leaf',
    icon: '🍃',
    options: [
      { text: 'இலை (Leaf)', icon: '🍃', correct: true },
      { text: 'ஈட்டி (Spear)', icon: '🗡️', correct: false },
      { text: 'ஒட்டகம் (Camel)', icon: '🐪', correct: false }
    ]
  },
  {
    letter: 'ஈ',
    soundText: 'ஈ',
    wordTa: 'ஈட்டி',
    wordEn: 'Spear',
    icon: '🗡️',
    options: [
      { text: 'அம்மா (Mother)', icon: '👩', correct: false },
      { text: 'ஈட்டி (Spear)', icon: '🗡️', correct: true },
      { text: 'ஊஞ்சல் (Swing)', icon: '🎡', correct: false }
    ]
  },
  {
    letter: 'உ',
    soundText: 'உ',
    wordTa: 'உரல்',
    wordEn: 'Mortar',
    icon: '🥣',
    options: [
      { text: 'உரல் (Mortar)', icon: '🥣', correct: true },
      { text: 'ஏணி (Ladder)', icon: '🪜', correct: false },
      { text: 'ஐந்து (Five)', icon: '5️⃣', correct: false }
    ]
  },
  {
    letter: 'ஊ',
    soundText: 'ஊ',
    wordTa: 'ஊஞ்சல்',
    wordEn: 'Swing',
    icon: '🎡',
    options: [
      { text: 'ஓடம் (Boat)', icon: '⛵', correct: false },
      { text: 'ஊஞ்சல் (Swing)', icon: '🎡', correct: true },
      { text: 'எறும்பு (Ant)', icon: '🐜', correct: false }
    ]
  }
];

const SHAPE_COUNT_QUESTIONS = [
  {
    questionTa: 'கூடையில் உள்ள கரடி பொம்மைகளை (Teddy Bears) எண்ணுங்கள்!',
    questionEn: 'Count the teddy bears in the toy box!',
    targetCount: 4,
    items: ['🧸', '🧸', '🧸', '🧸'],
    options: [3, 4, 5],
    hint: '1, 2, 3, 4!'
  },
  {
    questionTa: 'இதில் வட்டம் (Circle) வடிவ பொம்மையைத் தேர்வு செய்க!',
    questionEn: 'Select the Circle shape toy!',
    options: [
      { labelTa: 'வட்டம் (பந்து)', labelEn: 'Circle (Ball)', icon: '⚽', correct: true },
      { labelTa: 'சதுரம் (பெட்டி)', labelEn: 'Square (Block)', icon: '🧊', correct: false },
      { labelTa: 'முக்கோணம் (தொப்பி)', labelEn: 'Triangle (Hat)', icon: '🔺', correct: false }
    ]
  },
  {
    questionTa: 'கூடையில் உள்ள நட்சத்திர பொம்மைகளை (Stars) எண்ணுங்கள்!',
    questionEn: 'Count the glowing stars!',
    targetCount: 6,
    items: ['⭐', '⭐', '⭐', '⭐', '⭐', '⭐'],
    options: [5, 6, 7],
    hint: '1, 2, 3, 4, 5, 6!'
  },
  {
    questionTa: 'இதில் முக்கோணம் (Triangle) வடிவத்தைக் கண்டுபிடிக்கவும்!',
    questionEn: 'Find the Triangle shape!',
    options: [
      { labelTa: 'செவ்வகம் (புத்தகம்)', labelEn: 'Rectangle (Book)', icon: '📕', correct: false },
      { labelTa: 'முக்கோணம் (சிறு கொடி)', labelEn: 'Triangle (Pennant)', icon: '🚩', correct: true },
      { labelTa: 'வட்டம் (நாணயம்)', labelEn: 'Circle (Coin)', icon: '🪙', correct: false }
    ]
  }
];

export const Class1ToysGame: React.FC<Class1ToysGameProps> = ({ lang, onEarnStar }) => {
  const [activeTab, setActiveTab] = useState<'vowels' | 'shapes'>('vowels');
  const [vowelIdx, setVowelIdx] = useState(0);
  const [shapeIdx, setShapeIdx] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; msg: string } | null>(null);

  const curVowel = VOWEL_QUESTIONS[vowelIdx];
  const curShapeQ = SHAPE_COUNT_QUESTIONS[shapeIdx];

  const handleVowelAnswer = (isCorrect: boolean, text: string) => {
    if (isCorrect) {
      sound.playSuccess();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      setFeedback({
        isCorrect: true,
        msg: lang === 'ta' ? `அற்புதம்! ${curVowel.letter} - ${text}!` : `Superb! ${curVowel.letter} for ${text}!`
      });
      onEarnStar();
      setTimeout(() => {
        setFeedback(null);
        if (vowelIdx < VOWEL_QUESTIONS.length - 1) {
          setVowelIdx(vowelIdx + 1);
        } else {
          setVowelIdx(0);
        }
      }, 1500);
    } else {
      sound.playWrong();
      setFeedback({
        isCorrect: false,
        msg: lang === 'ta' ? 'மீண்டும் ஒருமுறை முயற்சி செய்யுங்கள்!' : 'Try once more!'
      });
    }
  };

  const handleShapeAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      sound.playSuccess();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      setFeedback({
        isCorrect: true,
        msg: lang === 'ta' ? 'மிகச் சரி! நீங்கள் ஒரு நட்சத்திரம் பெற்றீர்கள்!' : 'Spot on! You earned a star!'
      });
      onEarnStar();
      setTimeout(() => {
        setFeedback(null);
        if (shapeIdx < SHAPE_COUNT_QUESTIONS.length - 1) {
          setShapeIdx(shapeIdx + 1);
        } else {
          setShapeIdx(0);
        }
      }, 1500);
    } else {
      sound.playWrong();
      setFeedback({
        isCorrect: false,
        msg: lang === 'ta' ? 'சரியான விடையை யோசியுங்கள்!' : 'Think and try again!'
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-200 shadow-md p-4 sm:p-6">
      {/* Activity Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-amber-200 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('vowels');
              setFeedback(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'vowels'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-amber-100'
            }`}
          >
            🚂 {lang === 'ta' ? 'உயிர் எழுத்து ரயில்' : 'Uyir Vowel Train'}
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('shapes');
              setFeedback(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'shapes'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-amber-100'
            }`}
          >
            🧸 {lang === 'ta' ? 'எண்ணுதல் & வடிவங்கள்' : 'Counting & Shapes'}
          </button>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            setVowelIdx(0);
            setShapeIdx(0);
            setFeedback(null);
          }}
          className="text-xs text-slate-500 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{lang === 'ta' ? 'மறுதொடக்கம்' : 'Restart'}</span>
        </button>
      </div>

      {/* Tab 1: Uyir Ezhuthu Train */}
      {activeTab === 'vowels' && (
        <div>
          {/* Toy Train Engine Visual */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-2xl p-6 text-white text-center shadow-inner relative overflow-hidden mb-6">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-950/80 mb-1">
              {lang === 'ta' ? 'கேள்விக்குரிய உயிர் எழுத்து' : 'Target Tamil Vowel'} ({vowelIdx + 1}/{VOWEL_QUESTIONS.length})
            </div>
            <div className="flex items-center justify-center gap-4 my-2">
              <span className="text-6xl sm:text-8xl font-black drop-shadow-md font-serif animate-bounce">
                {curVowel.letter}
              </span>
              <button
                onClick={() => {
                  sound.playPop();
                  sound.speak(curVowel.soundText, 'ta-IN');
                }}
                title={lang === 'ta' ? 'ஒலி கேட்க' : 'Listen pronunciation'}
                className="p-3 bg-white/30 hover:bg-white/50 backdrop-blur-xs rounded-full transition-transform active:scale-90 cursor-pointer shadow-xs"
              >
                <Volume2 className="w-7 h-7 text-amber-950" />
              </button>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-amber-950/90">
              {lang === 'ta'
                ? `இந்த '${curVowel.letter}' எழுத்தில் தொடங்கும் சரியான படத்தை ரயிலில் ஏற்றுங்கள்!`
                : `Pick the wagon that starts with the Tamil vowel '${curVowel.letter}'!`}
            </p>
          </div>

          {/* Options: Train Wagons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {curVowel.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleVowelAnswer(opt.correct, opt.text)}
                className="group flex flex-col items-center p-5 bg-amber-50/70 hover:bg-amber-100 border-2 border-amber-300 rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer active:scale-95 text-center"
              >
                <div className="text-5xl mb-2 group-hover:scale-120 transition-transform">
                  {opt.icon}
                </div>
                <div className="text-base font-bold text-slate-800">
                  {opt.text}
                </div>
                <div className="mt-2 text-xs font-semibold text-amber-700 bg-amber-200/60 px-3 py-1 rounded-md">
                  {lang === 'ta' ? 'தேர்வு செய்' : 'Choose'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Counting & Shapes Sorter */}
      {activeTab === 'shapes' && (
        <div>
          <div className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 rounded-2xl p-6 text-white text-center shadow-inner mb-6">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-950/80 mb-1">
              {lang === 'ta' ? 'வடிவங்கள் & எண்கள் விளையாட்டு' : 'Counting & Shapes Quest'} ({shapeIdx + 1}/{SHAPE_COUNT_QUESTIONS.length})
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-amber-950 drop-shadow-xs my-2">
              {lang === 'ta' ? curShapeQ.questionTa : curShapeQ.questionEn}
            </h3>

            {/* If items to count */}
            {curShapeQ.items && (
              <div className="flex flex-wrap items-center justify-center gap-3 my-4 bg-white/30 backdrop-blur-xs p-4 rounded-xl">
                {curShapeQ.items.map((it, idx) => (
                  <span
                    key={idx}
                    className="text-4xl sm:text-5xl animate-pulse hover:scale-125 transition-transform cursor-pointer"
                    onClick={() => {
                      sound.playPop();
                      sound.speak(String(idx + 1), lang === 'ta' ? 'ta-IN' : 'en-US');
                    }}
                  >
                    {it}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Options */}
          {curShapeQ.items ? (
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {(curShapeQ.options as number[]).map((num, i) => (
                <button
                  key={i}
                  onClick={() => handleShapeAnswer(num === curShapeQ.targetCount)}
                  className="py-4 px-6 bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 rounded-2xl text-2xl font-black text-amber-950 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
                >
                  {num}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(curShapeQ.options as { labelTa: string; labelEn: string; icon: string; correct: boolean }[]).map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleShapeAnswer(opt.correct)}
                  className="group flex flex-col items-center p-5 bg-amber-50/70 hover:bg-amber-100 border-2 border-amber-300 rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer active:scale-95 text-center"
                >
                  <div className="text-5xl mb-2 group-hover:scale-120 transition-transform">
                    {opt.icon}
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {lang === 'ta' ? opt.labelTa : opt.labelEn}
                  </div>
                </button>
              ))}
            </div>
          )}
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
          {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Sparkles className="w-5 h-5 text-rose-600" />}
          <span>{feedback.msg}</span>
        </div>
      )}
    </div>
  );
};
