import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import useTheme from '../hooks/useTheme';
import { useTransactions } from '../hooks/useDataFetch';
import TransactionForm from '../components/forms/TransactionForm';
import FormHeader from '../components/forms/FormHeader';

export default function AddIncomeScreen() {
  const router = useRouter();
  const { transactionId } = useLocalSearchParams();
  const { theme } = useTheme();
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
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
  
  const sources = [
    'Salary', 'Investments', 'Other'
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
        transaction => String(transaction.id) === String(transactionId) && transaction.type === 'income'
      );
      
      if (transactionToUpdate) {
        setAmount(transactionToUpdate.amount.toString());
        setCategory(transactionToUpdate.category);
        setDate(new Date(transactionToUpdate.date));
        setName(transactionToUpdate.name || '');
      } else {
        console.error('Transaction not found. Available transactions:', JSON.stringify(transactions));
        console.error('Looking for transactionId:', transactionId, typeof transactionId);
        Alert.alert('Error', 'Income not found');
        router.back();
      }
    }
  }, [isUpdateMode, transactions, transactionId, router]);

  const handleSubmit = async () => {
    setSubmitLoading(true);
    
    try {
      const incomeData = {
        type: 'income',
        amount: parseFloat(amount),
        category,
        date: date.toISOString().split('T')[0],
        name: name || '',
      };
      
      let result;
      
      if (isUpdateMode) {
        result = await updateTransaction(transactionId, incomeData);
      } else {
        result = await addTransaction(incomeData);
      }
      
      if (result.success) {
        Alert.alert('Success', `Income ${isUpdateMode ? 'updated' : 'added'} successfully`, [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', result.error || `Failed to ${isUpdateMode ? 'update' : 'add'} income`);
      }
    } catch (error) {
      console.error(`Error ${isUpdateMode ? 'updating' : 'adding'} income:`, error);
      Alert.alert('Error', `Failed to ${isUpdateMode ? 'update' : 'add'} income. Please try again.`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isUpdateMode || !transactionId) return;
    
    Alert.alert(
      'Delete Income',
      'Are you sure you want to delete this income?',
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
                Alert.alert('Success', 'Income deleted successfully', [
                  { text: 'OK', onPress: () => router.back() }
                ]);
              } else {
                Alert.alert('Error', result.error || 'Failed to delete income');
                setDeleteLoading(false);
              }
            } catch (error) {
              console.error('Error deleting income:', error);
              Alert.alert('Error', 'Failed to delete income. Please try again.');
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
        <ActivityIndicator size="large" color={theme.colors.success} />
      </View>
    );
  }

  return (
    <>
      <FormHeader 
        title={isUpdateMode ? 'Update Income' : 'Add Income'}
        isUpdateMode={isUpdateMode} 
        onBack={() => router.back()} 
        theme={theme} 
      />
      
      <TransactionForm
        type="income"
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
        categoryOptions={sources}
        categoryLabel="Source"
        buttonColor={theme.colors.primary}
        namePlaceholder="Add a name for this income"
        buttonTitle={isUpdateMode ? "Update Income" : "Add Income"}
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