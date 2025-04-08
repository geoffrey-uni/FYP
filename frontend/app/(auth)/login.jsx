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

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const { theme } = useTheme();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    const result = await login(username, password);
    if (!result.success) {
      Alert.alert('Login Failed', result.message || 'Incorrect username or password');
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
          <Ionicons name='cash-outline' size={80} color={theme.colors.primary} />
          <Text style={[styles.title, { color: theme.colors.text }]}>Personal Finance Management Application</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainerGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Username</Text>
            <View style={[styles.inputContainer, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
              <Ionicons name='person-outline' size={20} color={theme.colors.gray} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder='Enter your username'
                placeholderTextColor={theme.colors.gray}
                value={username}
                onChangeText={setUsername}
                autoCapitalize='none'
              />
            </View>
          </View>

          <View style={styles.inputContainerGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Password</Text>
            <View style={[styles.inputContainer, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
              <Ionicons name='lock-closed-outline' size={20} color={theme.colors.gray} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder='Enter your password'
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

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color='white' />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, { color: theme.colors.gray }]}>
              Don't have an account?
            </Text>
            <Link href='/(auth)/register' asChild>
              <TouchableOpacity>
                <Text style={[styles.registerLink, { color: theme.colors.primary }]}>
                  Register
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
    padding: 25,
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
  formContainer: {
    width: '100%',
  },
  inputContainerGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 15,
    marginBottom: 8,
    fontWeight: 'bold',
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 15,
  },
  registerLink: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});