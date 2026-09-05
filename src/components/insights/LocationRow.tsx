/**
 * LocationRow.tsx — Item de local no ranking de produtividade
 *
 * Ícone circular (Home/Briefcase/Coffee), nome, badge "MELHOR LUGAR"
 * no top 1 (terracottaSoft), "N sessões · XhY focadas".
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { House, Briefcase, Coffee, GraduationCap, Dumbbell, MapPin } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { LocationIcon } from '@/types';
import { SPACING, FONT_SIZES, RADIUS } from '@/constants/theme';
import { formatDuration } from '@/utils/format';

const iconMap: Record<LocationIcon, React.ReactNode> = {
  home: <House size={18} />,
  briefcase: <Briefcase size={18} />,
  coffee: <Coffee size={18} />,
  university: <GraduationCap size={18} />,
  gym: <Dumbbell size={18} />,
  other: <MapPin size={18} />,
};

interface LocationRowProps {
  name: string;
  icon: LocationIcon;
  sessions: number;
  focusedMs: number;
  rank: number;
}

export function LocationRow({ name, icon, sessions, focusedMs, rank }: LocationRowProps) {
  const { colors } = useTheme();
  const isBest = rank === 1;

  return (
    <View style={styles.row}>
      {/* Ícone */}
      <View style={[styles.iconCircle, { backgroundColor: isBest ? colors.terracottaSoft : colors.tagBg }]}>
        {iconMap[icon] ?? iconMap.other}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
          {isBest && (
            <View style={[styles.bestBadge, { backgroundColor: colors.terracottaSoft }]}>
              <Text style={[styles.bestText, { color: colors.accent }]}>MELHOR LUGAR</Text>
            </View>
          )}
        </View>
        <Text style={[styles.meta, { color: colors.textMuted }]}>
          {sessions} sessões · {formatDuration(focusedMs)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  name: {
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
  },
  bestBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  bestText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  meta: {
    fontSize: FONT_SIZES.caption,
  },
});