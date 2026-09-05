/**
 * TaskPickerModal — Modal para selecionar uma tarefa e vincular à sessão
 */

import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Task } from '@/types';
import { SPACING, FONT_SIZES, RADIUS } from '@/constants/theme';

interface TaskPickerModalProps {
  visible: boolean;
  tasks: Task[];
  onSelect: (task: Task) => void;
  onClose: () => void;
}

export function TaskPickerModal({ visible, tasks, onSelect, onClose }: TaskPickerModalProps) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View
          style={[
            styles.modal,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.heading, { color: colors.text }]}>
            Vincular Tarefa
          </Text>

          {tasks.length === 0 ? (
            <Text style={[styles.empty, { color: colors.textMuted }]}>
              Nenhuma tarefa criada ainda
            </Text>
          ) : (
            <FlatList
              data={tasks}
              keyExtractor={(t) => t.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.item, { borderBottomColor: colors.border }]}
                  onPress={() => onSelect(item)}
                  activeOpacity={0.6}
                >
                  <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.itemStatus, { color: colors.textMuted }]}>
                    {statusLabel(item.status)}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.list}
            />
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={[styles.closeText, { color: colors.accent }]}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function statusLabel(s: Task['status']): string {
  const map: Record<string, string> = {
    todo: 'A fazer',
    in_progress: 'Fazendo',
    done: 'Concluido',
  };
  return map[s] ?? s;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modal: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    maxHeight: '70%',
    borderWidth: 1,
  },
  heading: {
    fontSize: FONT_SIZES.title,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  list: {
    maxHeight: 300,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 1,
  },
  itemTitle: {
    fontSize: FONT_SIZES.body,
    flex: 1,
    marginRight: SPACING.sm,
  },
  itemStatus: {
    fontSize: FONT_SIZES.caption,
  },
  empty: {
    fontSize: FONT_SIZES.body,
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
  closeBtn: {
    marginTop: SPACING.md,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  closeText: {
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
  },
});