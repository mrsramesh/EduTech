import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';
import API from '../utils/api';
import { AUTH_URL } from '../constants/urls';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Topmantor() {
  const router = useRouter();

  const handleLogin = async () => {
   

      
      // ✅ Navigate to /menter after login
      router.push('/(menter)/menterlist');
    } 
  

  return (
    <View style={styles.container}>
      <Text style={styles.text}>📘 My Courses</Text>
      <Button title="Login and Go to Mentor Page" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});
