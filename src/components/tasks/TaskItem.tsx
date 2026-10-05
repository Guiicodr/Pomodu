import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check, ChevronRight, Clock3 } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Task } from '@/types';
import { formatDuration, getTaskCategoryLabel } from '@/utils/format';

interface Props { task: Task; onToggle: () => void; onLongPress: () => void; }

export function TaskItem({ task, onToggle, onLongPress }: Props) {
  const { colors, isDark } = useTheme();
  const done = task.status === 'done';
  const statusLabel = done ? 'Concluída' : task.status === 'in_progress' ? 'Em andamento' : 'A fazer';
  const statusColor = done ? colors.sage : task.status === 'in_progress' ? colors.priorityMedium : colors.textMuted;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onToggle}
      onLongPress={onLongPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={`${task.title}, ${statusLabel}. Toque para atualizar.`}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={[styles.bar, { backgroundColor: done ? colors.sage : task.status === 'in_progress' ? colors.priorityMedium : colors.accent }]} />
      <View style={[styles.check, { borderColor: done ? colors.sage : colors.textMuted, backgroundColor: done ? colors.sage : 'transparent' }]}>
        {done && <Check size={14} color={colors.onAccent} strokeWidth={3} />}
      </View>
      <View style={styles.content}>
        <Text
          numberOfLines={1}
          style={[styles.title, { color: done ? colors.textMuted : colors.text, textDecorationLine: done ? 'line-through' : 'none' }]}
        >
          {task.title}
        </Text>
        <View style={styles.meta}>
          {task.category ? (
            <Text style={[styles.category, { color: colors.textMuted, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : colors.surfaceAlt }]}>
              {getTaskCategoryLabel(task.category)}
            </Text>
          ) : null}
          <Text style={[styles.status, { color: statusColor }]}>{statusLabel}</Text>
          {task.totalFocusedMs > 0 && (
            <View style={styles.duration}>
              <Clock3 size={12} color={colors.textMuted} />
              <Text style={[styles.durationText, { color: colors.textMuted }]}>{formatDuration(task.totalFocusedMs)}</Text>
            </View>
          )}
        </View>
      </View>
      <ChevronRight size={17} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 78, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15, borderRadius: 19, borderWidth: 1, marginBottom: 9, overflow: 'hidden' },
  bar: { width: 3, height: '100%', position: 'absolute', left: 0, top: 0 },
  check: { width: 23, height: 23, borderRadius: 12, borderWidth: 1.7, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, gap: 7 },
  title: { fontSize: 14, fontWeight: '600', letterSpacing: -0.1 },
  meta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  category: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, fontSize: 10, overflow: 'hidden' },
  status: { fontSize: 11, fontWeight: '600' },
  duration: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  durationText: { fontSize: 11 },
});
