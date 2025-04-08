import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function GoalProgressPreview({ currentAmount, targetAmount, theme }) {
  if (!targetAmount || !currentAmount) return null;
  
  const current = parseFloat(currentAmount);
  const target = parseFloat(targetAmount);
  const percentage = Math.min(100, Math.round((current / target) * 100));
  
  return (
    <View style={styles.progressPreview}>
      <View style={styles.progressHeader}>
        <Text style={[styles.progressTitle, { color: theme.colors.text }]}>Progress Preview</Text>
        <Text style={[styles.progressPercentage, { color: theme.colors.text }]}>
          {percentage}%
        </Text>
      </View>
      <View style={[styles.progressBar, { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
        <View
          style={[
            styles.progress,
            {
              backgroundColor: theme.colors.primary,
              width: `${percentage}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressPreview: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
  },
});