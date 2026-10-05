/**
 * FocusHeader — Brand lockup header with streak badge + theme toggle
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Flame, Sun, Moon, Leaf } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { PomoduBrandLockup } from '@/components/brand/PomoduBrandLockup';
import { SPACING, FONT_SIZES, RADIUS } from '@/constants/theme';

interface Props { streakDays?: number; }

export function FocusHeader({ streakDays = 0 }: Props) {
  const { colors, isDark, toggleTheme } = useTheme();
  return (
    <View style={styles.container}>
      <PomoduBrandLockup size={26} textSize={16} />
      <View style={styles.rightRow}>
        <View style={[styles.streakBadge, { backgroundColor: colors.successBg }]}>
          <Leaf size={12} color={colors.successText} strokeWidth={2.5} />
          <Text style={[styles.streakText, { color: colors.successText }]}>{streakDays} {streakDays === 1 ? 'dia' : 'dias'}</Text>
        </View>
        <TouchableOpacity style={[styles.themeButton, { backgroundColor: colors.tagBg }]} onPress={toggleTheme} activeOpacity={0.6} hitSlop={8}>
          {isDark ? <Sun size={16} color={colors.textMuted} /> : <Moon size={16} color={colors.textMuted} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md },
  rightRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.full },
  streakText: { fontSize: FONT_SIZES.caption, fontWeight: '600' },
  themeButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});