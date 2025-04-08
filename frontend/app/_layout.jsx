import React, { useEffect } from 'react';
import { useRouter, useSegments, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider } from '../context/ThemeProvider';
import { AuthProvider } from '../context/AuthProvider';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useTheme from '../hooks/useTheme';
import useAuth from '../hooks/useAuth';

function RootLayoutNav() {
  const { userToken, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();

  useEffect(() => {
    if (isLoading) return;
    // Check if the user is authenticated
    const inAuthGroup = segments[0] === '(auth)';
    

    if (!userToken && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (userToken && inAuthGroup) {
      router.replace('/(tabs)/dashboard');
    }
  }, [userToken, segments, isLoading]);

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: theme?.colors?.background || '#FFFFFF',
          },
          headerTintColor: theme?.colors?.text || '#000000',
          headerLeft: () => (
            navigation.canGoBack() ? (
              <TouchableOpacity 
                onPress={() => navigation.goBack()}
                style={{ marginRight: 15 }}
              >
                <Ionicons name="chevron-back" size={24} color={theme?.colors?.text || '#000000'} />
              </TouchableOpacity>
            ) : null
          ),
        })}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        <Stack.Screen 
          name="add-expense" 
          options={{ 
            title: "Add Expense",
            animation: "slide_from_right",
          }} 
        />
        <Stack.Screen 
          name="add-income" 
          options={{ 
            title: "Add Income",
            animation: "slide_from_right",
          }} 
        />
        <Stack.Screen 
          name="add-goal" 
          options={{ 
            title: "Add Savings Goal",
            animation: "slide_from_right",
          }} 
        />
        
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}