import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { formatCurrency } from '../../utils/formatters';

export default function GoalSummaryCard({ totalSaved, totalTarget, theme }) {
  const calculateProgress = () => {
    if (totalTarget === 0) return 0;
    return Math.min(100, (totalSaved / totalTarget) * 100);
  };

  const progressColor = 
    calculateProgress() < 25 ? theme.colors.expense :
    calculateProgress() < 75 ? theme.colors.warning :
    theme.colors.success;

  return (
    <View style={[styles.summaryContainer, { backgroundColor: theme.colors.card }]}>
      <View style={styles.summaryHeader}>
        <View>
          <Text style={[styles.summaryLabel, { color: theme.colors.gray }]}>
            Total Saved
          </Text>
          <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
            {formatCurrency(totalSaved)}
          </Text>
        </View>
        <View>
          <Text style={[styles.summaryLabel, { color: theme.colors.gray }]}>
            Target
          </Text>
          <Text style={[styles.summaryValue, { color: theme.colors.info }]}>
            {formatCurrency(totalTarget)}
          </Text>
        </View>
      </View>
      
      {/* Overall progress bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressLabelContainer}>
          <Text style={[styles.progressLabel, { color: theme.colors.text }]}>
            Overall Progress
          </Text>
          <Text style={[styles.progressPercentage, { color: theme.colors.text }]}>
            {Math.round(calculateProgress())}%
          </Text>
        </View>
        
        <View style={[styles.progressBar, { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
          <View
            style={[
              styles.progress,
              {
                backgroundColor: progressColor,
                width: `${calculateProgress()}%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryContainer: {
    padding: 20,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  summaryLabel: {
    fontSize: 15,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressSection: {
    marginTop: 5,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 14,
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