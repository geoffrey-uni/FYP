import React from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AmountInput from './AmountInput';
import CategorySelection from './CategorySelection';
import DatePicker from './DatePicker';
import NameInput from './NameInput';
import SubmitButton from './SubmitButton';
import DeleteButton from './DeleteButton';

export default function TransactionForm({
  type,
  isUpdateMode,
  amount,
  setAmount,
  category,
  setCategory,
  date,
  setDate,
  name,
  setName,
  showDatePicker,
  setShowDatePicker,
  loading,
  deleteLoading,
  handleSubmit,
  handleDelete,
  theme,
  categoryOptions,
  categoryLabel,
  buttonColor,
  namePlaceholder,
  buttonTitle,
}) {
  const validateAndSubmit = () => {
    if (!amount || !category) {
      Alert.alert('Error', `Please enter an amount and select a ${type === 'income' ? 'source' : 'category'}`);
      return;
    }

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    handleSubmit();
  };


  const submitButtonLabel = buttonTitle || 
    (isUpdateMode ? `Update ${type === 'income' ? 'Income' : 'Expense'}` : 
      `Add ${type === 'income' ? 'Income' : 'Expense'}`);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.formContainer}>
            <NameInput
              value={name}
              setValue={setName}
              placeholder={namePlaceholder}
              theme={theme}
            />

            <AmountInput
              amount={amount}
              setAmount={setAmount}
              theme={theme}
            />
            
            <CategorySelection
              label={categoryLabel}
              options={categoryOptions}
              selectedCategory={category}
              setCategory={setCategory}
              theme={theme}
              accentColor={buttonColor}
            />
            
            <DatePicker
              date={date}
              setDate={setDate}
              showDatePicker={showDatePicker}
              setShowDatePicker={setShowDatePicker}
              theme={theme}
            />
            
            <SubmitButton
              title={submitButtonLabel}
              onPress={validateAndSubmit}
              loading={loading}
              color={buttonColor}
            />
            
            {isUpdateMode && (
              <DeleteButton
                onPress={handleDelete}
                loading={deleteLoading}
                theme={theme}
                type={type === 'income' ? 'Income' : 'Expense'}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  formContainer: {
    padding: 16,
  },
});