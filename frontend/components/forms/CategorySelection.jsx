import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function CategorySelection({ 
  label, 
  options, 
  selectedCategory, 
  setCategory, 
  theme,
  accentColor 
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      <View style={styles.categoryContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.categoryButton,
              { 
                backgroundColor: selectedCategory === option ? accentColor : theme.colors.card,
                borderColor: theme.colors.border
              }
            ]}
            onPress={() => setCategory(option)}
          >
            <Text 
              style={[
                styles.categoryButtonText, 
                { color: selectedCategory === option ? 'white' : theme.colors.text }
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    margin: 5,
  },
  categoryButtonText: {
    fontSize: 14,
  },
});