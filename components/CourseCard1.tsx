import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface CourseCardPanelProps {
  course?: {
    id: string;
    category: string;
    title: string;
    rating: number;
    duration: string;
    isCompleted: boolean;
    progress?: number;
  };
}

const CourseCardPanel: React.FC<CourseCardPanelProps> = ({ course }) => {
  const router = useRouter();

  if (!course) {
    return (
      <View style={styles.card}>
        <Text style={{ color: 'red' }}>Course data is missing</Text>
      </View>
    );
  }

  const handlePress = () => {
    if (course.isCompleted) {
      router.push('/(course)/completed');
    } else {
      router.push('/(course)/ongoing');
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <View style={styles.card}>
        <View style={styles.imagePlaceholder} />

        <View style={styles.info}>
          <Text style={styles.category}>{course.category}</Text>
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.details}>
            ⭐ {course.rating} | ⏱ {course.duration}
          </Text>

          {!course.isCompleted && typeof course.progress === 'number' && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>Progress: {course.progress}/20</Text>
              <View style={styles.customProgressBar}>
                <View
                  style={[
                    styles.customProgressFill,
                    { width: `${(course.progress / 20) * 100}%` },
                  ]}
                />
              </View>
            </View>
          )}

          {course.isCompleted && (
            <TouchableOpacity onPress={() => router.push('/(menter)/certificate')}>
              <Text style={styles.certificate}>VIEW CERTIFICATE</Text>
            </TouchableOpacity>
          )}
        </View>

        {course.isCompleted && (
          <View style={styles.tick}>
            <Text style={{ fontSize: 18 }}>✅</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CourseCardPanel;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#333',
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  category: {
    fontSize: 12,
    color: '#e67e22',
    marginBottom: 4,
  },
  title: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 4,
  },
  details: {
    fontSize: 12,
    color: '#555',
    marginBottom: 6,
  },
  certificate: {
    color: '#1abc9c',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tick: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressText: {
    fontSize: 12,
    marginBottom: 4,
  },
  customProgressBar: {
    height: 8,
    width: '100%',
    backgroundColor: '#eee',
    borderRadius: 5,
    overflow: 'hidden',
  },
  customProgressFill: {
    height: '100%',
    backgroundColor: '#1abc9c',
  },
});
