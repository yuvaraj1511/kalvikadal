import React from 'react';
import { Language, ClassStandard } from '../types';
import { sound } from '../utils/audio';

interface FooterProps {
  lang: Language;
  onSelectClass: (id: ClassStandard) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onSelectClass }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-2">
            <span className="text-xl font-extrabold text-white tracking-tight font-serif block mb-2">
              Kalvi Kadhai
            </span>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              {lang === 'ta'
                ? 'தமிழ்நாடு சமச்சீர் கல்விப் பாடத்திட்டத்தை எளிமையாகவும் சுவாரசியமாகவும் குழந்தைகள் 10 நிமிடங்களில் கற்கும் டிஜிட்டல் தளம்.'
                : 'Empowering children across Tamil Nadu to master their state board Samacheer Kalvi curriculum in 10 joyful minutes daily.'}
            </p>
            <div className="mt-4 text-xs text-amber-400/90 font-medium">
              {lang === 'ta' ? 'அனைத்து வகுப்புகளும் இலவசம் · பதிவு தேவையில்லை' : 'Free for all students · Instant access, zero registration'}
            </div>
          </div>

          {/* Col 2: Standards 1-5 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {lang === 'ta' ? 'வகுப்புகள் (Standards)' : 'Select Standard'}
            </h4>
            <ul className="space-y-2 text-xs">
              {[1, 2, 3, 4, 5].map((std) => (
                <li key={std}>
                  <button
                    onClick={() => {
                      sound.playPop();
                      onSelectClass(std as ClassStandard);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                  >
                    {lang === 'ta' ? `வகுப்பு ${std}` : `Class ${std}`}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Teachers & Parents */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {lang === 'ta' ? 'வழிகாட்டிகள்' : 'Resources'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#microlearning" className="hover:text-amber-400 transition-colors">
                  {lang === 'ta' ? '10 நிமிட முறை' : '10-Minute Method'}
                </a>
              </li>
              <li>
                <a href="#curriculum" className="hover:text-amber-400 transition-colors">
                  {lang === 'ta' ? 'சமச்சீர் பாட வரைபடம்' : 'TN Samacheer Curriculum'}
                </a>
              </li>
              <li>
                <a href="#parentguide" className="hover:text-amber-400 transition-colors">
                  {lang === 'ta' ? 'பெற்றோர் கையேடு' : 'Parent & Teacher Guide'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div>
            © {new Date().getFullYear()} Kalvi Kadhai. TN Samacheer Kalvi Educational Games.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>Made for Tamil Nadu Students & Educators</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
