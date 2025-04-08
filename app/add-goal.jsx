import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import useTheme from '../hooks/useTheme';
import { useSavingsGoals } from '../hooks/useDataFetch';
import FormHeader from '../components/forms/FormHeader';
import GoalForm from '../components/forms/GoalForm';

export default function AddGoalScreen() {
  const router = useRouter();
  const { goalId } = useLocalSearchParams();
  const { theme } = useTheme();
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const { 
    savingsGoals, 
    loading, 
    error, 
    fetchSavingsGoals, 
    addSavingsGoal, 
    updateSavingsGoal, 
    deleteSavingsGoal 
  } = useSavingsGoals();
  
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Check if in update mode and fetch all goals
  useEffect(() => {
    fetchSavingsGoals();
    
    if (goalId) {
      setIsUpdateMode(true);
    }
  }, [goalId, fetchSavingsGoals]);

  // Once goals are loaded, find the specific goal to update
  useEffect(() => {
    if (isUpdateMode && savingsGoals.length > 0 && goalId) {
      const goalToUpdate = savingsGoals.find(goal => String(goal.id) === String(goalId));
      
      if (goalToUpdate) {
        setName(goalToUpdate.name);
        setTargetAmount(goalToUpdate.target_amount.toString());
        setCurrentAmount(goalToUpdate.current_amount.toString());
        setTargetDate(new Date(goalToUpdate.target_date));
      } else {
        console.error('Goal not found. Available goals:', JSON.stringify(savingsGoals));
        console.error('Looking for goalId:', goalId, typeof goalId);
        Alert.alert('Error', 'Goal not found');
        router.back();
      }
    }
  }, [isUpdateMode, savingsGoals, goalId, router]);

  const handleSubmit = async () => {
    setSubmitLoading(true);
    
    try {
      const goalData = {
        name,
        target_amount: parseFloat(targetAmount),
        current_amount: currentAmount ? parseFloat(currentAmount) : 0,
        target_date: targetDate.toISOString().split('T')[0],
      };
      
      let result;
      
      if (isUpdateMode) {
        result = await updateSavingsGoal(goalId, goalData);
      } else {
        result = await addSavingsGoal(goalData);
      }
      
      if (result.success) {
        Alert.alert('Success', `Savings goal ${isUpdateMode ? 'updated' : 'added'} successfully`, [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', result.error || `Failed to ${isUpdateMode ? 'update' : 'add'} savings goal`);
      }
    } catch (error) {
      console.error(`Error ${isUpdateMode ? 'updating' : 'adding'} savings goal:`, error);
      Alert.alert('Error', `Failed to ${isUpdateMode ? 'update' : 'add'} savings goal. Please try again.`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isUpdateMode || !goalId) return;
    
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setDeleteLoading(true);
            try {
              // Use the hook to delete the goal
              const result = await deleteSavingsGoal(goalId);
              
              if (result.success) {
                Alert.alert('Success', 'Goal deleted successfully', [
                  { text: 'OK', onPress: () => router.back() }
                ]);
              } else {
                Alert.alert('Error', result.error || 'Failed to delete goal');
                setDeleteLoading(false);
              }
            } catch (error) {
              console.error('Error deleting goal:', error);
              Alert.alert('Error', 'Failed to delete goal. Please try again.');
              setDeleteLoading(false);
            }
          }
        }
      ]
    );
  };

  if (loading && isUpdateMode && !name) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <FormHeader 
        title={isUpdateMode ? 'Update Savings Goal' : 'Add Savings Goal'}
        isUpdateMode={isUpdateMode} 
        onBack={() => router.back()} 
        theme={theme} 
      />
      
      <GoalForm
        theme={theme}
        isUpdateMode={isUpdateMode}
        name={name}
        setName={setName}
        targetAmount={targetAmount}
        setTargetAmount={setTargetAmount}
        currentAmount={currentAmount}
        setCurrentAmount={setCurrentAmount}
        targetDate={targetDate}
        setTargetDate={setTargetDate}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        submitLoading={submitLoading}
        deleteLoading={deleteLoading}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        notePlaceholder="Add a name for this goal"
      />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});