import React from 'react';
import { StyleSheet, View } from 'react-native';
import DashboardAmountCard from './DashboardAmountCard';

export default function DashboardAmountSummary({ summaryData, theme }) {
  return (
    <View style={styles.container}>
      <DashboardAmountCard 
        label="Income" 
        value={summaryData.income} 
        color={theme.colors.income} 
        theme={theme} 
      />
      <DashboardAmountCard 
        label="Expenses" 
        value={summaryData.expenses} 
        color={theme.colors.expense} 
        theme={theme} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
});