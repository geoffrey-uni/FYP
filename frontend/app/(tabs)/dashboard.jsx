import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import useTheme from '../../hooks/useTheme';
import useAuth from '../../hooks/useAuth';
import * as api from '../../services/api';
import TransactionItem from '../../components/core/TransactionItem';
import SavingsGoalItem from '../../components/core/SavingsGoalItem';
import DashboardAmountSummary from '../../components/DashboardAmountSummary';
import ExpensePieChart from '../../components/ExpensePieChart';
import DashboardCard from '../../components/DashboardCard';
import LoadingIcon from '../../components/core/LoadingIcon';

export default function DashboardScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  const { userToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
    savings: 0,
  });
  const [error, setError] = useState(null);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const isInCurrentMonth = (dateString) => {
    const date = new Date(dateString);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  };

  useEffect(() => {
    fetchData();
  }, [userToken]);

  // Fetch all required data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let transactionsData = [];
      let savingsGoalsData = [];

      try {
        const transactionsRes = await api.getTransactions();
        transactionsData = transactionsRes.data;
        setTransactions(transactionsData);
      } catch (error) {
        setError('Could not load transactions');
      }

      try {
        const savingsGoalsRes = await api.getSavingsGoals();
        savingsGoalsData = savingsGoalsRes.data;
        setSavingsGoals(savingsGoalsData);
      } catch (error) {
        setError('Could not load savings goals');
      }

      // Filter transactions for current month only
      const currentMonthTransactions = transactionsData.filter(t => isInCurrentMonth(t.date));
      
      // Filter savings goals for current month (if they have a date field)
      // If savings goals don't have dates, show all of them
      const currentMonthSavings = savingsGoalsData.filter(g => 
        !g.target_date || isInCurrentMonth(g.target_date)
      );

      // Calculate summary for current month only
      const income = currentMonthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const expenses = currentMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const savings = currentMonthSavings
        .reduce((sum, g) => sum + parseFloat(g.current_amount), 0);

      setSummary({
        income,
        expenses,
        balance: income - expenses,
        savings
      });
    } catch (error) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userToken, isInCurrentMonth]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);
  
  // Current month data for pie chart
  const expenseChartData = transactions
    .filter(t => t.type === 'expense' && isInCurrentMonth(t.date))
    .reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += parseFloat(expense.amount);
      return acc;
    }, {});

  const pieChartData = Object.keys(expenseChartData).map((category, index) => {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    return {
      name: category,
      amount: expenseChartData[category],
      color: colors[index % colors.length],
      legendFontColor: theme.colors.text,
      legendFontSize: 12
    };
  });

  // Get recent transactions - only show current month transactions
  const recentTransactions = [...transactions]
    .filter(t => isInCurrentMonth(t.date))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (loading && !refreshing) {
    return <LoadingIcon theme={theme} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={[]}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <DashboardAmountSummary 
          summaryData={summary} 
          theme={theme}
          title={`${monthNames[currentMonth]} Summary`} 
        />

        <ExpensePieChart 
          title={`${monthNames[currentMonth]} ${currentYear} Expenses`}
          chartData={pieChartData}
          emptyMessage={`No expenses recorded for ${monthNames[currentMonth]} yet.`}
          theme={theme}
          isDarkMode={isDarkMode}
        />

        <DashboardCard
          title={`${monthNames[currentMonth]} Savings Goals`}
          actionText='Add Goal'
          actionIcon='add'
          onAction={() => router.push('/add-goal')}
          isEmpty={savingsGoals.filter(g => !g.target_date || isInCurrentMonth(g.target_date)).length === 0}
          emptyText={`No savings goals for ${monthNames[currentMonth]} yet. Add a goal to get started.`}
          theme={theme}
        >
          <View>
            {savingsGoals
              .filter(g => !g.target_date || isInCurrentMonth(g.target_date))
              .map(goal => (
                <SavingsGoalItem key={goal.id} goal={goal} theme={theme} />
              ))}
          </View>
        </DashboardCard>

        <DashboardCard
          title={`${monthNames[currentMonth]} Transactions`}
          actionText='View All'
          onAction={() => router.push('/expenses')}
          isEmpty={recentTransactions.length === 0}
          emptyText={`No transactions for ${monthNames[currentMonth]} yet.`}
          theme={theme}
        >
          <View>
            {recentTransactions.map(transaction => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                theme={theme}
              />
            ))}
            {refreshing && <ActivityIndicator style={styles.loadingMore} color={theme.colors.primary} />}
          </View>
        </DashboardCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingMore: {
    marginTop: 10,
  },
});