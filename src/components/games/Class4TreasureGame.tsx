import React, { useState } from 'react';
import { Compass, CheckCircle2, RotateCcw, Sparkles, Magnet, Gem } from 'lucide-react';
import { Language } from '../../types';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface Class4TreasureGameProps {
  lang: Language;
  onEarnStar: () => void;
}

const FRACTION_QUESTIONS = [
  {
    questionTa: 'தங்கப் பேழையின் அரைப் பகுதி (1/2) நாணயங்கள் எவை?',
    questionEn: 'Which represents exactly One Half (1/2) of the treasure?',
    targetFraction: '1/2',
    nameTa: 'அரை (1/2)',
    nameEn: 'One Half (1/2)',
    options: [
      { label: '1/4 (கால்)', visual: '2/8', icon: '🪙🪙 (out of 8)', correct: false },
      { label: '1/2 (அரை)', visual: '4/8', icon: '🪙🪙🪙🪙 (4 of 8 coins)', correct: true },
      { label: '3/4 (முக்கால்)', visual: '6/8', icon: '🪙🪙🪙🪙🪙🪙 (6 of 8)', correct: false }
    ]
  },
  {
    questionTa: 'புதையல் வரைபடத்தில் கால் பங்கு (1/4) பரப்பளவை குறிக்கும் பின்னம் எது?',
    questionEn: 'Which fraction indicates One Quarter (1/4) of the island grid?',
    targetFraction: '1/4',
    nameTa: 'கால் (1/4)',
    nameEn: 'One Quarter (1/4)',
    options: [
      { label: '1/4 (கால்)', visual: '1 out of 4 slices', icon: '🥧 1 slice of 4', correct: true },
      { label: '2/4 (அரை)', visual: '2 out of 4 slices', icon: '🥧 2 slices of 4', correct: false },
      { label: '3/4 (முக்கால்)', visual: '3 out of 4 slices', icon: '🥧 3 slices of 4', correct: false }
    ]
  },
  {
    questionTa: 'முக்கால் பங்கு (3/4) மணல் கடிகார நீர் எது?',
    questionEn: 'Which fraction represents Three-Fourths (3/4)?',
    targetFraction: '3/4',
    nameTa: 'முக்கால் (3/4)',
    nameEn: 'Three Fourths (3/4)',
    options: [
      { label: '1/2', visual: '50%', icon: '⏳ Half full', correct: false },
      { label: '3/4', visual: '75%', icon: '⏳ 3 of 4 parts full', correct: true },
      { label: '1/4', visual: '25%', icon: '⏳ 1 of 4 parts full', correct: false }
    ]
  }
];

const SCIENCE_LAB_ITEMS = [
  { nameTa: 'இரும்பு ஆணி (Iron Nail)', nameEn: 'Iron Nail', icon: '🔩', isMagnetic: true },
  { nameTa: 'மரக்கட்டை (Wood Block)', nameEn: 'Wood Block', icon: '🪵', isMagnetic: false },
  { nameTa: 'குண்டூசி (Paper Clip)', nameEn: 'Steel Paper Clip', icon: '📎', isMagnetic: true },
  { nameTa: 'பிளாஸ்டிக் கரண்டி (Plastic Spoon)', nameEn: 'Plastic Spoon', icon: '🥄', isMagnetic: false },
  { nameTa: 'இரும்பு சாவி (Iron Key)', nameEn: 'Iron Key', icon: '🗝️', isMagnetic: true },
  { nameTa: 'ரப்பர் பந்து (Rubber Ball)', nameEn: 'Rubber Ball', icon: '🎾', isMagnetic: false }
];

export const Class4TreasureGame: React.FC<Class4TreasureGameProps> = ({ lang, onEarnStar }) => {
  const [activeTab, setActiveTab] = useState<'fractions' | 'science'>('fractions');
  const [fracIdx, setFracIdx] = useState(0);
  const [scienceItemIdx, setScienceItemIdx] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; msg: string } | null>(null);

  const curFrac = FRACTION_QUESTIONS[fracIdx];
  const curScience = SCIENCE_LAB_ITEMS[scienceItemIdx];

  const handleFractionAnswer = (correct: boolean) => {
    if (correct) {
      sound.playSuccess();
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
      setFeedback({
        isCorrect: true,
        msg: lang === 'ta'
          ? `அருமை! தங்கப் பேழையின் பூட்டு திறந்தது! (${curFrac.nameTa})`
          : `Chest unlocked! Mastered ${curFrac.nameEn}!`
      });
      onEarnStar();
      setTimeout(() => {
        setFeedback(null);
        if (fracIdx < FRACTION_QUESTIONS.length - 1) {
          setFracIdx(fracIdx + 1);
        } else {
          setFracIdx(0);
        }
      }, 1800);
    } else {
      sound.playWrong();
      setFeedback({
        isCorrect: false,
        msg: lang === 'ta' ? 'தவறான பின்னம்! பாகங்களை மீண்டும் எண்ணுங்கள்.' : 'Incorrect fraction! Count the slices carefully.'
      });
    }
  };

  const handleMagneticChoice = (userSaidMagnetic: boolean) => {
    if (userSaidMagnetic === curScience.isMagnetic) {
      sound.playSuccess();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      setFeedback({
        isCorrect: true,
        msg: lang === 'ta'
          ? `மிகச் சரி! ${curScience.nameTa} ${curScience.isMagnetic ? 'காந்தத்தால் ஈர்க்கப்படும்!' : 'காந்தத்தால் ஈர்க்கப்படாது!'}`
          : `Correct! ${curScience.nameEn} is ${curScience.isMagnetic ? 'attracted to magnets!' : 'not magnetic!'}`
      });
      onEarnStar();
      setTimeout(() => {
        setFeedback(null);
        if (scienceItemIdx < SCIENCE_LAB_ITEMS.length - 1) {
          setScienceItemIdx(scienceItemIdx + 1);
        } else {
          setScienceItemIdx(0);
        }
      }, 1800);
    } else {
      sound.playWrong();
      setFeedback({
        isCorrect: false,
        msg: lang === 'ta'
          ? 'தவறு! இரும்பு போன்ற காந்தப் பொருட்கள் மட்டுமே ஈர்க்கப்படும்.'
          : 'Incorrect! Only ferromagnetic materials like iron are attracted.'
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-200 shadow-md p-4 sm:p-6">
      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-emerald-200 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('fractions');
              setFeedback(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'fractions'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-100'
            }`}
          >
            🗺️ {lang === 'ta' ? 'பின்னங்கள் தங்கப் பேழை' : 'Fraction Treasure Chest'}
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('science');
              setFeedback(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'science'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-100'
            }`}
          >
            🧲 {lang === 'ta' ? 'காந்தவியல் ஆய்வகம்' : 'Magnet Science Lab'}
          </button>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            setFracIdx(0);
            setScienceItemIdx(0);
            setFeedback(null);
          }}
          className="text-xs text-slate-500 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{lang === 'ta' ? 'மறுதொடக்கம்' : 'Restart'}</span>
        </button>
      </div>

      {/* Tab 1: Fraction Treasure Chest */}
      {activeTab === 'fractions' && (
        <div>
          <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-amber-900 rounded-2xl p-6 text-white text-center shadow-inner relative mb-6">
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-200 mb-1">
              {lang === 'ta' ? 'புதையல் பின்ன புதிர்' : 'Fraction Riddle'} ({fracIdx + 1}/{FRACTION_QUESTIONS.length})
            </div>

            <div className="my-3 flex items-center justify-center gap-3">
              <span className="text-5xl">🗝️</span>
              <span className="text-5xl">💎</span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-amber-200 drop-shadow-xs max-w-lg mx-auto">
              {lang === 'ta' ? curFrac.questionTa : curFrac.questionEn}
            </h3>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {curFrac.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleFractionAnswer(opt.correct)}
                className="group p-5 bg-emerald-50/70 hover:bg-emerald-100 border-2 border-emerald-300 rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer active:scale-95 text-center flex flex-col items-center justify-between"
              >
                <div className="text-2xl font-black text-emerald-950 font-mono mb-2">
                  {opt.label}
                </div>
                <div className="text-sm font-semibold text-slate-700 bg-white/80 py-2 px-3 rounded-lg w-full mb-3">
                  {opt.icon}
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-200/60 px-3 py-1 rounded-md">
                  {lang === 'ta' ? 'தேர்வு செய்க' : 'Select Chest'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Science Laboratory */}
      {activeTab === 'science' && (
        <div>
          <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 rounded-2xl p-6 text-white text-center shadow-inner mb-6">
            <div className="text-xs font-bold uppercase tracking-widest text-teal-300 mb-1">
              {lang === 'ta' ? 'காந்தவியல் சோதனை' : 'Magnet Testing Station'} ({scienceItemIdx + 1}/{SCIENCE_LAB_ITEMS.length})
            </div>

            <div className="text-6xl my-3 animate-pulse">{curScience.icon}</div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              {lang === 'ta' ? curScience.nameTa : curScience.nameEn}
            </h3>

            <p className="text-xs sm:text-sm text-teal-200 mt-2">
              {lang === 'ta'
                ? 'இந்த பொருள் காந்தத்தால் ஈர்க்கப்படுமா அல்லது ஈர்க்கப்படாதா?'
                : 'Will this item be attracted by a magnet or not?'}
            </p>
          </div>

          {/* Test Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <button
              onClick={() => handleMagneticChoice(true)}
              className="p-5 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-400 rounded-2xl flex items-center justify-center gap-3 cursor-pointer hover:scale-103 active:scale-95 transition-all text-emerald-950 font-bold"
            >
              <Magnet className="w-6 h-6 text-red-500" />
              <span>{lang === 'ta' ? 'ஆம்! காந்தம் ஈர்க்கும்' : 'Yes! Magnet Attracts'}</span>
            </button>
            <button
              onClick={() => handleMagneticChoice(false)}
              className="p-5 bg-slate-50 hover:bg-slate-100 border-2 border-slate-300 rounded-2xl flex items-center justify-center gap-3 cursor-pointer hover:scale-103 active:scale-95 transition-all text-slate-800 font-bold"
            >
              <span className="text-2xl">🚫</span>
              <span>{lang === 'ta' ? 'இல்லை! ஈர்க்காது' : 'No! Non-Magnetic'}</span>
            </button>
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
          {feedback.isCorrect ? <Gem className="w-5 h-5 text-emerald-600" /> : <Sparkles className="w-5 h-5 text-rose-600" />}
          <span>{feedback.msg}</span>
        </div>
      )}
    </div>
  );
};
