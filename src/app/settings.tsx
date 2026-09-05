import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sun, Moon } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useSettings } from '@/context/SettingsContext';
import { SPACING, FONT_SIZES } from '@/constants/theme';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark, toggleTheme } = useTheme();
  const { settings, updateSettings, resetSettings } = useSettings();

  const step = (key: 'focusMinutes' | 'shortBreakMinutes' | 'longBreakMinutes' | 'cyclesBeforeLongBreak', delta: number) => {
    const clamp = (v: number) => Math.max(1, Math.min(120, v));
    updateSettings({ [key]: clamp(settings[key] + delta) });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 24) }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScreenHeader title="Configuracoes" />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + SPACING.xxl }} showsVerticalScrollIndicator={false}>
        <Card padded style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Aparencia</Text>
          <TouchableOpacity style={styles.themeRow} onPress={toggleTheme} activeOpacity={0.7}>
            <View style={[styles.themePreview, { backgroundColor: isDark ? '#1E242B' : '#FFFFFF', borderColor: colors.border }]}>
              {isDark ? <Moon size={24} color={colors.accent} /> : <Sun size={24} color={colors.accent} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.themeLabel, { color: colors.text }]}>{isDark ? 'Modo Escuro' : 'Modo Claro'}</Text>
              <Text style={[styles.themeDesc, { color: colors.textMuted }]}>Toque para alternar</Text>
            </View>
          </TouchableOpacity>
        </Card>
        <Card padded style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Temporizador</Text>
          {[
            { key: 'focusMinutes' as const, label: 'Foco (min)', value: settings.focusMinutes },
            { key: 'shortBreakMinutes' as const, label: 'Pausa curta (min)', value: settings.shortBreakMinutes },
            { key: 'longBreakMinutes' as const, label: 'Pausa longa (min)', value: settings.longBreakMinutes },
            { key: 'cyclesBeforeLongBreak' as const, label: 'Ciclos ate pausa longa', value: settings.cyclesBeforeLongBreak },
          ].map((item) => (
            <View key={item.key} style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>{item.label}</Text>
              <View style={styles.stepper}>
                <TouchableOpacity style={[styles.stepBtn, { backgroundColor: colors.tagBg }]} onPress={() => step(item.key, -1)}>
                  <Text style={[styles.stepBtnText, { color: colors.text }]}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.stepValue, { color: colors.text }]}>{item.value}</Text>
                <TouchableOpacity style={[styles.stepBtn, { backgroundColor: colors.tagBg }]} onPress={() => step(item.key, 1)}>
                  <Text style={[styles.stepBtnText, { color: colors.text }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <Button title="Restaurar padroes" variant="ghost" onPress={resetSettings} style={{ marginTop: SPACING.sm }} />
        </Card>
        <Card padded style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Sobre</Text>
          <Text style={[styles.aboutText, { color: colors.textMuted }]}>Pomodu v1.0</Text>
          <Text style={[styles.aboutText, { color: colors.textMuted }]}>Hub de produtividade pessoal</Text>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: SPACING.lg },
  section: { marginBottom: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZES.subtitle, fontWeight: '700', marginBottom: SPACING.md },
  themeRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  themePreview: { width: 60, height: 60, borderRadius: 16, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  themeLabel: { fontSize: FONT_SIZES.body, fontWeight: '600' },
  themeDesc: { fontSize: FONT_SIZES.caption, marginTop: 2 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1 },
  settingLabel: { fontSize: FONT_SIZES.body },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  stepBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  stepBtnText: { fontSize: FONT_SIZES.title, fontWeight: '600', lineHeight: 22 },
  stepValue: { fontSize: FONT_SIZES.subtitle, fontWeight: '700', minWidth: 28, textAlign: 'center', fontVariant: ['tabular-nums'] },
  aboutText: { fontSize: FONT_SIZES.body, marginBottom: 4 },
});