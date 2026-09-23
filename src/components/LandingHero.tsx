import React from 'react';
import { Sparkles, Play, Clock, ShieldCheck, BookOpen } from 'lucide-react';
import { Language, ClassStandard } from '../types';
import { CLASSES_DATA } from '../data/samacheerCurriculum';
import { sound } from '../utils/audio';

interface LandingHeroProps {
  lang: Language;
  onSelectClass: (id: ClassStandard) => void;
  minutesToday: number;
  onOpenZaiChang?: () => void;
  onOpenWritingStudio?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  lang,
  onSelectClass,
  minutesToday,
  onOpenZaiChang,
  onOpenWritingStudio,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 md:pt-14 md:pb-20 bg-gradient-to-b from-amber-100/70 via-amber-50/40 to-transparent">
      {/* Decorative gentle floating soft shapes */}
      <div className="absolute top-10 left-5 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-5 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Subtle trust badge without pill clutter */}
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-900 mb-4 bg-amber-200/60 px-4 py-1.5 rounded-full border border-amber-300 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>
            {lang === 'ta'
              ? 'தமிழ்நாடு சமச்சீர் கல்வி அங்கீகாரம் · TNSCERT வழிகாட்டுதல்'
              : 'TN Samacheer Kalvi Aligned · Zero-Login Safe Learning'}
          </span>
        </div>

        {/* The Exact Mandatory Hook */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-amber-950 tracking-tight leading-tight max-w-4xl mx-auto">
          {lang === 'ta' ? (
            <>
              தினமும் <span className="text-orange-600 underline decoration-amber-400 decoration-wavy decoration-2">10 நிமிடம்</span> போதும்!
              <br />
              விளையாட்டின் மூலம் சமச்சீர் பாடங்களை வெல்லலாம்!
            </>
          ) : (
            <>
              Just <span className="text-orange-600 underline decoration-amber-400 decoration-wavy decoration-2">10 minutes a day</span> to master the TN Samacheer Kalvi syllabus through games!
            </>
          )}
        </h1>

        {/* Subtitle for Parents & Teachers */}
        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed">
          {lang === 'ta'
            ? 'பெற்றோர்கள் மற்றும் ஆசிரியர்களுக்கான எளிய டிஜிட்டல் வகுப்பறை. பாஸ்வேர்ட் தேவையில்லை—உங்கள் குழந்தையின் வகுப்பை தேர்வு செய்து உடனடியாக விளையாடி கற்க தொடங்குங்கள்!'
            : 'Designed for parents & teachers. No passwords or registration required—select your child’s standard below to launch their colorful learning adventure in 1 second!'}
        </p>

        {/* Daily 10-Minute Indicator */}
        <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 bg-white/90 border border-amber-200 rounded-xl shadow-xs text-xs sm:text-sm text-slate-700">
          <Clock className="w-4 h-4 text-orange-600 animate-pulse" />
          <span className="font-medium">
            {lang === 'ta' ? 'இன்றைய பயிற்சி நேரம்:' : 'Today’s practice:'}{' '}
            <strong className="text-amber-900 font-bold font-mono">{minutesToday}/10 mins</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {minutesToday >= 10
              ? (lang === 'ta' ? 'இலக்கு முடிந்தது! 🎉' : 'Daily Goal Achieved! 🎉')
              : (lang === 'ta' ? 'இன்னும் சிறிது நேரம்!' : 'Keep Going!')}
          </span>
        </div>

        {/* The Simple CTA: Big, colorful buttons representing each standard (Class 1 to Class 5) */}
        <div className="mt-8 sm:mt-12">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-900 mb-4 flex items-center justify-center gap-2">
            <span>👇</span>
            {lang === 'ta' ? 'வகுப்பைத் தேர்ந்தெடுத்து உடனே தொடங்குங்கள்' : 'Click a standard below to start playing instantly'}
            <span>👇</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 max-w-5xl mx-auto">
            {CLASSES_DATA.map((cls) => {
              const bgGradient =
                cls.id === 1
                  ? 'from-amber-400 via-orange-500 to-amber-600 hover:from-amber-500 hover:to-orange-600 shadow-orange-200'
                  : cls.id === 2
                  ? 'from-pink-500 via-fuchsia-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-pink-200'
                  : cls.id === 3
                  ? 'from-sky-500 via-blue-600 to-indigo-700 hover:from-sky-600 hover:to-indigo-800 shadow-sky-200'
                  : cls.id === 4
                  ? 'from-emerald-500 via-teal-600 to-green-700 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-200'
                  : 'from-amber-600 via-violet-600 to-purple-800 hover:from-amber-700 hover:to-purple-900 shadow-amber-200';

              return (
                <button
                  key={cls.id}
                  onClick={() => {
                    sound.playFanfare();
                    onSelectClass(cls.id);
                  }}
                  className={`group relative flex flex-col items-center justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-b ${bgGradient} text-white shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0.5 transition-all duration-200 cursor-pointer text-center border-2 border-white/30`}
                >
                  {/* Top Badge: Standard Number */}
                  <div className="w-full flex items-center justify-between text-xs font-bold text-white/90 pb-2 border-b border-white/20">
                    <span className="px-2 py-0.5 bg-black/20 rounded-md font-mono">
                      STD {cls.id}
                    </span>
                    <span className="text-xs uppercase tracking-tight">
                      {lang === 'ta' ? 'உடனடி தொடக்கம்' : 'Instant Launch'}
                    </span>
                  </div>

                  {/* Big Illustrative Icon */}
                  <div className="my-3 text-4xl sm:text-5xl group-hover:scale-115 transition-transform duration-300 drop-shadow-md">
                    {cls.icon}
                  </div>

                  {/* Class Name & Theme */}
                  <div className="w-full">
                    <div className="text-lg sm:text-xl font-black tracking-tight text-white drop-shadow-xs">
                      {lang === 'ta' ? cls.titleTa : cls.titleEn}
                    </div>
                    <div className="text-xs font-semibold text-white/90 line-clamp-1 mt-0.5">
                      {lang === 'ta' ? cls.themeNameTa : cls.themeNameEn}
                    </div>
                  </div>

                  {/* CTA Label */}
                  <div className="mt-3 w-full py-1.5 px-3 bg-white text-slate-900 font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1 group-hover:bg-amber-100 transition-colors">
                    <Play className="w-3.5 h-3.5 fill-slate-900" />
                    <span>{lang === 'ta' ? 'விளையாடு' : 'Play Now'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Features Row */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 bg-white/80 border border-amber-200/80 rounded-xl shadow-2xs flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {lang === 'ta' ? '10 நிமிட மைக்ரோ கற்றல்' : '10-Minute Bite-Sized'}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                {lang === 'ta'
                  ? 'குழந்தைகளுக்கு சலிப்பில்லாமல், கவனக்குறைவின்றி விரைவாகக் கற்கும் அறிவியல் முறை.'
                  : 'Scientifically calibrated sessions to prevent cognitive fatigue in young minds.'}
              </p>
            </div>
          </div>

          <div className="p-4 bg-white/80 border border-amber-200/80 rounded-xl shadow-2xs flex items-start gap-3">
            <div className="p-2 bg-orange-100 text-orange-800 rounded-lg shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {lang === 'ta' ? '100% சமச்சீர் கல்வி' : '100% TN Samacheer Aligned'}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                {lang === 'ta'
                  ? 'தமிழ்நாடு அரசுப் பள்ளி மற்றும் மெட்ரிக் பாடநூல்களின் தரம் மற்றும் பாடத்திட்டம்.'
                  : 'Follows Tamil Nadu Textbook Corporation syllabi for Term 1, 2, and 3.'}
              </p>
            </div>
          </div>

          <div className="p-4 bg-white/80 border border-amber-200/80 rounded-xl shadow-2xs flex items-start gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {lang === 'ta' ? 'ஒலி & பேச்சு வழிகாட்டி' : 'Audio & Speech Support'}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                {lang === 'ta'
                  ? 'தமிழ் எழுத்துக்கள் மற்றும் சொற்களை தெளிவாக உச்சரிக்கும் உள்ளமைந்த ஒலி வசதி.'
                  : 'Tamil & English pronunciation helper with encouraging audio feedback.'}
              </p>
            </div>
          </div>
        </div>

        {/* AI Teacher Feature Spotlight Card */}
        <div className="mt-8 p-5 sm:p-6 bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 rounded-3xl text-white shadow-xl max-w-4xl mx-auto text-left border-2 border-amber-500/30 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-black uppercase tracking-wider border border-amber-400/30">
                <span>AI PRESENCE GUARDIAN</span>
                <span>·</span>
                <span>VIRTUAL TEACHER</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {lang === 'ta'
                  ? 'AI ஆசிரியர்: டிஜிட்டல் முகம் & நேரலை வகுப்பறை கண்காணிப்பு'
                  : 'How "Virtual Teacher" Works: Digital Presence & Focus AI'}
              </h3>
              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed max-w-xl">
                {lang === 'ta'
                  ? '1. ஆசிரியர் அல்லது பெற்றோர் புகைப்படத்தை பதிவேற்றுங்கள் — திரையில் மெய்நிகர் ஆசிரியர் தோன்றுவார். 2. கேமரா AI மூலம் குழந்தை போன் எடுத்தாலோ, இருக்கையை விட்டு சென்றாலோ உங்கள் சொந்தக் குரலில் உடனடி எச்சரிக்கை விடுக்கப்படும்! 3. அமர்வின் முடிவில் விரிவான கவன அறிக்கை மின்னஞ்சலுக்கு வரும்.'
                  : '1. Upload a photo or select an avatar to create a live "Virtual Teacher" on-screen. 2. Device camera AI monitors the child; leaving the seat or picking up a phone triggers an immediate custom voice warning. 3. Automatically emails you a complete data focus report.'}
              </p>
            </div>

            {onOpenZaiChang && (
              <button
                onClick={() => {
                  sound.playPop();
                  onOpenZaiChang();
                }}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer shrink-0 flex items-center gap-2"
              >
                <span className="text-xl">👩‍🏫</span>
                <span>{lang === 'ta' ? 'ஆசிரியரை அமைக்குக' : 'Set Up Teacher'}</span>
              </button>
            )}
          </div>
        </div>
        {/* Writing Practice Studio Showcase Card */}
        {onOpenWritingStudio && (
          <div className="mt-4 p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-3xl text-white shadow-xl max-w-4xl mx-auto text-left border-2 border-emerald-500/30 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-400/30">
                  <span>5-STEP WRITING METHOD</span>
                  <span>·</span>
                  <span>SEE → TRACE → COPY → REMEMBER → GAME</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {lang === 'ta'
                    ? 'எழுத்துப் பயிற்சி கூடம்: தொடுதிரை & சுட்டி பலகை'
                    : 'Interactive Writing Studio: Master Letter Writing'}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl">
                  {lang === 'ta'
                    ? '👀 பார் (See) → ✏️ வரை (Trace) → 📝 பார்த்து எழுது (Copy) → 🧠 நினைவில் எழுது (Remember) → 🎮 சவால் (Game - 3 முறை எழுதி ⭐ வெல்க!) என்ற அறிவியல் முறை.'
                    : 'Master letters through the 5-step flow: 👀 See (big animated letter) → ✏️ Trace (follow dotted path) → 📝 Copy (side-by-side blank board) → 🧠 Remember (from memory) → 🎮 Game (write 3 to unlock ⭐)!'}
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playPop();
                  onOpenWritingStudio();
                }}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer shrink-0 flex items-center gap-2"
              >
                <span className="text-xl">✍️</span>
                <span>{lang === 'ta' ? 'எழுத்துப் பயிற்சி தொடங்குக' : 'Open Writing Studio'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
