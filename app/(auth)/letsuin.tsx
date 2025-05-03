import { View, Text, StyleSheet ,Button } from 'react-native';
import { useRouter } from 'expo-router';
import AnimatedButton from '@/components/common/AnimatedButton';
import CelebrationCard from '@/components/common/CongratulationCard';

export default function Category() {
    const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sigin in with your Account 📚</Text>
        <AnimatedButton 
               text="Sigin in with your Account"
               onPress={() => router.push('/(auth)/login')}
             />
             <CelebrationCard
  title="Job Well Done!"
  message="Your performance this quarter exceeded all expectations"
  recipientName="Alex Chen"
  points={1250}
  date="September 30, 2023"
  backgroundColor="#4a00e0"
  accentColor="#f9d423"
  onPress={() => console.log('Celebration card pressed')}
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
