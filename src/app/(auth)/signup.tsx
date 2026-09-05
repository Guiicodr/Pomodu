/**
 * Sign Up — High-fidelity registration screen
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, UserPlus } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { PomoduBrandLockup } from '@/components/brand/PomoduBrandLockup';

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { signup, isLoading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setError('');
    if (!displayName.trim()) { setError('Digite seu nome'); return; }
    if (!email.trim()) { setError('Digite seu email'); return; }
    if (password.length < 6) { setError('Senha deve ter no minimo 6 caracteres'); return; }
    try {
      await signup(displayName.trim(), email.trim(), password);
      router.replace('/');
    } catch (e: any) {
      setError(e.message || 'Erro ao criar conta');
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 }]} keyboardShouldPersistTaps="handled">
        <View style={styles.brandSection}>
          <PomoduBrandLockup size={32} textSize={22} />
          <Text style={[styles.title, { color: colors.text }]}>Criar Conta</Text>
          <Text style={[styles.slogan, { color: colors.textMuted }]}>Comece sua jornada de foco</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder="Nome completo"
            placeholderTextColor={colors.textMuted}
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
          />
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder="Email"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              placeholder="Senha (min. 6 caracteres)"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} color={colors.textMuted} /> : <Eye size={20} color={colors.textMuted} />}
            </TouchableOpacity>
          </View>

          {error ? <Text style={[styles.errorText, { color: '#EF4444' }]}>{error}</Text> : null}

          <TouchableOpacity onPress={handleSignup} activeOpacity={0.8} disabled={isLoading}>
            <LinearGradient colors={colors.gradientPrimary} style={styles.ctaBtn}>
              {isLoading ? <ActivityIndicator color="#fff" /> : <UserPlus size={20} color="#fff" />}
              <Text style={styles.ctaText}>Criar Conta</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textMuted }]}>Ja tem uma conta?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={[styles.footerLink, { color: colors.accent }]}>  Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24 },
  brandSection: { alignItems: 'center', gap: 8, marginBottom: 40 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  slogan: { fontSize: 14, fontWeight: '500', letterSpacing: 0.3 },
  form: { gap: 14 },
  input: { paddingHorizontal: 16, paddingVertical: 16, borderRadius: 14, borderWidth: 1, fontSize: 16 },
  passwordRow: { position: 'relative' },
  passwordInput: { paddingRight: 48 },
  eyeBtn: { position: 'absolute', right: 14, top: 14, padding: 4 },
  errorText: { fontSize: 13, textAlign: 'center' },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 14 },
  ctaText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14, fontWeight: '700' },
});