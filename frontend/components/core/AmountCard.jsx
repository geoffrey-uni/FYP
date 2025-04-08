import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { formatCurrency } from '../../utils/formatters';

export default function AmountCard({ label, value, theme, type }) {
  const valueColor = type === 'income' ? theme.colors.income : theme.colors.expense;
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.label, { color: theme.colors.gray }]}>
        {label}
      </Text>
      <Text style={[styles.value, { color: valueColor }]}>
        {formatCurrency(value)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
    shadowColor: 'black',
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
    fontSize: 22,
    fontWeight: 'bold',
  },
});