import React from 'react';
import { View, Text, useWindowDimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, FONT_SIZES } from '@/constants/theme';
import { Card } from '@/components/ui/Card';

interface WeeklyBarChartProps {
  dataByWeekday: number[];
}

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function WeeklyBarChart({ dataByWeekday }: WeeklyBarChartProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(220, width - SPACING.lg * 4);
  const rgb = colors.accent.match(/[A-Fa-f0-9]{2}/g)?.slice(0, 3).map((part) => parseInt(part, 16)) ?? [33, 131, 58];
  const data = {
    labels: WEEKDAY_LABELS,
    datasets: [{ data: dataByWeekday.map((ms) => Math.round(ms / 60000)) }],
  };
  const hasData = dataByWeekday.some((value) => value > 0);

  return (
    <Card padded style={styles.card}>
      <Text style={[styles.title, { color: colors.text, fontFamily: 'Sora_600SemiBold' }]}>Dias em que você foca</Text>
      <Text style={[styles.subtitle,{color:colors.textMuted}]}>Distribuição do foco por dia da semana</Text>
      {hasData ? (
        <BarChart
          data={data}
          width={chartWidth}
          height={190}
          fromZero
          showValuesOnTopOfBars
          yAxisSuffix="m"
          yAxisLabel=""
          xAxisLabel=""
          withInnerLines
          chartConfig={{
            backgroundColor: colors.surface,
            backgroundGradientFrom: colors.surface,
            backgroundGradientTo: colors.surface,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`,
            labelColor: () => colors.textMuted,
            barPercentage: 0.55,
            propsForBackgroundLines: { stroke: colors.border, strokeDasharray: '3 5' },
            propsForLabels: { fontSize: 10 },
            propsForVerticalLabels: { fontSize: 10 },
          }}
          style={styles.chart}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={[styles.emptyTitle,{color:colors.text}]}>Seu gráfico começa com uma sessão</Text>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>Conclua seu primeiro ciclo de foco para ver seu ritmo semanal.</Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: SPACING.md },
  title: { fontSize: 16, fontWeight: '600' },
  subtitle:{fontSize:12,marginTop:4,marginBottom:SPACING.sm},
  chart: { borderRadius: 14, marginLeft: -8 },
  empty: { alignItems:'center',paddingHorizontal:12,paddingVertical:28,gap:6 },
  emptyTitle:{fontSize:13,fontWeight:'600',textAlign:'center'},
  emptyText: { fontSize: FONT_SIZES.caption, lineHeight:18,textAlign: 'center' },
});
