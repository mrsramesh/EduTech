import { View, Text, StyleSheet ,Button} from 'react-native';
import { useRouter } from 'expo-router';

export default function Courselist() {
   const router=useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Course list screen 📚</Text>
      <View style={styles.buttonGroup}>
       <Button title="Course list" onPress={() => router.push('/coursefilter')} />
       </View>
       <View style={styles.buttonGroup}>
       <Button title="Single Course Detail" onPress={() => router.push('/singlecourse')} />
       </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: '600' },
  buttonGroup: {
    gap: 12,
    marginBottom: 20,
  },
});
