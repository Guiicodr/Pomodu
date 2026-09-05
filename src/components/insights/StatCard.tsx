/**
 * StatCard.tsx — Card de métrica (grid 2×2 do dashboard)
 *
 * Ícone + valor + label + variação opcional.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, FONT_SIZES } from '@/constants/theme';

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  trend?: string;
}

export function StatCard({ icon, value, label, trend }: StatCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.accentSoft }]}>
        {icon}
      </View>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      {trend != null && (
        <Text style={[styles.trend, { color: colors.sage }]}>{trend}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: FONT_SIZES.heading,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: FONT_SIZES.caption,
  },
  trend: {
    fontSize: FONT_SIZES.caption,
    fontWeight: '600',
  },
});