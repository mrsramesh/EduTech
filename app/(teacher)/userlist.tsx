// import { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   FlatList, 
//   TouchableOpacity, 
//   ActivityIndicator,
//   Image,
//   ImageSourcePropType
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import API from '../utils/api';
// import Toast from 'react-native-toast-message';

// type User = {
//   _id: string;
//   fname: string;
//   lname: string;
//   email: string;
//   role: string;
//   profileImage?: string;
//   createdAt: string;
// };

// export default function UserListScreen() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedRole, setSelectedRole] = useState<string | null>(null);
//   const router = useRouter();

//   const fetchUsers = async (role?: string) => {
//     try {
//       setLoading(true);
//       const params = role ? { role } : {};
//       const response = await API.get('/users', { params });
//       setUsers(response.data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       Toast.show({
//         type: 'error',
//         text1: 'Error',
//         text2: 'Failed to fetch users',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers(selectedRole || undefined);
//   }, [selectedRole]);

//   const renderUserItem = ({ item }: { item: User }) => {
//     const imageSource: ImageSourcePropType = item.profileImage 
//       ? { uri: item.profileImage } 
//       : require('../../assets/images/icon.png'); // Add a default image

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>User Management</Text>
      
//       {/* Role Filter */}
//       <View style={styles.filterContainer}>
//         <Text style={styles.filterLabel}>Filter by Role:</Text>
//         <View style={styles.roleButtons}>
//           <TouchableOpacity
//             style={[styles.roleButton, !selectedRole && styles.activeRoleButton]}
//             onPress={() => setSelectedRole(null)}
//           >
//             <Text style={!selectedRole ? styles.activeRoleText : styles.roleText}>All</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.roleButton, selectedRole === 'student' && styles.activeRoleButton]}
//             onPress={() => setSelectedRole('student')}
//           >
//             <Text style={selectedRole === 'student' ? styles.activeRoleText : styles.roleText}>Students</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.roleButton, selectedRole === 'teacher' && styles.activeRoleButton]}
//             onPress={() => setSelectedRole('teacher')}
//           >
//             <Text style={selectedRole === 'teacher' ? styles.activeRoleText : styles.roleText}>Teachers</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* User List */}
//       {loading ? (
//         <ActivityIndicator size="large" style={styles.loader} />
//       ) : users.length === 0 ? (
//         <Text style={styles.noUsersText}>No users found</Text>
//       ) : (
//         <FlatList
//           data={users}
//           renderItem={renderUserItem}
//           keyExtractor={(item) => item._id}
//           contentContainerStyle={styles.listContent}
//         />
//       )}
//     </View>
//   );
//   }}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333',
//   },
//   filterContainer: {
//     marginBottom: 20,
//   },
//   filterLabel: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: '#555',
//   },
//   roleButtons: {
//     flexDirection: 'row',
//     gap: 10,
//   },
//   roleButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: '#e0e0e0',
//   },
//   activeRoleButton: {
//     backgroundColor: '#007AFF',
//   },
//   roleText: {
//     color: '#333',
//   },
//   activeRoleText: {
//     color: '#fff',
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   userCard: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 12,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
//   userInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   userName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   userEmail: {
//     fontSize: 14,
//     color: '#666',
//   },
//   userRole: {
//     fontSize: 12,
//     color: '#007AFF',
//     marginTop: 4,
//   },
//   loader: {
//     marginTop: 40,
//   },
//   noUsersText: {
//     textAlign: 'center',
//     marginTop: 20,
//     color: '#666',
//   },
// });


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
  ScrollView
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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: { role?: string } = {};
      
      if (selectedRole !== 'all') {
        params.role = selectedRole;
      }
      
      const response = await API.get('/users', { params });
      setUsers(response.data);
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
  }, [selectedRole]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.fname} ${user.lname}`.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const renderUserItem = ({ item }: { item: User }) => {
    const imageSource = item.profileImage 
      ? { uri: item.profileImage } 
      : require('../../assets/images/icon.png');

    return (
      <TouchableOpacity 
        style={styles.userCard}
        onPress={() => router.push(`/userdetail`)} // by unique ide
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
          <View style={[
            styles.roleBadge,
            item.role === 'teacher' ? styles.teacherBadge : styles.studentBadge
          ]}>
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
        {mentorId && (
          <Text style={styles.subtitle}>Students under mentor</Text>
        )}
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
              selectedRole === role && styles.activeRoleFilterButton
            ]}
            onPress={() => setSelectedRole(role as 'all' | 'student' | 'teacher')}
          >
            <Text style={[
              styles.roleFilterText,
              selectedRole === role && styles.activeRoleFilterText
            ]}>
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
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={onRefresh}
          >
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
    paddingBottom: 16,
  },
  roleFilterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeRoleFilterButton: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  roleFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    fontFamily: 'Inter_600SemiBold',
  },
  activeRoleFilterText: {
    color: '#ffffff',
  },
  listContent: {
    paddingHorizontal: 24,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    backgroundColor: '#f1f5f9',
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
    marginBottom: 4,
    fontFamily: 'Inter_600SemiBold',
    maxWidth: '80%',
  },
  verifiedIcon: {
    marginLeft: 6,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 6,
    fontFamily: 'Inter_400Regular',
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  teacherBadge: {
    backgroundColor: '#e0f2fe',
  },
  studentBadge: {
    backgroundColor: '#ecfdf5',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0c4a6e',
    fontFamily: 'Inter_600SemiBold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#64748b',
    fontFamily: 'Inter_400Regular',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#eef2ff',
  },
  refreshButtonText: {
    marginLeft: 8,
    color: '#4f46e5',
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  listFooter: {
    height: 40,
  },
});