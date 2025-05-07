import { Slot, Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import { Provider, useDispatch } from 'react-redux';
import { store } from '../redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCredentials } from '@/redux/authSlice';

const queryClient = new QueryClient();

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreSession = async () => {
      const token = await AsyncStorage.getItem('token');
      const role = await AsyncStorage.getItem('role');
      if (token && role) {
        const user = { token, role };
        dispatch(setCredentials({ user, token }));
      }
    };
    restoreSession();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(admin)" />
          <Stack.Screen name="(home)" />
          <Stack.Screen name="+not-found" />
        </Stack>

        <Toast />
        <StatusBar style="auto" />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
