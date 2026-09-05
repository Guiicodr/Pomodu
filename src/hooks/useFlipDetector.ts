/**
 * useFlipDetector — detecta quando o celular está de bruços (tela para baixo)
 * apoiado numa superfície plana, condição para o timer do Pomodu avançar.
 *
 * O acelerômetro do expo-sensors retorna valores em "g" (1 g ≈ 9,81 m/s²):
 *   - Tela para cima  → z ≈ +1
 *   - Tela para baixo → z ≈ -1  ⬅ condição de foco
 *   - Aparelho na vertical/na mão → z ≈ 0 (x ou y ≈ ±1)
 *
 * Histerese:
 *   - Exige N leituras consecutivas (stabilitySamples) para trocar de estado
 *   - Evita flicker por ruído do sensor.
 *
 * Callbacks:
 *   - onLift: dispara ao SAIR de face-down (usuário levantou/mexeu o celular)
 *   - onFaceDown: dispara ao ENTRAR em face-down
 */

import { useEffect, useRef, useState } from 'react';
import { Accelerometer } from 'expo-sensors';

/** Estados físicos do aparelho conforme orientação */
export type PhoneOrientation = 'face-down' | 'face-up' | 'moving';

/** Leitura bruta do acelerômetro (x, y, z em g) */
interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface FlipDetectorOptions {
  /** Intervalo entre leituras do sensor, em ms. Padrão: 200 */
  updateInterval?: number;
  /** z (g) igual/abaixo disso ⇒ tela para baixo. Padrão: -0.72 */
  faceDownThreshold?: number;
  /** z (g) igual/acima disso ⇒ tela para cima. Padrão: 0.72 */
  faceUpThreshold?: number;
  /** |x| e |y| (g) no máximo isso para contar como apoiado numa superfície. Padrão: 0.55 */
  flatnessThreshold?: number;
  /** Leituras consecutivas para confirmar troca de estado (anti-flicker). Padrão: 3 */
  stabilitySamples?: number;
  /** Disparado ao SAIR de face-down (usuário levantou/mexeu no celular) */
  onLift?: () => void;
  /** Disparado ao ENTRAR em face-down */
  onFaceDown?: () => void;
}

export interface FlipDetectorResult {
  orientation: PhoneOrientation;
  /** true => o cronometro do Pomodoro pode avancar */
  isFaceDown: boolean;
  /** true ⇒ deitado numa superfície (tela para baixo ou para cima) */
  isFlat: boolean;
}

const DEFAULTS = {
  updateInterval: 200,
  faceDownThreshold: -0.72,
  faceUpThreshold: 0.72,
  flatnessThreshold: 0.55,
  stabilitySamples: 3,
} as const;

const INITIAL_RESULT: FlipDetectorResult = {
  orientation: 'moving',
  isFaceDown: false,
  isFlat: false,
};

export function useFlipDetector(options: FlipDetectorOptions = {}): FlipDetectorResult {
  const {
    updateInterval = DEFAULTS.updateInterval,
    faceDownThreshold = DEFAULTS.faceDownThreshold,
    faceUpThreshold = DEFAULTS.faceUpThreshold,
    flatnessThreshold = DEFAULTS.flatnessThreshold,
    stabilitySamples = DEFAULTS.stabilitySamples,
    onLift,
    onFaceDown,
  } = options;

  const [result, setResult] = useState<FlipDetectorResult>(INITIAL_RESULT);

  // Estado "bruto" entre leituras — publica no React só após estabilizar
  const orientationRef = useRef<PhoneOrientation>('moving');
  const candidateRef = useRef<PhoneOrientation>('moving');
  const streakRef = useRef(0);

  // Callbacks em refs ⇒ a subscription do sensor NÃO é recriada a cada render
  const onLiftRef = useRef(onLift);
  const onFaceDownRef = useRef(onFaceDown);
  onLiftRef.current = onLift;
  onFaceDownRef.current = onFaceDown;

  useEffect(() => {
    let mounted = true;

    /**
     * Classifica uma leitura do acelerômetro em um dos três estados.
     * A condição "isResting" garante que só consideramos face-down/up
     * quando o aparelho está deitado numa superfície plana
     * (não vale contra o peito / inclinado na mão).
     */
    const classify = ({ x, y, z }: Vec3): PhoneOrientation => {
      const isResting =
        Math.abs(x) <= flatnessThreshold && Math.abs(y) <= flatnessThreshold;

      if (z <= faceDownThreshold && isResting) return 'face-down';
      if (z >= faceUpThreshold && isResting) return 'face-up';
      return 'moving';
    };

    const subscription = Accelerometer.addListener((measurement: Vec3) => {
      if (!mounted) return;

      const measured = classify(measurement);

      // Anti-flicker: exige N leituras consecutivas iguais para trocar de estado
      if (measured === candidateRef.current) {
        streakRef.current += 1;
      } else {
        candidateRef.current = measured;
        streakRef.current = 1;
      }

      if (
        streakRef.current >= stabilitySamples &&
        candidateRef.current !== orientationRef.current
      ) {
        const previous = orientationRef.current;
        orientationRef.current = candidateRef.current;

        setResult({
          orientation: orientationRef.current,
          isFaceDown: orientationRef.current === 'face-down',
          isFlat: orientationRef.current !== 'moving',
        });

        // --- Callbacks ---
        if (previous === 'face-down' && orientationRef.current !== 'face-down') {
          // 👋 Levantou o celular antes da hora → Haptics no consumidor
          onLiftRef.current?.();
        } else if (orientationRef.current === 'face-down') {
          // 😅 Virou o celular para baixo → inicia/retoma o timer
          onFaceDownRef.current?.();
        }
      }
    });

    Accelerometer.setUpdateInterval(updateInterval);

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, [
    updateInterval,
    faceDownThreshold,
    faceUpThreshold,
    flatnessThreshold,
    stabilitySamples,
  ]);

  return result;
}