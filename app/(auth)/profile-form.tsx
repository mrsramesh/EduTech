
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '@/utils/api';
import { AUTH_URL } from '@/constants/urls';
import Toast from 'react-native-toast-message';

export default function ProfileForm() {
  const [form, setForm] = useState({
    contact: '',
    address: '',
    gender: '',
    age: '',
    college: '',
    class: '',
  });

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await API.post(AUTH_URL.UPDATE_PROFILE, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Toast.show({ type: 'success', text1: 'Profile updated' });
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Failed to update profile' });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Complete Your Profile</Text>
      <TextInput placeholder="Contact" style={styles.input} onChangeText={(t) => handleChange('contact', t)} />
      <TextInput placeholder="Address" style={styles.input} onChangeText={(t) => handleChange('address', t)} />
      <TextInput placeholder="Gender" style={styles.input} onChangeText={(t) => handleChange('gender', t)} />
      <TextInput placeholder="Age" style={styles.input} onChangeText={(t) => handleChange('age', t)} keyboardType="numeric" />
      <TextInput placeholder="College" style={styles.input} onChangeText={(t) => handleChange('college', t)} />
      <TextInput placeholder="Class" style={styles.input} onChangeText={(t) => handleChange('class', t)} />
      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 22, marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 12, padding: 10, borderRadius: 8 },
});


// router.push('/dashboard');
