import { Slot, Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';

// Create query client
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}