import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../../hooks/useTheme';
import useAuth from '../../hooks/useAuth';

export default function TabLayout() {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: logout,
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        
        // for dark/light mode and logout
        headerRight: () => (
          <View style={{ flexDirection: 'row', marginRight: 15 }}>
            <TouchableOpacity
              style={{ padding: 8, marginLeft: 8 }}
              onPress={toggleTheme}
            >
              <Ionicons
                name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 8, marginLeft: 8 }}
              onPress={handleLogout}
            >
              <Ionicons
                name="log-out-outline"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="income"
        options={{
          title: 'Income',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="arrow-down" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}