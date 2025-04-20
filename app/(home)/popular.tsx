import { View, Text, StyleSheet, Button ,ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import CourseCard from '@/components/common/CourseCard';

export default function PopularCourses() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>🔥 Popular Courses</Text>
      <Button
        title="Go to Tabs"
        onPress={() => {
          router.push('/(tabs)/home'); // 👈 tab screen path
        }}
      />

<ScrollView contentContainerStyle={{ padding: 16 }}>
      <CourseCard
        title="Graphic Design Advanced"
        category="Graphic Design"
        price={28}
        oldPrice={42}
        rating={4.2}
        students={7830}
        image={require('../../assets/images/mentors/alice.png')} // replace with your image
      />

<CourseCard
        title="Graphic Design Advanced"
        category="Graphic Design"
        price={28}
        oldPrice={42}
        rating={4.2}
        students={7830}
        image={require('../../assets/images/mentors/alice.png')} // replace with your image
      />
      <CourseCard
        title="Graphic Design Advanced"
        category="Graphic Design"
        price={28}
        oldPrice={42}
        rating={4.2}
        students={7830}
        image={require('../../assets/images/mentors/alice.png')} // replace with your image
      />
      <CourseCard
        title="Graphic Design Advanced"
        category="Graphic Design"
        price={28}
        oldPrice={42}
        rating={4.2}
        students={7830}
        image={require('../../assets/images/mentors/alice.png')} // replace with your image
      />
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});
