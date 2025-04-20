import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native';
import CourseCard from '../../components/CourseCard'//'../components/CourseCard';
import {useRouter} from 'expo-router';

export default function TransactionScreen() {
    const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>💰 Transaction Screen</Text>
      <ScrollView>
      <CourseCard
        title="Master React Native"
        subject="Mobile Development"
        videoUrl="https://www.w3schools.com/html/mov_bbb.mp4"
        onPressPaid={() => router.push('/(payment)/receipt')}
      />
      <CourseCard
        title="Data Structures in JS"
        subject="Computer Science"
        videoUrl="https://www.w3schools.com/html/movie.mp4"
        onPressPaid={() => alert('Redirecting to payment')}
      />
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, fontWeight: 'bold' },
});
