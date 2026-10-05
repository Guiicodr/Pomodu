import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Smartphone, MapPin } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface Props { isFaceDown: boolean; locationName?: string | null; }

export function FooterStatus({ isFaceDown, locationName }: Props) {
  const { colors } = useTheme();
  const flipColor = isFaceDown ? colors.accent : colors.textMuted;
  const flipLabel = isFaceDown ? 'Foco ativo' : 'Vire o celular para focar';
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Smartphone size={13} color={flipColor} strokeWidth={1.5} />
        <Text style={[styles.label, { color: flipColor }]}>{flipLabel}</Text>
      </View>
      {locationName && (
        <View style={styles.item}>
          <MapPin size={13} color={colors.textMuted} strokeWidth={1.5} />
          <Text style={[styles.label, { color: colors.textMuted }]}>{locationName}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 18, paddingVertical: 14 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  label: { fontSize: 12, fontWeight: '500' },
});