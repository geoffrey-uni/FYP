import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

export default function FormHeader({ title, onBack, theme }) {
  return (
    <Stack.Screen 
      options={{
        title: title,
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerLeft: () => (
          <TouchableOpacity 
            onPress={onBack}
            style={{ marginRight: 15 }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        ),
      }} 
    />
  );
}