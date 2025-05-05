import { View, Text, TextInput, StyleSheet, Pressable, Image, Animated, Easing } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import API from '@/utils/api';
import { AUTH_URL } from '@/constants/urls';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleForgot = async () => {
    setLoading(true);
    try {
      const res = await API.post(AUTH_URL.FORGOT_PASSWORD, { email });
      Toast.show({
        type: 'success',
        text1: res.data?.message || 'Reset link sent to your email!',
      });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: err.response?.data?.message || 'Failed to send reset link',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#6C63FF', '#4A42E8']} style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>Enter your registered email</Text>

        <View style={styles.inputWrapper}>
          <AntDesign name="mail" size={20} color="#6C63FF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleForgot}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send Reset Link'}</Text>
        </Pressable>

        <View style={styles.footer}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.link}>Back to <Text style={styles.linkBold}>Login</Text></Text>
          </Pressable>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    marginHorizontal: 30,
    padding: 25,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 25,
    backgroundColor: '#FAFAFA',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    color: '#666',
    fontSize: 14,
    marginTop: 10,
  },
  linkBold: {
    fontWeight: 'bold',
    color: '#6C63FF',
  },
});
