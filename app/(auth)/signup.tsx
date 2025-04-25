

// import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { useState } from 'react';
// import API from '../utils/api';
// import { AUTH_URL } from '../constants/urls';
// import Toast from 'react-native-toast-message';
// import { useRouter } from 'expo-router';

// export default function SignUp() {
//   const [form, setForm] = useState({ 
//     fname: '', 
//     lname: '', 
//     email: '', 
//     password: '', 
//     role: '' 
//   });
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleChange = (name: string, value: string) => {
//     setForm({ ...form, [name]: value });
//   };

//   const handleSignup = async () => {
//     // Client-side validation
//     if (!form.fname || !form.lname || !form.email || !form.password || !form.role) {
//       Toast.show({
//         type: 'error',
//         text1: 'All fields are required',
//         text2: 'Please fill in all the information'
//       });
//       return;
//     }

//     if (!form.email.includes('@')) {
//       Toast.show({
//         type: 'error',
//         text1: 'Invalid email',
//         text2: 'Please enter a valid email address'
//       });
//       return;
//     }

//     if (form.password.length < 6) {
//       Toast.show({
//         type: 'error',
//         text1: 'Password too short',
//         text2: 'Password must be at least 6 characters'
//       });
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await API.post(AUTH_URL.REGISTER, {
//         fname: form.fname.trim(),
//         lname: form.lname.trim(),
//         email: form.email.toLowerCase().trim(),
//         password: form.password,
//         role: form.role
//       });

//       if (response.data.success) {
//         Toast.show({
//           type: 'success',
//           text1: 'Registration successful!',
//           text2: 'You can now log in with your credentials'
//         });
//         router.replace('/(auth)/login');
//       }
//     } catch (error: any) {
//       console.error('Registration error:', error);
      
//       let errorMessage = 'Registration failed';
//       if (error.response) {
//         errorMessage = error.response.data?.message || 
//                       error.response.data?.errors?.join(', ') || 
//                       `Server error (${error.response.status})`;
//       } else if (error.request) {
//         errorMessage = 'Could not connect to server';
//       }

//       Toast.show({
//         type: 'error',
//         text1: 'Error',
//         text2: errorMessage
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Sign Up</Text>
      
//       <TextInput 
//         placeholder="First Name *" 
//         style={styles.input} 
//         value={form.fname}
//         onChangeText={(t) => handleChange('fname', t)}
//       />
      
//       <TextInput 
//         placeholder="Last Name *" 
//         style={styles.input} 
//         value={form.lname}
//         onChangeText={(t) => handleChange('lname', t)} 
//       />
      
//       <TextInput 
//         placeholder="Email *" 
//         style={styles.input} 
//         value={form.email}
//         onChangeText={(t) => handleChange('email', t)}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
      
//       <TextInput 
//         placeholder="Password (min 6 characters) *" 
//         style={styles.input} 
//         value={form.password}
//         secureTextEntry 
//         onChangeText={(t) => handleChange('password', t)} 
//       />

//       <Text style={styles.label}>Select Role *</Text>
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

//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         <Button 
//           title="Sign Up" 
//           onPress={handleSignup} 
//           disabled={loading}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: 'center' },
//   heading: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
//   input: { 
//     borderWidth: 1, 
//     marginBottom: 12, 
//     padding: 12, 
//     borderRadius: 8,
//     borderColor: '#ccc',
//     fontSize: 16
//   },
//   label: { fontSize: 16, marginBottom: 8, marginTop: 8 },
//   radioGroup: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
//   radioButton: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
//   radioCircle: {
//     height: 22,
//     width: 22,
//     borderRadius: 11,
//     borderWidth: 2,
//     borderColor: '#007AFF',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 8,
//   },
//   selectedRb: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: '#007AFF',
//   },
//   radioText: { fontSize: 16 },
// });


import { View, TextInput, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Image, Platform } from 'react-native';
import { useState } from 'react';
import API from '../utils/api';
import { AUTH_URL } from '../constants/urls';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function SignUp() {
  const [form, setForm] = useState({ 
    fname: '', 
    lname: '', 
    email: '', 
    password: '', 
    role: 'student' 
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const pickImage = async () => {
    try {
      // Request permissions (not needed on web)
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Toast.show({
            type: 'error',
            text1: 'Permission required',
            text2: 'Please allow access to your photo library'
          });
          return;
        }
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        // On web, we can directly use the URI
        if (Platform.OS === 'web') {
          setProfileImage(result.assets[0].uri);
          return;
        }

        // For mobile, we'll use the image as is (removed file system checks for simplicity)
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error selecting image',
        text2: 'Please try again'
      });
    }
  };

  const handleSignup = async () => {
    // Validate inputs
    if (!form.fname.trim() || !form.lname.trim() || !form.email.trim() || !form.password) {
      Toast.show({
        type: 'error',
        text1: 'Missing information',
        text2: 'Please fill all required fields'
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid email',
        text2: 'Please enter a valid email address'
      });
      return;
    }

    if (form.password.length < 8) {
      Toast.show({
        type: 'error',
        text1: 'Weak password',
        text2: 'Password must be at least 8 characters'
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      
      // Append text fields
      formData.append('fname', form.fname.trim());
      formData.append('lname', form.lname.trim());
      formData.append('email', form.email.toLowerCase().trim());
      formData.append('password', form.password);
      formData.append('role', form.role);
      
      // Append image if exists
      if (profileImage) {
        // Different handling for web vs native
        if (Platform.OS === 'web') {
          // For web, we need to convert the URI to a blob
          const response = await fetch(profileImage);
          const blob = await response.blob();
          formData.append('profileImage', blob, 'profile.jpg');
        } else {
          // For native, use the existing approach
          const filename = profileImage.split('/').pop() || `profile_${Date.now()}.jpg`;
          const fileUri = Platform.OS === 'android' 
            ? profileImage.replace('file://', '') 
            : profileImage;

          formData.append('profileImage', {
            uri: fileUri,
            name: filename,
            type: 'image/jpeg',
          } as any);
        }
      }

      // Submit form
      const response = await API.post(AUTH_URL.REGISTER, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: () => formData,
      });

      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Account created!',
          text2: 'You can now log in'
        });
        router.replace('/(auth)/login');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = 'This email is already registered';
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
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
      <Text style={styles.title}>Create Account</Text>
      
      {/* Profile Image Picker */}
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Form Fields */}
      <TextInput
        placeholder="First Name *"
        value={form.fname}
        onChangeText={(t) => handleChange('fname', t)}
        style={styles.input}
        autoComplete="given-name"
      />
      
      <TextInput
        placeholder="Last Name *"
        value={form.lname}
        onChangeText={(t) => handleChange('lname', t)}
        style={styles.input}
        autoComplete="family-name"
      />
      
      <TextInput
        placeholder="Email *"
        value={form.email}
        onChangeText={(t) => handleChange('email', t)}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      
      <TextInput
        placeholder="Password * (min 8 characters)"
        value={form.password}
        onChangeText={(t) => handleChange('password', t)}
        style={styles.input}
        secureTextEntry
        autoComplete="new-password"
      />

      {/* Role Selection */}
      <Text style={styles.sectionLabel}>Account Type</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleOption, form.role === 'student' && styles.selectedRole]}
          onPress={() => handleChange('role', 'student')}
        >
          <Text style={styles.roleText}>Student</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.roleOption, form.role === 'teacher' && styles.selectedRole]}
          onPress={() => handleChange('role', 'teacher')}
        >
          <Text style={styles.roleText}>Teacher</Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSignup}
        style={styles.submitButton}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  imagePicker: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  roleOption: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedRole: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  roleText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});