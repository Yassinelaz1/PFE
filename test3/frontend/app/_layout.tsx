import React, { useEffect, useState } from 'react';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import 'react-native-reanimated';

export { ErrorBoundary } from 'expo-router';
export const unstable_settings = { initialRouteName: 'login' };

// Prévenir le splash screen tant que les fonts ne sont pas chargées
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [role, setRole] = useState<string | null | undefined>(undefined);

  // Gestion erreur de font
  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  // Cacher splash screen dès que les fonts sont prêtes
  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  // Lire le rôle stocké
  useEffect(() => {
    const loadRole = async () => {
      const savedRole = await AsyncStorage.getItem('role');
      setRole(savedRole || null);
    };
    loadRole();
  }, []);

  if (!fontsLoaded || role === undefined) {
    return null; // ou <Text>Loading...</Text> pour debug
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {role === 'admin' || role === 'user' ? (
          <Stack.Screen name="(tabs)" /> // Tous passent par les tabs
        ) : (
          <Stack.Screen name="login" /> // pas connecté
        )}
      </Stack>
    </ThemeProvider>
  );
}
