import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';

export default function RegisterScreen() {
  const { register, isLoading } = useAuth();
  const { theme } = useTheme();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const result = await register(username, email, password);
    if (!result.success) {
      Alert.alert('Registration Failed', result.message || 'Please try again with different credentials');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={50}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Ionicons name="cash-outline" size={80} color={theme.colors.primary} />
          <Text style={[styles.title, { color: theme.colors.text }]}>Personal Finance Management Application</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainerGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Username</Text>
            <View style={[styles.inputContainer, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
              <Ionicons name="person-outline" size={20} color={theme.colors.gray} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Enter a username"
                placeholderTextColor={theme.colors.gray}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputContainerGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Email</Text>
            <View style={[styles.inputContainer, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
              <Ionicons name="mail-outline" size={20} color={theme.colors.gray} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.gray}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputContainerGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Password</Text>
            <View style={[styles.inputContainer, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.colors.gray} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Create a password"
                placeholderTextColor={theme.colors.gray}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={theme.colors.gray}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainerGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Confirm Password</Text>
            <View style={[styles.inputContainer, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.colors.gray} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Confirm your password"
                placeholderTextColor={theme.colors.gray}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={theme.colors.gray}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: theme.colors.gray }]}>
              Already have an account?
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={[styles.loginLink, { color: theme.colors.primary }]}>
                  Login
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 5,
  },
  formContainer: {
    width: '100%',
  },
  inputContainerGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 15,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 15,
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 15,
  },
  loginLink: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});