import React, { useState } from 'react';
import { Camera, Upload, User, ShieldCheck, Mail, Volume2, Sparkles, Check } from 'lucide-react';
import { Language } from '../../types';
import { ZaiChangConfig } from './types';
import { sound } from '../../utils/audio';

interface ZaiChangModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  config: ZaiChangConfig;
  onSaveConfig: (newConfig: ZaiChangConfig) => void;
}

const PRESET_AVATARS = [
  {
    id: 'amma_1',
    labelTa: 'அம்மா (Mother)',
    labelEn: 'Amma (Mother)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    fallbackEmoji: '👩‍🏫'
  },
  {
    id: 'appa_1',
    labelTa: 'அப்பா (Father)',
    labelEn: 'Appa (Father)',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
    fallbackEmoji: '👨‍💼'
  },
  {
    id: 'teacher_1',
    labelTa: 'ஆசிரியை (Teacher)',
    labelEn: 'Teacher Guardian',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    fallbackEmoji: '👩‍🎓'
  }
];

export const ZaiChangModal: React.FC<ZaiChangModalProps> = ({
  lang,
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [parentPhoto, setParentPhoto] = useState<string>(config.parentPhoto || PRESET_AVATARS[0].url);
  const [parentName, setParentName] = useState<string>(config.parentName || (lang === 'ta' ? 'அம்மா' : 'Amma'));
  const [childName, setChildName] = useState<string>(config.childName || (lang === 'ta' ? 'கண்ணா' : 'Arjun'));
  const [parentEmail, setParentEmail] = useState<string>(config.parentEmail || '');
  const [warningTa, setWarningTa] = useState<string>(config.customWarningTamil || 'கண்ணா, போனை கீழே வை! படிப்பை முடித்துவிட்டு விளையாடலாம்!');
  const [warningEn, setWarningEn] = useState<string>(config.customWarningEnglish || 'Back to your seat, dear! Put the phone away and finish your lesson!');
  const [voiceGender, setVoiceGender] = useState<'female' | 'male'>(config.voiceGender || 'female');
  const [enabled, setEnabled] = useState<boolean>(config.enabled);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setParentPhoto(reader.result);
          sound.playPop();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const testVoice = () => {
    sound.playPop();
    const textToSpeak = lang === 'ta' ? warningTa : warningEn;
    sound.speak(textToSpeak, lang === 'ta' ? 'ta-IN' : 'en-US');
  };

  const handleSave = () => {
    sound.playFanfare();
    onSaveConfig({
      enabled,
      parentPhoto,
      parentName,
      childName,
      parentEmail,
      customWarningTamil: warningTa,
      customWarningEnglish: warningEn,
      voiceGender,
      strictness: 'balanced',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-4 sm:p-7 shadow-2xl border border-amber-300 relative my-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-800">
              <Camera className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <span>{lang === 'ta' ? 'AI ஆசிரியர்' : 'Virtual Teacher'}</span>
                <span className="text-xs bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                  {lang === 'ta' ? 'கண்காணிப்பு' : 'Live Presence'}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'ta'
                  ? 'ஆசிரியர் அல்லது பெற்றோர் புகைப்படம் மூலம் AI வகுப்பறை கண்காணிப்பு & உடனடி குரல் எச்சரிக்கை'
                  : 'AI-powered teacher presence, phone/absence monitoring & voice warnings'}
              </p>
            </div>
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

        {/* Modal Form */}
        <div className="mt-6 space-y-6 text-xs sm:text-sm">
          {/* Activation Switch */}
          <div className="flex items-center justify-between p-4 bg-amber-50/80 border border-amber-200 rounded-2xl">
            <div>
              <span className="font-bold text-amber-950 block">
                {lang === 'ta' ? 'AI ஆசிரியரை இயக்கு' : 'Enable Virtual Teacher'}
              </span>
              <span className="text-xs text-slate-600">
                {lang === 'ta'
                  ? 'திரையில் ஆசிரியர் முகம் தோன்றி, குழந்தை எழுந்து சென்றாலோ போன் எடுத்தாலோ எச்சரிக்கும்.'
                  : 'Stays on-screen, monitors device camera, and issues voice warnings if distracted.'}
              </span>
            </div>
            <button
              onClick={() => {
                sound.playPop();
                setEnabled(!enabled);
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                enabled ? 'bg-amber-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform" />
            </button>
          </div>

          {/* 1. Parent Photo Upload */}
          <div>
            <label className="font-bold text-slate-800 block mb-2">
              {lang === 'ta' ? '1. பெற்றோர் புகைப்படம் பதிவேற்றவும் (Upload Photo)' : '1. Upload Parent Photo'}
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Photo Preview with active badge */}
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md shrink-0 bg-slate-100 flex items-center justify-center">
                {parentPhoto ? (
                  <img
                    src={parentPhoto}
                    alt="Parent Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <User className="w-10 h-10 text-slate-400" />
                )}
                <div className="absolute bottom-1 right-1 p-1 bg-emerald-500 rounded-full border border-white" />
              </div>

              {/* Upload Input & Presets */}
              <div className="flex-1 w-full space-y-2">
                <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-xl cursor-pointer text-amber-900 font-semibold transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>{lang === 'ta' ? 'உங்கள் புகைப்படத்தை தேர்ந்தெடுக்க' : 'Upload From Device'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Quick Presets */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 shrink-0">
                    {lang === 'ta' ? 'மாதிரிகள்:' : 'Presets:'}
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {PRESET_AVATARS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          sound.playPop();
                          setParentPhoto(p.url);
                        }}
                        className={`px-2 py-1 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                          parentPhoto === p.url
                            ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {p.fallbackEmoji} {lang === 'ta' ? p.labelTa : p.labelEn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Names & Email Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                {lang === 'ta' ? 'பெற்றோர் பெயர் / விளிப்பு' : 'Parent Name / Role'}
              </label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="e.g. அம்மா / அப்பா / Mom"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:border-amber-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                {lang === 'ta' ? 'குழந்தையின் பெயர்' : 'Child’s Name'}
              </label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="e.g. கண்ணா / Arjun"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              {lang === 'ta' ? 'அறிக்கை பெறும் பெற்றோர் மின்னஞ்சல்' : 'Parent Email for Focus Report'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                placeholder="parent@example.com"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:border-amber-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {lang === 'ta'
                ? 'அமர்வின் முடிவில் குழந்தையின் கவன நேரம், போன் விழிப்புகள் மற்றும் AI பகுப்பாய்வு அறிக்கை இங்கு அனுப்பப்படும்.'
                : 'Session completion focus scores and distraction logs will be dispatched to this email.'}
            </p>
          </div>

          {/* 3. Custom Warning Phrase & Audio Test */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-800">
                {lang === 'ta' ? 'தனிப்பயன் குரல் எச்சரிக்கை (Custom Voice Warning)' : 'Custom Spoken Warning Phrase'}
              </label>
              <button
                type="button"
                onClick={testVoice}
                className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 font-bold cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{lang === 'ta' ? 'குரல் கேட்க' : 'Test Voice'}</span>
              </button>
            </div>
            <textarea
              rows={2}
              value={lang === 'ta' ? warningTa : warningEn}
              onChange={(e) => {
                if (lang === 'ta') setWarningTa(e.target.value);
                else setWarningEn(e.target.value);
              }}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-hidden focus:border-amber-500 text-xs sm:text-sm"
              placeholder={lang === 'ta' ? 'கண்ணா, போனை வை...' : 'Put down your phone...'}
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            {lang === 'ta' ? 'ரத்து செய்' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-700 hover:bg-amber-800 text-white flex items-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{lang === 'ta' ? 'சேமித்து ஆசிரியரை தொடங்குக' : 'Save & Launch Teacher'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
