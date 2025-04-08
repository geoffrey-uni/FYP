import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import useTheme from '../../hooks/useTheme';
import { useTransactions } from '../../hooks/useDataFetch';
import TransactionTabsLayout from '../../components/core/TransactionTabsLayout';
import SortList from '../../components/core/SortList';

export default function ExpensesScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { transactions, loading, error, fetchTransactions } = useTransactions();
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortListVisible, setSortListVisible] = useState(false);
  
  const { expenses, totalExpenses } = useMemo(() => {
    const filteredExpenses = transactions.filter(t => t.type === 'expense');
    
    // Sorting
    let sortedExpenses = [...filteredExpenses];
    
    if (sortBy === 'date') {
      sortedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'amount') {
      sortedExpenses.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount)); 
    } else if (sortBy.startsWith('category_')) {
      // Get the specific category we're filtering for
      const categoryFilter = sortBy.replace('category_', '');
      
      // Debugging logs
      console.log("Filtering by category:", categoryFilter);
      console.log("Available categories:", [...new Set(filteredExpenses.map(t => t.category))]);
      
      // Sort by category, then by date
      sortedExpenses = filteredExpenses
        .filter(transaction => transaction.category === categoryFilter)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    const total = filteredExpenses.reduce(
      (sum, expense) => sum + parseFloat(expense.amount), 
      0
    );
    
    return { expenses: sortedExpenses, totalExpenses: total };
  }, [transactions, sortBy]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const handleAddExpense = () => {
    router.push('/add-expense');
  };

  const handleTransactionPress = (transaction) => {
    router.push({
      pathname: '/add-expense',
      params: { transactionId: transaction.id }
    });
  };
  
  // Handle sort selection
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
        transactionType="expense"
      />
      
      <TransactionTabsLayout
        type="expense"
        theme={theme}
        title={sortBy.startsWith('category_') ? `Category: ${sortBy.replace('category_', '')}` : "Expense History"}
        transactions={expenses}
        totalAmount={totalExpenses}
        loading={loading}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onAddPress={handleAddExpense}
        onSortPress={() => setSortListVisible(true)}
        onTransactionPress={handleTransactionPress}
        emptyIconName="receipt-outline"
        
      />
    </>
  );
}