import { View, Text, TextInput, Button, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import API from '../utils/api';
import { AUTH_URL } from '../constants/urls';
import Toast from 'react-native-toast-message';
import { AuthRoutes } from '../constants/routes';

export default function VerifyOTP() {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: 'Please enter the 6-digit OTP'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await API.post(AUTH_URL.VERIFY_OTP, { 
        email: Array.isArray(email) ? email[0] : email, 
        otp 
      });
      
      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'OTP Verified',
          text2: 'You can now reset your password'
        });
        router.push({
          pathname: '/(auth)/resetpassword' as never,
          params: { 
            email: Array.isArray(email) ? email[0] : email,
            resetToken: response.data.resetToken
          }
        });
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      
      let errorMessage = 'Failed to verify OTP';
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
      <Text style={styles.heading}>Verify OTP</Text>
      <Text style={styles.subtitle}>Enter the 6-digit OTP sent to {email}</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button 
          title="Verify OTP" 
          onPress={handleVerifyOTP} 
          disabled={loading}
        />
      )}

      <Pressable onPress={() => router.push('/(auth)/forgot')} style={styles.linkContainer}>
        <Text style={styles.link}>Resend OTP</Text>
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
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 8
  },
  linkContainer: { marginTop: 20, alignItems: 'center' },
  link: { color: 'blue', fontSize: 16 },
});