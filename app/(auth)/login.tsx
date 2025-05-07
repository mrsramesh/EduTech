
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Pressable, 
  Image, 
  Animated, 
  Easing, 
  Dimensions, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';

import { useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import API from '@/utils/api';
import { AUTH_URL } from '@/constants/urls';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/authSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await API.post(AUTH_URL.LOGIN, { email, password });
      const { token, user } = res.data;
      await AsyncStorage.setItem('token', token);
      console.log(token);
      await AsyncStorage.setItem('role', user.role);
      dispatch(setCredentials({ user, token }));

      Toast.show({ type: 'success', text1: 'Login successful!' });

      if (user.role === 'teacher') {
        router.replace('/(admin)/teacherDashboard');
      } else {
        router.replace('/(tabs)/home');
      }

    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: err.response?.data?.message || 'Login failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#6C63FF', '#4A42E8']}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} 
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }]
              }
            ]}
          >
            <Image 
              source={require('@/assets/images/icon.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            <View style={styles.inputContainer}>
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

              <View style={styles.inputWrapper}>
                <AntDesign name="lock" size={20} color="#6C63FF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry={secureText}
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable 
                  onPress={() => setSecureText(!secureText)}
                  style={styles.eyeIcon}
                >
                  <Feather 
                    name={secureText ? "eye-off" : "eye"} 
                    size={20} 
                    color="#6C63FF" 
                  />
                </Pressable>
              </View>
            </View>

            <Pressable 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Loading...' : 'Sign In'}
              </Text>
            </Pressable>

            <View style={styles.footer}>
              <Pressable onPress={() => router.push('/(auth)/signup')}>
                <Text style={styles.link}>
                  Don't have an account? <Text style={styles.linkBold}>Sign Up</Text>
                </Text>
              </Pressable>
              <Pressable onPress={() => router.push('/(auth)/forgot')}>
                <Text style={styles.link}>Forgot Password?</Text>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    marginHorizontal: width * 0.08,
    padding: width * 0.06,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#FAFAFA',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    color: '#333',
    fontSize: width < 360 ? 14 : 16,
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    backgroundColor: '#6C63FF',
    paddingVertical: width < 360 ? 12 : 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: width < 360 ? 14 : 16,
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
