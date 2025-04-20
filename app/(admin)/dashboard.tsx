import { View, Text, Button, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { checkAuth, logout } from '../utils/auth'; // ✅ same utils
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function TeacherDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validate = async () => {
      const isAuth = await checkAuth();
      const role = await AsyncStorage.getItem('role');
 
    //   if (!isAuth || role !== 'teacher') {
    //     Toast.show({ type: 'error', text1: 'Access denied' });
    //     router.replace('/(auth)/login');
    //   } else {
    //     setLoading(false);
    //   }
    };
    validate();
  }, []);

  const handleLogout = async () => {
    await logout();
    Toast.show({ type: 'success', text1: 'Logged out successfully' });
    router.replace('/(auth)/login');
  };

//   if (loading) return <Text style={styles.loading}>Checking access...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👨‍🏫 Welcome to the Teacher Dashboard</Text>
      <Text style={styles.sub}>Manage students, view reports, and more.</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  sub: { fontSize: 16, marginBottom: 20, textAlign: 'center', color: 'gray' },
  loading: { flex: 1, justifyContent: 'center', textAlign: 'center', fontSize: 18 },
});
