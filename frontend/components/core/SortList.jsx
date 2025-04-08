import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SortList({ 
  isVisible, 
  onClose, 
  onSortSelect, 
  currentSortBy, 
  theme,
  transactionType
}) {
  const getCategoryOptions = () => {
    if (transactionType === 'income') {
      return [
        { id: 'Salary', label: 'Salary', icon: 'cash' },
        { id: 'Investments', label: 'Investments', icon: 'trending-up' },
        { id: 'Other', label: 'Other Income', icon: 'wallet' }
      ];
    } else {
      return [
        { id: 'Food', label: 'Food & Drinks', icon: 'restaurant' },
        { id: 'Transportation', label: 'Transportation', icon: 'car' },
        { id: 'Housing', label: 'Housing', icon: 'home' },
        { id: 'Entertainment', label: 'Entertainment', icon: 'film' },
        { id: 'Shopping', label: 'Shopping', icon: 'cart' },
        { id: 'Utilities', label: 'Utilities', icon: 'flash' },
        { id: 'Healthcare', label: 'Healthcare', icon: 'medical' },
        { id: 'Other', label: 'Other Expenses', icon: 'card' }
      ];
    }
  };

  const categoryOptions = getCategoryOptions();

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.card }]}>
          <ScrollView>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Sort By</Text>
            
            <TouchableOpacity
              style={[
                styles.sortOption,
                currentSortBy === 'date' && { backgroundColor: theme.colors.primary + '20' }
              ]}
              onPress={() => {
                onSortSelect('date');
              }}
            >
              <Ionicons
                name='calendar'
                size={20}
                color={currentSortBy === 'date' ? theme.colors.primary : theme.colors.text}
              />
              <Text
                style={[
                  styles.sortOptionText,
                  { color: currentSortBy === 'date' ? theme.colors.primary : theme.colors.text }
                ]}
              >
                Date (Latest - Oldest)
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.sortOption,
                currentSortBy === 'amount' && { backgroundColor: theme.colors.primary + '20' }
              ]}
              onPress={() => {
                onSortSelect('amount');
              }}
            >
              <Ionicons
                name='cash'
                size={20}
                color={currentSortBy === 'amount' ? theme.colors.primary : theme.colors.text}
              />
              <Text
                style={[
                  styles.sortOptionText,
                  { color: currentSortBy === 'amount' ? theme.colors.primary : theme.colors.text }
                ]}
              >
                Amount (Highest - Lowest)
              </Text>
            </TouchableOpacity>
            
            <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Categories</Text>
            
            {categoryOptions.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.sortOption,
                  currentSortBy === `category_${category.id}` && { backgroundColor: theme.colors.primary + '20' }
                ]}
                onPress={() => {
                  onSortSelect(`category_${category.id}`);
                }}
              >
                <Ionicons
                  name={category.icon}
                  size={20}
                  color={currentSortBy === `category_${category.id}` ? theme.colors.primary : theme.colors.text}
                />
                <Text
                  style={[
                    styles.sortOptionText,
                    { color: currentSortBy === `category_${category.id}` ? theme.colors.primary : theme.colors.text }
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxHeight: '80%',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 8,
    paddingLeft: 5,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 8,
  },
  sortOptionText: {
    fontSize: 16,
    marginLeft: 10,
  },
});