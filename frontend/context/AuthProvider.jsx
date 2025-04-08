import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const user = await AsyncStorage.getItem('userData');
        
        if (token && user) {
          setUserToken(token);
          setUserData(JSON.parse(user));
        }
      } catch (e) {
        console.log('Failed to restore authentication state:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  // Login function
  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.login(username, password);
      setUserToken(response.token);
      setUserData({
        id: response.user_id,
        username: response.username,
        email: response.email
      });
      return { success: true };
    } catch (e) {
      const message = e.response?.data?.non_field_errors?.[0] || 'Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (username, email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.register(username, email, password);
      setUserToken(response.token);
      setUserData(response.user);
      return { success: true };
    } catch (e) {
      const message = Object.values(e.response?.data || {}).flat()[0] || 'Registration failed';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    await api.logout();
    
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');
    setUserToken(null);
    setUserData(null);
    setIsLoading(false);
  };

  const value = {
    userToken,
    userData,
    isLoading,
    error,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}