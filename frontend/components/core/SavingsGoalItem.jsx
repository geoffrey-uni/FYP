import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SavingsGoalItem = ({ goal, theme, onPress }) => {
  const progressPercentage = Math.min(
    100,
    Math.round((goal.current_amount / goal.target_amount) * 100)
  );

  const formatCurrency = (amount) => {
    return '$' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  const calculateDaysLeft = () => {
    const today = new Date();
    const targetDate = new Date(goal.target_date);
    const timeDiff = targetDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysLeft > 0 ? `${daysLeft} days left` : 'Overdue';
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      onPress={() => onPress && onPress(goal)}
      activeOpacity={0.7}
    >
      <View style={styles.headerContainer}>
        <Text style={[styles.name, { color: theme.colors.text }]}>{goal.name}</Text>
        <Text style={[styles.percentage, { color: theme.colors.primary }]}>
          {progressPercentage}%
        </Text>
      </View>

      <Text style={[styles.targetInfo, { color: theme.colors.gray }]}>
        Target: {formatCurrency(goal.target_amount)} by {new Date(goal.target_date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
      </Text>

      <View style={[styles.progressBarContainer, { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
        <View
          style={[
            styles.progressBar,
            {
              backgroundColor: theme.colors.primary,
              width: `${progressPercentage}%`,
            },
          ]}
        />
      </View>

      <View style={styles.bottomContainer}>
        <Text style={[styles.currentAmount, { color: theme.colors.text }]}>
          {formatCurrency(goal.current_amount)}
        </Text>
        <Text style={[styles.daysLeft, { color: theme.colors.gray }]}>
          {calculateDaysLeft()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 15,
    marginBottom: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  targetInfo: {
    fontSize: 14,
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  daysLeft: {
    fontSize: 14,
  },
});

export default SavingsGoalItem;