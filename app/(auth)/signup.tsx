import { View, TextInput, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Image, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useState } from 'react';
import API from '@/utils/api';
import { AUTH_URL } from '@/constants/urls';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';

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
  const [secureText, setSecureText] = useState(true);
  const router = useRouter();

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const pickImage = async () => {
    try {
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

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
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
      
      formData.append('fname', form.fname.trim());
      formData.append('lname', form.lname.trim());
      formData.append('email', form.email.toLowerCase().trim());
      formData.append('password', form.password);
      formData.append('role', form.role);
      
      if (profileImage) {
        if (Platform.OS === 'web') {
          const response = await fetch(profileImage);
          const blob = await response.blob();
          formData.append('profileImage', blob, 'profile.jpg');
        } else {
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

      const response = await axios.post(AUTH_URL.REGISTER, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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
    <LinearGradient
      colors={['#6C63FF', '#4A42E8']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join us to get started</Text>

            {/* Profile Image Picker */}
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <MaterialIcons name="add-a-photo" size={32} color="#6C63FF" />
                  <Text style={styles.placeholderText}>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Form Fields */}
            <View style={styles.inputContainer}>
              <FontAwesome name="user" size={18} color="#6C63FF" style={styles.inputIcon} />
              <TextInput
                placeholder="First Name"
                placeholderTextColor="#999"
                value={form.fname}
                onChangeText={(t) => handleChange('fname', t)}
                style={styles.input}
                autoComplete="given-name"
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome name="user" size={18} color="#6C63FF" style={styles.inputIcon} />
              <TextInput
                placeholder="Last Name"
                placeholderTextColor="#999"
                value={form.lname}
                onChangeText={(t) => handleChange('lname', t)}
                style={styles.input}
                autoComplete="family-name"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={18} color="#6C63FF" style={styles.inputIcon} />
              <TextInput
                placeholder="Email Address"
                placeholderTextColor="#999"
                value={form.email}
                onChangeText={(t) => handleChange('email', t)}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Feather name="lock" size={18} color="#6C63FF" style={styles.inputIcon} />
              <TextInput
                placeholder="Password (min 8 characters)"
                placeholderTextColor="#999"
                value={form.password}
                onChangeText={(t) => handleChange('password', t)}
                style={styles.input}
                secureTextEntry={secureText}
                autoComplete="new-password"
              />
              <TouchableOpacity 
                onPress={() => setSecureText(!secureText)}
                style={styles.eyeIcon}
              >
                <Feather 
                  name={secureText ? "eye-off" : "eye"} 
                  size={20} 
                  color="#6C63FF" 
                />
              </TouchableOpacity>
            </View>

            {/* Role Selection */}
            <Text style={styles.sectionLabel}>Account Type</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[styles.roleOption, form.role === 'student' && styles.selectedRole]}
                onPress={() => handleChange('role', 'student')}
              >
                <Text style={[styles.roleText, form.role === 'student' && styles.selectedRoleText]}>Student</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.roleOption, form.role === 'teacher' && styles.selectedRole]}
                onPress={() => handleChange('role', 'teacher')}
              >
                <Text style={[styles.roleText, form.role === 'teacher' && styles.selectedRoleText]}>Teacher</Text>
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSignup}
              style={[styles.submitButton, loading && styles.buttonDisabled]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.push('/(auth)/login')}
              style={styles.loginLink}
            >
              <Text style={styles.loginText}>Already have an account? <Text style={styles.loginBold}>Log In</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  imagePicker: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#6C63FF',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F4EBFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6C63FF',
  },
  placeholderText: {
    color: '#6C63FF',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  roleOption: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  selectedRole: {
    borderColor: '#6C63FF',
    backgroundColor: '#F4EBFF',
  },
  roleText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  selectedRoleText: {
    color: '#6C63FF',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#6C63FF',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    alignSelf: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginBold: {
    color: '#6C63FF',
    fontWeight: 'bold',
  },
});