export interface ZaiChangConfig {
  enabled: boolean;
  parentPhoto: string; // Base64 or preset URL
  parentName: string;
  childName: string;
  parentEmail: string;
  customWarningTamil: string;
  customWarningEnglish: string;
  voiceGender: 'female' | 'male';
  strictness: 'gentle' | 'balanced' | 'firm';
}

export type ChildStatus = 'focused' | 'left_seat' | 'phone_detected' | 'distracted';

export interface DistractionEvent {
  id: string;
  timestamp: string;
  timeString: string;
  type: 'phone' | 'left_seat' | 'distracted';
  warningMessage: string;
  resolved: boolean;
}

export interface SessionReportData {
  parentEmail: string;
  parentName: string;
  childName: string;
  standard: number;
  durationMinutes: number;
  focusScore: number;
  totalDistractions: number;
  events: DistractionEvent[];
  aiSummary?: string;
}
