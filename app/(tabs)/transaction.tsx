import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native';
import CourseCard from '@/components/CourseCard'//'../components/CourseCard';
import {useRouter} from 'expo-router';

export default function TransactionScreen() {
    const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>💰 Transaction Screen</Text>
      <ScrollView>
      <CourseCard course={{
  id: "1",
  title: "Master React Native",
  duration: "10h 20m",
  progress: 0.75,
  category: "Mobile Development"
}} />
      <CourseCard
  title="Master React Native"
  subject="Mobile Development"
  videoUrl="https://example.com/video.mp4"
  onPressPaid={() => router.push('/(payment)/receipt')}
/>,
{/* <CourseCard
  course={existingCourse}
  onPressPaid={() => router.push('/(payment)/receipt')}
  progress={0.9} // Override progress
/> */}
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, fontWeight: 'bold' },
});
