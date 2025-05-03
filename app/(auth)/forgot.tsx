import { View, Text, TextInput, Button, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import API from '@/utils/api';
import { AUTH_URL } from '@/constants/urls';
import Toast from 'react-native-toast-message';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetRequest = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Email required',
        text2: 'Please enter your email address'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await API.post(AUTH_URL.FORGOT_PASSWORD, { email });
      
      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'OTP Sent',
          text2: 'Check your email for the OTP'
        });
        router.push({
          pathname: '/(auth)/verifyotp' as never,
          params: { email }
        });
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);
      
      let errorMessage = 'Failed to send OTP';
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
      <Text style={styles.heading}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your email to receive a password reset OTP</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button 
          title="Send OTP" 
          onPress={handleResetRequest} 
          disabled={loading}
        />
      )}

      <Pressable onPress={() => router.push('/(auth)/login')} style={styles.linkContainer}>
        <Text style={styles.link}>Back to Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    marginBottom: 20, 
    padding: 12,
    fontSize: 16
  },
  linkContainer: { marginTop: 20, alignItems: 'center' },
  link: { color: 'blue', fontSize: 16 },
});