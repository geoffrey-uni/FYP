import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import useTheme from '../hooks/useTheme';
import { useTransactions } from '../hooks/useDataFetch';
import TransactionForm from '../components/forms/TransactionForm';
import FormHeader from '../components/forms/FormHeader';

export default function AddExpenseScreen() {
  const router = useRouter();
  const { transactionId } = useLocalSearchParams();
  const { theme } = useTheme();
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Use the transactions hook
  const { 
    transactions, 
    loading, 
    error, 
    fetchTransactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction 
  } = useTransactions();
  
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [name, setName] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const categories = [
    'Food', 'Housing', 'Transportation', 'Entertainment',
    'Healthcare', 'Shopping', 'Utilities', 'Other'
  ];

  // Check if in update mode and fetch all transactions
  useEffect(() => {
    fetchTransactions();
    
    if (transactionId) {
      setIsUpdateMode(true);
    }
  }, [transactionId, fetchTransactions]);

  // Once transactions are loaded, find the specific transaction to update
  useEffect(() => {
    if (isUpdateMode && transactions.length > 0 && transactionId) {
      const transactionToUpdate = transactions.find(
        transaction => String(transaction.id) === String(transactionId) && transaction.type === 'expense'
      );
      
      if (transactionToUpdate) {
        setAmount(transactionToUpdate.amount.toString());
        setCategory(transactionToUpdate.category);
        setDate(new Date(transactionToUpdate.date));
        setName(transactionToUpdate.name || '');
      } else {
        console.error('Transaction not found. Available transactions:', JSON.stringify(transactions));
        console.error('Looking for transactionId:', transactionId, typeof transactionId);
        Alert.alert('Error', 'Expense not found');
        router.back();
      }
    }
  }, [isUpdateMode, transactions, transactionId, router]);

  const handleSubmit = async () => {
    setSubmitLoading(true);
    
    try {
      const expenseData = {
        type: 'expense',
        amount: parseFloat(amount),
        category,
        date: date.toISOString().split('T')[0],
        name: name || '',
      };
      
      let result;
      
      if (isUpdateMode) {
        result = await updateTransaction(transactionId, expenseData);
      } else {
        result = await addTransaction(expenseData);
      }
      
      if (result.success) {
        Alert.alert('Success', `Expense ${isUpdateMode ? 'updated' : 'added'} successfully`, [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', result.error || `Failed to ${isUpdateMode ? 'update' : 'add'} expense`);
      }
    } catch (error) {
      console.error(`Error ${isUpdateMode ? 'updating' : 'adding'} expense:`, error);
      Alert.alert('Error', `Failed to ${isUpdateMode ? 'update' : 'add'} expense. Please try again.`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isUpdateMode || !transactionId) return;
    
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setDeleteLoading(true);
            try {
              const result = await deleteTransaction(transactionId);
              
              if (result.success) {
                Alert.alert('Success', 'Expense deleted successfully', [
                  { text: 'OK', onPress: () => router.back() }
                ]);
              } else {
                Alert.alert('Error', result.error || 'Failed to delete expense');
                setDeleteLoading(false);
              }
            } catch (error) {
              console.error('Error deleting expense:', error);
              Alert.alert('Error', 'Failed to delete expense. Please try again.');
              setDeleteLoading(false);
            }
          }
        }
      ]
    );
  };
  
  if (loading && isUpdateMode && !amount) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <FormHeader 
        title={isUpdateMode ? 'Update Expense' : 'Add Expense'}
        isUpdateMode={isUpdateMode} 
        onBack={() => router.back()} 
        theme={theme} 
      />
      
      <TransactionForm
        type="expense"
        isUpdateMode={isUpdateMode}
        amount={amount}
        setAmount={setAmount}
        category={category}
        setCategory={setCategory}
        date={date}
        setDate={setDate}
        name={name}
        setName={setName}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        loading={submitLoading}
        deleteLoading={deleteLoading}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        theme={theme}
        categoryOptions={categories}
        categoryLabel="Category"
        buttonColor={theme.colors.primary}
        nameLabel="Name"
        namePlaceholder="Add a name for this expense"
        buttonTitle={isUpdateMode ? "Update Expense" : "Add Expense"}
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