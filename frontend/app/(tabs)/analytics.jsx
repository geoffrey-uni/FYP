import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../../hooks/useTheme';
import useAuth from '../../hooks/useAuth';
import * as api from '../../services/api';
import LoadingIcon from '../../components/core/LoadingIcon';
import ChartViewTabs from '../../components/analytics/ChartViewTabs';
import ExpenseLineChart from '../../components/analytics/ExpenseLineChart';
import AISuggestions from '../../components/analytics/AISuggestions';
import AnalyticsCard from '../../components/analytics/AnalyticsCard';

export default function AnalyticsScreen() {
  const { theme, isDarkMode } = useTheme();
  const { userToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Predictions data from backend
  const [predictionData, setPredictionData] = useState(null);
  
  // Time period state
  const [timePeriod, setTimePeriod] = useState('month');

  // AI suggestions state (simplified)
  const [aiSuggestions, setAiSuggestions] = useState({
    message: "Loading financial insights...",
    suggestions: []
  });
  
  useEffect(() => {
    fetchData();
  }, [userToken]);
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Expense predictions
      const predictionsRes = await api.getExpensePredictions();
      setPredictionData(predictionsRes.data);
      
      // AI Suggestions
      const aiSuggestionsRes = await api.getAISuggestions();
      if (aiSuggestionsRes.data?.suggestions) {
        const suggestionsArray = aiSuggestionsRes.data.suggestions;
        
        const defaultMessage = "Based on your financial data, here are some suggestions to help manage your finance.";
        
        setAiSuggestions({
          message: defaultMessage,
          suggestions: suggestionsArray
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load analytics data');
      
      // Backup suggestions in case of error
      setAiSuggestions({
        message: "We couldn't analyze your financial data at this time, but here are some general tips:",
        suggestions: [
          "Creating a budget helps track expenses and avoid overspending.",
          "Try to save at least 10-15% of your income for long-term goals.",
          "Review your spending regularly to identify areas where you can cut back."
        ]
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userToken]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  // Display loading state
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
        contentContainerStyle={styles.scrollContent}
      >
        {/* Error message (if any) */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </Text>
          </View>
        )}

        <AnalyticsCard
          title={timePeriod === 'week' ? 'This Week Expense Trends' : 
                 timePeriod === 'year' ? `${new Date().getFullYear()} Expense Trends` : 
                 `${new Date().toLocaleString('default', {month: 'long'})} ${new Date().getFullYear()} Expense Trends`}
          theme={theme}
        >
          <ChartViewTabs 
            timePeriod={timePeriod} 
            setTimePeriod={setTimePeriod} 
            theme={theme} 
          />
          
          <ExpenseLineChart 
            predictionData={predictionData} 
            timePeriod={timePeriod} 
            theme={theme} 
            isDarkMode={isDarkMode} 
          />
        </AnalyticsCard>

        <AnalyticsCard
          title="Financial Suggestions"
          theme={theme}
        >
          <AISuggestions 
            aiSuggestions={aiSuggestions} 
            theme={theme} 
          />
        </AnalyticsCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  errorContainer: {
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  errorText: {
    textAlign: 'center',
    fontWeight: '500',
  }
});