// import { View, Text, Button, StyleSheet } from 'react-native';
// import { useEffect, useState } from 'react';
// import {checkAuth, logout} from '../app/utils/auth'
// import { useRouter } from 'expo-router';
// import Toast from 'react-native-toast-message';

// export default function Dashboard() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const validate = async () => {
//       const isAuth = await checkAuth();
//       if (!isAuth) {
//         Toast.show({ type: 'error', text1: 'Please login first' });
//        // router.replace('/(auth)/login');
//       } else {
//         setLoading(false);
//       }
//     };
//     validate();
//   }, []);

//   const handleLogout = async () => {
//     await logout();
//     Toast.show({ type: 'success', text1: 'Logged out successfully' });
//     router.replace('/(auth)/login');
//   };

//   if (loading) return <Text style={styles.loading}>Checking login...</Text>;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to EduTech Dashboard 🎓 12346</Text>
//       <Button title="Logout" onPress={handleLogout} />
       

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: 'center' },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
//   loading: { flex: 1, justifyContent: 'center', textAlign: 'center', fontSize: 18 },
// });



import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  FlatList,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { checkAuth, logout } from '@/utils/auth';
import Toast from 'react-native-toast-message';
import { AntDesign, Feather, MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
//import API from '../app/utils/api';
import API from '../utils/api'
import AsyncStorage from '@react-native-async-storage/async-storage';

type Course = {
  _id: string;
  title: string;
  description: string;
  price: number;
  studentsEnrolled: number;
  thumbnail?: string;
  category: string;
};

type Lecture = {
  _id: string;
  title: string;
  duration: string;
  videoUrl: string;
};

type Student = {
  _id: string;
  name: string;
  email: string;
  enrolledDate: string;
};

export default function TeacherDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLectureModal, setShowLectureModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Form states
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [courseCategory, setCourseCategory] = useState('Development');
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureDuration, setLectureDuration] = useState('');
  const [lectureVideoUrl, setLectureVideoUrl] = useState('');

  useEffect(() => {
    const validate = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        Toast.show({ type: 'error', text1: 'Please login first' });
        router.replace('/(auth)/login');
      } else {
        fetchTeacherData();
      }
    };
    validate();
  }, []);

  const fetchTeacherData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch teacher profile
      const profileResponse = await API.get('/api/teachers/me');
      setUser(profileResponse.data);
      
      // Fetch teacher's courses
      const coursesResponse = await API.get('/api/teachers/courses');
      setCourses(coursesResponse.data);
      
      // Fetch enrolled students
      const studentsResponse = await API.get('/api/teachers/students');
      setStudents(studentsResponse.data);
      
      setLoading(false);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to load data' });
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await logout();
    Toast.show({ type: 'success', text1: 'Logged out successfully' });
    router.replace('/(auth)/login');
  };

  const handleCreateCourse = async () => {
    try {
      const response = await API.post('/api/courses', {
        title: courseTitle,
        description: courseDescription,
        price: parseFloat(coursePrice),
        category: courseCategory
      });
      
      setCourses([...courses, response.data]);
      setShowCourseModal(false);
      resetCourseForm();
      Toast.show({ type: 'success', text1: 'Course created successfully' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to create course' });
    }
  };

  const handleAddLecture = async () => {
    if (!selectedCourse) return;
    
    try {
      const response = await API.post(`/api/courses/${selectedCourse._id}/lectures`, {
        title: lectureTitle,
        duration: lectureDuration,
        videoUrl: lectureVideoUrl
      });
      
      // Update the local courses state if needed
      Toast.show({ type: 'success', text1: 'Lecture added successfully' });
      setShowLectureModal(false);
      resetLectureForm();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to add lecture' });
    }
  };

  const resetCourseForm = () => {
    setCourseTitle('');
    setCourseDescription('');
    setCoursePrice('');
    setCourseCategory('Development');
  };

  const resetLectureForm = () => {
    setLectureTitle('');
    setLectureDuration('');
    setLectureVideoUrl('');
    setSelectedCourse(null);
  };

  const renderDashboard = () => (
    <View style={styles.contentContainer}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{courses.length}</Text>
          <Text style={styles.statLabel}>Total Courses</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {courses.reduce((sum, course) => sum + course.studentsEnrolled, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Students</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            ${courses.reduce((sum, course) => sum + (course.price * course.studentsEnrolled), 0)}
          </Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Students</Text>
      <View style={styles.studentsContainer}>
        {students.slice(0, 5).map(student => (
          <View key={student._id} style={styles.studentCard}>
            <View style={styles.studentAvatar}>
              <Text style={styles.avatarText}>
                {student.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{student.name}</Text>
              <Text style={styles.studentEmail}>{student.email}</Text>
              <Text style={styles.studentDate}>Enrolled: {student.enrolledDate}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderCourses = () => (
    <View style={styles.contentContainer}>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowCourseModal(true)}
      >
        <AntDesign name="plus" size={20} color="white" />
        <Text style={styles.addButtonText}>Create New Course</Text>
      </TouchableOpacity>

      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.courseCard}>
            <Image 
             // source={item.thumbnail ? { uri: item.thumbnail } : require('../../assets/images/icon.jpg')}
              style={styles.courseThumbnail}
            />
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>{item.title}</Text>
              <Text style={styles.courseCategory}>{item.category}</Text>
              <Text style={styles.courseDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.courseStats}>
                <Text style={styles.coursePrice}>${item.price}</Text>
                <Text style={styles.courseStudents}>
                  {item.studentsEnrolled} students
                </Text>
              </View>
              <View style={styles.courseActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => {
                    setSelectedCourse(item);
                    setShowLectureModal(true);
                  }}
                >
                  <Feather name="plus-circle" size={16} color="#4C51BF" />
                  <Text style={styles.actionButtonText}>Add Lecture</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: '#4C51BF' }]}
                  onPress={() => router.push(`/(teacher)/userlist`)}
                >
                  <Feather name="eye" size={16} color="white" />
                  <Text style={[styles.actionButtonText, { color: 'white' }]}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );

  const renderProfile = () => (
    <View style={styles.contentContainer}>
      <View style={styles.profileHeader}>
        {user?.profileImage ? (
          <Image 
            source={{ uri: user.profileImage }} 
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileImageText}>
              {user?.fname?.charAt(0)}{user?.lname?.charAt(0)}
            </Text>
          </View>
        )}
        <Text style={styles.profileName}>
          {user?.fname} {user?.lname}
        </Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.profileBio}>
          {user?.bio || 'No bio added yet'}
        </Text>
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.infoItem}>
          <Feather name="mail" size={18} color="#4C51BF" />
          <Text style={styles.infoText}>{user?.email}</Text>
        </View>
        {user?.phone && (
          <View style={styles.infoItem}>
            <Feather name="phone" size={18} color="#4C51BF" />
            <Text style={styles.infoText}>{user.phone}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => router.push('/(teacher)/userlist')}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4C51BF" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sidebar/Navigation */}
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>EduTech</Text>
          <Text style={styles.sidebarSubtitle}>Teacher Dashboard</Text>
        </View>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'dashboard' && styles.activeNavItem]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Ionicons 
            name="grid-outline" 
            size={20} 
            color={activeTab === 'dashboard' ? '#4C51BF' : '#718096'} 
          />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'courses' && styles.activeNavItem]}
          onPress={() => setActiveTab('courses')}
        >
          <MaterialIcons 
            name="menu-book" 
            size={20} 
            color={activeTab === 'courses' ? '#4C51BF' : '#718096'} 
          />
          <Text style={styles.navText}>My Courses</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'profile' && styles.activeNavItem]}
          onPress={() => setActiveTab('profile')}
        >
          <Feather 
            name="user" 
            size={20} 
            color={activeTab === 'profile' ? '#4C51BF' : '#718096'} 
          />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={20} color="#718096" />
          <Text style={styles.navText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'courses' && renderCourses()}
        {activeTab === 'profile' && renderProfile()}
      </View>

      {/* Create Course Modal */}
      <Modal
        visible={showCourseModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCourseModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Course</Text>
              <TouchableOpacity onPress={() => setShowCourseModal(false)}>
                <AntDesign name="close" size={24} color="#718096" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Course Title"
              value={courseTitle}
              onChangeText={setCourseTitle}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Course Description"
              value={courseDescription}
              onChangeText={setCourseDescription}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Price (USD)"
              value={coursePrice}
              onChangeText={setCoursePrice}
              keyboardType="numeric"
            />
            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categoryOptions}>
              {['Development', 'Design', 'Business', 'Marketing'].map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryOption,
                    courseCategory === category && styles.selectedCategoryOption
                  ]}
                  onPress={() => setCourseCategory(category)}
                >
                  <Text style={[
                    styles.categoryOptionText,
                    courseCategory === category && styles.selectedCategoryOptionText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleCreateCourse}
              disabled={!courseTitle || !courseDescription || !coursePrice}
            >
              <Text style={styles.submitButtonText}>Create Course</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Lecture Modal */}
      <Modal
        visible={showLectureModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLectureModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Add Lecture to {selectedCourse?.title}
              </Text>
              <TouchableOpacity onPress={() => setShowLectureModal(false)}>
                <AntDesign name="close" size={24} color="#718096" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Lecture Title"
              value={lectureTitle}
              onChangeText={setLectureTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Duration (e.g., 30m)"
              value={lectureDuration}
              onChangeText={setLectureDuration}
            />
            <TextInput
              style={styles.input}
              placeholder="Video URL"
              value={lectureVideoUrl}
              onChangeText={setLectureVideoUrl}
            />

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleAddLecture}
              disabled={!lectureTitle || !lectureDuration || !lectureVideoUrl}
            >
              <Text style={styles.submitButtonText}>Add Lecture</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    color: '#4C51BF',
    fontSize: 16,
  },
  sidebar: {
    width: 250,
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  sidebarHeader: {
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4C51BF',
  },
  sidebarSubtitle: {
    fontSize: 14,
    color: '#718096',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  activeNavItem: {
    backgroundColor: '#EDF2F7',
  },
  navText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#718096',
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4C51BF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#718096',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 15,
  },
  studentsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4C51BF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  studentEmail: {
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
  },
  studentDate: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#4C51BF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  courseThumbnail: {
    width: '100%',
    height: 150,
    backgroundColor: '#E2E8F0',
  },
  courseInfo: {
    padding: 15,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 5,
  },
  courseCategory: {
    fontSize: 14,
    color: '#4C51BF',
    fontWeight: '500',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 12,
    lineHeight: 20,
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  coursePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  courseStudents: {
    fontSize: 14,
    color: '#718096',
  },
  courseActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#4C51BF',
  },
  actionButtonText: {
    marginLeft: 6,
    color: '#4C51BF',
    fontWeight: '500',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4C51BF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImageText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#718096',
  },
  profileSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileBio: {
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#4A5568',
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#4C51BF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  input: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputLabel: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 8,
  },
  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategoryOption: {
    backgroundColor: '#4C51BF',
    borderColor: '#4C51BF',
  },
  categoryOptionText: {
    color: '#4A5568',
    fontSize: 14,
  },
  selectedCategoryOptionText: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#4C51BF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});