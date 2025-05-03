import { View, TextInput, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Image, Platform } from 'react-native';
import { useState } from 'react';
import API from '@/utils/api';
import { AUTH_URL } from '@/constants/urls';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

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
      // console.log("Calling API:", AUTH_URL.REGISTER);
      // const response = await API.post(AUTH_URL.REGISTER, formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      const response = await axios.post(AUTH_URL.REGISTER, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Signup response:', response.data);
      if (response.data.user) {
        Toast.show({
          type: 'success',
          text1: 'Account created!',
          text2: 'You can now log in'
        });
        router.push('/(auth)/login');
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