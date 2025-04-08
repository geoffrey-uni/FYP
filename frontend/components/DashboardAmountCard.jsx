import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { formatCurrency } from '../utils/formatters';

export default function DashboardAmountCard({ label, value, color, theme }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.label, { color: theme.colors.gray }]}>{label}</Text>
      <Text style={[styles.value, { color: color }]}>
        {formatCurrency(value)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});