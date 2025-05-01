import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  ActivityIndicator,
  ImageSourcePropType
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import API from '@/utils/api';
import Toast from 'react-native-toast-message';

type User = {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  role: string;
  profileImage?: string;
  createdAt: string;
};

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to fetch user details',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>User not found</Text>
      </View>
    );
  }

  const imageSource: ImageSourcePropType = user.profileImage 
    ? { uri: user.profileImage } 
    : require('../../assets/images/icon.png'); // Add a default image

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        {user.profileImage && (
          <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
        )}
        <Text style={styles.userName}>
          {user.fname} {user.lname}
        </Text>
        <Text style={styles.userRole}>{user.role}</Text>
      </View>

      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>First Name:</Text>
          <Text style={styles.detailValue}>{user.fname}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Last Name:</Text>
          <Text style={styles.detailValue}>{user.lname}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>{user.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Role:</Text>
          <Text style={styles.detailValue}>{user.role}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Member Since:</Text>
          <Text style={styles.detailValue}>
            {new Date(user.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userRole: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 4,
  },
  detailsSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});