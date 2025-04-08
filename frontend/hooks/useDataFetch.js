import { useState, useCallback } from 'react';
import * as api from '../services/api';

// For CRUD Operations

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getTransactions();
      setTransactions(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransaction = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.addTransaction(data);
      setTransactions(prev => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError('Failed to add transaction');
      return { success: false, error: err.response?.data || 'An error occurred' };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTransaction = useCallback(async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.updateTransaction(id, data);
      setTransactions(prev => 
        prev.map(item => item.id === id ? response.data : item)
      );
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError('Failed to update transaction');
      return { success: false, error: err.response?.data || 'An error occurred' };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await api.deleteTransaction(id);
      setTransactions(prev => prev.filter(item => item.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction');
      return { success: false, error: err.response?.data || 'An error occurred' };
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    transactions, 
    loading, 
    error, 
    fetchTransactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction 
  };
};

export const useSavingsGoals = () => {
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSavingsGoals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getSavingsGoals();
      setSavingsGoals(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching savings goals:', err);
      setError('Failed to load savings goals');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addSavingsGoal = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.addSavingsGoal(data);
      setSavingsGoals(prev => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error adding savings goal:', err);
      setError('Failed to add savings goal');
      return { success: false, error: err.response?.data || 'An error occurred' };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSavingsGoal = useCallback(async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.updateSavingsGoal(id, data);
      setSavingsGoals(prev => 
        prev.map(item => item.id === id ? response.data : item)
      );
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error updating savings goal:', err);
      setError('Failed to update savings goal');
      return { success: false, error: err.response?.data || 'An error occurred' };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSavingsGoal = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await api.deleteSavingsGoal(id);
      setSavingsGoals(prev => prev.filter(item => item.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting savings goal:', err);
      setError('Failed to delete savings goal');
      return { success: false, error: err.response?.data || 'An error occurred' };
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    savingsGoals, 
    loading, 
    error, 
    fetchSavingsGoals, 
    addSavingsGoal, 
    updateSavingsGoal, 
    deleteSavingsGoal 
  };
};