import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clock, Flame, Smartphone, Target } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, FONT_SIZES } from '@/constants/theme';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/insights/StatCard';
import { LocationRow } from '@/components/insights/LocationRow';
import { WeeklyBarChart } from '@/components/insights/WeeklyBarChart';
import { formatDuration } from '@/utils/format';
import { getTotalFocusedMs, getFocusedMsByWeekday, getFocusedMsByLocation } from '@/services/sessionService';
import { useLocations } from '@/hooks/useLocations';
import { useTasks } from '@/hooks/useTasks';

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { locations } = useLocations();
  const { tasks } = useTasks();
  const [totalMs, setTotalMs] = useState(0);
  const [weekdayData, setWeekdayData] = useState<number[]>(new Array(7).fill(0));
  const [locationData, setLocationData] = useState<{ locationId: string; name: string; totalMs: number }[]>([]);

  const loadMetrics = useCallback(async () => {
    try { const [total, weekdays, locs] = await Promise.all([getTotalFocusedMs(), getFocusedMsByWeekday(), getFocusedMsByLocation()]); setTotalMs(total); setWeekdayData(weekdays); setLocationData(locs); } catch {}
  }, []);

  useEffect(() => { loadMetrics(); }, [loadMetrics]);

  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const weekNum = Math.ceil((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 86400000 / 7);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 24) }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScreenHeader title="Metricas" />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + SPACING.xxl }} showsVerticalScrollIndicator={false}>
        <View style={styles.subheader}>
          <Text style={[styles.weekLabel, { color: colors.textMuted }]}>Semana {weekNum}</Text>
          <Text style={[styles.totalFocused, { color: colors.accent }]}>{formatDuration(totalMs)} focado</Text>
        </View>
        <View style={styles.statsGrid}>
          <StatCard icon={<Clock size={18} color={colors.accent} />} value={formatDuration(totalMs)} label="Foco total" />
          <StatCard icon={<Flame size={18} color={colors.accent} />} value="12 days" label="Sequencia" trend="+3 vs. semana" />
        </View>
        <View style={styles.statsGrid}>
          <StatCard icon={<Smartphone size={18} color={colors.accent} />} value="8/12" label="Sessoes concluidas" />
          <StatCard icon={<Target size={18} color={colors.accent} />} value={`${doneTasks}/${tasks.length}`} label="Tarefas" />
        </View>
        <Card padded style={styles.sectionCard}><WeeklyBarChart dataByWeekday={weekdayData} /></Card>
        <Card padded style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Locais de foco</Text>
          {locationData.length === 0 ? (
            <Text style={[styles.empty, { color: colors.textMuted }]}>Complete ciclos com GPS ativo</Text>
          ) : locationData.map((loc, i) => (
            <LocationRow key={loc.locationId} name={loc.name} icon="home" sessions={0} focusedMs={loc.totalMs} rank={i + 1} />
          ))}
          {locations.length > 0 && locationData.length === 0 && locations.map((loc, i) => (
            <LocationRow key={loc.id} name={loc.name} icon={loc.icon} sessions={loc.totalSessions} focusedMs={loc.totalFocusedMs} rank={i + 1} />
          ))}
        </Card>
        {locationData.length >= 2 && (
          <Card padded style={styles.sectionCard}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Comparativo de Produtividade</Text>
            <Text style={[styles.comparisonText, { color: colors.textMuted }]}>
              Sua produtividade na {locationData[0].name} e {Math.round((locationData[0].totalMs / locationData[1].totalMs - 1) * 100)}% maior que em {locationData[1].name}.
            </Text>
          </Card>
        )}
        {!locations.length && (
          <Card padded><Text style={[styles.empty, { color: colors.textMuted }]}>Permita acesso a localizacao.</Text></Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: SPACING.lg },
  subheader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm },
  weekLabel: { fontSize: FONT_SIZES.caption, fontWeight: '600' },
  totalFocused: { fontSize: FONT_SIZES.caption, fontWeight: '700' },
  statsGrid: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  sectionCard: { marginBottom: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZES.subtitle, fontWeight: '700', marginBottom: SPACING.sm },
  comparisonText: { fontSize: FONT_SIZES.body, paddingVertical: SPACING.sm },
  empty: { fontSize: FONT_SIZES.body, textAlign: 'center', paddingVertical: SPACING.xl },
});