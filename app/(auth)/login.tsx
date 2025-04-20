

// import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useState } from 'react';
// import API from '../utils/api'
// import { AUTH_URL } from '../constants/urls';
// import Toast from 'react-native-toast-message';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function LoginScreen() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const router = useRouter();

//   const handleLogin = async () => {
//     try {
//       const res = await API.post(AUTH_URL.LOGIN, { email, password });
//       await AsyncStorage.setItem('token', res.data.token);
//       Toast.show({ type: 'success', text1: 'Login successful!' });
//     //   router.push('/(auth)/profile-form');
//          router.push('/(home)')

//     } catch (err: any) {
//       Toast.show({ type: 'error', text1: err.response?.data?.message || 'Login failed' });
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Login</Text>
//       <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
//       <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
//       <Button title="Login" onPress={handleLogin} />
//       <Pressable onPress={() => router.push('/(auth)/signup')}>
//       {/* <Pressable onPress={() => router.push('/dashboard')}> */}

//         <Text style={styles.link}>Don't have an account? Sign Up</Text>
//       </Pressable>

//       <Pressable onPress={() => router.push('/(auth)/forgot')}>
//       {/* <Pressable onPress={() => router.push('/dashboard')}> */}

//         <Text style={styles.link}>Forget Password </Text>
//       </Pressable>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: 'center' },
//   heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
//   input: { borderWidth: 1, borderRadius: 8, marginBottom: 16, padding: 12 },
//   link: { color: 'blue', marginTop: 10, textAlign: 'center' },
// });
 //    work well but me nichi role based bana rha hu . 




 import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import API from '../utils/api';
import { AUTH_URL } from '../constants/urls';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await API.post(AUTH_URL.LOGIN, { email, password });

      const { token, user } = res.data;

      // Save token and role
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('role', user.role);

      Toast.show({ type: 'success', text1: 'Login successful!' });

console.log('Login Response:', res.data);
console.log('Role:', user.role);
console.log("Login Response:", res.data);
console.log("Role:", res.data?.user?.role);

      // Role-based redirection
      if (user.role === 'teacher') {
        router.push('/dashboard'); // if teacher, go to teacher dashboard
      } else {
        router.push('/(home)'); // student dashboard (admin)/deshboard 
      }

    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: err.response?.data?.message || 'Login failed',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Pressable onPress={() => router.push('/(auth)/signup')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/(auth)/forgot')}>
        <Text style={styles.link}>Forget Password</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderRadius: 8, marginBottom: 16, padding: 12 },
  link: { color: 'blue', marginTop: 10, textAlign: 'center' },
});
