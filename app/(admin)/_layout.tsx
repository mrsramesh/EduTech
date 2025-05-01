// import { Drawer } from 'expo-router/drawer';
// import { useRouter } from 'expo-router';
// import { TouchableOpacity, Text, View } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// export default function DashboardLayout() {
//   const router = useRouter();

//   return (
//     <Drawer
//       screenOptions={{
//         headerShown: false,
//         drawerStyle: {
//           width: '75%',
//         },
//       }}
//       drawerContent={(props) => (
//         <View style={{ flex: 1, paddingTop: 50, padding: 16 }}>
//           <TouchableOpacity 
//             onPress={() => router.push('/(admin)/teacherDashboard')}
//             style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}
//           >
//             <Ionicons name="home" size={20} style={{ marginRight: 10 }} />
//             <Text>Dashboard</Text>
//           </TouchableOpacity>
//           <TouchableOpacity 
//             onPress={() => router.push('/(admin)/courses')}
//             style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}
//           >
//             <Ionicons name="book" size={20} style={{ marginRight: 10 }} />
//             <Text>Courses</Text>
//           </TouchableOpacity>
//           <TouchableOpacity 
//             onPress={() => router.push('/(admin)/student')}
//             style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}
//           >
//             <Ionicons name="people" size={20} style={{ marginRight: 10 }} />
//             <Text>Students</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     >
//       <Drawer.Screen 
//         name="index" 
//         options={{ title: 'Dashboard' }} 
//       />
//       <Drawer.Screen 
//         name="courses" 
//         options={{ title: 'Courses' }} 
//       />
//       <Drawer.Screen 
//         name="students" 
//         options={{ title: 'Students' }} 
//       />
//     </Drawer>
//   );
// }

import { Drawer } from 'expo-router/drawer';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'; // Added StyleSheet import
import { Ionicons } from '@expo/vector-icons';
import {useRouter} from 'expo-router';

export default function DashboardLayout() {
  const router = useRouter();
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: '75%',
          backgroundColor: '#f8fafc',
        },
        drawerActiveTintColor: '#4C51BF',
        drawerInactiveTintColor: '#64748b',
      }}
      drawerContent={(props) => (
        <View style={{ flex: 1, paddingTop: 40 }}>
          {/* Drawer Header */}
          <View style={styles.drawerHeader}>
            <View style={styles.profileImage}>
              <Ionicons name="person" size={40} color="#4C51BF" />
            </View>
            <Text style={styles.profileName}>Mr. Sharma</Text>
            <Text style={styles.profileEmail}>teacher@example.com</Text>
          </View>

          {/* Drawer Items */}
          <TouchableOpacity 
            style={styles.drawerItem}
            onPress={() => props.navigation.navigate('home')}
          >
            <Ionicons name="home" size={20} style={styles.drawerIcon} />
            <Text style={styles.drawerLabel}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.drawerItem}
            onPress={() => props.navigation.navigate('courses')}
          >
            <Ionicons name="book" size={20} style={styles.drawerIcon} />
            <Text style={styles.drawerLabel}>Courses</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.drawerItem}
            onPress={() => props.navigation.navigate('students')}
          >
            <Ionicons name="people" size={20} style={styles.drawerIcon} />
            <Text style={styles.drawerLabel}>Students</Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity 
            style={[styles.drawerItem, { marginTop: 'auto', marginBottom: 20 }]}
           // onPress={() => props.navigation.navigate('(auth)/login')}
           onPress={() => {
             router.replace('/login'); // Changed from '(auth)/login'
          }}
          >
            <Ionicons name="log-out" size={20} style={styles.drawerIcon} />
            <Text style={styles.drawerLabel}>Logout</Text>
          </TouchableOpacity>

        </View>
      )}
    >
      <Drawer.Screen 
        name="home" 
        options={{ 
          title: 'Dashboard',
          drawerLabel: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          )
        }} 
      />
      <Drawer.Screen 
        name="courses" 
        options={{ 
          title: 'Courses',
          drawerLabel: 'Courses',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="book" color={color} size={size} />
          )
        }} 
      />
      <Drawer.Screen 
        name="students" 
        options={{ 
          title: 'Students',
          drawerLabel: 'Students',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size} />
          )
        }} 
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E9D8FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748b',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  drawerIcon: {
    marginRight: 15,
    color: '#64748b',
  },
  drawerLabel: {
    fontSize: 16,
  },
});