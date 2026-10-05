/**
 * ScreenHeader — Strict brand lockup header with hamburger
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';
import { Menu } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface Props { title?: string; children?: React.ReactNode; onMenuPress?: () => void; }

export function ScreenHeader({ title, children, onMenuPress }: Props) {
  const { colors, fontDisplay } = useTheme();
  const nav = useNavigation();
  const handleMenu = onMenuPress ?? (() => { try { (nav as any).openDrawer?.(); } catch {} });

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity
          onPress={handleMenu}
          hitSlop={8}
          style={[styles.menuButton, { backgroundColor: colors.surfaceAlt }]}
          accessibilityRole="button"
          accessibilityLabel="Abrir menu"
        >
          <Menu size={20} color={colors.text} strokeWidth={1.8} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text, fontFamily: fontDisplay }]}>{title ?? 'Pomodu'}</Text>
      </View>
      {children && <View style={styles.right}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, minHeight: 56 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  menuButton: { width: 36, height: 36, padding: 4, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});