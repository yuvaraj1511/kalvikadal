import React from 'react';
import { Award, Star, CheckCircle, Lock } from 'lucide-react';
import { Language } from '../types';
import { BADGES_LIST } from '../data/samacheerCurriculum';
import { sound } from '../utils/audio';

interface BadgeModalProps {
  lang: Language;
  stars: number;
  isOpen: boolean;
  onClose: () => void;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({
  lang,
  stars,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-amber-300 relative">
        <div className="flex items-center justify-between pb-4 border-b border-amber-200">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-700" />
            <h3 className="text-xl font-black text-slate-900">
              {lang === 'ta' ? 'வெற்றிப் பதக்கங்கள் & சாதனைகள்' : 'Honors & Badges'}
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Current Stars Overview */}
        <div className="my-6 p-4 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-900 uppercase">
              {lang === 'ta' ? 'ஈட்டிய மொத்த நட்சத்திரங்கள்' : 'Total Stars Collected'}
            </div>
            <div className="text-3xl font-black text-amber-950 font-mono flex items-center gap-1.5 mt-0.5">
              <Star className="w-6 h-6 fill-amber-500 text-amber-600" />
              <span>{stars}</span>
            </div>
          </div>
          <div className="text-right text-xs text-amber-900 max-w-[180px]">
            {stars >= 5
              ? (lang === 'ta' ? 'சிறந்த சாதனையாளர்! மேலும் விளையாடி புதிய பதக்கங்களை திறக்கவும்.' : 'Super learner! Keep playing to unlock all badges.')
              : (lang === 'ta' ? 'தொடர்ந்து விளையாடி நட்சத்திரங்களை சேகரிக்கவும்!' : 'Play games to earn more golden stars!')}
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
          {BADGES_LIST.map((badge, idx) => {
            // Unlock rule: 1st unlocked at 1 star, 2nd at 3, 3rd at 6, etc.
            const requiredStars = (idx + 1) * 2;
            const isUnlocked = stars >= requiredStars || idx === 0;

            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                  isUnlocked
                    ? 'bg-amber-50/80 border-amber-300 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${isUnlocked ? 'bg-amber-200 shadow-xs' : 'bg-slate-200'}`}>
                  {isUnlocked ? badge.icon : <Lock className="w-5 h-5 text-slate-400" />}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {lang === 'ta' ? badge.nameTa : badge.nameEn}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {lang === 'ta' ? badge.descTa : badge.descEn}
                  </p>
                  <div className="text-[11px] font-semibold text-amber-800 mt-0.5">
                    {isUnlocked ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> {lang === 'ta' ? 'திறக்கப்பட்டது' : 'Unlocked'}
                      </span>
                    ) : (
                      <span>{lang === 'ta' ? `${requiredStars} ⭐ தேவை` : `Needs ${requiredStars} ⭐`}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="w-full py-2.5 px-4 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {lang === 'ta' ? 'தொடர்ந்து விளையாடு' : 'Back to Games'}
          </button>
        </div>
      </div>
    </div>
  );
};
