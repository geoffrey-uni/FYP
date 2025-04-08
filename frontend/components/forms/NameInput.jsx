import React from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';

export default function NameInput({ value, setValue, placeholder, theme }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.colors.text }]}>Name</Text>
      <TextInput
        style={[
          styles.textInput,
          { 
            backgroundColor: theme.colors.card, 
            borderColor: theme.colors.border,
            color: theme.colors.text
          }
        ]}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.gray}
      />
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
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 20,
    minHeight: 55,
  },
});