import { Slot, Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
// add redusx files 
import { Provider } from 'react-redux';
import {store} from '../redux/store';
export default function RootLayout() {
  return (
    <>
      <Provider store={store}>
      <Stack 
        screenOptions={{
          // Set default options for all screens here
          headerShown: false,
        }} >
        <Stack.Screen 
          name="(auth)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="(admin)" 
          options={{ 
            headerShown: false,
            animation: 'none'
          }} 
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast />
      <StatusBar style="auto" />
      </Provider>
    </>
  );
}