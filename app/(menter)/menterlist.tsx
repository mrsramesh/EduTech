

import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  RefreshControl 
} from 'react-native';
import MentorCard from '@/components/mentor/MentorCard';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import API from '@/utils/api';
import Toast from 'react-native-toast-message';

type Mentor = {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  role: string;
  profileImage?: string;
  specialty?: string;
  rating?: number;
  createdAt: string;
};

export default function MentorListScreen() {
  const router = useRouter();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/auth/teachers', { params: { role: 'teacher' } });
      setMentors(response.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch mentors',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMentors();
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleMentorPress = (mentorId: string) => {
    router.push({
      pathname: '/(teacher)/userlist',
      params: { mentorId }
    });
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4C51BF" />
      </View>
    );
  }

  return (
    <LinearGradient 
      colors={['#F7FAFC', '#EDF2F7']} 
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4C51BF']}
            tintColor="#4C51BF"
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Our Mentors</Text>
          <Text style={styles.subtitle}>Connect with experienced educators</Text>
        </View>

        {mentors.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No mentors available</Text>
          </View>
        ) : (
          mentors.map((mentor) => (
            <MentorCard
              key={mentor._id}
              name={`${mentor.fname} ${mentor.lname}`}
              image={mentor.profileImage ? { uri: mentor.profileImage } : require('../../assets/images/icon.png')}
              specialty={mentor.specialty || 'General Education'}
              rating={mentor.rating || 4.5}
              onPress={() => handleMentorPress(mentor._id)}
              layout="list"
            />
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2D3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#A0AEC0',
  },
});