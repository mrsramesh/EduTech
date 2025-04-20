import { View, Text, StyleSheet ,Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Category() {
    const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Get online certificate intro 3 📚</Text>
      <View style={styles.buttonGroup}>
       <Button title="move to Let's u in " onPress={() => router.push('/(auth)/letsuin')} />
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
