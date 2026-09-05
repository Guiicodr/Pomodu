/**
 * useAmbientAudio — Ambient sound playback manager
 * Connects sound selectors (Rain, Cafe, Brown Noise) to expo-av
 */

import { useRef, useState, useCallback } from 'react';
import { Audio } from 'expo-av';

export type AmbientSound = 'Silencio' | 'Chuva' | 'Cafe' | 'Marrom';

const SOUND_MAP: Record<string, any> = {
  // In production, replace with actual bundled asset requires
  // e.g., require('@/assets/audio/rain.mp3')
};

interface AmbientAudioResult {
  currentSound: AmbientSound;
  isPlaying: boolean;
  selectSound: (sound: AmbientSound) => void;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  toggle: () => Promise<void>;
}

export function useAmbientAudio(): AmbientAudioResult {
  const [currentSound, setCurrentSound] = useState<AmbientSound>('Silencio');
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  const stopCurrent = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const selectSound = useCallback(async (sound: AmbientSound) => {
    await stopCurrent();
    setCurrentSound(sound);
  }, [stopCurrent]);

  const play = useCallback(async () => {
    if (currentSound === 'Silencio') return;
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });
    try {
      const { sound } = await Audio.Sound.createAsync(
        // Placeholder — user provides audio files
        { uri: `https://assets.pomodu.app/${currentSound.toLowerCase()}.mp3` },
        { isLooping: true, volume: 0.4 }
      );
      soundRef.current = sound;
      await sound.playAsync();
      setIsPlaying(true);
    } catch {
      // Audio file not available yet
      console.log('[AmbientAudio] Sound file not found:', currentSound);
    }
  }, [currentSound]);

  const pause = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    }
  }, []);

  const toggle = useCallback(async () => {
    if (isPlaying) await pause();
    else await play();
  }, [isPlaying, play, pause]);

  return { currentSound, isPlaying, selectSound, play, pause, toggle };
}