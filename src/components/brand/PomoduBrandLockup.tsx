/**
 * PomoduBrandLockup — Logo via imagem PNG
 * Coloque sua logo em: assets/images/brand/logo.png
 */
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface Props { size?: number; textSize?: number; }

export function PomoduBrandLockup({ size = 28, textSize = 18 }: Props) {
  const { colors, fontDisplay } = useTheme();
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/brand/logo.png')}
        style={{ width: size, height: size, resizeMode: 'contain' }}
      />
      <Text style={[styles.wordmark, { color: colors.text, fontSize: textSize, fontFamily: fontDisplay }]}>Pomodu</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  wordmark: { fontWeight: '700', letterSpacing: -0.5 },
});