import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function ChartViewTabs({ timePeriod, setTimePeriod, theme }) {
  return (
    <View style={styles.timePeriodTabsContainer}>
      <TouchableOpacity 
        style={[
          styles.timePeriodTab, 
          timePeriod === 'week' && styles.activeTimePeriodTab,
          { borderColor: theme.colors.primary }
        ]}
        onPress={() => setTimePeriod('week')}
      >
        <Text style={[
          styles.timePeriodText, 
          timePeriod === 'week' && styles.activeTimePeriodText,
          { color: timePeriod === 'week' ? theme.colors.primary : theme.colors.text }
        ]}>Week</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.timePeriodTab, 
          timePeriod === 'month' && styles.activeTimePeriodTab,
          { borderColor: theme.colors.primary }
        ]}
        onPress={() => setTimePeriod('month')}
      >
        <Text style={[
          styles.timePeriodText, 
          timePeriod === 'month' && styles.activeTimePeriodText,
          { color: timePeriod === 'month' ? theme.colors.primary : theme.colors.text }
        ]}>Month</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.timePeriodTab, 
          timePeriod === 'year' && styles.activeTimePeriodTab,
          { borderColor: theme.colors.primary }
        ]}
        onPress={() => setTimePeriod('year')}
      >
        <Text style={[
          styles.timePeriodText, 
          timePeriod === 'year' && styles.activeTimePeriodText,
          { color: timePeriod === 'year' ? theme.colors.primary : theme.colors.text }
        ]}>Year</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  timePeriodTabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  timePeriodTab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeTimePeriodTab: {
    backgroundColor: 'rgba(47, 80, 228, 0.1)',
    borderWidth: 1,
  },
  timePeriodText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTimePeriodText: {
    fontWeight: 'bold',
  },
});