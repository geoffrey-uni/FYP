import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SortButton({ onPress, theme }) {
  return (
    <TouchableOpacity
      style={[styles.button, { borderColor: theme.colors.border }]}
      onPress={onPress}
    >
      <Ionicons name="funnel-outline" size={16} color={theme.colors.primary} style={styles.icon} />
      <Text style={[styles.buttonText, { color: theme.colors.primary }]}>
        Sort by
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  icon: {
    marginRight: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});