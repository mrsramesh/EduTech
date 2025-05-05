import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import CourseCard from './CourseCard';

interface Course {
  _id: string;
  title: string;
  duration: string;
  progress: number;
  category: string;
  description: string;
}


const courses: Course[] = [
  {
    _id: '1',
    title: 'UI/UX Fundamentals',
    duration: '12h',
    progress: 60,
    category: 'Design',
    description: 'Learn UI/UX design principles'
  },
  {
    _id: '2',
    title: 'React Native Mastery',
    duration: '20h',
    progress: 0.3,
    category: 'Development',
    description: 'Learn React-Native'

  },
  {
    _id: '3',
    title: 'Digital Marketing',
    duration: '8h',
    progress: 0.8,
    category: 'Marketing',
    description: 'Learn Digital Marketing principles'

  },
];

const CourseSection: React.FC = () => {
  return (
    <FlatList
      data={courses}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => <CourseCard course={item} />}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    gap: 16,
  },
});

export default CourseSection;