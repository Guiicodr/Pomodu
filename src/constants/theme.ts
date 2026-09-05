export const COLORS = {
  /** Fundo escuro principal */
  background: '#0a0a0f',
  /** Superfícies (cards, modais) */
  surface: '#1a1a2e',
  /** Bordas e separadores */
  border: '#2a2a3e',
  /** Texto primário */
  text: '#e8e8f0',
  /** Texto secundário / muted */
  textSecondary: '#8888a0',
  /** Verde Pomodoro — foco ativo */
  accent: '#22c55e',
  /** Laranja — descanso */
  breakAccent: '#f59e0b',
  /** Vermelho — alerta */
  danger: '#ef4444',
  /** Azul — informação / métricas */
  info: '#3b82f6',
  /** Transparências úteis */
  overlay: 'rgba(10, 10, 15, 0.75)',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FONT_SIZES = {
  caption: 12,
  body: 14,
  subtitle: 16,
  title: 20,
  heading: 28,
  hero: 48,
} as const;

export const RADIUS = {
  sm: 6,
  md: 12,
  lg: 20,
  full: 9999,
} as const;