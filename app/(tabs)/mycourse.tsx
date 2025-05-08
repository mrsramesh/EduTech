import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Modal
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import CourseCard from '@/components/CourseCard';
import SearchInput from '@/components/SearchInput';
import API from '@/utils/api';
import { useAuth } from '../context/AuthContext';
import { useSelector } from 'react-redux';
import { selectCurrentToken, selectCurrentUser } from '@/redux/authSlice';
import { router } from 'expo-router';

interface Course {
  _id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  thumbnail?: string;
  progress?: number;
  isCompleted?: boolean;
  createdBy: {
    _id: string;
    email: string;
    name?: string;
  };
}

type TabType = 'enrolled' | 'available';

const MyCourseScreen = () => {
  const { user: contextUser } = useAuth();
  const reduxUser = useSelector(selectCurrentUser);
  const reduxToken = useSelector(selectCurrentToken);
  const user = reduxUser || contextUser;
  const token = reduxToken || contextUser?.token;

  const [selectedTab, setSelectedTab] = useState<TabType>('enrolled');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const { data: courses, isLoading, error, refetch } = useQuery<Course[]>({
    queryKey: ['courses', selectedTab, user?._id],
    queryFn: async () => {
      if (!token) throw new Error('Authentication required');
      
      const endpoint = selectedTab === 'enrolled' 
        ? '/api/courses/user/enrolled' 
        : '/api/courses/user/available';

      const res = await API.get(endpoint, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return res.data;
    },
    enabled: !!token,
  });

  useFocusEffect(
    React.useCallback(() => {
      if (token) refetch();
    }, [token, selectedTab])
  );

  const handleCoursePress = (course: Course) => {
    if (selectedTab === 'enrolled') {
      router.push({
        pathname: '/(tabs)/mycourse',
        params: { courseId: course._id }
      });
    } else {
      setSelectedCourse(course);
      setShowPurchaseModal(true);
    }
  };

  const filteredCourses = courses?.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (err) {
      console.error('Refresh failed:', err);
    } finally {
      setRefreshing(false);
    }
  };

  if (!token) {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.authText}>Please sign in to view courses</Text>
        <TouchableOpacity
          style={styles.authButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.authButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7F56D9" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error loading courses: {error.message}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => refetch()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Courses</Text>

      <SearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search courses..."
      />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'enrolled' && styles.activeTab]}
          onPress={() => setSelectedTab('enrolled')}
        >
          <Text style={[styles.tabText, selectedTab === 'enrolled' && styles.activeTabText]}>
            Enrolled Courses
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'available' && styles.activeTab]}
          onPress={() => setSelectedTab('available')}
        >
          <Text style={[styles.tabText, selectedTab === 'available' && styles.activeTabText]}>
            Available Courses
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <CourseCard 
            course={item} 
            isLocked={selectedTab === 'available'}
            onPress={() => handleCoursePress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#7F56D9']}
            tintColor="#7F56D9"
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchQuery 
              ? 'No courses match your search' 
              : selectedTab === 'enrolled' 
                ? 'No enrolled courses yet'
                : 'No available courses found'
            }
          </Text>
        }
      />

      <Modal
        visible={showPurchaseModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPurchaseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Purchase Course</Text>
            <Text style={styles.modalText}>
              You're about to purchase {selectedCourse?.title}
            </Text>
            <Text style={styles.priceText}>
              Price: ₹{selectedCourse?.price}
            </Text>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowPurchaseModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.subscribeButton]}
                onPress={() => {
                  setShowPurchaseModal(false);
                  router.push({
                    pathname: '/(payment)/PaymentScreen',
                    params: { 
                      courseId: selectedCourse?._id,
                      coursePrice: selectedCourse?.price.toString()
                    }
                  });
                }}
              >
                <Text style={styles.subscribeButtonText}>Confirm Purchase</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 24
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  authText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  authButton: {
    backgroundColor: '#7F56D9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  priceText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#101828',
    marginBottom: 24,
    textAlign: 'center'
  },
  errorText: {
    color: '#F04438',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
    textAlign: 'center'
  },
  retryButton: {
    backgroundColor: '#7F56D9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14
  },
  header: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#101828',
    marginBottom: 16
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#F2F4F7',
    borderRadius: 20,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#7F56D9',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#667085',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 32,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#98A2B3',
    fontFamily: 'Inter-Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#101828',
    marginBottom: 12,
    textAlign: 'center'
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#667085',
    marginBottom: 16,
    textAlign: 'center'
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F2F4F7',
  },
  subscribeButton: {
    backgroundColor: '#7F56D9',
  },
  cancelButtonText: {
    color: '#344054',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14
  },
  subscribeButtonText: {
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14
  }
});

export default MyCourseScreen;