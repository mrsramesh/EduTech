
// import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
// import { useState } from 'react';
// import API from '../utils/api';
// import { AUTH_URL } from '../constants/urls';
// import Toast from 'react-native-toast-message';
// import { useRouter } from 'expo-router';

// export default function SignUp() {
//   const [form, setForm] = useState({ fname: '', lname: '', email: '', password: '' ,role: ''});
//   const router = useRouter();

//   const handleChange = (name: string, value: string) => {
//     setForm({ ...form, [name]: value });
//   };

//   const handleSignup = async () => {
//     try {
//       const res = await API.post(AUTH_URL.REGISTER, form);
//       Toast.show({ type: 'success', text1: 'Registered successfully!' });
//       router.replace('/(auth)/login');
//     } catch (err: any) {
//       Toast.show({ type: 'error', text1: err.response?.data?.message || 'Registration failed' });
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Sign Up</Text>
//       <TextInput placeholder="First Name" style={styles.input} onChangeText={(t) => handleChange('fname', t)} />
//       <TextInput placeholder="Last Name" style={styles.input} onChangeText={(t) => handleChange('lname', t)} />
//       <TextInput placeholder="Email" style={styles.input} onChangeText={(t) => handleChange('email', t)} />
//       <TextInput placeholder="Password" style={styles.input} secureTextEntry onChangeText={(t) => handleChange('password', t)} />
//       <TextInput placeholder="Role" style={styles.input} secureTextEntry onChangeText={(t) => handleChange('role', t)} />
//       <Button title="Sign Up" onPress={handleSignup} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: 'center' },
//   heading: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
//   input: { borderWidth: 1, marginBottom: 12, padding: 10, borderRadius: 8 },
// });



import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import API from '../utils/api';
import { AUTH_URL } from '../constants/urls';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

export default function SignUp() {
  const [form, setForm] = useState({ fname: '', lname: '', email: '', password: '', role: '' });
  const router = useRouter();

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSignup = async () => {
    try {
      const res = await API.post(AUTH_URL.REGISTER, form);
      Toast.show({ type: 'success', text1: 'Registered successfully!' });
      router.replace('/(auth)/login');
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err.response?.data?.message || 'Registration failed' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>
      <TextInput placeholder="First Name" style={styles.input} onChangeText={(t) => handleChange('fname', t)} />
      <TextInput placeholder="Last Name" style={styles.input} onChangeText={(t) => handleChange('lname', t)} />
      <TextInput placeholder="Email" style={styles.input} onChangeText={(t) => handleChange('email', t)} />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry onChangeText={(t) => handleChange('password', t)} />

      <Text style={styles.label}>Select Role:</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => handleChange('role', 'student')}
        >
          <View style={styles.radioCircle}>
            {form.role === 'student' && <View style={styles.selectedRb} />}
          </View>
          <Text style={styles.radioText}>Student</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => handleChange('role', 'teacher')}
        >
          <View style={styles.radioCircle}>
            {form.role === 'teacher' && <View style={styles.selectedRb} />}
          </View>
          <Text style={styles.radioText}>Teacher</Text>
        </TouchableOpacity>
      </View>

      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  heading: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 12, padding: 10, borderRadius: 8 },
  label: { fontSize: 16, marginBottom: 8 },
  radioGroup: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  radioButton: { flexDirection: 'row', alignItems: 'center' },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#444',
  },
  radioText: { fontSize: 16 },
});
