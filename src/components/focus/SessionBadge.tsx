import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { PomodoroPhase } from '@/hooks/usePomodoroTimer';

interface Props { phase: PomodoroPhase; }
const labelMap: Record<PomodoroPhase, string> = { idle: 'READY', focusing: 'FOCUS SESSION', short_break: 'BREAK', long_break: 'LONG BREAK' };

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
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontSize: 12, fontWeight: '700', letterSpacing: 1.5 },
});