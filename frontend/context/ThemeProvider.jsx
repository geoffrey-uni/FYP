import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  const theme = {
    dark: isDarkMode,
    colors: isDarkMode
      ? {
        text: 'white',
        background: 'black',
        card: '#2D2D2D',
        primary: 'slateblue',
        income: '#008000',
        expense: '#FF6347',
        warning: '#F6E05E',
        info: '#63B3ED',
        gray: '#718096',
        lightGray: '#4A5568',
        darkGray: '#CBD5E0',
        border: '#444444',
      }
      : {
        text: 'black',
        background: 'white',
        card: '#F5F5F5',
        primary: 'slateblue',
        income: '#008000',
        expense: '#FF6347',
        warning: '#ECC94B',
        info: '#4299E1',
        gray: '#A0AEC0',
        lightGray: '#E2E8F0',
        darkGray: '#4A5568',
        border: '#E2E8F0',
      }
  };

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      } else {
        setIsDarkMode(colorScheme === 'dark');
      }
    };

    loadTheme();
  }, [colorScheme]);

  useEffect(() => {
    AsyncStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}