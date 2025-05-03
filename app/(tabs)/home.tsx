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
          API.get('/api/auth/alluser'),
          API.get('/api/auth/teachers', { params: { role: 'teacher', $limit: 5 } }),
        ]);

        setUser(userResponse.data);
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
      {/* Greeting Section */}
      <View style={styles.greetingContainer}>
        <View>
          <Text style={styles.helloText}>Hi,  kanhaiya lal {userInitials}</Text>
          <Text style={styles.subText}>
            {user.email} kanhu1@gmail.com{"\n\n "}
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

      {/* Search Section */}
      <SafeAreaView style={{ flex: 1 }}>
        <SearchComponent />
      </SafeAreaView>

      {/* Special Offer Box */}
  <View style={{ marginTop: 20 }}>
  <DiscountCard />
</View>

      {/* Categories Section */}
      <View style={{ paddingVertical: 16 }}>
  <Categories />
</View>

      {/* Popular Course Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Courses</Text>
        <TouchableOpacity onPress={() => router.push('/(home)/popular')}>
          <Text style={styles.sectionSeeAll}>See All ➤</Text>
        </TouchableOpacity>
      </View>

      {/* Mentors List */}
      {/* <View style={styles.mentorRow}>
        {mentors.map((mentor) => (
          <MentorCard
            key={mentor._id}
            name={`${mentor.fname} ${mentor.lname}`}
            image={
              mentor.profileImage
                ? { uri: mentor.profileImage }
                : require('@/assets/images/icon.png')
            }
            specialty={mentor.role || 'General Education'}
            rating={4.5}
            onPress={() => router.push(`/(menter)/menterlist`)}
          />
        ))}
      </View> */}

      {/* Filter Chips */}
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

      {/* Courses List Section */}
      <CourseSection
        section={{ courses: allCourses[selectedCategory] || [] }}
        type="ongoing"
        onVideoPress={(video: any) => {
          console.log('Video pressed:', video);
          router.push(`/(course)/completed`);
        }}
      />

      {/* Top Mentors Section */}
    
      
    </ScrollView>
  );
};

export default HomeScreen;

// --------------------
// STYLES
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
    color: '#4C51BF',
  },
  greetingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
  },
  helloText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#202244',
  },
  subText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(84,84,84,0.8)',
    marginTop: 5,
    maxWidth: 250,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: '#167F71',
    borderWidth: 2,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4C51BF',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#167F71',
    borderWidth: 2,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
  },
  specialBox: {
    backgroundColor: '#0961F5',
    borderRadius: 22,
    padding: 20,
    marginTop: 30,
  },
  specialOffer: {
    color: 'white',
    fontSize: 15,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  specialTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 5,
  },
  specialDesc: {
    color: 'white',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 10,
    maxWidth: 250,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202244',
  },
  sectionSeeAll: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0961F5',
    textTransform: 'uppercase',
  },
  categories: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  category: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6D6D6D',
  },
  activeCategory: {
    color: '#0961F5',
  },
  mentorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  filterChips: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#E0E7FF',
    borderRadius: 20,
  },
  activeChip: {
    backgroundColor: '#4C51BF',
  },
  chipText: {
    fontSize: 14,
    color: '#4C51BF',
    fontWeight: '600',
  },
  activeChipText: {
    color: 'white',
  },
});
