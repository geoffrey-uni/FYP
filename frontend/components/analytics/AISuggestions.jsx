import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AISuggestions({ aiSuggestions, theme }) {
  if (!aiSuggestions.suggestions || aiSuggestions.suggestions.length === 0) {
    return (
      <Text style={[styles.emptyText, { color: theme.colors.gray }]}>
        Financial Suggestions are not available right now.
      </Text>
    );
  }

  return (
    <View style={styles.aiContainer}>
      <Text style={[styles.aiText, { color: theme.colors.text }]}>
        {aiSuggestions.message}
      </Text>
      
      {aiSuggestions.suggestions.length > 0 && (
        <View style={styles.suggestionsList}>
          {aiSuggestions.suggestions.map((suggestion, index) => (
            <View key={index} style={styles.suggestionItem}>
              <Ionicons name='checkmark-circle' size={16} color={'green'} style={styles.checkIcon} />
              <Text style={[styles.suggestionText, { color: theme.colors.text }]}>
                {suggestion}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  aiContainer: {
    padding: 5,
  },
  aiText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 15,
  },
  suggestionsList: {
    marginTop: 10,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  checkIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  suggestionText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
  },
  actionButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    padding: 15,
  },
});