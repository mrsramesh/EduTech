import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import SearchComponent from '@/components/common/SearchWithFilter';
import CourseSection from '@/components/CourseSection';
import MentorCard from '@/components/mentor/MentorCard';
import API from '@/utils/api';
import DiscountCard from '@/components/DiscountCard';
import Categories from '@/components/CategoriesHome';

type User = {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  profileImage?: string;
  role: string;
};

type Course = {
  id: string;
  title: string;
  duration: string;
};

const allCourses: Record<string, Course[]> = {
  All: [
    { id: '1', title: 'Intro to React', duration: '30m' },
    { id: '2', title: 'JSX Deep Dive', duration: '45m' },
  ],
  'Graphic Design': [
    { id: '4', title: 'Photoshop Basics', duration: '40m' },
    { id: '5', title: 'Logo Design', duration: '1h' },
  ],
  'UI/UX': [
    { id: '6', title: 'User Journey Mapping', duration: '30m' },
    { id: '7', title: 'Figma Crash Course', duration: '50m' },
  ],
};

const filterOptions = ['All', 'Graphic Design', 'UI/UX'];

const HomeScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [user, setUser] = useState<User | null>(null);
  const [mentors, setMentors] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          router.push('/(auth)/login');
          return;
        }

        const [userResponse, mentorsResponse] = await Promise.all([
          API.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
          API.get('/api/auth/teachers'),
        ]);

        setUser(userResponse.data.data);
        setMentors(mentorsResponse.data || []);
      } catch (error) {
        console.error('Fetch error:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load user data',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4C51BF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>No user data found</Text>
      </View>
    );
  }

  const userInitials = `${user.fname?.[0] || ''}${user.lname?.[0] || ''}`;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.greetingContainer}>
        <View>
          <Text style={styles.helloText}>Hi, {user.fname} </Text>
          <Text style={styles.subText}>
            {user.email}{"\n\n"}
            What would you like to learn today?
          </Text>
        </View>
        {user.profileImage ? (
          <Image source={{ uri: user.profileImage }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{userInitials}</Text>
          </View>
        )}
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <SearchComponent />
      </SafeAreaView>

      <View style={{ marginTop: 20 }}>
        <DiscountCard />
      </View>

      <View style={{ paddingVertical: 16 }}>
        <Categories />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Courses</Text>
        <TouchableOpacity onPress={() => router.push('/(home)/popular')}>
          <Text style={styles.sectionSeeAll}>See All ➤</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filterOptions}
        keyExtractor={(item) => item}
        horizontal
        contentContainerStyle={styles.filterChips}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, selectedCategory === item && styles.activeChip]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text
              style={[
                styles.chipText,
                selectedCategory === item && styles.activeChipText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <CourseSection
        section={{ courses: allCourses[selectedCategory] || [] }}
        type="ongoing"
        onVideoPress={(video: any) => {
          router.push(`/(course)/completed`);
        }}
      />

    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F9FF',
    flex: 1,
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F9FF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4C51BF',
  },
  greetingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helloText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subText: {
    marginTop: 4,
    color: '#777',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#c5c5c5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionSeeAll: {
    color: '#4C51BF',
  },
  filterChips: {
    flexDirection: 'row',
    marginVertical: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 20,
    marginRight: 10,
  },
  activeChip: {
    backgroundColor: '#4C51BF',
  },
  chipText: {
    color: '#1A202C',
  },
  activeChipText: {
    color: '#fff',
  },
});
