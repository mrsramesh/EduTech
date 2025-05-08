import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter ,useLocalSearchParams } from 'expo-router';

interface Course {
  _id: string;
  title: string;
  category: string;
  description: string;
  thumbnail?: string;
  progress?: number;
}

interface CourseCardProps {
  course: Course;
}

// Add navigation to your existing CourseCard component
const router = useRouter();

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    // <TouchableOpacity style={styles.container}
    // onPress={() => router.push(`/(course)/${course._id}`)}
    // >
    <TouchableOpacity 
    style={styles.container}
    onPress={() => router.push({
      pathname: '/(course)/[id]',
      params: { id: course._id }
    })}
  >
      <View style={styles.card}>
        {course.thumbnail ? (
          <Image source={{ uri: course.thumbnail }} style={styles.thumbnail} />
        ) : (
          <LinearGradient
            colors={['#7F56D9', '#9E77ED']}
            style={styles.thumbnailPlaceholder}
          >
            <MaterialIcons name="school" size={32} color="#FFFFFF" />
          </LinearGradient>
        )}
        
        <View style={styles.content}>
          <Text style={styles.category}>{course.category}</Text>
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {course.description}
          
          </Text>
          
          {course.progress !== undefined && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: `${course.progress}%` }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{course.progress}% Complete</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#7F56D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 3,
  },
  thumbnail: {
    width: '100%',
    height: 160,
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  category: {
    color: '#7F56D9',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  title: {
    color: '#101828',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  description: {
    color: '#667085',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F4EBFF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7F56D9',
  },
  progressText: {
    color: '#667085',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
});

export default CourseCard;