import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

interface Course {
  _id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  thumbnail?: string;
  progress?: number;
  isCompleted?: boolean;
}

interface CourseCardProps {
  course: Course;
  isLocked?: boolean;
  onPress?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, isLocked = false, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.container, isLocked && styles.lockedContainer]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {isLocked && (
        <View style={styles.lockOverlay}>
          <MaterialIcons name="lock" size={32} color="#FFFFFF" />
          <Text style={styles.lockText}>Premium Content</Text>
        </View>
      )}
      
      {/* Course Thumbnail */}
      {course.thumbnail ? (
        <Image 
          source={{ uri: course.thumbnail }} 
          style={styles.thumbnail} 
          resizeMode="cover"
        />
      ) : (
        <LinearGradient
          colors={['#7F56D9', '#9E77ED']}
          style={styles.thumbnailPlaceholder}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="book" size={32} color="#FFFFFF" />
        </LinearGradient>
      )}
      
      {/* Course Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.category}>{course.category}</Text>
          <Text style={styles.price}>₹{course.price}</Text>
        </View>
        
        <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{course.description}</Text>
        
        {/* Progress Bar */}
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    color: '#027A48',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#7F56D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 3,
    marginBottom: 16,
  },
  lockedContainer: {
    opacity: 0.8,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  lockText: {
    color: '#FFFFFF',
    marginTop: 8,
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
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
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  completedBadge: {
    backgroundColor: '#ECFDF3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  completedText: {
    color: '#027A48',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  title: {
    color: '#101828',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    color: '#667085',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
    lineHeight: 20,
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