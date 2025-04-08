// app/(tabs)/income.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import useTheme from '../../hooks/useTheme';
import { useTransactions } from '../../hooks/useDataFetch';
import TransactionTabsLayout from '../../components/core/TransactionTabsLayout';
import SortList from '../../components/core/SortList';

export default function IncomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { transactions, loading, fetchTransactions } = useTransactions();
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortListVisible, setSortListVisible] = useState(false);
  
  const { incomes, totalIncome } = useMemo(() => {
    const filteredIncomes = transactions.filter(t => t.type === 'income');
    
    // Sorting
    let sortedIncomes = [...filteredIncomes];
    
    if (sortBy === 'date') {
      sortedIncomes.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'amount') {
      sortedIncomes.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    } else if (sortBy.startsWith('category_')) {
      const categoryFilter = sortBy.replace('category_', '');
      
      // Debugg
      console.log("Filtering by category:", categoryFilter);
      console.log("Available categories:", [...new Set(filteredIncomes.map(t => t.category))]);
      
      // Sort by category then by date
      sortedIncomes = filteredIncomes
        .filter(transaction => transaction.category === categoryFilter)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    const total = filteredIncomes.reduce(
      (sum, income) => sum + parseFloat(income.amount), 
      0
    );
    
    return { incomes: sortedIncomes, totalIncome: total };
  }, [transactions, sortBy]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const handleAddIncome = () => {
    router.push('/add-income');
  };

  const handleTransactionPress = (transaction) => {
    router.push({
      pathname: '/add-income',
      params: { transactionId: transaction.id }
    });
  };
  
  const handleSortSelect = (selected) => {
    console.log("Sort selected:", selected);
    setSortBy(selected);
    setSortListVisible(false);
  };

  return (
    <>
      <SortList 
        isVisible={sortListVisible}
        onClose={() => setSortListVisible(false)}
        onSortSelect={handleSortSelect}
        currentSortBy={sortBy}
        theme={theme}
        transactionType="income"
      />
      
      <TransactionTabsLayout
        type="income"
        theme={theme}
        title={sortBy.startsWith('category_') ? `Category: ${sortBy.replace('category_', '')}` : "Income History"}
        transactions={incomes}
        totalAmount={totalIncome}
        loading={loading}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onAddPress={handleAddIncome}
        onSortPress={() => setSortListVisible(true)}
        onTransactionPress={handleTransactionPress}
        emptyIconName="cash-outline"
      />
    </>
  );
}