import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clock3, Flame, Smartphone, Target } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { SPACING } from '@/constants/theme';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/insights/StatCard';
import { LocationRow } from '@/components/insights/LocationRow';
import { WeeklyBarChart } from '@/components/insights/WeeklyBarChart';
import { formatDuration } from '@/utils/format';
import {
  calculateStreak,
  getFocusedMsByLocation,
  getFocusedMsByWeekday,
  getTodaySessionCount,
  getTotalFocusedMs,
} from '@/services/sessionService';
import { useLocations } from '@/hooks/useLocations';
import { useTasks } from '@/hooks/useTasks';

type LocationMetric = { locationId: string; name: string; totalMs: number; sessions: number };

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { locations } = useLocations();
  const { tasks } = useTasks();
  const [totalMs, setTotalMs] = useState(0);
  const [weekdayData, setWeekdayData] = useState<number[]>(new Array(7).fill(0));
  const [locationData, setLocationData] = useState<LocationMetric[]>([]);
  const [streak, setStreak] = useState(0);
  const [todaySessions, setTodaySessions] = useState(0);
  const [loadError, setLoadError] = useState('');

  const loadMetrics = useCallback(async () => {
    setLoadError('');
    try {
      const [total, weekdays, locs, currentStreak, todayCount] = await Promise.all([
        getTotalFocusedMs(),
        getFocusedMsByWeekday(),
        getFocusedMsByLocation(),
        calculateStreak(),
        getTodaySessionCount(),
      ]);
      setTotalMs(total);
      setWeekdayData(weekdays);
      setLocationData(locs);
      setStreak(currentStreak);
      setTodaySessions(todayCount);
    } catch (error) {
      console.error('[InsightsScreen] load metrics', error);
      setLoadError('Não foi possível carregar suas métricas. Tente novamente mais tarde.');
    }
  }, []);

  useEffect(() => { loadMetrics(); }, [loadMetrics]);

  const doneTasks = tasks.filter((task) => task.status === 'done').length;
  const pendingTasks = tasks.length - doneTasks;
  const fallbackLocations = locationData.length === 0
    ? locations.map((location) => ({
        locationId: location.id,
        name: location.name,
        totalMs: location.totalFocusedMs,
        sessions: location.totalSessions,
        icon: location.icon,
      }))
    : [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 24) }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScreenHeader title="Seu progresso" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Text style={[styles.eyebrow, { color: colors.accent }]}>VISÃO GERAL</Text>
          <Text style={[styles.heading, { color: colors.text, fontFamily: 'Sora_600SemiBold' }]}>Cada sessão conta.</Text>
          <Text style={[styles.subheading, { color: colors.textMuted }]}>Veja como seu foco ganha ritmo com o tempo.</Text>
        </View>

        <Card padded style={styles.heroCard}>
          <Text style={[styles.heroLabel, { color: colors.textMuted }]}>TEMPO TOTAL DE FOCO</Text>
          <Text style={[styles.heroValue, { color: colors.text, fontFamily: 'Sora_600SemiBold' }]}>{formatDuration(totalMs)}</Text>
          <View style={[styles.heroFooter, { borderTopColor: colors.border }]}>
            <View style={[styles.heroIcon, { backgroundColor: colors.accentSoft }]}><Clock3 size={16} color={colors.accent} /></View>
            <Text style={[styles.heroCaption, { color: colors.textMuted }]}>Acumulado em sessões concluídas</Text>
          </View>
        </Card>

        <View style={styles.statsGrid}>
          <StatCard icon={<Flame size={17} color={colors.accent} />} value={`${streak}`} label={streak === 1 ? 'dia de sequência' : 'dias de sequência'} />
          <StatCard icon={<Smartphone size={17} color={colors.accent} />} value={`${todaySessions}`} label={todaySessions === 1 ? 'sessão hoje' : 'sessões hoje'} />
        </View>
        <View style={styles.statsGrid}>
          <StatCard icon={<Target size={17} color={colors.accent} />} value={`${doneTasks}/${tasks.length}`} label="tarefas concluídas" />
          <StatCard icon={<Target size={17} color={colors.accent} />} value={`${pendingTasks}`} label={pendingTasks === 1 ? 'tarefa em aberto' : 'tarefas em aberto'} />
        </View>

        {loadError ? (
          <View style={[styles.error, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={{ color: isDark ? '#FF9C91' : '#B9382C' }} accessibilityRole="alert">{loadError}</Text>
            <TouchableOpacity onPress={loadMetrics} accessibilityRole="button">
              <Text style={{ color: colors.accent, fontWeight: '700' }}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <WeeklyBarChart dataByWeekday={weekdayData} />

        <Card padded style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Sora_600SemiBold' }]}>Lugares onde você foca</Text>
          {locationData.length === 0 && fallbackLocations.length === 0 ? (
            <Text style={[styles.empty, { color: colors.textMuted }]}>Suas sessões em diferentes locais aparecerão aqui.</Text>
          ) : locationData.length > 0 ? (
            locationData.map((location, index) => (
              <LocationRow key={location.locationId} name={location.name ?? 'Local sem nome'} icon="other" sessions={location.sessions} focusedMs={location.totalMs} rank={index + 1} />
            ))
          ) : fallbackLocations.map((location, index) => (
            <LocationRow key={location.locationId} name={location.name} icon={location.icon} sessions={location.sessions} focusedMs={location.totalMs} rank={index + 1} />
          ))}
        </Card>

        {locationData.length >= 2 && locationData[1].totalMs > 0 ? (
          <Card padded style={styles.sectionCard}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Sora_600SemiBold' }]}>Seu lugar de maior foco</Text>
            <Text style={[styles.comparisonText, { color: colors.textMuted }]}>
              Você acumulou mais tempo de foco em {locationData[0].name} do que em {locationData[1].name}.
            </Text>
          </Card>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: SPACING.lg },
  scrollContent:{paddingBottom:SPACING.xxl},
  intro:{paddingTop:14,paddingBottom:18},
  eyebrow:{fontSize:10,fontWeight:'700',letterSpacing:1.6,marginBottom:8},
  heading:{fontSize:24,fontWeight:'700',letterSpacing:-0.7},
  subheading:{fontSize:13,lineHeight:19,marginTop:6},
  heroCard:{marginBottom:12,padding:20},
  heroLabel:{fontSize:10,fontWeight:'700',letterSpacing:1.2},
  heroValue:{fontSize:36,fontWeight:'700',letterSpacing:-1,marginTop:7},
  heroFooter:{flexDirection:'row',alignItems:'center',gap:9,borderTopWidth:1,marginTop:16,paddingTop:14},
  heroIcon:{width:30,height:30,borderRadius:11,alignItems:'center',justifyContent:'center'},
  heroCaption:{fontSize:12},
  statsGrid: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  sectionCard: { marginBottom: SPACING.md,padding:18 },
  sectionTitle: { fontSize: 15, fontWeight: '600', marginBottom: SPACING.sm },
  comparisonText: { fontSize: 13, lineHeight:20,paddingVertical: SPACING.sm },
  empty: { fontSize: 13, lineHeight:19,textAlign: 'center', paddingVertical: SPACING.lg },
  error:{gap:10,padding:13,borderRadius:14,marginBottom:SPACING.md,borderWidth:1},
});
