



import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
  Pressable,
  BackHandler,
} from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import API from '@/utils/api';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useNavigation, useFocusEffect } from 'expo-router';
import { store } from '../../redux/store';

const { width } = Dimensions.get('window');

type Student = {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  profileImage?: string;
};

type Course = {
  id: string;
  title: string;
  students: number;
  lectures: number;
};

type Stats = {
  totalStudents: number;
  activeCourses: number;
  totalEarnings: number;
};

const TeacherDashboard = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const currentUser = store.getState().auth.user;
  const token = store.getState().auth.token;

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    activeCourses: 0,
    totalEarnings: 0,
  });

  useFocusEffect(() => {
    const onBackPress = () => true;
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, studentsRes] = await Promise.all([
          API.get(`/api/courses/my-courses/${currentUser._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get('/api/auth/students', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const fetchedCourses = coursesRes.data || [];
        const fetchedStudents = studentsRes.data || [];

        setCourses(fetchedCourses);
        setStudents(fetchedStudents);

        setStats({
          totalStudents: fetchedStudents.length || 0,
          activeCourses: fetchedCourses.length || 0,
          totalEarnings: 1250, // Static for now
        });

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Dashboard data loaded',
        });
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.response?.data?.message || 'Failed to load dashboard data',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderStudentItem = ({ item }: { item: Student }) => (
    <View style={styles.studentCard}>
      {item.profileImage ? (
        <Image source={{ uri: item.profileImage }} style={styles.studentAvatar} />
      ) : (
        <View style={[styles.studentAvatar, styles.avatarPlaceholder]}>
          <Text style={styles.avatarText}>
            {item.fname?.[0]}
            {item.lname?.[0]}
          </Text>
        </View>
      )}
      <Text style={styles.studentName}>{item.fname} {item.lname}</Text>
      <Text style={styles.studentEmail}>{item.email}</Text>
    </View>
  );

  const renderCourseItem = ({ item }: { item: Course }) => (
  <TouchableOpacity style={styles.courseCard}>
    <Image
      source={{ uri: item.thumbnail || 'https://via.placeholder.com/100' }}
      style={styles.courseThumbnail}
    />
    <View style={styles.courseInfo}>
      <Text style={styles.courseTitle}>{item.title}</Text>
      <View style={styles.courseStats}>
        <View style={styles.courseStat}>
          <Ionicons name="people" size={16} color="#718096" />
          <Text style={styles.courseStatText}>{item.students?.length || 0} students</Text>
        </View>
        <View style={styles.courseStat}>
          <Ionicons name="videocam" size={16} color="#718096" />
          <Text style={styles.courseStatText}>{item.lectures?.length || 0} lectures</Text>
        </View>
      </View>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#A0AEC0" />
  </TouchableOpacity>
);


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4C51BF" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <DrawerToggleButton tintColor="#4C51BF" />
        <Text style={styles.headerTitle}>Teacher Dashboard</Text>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#EEF2FF' }]}>
            <View style={[styles.statIcon, { backgroundColor: '#4C51BF' }]}>
              <Ionicons name="people" size={20} color="white" />
            </View>
            <Text style={styles.statValue}>{stats.totalStudents}</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#F0FFF4' }]}>
            <View style={[styles.statIcon, { backgroundColor: '#38A169' }]}>
              <Ionicons name="book" size={20} color="white" />
            </View>
            <Text style={styles.statValue}>{stats.activeCourses}</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#FFF5F5' }]}>
            <View style={[styles.statIcon, { backgroundColor: '#E53E3E' }]}>
              <MaterialIcons name="attach-money" size={20} color="white" />
            </View>
            <Text style={styles.statValue}>${stats.totalEarnings}</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <Pressable style={styles.actionButton} onPress={() => router.replace('/(admin)/courses')}>
            <View style={styles.actionIcon}>
              <Ionicons name="add-circle" size={28} color="#4C51BF" />
            </View>
            <Text style={styles.actionText}>Create Course</Text>
          </Pressable>

          <Pressable style={styles.actionButton} onPress={() => router.push('/(admin)/upload-lecture')}>
            <View style={styles.actionIcon}>
              <Ionicons name="cloud-upload" size={28} color="#4C51BF" />
            </View>
            <Text style={styles.actionText}>Upload Lecture</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Recent Students</Text>
        <FlatList
          horizontal
          data={students.slice(0, 10)}
          renderItem={renderStudentItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={styles.sectionTitle}>Your Courses</Text>
        <FlatList
          data={courses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: 16,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '30%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3748',
  },
  studentCard: {
    width: 120,
    marginRight: 16,
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
  },
  studentAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  avatarPlaceholder: {
    backgroundColor: '#CBD5E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  studentName: {
    fontWeight: '600',
    color: '#2D3748',
  },
  studentEmail: {
    fontSize: 12,
    color: '#718096',
  },
  listContent: {
    paddingBottom: 16,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  courseIcon: {
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontWeight: '600',
    color: '#2D3748',
  },
  courseStats: {
    flexDirection: 'row',
    marginTop: 4,
  },
  courseStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  courseStatText: {
    fontSize: 12,
    color: '#718096',
    marginLeft: 4,
  },
});

export default TeacherDashboard;
