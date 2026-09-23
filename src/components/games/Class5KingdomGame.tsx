import React, { useState } from 'react';
import { Crown, CheckCircle2, RotateCcw, Sparkles, BookCheck, Shield } from 'lucide-react';
import { Language } from '../../types';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface Class5KingdomGameProps {
  lang: Language;
  onEarnStar: () => void;
}

const KINGDOM_MATH_QUESTIONS = [
  {
    titleTa: 'தஞ்சை பெரிய கோவில் நெற்களஞ்சியம்',
    titleEn: 'Grand Chola Granary Supply',
    problemTa: 'சோழர் நெற்களஞ்சியத்திற்கு திங்கள் கிழமை 180 நெல் மூட்டைகளும், செவ்வாய் கிழமை 240 நெல் மூட்டைகளும் கொண்டுவரப்பட்டன. களஞ்சியத்தில் சேர்ந்த மொத்த நெல் மூட்டைகள் எத்தனை?',
    problemEn: 'The Chola royal granary received 180 bags of paddy on Monday and 240 bags on Tuesday. How many bags of paddy arrived in total?',
    calc: '180 + 240',
    correctAnswer: 420,
    options: [390, 420, 450],
    hintTa: '180 + 240 = 420 மூட்டைகள்.',
    hintEn: '180 + 240 = 420 paddy bags.'
  },
  {
    titleTa: 'அரண்மனை நந்தவன சுற்றளவு',
    titleEn: 'Palace Royal Garden Perimeter',
    problemTa: 'அரண்மனை நந்தவனம் 20 மீட்டர் நீளமும், 15 மீட்டர் அகலமும் கொண்ட செவ்வக வடிவம். அதற்கு வேலி அமைக்க தேவையான சுற்றளவு (Perimeter) எத்தனை மீட்டர்?',
    problemEn: 'The palace royal garden is a rectangle 20 meters long and 15 meters wide. What is the total perimeter needed for the fence?',
    calc: '2 × (20 + 15)',
    correctAnswer: 70,
    options: [50, 70, 300],
    hintTa: 'செவ்வகத்தின் சுற்றளவு = 2 × (நீளம் + அகலம்) = 2 × 35 = 70 மீ.',
    hintEn: 'Perimeter of rectangle = 2 × (length + width) = 2 × 35 = 70 meters.'
  },
  {
    titleTa: 'சோழ நாட்டு வணிகர் லாபம்',
    titleEn: 'Chola Silk Merchant Profit',
    problemTa: 'காஞ்சி பட்டு வணிகர் ஒருவர் ஒரு பட்டுத்துணியை ₹800-க்கு வாங்கி, அரண்மனை விழாவில் ₹950-க்கு விற்றார். அவர் ஈட்டிய லாபம் (Profit) எவ்வளவு?',
    problemEn: 'A silk merchant purchased fine silk fabric for ₹800 and sold it at the royal festival for ₹950. What was his profit?',
    calc: '₹950 - ₹800',
    correctAnswer: 150,
    options: [100, 150, 200],
    hintTa: 'லாபம் = விற்பனை விலை - அடக்க விலை = 950 - 800 = ₹150.',
    hintEn: 'Profit = Selling Price - Cost Price = 950 - 800 = ₹150.'
  }
];

const GRAMMAR_QUESTIONS = [
  {
    wordTa: 'அரசன் (King)',
    wordEn: 'King',
    questionTa: "'அரசன்' என்பது எந்தத் திணையைச் சார்ந்தது?",
    questionEn: "To which Tamil noun class (Thinai) does 'King' belong?",
    options: [
      { textTa: 'உயர்திணை (Superior/Human)', textEn: 'Uyarthinai (Human/Rational)', correct: true },
      { textTa: 'அஃறிணை (Non-Human/Object)', textEn: 'Ahrinai (Non-human/Inanimate)', correct: false }
    ],
    noteTa: 'பகுத்தறிவுள்ள மனிதர்கள், தேவர்கள் உயர்திணை ஆவர்.'
  },
  {
    wordTa: 'யானை (Elephant)',
    wordEn: 'Elephant',
    questionTa: "'யானை' என்பது எந்தத் திணையைச் சார்ந்தது?",
    questionEn: "To which Tamil category (Thinai) does 'Elephant' belong?",
    options: [
      { textTa: 'உயர்திணை', textEn: 'Uyarthinai (Human)', correct: false },
      { textTa: 'அஃறிணை (Non-human animal)', textEn: 'Ahrinai (Animal/Object)', correct: true }
    ],
    noteTa: 'மனிதரல்லாத பிற உயிரினங்களும் பொருட்களும் அஃறிணை ஆவர்.'
  },
  {
    wordTa: 'வெற்றி (Victory)',
    wordEn: 'Victory',
    questionTa: "'வெற்றி' என்பதன் சரியான எதிர்ச்சொல் (Opposite) எது?",
    questionEn: "What is the opposite (antonym) of 'Victory'?",
    options: [
      { textTa: 'புகழ் (Fame)', textEn: 'Fame', correct: false },
      { textTa: 'தோல்வி (Defeat)', textEn: 'Defeat', correct: true },
      { textTa: 'வீரம் (Valour)', textEn: 'Valour', correct: false }
    ],
    noteTa: 'வெற்றி × தோல்வி.'
  }
];

export const Class5KingdomGame: React.FC<Class5KingdomGameProps> = ({ lang, onEarnStar }) => {
  const [activeTab, setActiveTab] = useState<'math' | 'grammar'>('math');
  const [mathIdx, setMathIdx] = useState(0);
  const [gramIdx, setGramIdx] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; msg: string } | null>(null);

  const curMath = KINGDOM_MATH_QUESTIONS[mathIdx];
  const curGram = GRAMMAR_QUESTIONS[gramIdx];

  const handleMathAnswer = (chosen: number) => {
    if (chosen === curMath.correctAnswer) {
      sound.playSuccess();
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
      setFeedback({
        isCorrect: true,
        msg: lang === 'ta'
          ? `அரசவை பாராட்டியது! ${curMath.hintTa}`
          : `Royal acclaim! ${curMath.hintEn}`
      });
      onEarnStar();
      setTimeout(() => {
        setFeedback(null);
        if (mathIdx < KINGDOM_MATH_QUESTIONS.length - 1) {
          setMathIdx(mathIdx + 1);
        } else {
          setMathIdx(0);
        }
      }, 2000);
    } else {
      sound.playWrong();
      setFeedback({
        isCorrect: false,
        msg: lang === 'ta' ? 'கணக்கீட்டை மீண்டும் ஒருமுறை செய்து பாருங்கள்!' : 'Check your arithmetic calculation again!'
      });
    }
  };

  const handleGrammarAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      sound.playSuccess();
      confetti({ particleCount: 45, spread: 65, origin: { y: 0.7 } });
      setFeedback({
        isCorrect: true,
        msg: lang === 'ta' ? `சரியான இலக்கணம்! ${curGram.noteTa}` : 'Correct grammatical categorization!'
      });
      onEarnStar();
      setTimeout(() => {
        setFeedback(null);
        if (gramIdx < GRAMMAR_QUESTIONS.length - 1) {
          setGramIdx(gramIdx + 1);
        } else {
          setGramIdx(0);
        }
      }, 2000);
    } else {
      sound.playWrong();
      setFeedback({
        isCorrect: false,
        msg: lang === 'ta' ? 'இலக்கண விதியை நினைவுகூர்ந்து விடையளிக்கவும்!' : 'Recall the grammar rule and try again!'
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-purple-200 shadow-md p-4 sm:p-6">
      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-purple-200 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('math');
              setFeedback(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'math'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-purple-100'
            }`}
          >
            👑 {lang === 'ta' ? 'மன்னர் சோழர் கணித சவால்' : 'Royal Chola Word Math'}
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('grammar');
              setFeedback(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'grammar'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-purple-100'
            }`}
          >
            📜 {lang === 'ta' ? 'தமிழ் இலக்கண அரசவை' : 'Tamil Grammar Court'}
          </button>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            setMathIdx(0);
            setGramIdx(0);
            setFeedback(null);
          }}
          className="text-xs text-slate-500 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{lang === 'ta' ? 'மறுதொடக்கம்' : 'Restart'}</span>
        </button>
      </div>

      {/* Tab 1: Royal Math Word Problems */}
      {activeTab === 'math' && (
        <div>
          <div className="bg-gradient-to-r from-purple-900 via-amber-900 to-slate-900 rounded-2xl p-6 text-white text-center shadow-inner mb-6 relative">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-300 mb-1 flex items-center justify-center gap-1">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ta' ? curMath.titleTa : curMath.titleEn}</span> ({mathIdx + 1}/{KINGDOM_MATH_QUESTIONS.length})
            </div>

            <p className="text-base sm:text-lg font-medium text-amber-100 max-w-2xl mx-auto my-4 leading-relaxed">
              {lang === 'ta' ? curMath.problemTa : curMath.problemEn}
            </p>

            <div className="text-xs text-amber-300 font-mono">
              {lang === 'ta' ? 'கணித சூத்திரம்' : 'Calculation'}: {curMath.calc}
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
            {curMath.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleMathAnswer(opt)}
                className="py-5 px-6 bg-purple-50 hover:bg-purple-100 border-2 border-purple-300 rounded-2xl text-2xl font-black text-purple-950 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer font-mono text-center"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Tamil Grammar Court */}
      {activeTab === 'grammar' && (
        <div>
          <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-950 rounded-2xl p-6 text-white text-center shadow-inner mb-6">
            <div className="text-xs font-bold uppercase tracking-widest text-purple-300 mb-1 flex items-center justify-center gap-1">
              <BookCheck className="w-4 h-4 text-purple-400" />
              <span>{lang === 'ta' ? 'சமச்சீர் தமிழ் இலக்கணம்' : 'Tamil Grammar Court'}</span> ({gramIdx + 1}/{GRAMMAR_QUESTIONS.length})
            </div>

            <div className="text-3xl sm:text-4xl font-extrabold text-amber-300 my-3">
              {curGram.wordTa}
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white max-w-xl mx-auto mb-2">
              {lang === 'ta' ? curGram.questionTa : curGram.questionEn}
            </h3>
          </div>

          {/* Grammar Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            {curGram.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleGrammarAnswer(opt.correct)}
                className="p-5 bg-purple-50 hover:bg-purple-100 border-2 border-purple-300 rounded-xl font-bold text-sm sm:text-base text-purple-950 hover:scale-103 active:scale-95 transition-all shadow-xs cursor-pointer text-center"
              >
                {lang === 'ta' ? opt.textTa : opt.textEn}
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
          {feedback.isCorrect ? <Shield className="w-5 h-5 text-emerald-600" /> : <Sparkles className="w-5 h-5 text-rose-600" />}
          <span>{feedback.msg}</span>
        </div>
      )}
    </div>
  );
};
