import React from 'react';
import { StyleSheet, View } from 'react-native';
import SavingsGoalItem from './SavingsGoalItem';

export default function GoalsList({ goals, theme, onGoalPress }) {
  return (
    <View style={styles.goalsList}>
      {goals.map(goal => (
        <SavingsGoalItem 
          key={goal.id} 
          goal={goal} 
          theme={theme}
          onPress={() => onGoalPress(goal)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  goalsList: {
    paddingHorizontal: 15,
  },
});