import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Sora_400Regular,
  Sora_500Medium,
  Sora_600SemiBold,
  Sora_700Bold,
} from '@expo-google-fonts/sora';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { TasksProvider } from '@/hooks/useTasks';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AppDrawerContent } from '@/components/navigation/AppDrawerContent';
import { initDatabase } from '@/services/database';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Sora_400Regular,
    Sora_500Medium,
    Sora_600SemiBold,
    Sora_700Bold,
  });
  const [databaseState, setDatabaseState] = useState<'loading' | 'ready' | 'error'>('loading');

  const initializeDatabase = useCallback(async () => {
    setDatabaseState('loading');
    try {
      await initDatabase();
      setDatabaseState('ready');
    } catch (error) {
      console.error('[RootLayout] database initialization failed', error);
      setDatabaseState('error');
    }
  }, []);

  useEffect(() => { void initializeDatabase(); }, [initializeDatabase]);

  if (!fontsLoaded || databaseState !== 'ready') {
    return (
      <SafeAreaProvider>
        <View style={styles.startup}>
          {databaseState === 'error' ? (
            <>
              <Text style={styles.startupTitle}>Não foi possível iniciar o Pomodu</Text>
              <Text style={styles.startupMessage}>Seus dados locais não foram alterados. Tente novamente.</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => void initializeDatabase()} accessibilityRole="button">
                <Text style={styles.retryText}>Tentar novamente</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <ActivityIndicator color="#21833A" />
              <Text style={styles.startupMessage}>Preparando seu espaço de foco…</Text>
            </>
          )}
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <SettingsProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <TasksProvider>
                <MainNavigator />
              </TasksProvider>
            </GestureHandlerRootView>
          </SettingsProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  startup: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 12, backgroundColor: '#F4F7F2' },
  startupTitle: { color: '#17231A', fontSize: 18, fontWeight: '700', textAlign: 'center' },
  startupMessage: { color: '#667568', fontSize: 14, lineHeight: 20, textAlign: 'center' },
  retryButton: { marginTop: 6, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12, backgroundColor: '#21833A' },
  retryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});

/** Auth gate: checks session, redirects to login if no user */
function MainNavigator() {
  const { user, isLoading } = useAuth();
  const { colors, isDark } = useTheme();

  if (isLoading) return null;

  if (!user) {
    return (
      <>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
        </Stack>
      </>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Drawer
        drawerContent={(props) => <AppDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: 'slide',
          drawerStyle: { backgroundColor: colors.background, width: 280 },
          drawerActiveBackgroundColor: colors.accentSoft,
          drawerActiveTintColor: colors.accent,
          drawerInactiveTintColor: colors.textMuted,
        }}
      >
        <Drawer.Screen name="index" />
        <Drawer.Screen name="tasks" />
        <Drawer.Screen name="insights" />
        <Drawer.Screen name="settings" />
      </Drawer>
    </>
  );
}