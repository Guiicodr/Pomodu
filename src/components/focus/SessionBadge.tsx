import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { PomodoroPhase } from '@/hooks/usePomodoroTimer';

interface Props { phase: PomodoroPhase; }
const labelMap: Record<PomodoroPhase, string> = { idle: 'PRONTO PARA COMEÇAR', focusing: 'SESSÃO DE FOCO', short_break: 'PAUSA CURTA', long_break: 'PAUSA LONGA' };

export function SessionBadge({ phase }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.badge, { backgroundColor: colors.accentSoft }]}>
      <View style={[styles.dot, { backgroundColor: colors.accent }]} />
      <Text style={[styles.label, { color: colors.accent }]}>{labelMap[phase]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', gap: 7, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 1.1 },
});