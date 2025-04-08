// components/core/TransactionItem.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TransactionItem = ({ transaction, theme }) => {
  const isIncome = transaction.type === 'income';
  const date = new Date(transaction.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formatCurrency = (amount) => {
    return '$' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  const CATEGORY_ICONS = {
    // Income categories
    'Salary': 'cash',
    'Investments': 'trending-up',
    'Other': 'cash',
    
    // Expense categories
    'Food': 'restaurant',
    'Transportation': 'car',
    'Housing': 'home',
    'Entertainment': 'film',
    'Shopping': 'cart',
    'Utilities': 'flash',
    'Healthcare': 'medical',
    'Other Expenses': 'receipt'
  };

  const getIconName = () => {
    if (isIncome) {
      return CATEGORY_ICONS[transaction.category] || 'cash';
    } else {
      return CATEGORY_ICONS[transaction.category] || 'receipt-outline';
    }
  };

  const iconName = getIconName();

  return (
    <View style={[styles.container, { borderBottomColor: theme.colors.border }]}>
      <View style={styles.leftContent}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isIncome
                ? theme.dark ? theme.colors.income + '25' : theme.colors.income + '20'
                : theme.dark ? theme.colors.expense + '25' : theme.colors.expense + '20',
            },
          ]}
        >
          <Ionicons
            name={iconName}
            size={18}
            color={isIncome ? theme.colors.income : theme.colors.expense}
          />
        </View>
        <View style={styles.details}>
          <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>
            {transaction.name}
          </Text>
          <Text style={[styles.date, { color: theme.colors.gray }]}>
            {formattedDate}
          </Text>
        </View>
      </View>
      <Text
        style={[
          styles.amount,
          { color: isIncome ? theme.colors.income : theme.colors.expense },
        ]}
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 5,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 80,
    maxWidth: 100,
    textAlign: 'right',
    flex: 1,
    paddingLeft: 8,
  },
});

export default TransactionItem;