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

const iconMap: Record<LocationIcon, React.ComponentType<{ size?: number; color?: string }>> = {
  home: House,
  briefcase: Briefcase,
  coffee: Coffee,
  university: GraduationCap,
  gym: Dumbbell,
  other: MapPin,
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
  const LocationGlyph = iconMap[icon] ?? MapPin;

  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      {/* Ícone */}
      <View style={[styles.iconCircle, { backgroundColor: isBest ? colors.terracottaSoft : colors.accentSoft }]}>
        <LocationGlyph size={18} color={colors.accent} />
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
          {sessions} {sessions === 1 ? 'sessão' : 'sessões'} · {formatDuration(focusedMs)} de foco
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
    borderBottomWidth: StyleSheet.hairlineWidth,
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