import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { ADMIN_URL } from '@/constants/urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { useRouter } from 'expo-router';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function DashboardHome() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [token, setToken] = useState('');
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const router = useRouter();

  //  back navigation handle
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.replace('/(admin)/teacherDashboard'); // or router.push if you prefer
        return true;
      };
  
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [])
  );
  
  useEffect(() => {
    const fetchTokenAndUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        console.log(storedToken);
        console.log("user id in create course    " + userId);
        if (storedToken ) {
          setToken(storedToken);
          setCreatedBy(userId);
        }
      } catch (error) {
        console.error('Failed to fetch token or userId:', error);
      }
    };
    fetchTokenAndUser();
  }, []);

  const handleCreateCourse = async () => {
    try {
      if (
        title.trim() === '' ||
        description.trim() === '' ||
        category.trim() === ''
      ) {
        Toast.show({ type: 'error', text1: 'Title, description, and category are required' });
        return;
      }
      console.log('Token:', token);

      const response = await axios.post(
        `${ADMIN_URL.CREATE_COURSE}`,
        {
          title: title.trim(),
          description: description.trim(),
          category: category.trim(),
          price: Number(price),
          createdBy,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response) {
        Toast.show({ type: 'success', text1: 'Course created successfully' });
        setTitle('');
        setDescription('');
        setCategory('');
        setPrice('');
      }
  
    } catch (error) {
      console.error("Course creation error:", error?.response?.data || error.message || error);
      Toast.show({
        type: 'error',
        text1: 'Error creating course',
        text2: error.response?.data?.message || 'Server error',
      });
    }
  };
  

  return (
    <View style={styles.container}>
      {/* back Navigation */}
      <TouchableOpacity onPress={() => router.replace('/(admin)/teacherDashboard')}>
  <Icon name="arrow-back" size={24} color="#4C51BF" />
</TouchableOpacity>

      <Text style={styles.label}>Course Name</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter course title"
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        placeholder="Enter course category"
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Enter course price"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Course Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter course description"
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateCourse}>
        <Text style={styles.buttonText}>Create Course</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingVertical: 24,
    backgroundColor: '#F8FAFC',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    borderRadius: 12,
    marginTop: 6,
    fontSize: 15,
    color: '#2D3748',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  inputFocused: {
    borderColor: '#4C51BF',
    shadowColor: '#4C51BF',
    shadowOpacity: 0.1,
  },
  button: {
    marginTop: 28,
    backgroundColor: '#4C51BF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4C51BF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  secondaryButton: {
    marginTop: 16,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  secondaryButtonText: {
    color: '#4C51BF',
    fontWeight: '600',
    fontSize: 15,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 24,
    letterSpacing: 0.3,
  },
  subheader: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 32,
    lineHeight: 24,
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
  },
  successMessage: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#EBF8FF',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4C51BF',
  },
  successText: {
    color: '#2D3748',
    fontSize: 15,
    fontWeight: '500',
  },
});