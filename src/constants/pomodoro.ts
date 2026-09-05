/** Valores padrão do Pomodoro */
export const POMODORO_DEFAULTS = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  cyclesBeforeLongBreak: 4,
} as const;

/** Limiares do sensor de flip (valores em g) */
export const FLIP_SENSOR = {
  /** Intervalo de leitura do acelerômetro (ms) */
  updateInterval: 200,
  /** z ≤ -0.72 ⇒ tela para baixo */
  faceDownThreshold: -0.72,
  /** z ≥ 0.72 ⇒ tela para cima */
  faceUpThreshold: 0.72,
  /** |x|,|y| ≤ 0.55 ⇒ apoiado em superfície plana */
  flatnessThreshold: 0.55,
  /** Leituras consecutivas para confirmar mudança de estado */
  stabilitySamples: 3,
} as const;