import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack  screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login"  />
      <Stack.Screen name="signup"  />
      <Stack.Screen name="forgot" />
      <Stack.Screen name="verifyotp" />
      <Stack.Screen name="resetpassword" options={{ headerShown: false }} />
    </Stack>
  );
}