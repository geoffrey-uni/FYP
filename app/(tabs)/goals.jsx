import React, { useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import useTheme from '../../hooks/useTheme';
import { useSavingsGoals } from '../../hooks/useDataFetch';
import GoalLayout from '../../components/core/GoalLayout';

export default function GoalsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { savingsGoals, loading, error, fetchSavingsGoals, deleteSavingsGoal } = useSavingsGoals();
  const [refreshing, setRefreshing] = useState(false);
  
  const { goals, totalSaved, totalTarget } = useMemo(() => {
    const sortedGoals = [...savingsGoals].sort((a, b) => 
      new Date(a.target_date) - new Date(b.target_date)
    );
    
    const currentTotal = sortedGoals.reduce((sum, goal) => 
      sum + parseFloat(goal.current_amount), 0
    );
    
    const targetTotal = sortedGoals.reduce((sum, goal) => 
      sum + parseFloat(goal.target_amount), 0
    );
    
    return { 
      goals: sortedGoals, 
      totalSaved: currentTotal, 
      totalTarget: targetTotal 
    };
  }, [savingsGoals]);

  useEffect(() => {
    fetchSavingsGoals();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSavingsGoals();
    setRefreshing(false);
  };

  const handleAddGoal = () => {
    router.push('/add-goal');
  };

  const handleGoalPress = (goal) => {
    router.push({
      pathname: '/add-goal',
      params: { goalId: goal.id }
    });
  };

  return (
    <GoalLayout
      theme={theme}
      title="Your Savings Goals"
      goals={goals}
      totalSaved={totalSaved}
      totalTarget={totalTarget}
      loading={loading}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onAddPress={handleAddGoal}
      onGoalPress={handleGoalPress}
      emptyIconName="flag-outline"
    />
  );
}