import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import API from '../utils/api';
import Toast from 'react-native-toast-message';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type User = {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  role: string;
  profileImage?: string;
  createdAt: string;
};

export default function UserListScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'all' | 'student' | 'teacher'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { mentorId } = useLocalSearchParams();

  // Function to fetch users based on the selected role
  const fetchUsers = async () => {
    try {
      setLoading(true);
      let apiUrl = ''; 

      if (selectedRole === 'all') {
        apiUrl = '/api/auth/alluser'; // All users (students + teachers)
      } else if (selectedRole === 'student') {
        apiUrl = '/api/auth/students'; // Only students
      } else if (selectedRole === 'teacher') {
        apiUrl = '/api/auth/teachers'; // Only teachers
      }

      const response = await API.get(apiUrl); // Fetch data based on the role
      setUsers(response.data); // Set users data based on response
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch users',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRole]); // Fetch users when role changes

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      `${user.fname} ${user.lname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const renderUserItem = ({ item }: { item: User }) => {
    const imageSource = item.profileImage
      ? { uri: item.profileImage }
      : require('../../assets/images/icon.png'); // Default image

    return (
      <TouchableOpacity
        style={styles.userCard}
        onPress={() => router.push(`/userdetail`)} // by unique id
        activeOpacity={0.7}
      >
        <Image source={imageSource} style={styles.avatar} />
        <View style={styles.userInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.userName} numberOfLines={1}>
              {item.fname} {item.lname}
            </Text>
            {item.role === 'teacher' && (
              <MaterialIcons name="verified" size={16} color="#4299e1" style={styles.verifiedIcon} />
            )}
          </View>
          <Text style={styles.userEmail} numberOfLines={1}>{item.email}</Text>
          <View
            style={[styles.roleBadge, item.role === 'teacher' ? styles.teacherBadge : styles.studentBadge]}
          >
            <Text style={styles.roleText}>
              {item.role === 'teacher' ? 'Educator' : 'Student'}
            </Text>
          </View>
        </View>
        <Feather name="chevron-right" size={20} color="#cbd5e0" />
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#f8fafc']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>User Management</Text>
        {mentorId && <Text style={styles.subtitle}>Students under mentor</Text>}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Role Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.roleFilterContainer}
      >
        {['all', 'teacher', 'student'].map((role) => (
          <TouchableOpacity
            key={role}
            style={[
              styles.roleFilterButton,
              selectedRole === role && styles.activeRoleFilterButton,
            ]}
            onPress={() => setSelectedRole(role as 'all' | 'student' | 'teacher')}
          >
            <Text
              style={[
                styles.roleFilterText,
                selectedRole === role && styles.activeRoleFilterText,
              ]}
            >
              {role === 'all' ? 'All Users' : role === 'teacher' ? 'Educators' : 'Students'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* User List */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      ) : filteredUsers.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="users" size={48} color="#e2e8f0" />
          <Text style={styles.emptyStateText}>
            {searchQuery ? 'No matching users found' : 'No users available'}
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Feather name="refresh-cw" size={16} color="#4f46e5" />
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4f46e5']}
              tintColor="#4f46e5"
              progressBackgroundColor="#ffffff"
            />
          }
          ListFooterComponent={<View style={styles.listFooter} />}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontFamily: 'Inter_400Regular',
  },
  roleFilterContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  roleFilterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#e2e8f0',
    marginRight: 12,
  },
  activeRoleFilterButton: {
    backgroundColor: '#4f46e5',
  },
  roleFilterText: {
    color: '#1e293b',
    fontFamily: 'Inter_400Regular',
  },
  activeRoleFilterText: {
    color: '#fff',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    fontFamily: 'Inter_600SemiBold',
    maxWidth: '75%',
  },
  verifiedIcon: {
    marginLeft: 8,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  roleBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  teacherBadge: {
    backgroundColor: '#f3f4f6',
  },
  studentBadge: {
    backgroundColor: '#e2e8f0',
  },
  roleText: {
    fontSize: 12,
    color: '#1e293b',
    fontFamily: 'Inter_400Regular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#4f46e5',
    marginTop: 8,
    fontFamily: 'Inter_600SemiBold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#64748b',
    marginTop: 12,
    fontFamily: 'Inter_400Regular',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  refreshButtonText: {
    marginLeft: 8,
    color: '#4f46e5',
    fontFamily: 'Inter_600SemiBold',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  listFooter: {
    height: 80,
  },
});
