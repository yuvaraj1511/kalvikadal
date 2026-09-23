import React, { useState } from 'react';
import { BookOpen, Clock, Award, CheckCircle2, Printer, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { Language } from '../types';
import { CLASSES_DATA } from '../data/samacheerCurriculum';
import { sound } from '../utils/audio';

interface ParentTeacherGuideProps {
  lang: Language;
}

export const ParentTeacherGuide: React.FC<ParentTeacherGuideProps> = ({ lang }) => {
  const [selectedStandard, setSelectedStandard] = useState<number>(1);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const activeCls = CLASSES_DATA.find(c => c.id === selectedStandard) || CLASSES_DATA[0];

  const handlePrint = () => {
    sound.playPop();
    window.print();
  };

  return (
    <section id="parentguide" className="py-16 sm:py-24 bg-amber-50/40 border-t border-amber-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs sm:text-sm font-bold tracking-wider uppercase text-amber-800 mb-2">
            {lang === 'ta' ? 'பெற்றோர் மற்றும் ஆசிரியர் வழிகாட்டி' : 'Parent & Teacher Blueprint'}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'ta'
              ? 'தினசரி 10 நிமிட மைக்ரோ கற்றலின் அறிவியல்'
              : 'The Science of 10 Minutes a Day'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {lang === 'ta'
              ? 'தமிழ்நாடு சமச்சீர் கல்வி பாடத்திட்டத்திற்கு ஏற்ப வீட்டில் பெற்றோரும், பள்ளியில் ஆசிரியர்களும் பயன்படுத்தக்கூடிய எளிமையான கற்பித்தல் உத்தி.'
              : 'How calibrated short learning loops boost retention and turn TN Samacheer Kalvi benchmarks into natural play.'}
          </p>
        </div>

        {/* 3 Pillars of 10-Minute Micro-Learning */}
        <div id="microlearning" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 bg-white rounded-2xl border border-amber-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-lg mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              {lang === 'ta' ? 'கவனக்குறைவின்றி கற்கும் கால அளவு' : 'Optimal Attention Span'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {lang === 'ta'
                ? '5 முதல் 11 வயதுடைய குழந்தைகளின் முழுமையான கவனம் 8-12 நிமிடங்கள் மட்டுமே. 10 நிமிட விளையாட்டு சலிப்பை தடுத்து ஆர்வத்தை தூண்டுகிறது.'
                : 'Elementary learners sustain peak focus for 8 to 12 minutes. 10-minute micro-sessions eliminate homework fatigue.'}
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-amber-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              {lang === 'ta' ? 'இடைவெளி விட்டு நினைவுகூர்தல்' : 'Spaced Repetition'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {lang === 'ta'
                ? 'ஒவ்வொரு நாளும் புதிய ஒரு விளையாட்டோடு முந்தைய பாடத்தை தொடர்புபடுத்துவதால் 300% வரை நினைவாற்றல் அதிகரிக்கிறது.'
                : 'Daily bite-sized challenges reinforce Tamil letters, math facts, and science without repetitive mechanical drills.'}
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-amber-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              {lang === 'ta' ? 'சுய உந்துதல் & உடனடி பாராட்டு' : 'Intrinsic Game Rewards'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {lang === 'ta'
                ? 'வெற்றிச் சத்தங்கள் (Audio Fanfare) மற்றும் நட்சத்திரப் பதக்கங்கள் குழந்தைகளுக்கு இயல்பான கற்கும் உத்வேகத்தை தருகின்றன.'
                : 'Instant auditory chimes and collectible stars build genuine confidence and emotional joy in learning.'}
            </p>
          </div>
        </div>

        {/* Detailed Curriculum Syllabus Explorer */}
        <div id="curriculum" className="bg-white rounded-3xl border border-amber-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 bg-amber-50/60 border-b border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
                {lang === 'ta' ? 'பாடத்திட்ட வரைபடம்' : 'Curriculum Matrix'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {lang === 'ta'
                  ? 'தமிழ்நாடு சமச்சீர் கல்விப் பாடத்திட்டம் (பருவங்கள் 1, 2, 3)'
                  : 'TN Samacheer Kalvi Syllabus (Terms 1, 2, 3)'}
              </h3>
            </div>

            {/* Standard selector pill tab */}
            <div className="flex items-center gap-1.5 p-1 bg-amber-200/60 rounded-xl">
              {[1, 2, 3, 4, 5].map((std) => (
                <button
                  key={std}
                  onClick={() => {
                    sound.playPop();
                    setSelectedStandard(std);
                  }}
                  className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                    selectedStandard === std
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'text-amber-950 hover:bg-amber-100'
                  }`}
                >
                  {lang === 'ta' ? `வகுப்பு ${std}` : `Std ${std}`}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{activeCls.icon}</span>
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  {lang === 'ta' ? `${activeCls.titleTa} - ${activeCls.themeNameTa}` : `${activeCls.titleEn} - ${activeCls.themeNameEn}`}
                </h4>
                <p className="text-xs text-slate-600">{lang === 'ta' ? activeCls.summaryTa : activeCls.summaryEn}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-2xl p-5">
                <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                  {lang === 'ta' ? 'தமிழ் பாடப்பிரிவு தலைப்புகள்' : 'Tamil Subject Topics'}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{activeCls.samacheerTopics.tamil}</p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  {lang === 'ta' ? 'கற்பித்தல் திறன்: வாசித்தல், உச்சரித்தல், சொல் உருவாக்கம்' : 'Key skills: Reading, phonetics, vocabulary building'}
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5">
                <div className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">
                  {lang === 'ta' ? 'கணித பாடப்பிரிவு தலைப்புகள்' : 'Mathematics Subject Topics'}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{activeCls.samacheerTopics.math}</p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  {lang === 'ta' ? 'கற்பித்தல் திறன்: இடமதிப்பு, எளிய கூட்டல்/கழித்தல், வடிவங்கள்' : 'Key skills: Place value, arithmetic operations, geometry'}
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                  {lang === 'ta' ? 'சூழ்நிலையியல் / அறிவியல் தலைப்புகள்' : 'EVS / Science Topics'}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{activeCls.samacheerTopics.evsScience}</p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  {lang === 'ta' ? 'கற்பித்தல் திறன்: இயற்கை அவதானிப்பு, பரிசோதனை, சூழல் விழிப்புணர்வு' : 'Key skills: Observation, scientific inquiry, ecology'}
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5">
                <div className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-2">
                  {lang === 'ta' ? 'ஆங்கில பாடப்பிரிவு தலைப்புகள்' : 'English Topics'}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{activeCls.samacheerTopics.english}</p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  {lang === 'ta' ? 'கற்பித்தல் திறன்: எழுத்தொலிகள், வாக்கிய அமைப்பு, உரையாடல்' : 'Key skills: Phonics, sentence structure, conversational flow'}
                </div>
              </div>
            </div>

            {/* Daily Recommended Routine for Parents */}
            <div className="mt-8 p-5 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h5 className="text-sm font-bold text-slate-900 mb-1">
                  {lang === 'ta' ? 'பரிந்துரைக்கப்படும் 10 நிமிட அட்டவணை' : 'Recommended 10-Minute Daily Routine'}
                </h5>
                <p className="text-xs text-slate-600">
                  {lang === 'ta'
                    ? 'காலை: 5 நிமிடம் தமிழ் எழுத்து / சொல் பயிற்சி · மாலை: 5 நிமிடம் கணிதம் அல்லது அறிவியல் விளையாட்டு.'
                    : 'Morning: 5 mins Tamil language game · Evening: 5 mins Math puzzle or Science lab exploration.'}
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playPop();
                  setShowPrintModal(true);
                }}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{lang === 'ta' ? 'பயிற்சித் தாள் அச்சிடுக' : 'Printable Worksheet'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Printable Worksheet Modal */}
        {showPrintModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-amber-200 relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-amber-200 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-amber-700" />
                  <h4 className="text-lg font-black text-slate-900">
                    {lang === 'ta' ? `வகுப்பு ${selectedStandard} தினசரி பயிற்சித் தாள்` : `Class ${selectedStandard} Daily Activity Sheet`}
                  </h4>
                </div>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold text-lg p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between text-xs">
                  <span><strong>Student Name / மாணவர் பெயர்:</strong> ______________________</span>
                  <span><strong>Date / தேதி:</strong> ______________</span>
                </div>

                <div className="border border-slate-200 rounded-xl p-4">
                  <h5 className="font-bold text-amber-900 mb-2">பகுதி 1: தமிழ் பயிற்சி (5 நிமிடங்கள்)</h5>
                  <p>1. உயிர் எழுத்துக்கள் அ முதல் ஔ வரை வரிசையாக எழுதுக:</p>
                  <div className="h-10 border-b border-dashed border-slate-300 my-2" />
                  <p>2. படம் பார்த்து பெயர் எழுதுக (அணில் / ஆலமரம் / இலை):</p>
                  <div className="h-10 border-b border-dashed border-slate-300 my-2" />
                </div>

                <div className="border border-slate-200 rounded-xl p-4">
                  <h5 className="font-bold text-blue-900 mb-2">பகுதி 2: கணித புதிர் (5 நிமிடங்கள்)</h5>
                  <p>1. கூட்டுக: 5 + 4 = [ ____ ] &nbsp;&nbsp;&nbsp;&nbsp; 8 - 3 = [ ____ ]</p>
                  <p className="mt-2">2. வட்டத்திற்கு நீல வண்ணமும், முக்கோணத்திற்கு பச்சை வண்ணமும் தீட்டுக.</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  {lang === 'ta' ? 'மூடுக' : 'Close'}
                </button>
                <button
                  onClick={handlePrint}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{lang === 'ta' ? 'அச்சிடு (Print)' : 'Print Now'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
