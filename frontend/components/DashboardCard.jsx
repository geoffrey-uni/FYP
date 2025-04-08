import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardCard({ 
  title, 
  actionText, 
  actionIcon, 
  onAction, 
  children, 
  isEmpty, 
  emptyText,
  theme 
}) {
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        {actionText && (
          <TouchableOpacity onPress={onAction}>
            <Text style={{ color: theme.colors.primary }}>
              {actionIcon && <Ionicons name={actionIcon} size={16} />} {actionText}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {!isEmpty ? (
        children
      ) : (
        <Text style={[styles.emptyText, { color: theme.colors.gray }]}>
          {emptyText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    padding: 15,
  },
});