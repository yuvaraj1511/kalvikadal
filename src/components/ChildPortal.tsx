import React from 'react';
import { ArrowLeft, Star, Volume2, Award, Sparkles, BookOpen, Layers } from 'lucide-react';
import { Language, ClassStandard } from '../types';
import { CLASSES_DATA } from '../data/samacheerCurriculum';
import { sound } from '../utils/audio';

import { Class1ToysGame } from './games/Class1ToysGame';
import { Class2FantasyGame } from './games/Class2FantasyGame';
import { Class3SpaceGame } from './games/Class3SpaceGame';
import { Class4TreasureGame } from './games/Class4TreasureGame';
import { Class5KingdomGame } from './games/Class5KingdomGame';

interface ChildPortalProps {
  classId: ClassStandard;
  lang: Language;
  onBack: () => void;
  onSelectClass: (id: ClassStandard) => void;
  stars: number;
  onEarnStar: () => void;
  onOpenBadges: () => void;
  onOpenWritingStudio?: () => void;
}

export const ChildPortal: React.FC<ChildPortalProps> = ({
  classId,
  lang,
  onBack,
  onSelectClass,
  stars,
  onEarnStar,
  onOpenBadges,
  onOpenWritingStudio,
}) => {
  const currentClass = CLASSES_DATA.find((c) => c.id === classId) || CLASSES_DATA[0];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Top Child Header Toolbar */}
      <div className="bg-white border-b border-amber-200/70 shadow-xs py-3 px-4 sm:px-6 sticky top-16 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Back Button */}
          <button
            onClick={() => {
              sound.playPop();
              onBack();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100/80 hover:bg-amber-200 text-amber-950 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'ta' ? 'முகப்புக்கு திரும்பு' : 'All Classes'}</span>
          </button>

          {/* Quick Standard Switcher tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {onOpenWritingStudio && (
              <button
                onClick={() => {
                  sound.playPop();
                  onOpenWritingStudio();
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer whitespace-nowrap shadow-xs"
              >
                <span>✍️</span>
                <span>{lang === 'ta' ? 'எழுத்துப் பயிற்சி' : 'Writing Practice'}</span>
              </button>
            )}

            {CLASSES_DATA.map((cls) => (
              <button
                key={cls.id}
                onClick={() => {
                  sound.playPop();
                  onSelectClass(cls.id);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  cls.id === classId
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-900'
                }`}
              >
                <span>{cls.icon}</span>
                <span>{lang === 'ta' ? `வகுப்பு ${cls.id}` : `Std ${cls.id}`}</span>
              </button>
            ))}
          </div>

          {/* Stars & Badges button */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenBadges();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <Star className="w-4 h-4 fill-white" />
            <span className="font-mono tabular-nums">{stars}</span>
            <span className="hidden sm:inline">{lang === 'ta' ? 'நட்சத்திரங்கள்' : 'Stars'}</span>
          </button>
        </div>
      </div>

      {/* Main Thematic Arena Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Thematic Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg mb-8 border-2 border-amber-300">
          <div className="relative h-44 sm:h-56 w-full">
            <img
              src={currentClass.heroImage}
              alt={lang === 'ta' ? currentClass.themeNameTa : currentClass.themeNameEn}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Banner text */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-amber-500 text-amber-950 font-black text-xs uppercase rounded-md tracking-wider">
                  TN Samacheer Kalvi · {lang === 'ta' ? currentClass.titleTa : currentClass.titleEn}
                </span>
                <span className="text-2xl">{currentClass.icon}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black drop-shadow-md text-white tracking-tight">
                {lang === 'ta' ? currentClass.themeNameTa : currentClass.themeNameEn}
              </h1>
              <p className="text-xs sm:text-sm text-white/90 max-w-2xl mt-1">
                {lang === 'ta' ? currentClass.summaryTa : currentClass.summaryEn}
              </p>
            </div>
          </div>
        </div>

        {/* The Playable Interactive Game Area */}
        <div className="mb-10">
          {classId === 1 && <Class1ToysGame lang={lang} onEarnStar={onEarnStar} />}
          {classId === 2 && <Class2FantasyGame lang={lang} onEarnStar={onEarnStar} />}
          {classId === 3 && <Class3SpaceGame lang={lang} onEarnStar={onEarnStar} />}
          {classId === 4 && <Class4TreasureGame lang={lang} onEarnStar={onEarnStar} />}
          {classId === 5 && <Class5KingdomGame lang={lang} onEarnStar={onEarnStar} />}
        </div>

        {/* Samacheer Curriculum Card for Teachers / Parents reviewing this class */}
        <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-amber-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-700" />
              <h3 className="text-base font-bold text-slate-900">
                {lang === 'ta'
                  ? `${currentClass.titleTa} - பாடத்திட்ட வழிகாட்டி (Samacheer Curriculum)`
                  : `${currentClass.titleEn} - Samacheer Curriculum Mapping`}
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              TNSCERT Aligned
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
              <span className="font-bold text-amber-900 block mb-1">
                {lang === 'ta' ? 'தமிழ் பாடப்பிரிவு:' : 'Tamil Syllabus:'}
              </span>
              <p className="text-slate-700 leading-relaxed">{currentClass.samacheerTopics.tamil}</p>
            </div>
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
              <span className="font-bold text-blue-900 block mb-1">
                {lang === 'ta' ? 'கணிதம் / Mathematics:' : 'Mathematics Syllabus:'}
              </span>
              <p className="text-slate-700 leading-relaxed">{currentClass.samacheerTopics.math}</p>
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <span className="font-bold text-emerald-900 block mb-1">
                {lang === 'ta' ? 'சூழ்நிலையியல் / EVS & Science:' : 'EVS / Science Syllabus:'}
              </span>
              <p className="text-slate-700 leading-relaxed">{currentClass.samacheerTopics.evsScience}</p>
            </div>
            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100">
              <span className="font-bold text-purple-900 block mb-1">
                {lang === 'ta' ? 'ஆங்கிலம் / English:' : 'English Syllabus:'}
              </span>
              <p className="text-slate-700 leading-relaxed">{currentClass.samacheerTopics.english}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
