import React from 'react';
import { Stack } from 'expo-router';
import useTheme from '../../hooks/useTheme';

export default function AuthLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        cardStyle: {
          backgroundColor: theme.colors.background,
        },
        headerShown: false,
      }}
    />
  );
}