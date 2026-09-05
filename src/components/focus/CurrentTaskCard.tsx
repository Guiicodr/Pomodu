import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { ListChecks } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface Props { title: string; category?: string; session: number; totalSessions: number; }

export function CurrentTaskCard({ title, category, session, totalSessions }: Props) {
  const { colors } = useTheme();
  const isLight = !colors.text.startsWith('#F');
  const borderColor = isLight ? colors.border : 'rgba(255,255,255,0.08)';

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: borderColor, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 24 }, android: { elevation: 6 } }) }]}>
      <View style={styles.header}>
        <ListChecks size={14} color={colors.accent} strokeWidth={2} />
        <Text style={[styles.headerLabel, { color: colors.accent }]}>CURRENT TASK</Text>
      </View>
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{title || 'No task linked'}</Text>
      <View style={styles.tagsRow}>
        {category && (
          <View style={[styles.tag, { backgroundColor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)' }]}>
            <Text style={[styles.tagText, { color: colors.textMuted }]}>{category}</Text>
          </View>
        )}
        {totalSessions > 0 && (
          <View style={[styles.tag, { backgroundColor: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.04)' }]}>
            <Text style={[styles.tagText, { color: colors.textMuted }]}>Session {session} of {totalSessions}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 24, padding: 20, borderWidth: 1, marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  headerLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  title: { fontSize: 16, fontWeight: '600', lineHeight: 22, marginBottom: 16 },
  tagsRow: { flexDirection: 'row', gap: 8 },
  tag: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999 },
  tagText: { fontSize: 12, fontWeight: '500' },
});