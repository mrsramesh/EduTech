import { View, Text, StyleSheet ,Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Singlemantorrating() {
    const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the single menter detail rating screen 📚</Text>
      {/* <View style={styles.buttonGroup}>
       <Button title="Category" onPress={() => router.push('/courselist')} />
       </View> */}
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
