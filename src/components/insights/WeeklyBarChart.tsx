/**
 * WeeklyBarChart — Gráfico de barras de horas focadas por dia da semana
 */

import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { COLORS, SPACING, FONT_SIZES } from '@/constants/theme';
import { Card } from '@/components/ui/Card';

interface WeeklyBarChartProps {
  dataByWeekday: number[]; // array de 7 posições (dom=0 a sáb=6) em ms
}

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const SCREEN_WIDTH = Dimensions.get('window').width;

export function WeeklyBarChart({ dataByWeekday }: WeeklyBarChartProps) {
  const data = {
    labels: WEEKDAY_LABELS,
    datasets: [
      {
        data: dataByWeekday.map((ms) => Math.round(ms / 60000)), // minutos
      },
    ],
  };

  const hasData = dataByWeekday.some((v) => v > 0);

  return (
    <Card padded style={styles.card}>
      <Text style={styles.title}>Minutos Focados por Dia</Text>
      {hasData ? (
        <BarChart
          data={data}
          width={SCREEN_WIDTH - SPACING.lg * 3}
          height={180}
          fromZero
          showValuesOnTopOfBars
          yAxisSuffix="m"
          yAxisLabel=""
          xAxisLabel=""
          chartConfig={{
            backgroundColor: COLORS.surface,
            backgroundGradientFrom: COLORS.surface,
            backgroundGradientTo: COLORS.surface,
            decimalPlaces: 0,
            color: () => COLORS.accent,
            labelColor: () => COLORS.textSecondary,
            barPercentage: 0.6,
            propsForBackgroundLines: {
              stroke: COLORS.border,
            },
          }}
          style={styles.chart}
        />
      ) : (
        <Text style={styles.empty}>Nenhum dado ainda</Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  chart: {
    borderRadius: 8,
  },
  empty: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.body,
    textAlign: 'center',
    paddingVertical: SPACING.xl,
  },
});