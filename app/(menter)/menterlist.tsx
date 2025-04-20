// import { View, Text, StyleSheet ,Button } from 'react-native';
// import { useRouter } from 'expo-router';

// export default function Mentor() {
//     const router = useRouter();
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>This is the mentor list screen 📚</Text>
//       <View style={styles.buttonGroup}>
//        <Button title="Category" onPress={() => router.push('/singlemantor')} />
//        </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   text: { fontSize: 20, fontWeight: '600' },
//   buttonGroup: {
//     gap: 12,
//     marginBottom: 20,
//   },
// });


import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MentorCard from '../../components/mentor/MentorCard';

const mentors = [
  { name: 'Alice', image: require('../../assets/images/mentors/alice.png') },
  { name: 'Bob', image: require('../../assets/images/mentors/alice.png') },
  { name: 'Charlie', image: require('../../assets/images/mentors/alice.png') },
  { name: 'Daisy', image: require('../../assets/images/mentors/alice.png') },
  { name: 'Ethan', image: require('../../assets/images/mentors/alice.png') },
  { name: 'Alice', image: require('../../assets/images/mentors/alice.png') },
  { name: 'Bob', image: require('../../assets/images/mentors/alice.png') },
  { name: 'Charlie', image: require('../../assets/images/mentors/alice.png') },
  { name: 'Daisy', image: require('../../assets/images/mentors/alice.png') },
  { name: 'Ethan', image: require('../../assets/images/mentors/alice.png') },

];

export default function MentorListScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>All Mentors</Text>
      {mentors.map((mentor, index) => (
        <MentorCard key={index} name={mentor.name} image={mentor.image} layout="list" />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
