import React, { useState } from 'react';
import { Rocket, CheckCircle2, RotateCcw, Sparkles, Orbit, Compass } from 'lucide-react';
import { Language } from '../../types';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface Class3SpaceGameProps {
  lang: Language;
  onEarnStar: () => void;
}

const PLACE_VALUE_QUESTIONS = [
  {
    targetNumber: 472,
    hundreds: 4,
    tens: 7,
    ones: 2,
    questionTa: '472 என்ற எண்ணின் இடமதிப்புகளை ராக்கெட் தொட்டியில் நிரப்பவும்!',
    questionEn: 'Fuel the rocket tanks with place values for number 472!',
    promptTa: '4 நூறுகள் + 7 பத்துகள் + 2 ஒன்றுகள்',
    promptEn: '4 Hundreds + 7 Tens + 2 Ones'
  },
  {
    targetNumber: 608,
    hundreds: 6,
    tens: 0,
    ones: 8,
    questionTa: '608 என்ற எண்ணின் இடமதிப்புகளை ராக்கெட் தொட்டியில் நிரப்பவும்!',
    questionEn: 'Fuel the rocket tanks with place values for number 608!',
    promptTa: '6 நூறுகள் + 0 பத்துகள் + 8 ஒன்றுகள்',
    promptEn: '6 Hundreds + 0 Tens + 8 Ones'
  },
  {
    targetNumber: 350,
    hundreds: 3,
    tens: 5,
    ones: 0,
    questionTa: '350 என்ற எண்ணின் இடமதிப்புகளை ராக்கெட் தொட்டியில் நிரப்பவும்!',
    questionEn: 'Fuel the rocket tanks with place values for number 350!',
    promptTa: '3 நூறுகள் + 5 பத்துகள் + 0 ஒன்றுகள்',
    promptEn: '3 Hundreds + 5 Tens + 0 Ones'
  }
];

const EVS_QUESTIONS = [
  {
    questionTa: 'சூரிய வெப்பத்தால் ஏரி, கடல் நீர் நீராவியாக மேலே செல்லும் நிகழ்வின் பெயர் என்ன?',
    questionEn: 'What is the process called when lake and sea water heats up into water vapor?',
    options: [
      { textTa: 'ஆவியாதல் (Evaporation)', textEn: 'Evaporation', correct: true },
      { textTa: 'மழைப்பொழிவு (Precipitation)', textEn: 'Precipitation', correct: false },
      { textTa: 'குளிர்வடைதல் (Condensation)', textEn: 'Condensation', correct: false }
    ],
    explanationTa: 'நீர் வெப்பமடைந்து நீராவியாக மாறுவது ஆவியாதல் ஆகும்.',
    explanationEn: 'Water turning into vapor due to heat is Evaporation.'
  },
  {
    questionTa: 'தாவரங்களில் உணவு தயாரிக்கும் சமையலறையாக செயல்படும் உறுப்பு எது?',
    questionEn: 'Which plant part acts as the kitchen factory by preparing food through photosynthesis?',
    options: [
      { textTa: 'இலை (Leaf)', textEn: 'Leaf', correct: true },
      { textTa: 'வேர் (Root)', textEn: 'Root', correct: false },
      { textTa: 'தண்டு (Stem)', textEn: 'Stem', correct: false }
    ],
    explanationTa: 'இலைகளில் உள்ள பச்சையம் சூரிய ஒளியைப் பயன்படுத்தி உணவு தயாரிக்கிறது.',
    explanationEn: 'Chlorophyll in leaves uses sunlight to prepare food for the plant.'
  },
  {
    questionTa: 'கீழ்க்கண்டவற்றில் உயிருள்ளவை (Living Thing) எது?',
    questionEn: 'Which of the following is a Living Thing?',
    options: [
      { textTa: 'கல் (Stone)', textEn: 'Stone', correct: false },
      { textTa: 'மரம் (Plant/Tree)', textEn: 'Plant/Tree', correct: true },
      { textTa: 'மேஜை (Table)', textEn: 'Table', correct: false }
    ],
    explanationTa: 'தாவரங்கள் வளரும், சுவாசிக்கும், எனவே அவை உயிருள்ளவை!',
    explanationEn: 'Plants grow, breathe, and reproduce, making them living things!'
  }
];

export const Class3SpaceGame: React.FC<Class3SpaceGameProps> = ({ lang, onEarnStar }) => {
  const [activeTab, setActiveTab] = useState<'placeValue' | 'evs'>('placeValue');
  const [pvIdx, setPvIdx] = useState(0);
  const [evsIdx, setEvsIdx] = useState(0);
  const [userHundreds, setUserHundreds] = useState(0);
  const [userTens, setUserTens] = useState(0);
  const [userOnes, setUserOnes] = useState(0);
  const [rocketLaunched, setRocketLaunched] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; msg: string } | null>(null);

  const curPv = PLACE_VALUE_QUESTIONS[pvIdx];
  const curEvs = EVS_QUESTIONS[evsIdx];

  const handleLaunchRocket = () => {
    if (userHundreds === curPv.hundreds && userTens === curPv.tens && userOnes === curPv.ones) {
      sound.playFanfare();
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
      setRocketLaunched(true);
      setFeedback({
        isCorrect: true,
        msg: lang === 'ta'
          ? `ராக்கெட் வெற்றிகரமாக விண்ணில் பாய்ந்தது! ${curPv.targetNumber} = ${userHundreds} நூறுகள் + ${userTens} பத்துகள் + ${userOnes} ஒன்றுகள்!`
          : `Rocket launch successful! ${curPv.targetNumber} = ${userHundreds} Hundreds + ${userTens} Tens + ${userOnes} Ones!`
      });
      onEarnStar();
      setTimeout(() => {
        setRocketLaunched(false);
        setFeedback(null);
        setUserHundreds(0);
        setUserTens(0);
        setUserOnes(0);
        if (pvIdx < PLACE_VALUE_QUESTIONS.length - 1) {
          setPvIdx(pvIdx + 1);
        } else {
          setPvIdx(0);
        }
      }, 2500);
    } else {
      sound.playWrong();
      setFeedback({
        isCorrect: false,
        msg: lang === 'ta'
          ? `எரிபொருள் அளவு தவறானது! ${curPv.targetNumber}-ன் இடமதிப்பை மீண்டும் சரிபாருங்கள்.`
          : `Fuel mix mismatch! Check the place values for ${curPv.targetNumber} again.`
      });
    }
  };

  const handleEvsAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      sound.playSuccess();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      setFeedback({
        isCorrect: true,
        msg: lang === 'ta' ? `சரியான விடை! ${curEvs.explanationTa}` : `Correct! ${curEvs.explanationEn}`
      });
      onEarnStar();
      setTimeout(() => {
        setFeedback(null);
        if (evsIdx < EVS_QUESTIONS.length - 1) {
          setEvsIdx(evsIdx + 1);
        } else {
          setEvsIdx(0);
        }
      }, 2000);
    } else {
      sound.playWrong();
      setFeedback({
        isCorrect: false,
        msg: lang === 'ta' ? 'தவறான விடை, மீண்டும் ஒருமுறை யோசித்து தேர்வு செய்யுங்கள்!' : 'Not right, think carefully and try again!'
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-sky-200 shadow-md p-4 sm:p-6">
      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-sky-200 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('placeValue');
              setFeedback(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'placeValue'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-sky-100'
            }`}
          >
            🚀 {lang === 'ta' ? 'ராக்கெட் இடமதிப்பு தளம்' : 'Rocket Place Values'}
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('evs');
              setFeedback(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'evs'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-sky-100'
            }`}
          >
            🌍 {lang === 'ta' ? 'சூழ்நிலையியல் EVS ஆய்வு' : 'Space EVS Science'}
          </button>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            setPvIdx(0);
            setEvsIdx(0);
            setUserHundreds(0);
            setUserTens(0);
            setUserOnes(0);
            setFeedback(null);
          }}
          className="text-xs text-slate-500 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{lang === 'ta' ? 'மறுதொடக்கம்' : 'Restart'}</span>
        </button>
      </div>

      {/* Tab 1: Place Value Rocket Launch */}
      {activeTab === 'placeValue' && (
        <div>
          <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white text-center shadow-inner relative overflow-hidden mb-6">
            <div className="text-xs font-bold uppercase tracking-widest text-sky-300 mb-1">
              {lang === 'ta' ? 'இடமதிப்பு எரிபொருள் தளம்' : 'Place Value Propulsion'} ({pvIdx + 1}/{PLACE_VALUE_QUESTIONS.length})
            </div>

            <div className="flex flex-col items-center justify-center my-3">
              <div className="text-xs text-sky-200 uppercase font-semibold">
                {lang === 'ta' ? 'இலக்கு எண்' : 'Target Number'}
              </div>
              <div className="text-5xl sm:text-6xl font-black font-mono tracking-widest text-amber-300 drop-shadow-lg">
                {curPv.targetNumber}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-sky-100 max-w-md mx-auto">
              {lang === 'ta' ? curPv.questionTa : curPv.questionEn}
            </p>

            {/* Rocket animation */}
            <div className="my-4 flex items-center justify-center">
              <div className={`p-4 bg-sky-800/60 rounded-full border-2 border-sky-400 transition-all duration-700 ${rocketLaunched ? '-translate-y-16 scale-125 opacity-70' : 'animate-bounce'}`}>
                <Rocket className="w-12 h-12 text-amber-400" />
              </div>
            </div>
          </div>

          {/* Place Value Fuel Controls (Hundreds, Tens, Ones) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
            {/* Hundreds */}
            <div className="p-4 bg-sky-50 border-2 border-sky-300 rounded-2xl text-center">
              <div className="text-xs font-bold uppercase text-sky-800 tracking-wide mb-1">
                {lang === 'ta' ? 'நூறுகள் (Hundreds x100)' : 'Hundreds (x100)'}
              </div>
              <div className="text-3xl font-black font-mono text-sky-950 my-2">{userHundreds}</div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    sound.playPop();
                    setUserHundreds(Math.max(0, userHundreds - 1));
                  }}
                  className="w-9 h-9 rounded-lg bg-sky-200 text-sky-900 font-black text-lg hover:bg-sky-300 active:scale-95 cursor-pointer"
                >
                  -
                </button>
                <button
                  onClick={() => {
                    sound.playPop();
                    setUserHundreds(Math.min(9, userHundreds + 1));
                  }}
                  className="w-9 h-9 rounded-lg bg-sky-600 text-white font-black text-lg hover:bg-sky-700 active:scale-95 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Tens */}
            <div className="p-4 bg-indigo-50 border-2 border-indigo-300 rounded-2xl text-center">
              <div className="text-xs font-bold uppercase text-indigo-800 tracking-wide mb-1">
                {lang === 'ta' ? 'பத்துகள் (Tens x10)' : 'Tens (x10)'}
              </div>
              <div className="text-3xl font-black font-mono text-indigo-950 my-2">{userTens}</div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    sound.playPop();
                    setUserTens(Math.max(0, userTens - 1));
                  }}
                  className="w-9 h-9 rounded-lg bg-indigo-200 text-indigo-900 font-black text-lg hover:bg-indigo-300 active:scale-95 cursor-pointer"
                >
                  -
                </button>
                <button
                  onClick={() => {
                    sound.playPop();
                    setUserTens(Math.min(9, userTens + 1));
                  }}
                  className="w-9 h-9 rounded-lg bg-indigo-600 text-white font-black text-lg hover:bg-indigo-700 active:scale-95 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Ones */}
            <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-2xl text-center">
              <div className="text-xs font-bold uppercase text-blue-800 tracking-wide mb-1">
                {lang === 'ta' ? 'ஒன்றுகள் (Ones x1)' : 'Ones (x1)'}
              </div>
              <div className="text-3xl font-black font-mono text-blue-950 my-2">{userOnes}</div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    sound.playPop();
                    setUserOnes(Math.max(0, userOnes - 1));
                  }}
                  className="w-9 h-9 rounded-lg bg-blue-200 text-blue-900 font-black text-lg hover:bg-blue-300 active:scale-95 cursor-pointer"
                >
                  -
                </button>
                <button
                  onClick={() => {
                    sound.playPop();
                    setUserOnes(Math.min(9, userOnes + 1));
                  }}
                  className="w-9 h-9 rounded-lg bg-blue-600 text-white font-black text-lg hover:bg-blue-700 active:scale-95 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Launch Button */}
          <div className="text-center">
            <button
              onClick={handleLaunchRocket}
              className="py-3 px-8 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-base font-extrabold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <Rocket className="w-5 h-5" />
              <span>{lang === 'ta' ? 'ராக்கெட்டை விண்ணில் ஏவுக!' : 'Ignite & Launch Rocket!'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: EVS Explorer */}
      {activeTab === 'evs' && (
        <div>
          <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-sky-900 rounded-2xl p-6 text-white text-center shadow-inner mb-6">
            <div className="text-xs font-bold uppercase tracking-widest text-teal-200 mb-1">
              {lang === 'ta' ? 'சூழ்நிலையியல் கேள்வி' : 'EVS Science Quest'} ({evsIdx + 1}/{EVS_QUESTIONS.length})
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white max-w-xl mx-auto my-3 leading-relaxed">
              {lang === 'ta' ? curEvs.questionTa : curEvs.questionEn}
            </h3>

            <div className="flex items-center justify-center gap-2 text-teal-200 text-xs">
              <Orbit className="w-4 h-4 animate-spin" />
              <span>{lang === 'ta' ? 'சமச்சீர் கல்வி 3-ம் வகுப்பு அறிவியல்' : 'TN Samacheer Class 3 Science'}</span>
            </div>
          </div>

          {/* EVS Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {curEvs.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleEvsAnswer(opt.correct)}
                className="p-5 bg-sky-50/80 hover:bg-sky-100 border-2 border-sky-300 rounded-xl text-sm sm:text-base font-bold text-slate-800 hover:scale-103 active:scale-95 transition-all shadow-xs cursor-pointer text-center"
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
          {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Sparkles className="w-5 h-5 text-rose-600" />}
          <span>{feedback.msg}</span>
        </div>
      )}
    </div>
  );
};
