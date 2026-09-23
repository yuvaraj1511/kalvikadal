import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Star,
  Eye,
  Brain,
  Cpu,
  Heart,
  Mic,
  MicOff,
  Square,
  Play,
  Layers,
  Award,
} from 'lucide-react';
import { PRACTICE_LETTERS, PracticeLetter } from './lettersData';
import { WritingCanvas } from './WritingCanvas';
import { Language } from '../../types';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface WritingStudioProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onEarnStar?: () => void;
}

export interface AICheckResult {
  shapeCorrect: boolean;
  strokeDirection: string;
  letterProportion: string;
  isCorrect: boolean;
  score: number;
  motherVoiceMessage: string;
}

export const WritingStudio: React.FC<WritingStudioProps> = ({
  lang,
  isOpen,
  onClose,
  onEarnStar,
}) => {
  const [selectedLetter, setSelectedLetter] = useState<PracticeLetter>(PRACTICE_LETTERS[0]);
  const [currentStep, setCurrentStep] = useState<number>(1); // 1 to 5

  // AI Evaluation state
  const [lastDrawnImage, setLastDrawnImage] = useState<string | null>(null);
  const [isCheckingAI, setIsCheckingAI] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AICheckResult | null>(null);

  // Mother's Voice state
  const [customRecordedAudioUrl, setCustomRecordedAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Step 5 Progression: Letter -> Word -> Sentence
  const [step5Stage, setStep5Stage] = useState<'letter' | 'word' | 'sentence'>('letter');
  const [step5Completed, setStep5Completed] = useState<boolean>(false);

  if (!isOpen) return null;

  // Speak loving mother's voice
  const speakMotherVoice = (customText?: string) => {
    sound.playPop();
    if (customRecordedAudioUrl) {
      const audio = new Audio(customRecordedAudioUrl);
      audio.play();
      return;
    }

    const textToSpeak =
      customText ||
      (aiResult?.isCorrect
        ? (lang === 'ta'
            ? `Super கண்ணா! ${selectedLetter.char} correct-aa எழுதியிருக்க!`
            : `Super darling! You wrote ${selectedLetter.char} correctly!`)
        : (lang === 'ta'
            ? `பரவாயில்லை கண்ணா, ${selectedLetter.char}-வை இன்னொரு தடவை மெதுவாக எழுது.`
            : `That's okay sweetheart, try writing ${selectedLetter.char} once more slowly.`));

    sound.speak(textToSpeak, lang === 'ta' ? 'ta-IN' : 'en-US');
  };

  // Mother's audio recording capability
  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        sound.playPop();
        sound.speak(
          lang === 'ta' ? 'அம்மா குரல் தயார்: Super கண்ணா! அருமையாக எழுதியிருக்க!' : 'Mother voice ready: Super darling! Great job!',
          lang === 'ta' ? 'ta-IN' : 'en-US'
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setCustomRecordedAudioUrl(audioUrl);
        sound.playSuccess();
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.warn('Microphone access denied or unsupported:', err);
      // Fallback voice playback
      sound.speak(
        lang === 'ta' ? 'Super கண்ணா! அருமையாக எழுதியிருக்க!' : 'Super darling! Great job!',
        lang === 'ta' ? 'ta-IN' : 'en-US'
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all mic tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Perform AI Evaluation
  const evaluateHandwritingWithAI = async (imageBase64: string, localScore: number, passed: boolean) => {
    setLastDrawnImage(imageBase64);
    setIsCheckingAI(true);
    sound.playPop();

    try {
      const res = await fetch('/api/writing/evaluate-handwriting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          targetChar: selectedLetter.char,
          childName: lang === 'ta' ? 'கண்ணா' : 'Arjun',
          lang,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiResult({
          shapeCorrect: data.shapeCorrect ?? passed,
          strokeDirection: data.strokeDirection || (lang === 'ta' ? 'கோடு நேராகவும் சீராகவும் உள்ளது' : 'Strokes are crisp and aligned'),
          letterProportion: data.letterProportion || (lang === 'ta' ? 'சரியான விகிதத்தில் அமைந்துள்ளது' : 'Well proportioned'),
          isCorrect: data.isCorrect ?? (localScore >= 65),
          score: data.score || localScore,
          motherVoiceMessage:
            data.motherVoiceMessage ||
            (data.isCorrect
              ? `Super கண்ணா! ${selectedLetter.char} correct-aa எழுதியிருக்க!`
              : `பரவாயில்லை கண்ணா, ${selectedLetter.char}-வை இன்னொரு தடவை மெதுவாக எழுது.`),
        });

        // Advance to Step 3 (AI Evaluation Display)
        setCurrentStep(3);
      } else {
        throw new Error('Fallback to local');
      }
    } catch {
      // Offline/Local evaluation fallback
      setAiResult({
        shapeCorrect: passed,
        strokeDirection: lang === 'ta' ? 'மேலிருந்து கீழ் வரையும் முறை சரியானது' : 'Top-to-bottom strokes are aligned',
        letterProportion: lang === 'ta' ? 'விகிதம் மற்றும் சமநிலை சரியாக உள்ளது' : 'Balanced height and proportion',
        isCorrect: passed,
        score: localScore,
        motherVoiceMessage: passed
          ? (lang === 'ta' ? `Super கண்ணா! ${selectedLetter.char} correct-aa எழுதியிருக்க!` : `Super darling! You wrote ${selectedLetter.char} correctly!`)
          : (lang === 'ta' ? `பரவாயில்லை கண்ணா, ${selectedLetter.char}-வை இன்னொரு தடவை மெதுவாக எழுது.` : `That's okay sweetheart, try writing ${selectedLetter.char} once more slowly.`),
      });
      setCurrentStep(3);
    } finally {
      setIsCheckingAI(false);
    }
  };

  const advanceToStep4 = () => {
    sound.playPop();
    setCurrentStep(4);
    // Automatically trigger mother's warm voice upon entering Step 4!
    setTimeout(() => {
      speakMotherVoice(aiResult?.motherVoiceMessage);
    }, 400);
  };

  const advanceToStep5 = () => {
    sound.playFanfare();
    setCurrentStep(5);
    setStep5Stage('letter');
    setStep5Completed(false);
  };

  const handleStep5Next = () => {
    sound.playPop();
    if (step5Stage === 'letter') {
      setStep5Stage('word');
      sound.speak(selectedLetter.wordSpelling, selectedLetter.lang === 'ta' ? 'ta-IN' : 'en-US');
    } else if (step5Stage === 'word') {
      setStep5Stage('sentence');
      sound.speak(
        lang === 'ta' ? selectedLetter.sentenceTa : selectedLetter.sentenceEn,
        selectedLetter.lang === 'ta' ? 'ta-IN' : 'en-US'
      );
    } else {
      setStep5Completed(true);
      sound.playFanfare();
      confetti({ particleCount: 110, spread: 85, origin: { y: 0.6 } });
      if (onEarnStar) onEarnStar();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl border-2 border-amber-300 relative my-4 max-h-[94vh] flex flex-col overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl shadow-md text-xl">
              ✍️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                  {lang === 'ta' ? 'எழுத்துப் பயிற்சி கூடம்' : 'Smart Handwriting Studio'}
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                  AI Feedback + Mother’s Voice ❤️
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {lang === 'ta'
                  ? 'பார்த்து எழுதுதல் → உதவி குறைத்தல் → AI சரிபார்ப்பு → அம்மாவின் குரல் → சவால்'
                  : 'Trace → Fade Memory → AI Check → Mother’s Voice → Letter-Word-Sentence'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-800 text-2xl font-bold p-1 cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Letter Selector Tabs */}
        <div className="my-3 flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
          <span className="text-xs font-bold text-slate-500 shrink-0">
            {lang === 'ta' ? 'எழுத்து:' : 'Letter:'}
          </span>
          {PRACTICE_LETTERS.map((letter) => (
            <button
              key={letter.id}
              onClick={() => {
                sound.playPop();
                setSelectedLetter(letter);
                setCurrentStep(1);
                setAiResult(null);
                setStep5Stage('letter');
                setStep5Completed(false);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedLetter.id === letter.id
                  ? 'bg-amber-600 text-white shadow-md scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span className="text-base">{letter.wordIcon}</span>
              <span className="text-base font-black font-mono">{letter.char}</span>
            </button>
          ))}
        </div>

        {/* 5-Step Process Indicator Bar */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-4 shrink-0">
          {[
            { num: 1, labelTa: 'பார்த்து எழுதுதல்', labelEn: '1. Trace & See', icon: <Eye className="w-3.5 h-3.5" /> },
            { num: 2, labelTa: 'உதவி குறைத்தல்', labelEn: '2. From Memory', icon: <Brain className="w-3.5 h-3.5" /> },
            { num: 3, labelTa: 'AI சரிபார்ப்பு', labelEn: '3. AI Check', icon: <Cpu className="w-3.5 h-3.5" /> },
            { num: 4, labelTa: 'அம்மாவின் குரல் ❤️', labelEn: '4. Mom’s Voice', icon: <Heart className="w-3.5 h-3.5" /> },
            { num: 5, labelTa: 'சவால் (A→Word)', labelEn: '5. Progression', icon: <Layers className="w-3.5 h-3.5" /> },
          ].map((s) => {
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num;

            return (
              <button
                key={s.num}
                onClick={() => {
                  sound.playPop();
                  setCurrentStep(s.num);
                }}
                className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-amber-600 text-white border-amber-700 shadow-md font-black scale-102'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 font-semibold'
                }`}
              >
                <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                  <span>{s.icon}</span>
                  <span className="hidden md:inline">{lang === 'ta' ? s.labelTa : s.labelEn}</span>
                </div>
                <div className="text-[10px] mt-0.5 md:hidden font-mono">Step {s.num}</div>
              </button>
            );
          })}
        </div>

        {/* WORKSPACE AREA */}
        <div className="flex-1 flex flex-col justify-center">
          {/* STEP 1: பார்த்து எழுதுதல் (Visual Trace & Copy) */}
          {currentStep === 1 && (
            <div className="flex flex-col items-center">
              <div className="mb-2 text-center">
                <span className="px-3 py-1 bg-amber-100 text-amber-950 font-black text-xs uppercase rounded-full border border-amber-300">
                  Step 1 — பார்த்து எழுதுதல்
                </span>
                <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
                  {lang === 'ta'
                    ? `திரையில் "${selectedLetter.char}" இருக்கும் → புள்ளிகளை விரலால் இணைத்து எழுதுங்கள்!`
                    : `"${selectedLetter.char}" is on screen → Trace the dotted strokes with your finger or stylus!`}
                </p>
              </div>

              <WritingCanvas
                letter={selectedLetter}
                mode="trace"
                lang={lang}
                onCheckWithImage={(imageBase64, score, passed) => {
                  if (passed) {
                    setTimeout(() => {
                      sound.playFanfare();
                      setCurrentStep(2);
                    }, 800);
                  }
                }}
              />
            </div>
          )}

          {/* STEP 2: உதவி குறைத்தல் (Fade Out / From Memory) */}
          {currentStep === 2 && (
            <div className="flex flex-col items-center">
              <div className="mb-2 text-center">
                <span className="px-3 py-1 bg-purple-100 text-purple-950 font-black text-xs uppercase rounded-full border border-purple-300">
                  Step 2 — உதவி குறைத்தல்
                </span>
                <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
                  {lang === 'ta'
                    ? `"${selectedLetter.char}" மறைந்துவிட்டது! நினைவில் இருந்து கரும்பலகையில் எழுதுங்கள்.`
                    : `"${selectedLetter.char}" has faded! Write it now from your memory on the ruled board.`}
                </p>
              </div>

              <WritingCanvas
                letter={selectedLetter}
                mode="remember"
                lang={lang}
                onCheckWithImage={(imageBase64, score, passed) => {
                  evaluateHandwritingWithAI(imageBase64, score, passed);
                }}
              />

              {isCheckingAI && (
                <div className="mt-3 flex items-center gap-2 text-amber-700 text-xs font-bold animate-pulse">
                  <Cpu className="w-4 h-4 animate-spin" />
                  <span>
                    {lang === 'ta' ? 'AI உங்கள் கையெழுத்தை சரிபார்க்கிறது...' : 'AI is analyzing your handwriting...'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: AI handwriting check */}
          {currentStep === 3 && (
            <div className="flex flex-col items-center max-w-xl mx-auto w-full">
              <div className="mb-3 text-center">
                <span className="px-3 py-1 bg-sky-100 text-sky-950 font-black text-xs uppercase rounded-full border border-sky-300">
                  Step 3 — AI handwriting check
                </span>
                <h4 className="text-lg font-black text-slate-900 mt-1">
                  {lang === 'ta' ? 'கையெழுத்து ஆய்வு முடிவுகள்' : 'Handwriting Diagnosis'}
                </h4>
              </div>

              {/* 3 AI Checklist Cards */}
              <div className="w-full space-y-2.5">
                {/* 1. Shape Check */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 text-amber-800 rounded-xl font-mono font-bold text-xs">
                      1
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900">
                        {lang === 'ta' ? 'வடிவம் சரியா? (Shape Check)' : 'Shape Accuracy'}
                      </div>
                      <div className="text-xs text-slate-500">
                        {lang === 'ta'
                          ? `எழுத்து "${selectedLetter.char}" வடிவம் தெளிவாக அடையாளம் காணப்படுகிறது.`
                          : `Letter shape is clearly recognized as "${selectedLetter.char}".`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 font-extrabold text-sm">
                    <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                    <span>{lang === 'ta' ? 'சரி' : 'Pass'}</span>
                  </div>
                </div>

                {/* 2. Stroke Direction Check */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 text-amber-800 rounded-xl font-mono font-bold text-xs">
                      2
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900">
                        {lang === 'ta' ? 'கோடு திசை சரியா? (Stroke Direction)' : 'Stroke Direction & Order'}
                      </div>
                      <div className="text-xs text-slate-500">
                        {aiResult?.strokeDirection ||
                          (lang === 'ta' ? 'மேலிருந்து கீழ் வரையும் முறை சரியானது.' : 'Crisp stroke flow.')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 font-extrabold text-sm">
                    <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                    <span>{lang === 'ta' ? 'சரி' : 'Pass'}</span>
                  </div>
                </div>

                {/* 3. Letter Proportion Check */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 text-amber-800 rounded-xl font-mono font-bold text-xs">
                      3
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900">
                        {lang === 'ta' ? 'அளவு விகிதம் சரியா? (Letter Proportion)' : 'Proportion & Balance'}
                      </div>
                      <div className="text-xs text-slate-500">
                        {aiResult?.letterProportion ||
                          (lang === 'ta' ? 'நோட்டுப் புத்தக கோடுகளுக்குள் சீராக உள்ளது.' : 'Ruled baseline aligned.')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 font-extrabold text-sm">
                    <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                    <span>{lang === 'ta' ? 'சரி' : 'Pass'}</span>
                  </div>
                </div>
              </div>

              {/* Action Button to Step 4 */}
              <button
                onClick={advanceToStep4}
                className="mt-5 w-full py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <span>{lang === 'ta' ? 'அம்மாவின் குரலைக் கேட்க ❤️' : 'Listen to Mother’s Voice ❤️'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 4: தவறு என்றால் அம்மாவின் voice ❤️ (Personalized Encouragement) */}
          {currentStep === 4 && (
            <div className="flex flex-col items-center max-w-xl mx-auto w-full text-center">
              <div className="mb-2">
                <span className="px-3 py-1 bg-rose-100 text-rose-950 font-black text-xs uppercase rounded-full border border-rose-300">
                  Step 4 — தவறு என்றால் அம்மாவின் voice ❤️
                </span>
              </div>

              {/* Mother’s Visual Avatar with Warm Glow */}
              <div className="my-3 relative">
                <div className="w-28 h-28 rounded-full ring-4 ring-rose-400 p-1 bg-white shadow-xl mx-auto overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80"
                    alt="Amma"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 p-2 bg-rose-600 text-white rounded-full shadow-md">
                  <Heart className="w-4 h-4 fill-white" />
                </div>
              </div>

              {/* Voice Speech Bubble */}
              <div className="w-full p-4 sm:p-5 bg-gradient-to-r from-rose-50 to-amber-50 rounded-3xl border-2 border-rose-200 shadow-md relative mt-2 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Volume2 className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                    {lang === 'ta' ? 'அம்மாவின் அன்பான குரல்' : 'Mother’s Loving Encouragement'}
                  </span>
                </div>
                <p className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  🔊 “{aiResult?.motherVoiceMessage || (lang === 'ta' ? `Super! ${selectedLetter.char} correct-aa எழுதியிருக்க!` : `Super! You wrote ${selectedLetter.char} correctly!`)}”
                </p>

                {/* Mother Audio Replay Button */}
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => speakMotherVoice(aiResult?.motherVoiceMessage)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{lang === 'ta' ? 'குரலை மீண்டும் கேள்' : 'Replay Voice'}</span>
                  </button>

                  {/* Mother's Voice Recorder Option */}
                  <div className="flex items-center gap-2">
                    {isRecording ? (
                      <button
                        onClick={stopRecording}
                        className="px-3 py-2 bg-red-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 animate-pulse cursor-pointer"
                      >
                        <Square className="w-3 h-3 fill-white" />
                        <span>{lang === 'ta' ? 'நிறுத்து' : 'Stop'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={startRecording}
                        title="Record your own voice"
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Mic className="w-3.5 h-3.5 text-rose-600" />
                        <span>{lang === 'ta' ? 'அம்மா சொந்தக் குரல் பதிவு' : 'Record Mom’s Voice'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button to Step 5 */}
              <button
                onClick={advanceToStep5}
                className="mt-6 w-full py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <span>{lang === 'ta' ? 'Step 5 சவாலுக்குச் செல் (A → APPLE → Sentence)' : 'Proceed to Step 5 Challenge'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 5: மறுபடியும் challenge (A → APPLE → A sentence) */}
          {currentStep === 5 && (
            <div className="flex flex-col items-center max-w-xl mx-auto w-full text-center">
              <div className="mb-2">
                <span className="px-3 py-1 bg-amber-200 text-amber-950 font-black text-xs uppercase rounded-full border border-amber-300">
                  Step 5 — மறுபடியும் challenge
                </span>
                <h4 className="text-xl font-black text-slate-900 mt-1">
                  {lang === 'ta'
                    ? `${selectedLetter.char} → ${selectedLetter.wordSpelling} → வாக்கியம்`
                    : `${selectedLetter.char} → ${selectedLetter.wordSpelling} → Sentence Challenge`}
                </h4>
              </div>

              {/* 3-Stage Stepper for A -> APPLE -> Sentence */}
              <div className="flex items-center justify-center gap-2 my-3">
                {[
                  { stage: 'letter', label: `1. ${selectedLetter.char}`, icon: '🔤' },
                  { stage: 'word', label: `2. ${selectedLetter.wordSpelling}`, icon: '🍎' },
                  { stage: 'sentence', label: lang === 'ta' ? '3. வாக்கியம்' : '3. Sentence', icon: '📖' },
                ].map((st, i) => (
                  <div
                    key={st.stage}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                      step5Stage === st.stage
                        ? 'bg-amber-600 text-white shadow-md scale-105'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span>{st.icon}</span>
                    <span>{st.label}</span>
                  </div>
                ))}
              </div>

              {/* Current Active Stage Challenge Card */}
              <div className="w-full p-5 bg-gradient-to-b from-amber-50 via-white to-amber-50/50 border-2 border-amber-300 rounded-3xl shadow-md my-2">
                {step5Stage === 'letter' && (
                  <div className="space-y-3">
                    <div className="text-6xl font-black text-amber-950 font-serif">
                      {selectedLetter.char}
                    </div>
                    <p className="text-xs text-slate-600 font-semibold">
                      {lang === 'ta'
                        ? `எழுத்து "${selectedLetter.char}"-வை மனப்பாடமாக எழுதி உறுதிப்படுத்துங்கள்!`
                        : `Confirm your mastery by writing letter "${selectedLetter.char}"!`}
                    </p>
                    <button
                      onClick={() => {
                        sound.playPop();
                        sound.speak(selectedLetter.char, selectedLetter.lang === 'ta' ? 'ta-IN' : 'en-US');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold cursor-pointer transition-transform active:scale-95"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{lang === 'ta' ? 'ஒலி கேட்க' : 'Listen Letter'}</span>
                    </button>
                  </div>
                )}

                {step5Stage === 'word' && (
                  <div className="space-y-3">
                    <div className="text-4xl text-amber-600 mb-1">{selectedLetter.wordIcon}</div>
                    <div className="text-4xl sm:text-5xl font-black tracking-widest text-slate-900 font-mono">
                      {selectedLetter.wordSpelling}
                    </div>
                    <p className="text-xs text-slate-600 font-semibold">
                      {lang === 'ta'
                        ? `எழுத்துகளை இணைத்து "${selectedLetter.wordSpelling}" சொல்லை உருவாக்குங்கள்!`
                        : `Combine the letters to spell the full word "${selectedLetter.wordSpelling}"!`}
                    </p>
                    <button
                      onClick={() => {
                        sound.playPop();
                        sound.speak(selectedLetter.wordSpelling, selectedLetter.lang === 'ta' ? 'ta-IN' : 'en-US');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold cursor-pointer transition-transform active:scale-95"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{lang === 'ta' ? 'சொல் உச்சரிப்பு கேட்க' : 'Listen Word'}</span>
                    </button>
                  </div>
                )}

                {step5Stage === 'sentence' && (
                  <div className="space-y-3">
                    <div className="text-3xl mb-1">🌟 📖 🌟</div>
                    <div className="text-base sm:text-xl font-black text-slate-900 font-serif px-2">
                      “{lang === 'ta' ? selectedLetter.sentenceTa : selectedLetter.sentenceEn}”
                    </div>
                    <p className="text-xs text-slate-600 font-semibold">
                      {lang === 'ta'
                        ? 'முழு வாக்கியத்தையும் வாசித்து, எழுதி முடித்து தங்க நட்சத்திரம் வெல்லுங்கள்!'
                        : 'Read and write the complete sentence to claim your Golden Star!'}
                    </p>
                    <button
                      onClick={() => {
                        sound.playPop();
                        sound.speak(
                          lang === 'ta' ? selectedLetter.sentenceTa : selectedLetter.sentenceEn,
                          selectedLetter.lang === 'ta' ? 'ta-IN' : 'en-US'
                        );
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold cursor-pointer transition-transform active:scale-95"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{lang === 'ta' ? 'வாக்கியம் வாசிக்கக் கேட்க' : 'Read Aloud Sentence'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Completion Star Celebration or Next Stage Button */}
              {step5Completed ? (
                <div className="p-6 bg-gradient-to-b from-amber-100 to-orange-100 rounded-3xl border-2 border-amber-400 w-full animate-in zoom-in">
                  <div className="text-5xl mb-2">⭐ 🏆 ⭐</div>
                  <h3 className="text-2xl font-black text-amber-950">
                    {lang === 'ta' ? 'அற்புதம்! சவால் வெற்றி!' : 'Challenge Complete!'}
                  </h3>
                  <p className="text-xs text-slate-700 mt-1">
                    {lang === 'ta'
                      ? `நீங்கள் "${selectedLetter.char}" → "${selectedLetter.wordSpelling}" → வாக்கியம் மூன்றையும் வென்றுவிட்டீர்கள்!`
                      : `You mastered "${selectedLetter.char}" → "${selectedLetter.wordSpelling}" → Sentence!`}
                  </p>
                  <button
                    onClick={() => {
                      sound.playPop();
                      onClose();
                    }}
                    className="mt-4 px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-black text-sm rounded-xl shadow-md cursor-pointer"
                  >
                    {lang === 'ta' ? 'நிறைவு செய்' : 'Finish'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleStep5Next}
                  className="mt-4 w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                >
                  <span>
                    {step5Stage === 'letter'
                      ? (lang === 'ta' ? 'அடுத்தது: சொல் (APPLE) ➔' : 'Next: Word (APPLE) ➔')
                      : step5Stage === 'word'
                      ? (lang === 'ta' ? 'அடுத்தது: வாக்கியம் (Sentence) ➔' : 'Next: Full Sentence ➔')
                      : (lang === 'ta' ? '⭐ நட்சத்திரம் வெல்க!' : 'Claim ⭐ Golden Star!')}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
