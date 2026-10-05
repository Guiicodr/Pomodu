/**
 * ThemeContext.tsx — Contexto global de temas (Light / Dark)
 *
 * - Armazena o tema atual em AsyncStorage para persistência
 * - Hook useTheme() → { colors, isDark, toggleTheme, setTheme }
 * - Padrão: Light Mode (como no protótipo)
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, ThemeColors } from '@/constants/themes';

const STORAGE_KEY = '@pomodu/theme';

interface ThemeContextValue {
  /** Cores do tema ativo */
  colors: ThemeColors;
  /** Fontes carregadas pela raiz da aplicação */
  fontDisplay: string;
  fontBody: string;
  /** true se dark mode */
  isDark: boolean;
  /** Alterna entre light e dark */
  toggleTheme: () => void;
  /** Define um tema específico */
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: lightTheme.colors,
  fontDisplay: lightTheme.fontDisplay,
  fontBody: lightTheme.fontBody,
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Carrega preferência salva
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === 'dark') setIsDark(true);
        else setIsDark(false);
      } catch {
        setIsDark(false);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Persiste quando muda
  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light').catch(() => {});
      return next;
    });
  }, []);

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    setIsDark(theme === 'dark');
    AsyncStorage.setItem(STORAGE_KEY, theme).catch(() => {});
  }, []);

  const theme = isDark ? darkTheme : lightTheme;
  const value: ThemeContextValue = {
    colors: theme.colors,
    fontDisplay: theme.fontDisplay,
    fontBody: theme.fontBody,
    isDark,
    toggleTheme,
    setTheme,
  };

  if (!loaded) return null; // evita flash do tema errado

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}