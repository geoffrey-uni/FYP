import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NoContent({ theme, type, onAddPress, iconName }) {
  let message = "No data available";
  let buttonText = "Add New Item";
  
  if (type === 'expense') {
    message = "No expenses recorded yet";
    buttonText = "Add Your First Expense";
    iconName = iconName || 'receipt-outline';
  } else if (type === 'income') {
    message = "No income recorded yet";
    buttonText = "Add Your First Income";
    iconName = iconName || 'cash-outline';
  } else if (type === 'goal') {
    message = "No savings goals yet";
    buttonText = "Create Your First Goal";
    iconName = iconName || 'flag-outline';
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <Ionicons 
        name={iconName}
        size={64} 
        color={theme.colors.gray} 
        style={styles.icon}
      />
      <Text style={[styles.text, { color: theme.colors.gray }]}>
        {message}
      </Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={onAddPress}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 15,
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  icon: {
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});