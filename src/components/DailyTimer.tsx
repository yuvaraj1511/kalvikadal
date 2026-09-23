import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface DailyTimerProps {
  lang: Language;
  onTimerComplete: () => void;
  onIncrementMinute: () => void;
}

export const DailyTimer: React.FC<DailyTimerProps> = ({
  lang,
  onTimerComplete,
  onIncrementMinute
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600); // 10 minutes = 600s
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setIsCompleted(true);
            sound.playFanfare();
            confetti({ particleCount: 80, spread: 90, origin: { y: 0.6 } });
            onTimerComplete();
            return 0;
          }
          // Increment minute counter when 60 seconds tick
          if ((600 - prev + 1) % 60 === 0) {
            onIncrementMinute();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining, onTimerComplete, onIncrementMinute]);

  const toggleTimer = () => {
    sound.playPop();
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    sound.playPop();
    setIsActive(false);
    setSecondsRemaining(600);
    setIsCompleted(false);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const progressPercent = ((600 - secondsRemaining) / 600) * 100;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => {
            sound.playPop();
            setIsMinimized(false);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-900/90 hover:bg-amber-950 backdrop-blur-md text-white rounded-full shadow-xl border border-amber-500/40 text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer"
        >
          <Clock className={`w-4 h-4 text-amber-400 ${isActive ? 'animate-spin' : ''}`} />
          <span className="font-mono tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="text-amber-300 text-xs hidden sm:inline">
            {isActive ? (lang === 'ta' ? 'நடப்பில்' : 'Playing') : (lang === 'ta' ? '10 நிமிடம்' : '10-Min')}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 bg-white/95 backdrop-blur-md border-2 border-amber-300 rounded-3xl p-4 sm:p-5 shadow-2xl max-w-xs w-full text-slate-900">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-600" />
          <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
            {lang === 'ta' ? 'தினசரி 10 நிமிட பயில்வு' : '10-Minute Daily Goal'}
          </span>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="text-slate-400 hover:text-slate-700 text-xs p-1 cursor-pointer font-bold"
        >
          _
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Time Display */}
      <div className="text-center my-2">
        <div className="text-3xl sm:text-4xl font-black font-mono tracking-wider text-amber-950 tabular-nums">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {isCompleted
            ? (lang === 'ta' ? 'இன்றைய 10 நிமிட இலக்கு முடிந்தது! 🎉' : '10 minutes achieved today! 🎉')
            : (lang === 'ta' ? 'விளையாடிக்கொண்டே நேரத்தை பதிவு செய்யுங்கள்' : 'Keep learning and mastering!')}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mt-3">
        <button
          onClick={toggleTimer}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-transform active:scale-95 cursor-pointer ${
            isActive ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>{lang === 'ta' ? 'நிறுத்து' : 'Pause'}</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{lang === 'ta' ? 'தொடங்கு' : 'Start'}</span>
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          title={lang === 'ta' ? 'மறுதொடக்கம்' : 'Reset'}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
