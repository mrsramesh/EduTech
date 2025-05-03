import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';

export default function DashboardHome() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createdBy, setCreatedBy] = useState('');

  const handleCreateCourse = async () => {
    if (!title || !description || !createdBy) {
      Toast.show({ type: 'error', text1: 'All fields are required' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/courses/create', {
        title,
        description,
        createdBy,
      });

      Toast.show({ type: 'success', text1: 'Course created successfully' });
      setTitle('');
      setDescription('');
      setCreatedBy('');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error creating course',
        text2: error.response?.data?.message || 'Server error',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Course Name</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter course title"
      />
      <Text style={styles.label}>Course Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter course description"
        multiline
      />
      <Text style={styles.label}>Created By</Text>
      <TextInput
        style={styles.input}
        value={createdBy}
        onChangeText={setCreatedBy}
        placeholder="Instructor name"
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateCourse}>
        <Text style={styles.buttonText}>Create Course</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 10, justifyContent:"center", flex: 10},
  label: { marginTop: 10, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#4C51BF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
