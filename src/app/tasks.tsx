import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Search } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTasks } from '@/hooks/useTasks';
import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskFormModal } from '@/components/tasks/TaskFormModal';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { Task, TaskStatus } from '@/types';

const FILTERS = [{ label: 'Todas', value: 'all' as const }, { label: 'A fazer', value: 'todo' as const }, { label: 'Em andamento', value: 'in_progress' as const }, { label: 'Concluídas', value: 'done' as const }];

export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { tasks, getTasksByStatus, createTask, updateTaskStatus, updateTask } = useTasks();
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleSave = useCallback(async (t: string, d: string, c: string) => {
    if (editingTask) await updateTask(editingTask.id, { title: t, description: d, category: c });
    else await createTask(t, d, c);
    setModalVisible(false); setEditingTask(null);
  }, [editingTask, updateTask, createTask]);

  const handleToggle = useCallback((t: Task) => {
    const n: Record<TaskStatus, TaskStatus> = { todo: 'in_progress', in_progress: 'done', done: 'todo' };
    updateTaskStatus(t.id, n[t.status]);
  }, [updateTaskStatus]);

  const handleLongPress = useCallback((t: Task) => { setEditingTask(t); setModalVisible(true); }, []);

  const raw = filter === 'all' ? tasks : getTasksByStatus(filter);
  const filtered = search ? raw.filter(t => t.title.toLowerCase().includes(search.toLowerCase())) : raw;
  const pending = tasks.filter(t => t.status !== 'done').length;
  const isLight = !isDark;

  const renderHeader = () => (
    <>
      <View style={styles.headerRow}>
        <View><Text style={[styles.headerTitle, { color: colors.text, fontFamily: 'Sora_600SemiBold' }]}>Organize seu dia</Text><Text style={[styles.headerSub, { color: colors.textMuted }]}>{pending} {pending === 1 ? 'tarefa pendente' : 'tarefas pendentes'}</Text></View>
        <TouchableOpacity onPress={() => { setEditingTask(null); setModalVisible(true); }} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Criar tarefa">
          <LinearGradient colors={colors.gradientPrimary} style={styles.addBtn}><Plus size={20} color={colors.onAccent} strokeWidth={2.5} /></LinearGradient>
        </TouchableOpacity>
      </View>
      <View style={[styles.searchRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Search size={16} color={colors.textMuted} />
        <TextInput style={[styles.searchInput, { color: colors.text }]} placeholder="Buscar tarefa..." placeholderTextColor={colors.textMuted} value={search} onChangeText={setSearch} accessibilityLabel="Buscar tarefas" returnKeyType="search" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {FILTERS.map(f => {
          const active = filter === f.value;
          return (
            <TouchableOpacity key={f.value} onPress={() => setFilter(f.value)} activeOpacity={0.7} accessibilityRole="button" accessibilityState={{ selected: active }}>
              {active ? (
                <LinearGradient colors={colors.gradientPrimary} style={styles.filterChip}><Text style={{ color: colors.onAccent, fontSize: 12, fontWeight: '700' }}>{f.label}</Text></LinearGradient>
              ) : (
                <View style={[styles.filterChip, { backgroundColor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)' }]}><Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '500' }}>{f.label}</Text></View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 24) }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScreenHeader title="Tarefas" />
      <FlatList data={filtered} keyExtractor={t => t.id}
        renderItem={({ item }) => <TaskItem task={item} onToggle={() => handleToggle(item)} onLongPress={() => handleLongPress(item)} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={<View style={styles.empty}><Text style={[styles.emptyTitle,{color:colors.text,fontFamily:'Sora_600SemiBold'}]}>{search?'Nenhuma tarefa encontrada':'Seu próximo foco começa aqui'}</Text><Text style={[styles.emptyHint,{color:colors.textMuted}]}>{search?'Experimente outro termo de busca.':'Crie uma tarefa e transforme intenção em progresso.'}</Text></View>}
        contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false} style={{ flex: 1 }} />
      <TaskFormModal visible={modalVisible} editingTask={editingTask} onSave={handleSave} onClose={() => { setModalVisible(false); setEditingTask(null); }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  headerTitle: { fontSize: 21, fontWeight: '700', letterSpacing: -0.5 }, headerSub: { fontSize: 13, marginTop: 4 },
  addBtn: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 2, borderRadius: 15, borderWidth: 1, marginBottom: 8, minHeight: 50 },
  searchInput: { flex: 1, fontSize: 14 },
  filterRow: { paddingVertical: 8, marginBottom: 4 },
  filterChip: { paddingHorizontal: 15, paddingVertical: 9, borderRadius: 999, marginRight: 8 },
  empty: { paddingVertical: 56, paddingHorizontal: 24, alignItems: 'center' },
  emptyTitle:{fontSize:17,fontWeight:'600',textAlign:'center'},
  emptyHint:{fontSize:13,lineHeight:20,textAlign:'center',marginTop:7},
});