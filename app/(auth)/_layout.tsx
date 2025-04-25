// import { Stack } from 'expo-router';

// export default function AuthLayout() {
//   return (
//     <Stack  >
//     <Stack.Screen name="login" />
//     <Stack.Screen name="signup" />
//     <Stack.Screen name="forgot" />
//     <Stack.Screen name="verifyotp" />
//     <Stack.Screen name="resetpassword" />
//     </Stack>
//   );
// }


import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="forgot" options={{ title: 'Forgot Password' }} />
      <Stack.Screen name="verifyotp" options={{ title: 'Verify OTP' }} />
      <Stack.Screen name="resetpassword" options={{ title: 'Reset Password' }} />
    </Stack>
  );
}