/**
 * themes.ts — #249c44 Green accent
 */
export interface ThemeColors { background: string; surface: string; surfaceAlt: string; accent: string; accentSecondary: string; text: string; textMuted: string; sage: string; sageSoft: string; successBg: string; successText: string; terracottaSoft: string; tagBg: string; accentSoft: string; onAccent: string; track: string; border: string; overlay: string; shadow: string; gradientPrimary: [string, string]; gradientCard: [string, string]; priorityHigh: string; priorityMedium: string; priorityLow: string; brandTerracotta: string; brandSage: string; }
export interface Theme { colors: ThemeColors; isDark: boolean; fontDisplay: string; fontBody: string; }

export const lightTheme: Theme = {
  isDark: false, fontDisplay: 'Sora_400Regular', fontBody: 'Inter_400Regular',
  colors: { background: '#F8FAFC', surface: '#FFFFFF', surfaceAlt: '#F1F5F9', accent: '#249c44', accentSecondary: '#1d8036', text: '#0F172A', textMuted: '#64748B', sage: '#10B981', sageSoft: '#E8F5E9', successBg: '#E8F5E9', successText: '#059669', terracottaSoft: '#EDE9FE', tagBg: '#F1F5F9', accentSoft: 'rgba(36,156,68,0.10)', onAccent: '#FFFFFF', track: '#E2E8F0', border: '#E2E8F0', overlay: 'rgba(15,23,42,0.50)', shadow: 'rgba(36,156,68,0.12)', gradientPrimary: ['#249c44', '#1d8036'] as [string, string], gradientCard: ['#FFFFFF', '#F8F9FB'] as [string, string], priorityHigh: '#EF4444', priorityMedium: '#F59E0B', priorityLow: '#249c44', brandTerracotta: '#BD5328', brandSage: '#71977A', },
};

export const darkTheme: Theme = {
  isDark: true, fontDisplay: 'Sora_400Regular', fontBody: 'Inter_400Regular',
  colors: { background: '#080A0F', surface: '#131822', surfaceAlt: '#0B0F17', accent: '#249c44', accentSecondary: '#1d8036', text: '#FFFFFF', textMuted: '#94A3B8', sage: '#34D399', sageSoft: '#1E3A5F', successBg: '#1E3A5F', successText: '#249c44', terracottaSoft: '#2E1065', tagBg: 'rgba(255,255,255,0.05)', accentSoft: 'rgba(36,156,68,0.15)', onAccent: '#FFFFFF', track: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.08)', overlay: 'rgba(0,0,0,0.70)', shadow: 'rgba(0,0,0,0.40)', gradientPrimary: ['#249c44', '#1d8036'] as [string, string], gradientCard: ['rgba(19,24,34,0.95)', 'rgba(11,15,23,0.95)'] as [string, string], priorityHigh: '#FF4D4D', priorityMedium: '#F59E0B', priorityLow: '#249c44', brandTerracotta: '#BD5328', brandSage: '#71977A', },
};