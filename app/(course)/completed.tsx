import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import SearchInput from '@/components/SearchInput';
import CourseSection from '@/components/CourseSection';

const sectionsData = [
  {
    title: 'Section 01 - Introduction',
    totalDuration: '25 Mins',
    courses: [
      { id: '1', title: 'Why Using 3D Blender', duration: '15 Mins', videoUrl: '...' },
      { id: '2', title: '3D Blender Installation', duration: '10 Mins', videoUrl: '...' },
    ],
  },
  {
    title: 'Section 02 - Graphic Design',
    totalDuration: '125 Mins',
    courses: [
      { id: '3', title: 'Take a Look Blender Interface', duration: '20 Mins', videoUrl: '...' },
      { id: '4', title: 'The Basic of 3D Modelling', duration: '25 Mins', videoUrl: '...' },
      { id: '5', title: 'Shading and Lighting', duration: '80 Mins', videoUrl: '...' },
    ],
  },
];

export default function CompletedScreen() {
  const [text, setText] = useState('');

  const handleVideoPress = (video:any) => {
    // Navigate or play video here
    console.log('Play video: ', video.title);
  };

  return (
    <ScrollView style={styles.container}>
      <SearchInput
        value={text}
        onChangeText={setText}
        placeholder="Search users..."
      />
      {sectionsData.map((section, idx) => (
        <CourseSection 
          key={idx}
          section={section}
          type="completed"
          onVideoPress={handleVideoPress}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F7F9FC',
  },
});
