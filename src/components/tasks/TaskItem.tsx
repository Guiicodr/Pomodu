import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check, ChevronRight, Flame } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Task } from '@/types';

interface Props { task: Task; onToggle: () => void; onLongPress: () => void; }

export function TaskItem({ task, onToggle, onLongPress }: Props) {
  const { colors } = useTheme();
  const done = task.status === 'done';
  const isLight = !colors.text.startsWith('#F');
  const borderColor = isLight ? colors.border : 'rgba(255,255,255,0.06)';

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onToggle} onLongPress={onLongPress}
      style={[styles.card, { backgroundColor: colors.surface, borderColor }]}>
      <View style={[styles.bar, { backgroundColor: done ? colors.sage : colors.priorityLow }]} />
      <TouchableOpacity style={[styles.chk, { borderColor: done ? colors.sage : colors.textMuted, backgroundColor: done ? colors.sage : 'transparent' }]}
        onPress={onToggle} hitSlop={8}>{done && <Check size={14} color="#fff" strokeWidth={3} />}</TouchableOpacity>
      <View style={styles.content}>
        <Text numberOfLines={1} style={[styles.title, { color: done ? colors.textMuted : colors.text, textDecorationLine: done ? 'line-through' : 'none' }]}>{task.title}</Text>
        <View style={styles.tags}>{task.category ? (
          <View style={[styles.tag, { backgroundColor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)' }]}>
            <Text style={[styles.tagText, { color: colors.textMuted }]}>{task.category}</Text>
          </View>
        ) : null}</View>
        <View style={styles.session}>
          <Flame size={11} color={colors.accent} />
          <Text style={[styles.sessionText, { color: colors.textMuted }]}>2/4 sessions</Text>
          <View style={[styles.progBar, { backgroundColor: colors.track }]}>
            <View style={[styles.progFill, { backgroundColor: colors.accent, width: '50%' }]} />
          </View>
        </View>
      </View>
      <ChevronRight size={16} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 20, borderWidth: 1, marginBottom: 8, overflow: 'hidden' },
  bar: { width: 4, height: '100%', position: 'absolute', left: 0, top: 0, borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
  chk: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, gap: 4 },
  title: { fontSize: 15, fontWeight: '600', letterSpacing: -0.2 },
  tags: { flexDirection: 'row', gap: 8 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  tagText: { fontSize: 11, fontWeight: '500' },
  session: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  sessionText: { fontSize: 11, fontWeight: '500' },
  progBar: { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden', marginLeft: 4 },
  progFill: { height: '100%', borderRadius: 2 },
});