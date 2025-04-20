import { View, Text, Button, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import {checkAuth, logout} from '../app/utils/auth'
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validate = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        Toast.show({ type: 'error', text1: 'Please login first' });
       // router.replace('/(auth)/login');
      } else {
        setLoading(false);
      }
    };
    validate();
  }, []);

  const handleLogout = async () => {
    await logout();
    Toast.show({ type: 'success', text1: 'Logged out successfully' });
    router.replace('/(auth)/login');
  };

  if (loading) return <Text style={styles.loading}>Checking login...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to EduTech Dashboard 🎓 1234</Text>
      <Button title="Logout" onPress={handleLogout} />
       

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  loading: { flex: 1, justifyContent: 'center', textAlign: 'center', fontSize: 18 },
});
