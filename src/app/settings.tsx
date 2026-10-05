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
      <ScreenHeader title="Ajustes" />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + SPACING.xxl }} showsVerticalScrollIndicator={false}>
        <Card padded style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Sora_600SemiBold' }]}>Aparência</Text>
          <TouchableOpacity style={styles.themeRow} onPress={toggleTheme} activeOpacity={0.7}>
            <View style={[styles.themePreview, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {isDark ? <Moon size={24} color={colors.accent} /> : <Sun size={24} color={colors.accent} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.themeLabel, { color: colors.text }]}>{isDark ? 'Tema escuro' : 'Tema claro'}</Text>
              <Text style={[styles.themeDesc, { color: colors.textMuted }]}>Toque para alternar a aparência</Text>
            </View>
          </TouchableOpacity>
        </Card>
        <Card padded style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Sora_600SemiBold' }]}>Temporizador</Text>
          {[
            { key: 'focusMinutes' as const, label: 'Foco', suffix: 'min', value: settings.focusMinutes },
            { key: 'shortBreakMinutes' as const, label: 'Pausa curta', suffix: 'min', value: settings.shortBreakMinutes },
            { key: 'longBreakMinutes' as const, label: 'Pausa longa', suffix: 'min', value: settings.longBreakMinutes },
            { key: 'cyclesBeforeLongBreak' as const, label: 'Ciclos antes da pausa longa', suffix: 'ciclos', value: settings.cyclesBeforeLongBreak },
          ].map((item) => (
            <View key={item.key} style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View style={styles.settingLabelGroup}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>{item.label}</Text>
                <Text style={[styles.settingHint,{color:colors.textMuted}]}>{item.suffix === 'min' ? 'Duração em minutos' : 'Descanso prolongado'}</Text>
              </View>
              <View style={styles.stepper}>
                <TouchableOpacity style={[styles.stepBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => step(item.key, -1)} accessibilityRole="button" accessibilityLabel={`Diminuir ${item.label}`}>
                  <Text style={[styles.stepBtnText, { color: colors.text }]}>−</Text>
                </TouchableOpacity>
                <Text style={[styles.stepValue, { color: colors.text }]}>{item.value}<Text style={[styles.stepUnit,{color:colors.textMuted}]}> {item.suffix}</Text></Text>
                <TouchableOpacity style={[styles.stepBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => step(item.key, 1)} accessibilityRole="button" accessibilityLabel={`Aumentar ${item.label}`}>
                  <Text style={[styles.stepBtnText, { color: colors.text }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <Button title="Restaurar padrões" variant="ghost" onPress={resetSettings} style={{ marginTop: SPACING.sm }} />
        </Card>
        <Card padded style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Sora_600SemiBold' }]}>Sobre o Pomodu</Text>
          <Text style={[styles.aboutText, { color: colors.textMuted }]}>Pomodu v1.0</Text>
          <Text style={[styles.aboutText, { color: colors.textMuted }]}>Hub de produtividade pessoal</Text>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: SPACING.lg },
  section: { marginBottom: SPACING.md, padding: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: SPACING.md },
  themeRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  themePreview: { width: 54, height: 54, borderRadius: 17, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  themeLabel: { fontSize: 14, fontWeight: '600' },
  themeDesc: { fontSize: FONT_SIZES.caption, marginTop: 2 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10, paddingVertical: 13, borderBottomWidth: 1 },
  settingLabelGroup:{flex:1,gap:3},
  settingLabel: { fontSize: 13, fontWeight: '600' },
  settingHint:{fontSize:11},
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  stepBtn: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  stepBtnText: { fontSize: FONT_SIZES.title, fontWeight: '600', lineHeight: 22 },
  stepValue: { fontSize: 14, fontWeight: '700', minWidth: 48, textAlign: 'center', fontVariant: ['tabular-nums'] },
  stepUnit:{fontSize:10,fontWeight:'500'},
  aboutText: { fontSize: FONT_SIZES.body, marginBottom: 4 },
});