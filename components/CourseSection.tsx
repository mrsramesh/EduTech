import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

interface Course {
  _id: string;
  title: string;
  duration: string;
  progress: number;
  category: string;
  description: string;
  thumbnail?: string;
}

const courses: Course[] = [
  {
    _id: '1',
    title: 'UI/UX Fundamentals',
    duration: '12h',
    progress: 60,
    category: 'Design',
    description: 'Learn UI/UX design principles',
  },
  {
    _id: '2',
    title: 'React Native Mastery',
    duration: '20h',
    progress: 30,
    category: 'Development',
    description: 'Learn React-Native',
  },
  {
    _id: '3',
    title: 'Digital Marketing',
    duration: '8h',
    progress: 80,
    category: 'Marketing',
    description: 'Learn Digital Marketing principles',
  },
];

const CourseSection: React.FC = () => {
  const renderCard = ({ item }: { item: Course }) => {
    return (
      <TouchableOpacity style={styles.card}>
        {item.thumbnail ? (
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        ) : (
          <LinearGradient
            colors={['#7F56D9', '#9E77ED']}
            style={styles.thumbnail}
          >
            <MaterialIcons name="school" size={32} color="#FFFFFF" />
          </LinearGradient>
        )}

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.category}>{item.category}</Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{item.progress}% Complete</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={courses}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.list}
      renderItem={renderCard}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    gap: 16,
    paddingHorizontal: 0,
  },
  card: {
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#7F56D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    marginBottom:15,
  },
  thumbnail: {
    width: '100%',
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  category: {
    fontSize: 12,
    color: '#7F56D9',
    fontWeight: '500',
  },
  title: {
    fontSize: 16,
    color: '#101828',
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#667085',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F4EBFF',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7F56D9',
  },
  progressText: {
    fontSize: 12,
    color: '#667085',
  },
});

export default CourseSection;
