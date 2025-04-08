import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AmountInput from './AmountInput';
import DatePicker from './DatePicker';
import SubmitButton from './SubmitButton';
import NameInput from './NameInput';
import GoalProgressPreview from './GoalProgressPreview';
import DeleteButton from './DeleteButton';

export default function GoalForm({
  theme,
  isUpdateMode,
  name,
  setName,
  targetAmount,
  setTargetAmount,
  currentAmount,
  setCurrentAmount,
  targetDate,
  setTargetDate,
  showDatePicker,
  setShowDatePicker,
  submitLoading,
  deleteLoading,
  handleSubmit,
  handleDelete,
  notePlaceholder
}) {
  const validateAndSubmit = () => {
    if (!name || !targetAmount) {
      Alert.alert('Error', 'Please enter a name and target amount');
      return;
    }

    if (isNaN(parseFloat(targetAmount)) || parseFloat(targetAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid target amount');
      return;
    }

    if (currentAmount && (isNaN(parseFloat(currentAmount)) || parseFloat(currentAmount) < 0)) {
      Alert.alert('Error', 'Please enter a valid current amount');
      return;
    }

    const target = parseFloat(targetAmount);
    const current = currentAmount ? parseFloat(currentAmount) : 0;

    if (current > target) {
      Alert.alert('Error', 'Current amount cannot be greater than target amount');
      return;
    }

    handleSubmit();
  };

  const submitButtonText = isUpdateMode ? 'Update Goal' : 'Add Goal';

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
            {/* Goal Name Input */}
            <NameInput 
              value={name}
              setValue={setName}
              placeholder={notePlaceholder}
              theme={theme}
            />
            
            {/* Target Amount Input */}
            <AmountInput
              amount={targetAmount}
              setAmount={setTargetAmount}
              theme={theme}
              label="Target Amount"
            />
            
            {/* Current Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Current Amount {!isUpdateMode && ''}
              </Text>
              <View style={[styles.amountInputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                <Text style={[styles.currencySymbol, { color: theme.colors.gray }]}>$</Text>
                <TextInput
                  style={[styles.amountInput, { color: theme.colors.text }]}
                  value={currentAmount}
                  onChangeText={setCurrentAmount}
                  placeholder="0.00"
                  placeholderTextColor={theme.colors.gray}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
            
            {/* Target Date Picker */}
            <DatePicker
              date={targetDate}
              setDate={setTargetDate}
              showDatePicker={showDatePicker}
              setShowDatePicker={setShowDatePicker}
              theme={theme}
              label="Target Date"
              minimumDate={new Date()} // Can't set target date in the past
            />
            
            {/* Progress Preview */}
            <GoalProgressPreview 
              currentAmount={currentAmount}
              targetAmount={targetAmount}
              theme={theme}
            />
            
            {/* Submit Button */}
            <SubmitButton
              title={submitButtonText}
              onPress={validateAndSubmit}
              loading={submitLoading}
              color={theme.colors.primary}
            />
            
            {/* Delete Button - Only shown in update mode */}
            {isUpdateMode && (
            <DeleteButton
              onPress={handleDelete}
              loading={deleteLoading}
              theme={theme}
              type="Goal"
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
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
  },
  currencySymbol: {
    fontSize: 20,
    paddingHorizontal: 15,
  },
  amountInput: {
    flex: 1,
    height: 50,
    fontSize: 18,
  },
});