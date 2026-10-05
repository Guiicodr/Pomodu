import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { PomoduBrandLockup } from '@/components/brand/PomoduBrandLockup';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { login, loginAsGuest, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email.trim()) {
      setError('Digite seu e-mail para continuar.');
      return;
    }
    if (!password.trim()) {
      setError('Digite sua senha para continuar.');
      return;
    }
    const result = await login(email.trim(), password);
    if (result) setError(result.message);
    else router.replace('/');
  };

  const handleGuest = async () => {
    await loginAsGuest();
    router.replace('/');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + 28,
            paddingBottom: insets.bottom + 28,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <PomoduBrandLockup size={34} textSize={23} />

          <View style={styles.hero}>
            <Text style={[styles.eyebrow, { color: colors.accent }]}>FOCO COM INTENÇÃO</Text>
            <Text style={[styles.title, { color: colors.text }]}>
              Menos distração.{'\n'}Mais <Text style={{ color: colors.accent }}>presença.</Text>
            </Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Entre para transformar pequenos momentos de foco em grandes conquistas.
            </Text>
          </View>

          <View
            style={[
              styles.formCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.formTitle, { color: colors.text }]}>Boas-vindas de volta</Text>
            <Text style={[styles.formSubtitle, { color: colors.textMuted }]}>
              Entre na sua conta para continuar.
            </Text>

            <View style={styles.form}>
              <View>
                <Text style={[styles.label, { color: colors.text }]}>E-mail</Text>
                <View
                  style={[
                    styles.inputWrap,
                    { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                  ]}
                >
                  <Mail size={18} color={colors.textMuted} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="voce@exemplo.com"
                    placeholderTextColor={colors.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    autoComplete="email"
                    textContentType="emailAddress"
                    returnKeyType="next"
                    accessibilityLabel="E-mail"
                  />
                </View>
              </View>

              <View>
                <Text style={[styles.label, { color: colors.text }]}>Senha</Text>
                <View
                  style={[
                    styles.inputWrap,
                    { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                  ]}
                >
                  <LockKeyhole size={18} color={colors.textMuted} />
                  <TextInput
                    style={[styles.input, styles.passwordInput, { color: colors.text }]}
                    placeholder="Sua senha"
                    placeholderTextColor={colors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    textContentType="password"
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                    accessibilityLabel="Senha"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    hitSlop={8}
                  >
                    {showPassword ? (
                      <EyeOff size={19} color={colors.textMuted} />
                    ) : (
                      <Eye size={19} color={colors.textMuted} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => router.push('/(auth)/forgot-password' as any)}
                activeOpacity={0.7}
                style={styles.forgotLink}
              >
                <Text style={[styles.forgotText, { color: colors.accent }]}>Esqueceu a senha?</Text>
              </TouchableOpacity>

              {error ? (
                <Text
                  style={[
                    styles.errorText,
                    { color: isDark ? '#FCA5A5' : '#B91C1C', backgroundColor: isDark ? 'rgba(239,68,68,0.12)' : '#FEF2F2' },
                  ]}
                  accessibilityRole="alert"
                >
                  {error}
                </Text>
              ) : null}

              <TouchableOpacity
                onPress={handleLogin}
                activeOpacity={0.85}
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel="Entrar"
              >
                <LinearGradient
                  colors={colors.gradientPrimary}
                  style={[styles.primaryButton, isLoading && styles.disabledButton]}
                >
                  {isLoading ? (
                    <ActivityIndicator color={colors.onAccent} />
                  ) : (
                    <>
                      <Text style={[styles.primaryButtonText, { color: colors.onAccent }]}>Entrar</Text>
                      <ArrowRight size={19} color={colors.onAccent} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleGuest}
                activeOpacity={0.75}
                disabled={isLoading}
                style={[
                  styles.guestButton,
                  { borderColor: colors.border, opacity: isLoading ? 0.55 : 1 },
                ]}
              >
                <Text style={[styles.guestText, { color: colors.text }]}>Explorar como convidado</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textMuted }]}>Ainda não tem uma conta?</Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/signup')}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Text style={[styles.footerLink, { color: colors.accent }]}>Criar conta</Text>
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
  content: { width: '100%', maxWidth: 460, alignSelf: 'center' },
  hero: { marginTop: 46, marginBottom: 30 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.7, marginBottom: 12 },
  title: { fontSize: 36, lineHeight: 43, fontWeight: '800', letterSpacing: -1.3 },
  subtitle: { fontSize: 15, lineHeight: 23, marginTop: 12, maxWidth: 360 },
  formCard: { padding: 22, borderRadius: 24, borderWidth: 1 },
  formTitle: { fontSize: 20, fontWeight: '700', letterSpacing: -0.4 },
  formSubtitle: { fontSize: 14, marginTop: 5 },
  form: { gap: 17, marginTop: 24 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  inputWrap: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 14,
  },
  input: { flex: 1, minWidth: 0, paddingVertical: 14, fontSize: 15 },
  passwordInput: { paddingRight: 0 },
  forgotLink: { alignSelf: 'flex-end', marginTop: -6 },
  forgotText: { fontSize: 13, fontWeight: '700' },
  errorText: { fontSize: 13, lineHeight: 19, textAlign: 'center', padding: 10, borderRadius: 10 },
  primaryButton: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 14,
  },
  disabledButton: { opacity: 0.7 },
  primaryButtonText: { fontSize: 16, fontWeight: '700' },
  guestButton: { minHeight: 52, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 14 },
  guestText: { fontSize: 14, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5, marginTop: 24 },
  footerText: { fontSize: 13 },
  footerLink: { fontSize: 13, fontWeight: '700' },
});
