import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoadingScreen = () => {
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Simulate checking authentication (replace with your actual auth check)
        const userToken = await AsyncStorage.getItem('userToken');
        
        // Simulate network delay (remove in production)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (userToken) {
          setStatus('authenticated');
          router.replace('/(tabs)/home'); // Replace with your home screen
        } else {
          setStatus('unauthenticated');
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error('Auth check failed', error);
        setStatus('unauthenticated');
        router.replace('/(auth)/login');
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <View style={styles.container}>
      {/* App Logo - Uncomment when you have the asset */}
      {/* <Image
        source={require('@/assets/images/edu-logo.png')}
        style={styles.logo}
      /> */}
      
      <Text style={styles.title}>Edu Learning Platform</Text>
      
      <ActivityIndicator 
        size="large" 
        color="#4CAF50" 
        style={styles.loader}
      />
      
      <Text style={styles.subtitle}>
        {status === 'checking' 
          ? 'Checking authentication...' 
          : status === 'authenticated' 
            ? 'Welcome back!' 
            : 'Redirecting to login...'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  loader: {
    marginVertical: 10,
  },
});

export default LoadingScreen;