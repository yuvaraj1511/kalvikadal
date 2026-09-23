import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Volume2, ShieldAlert, Sparkles, User, Settings, FileBarChart2, PhoneOff, LogOut, CheckCircle } from 'lucide-react';
import { Language, ClassStandard } from '../../types';
import { ZaiChangConfig, ChildStatus, DistractionEvent, SessionReportData } from './types';
import { sound } from '../../utils/audio';

interface ZaiChangOverlayProps {
  lang: Language;
  config: ZaiChangConfig;
  currentClass: ClassStandard | null;
  onOpenSettings: () => void;
  onOpenReport: (data: SessionReportData) => void;
}

export const ZaiChangOverlay: React.FC<ZaiChangOverlayProps> = ({
  lang,
  config,
  currentClass,
  onOpenSettings,
  onOpenReport,
}) => {
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [showCameraFeed, setShowCameraFeed] = useState<boolean>(false);
  const [childStatus, setChildStatus] = useState<ChildStatus>('focused');
  const [speechBubbleText, setSpeechBubbleText] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [events, setEvents] = useState<DistractionEvent[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // If Zai Chang is disabled, do not render overlay
  if (!config.enabled) {
    return null;
  }

  // Trigger custom voice warning and update virtual parent state
  const triggerVoiceWarning = (type: 'phone' | 'left_seat', customMsg?: string) => {
    sound.playWrong();
    setIsSpeaking(true);

    let defaultMsg = '';
    if (type === 'phone') {
      defaultMsg =
        lang === 'ta'
          ? `${config.childName}, போனை கீழே வை! பாடத்தை முடித்துவிட்டு விளையாடலாம்!`
          : `Put down the phone, ${config.childName}! Finish your lesson first!`;
    } else {
      defaultMsg =
        lang === 'ta'
          ? `${config.childName}, எங்கே செல்கிறாய்? உடனே உன் இருக்கைக்குத் திரும்பு!`
          : `Where are you going, ${config.childName}? Get back to your study desk right now!`;
    }

    const warningText = customMsg || (lang === 'ta' ? config.customWarningTamil || defaultMsg : config.customWarningEnglish || defaultMsg);

    setSpeechBubbleText(warningText);
    setChildStatus(type === 'phone' ? 'phone_detected' : 'left_seat');

    // Add to session log
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const newEvent: DistractionEvent = {
      id: `evt_${Date.now()}`,
      timestamp: now.toISOString(),
      timeString,
      type,
      warningMessage: warningText,
      resolved: false,
    };
    setEvents((prev) => [newEvent, ...prev]);

    // Speak using Web Speech API
    sound.speak(warningText, lang === 'ta' ? 'ta-IN' : 'en-US');

    // Auto resolve speech bubble after 5 seconds
    setTimeout(() => {
      setIsSpeaking(false);
      setSpeechBubbleText('');
      setChildStatus('focused');
    }, 5500);
  };

  // Start webcam
  const startCamera = async () => {
    try {
      sound.playPop();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setShowCameraFeed(true);
    } catch {
      // If camera access is denied or unavailable, inform user
      setSpeechBubbleText(
        lang === 'ta'
          ? 'கேமரா அனுமதி கிடைக்கவில்லை. கீழேயுள்ள சோதனை பொத்தான்கள் மூலம் சோதிக்கலாம்!'
          : 'Camera access denied or unavailable. Use simulation buttons below!'
      );
      setTimeout(() => setSpeechBubbleText(''), 4000);
    }
  };

  const stopCamera = () => {
    sound.playPop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setShowCameraFeed(false);
  };

  // Capture frame from video and analyze with server-side Gemini API
  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || !cameraActive) return;

    try {
      setIsAnalyzing(true);
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.7);

      const res = await fetch('/api/zaichang/analyze-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          parentName: config.parentName,
          childName: config.childName,
          lang,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === 'phone_detected') {
          triggerVoiceWarning('phone', data.warningMessage);
        } else if (data.status === 'left_seat') {
          triggerVoiceWarning('left_seat', data.warningMessage);
        } else {
          setChildStatus('focused');
        }
      }
    } catch {
      // Fail silently
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinishSession = () => {
    sound.playFanfare();
    stopCamera();

    // Calculate score
    const totalDistractions = events.length;
    // Base 100%, subtract 5% per distraction, min 50%
    const focusScore = Math.max(50, 100 - totalDistractions * 6);

    const report: SessionReportData = {
      parentEmail: config.parentEmail,
      parentName: config.parentName,
      childName: config.childName,
      standard: currentClass || 1,
      durationMinutes: 10,
      focusScore,
      totalDistractions,
      events,
    };

    onOpenReport(report);
  };

  return (
    <>
      {/* Hidden canvas for capturing video frames */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Floating Virtual Parent Widget */}
      <div className="fixed top-18 right-2 sm:right-4 z-40 flex flex-col items-end">
        {/* Parent Speech Warning Bubble */}
        {speechBubbleText && (
          <div className="mb-2 max-w-xs bg-rose-900 text-white p-3 rounded-2xl shadow-2xl border-2 border-rose-400 text-xs sm:text-sm font-bold relative animate-bounce">
            <div className="flex items-center gap-1.5 text-amber-300 text-[10px] uppercase font-black mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{config.parentName || 'Parent'} Says:</span>
            </div>
            <p className="leading-snug">{speechBubbleText}</p>
            {/* Pointer arrow */}
            <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-rose-900" />
          </div>
        )}

        {/* Digital Parent Avatar Container */}
        {isMinimized ? (
          <button
            onClick={() => {
              sound.playPop();
              setIsMinimized(false);
            }}
            className="p-1.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border-2 border-amber-400 flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Expand Teacher Widget"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-emerald-400">
              {config.parentPhoto ? (
                <img src={config.parentPhoto} alt="Teacher" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-amber-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-amber-700" />
                </div>
              )}
            </div>
            <span className="text-[10px] font-black text-amber-950 pr-1">👩‍🏫</span>
          </button>
        ) : (
          <div className="bg-white/95 backdrop-blur-md p-2 sm:p-2.5 rounded-3xl shadow-xl border-2 border-amber-300 flex items-center gap-2.5 relative">
            <button
              onClick={() => {
                sound.playPop();
                setIsMinimized(true);
              }}
              title="Minimize"
              className="absolute -top-2 -left-2 w-5 h-5 bg-slate-200 hover:bg-slate-300 rounded-full text-[10px] font-bold text-slate-700 flex items-center justify-center border border-slate-300 cursor-pointer shadow-xs"
            >
              −
            </button>
            {/* Avatar with Status Ring */}
            <div className="relative">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                childStatus === 'focused'
                  ? 'border-emerald-500 shadow-md ring-2 ring-emerald-300/60'
                  : 'border-rose-500 shadow-lg ring-4 ring-rose-400 animate-pulse'
              }`}
            >
              {config.parentPhoto ? (
                <img
                  src={config.parentPhoto}
                  alt="Virtual Parent"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-amber-100 flex items-center justify-center">
                  <User className="w-8 h-8 text-amber-700" />
                </div>
              )}
            </div>

            {/* Status Indicator Dot */}
            <div
              className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white ${
                childStatus === 'focused' ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              title={childStatus === 'focused' ? 'Focused' : 'Attention Alert!'}
            >
              {childStatus === 'focused' ? '✓' : '!'}
            </div>
          </div>

          {/* Info & Controls */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-900 truncate max-w-[100px]">
                {config.parentName || (lang === 'ta' ? 'அம்மா' : 'Parent')}
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.2 rounded-md">
                {lang === 'ta' ? 'ஆசிரியர்' : 'Teacher'}
              </span>
            </div>

            <div className="text-[11px] font-medium mt-0.5 flex items-center gap-1">
              {childStatus === 'focused' ? (
                <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                  <CheckCircle className="w-3 h-3" />
                  {lang === 'ta' ? 'கவனமாக உள்ளார்' : 'Focused'}
                </span>
              ) : childStatus === 'phone_detected' ? (
                <span className="text-rose-700 font-bold flex items-center gap-0.5">
                  <PhoneOff className="w-3 h-3" />
                  {lang === 'ta' ? 'போன் கண்டறியப்பட்டது!' : 'Phone Detected!'}
                </span>
              ) : (
                <span className="text-rose-700 font-bold flex items-center gap-0.5">
                  <LogOut className="w-3 h-3" />
                  {lang === 'ta' ? 'இருக்கையில் இல்லை!' : 'Left Seat!'}
                </span>
              )}
            </div>

            {/* Quick Actions Row */}
            <div className="flex items-center gap-1.5 mt-1.5">
              {cameraActive ? (
                <button
                  onClick={stopCamera}
                  title={lang === 'ta' ? 'கேமராவை நிறுத்து' : 'Stop Camera'}
                  className="p-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer"
                >
                  <CameraOff className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={startCamera}
                  title={lang === 'ta' ? 'கேமரா மூலம் கண்காணிக்க' : 'Start Camera AI'}
                  className="p-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer flex items-center gap-0.5 text-[10px] font-bold"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{lang === 'ta' ? 'கேமரா' : 'Cam'}</span>
                </button>
              )}

              {/* Settings */}
              <button
                onClick={() => {
                  sound.playPop();
                  onOpenSettings();
                }}
                title={lang === 'ta' ? 'ஆசிரியர் அமைப்புகள்' : 'Configure Teacher'}
                className="p-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>

              {/* End & Report */}
              <button
                onClick={handleFinishSession}
                title={lang === 'ta' ? 'அறிக்கையை காண்க & மின்னஞ்சல் அனுப்புக' : 'Finish & Get Focus Report'}
                className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold shadow-xs cursor-pointer flex items-center gap-1"
              >
                <FileBarChart2 className="w-3 h-3" />
                <span>{lang === 'ta' ? 'அறிக்கை' : 'Report'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Live Camera Feed Preview (Collapsible) */}
        {cameraActive && (
          <div className="mt-2 bg-white rounded-2xl p-2 shadow-lg border border-amber-200 w-44">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 mb-1 px-1">
              <span>{lang === 'ta' ? 'நேரலை AI கேமரா' : 'Live Child Cam'}</span>
              <button
                onClick={captureAndAnalyze}
                disabled={isAnalyzing}
                className="text-amber-700 hover:text-amber-900 cursor-pointer"
              >
                {isAnalyzing ? '...' : (lang === 'ta' ? 'ஆய்வு செய்' : 'Scan')}
              </button>
            </div>
            <div className="relative rounded-xl overflow-hidden aspect-video bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>AI ON</span>
              </div>
            </div>
          </div>
        )}

        {/* Immediate Interactive Simulation Triggers (for Testing) */}
        <div className="mt-2 flex items-center gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-xl border border-slate-200 shadow-sm text-[10px]">
          <span className="text-slate-400 font-semibold px-1">{lang === 'ta' ? 'சோதனை:' : 'Test:'}</span>
          <button
            onClick={() => triggerVoiceWarning('phone')}
            className="px-2 py-0.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold cursor-pointer transition-colors"
          >
            📱 {lang === 'ta' ? 'போன் விழிப்பு' : 'Phone'}
          </button>
          <button
            onClick={() => triggerVoiceWarning('left_seat')}
            className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold cursor-pointer transition-colors"
          >
            🏃 {lang === 'ta' ? 'இருக்கை விலகல்' : 'Left Seat'}
          </button>
        </div>
      </div>
    </>
  );
};
