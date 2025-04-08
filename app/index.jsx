import React from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';

export default function Index() {
  const { isLoading, userToken } = useAuth();
  const { theme } = useTheme();
  
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return userToken ? <Redirect href="/(tabs)/dashboard" /> : <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});