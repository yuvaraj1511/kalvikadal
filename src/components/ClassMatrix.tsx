import React from 'react';
import { ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';
import { Language, ClassStandard, ClassMetadata } from '../types';
import { CLASSES_DATA } from '../data/samacheerCurriculum';
import { sound } from '../utils/audio';

interface ClassMatrixProps {
  lang: Language;
  onSelectClass: (id: ClassStandard) => void;
}

export const ClassMatrix: React.FC<ClassMatrixProps> = ({
  lang,
  onSelectClass,
}) => {
  return (
    <section id="classes" className="py-14 sm:py-20 bg-white border-y border-amber-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="text-xs sm:text-sm font-bold tracking-wider uppercase text-amber-800 mb-2">
            {lang === 'ta' ? 'பாடப்பிரிவு அட்டவணை' : 'Class Selection Matrix'}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'ta'
              ? '5 பிரம்மாண்ட தீம்கள் · 5 அற்புத சாகசங்கள்'
              : 'Five Thematic Adventures · Classes 1 to 5'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {lang === 'ta'
              ? 'எழுத்துக்களின் காட்டில் தொடங்கும் பயணம், விண்வெளி ஆய்வைத் தாண்டி சோழர் பேரரசு வரை செல்கிறது!'
              : 'From toy-filled alphabet trains to galactic math rockets and ancient Chola kingdom quests.'}
          </p>
        </div>

        {/* Visual Grid: Cards for Class 1 to 5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {CLASSES_DATA.map((cls, index) => {
            const isFeatured = index === 0 || index === 4; // subtle visual accent
            return (
              <div
                key={cls.id}
                className={`group flex flex-col justify-between rounded-2xl bg-white border ${
                  cls.borderColor
                } shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
                  isFeatured ? 'ring-2 ring-amber-400/50' : ''
                }`}
              >
                {/* Visual Image Header */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={cls.heroImage}
                    alt={lang === 'ta' ? cls.themeNameTa : cls.themeNameEn}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback if image path fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {/* Scrim overlay for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Top Bar on Image: Standard Badge & Large Illustrative Icon */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-3 py-1 bg-white/95 backdrop-blur-xs text-slate-900 font-extrabold text-xs rounded-lg shadow-sm">
                      {lang === 'ta' ? cls.titleTa : cls.titleEn}
                    </span>
                    <span className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs shadow-md flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform duration-300">
                      {cls.icon}
                    </span>
                  </div>

                  {/* Bottom title on image */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-lg sm:text-xl font-bold text-white drop-shadow-md">
                      {lang === 'ta' ? cls.themeNameTa : cls.themeNameEn}
                    </h3>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Summary Hook */}
                    <p className="text-sm font-medium text-slate-700 leading-relaxed mb-4">
                      {lang === 'ta' ? cls.summaryTa : cls.summaryEn}
                    </p>

                    {/* Focus Points Checklist */}
                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {lang === 'ta' ? 'முக்கிய கற்றல் நோக்கங்கள்:' : 'Core Competencies:'}
                      </div>
                      {(lang === 'ta' ? cls.focusPointsTa : cls.focusPointsEn).map((point, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>

                    {/* Samacheer Kalvi Topics preview */}
                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
                      <div className="font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                        <span>{lang === 'ta' ? 'சமச்சீர் பாடங்கள் (பருவம் 1-3):' : 'Samacheer Subjects:'}</span>
                      </div>
                      <div className="text-slate-600 space-y-0.5">
                        <div><strong className="text-slate-700">தமிழ்:</strong> {cls.samacheerTopics.tamil}</div>
                        <div><strong className="text-slate-700">கணிதம் / Math:</strong> {cls.samacheerTopics.math}</div>
                      </div>
                    </div>
                  </div>

                  {/* Big Action Button */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        sound.playFanfare();
                        onSelectClass(cls.id);
                      }}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer bg-gradient-to-r ${cls.accentColor}`}
                    >
                      <span>
                        {lang === 'ta'
                          ? `${cls.titleTa} தொடங்குக`
                          : `Launch ${cls.titleEn} Portal`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
