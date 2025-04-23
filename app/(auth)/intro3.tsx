import { View, Text, StyleSheet ,Button } from 'react-native';
import { useRouter } from 'expo-router';
import AnimatedButton from '../../components/common/AnimatedButton';


export default function Category() {
    const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Get online certificate  📚</Text>
      {/* <View style={styles.buttonGroup}>
       <Button title="move to Let's u in " onPress={() => router.push('/(auth)/letsuin')} />

       </View> */}
        {/* Default button */}
      <AnimatedButton 
        text="Get Started"
        onPress={() => router.push('/(auth)/letsuin')}
      />

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
