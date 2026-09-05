/**
 * TaskFormModal — Modal de criação/edição de tarefa com categoria
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Task } from '@/types';
import { SPACING, FONT_SIZES, RADIUS } from '@/constants/theme';
import { Button } from '@/components/ui/Button';

const CATEGORIES = ['Design', 'Dev', 'Writing', 'Personal', 'Study', 'Other'];

interface TaskFormModalProps {
  visible: boolean;
  editingTask: Task | null;
  onSave: (title: string, description: string, category: string) => void;
  onClose: () => void;
}

export function TaskFormModal({
  visible,
  editingTask,
  onSave,
  onClose,
}: TaskFormModalProps) {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setCategory(editingTask.category || '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('');
    }
  }, [editingTask, visible]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title.trim(), description.trim(), category);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={[styles.overlay, { backgroundColor: colors.overlay }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={[styles.modalScroll]}
          contentContainerStyle={[styles.modal, { backgroundColor: colors.surface, borderColor: colors.border }]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.heading, { color: colors.text }]}>
            {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
          </Text>

          <TextInput
            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
            placeholder="Título da tarefa"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
            autoFocus
          />
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
            placeholder="Descrição (opcional)"
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          {/* Categoria chips */}
          <Text style={[styles.categoryLabel, { color: colors.textMuted }]}>Categoria</Text>
          <View style={styles.chipsRow}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.chip,
                  {
                    backgroundColor: category === cat ? colors.accentSoft : colors.tagBg,
                    borderColor: category === cat ? colors.accent : 'transparent',
                  },
                ]}
                onPress={() => setCategory(category === cat ? '' : cat)}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: category === cat ? colors.accent : colors.textMuted,
                      fontWeight: category === cat ? '700' : '500',
                    },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.actions}>
            <Button title="Cancelar" variant="ghost" onPress={onClose} />
            <Button
              title={editingTask ? 'Salvar' : 'Criar'}
              onPress={handleSave}
              disabled={!title.trim()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalScroll: {
    maxHeight: '80%',
  },
  modal: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
  },
  heading: {
    fontSize: FONT_SIZES.title,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  input: {
    fontSize: FONT_SIZES.body,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryLabel: {
    fontSize: FONT_SIZES.caption,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    marginTop: SPACING.xs,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  chipText: {
    fontSize: FONT_SIZES.caption,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
});