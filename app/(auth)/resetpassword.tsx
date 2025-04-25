import { View, Text, TextInput, Button, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import API from '../utils/api';
import { AUTH_URL } from '../constants/urls';
import Toast from 'react-native-toast-message';

export default function ResetPassword() {
  const { email, resetToken } = useLocalSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'All fields required',
        text2: 'Please fill in both password fields'
      });
      return;
    }

    if (password.length < 8) {
      Toast.show({
        type: 'error',
        text1: 'Password too short',
        text2: 'Password must be at least 8 characters'
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Passwords don\'t match',
        text2: 'Please make sure both passwords match'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await API.post(AUTH_URL.RESET_PASSWORD, { 
        email: Array.isArray(email) ? email[0] : email,
        resetToken: Array.isArray(resetToken) ? resetToken[0] : resetToken,
        newPassword: password
      });
      
      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Password Reset',
          text2: 'Your password has been reset successfully'
        });
        router.replace('/(auth)/login');
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      let errorMessage = 'Failed to reset password';
      if (error.response) {
        errorMessage = error.response.data?.message || `Error (${error.response.status})`;
      }

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reset Password</Text>
      
      <TextInput
        style={styles.input}
        placeholder="New Password (min 8 characters)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button 
          title="Reset Password" 
          onPress={handleResetPassword} 
          disabled={loading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    marginBottom: 16, 
    padding: 12,
    fontSize: 16
  },
});