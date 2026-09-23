import React from 'react';
import { Volume2, VolumeX, Star, Globe, Award, Download } from 'lucide-react';
import { Language } from '../types';
import { sound } from '../utils/audio';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  stars: number;
  onOpenBadges: () => void;
  onSelectClass?: (id: number | null) => void;
  onOpenZaiChang?: () => void;
  onOpenWritingStudio?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  soundEnabled,
  onToggleSound,
  stars,
  onOpenBadges,
  onSelectClass,
  onOpenZaiChang,
  onOpenWritingStudio,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-200/70 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            sound.playPop();
            if (onSelectClass) onSelectClass(null);
          }}
          className="text-left group cursor-pointer focus:outline-hidden"
        >
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-amber-950 font-serif group-hover:text-amber-700 transition-colors">
            Kalvi Kadhai
          </span>
        </button>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-700">
          <a
            href="#classes"
            onClick={() => sound.playPop()}
            className="hover:text-amber-800 transition-colors py-1"
          >
            {lang === 'ta' ? 'வகுப்புகள் 1-5' : 'Standards 1-5'}
          </a>
          <a
            href="#microlearning"
            onClick={() => sound.playPop()}
            className="hover:text-amber-800 transition-colors py-1"
          >
            {lang === 'ta' ? '10 நிமிட முறை' : '10-Min Method'}
          </a>
          <a
            href="#curriculum"
            onClick={() => sound.playPop()}
            className="hover:text-amber-800 transition-colors py-1"
          >
            {lang === 'ta' ? 'சமச்சீர் பாடத்திட்டம்' : 'Syllabus Map'}
          </a>
          <a
            href="#parentguide"
            onClick={() => sound.playPop()}
            className="hover:text-amber-800 transition-colors py-1"
          >
            {lang === 'ta' ? 'பெற்றோர் & ஆசிரியர் கையேடு' : 'Parents & Teachers'}
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Writing Practice Studio Button */}
          {onOpenWritingStudio && (
            <button
              onClick={() => {
                sound.playPop();
                onOpenWritingStudio();
              }}
              title={lang === 'ta' ? 'எழுத்துப் பயிற்சி கூடம் (Writing Practice)' : 'Writing Practice Studio'}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <span className="text-base leading-none">✍️</span>
              <span className="hidden sm:inline">{lang === 'ta' ? 'எழுத்து' : 'Writing'}</span>
            </button>
          )}

          {/* AI Teacher Presence Button */}
          {onOpenZaiChang && (
            <button
              onClick={() => {
                sound.playPop();
                onOpenZaiChang();
              }}
              title={lang === 'ta' ? 'AI ஆசிரியர் (Virtual Teacher)' : 'Virtual Teacher'}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <span className="text-base leading-none">👩‍🏫</span>
              <span className="hidden sm:inline">{lang === 'ta' ? 'ஆசிரியர்' : 'Teacher'}</span>
            </button>
          )}

          {/* Stars Tally Badge */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenBadges();
            }}
            title={lang === 'ta' ? 'பதக்கங்கள் பார்க்க' : 'View earned badges'}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100/90 hover:bg-amber-200/90 border border-amber-300 rounded-full text-amber-950 font-bold text-xs sm:text-sm transition-transform active:scale-95 shadow-xs cursor-pointer"
          >
            <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
            <span className="font-mono tabular-nums">{stars}</span>
            <Award className="w-3.5 h-3.5 text-amber-700 hidden sm:inline-block ml-0.5" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              if (!soundEnabled) {
                sound.playPop();
              }
            }}
            aria-label={soundEnabled ? 'Disable audio' : 'Enable audio'}
            className="p-2 text-slate-700 hover:text-slate-900 hover:bg-amber-100/60 rounded-lg transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-amber-700" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => {
              sound.playPop();
              onToggleLang();
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:border-amber-400 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
          >
            <Globe className="w-3.5 h-3.5 text-amber-700" />
            <span>{lang === 'ta' ? 'English' : 'தமிழ்'}</span>
          </button>

          {/* GitHub Ready Download ZIP */}
          <a
            href="/kalvi-kadhai-source.zip"
            download="kalvi-kadhai-main.zip"
            onClick={() => sound.playPop()}
            title={lang === 'ta' ? 'முழு திட்டத்தை ZIP-ஆக பதிவிறக்கு (GitHub-ல் பதிவேற்ற)' : 'Download Clean Project ZIP (for GitHub upload)'}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-amber-300 font-bold text-xs rounded-lg transition-all active:scale-95 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'ta' ? 'Download Code' : 'Download Code'}</span>
          </a>
        </div>
      </div>
    </header>
  );
};
