import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, Platform } from 'react-native';
import { Pause, Play } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface Props { isRunning: boolean; onPress: () => void; style?: ViewStyle; }

export function TimerControls({ isRunning, onPress, style }: Props) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent, ...Platform.select({ ios: { shadowColor: colors.accent, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 20 }, android: { elevation: 8 } }) }, style]}
      onPress={onPress} activeOpacity={0.8}>
      {isRunning ? <Pause size={32} color={colors.onAccent} fill={colors.onAccent} /> : <Play size={32} color={colors.onAccent} fill={colors.onAccent} style={{ marginLeft: 3 }} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
});