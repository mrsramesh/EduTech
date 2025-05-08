// // app/(admin)/upload-lecture.tsx
// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert
// } from 'react-native';
// import * as DocumentPicker from 'expo-document-picker';
// import Toast from 'react-native-toast-message';
// import API from '@/utils/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const UploadLectureScreen = () => {
//   const [courses, setCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [video, setVideo] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [token, setToken] = useState('');

//   useEffect(() => {
//     const fetchToken = async () => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         if (token) {
//           setToken(token);
//         }
//       } catch (error) {
//         console.error('Failed to fetch token:', error);
//       }
//     };
//     fetchToken();
//     const fetchCourses = async () => {
//       try {
//         const res = await API.get('/api/courses');
//         setCourses(res.data || []);
//       } catch (err) {
//         Toast.show({
//           type: 'error',
//           text1: 'Error',
//           text2: 'Could not fetch courses',
//         });
//       }
//     };
//     fetchCourses();
//   }, []);

//   const handlePickVideo = async () => {
//     const result = await DocumentPicker.getDocumentAsync({
//       type: 'video/*',
//     });
//     if (result.type === 'success') {
//       setVideo(result);
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedCourse || !title || !description ) {
//       return Toast.show({
//         type: 'error',
//         text1: 'All fields required',
//         text2: 'Please fill all fields and pick a video',
//       });
//     }

//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('description', description);
//     // formData.append('video', {
//     //   uri: video.uri,
//     //   name: video.name,
//     //   type: 'video/mp4',
//     // });

//     try {
//       setUploading(true);
//       await API.post(`/api/courses/${selectedCourse}/lectures`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}`, },
//       });
//       Toast.show({
//         type: 'success',
//         text1: 'Lecture uploaded',
//       });
//       setTitle('');
//       setDescription('');
//       setVideo(null);
//     } catch (err: any) {
//       Toast.show({
//         type: 'error',
//         text1: 'Upload failed',
//         text2: err.response?.data?.message || 'Something went wrong',
//       });
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.heading}>Upload Lecture</Text>

//       <Text style={styles.label}>Select Course</Text>
//       {courses.map((course: any) => (
//         <TouchableOpacity
//           key={course._id}
//           style={[
//             styles.courseItem,
//             selectedCourse === course._id && styles.selectedCourse,
//           ]}
//           onPress={() => setSelectedCourse(course._id)}
//         >
//           <Text>{course.title}</Text>
//         </TouchableOpacity>
//       ))}

//       <Text style={styles.label}>Lecture Title</Text>
//       <TextInput
//         style={styles.input}
//         value={title}
//         onChangeText={setTitle}
//         placeholder="Enter title"
//       />

//       <Text style={styles.label}>Description</Text>
//       <TextInput
//         style={[styles.input, { height: 80 }]}
//         value={description}
//         onChangeText={setDescription}
//         placeholder="Enter description"
//         multiline
//       />

//       <TouchableOpacity style={styles.pickButton} onPress={handlePickVideo}>
//         <Text style={styles.pickButtonText}>
//           {video ? `Picked: ${video.name}` : 'Pick a video'}
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
//         {uploading ? (
//           <ActivityIndicator color="#FFF" />
//         ) : (
//           <Text style={styles.uploadButtonText}>Upload Lecture</Text>
//         )}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     paddingTop: 40,
//     backgroundColor: '#F8FAFC',
//     flexGrow: 1,
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#2D3748',
//     marginBottom: 24,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginTop: 16,
//     marginBottom: 8,
//     color: '#2D3748',
//   },
//   input: {
//     backgroundColor: 'white',
//     padding: 12,
//     borderRadius: 8,
//     borderColor: '#CBD5E0',
//     borderWidth: 1,
//   },
//   courseItem: {
//     backgroundColor: '#EDF2F7',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   selectedCourse: {
//     backgroundColor: '#BEE3F8',
//   },
//   pickButton: {
//     marginTop: 16,
//     backgroundColor: '#E2E8F0',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   pickButtonText: {
//     color: '#2D3748',
//   },
//   uploadButton: {
//     backgroundColor: '#4C51BF',
//     padding: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 24,
//   },
//   uploadButtonText: {
//     color: 'white',
//     fontWeight: '600',
//   },
// });

// export default UploadLectureScreen;


// ye mera original code hai ,  working 



// app/(admin)/upload-lecture.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import Toast from 'react-native-toast-message';
import API from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

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
        if (token) setToken(token);
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
    const result = await DocumentPicker.getDocumentAsync({ type: 'video/*' });
    if (result.type === 'success') setVideo(result);
  };

  const handleUpload = async () => {
    if (!selectedCourse || !title || !description) {
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
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      Toast.show({ type: 'success', text1: 'Lecture uploaded' });
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
      <Text style={styles.heading}>📚 Upload New Lecture</Text>

      <Text style={styles.label}>Choose a Course</Text>
      <View style={styles.courseList}>
        {courses.map((course: any) => (
          <TouchableOpacity
            key={course._id}
            style={[
              styles.courseItem,
              selectedCourse === course._id && styles.selectedCourse,
            ]}
            onPress={() => setSelectedCourse(course._id)}
            activeOpacity={0.9}
          >
            <Text style={styles.courseText}>{course.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Lecture Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter lecture title"
        placeholderTextColor="#A0AEC0"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
        placeholderTextColor="#A0AEC0"
        multiline
      />

      <TouchableOpacity style={styles.pickButton} onPress={handlePickVideo}>
        <Text style={styles.pickButtonText}>
          {video ? `🎥 Picked: ${video.name}` : '🎬 Pick a Video'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleUpload} disabled={uploading}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.uploadButton}
        >
          {uploading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.uploadButtonText}>🚀 Upload Lecture</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9fc',
    flexGrow: 1,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A202C',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    color: '#2D3748',
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    marginTop: 8,
    fontSize: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  courseList: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  courseItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCourse: {
    backgroundColor: '#90CDF4',
  },
  courseText: {
    color: '#1A202C',
    fontWeight: '600',
  },
  pickButton: {
    marginTop: 20,
    backgroundColor: '#E9D8FD',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  pickButtonText: {
    color: '#553C9A',
    fontWeight: '600',
  },
  uploadButton: {
    marginTop: 30,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  uploadButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default UploadLectureScreen;
