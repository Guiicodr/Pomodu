/**
 * AuthContext — User session management with AsyncStorage persistence
 * Supports logged-in and guest modes
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  createdAt: number;
  streak: number;
  level: number;
  totalFocusedMs: number;
}

interface AuthContextValue {
  user: UserProfile | null;
  isGuest: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (displayName: string, email: string, password: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AUTH_KEY = '@pomodu/auth';
const GUEST_KEY = '@pomodu/guest';

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted session on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTH_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
          setIsGuest(false);
          setIsLoading(false);
          return;
        }
        const guestStored = await AsyncStorage.getItem(GUEST_KEY);
        if (guestStored) {
          setUser(JSON.parse(guestStored));
          setIsGuest(true);
        }
      } catch { /* fallback to guest */ }
      setIsLoading(false);
    })();
  }, []);

  const persistUser = useCallback(async (u: UserProfile, guest: boolean) => {
    const key = guest ? GUEST_KEY : AUTH_KEY;
    await AsyncStorage.setItem(key, JSON.stringify(u));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    // Simulated auth — in production, replace with Firebase/Supabase
    const mockUser: UserProfile = {
      uid: generateId(),
      displayName: email.split('@')[0],
      email,
      createdAt: Date.now(),
      streak: 0,
      level: 1,
      totalFocusedMs: 0,
    };
    setUser(mockUser);
    setIsGuest(false);
    await persistUser(mockUser, false);
    await AsyncStorage.removeItem(GUEST_KEY);
    setIsLoading(false);
  }, [persistUser]);

  const signup = useCallback(async (displayName: string, email: string, password: string) => {
    setIsLoading(true);
    const newUser: UserProfile = {
      uid: generateId(),
      displayName,
      email,
      createdAt: Date.now(),
      streak: 0,
      level: 1,
      totalFocusedMs: 0,
    };
    setUser(newUser);
    setIsGuest(false);
    await persistUser(newUser, false);
    await AsyncStorage.removeItem(GUEST_KEY);
    setIsLoading(false);
  }, [persistUser]);

  const loginAsGuest = useCallback(async () => {
    setIsLoading(true);
    const guest: UserProfile = {
      uid: `guest-${generateId()}`,
      displayName: 'Convidado',
      email: '',
      createdAt: Date.now(),
      streak: 0,
      level: 1,
      totalFocusedMs: 0,
    };
    setUser(guest);
    setIsGuest(true);
    await persistUser(guest, true);
    setIsLoading(false);
  }, [persistUser]);

  const logout = useCallback(async () => {
    setUser(null);
    setIsGuest(false);
    await AsyncStorage.removeItem(AUTH_KEY);
    await AsyncStorage.removeItem(GUEST_KEY);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    await persistUser(updated, isGuest);
  }, [user, isGuest, persistUser]);

  return (
    <AuthContext.Provider value={{ user, isGuest, isLoading, login, signup, loginAsGuest, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}