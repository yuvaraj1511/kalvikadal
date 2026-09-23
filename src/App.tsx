/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, ClassStandard } from './types';
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { ClassMatrix } from './components/ClassMatrix';
import { ParentTeacherGuide } from './components/ParentTeacherGuide';
import { ChildPortal } from './components/ChildPortal';
import { DailyTimer } from './components/DailyTimer';
import { BadgeModal } from './components/BadgeModal';
import { Footer } from './components/Footer';
import { ZaiChangOverlay } from './components/ZaiChang/ZaiChangOverlay';
import { ZaiChangModal } from './components/ZaiChang/ZaiChangModal';
import { FocusReportModal } from './components/ZaiChang/FocusReportModal';
import { ZaiChangConfig, SessionReportData } from './components/ZaiChang/types';
import { WritingStudio } from './components/WritingPractice/WritingStudio';
import { sound } from './utils/audio';

export default function App() {
  const [selectedClass, setSelectedClass] = useState<ClassStandard | null>(null);
  const [lang, setLang] = useState<Language>('ta');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [stars, setStars] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kalvi_stars');
      return saved ? parseInt(saved, 10) : 3;
    }
    return 3;
  });
  const [minutesToday, setMinutesToday] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kalvi_minutes');
      return saved ? parseInt(saved, 10) : 2;
    }
    return 2;
  });
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState<boolean>(false);

  // Zai Chang Virtual Parent state
  const [zaiChangConfig, setZaiChangConfig] = useState<ZaiChangConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kalvi_zaichang');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return {
      enabled: true,
      parentPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
      parentName: 'ஆசிரியர் (Teacher)',
      childName: 'மாணவர் (Student)',
      parentEmail: 'yuvarajs.1511@gmail.com',
      customWarningTamil: 'கண்ணா, போனை கீழே வை! பாடத்தை முடித்துவிட்டு விளையாடலாம்!',
      customWarningEnglish: 'Put down the phone! Finish your 10-minute lesson first!',
      voiceGender: 'female',
      strictness: 'balanced',
    };
  });

  const [isZaiChangSettingsOpen, setIsZaiChangSettingsOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [currentReportData, setCurrentReportData] = useState<SessionReportData | null>(null);
  const [isWritingStudioOpen, setIsWritingStudioOpen] = useState<boolean>(false);

  // Sync stars, minutes and Zai Chang config to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kalvi_stars', stars.toString());
    }
  }, [stars]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kalvi_minutes', minutesToday.toString());
    }
  }, [minutesToday]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kalvi_zaichang', JSON.stringify(zaiChangConfig));
    }
  }, [zaiChangConfig]);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ta' ? 'en' : 'ta'));
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sound.enabled = nextState;
  };

  const handleEarnStar = () => {
    setStars((prev) => prev + 1);
  };

  const handleTimerComplete = () => {
    setStars((prev) => prev + 5);
    setMinutesToday(10);
  };

  const handleIncrementMinute = () => {
    setMinutesToday((prev) => Math.min(60, prev + 1));
  };

  const handleSelectClass = (clsId: ClassStandard) => {
    setSelectedClass(clsId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenReport = (report: SessionReportData) => {
    setCurrentReportData(report);
    setIsReportModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/20 text-slate-900 font-sans selection:bg-amber-200">
      {/* 3-Zone Sticky Header */}
      <Header
        lang={lang}
        onToggleLang={handleToggleLang}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        stars={stars}
        onOpenBadges={() => setIsBadgeModalOpen(true)}
        onSelectClass={() => setSelectedClass(null)}
        onOpenZaiChang={() => setIsZaiChangSettingsOpen(true)}
        onOpenWritingStudio={() => setIsWritingStudioOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedClass ? (
          <ChildPortal
            classId={selectedClass}
            lang={lang}
            onBack={() => {
              setSelectedClass(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectClass={handleSelectClass}
            stars={stars}
            onEarnStar={handleEarnStar}
            onOpenBadges={() => setIsBadgeModalOpen(true)}
            onOpenWritingStudio={() => setIsWritingStudioOpen(true)}
          />
        ) : (
          <>
            {/* 1. Landing Page with The Hook, Simple CTAs, Teacher & Writing spotlights */}
            <LandingHero
              lang={lang}
              onSelectClass={handleSelectClass}
              minutesToday={minutesToday}
              onOpenZaiChang={() => setIsZaiChangSettingsOpen(true)}
              onOpenWritingStudio={() => setIsWritingStudioOpen(true)}
            />

            {/* 2. Class Selection Matrix (Visual Grid) */}
            <ClassMatrix
              lang={lang}
              onSelectClass={handleSelectClass}
            />

            {/* Parent & Teacher Guide & TN Samacheer Curriculum */}
            <ParentTeacherGuide lang={lang} />
          </>
        )}
      </main>

      {/* Interactive Writing Practice Studio (See -> Trace -> Copy -> Remember -> Game) */}
      <WritingStudio
        lang={lang}
        isOpen={isWritingStudioOpen}
        onClose={() => setIsWritingStudioOpen(false)}
        onEarnStar={handleEarnStar}
      />

      {/* Virtual Teacher Persistent Overlay */}
      <ZaiChangOverlay
        lang={lang}
        config={zaiChangConfig}
        currentClass={selectedClass}
        onOpenSettings={() => setIsZaiChangSettingsOpen(true)}
        onOpenReport={handleOpenReport}
      />

      {/* Zai Chang Settings & Photo Upload Modal */}
      <ZaiChangModal
        lang={lang}
        isOpen={isZaiChangSettingsOpen}
        onClose={() => setIsZaiChangSettingsOpen(false)}
        config={zaiChangConfig}
        onSaveConfig={(newConfig) => setZaiChangConfig(newConfig)}
      />

      {/* End-of-Session Focus Report & Email Modal */}
      {currentReportData && (
        <FocusReportModal
          lang={lang}
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          reportData={currentReportData}
        />
      )}

      {/* Daily 10-Minute Micro-Learning Tracker */}
      <DailyTimer
        lang={lang}
        onTimerComplete={handleTimerComplete}
        onIncrementMinute={handleIncrementMinute}
      />

      {/* Badges / Rewards Showcase Modal */}
      <BadgeModal
        lang={lang}
        stars={stars}
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
      />

      {/* Footer */}
      <Footer
        lang={lang}
        onSelectClass={handleSelectClass}
      />
    </div>
  );
}
