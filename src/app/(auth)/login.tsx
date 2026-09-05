/**
 * Login — Always light mode, Apple/Linear style
 */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, LogIn } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { PomoduBrandLockup } from '@/components/brand/PomoduBrandLockup';
import { lightTheme } from '@/constants/themes';

const C = lightTheme.colors;

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, loginAsGuest, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email.trim()) { setError('Digite seu email'); return; }
    if (!password.trim()) { setError('Digite sua senha'); return; }
    try {
      await login(email.trim(), password);
      router.replace('/');
    } catch (e: any) {
      setError(e.message || 'Erro ao entrar');
    }
  };

  const handleGuest = async () => {
    await loginAsGuest();
    router.replace('/');
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: C.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 }]} keyboardShouldPersistTaps="handled">
        <View style={styles.brandSection}>
          <PomoduBrandLockup size={36} textSize={24} />
          <Text style={[styles.slogan, { color: C.textMuted }]}>Master your time. Stay present.</Text>
        </View>

        <View style={styles.form}>
          <TextInput style={[styles.input, { backgroundColor: C.surface, color: C.text, borderColor: C.border }]}
            placeholder="Email" placeholderTextColor={C.textMuted} value={email} onChangeText={setEmail}
            autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
          <View style={styles.passwordRow}>
            <TextInput style={[styles.input, styles.passwordInput, { backgroundColor: C.surface, color: C.text, borderColor: C.border }]}
              placeholder="Senha" placeholderTextColor={C.textMuted} value={password} onChangeText={setPassword}
              secureTextEntry={!showPassword} autoComplete="password" />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} color={C.textMuted} /> : <Eye size={20} color={C.textMuted} />}
            </TouchableOpacity>
          </View>

          {error ? <Text style={[styles.errorText, { color: '#EF4444' }]}>{error}</Text> : null}

          <TouchableOpacity onPress={handleLogin} activeOpacity={0.8} disabled={isLoading}>
            <LinearGradient colors={C.gradientPrimary} style={styles.ctaBtn}>
              {isLoading ? <ActivityIndicator color="#fff" /> : <LogIn size={20} color="#fff" />}
              <Text style={styles.ctaText}>Entrar</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleGuest} activeOpacity={0.7} style={[styles.guestBtn, { borderColor: C.border }]}>
            <Text style={[styles.guestText, { color: C.textMuted }]}>Continuar como convidado</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: C.textMuted }]}>Nao tem uma conta?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text style={[styles.footerLink, { color: C.accent }]}>  Criar Conta</Text>
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
  brandSection: { alignItems: 'center', gap: 8, marginBottom: 48 },
  slogan: { fontSize: 14, fontWeight: '500', letterSpacing: 0.3 },
  form: { gap: 16 },
  input: { paddingHorizontal: 16, paddingVertical: 16, borderRadius: 14, borderWidth: 1, fontSize: 16 },
  passwordRow: { position: 'relative' },
  passwordInput: { paddingRight: 48 },
  eyeBtn: { position: 'absolute', right: 14, top: 14, padding: 4 },
  errorText: { fontSize: 13, textAlign: 'center' },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 14 },
  ctaText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  guestBtn: { alignItems: 'center', paddingVertical: 14, borderRadius: 14, borderWidth: 1 },
  guestText: { fontSize: 15, fontWeight: '500' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14, fontWeight: '700' },
});