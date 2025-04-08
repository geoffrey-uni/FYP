import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function AnalyticsCard({ title, theme, children }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
    position: 'relative',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
});