/**
 * Button — Botão temático do Pomodu (consome ThemeContext)
 * Suporta ícone opcional à esquerda do texto
 */

import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  View,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, FONT_SIZES, RADIUS } from '@/constants/theme';

interface ButtonProps {
  title?: string;
  icon?: ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  icon,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const { colors } = useTheme();

  const bgMap: Record<string, string> = {
    primary: colors.accent,
    secondary: colors.surface,
    danger: '#ef4444',
    ghost: 'transparent',
  };

  const textColorMap: Record<string, string> = {
    primary: colors.onAccent,
    secondary: colors.text,
    danger: '#fff',
    ghost: colors.text,
  };

  const heightMap = { sm: 36, md: 48, lg: 56 };
  const fontSizeMap = { sm: FONT_SIZES.caption, md: FONT_SIZES.body, lg: FONT_SIZES.subtitle };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        {
          backgroundColor: bgMap[variant],
          height: heightMap[size],
          opacity: disabled ? 0.4 : 1,
        },
        variant !== 'ghost' && {
          borderWidth: 1,
          borderColor: variant === 'secondary' ? colors.border : 'transparent',
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={textColorMap[variant]} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          {title ? (
            <Text
              style={[
                styles.text,
                { color: textColorMap[variant], fontSize: fontSizeMap[size] },
              ]}
            >
              {title}
            </Text>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
});