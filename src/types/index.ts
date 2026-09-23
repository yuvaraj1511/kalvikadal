export type Language = 'ta' | 'en';

export type ClassStandard = 1 | 2 | 3 | 4 | 5;

export interface ClassMetadata {
  id: ClassStandard;
  titleTa: string;
  titleEn: string;
  themeNameTa: string;
  themeNameEn: string;
  icon: string;
  heroImage: string;
  accentColor: string;
  gradientBg: string;
  lightBg: string;
  borderColor: string;
  pillBorder: string;
  summaryTa: string;
  summaryEn: string;
  focusPointsTa: string[];
  focusPointsEn: string[];
  samacheerTopics: {
    tamil: string;
    english: string;
    math: string;
    evsScience: string;
  };
  sampleActivities: {
    id: string;
    titleTa: string;
    titleEn: string;
    type: string;
    minutes: number;
  }[];
}

export interface UserStats {
  stars: number;
  completedLessons: string[];
  minutesToday: number;
  badges: string[];
}
