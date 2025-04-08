import React from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';

export default function AmountInput({ amount, setAmount, theme, label = 'Amount' }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      <View style={[styles.amountInputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.currencySymbol, { color: theme.colors.gray }]}>$</Text>
        <TextInput
          style={[styles.amountInput, { color: theme.colors.text }]}
          value={amount}
          onChangeText={setAmount}
          placeholder='0.00'
          placeholderTextColor={theme.colors.gray}
          keyboardType='decimal-pad'
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 55,
  },
  currencySymbol: {
    fontSize: 20,
    paddingHorizontal: 15,
  },
  amountInput: {
    flex: 1,
    height: 55,
    fontSize: 20,
  },
});