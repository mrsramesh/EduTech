import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import CourseCard from '@/components/CourseCard1';
import SearchInput from '@/components/SearchInput';
 // ✅ Import reusable component
 import CertificateCard from '@/components/CertificateCompleteCard';
const completedCourses = [
  {
    id: '1',
    category: 'Graphic Design',
    title: 'Graphic Design Advanced',
    rating: 4.2,
    duration: '2 Hrs 36 Mins',
    isCompleted: true,
  },
  {
    id: '2',
    category: 'Graphic Design',
    title: 'Advance Diploma in Gra..',
    rating: 4.7,
    duration: '3 Hrs 28 Mins',
    isCompleted: true,
  },
  {
    id: '3',
    category: 'Digital Marketing',
    title: 'Setup your Graphic Des...',
    rating: 4.2,
    duration: '4 Hrs 05 Mins',
    isCompleted: true,
  },
  {
    id: '4',
    category: 'Web Development',
    title: 'Web Developer conce...',
    rating: 4.3,
    duration: '3 Hrs 11 Mins',
    isCompleted: true,
  },
];

const ongoingCourses = [
  {
    id: '5',
    category: 'Web Development',
    title: 'React Native Basics',
    rating: 4.5,
    duration: '1 Hr 50 Mins',
    progress: 12,
    isCompleted: false,
  },
  {
    id: '6',
    category: 'Digital Marketing',
    title: 'SEO Masterclass',
    rating: 4.1,
    duration: '3 Hrs 10 Mins',
    progress: 8,
    isCompleted: false,
  },
  {
    id: '5',
    category: 'Web Development',
    title: 'React Native Basics',
    rating: 4.5,
    duration: '1 Hr 50 Mins',
    progress: 6,
    isCompleted: false,
  },
  {
    id: '6',
    category: 'Digital Marketing',
    title: 'SEO Masterclass',
    rating: 4.1,
    duration: '3 Hrs 10 Mins',
    progress: 18,
    isCompleted: false,
  },
];

export default function MyCourseScreen() {
  const [selectedTab, setSelectedTab] = useState<'Completed' | 'Ongoing'>('Completed');
  const [searchQuery, setSearchQuery] = useState('');

  const courseData = selectedTab === 'Completed' ? completedCourses : ongoingCourses;

  const filteredCourses = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return courseData.filter((course) => {
      const title = course.title?.toLowerCase().trim() || '';
      const category = course.category?.toLowerCase().trim() || '';
      return title.includes(query) || category.includes(query);
    });
  }, [searchQuery, selectedTab]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📘 My Courses</Text>

      {/* ✅ Reusable Search Input Component */}
      <SearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search courses by title or category"
      />

      {/* 🧭 Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Completed' && styles.activeTab]}
          onPress={() => setSelectedTab('Completed')}
        >
          <Text style={selectedTab === 'Completed' ? styles.activeTabText : styles.tabText}>
            Completed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Ongoing' && styles.activeTab]}
          onPress={() => setSelectedTab('Ongoing')}
        >
          <Text style={selectedTab === 'Ongoing' ? styles.activeTabText : styles.tabText}>
            Ongoing
          </Text>
        </TouchableOpacity>
      </View>

      {/* 📋 Filtered Course List */}
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CourseCard course={item} />}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>
            No courses found.
          </Text>
        }
      />
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fbff', padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    justifyContent: 'center',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: '#e5ecf2',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#1abc9c',
  },
  tabText: {
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
});
