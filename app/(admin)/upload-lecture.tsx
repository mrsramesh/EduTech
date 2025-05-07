// app/(admin)/upload-lecture.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import Toast from 'react-native-toast-message';
import API from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UploadLectureScreen = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setToken(token);
        }
      } catch (error) {
        console.error('Failed to fetch token:', error);
      }
    };
    fetchToken();
    const fetchCourses = async () => {
      try {
        const res = await API.get('/api/courses');
        setCourses(res.data || []);
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Could not fetch courses',
        });
      }
    };
    fetchCourses();
  }, []);

  const handlePickVideo = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'video/*',
    });
    if (result.type === 'success') {
      setVideo(result);
    }
  };

  const handleUpload = async () => {
    if (!selectedCourse || !title || !description ) {
      return Toast.show({
        type: 'error',
        text1: 'All fields required',
        text2: 'Please fill all fields and pick a video',
      });
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    // formData.append('video', {
    //   uri: video.uri,
    //   name: video.name,
    //   type: 'video/mp4',
    // });

    try {
      setUploading(true);
      await API.post(`/api/courses/${selectedCourse}/lectures`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}`, },
      });
      Toast.show({
        type: 'success',
        text1: 'Lecture uploaded',
      });
      setTitle('');
      setDescription('');
      setVideo(null);
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Upload failed',
        text2: err.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Upload Lecture</Text>

      <Text style={styles.label}>Select Course</Text>
      {courses.map((course: any) => (
        <TouchableOpacity
          key={course._id}
          style={[
            styles.courseItem,
            selectedCourse === course._id && styles.selectedCourse,
          ]}
          onPress={() => setSelectedCourse(course._id)}
        >
          <Text>{course.title}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Lecture Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter title"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
        multiline
      />

      <TouchableOpacity style={styles.pickButton} onPress={handlePickVideo}>
        <Text style={styles.pickButtonText}>
          {video ? `Picked: ${video.name}` : 'Pick a video'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        {uploading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.uploadButtonText}>Upload Lecture</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#2D3748',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderColor: '#CBD5E0',
    borderWidth: 1,
  },
  courseItem: {
    backgroundColor: '#EDF2F7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedCourse: {
    backgroundColor: '#BEE3F8',
  },
  pickButton: {
    marginTop: 16,
    backgroundColor: '#E2E8F0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  pickButtonText: {
    color: '#2D3748',
  },
  uploadButton: {
    backgroundColor: '#4C51BF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default UploadLectureScreen;
