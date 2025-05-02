import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CourseCardPanel from './CourseCard1';

const CourseSection = ({ section, type, onVideoPress }) => {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <Text style={styles.totalTime}>{section.totalDuration}</Text>
      </View>

      {section.courses.map((course, idx) => {
        const isFirst = idx === 0; // First course open by default
        const isLocked = type === 'ongoing' && !isFirst; // Lock all except the first ongoing course

        return (
          <CourseCardPanel
            key={course.id}
            course={course}
            isLocked={isLocked} // Pass lock state to the card
            onPress={onVideoPress} // Handle onPress for navigation to video
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 14,
    color: '#003F88',
  },
  totalTime: {
    fontWeight: '600',
    fontSize: 13,
    color: '#007bff',
  },
});

export default CourseSection;
