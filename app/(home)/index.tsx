// Updated HomeScreen.js with carousel-like filter chips and dynamic card filtering
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList
} from 'react-native';
import SearchComponent from '../../components/common/SearchWithFilter';
import CourseCardPanel from '@/components/CourseCard1';
import CourseSection from '@/components/CourseSection';
import { useRouter } from 'expo-router';
import MentorCard from '@/components/mentor/MentorCard';

const mentors = [
  { name: 'Alice', image: require('../../assets/images/mentors/alice.png') },
  { name: 'Bob', image: require('../../assets/images/mentors/alice.png') },
  { name: 'Charlie', image: require('../../assets/images/mentors/alice.png') },
  { name: 'Daisy', image: require('../../assets/images/mentors/alice.png') },
  { name: 'Ethan', image: require('../../assets/images/mentors/alice.png') },
];

const allCourses = {
  All: [
    { id: '1', title: 'Intro to React', duration: '30m' },
    { id: '2', title: 'JSX Deep Dive', duration: '45m' },
    { id: '3', title: 'Hooks 101', duration: '1h 15m' },
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
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.greetingContainer}>
        <View>
          <Text style={styles.helloText}>Hi, Ronald A. Martin</Text>
          <Text style={styles.subText}>What would you like to learn today? Search Below.</Text>
        </View>
        <View style={styles.avatar} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <SearchComponent />
      </SafeAreaView>

      <View style={styles.specialBox}>
        <Text style={styles.specialOffer}>25% Off*</Text>
        <Text style={styles.specialTitle}>Today’s Special</Text>
        <Text style={styles.specialDesc}>
          Get a Discount for Every Course Order only Valid for Today.!
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <Text style={styles.sectionSeeAll}>See All ➤</Text>
      </View>

      <View style={styles.categories}>
        <Text style={styles.category}>3D Design</Text>
        <Text style={[styles.category, styles.activeCategory]}>Arts & Humanities</Text>
        <Text style={styles.category}>Graphic Design</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Course </Text>
        <TouchableOpacity onPress={() => router.push('/popular')}>
          <Text style={styles.sectionSeeAll}>See All ➤</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mentorRow}>
        {mentors.map((mentor, index) => (
          <MentorCard key={index} name={mentor.name} image={mentor.image} />
        ))}
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
            <Text style={[styles.chipText, selectedCategory === item && styles.activeChipText]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={{ flex: 1 }}>
        <CourseCardPanel />
        <CourseSection
          section={{ courses: allCourses[selectedCategory as keyof typeof allCourses] || [] }}

          type="ongoing"
          onVideoPress={(video:any) => {
            console.log('Video pressed:', video);
          }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Mentors</Text>
        <TouchableOpacity onPress={() => router.push('/(menter)/menterlist')}>
          <Text style={styles.sectionSeeAll}>See All ➤</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mentorRow}>
        {mentors.map((mentor, index) => (
          <MentorCard key={index} name={mentor.name} image={mentor.image} />
        ))}
      </View>
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
  searchBox: {
    backgroundColor: 'white',
    marginTop: 30,
    borderRadius: 15,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#202244',
  },
  searchBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#0961F5',
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
  },
  category: {
    fontSize: 15,
    fontWeight: '700',
    color: '#A0A4AB',
  },
  activeCategory: {
    color: '#0961F5',
  },
  filterChips: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  chip: {
    backgroundColor: '#E8F1FF',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#202244',
  },
  activeChip: {
    backgroundColor: '#167F71',
  },
  activeChipText: {
    color: 'white',
  },
  mentorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});


