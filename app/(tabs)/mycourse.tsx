import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import CourseCard from '@/components/CourseCard';
import SearchInput from '@/components/SearchInput';
import API from '@/utils/api';
import { useAuth } from '../context/AuthContext';

interface Course {
  _id: string;
  title: string;
  category: string;
  description: string;
  thumbnail?: string;
  progress?: number;
  isCompleted?: boolean;
}

const MyCourseScreen = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'enrolled' | 'completed'>('enrolled');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { 
    data: courses, 
    isLoading, 
    error,
    refetch 
  } = useQuery<Course[]>({
    queryKey: ['enrolledCourses', user?.id],
    queryFn: async () => {
      const res = await API.get('/api/courses/', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data;
    },
    enabled: !!user?.token // Only fetch if user is authenticated
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const filteredCourses = courses?.filter((course) => {
    // Filter by tab selection
    const matchesTab = selectedTab === 'completed' 
      ? course.isCompleted 
      : !course.isCompleted;
    
    // Filter by search query
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

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
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'completed' && styles.activeTab]}
          onPress={() => setSelectedTab('completed')}
        >
          <Text style={[styles.tabText, selectedTab === 'completed' && styles.activeTabText]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <CourseCard course={item} />}
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
              : selectedTab === 'completed' 
                ? 'No completed courses yet'
                : 'No courses enrolled yet'
            }
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 24
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
});

export default MyCourseScreen;