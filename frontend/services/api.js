import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const isDevice = Constants.executionEnvironment === 'standalone' || 
                 Constants.executionEnvironment === 'storeClient';

const API_URL = Platform.OS === 'android'
  ? (isDevice 
      ? 'http://192.168.1.112:8000/api/'
      : 'http://10.0.2.2:8000/api/')
  : (isDevice
      ? 'http://192.168.1.112:8000/api/'
      : 'http://localhost:8000/api/');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Token ${token}`;
      }
    } catch (error) {
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (username, password) => {
  const response = await api.post('login/', { username, password });
  if (response.data.token) {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.setItem('authToken', response.data.token);
    await AsyncStorage.setItem('userData', JSON.stringify({
      id: response.data.user_id,
      username: response.data.username,
      email: response.data.email
    }));
  }
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await api.post('register/', { username, email, password });
  if (response.data.token) {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.setItem('authToken', response.data.token);
    await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = async () => {
  await AsyncStorage.removeItem('authToken');
  await AsyncStorage.removeItem('userData');
};

// Transaction services
export const getTransactions = () => api.get('transactions/');
export const addTransaction = (data) => api.post('transactions/', data);
export const updateTransaction = (id, data) => api.put(`transactions/${id}/`, data);
export const deleteTransaction = (id) => api.delete(`transactions/${id}/`);

// Savings Goal services
export const getSavingsGoals = () => api.get('savings-goals/');
export const addSavingsGoal = (data) => api.post('savings-goals/', data);
export const updateSavingsGoal = (id, data) => api.put(`savings-goals/${id}/`, data);
export const deleteSavingsGoal = (id) => api.delete(`savings-goals/${id}/`);

// Expense Predictions services
export const getExpensePredictions = () => api.get('expense-predictions/')

// AI Suggestions services
export const getAISuggestions = () => api.get('ai-suggestions/')

export default api;