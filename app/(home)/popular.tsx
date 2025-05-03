
import React from 'react';
import { View, Text, ScrollView, StyleSheet ,TouchableOpacity,Dimensions} from 'react-native';
import { useRouter } from 'expo-router';
import CourseCard from '@/components/common/CourseCard';

export default function PopularCourses() {
  const router = useRouter();

  return (
    <View style={styles.container}>
    

      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={Dimensions.get('window').width - 32 + 16}
      >
        <CourseCard
          title="Advanced Graphic Design Masterclass"
          category="Design"
          price={28}
          oldPrice={42}
          rating={4.8}
          students={7830}
          image={require('../../assets/images/mentors/alice.png')}
          isPopular={true}
        />
        <CourseCard
          title="React Native from Zero to Hero"
          category="Mobile Dev"
          price={35}
          oldPrice={50}
          rating={4.9}
          students={12500}
          image={require('../../assets/images/mentors/alice.png')}
        />
        <CourseCard
          title="Python Data Science Bootcamp"
          category="Data Science"
          price={45}
          oldPrice={60}
          rating={4.7}
          students={9200}
          image={require('../../assets/images/mentors/alice.png')}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  seeAll: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingRight: 16,
    paddingBottom: 8,
  },
});