/**
 * usePomodoroTimer.ts — Máquina de estados do ciclo Pomodoro
 *
 * Estados: idle → focusing → (short_break | long_break) → focusing → …
 *
 * Integra com useFlipDetector: o cronômetro só decrementa enquanto
 * isFaceDown === true. Se o celular for levantado ele pausa automaticamente.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { POMODORO_DEFAULTS } from '@/constants/pomodoro';

export type PomodoroPhase = 'idle' | 'focusing' | 'short_break' | 'long_break';

export interface PomodoroTimerOptions {
  focusMinutes?: number;
  shortBreakMinutes?: number;
  longBreakMinutes?: number;
  cyclesBeforeLongBreak?: number;
  requireFlipToRun?: boolean;
}

export interface PomodoroTimerResult {
  phase: PomodoroPhase;
  remainingMs: number;
  totalMs: number;
  cycle: number;
  isRunning: boolean;
  isPaused: boolean;
  progress: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skipPhase: () => void;
  setFlipState: (isFaceDown: boolean) => void;
}
export function usePomodoroTimer(
  options: PomodoroTimerOptions = {}
): PomodoroTimerResult {
  const {
    focusMinutes = POMODORO_DEFAULTS.focusMinutes,
    shortBreakMinutes = POMODORO_DEFAULTS.shortBreakMinutes,
    longBreakMinutes = POMODORO_DEFAULTS.longBreakMinutes,
    cyclesBeforeLongBreak = POMODORO_DEFAULTS.cyclesBeforeLongBreak,
    requireFlipToRun = true,
  } = options;

  const [phase, setPhase] = useState<PomodoroPhase>('idle');
  const [remainingMs, setRemainingMs] = useState(focusMinutes * 60 * 1000);
  const [cycle, setCycle] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFaceDown, setIsFaceDown] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef = useRef<PomodoroPhase>('idle');
  const remainingRef = useRef(focusMinutes * 60 * 1000);
  const isFaceDownRef = useRef(false);

  phaseRef.current = phase;
  remainingRef.current = remainingMs;
  isFaceDownRef.current = isFaceDown;

  const getPhaseDuration = useCallback(
    (p: PomodoroPhase): number => {
      switch (p) {
        case 'focusing': return focusMinutes * 60 * 1000;
        case 'short_break': return shortBreakMinutes * 60 * 1000;
        case 'long_break': return longBreakMinutes * 60 * 1000;
        default: return focusMinutes * 60 * 1000;
      }
    },
    [focusMinutes, shortBreakMinutes, longBreakMinutes]
  );

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
// --- Avanço automático entre fases ---
  const advanceToNextPhase = useCallback(() => {
    const currentPhase = phaseRef.current;
    if (currentPhase === 'focusing') {
      const newCycle = cycle + 1;
      setCycle(newCycle);
      const nextPhase: PomodoroPhase =
        newCycle >= cyclesBeforeLongBreak ? 'long_break' : 'short_break';
      const duration = nextPhase === 'long_break'
        ? longBreakMinutes * 60 * 1000
        : shortBreakMinutes * 60 * 1000;
      setPhase(nextPhase);
      setRemainingMs(duration);
      remainingRef.current = duration;
    } else {
      setPhase('focusing');
      const duration = focusMinutes * 60 * 1000;
      setRemainingMs(duration);
      remainingRef.current = duration;
    }
    setIsRunning(true);
  }, [cycle, cyclesBeforeLongBreak, focusMinutes, shortBreakMinutes, longBreakMinutes]);

  // --- Tick do timer (1s) ---
  useEffect(() => {
    if (!isRunning) return;
    const tick = () => {
      if (requireFlipToRun && !isFaceDownRef.current) return;
      const newRemaining = remainingRef.current - 1000;
      if (newRemaining <= 0) {
        clearTimer();
        setRemainingMs(0);
        remainingRef.current = 0;
        setIsRunning(false);
        advanceToNextPhase();
      } else {
        setRemainingMs(newRemaining);
        remainingRef.current = newRemaining;
      }
    };
    intervalRef.current = setInterval(tick, 1000);
    return () => { clearTimer(); };
  }, [isRunning, requireFlipToRun, advanceToNextPhase, clearTimer]);

  // --- Actions ---
  const start = useCallback(() => {
    if (phase !== 'idle') return;
    setPhase('focusing');
    const duration = focusMinutes * 60 * 1000;
    setRemainingMs(duration);
    remainingRef.current = duration;
    setCycle(0);
    setIsRunning(true);
  }, [phase, focusMinutes]);

  const pause = useCallback(() => { setIsRunning(false); }, []);
  const resume = useCallback(() => { if (phase !== 'idle') setIsRunning(true); }, [phase]);

  const reset = useCallback(() => {
    clearTimer();
    setPhase('idle');
    const duration = focusMinutes * 60 * 1000;
    setRemainingMs(duration);
    remainingRef.current = duration;
    setCycle(0);
    setIsRunning(false);
  }, [focusMinutes, clearTimer]);

  const skipPhase = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    advanceToNextPhase();
  }, [clearTimer, advanceToNextPhase]);

  const setFlipState = useCallback((faceDown: boolean) => {
    setIsFaceDown(faceDown);
  }, []);

  const totalMs = getPhaseDuration(phase);
  const progress = totalMs > 0 ? 1 - remainingMs / totalMs : 0;
  const isPaused = !isRunning && phase !== 'idle';

  return {
    phase, remainingMs, totalMs, cycle, isRunning, isPaused, progress,
    start, pause, resume, reset, skipPhase, setFlipState,
  };
}