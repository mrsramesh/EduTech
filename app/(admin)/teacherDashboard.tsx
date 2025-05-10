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
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
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
  _id: string;
  title: string;
  description: string;
  students: any[];
  lectures: any[];
  thumbnail: string;
  price: number;
  rating: number;
  category: string;
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
  const [coursesToShow, setCoursesToShow] = useState<number>(3);
  const [expanded, setExpanded] = useState<boolean>(false);

  useFocusEffect(() => {
    const onBackPress = () => true;
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, studentsRes, earningsRes] = await Promise.all([
          API.get(`/api/courses/my-courses/${currentUser._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get('/api/auth/students', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get('/api/courses/earnings/teacher', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const fetchedCourses = coursesRes.data || [];
        const fetchedStudents = studentsRes.data || [];
        const earningsData = earningsRes.data?.data || {
          totalEarnings: 0,
          totalStudents: 0,
          totalCourses: 0
        };

        setCourses(fetchedCourses);
        setStudents(fetchedStudents);

        setStats({
          totalStudents: earningsData.totalStudents,
          activeCourses: fetchedCourses.length,
          totalEarnings: earningsData.totalEarnings,
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

  const toggleCourses = () => {
    if (expanded) {
      setCoursesToShow(3);
    } else {
      setCoursesToShow(courses.length);
    }
    setExpanded(!expanded);
  };

  const renderStudentItem = ({ item }: { item: Student }) => (
    <View style={styles.studentCard}>
      {item.profileImage ? (
        <Image 
          source={{ uri: item.profileImage }} 
          style={styles.studentAvatar} 
        />
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
    <TouchableOpacity 
      style={styles.courseCard}
      // onPress={() => router.push(`/(admin)/courses/${item._id}`)}
    >
      <Image
        source={{ uri: item.thumbnail || 'https://via.placeholder.com/300x200' }}
        style={styles.courseThumbnail}
      />
      <View style={styles.courseContent}>
        <View style={styles.courseHeader}>
          <Text style={styles.courseCategory}>{item.category || 'General'}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.ratingText}>{item.rating || '4.5'}</Text>
          </View>
        </View>
        
        <Text style={styles.courseTitle}>{item.title}</Text>
        <Text style={styles.courseDescription} numberOfLines={2}>
          {item.description || 'No description available'}
        </Text>
        
        <View style={styles.courseFooter}>
          <View style={styles.courseMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="people" size={16} color="#718096" />
              <Text style={styles.metaText}>{item.students?.length || 0} Students</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="videocam" size={16} color="#718096" />
              <Text style={styles.metaText}>{item.lectures?.length || 0} Lectures</Text>
            </View>
          </View>
          
          <Text style={styles.coursePrice}>₹{item.price || 0}</Text>
        </View>
      </View>
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
            <Text style={styles.statValue}>₹ {stats.totalEarnings}</Text>
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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Courses</Text>
          {courses.length > 3 && (
            <TouchableOpacity onPress={toggleCourses} style={styles.showMoreButton}>
              <Text style={styles.showMoreText}>
                {expanded ? 'Show Less' : 'Show All'}
              </Text>
              <Feather 
                name={expanded ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color="#4C51BF" 
              />
            </TouchableOpacity>
          )}
        </View>
        
        <FlatList
          data={courses.slice(0, coursesToShow)}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          contentContainerStyle={styles.coursesList}
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
    paddingTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3748',
    marginLeft: 16,
    letterSpacing: 0.5,
  },
  container: {
    flex: 1,
    paddingBottom: 24,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
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
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(76, 81, 191, 0.1)',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
  },
  statLabel: {
    fontSize: 13,
    color: '#718096',
    marginTop: 6,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    letterSpacing: 0.3,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  showMoreText: {
    color: '#4C51BF',
    fontWeight: '600',
    marginRight: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  actionIcon: {
    marginBottom: 12,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
    textAlign: 'center',
  },
  studentCard: {
    width: 140,
    marginRight: 16,
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  studentAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    backgroundColor: '#4C51BF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },
  studentName: {
    fontWeight: '600',
    color: '#2D3748',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  studentEmail: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 24,
    paddingRight: 8,
  },
  coursesList: {
    paddingBottom: 16,
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
    overflow: 'hidden',
  },
  courseThumbnail: {
    width: '100%',
    height: 16,
  },
  courseContent: {
    padding: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  courseCategory: {
    backgroundColor: '#E9D8FD',
    color: '#6B46C1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    color: '#F59E0B',
    fontWeight: '600',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 16,
    lineHeight: 20,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    color: '#718096',
    marginLeft: 6,
  },
  coursePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4C51BF',
  },
});

export default TeacherDashboard;