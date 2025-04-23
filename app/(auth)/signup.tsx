
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



// import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
// import { useState } from 'react';
// import API from '../utils/api';
// import { AUTH_URL } from '../constants/urls';
// import Toast from 'react-native-toast-message';
// import { useRouter } from 'expo-router';

// export default function SignUp() {
//   const [form, setForm] = useState({ fname: '', lname: '', email: '', password: '', role: '' });
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

//       <Text style={styles.label}>Select Role:</Text>
//       <View style={styles.radioGroup}>
//         <TouchableOpacity
//           style={styles.radioButton}
//           onPress={() => handleChange('role', 'student')}
//         >
//           <View style={styles.radioCircle}>
//             {form.role === 'student' && <View style={styles.selectedRb} />}
//           </View>
//           <Text style={styles.radioText}>Student</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.radioButton}
//           onPress={() => handleChange('role', 'teacher')}
//         >
//           <View style={styles.radioCircle}>
//             {form.role === 'teacher' && <View style={styles.selectedRb} />}
//           </View>
//           <Text style={styles.radioText}>Teacher</Text>
//         </TouchableOpacity>
//       </View>

//       <Button title="Sign Up" onPress={handleSignup} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: 'center' },
//   heading: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
//   input: { borderWidth: 1, marginBottom: 12, padding: 10, borderRadius: 8 },
//   label: { fontSize: 16, marginBottom: 8 },
//   radioGroup: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
//   radioButton: { flexDirection: 'row', alignItems: 'center' },
//   radioCircle: {
//     height: 20,
//     width: 20,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#444',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 8,
//   },
//   selectedRb: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: '#444',
//   },
//   radioText: { fontSize: 16 },
// });


import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import API from '../utils/api';
import { AUTH_URL } from '../constants/urls';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

export default function SignUp() {
  const [form, setForm] = useState({ 
    fname: '', 
    lname: '', 
    email: '', 
    password: '', 
    role: '' 
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSignup = async () => {
    // Client-side validation
    if (!form.fname || !form.lname || !form.email || !form.password || !form.role) {
      Toast.show({
        type: 'error',
        text1: 'All fields are required',
        text2: 'Please fill in all the information'
      });
      return;
    }

    if (!form.email.includes('@')) {
      Toast.show({
        type: 'error',
        text1: 'Invalid email',
        text2: 'Please enter a valid email address'
      });
      return;
    }

    if (form.password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Password too short',
        text2: 'Password must be at least 6 characters'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await API.post(AUTH_URL.REGISTER, {
        fname: form.fname.trim(),
        lname: form.lname.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
        role: form.role
      });

      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Registration successful!',
          text2: 'You can now log in with your credentials'
        });
        router.replace('/(auth)/login');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed';
      if (error.response) {
        errorMessage = error.response.data?.message || 
                      error.response.data?.errors?.join(', ') || 
                      `Server error (${error.response.status})`;
      } else if (error.request) {
        errorMessage = 'Could not connect to server';
      }

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>
      
      <TextInput 
        placeholder="First Name *" 
        style={styles.input} 
        value={form.fname}
        onChangeText={(t) => handleChange('fname', t)}
      />
      
      <TextInput 
        placeholder="Last Name *" 
        style={styles.input} 
        value={form.lname}
        onChangeText={(t) => handleChange('lname', t)} 
      />
      
      <TextInput 
        placeholder="Email *" 
        style={styles.input} 
        value={form.email}
        onChangeText={(t) => handleChange('email', t)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput 
        placeholder="Password (min 6 characters) *" 
        style={styles.input} 
        value={form.password}
        secureTextEntry 
        onChangeText={(t) => handleChange('password', t)} 
      />

      <Text style={styles.label}>Select Role *</Text>
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

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button 
          title="Sign Up" 
          onPress={handleSignup} 
          disabled={loading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  heading: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  input: { 
    borderWidth: 1, 
    marginBottom: 12, 
    padding: 12, 
    borderRadius: 8,
    borderColor: '#ccc',
    fontSize: 16
  },
  label: { fontSize: 16, marginBottom: 8, marginTop: 8 },
  radioGroup: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  radioButton: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
  radioCircle: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  radioText: { fontSize: 16 },
});