/**
 * LocationProductivityList — Lista de produtividade por local
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, FONT_SIZES } from '@/constants/theme';
import { formatDuration } from '@/utils/format';

interface LocationRow {
  locationId: string;
  name: string;
  totalMs: number;
}

interface LocationProductivityListProps {
  data: LocationRow[];
}

export function LocationProductivityList({
  data,
}: LocationProductivityListProps) {
  const { colors } = useTheme();

  return (
    <Card padded style={styles.card}>
      <Text style={[styles.title, { color: colors.text }]}>Produtividade por Local</Text>

      {data.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textMuted }]}>
          Nenhum local registrado. Complete ciclos com GPS ativo.
        </Text>
      ) : (
        data.map((item, index) => (
          <View key={item.locationId} style={[styles.row, { borderBottomColor: colors.border }]}>
            <View style={[styles.rankBadge, { backgroundColor: colors.accent }]}>
              <Text style={styles.rankText}>{index + 1}</Text>
            </View>
            <MapPin size={16} color={colors.accent} />
            <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.time, { color: colors.textMuted }]}>{formatDuration(item.totalMs)}</Text>
          </View>
        ))
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: SPACING.md },
  title: { fontSize: FONT_SIZES.subtitle, fontWeight: '600', marginBottom: SPACING.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.sm, borderBottomWidth: 1 },
  rankBadge: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rankText: { fontSize: FONT_SIZES.caption, fontWeight: '700', color: '#FFFFFF' },
  name: { flex: 1, fontSize: FONT_SIZES.body, fontWeight: '500' },
  time: { fontSize: FONT_SIZES.caption, fontVariant: ['tabular-nums'] },
  empty: { fontSize: FONT_SIZES.body, textAlign: 'center', paddingVertical: SPACING.xl },
});