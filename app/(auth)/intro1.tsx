import { View, Text, StyleSheet ,Button } from 'react-native';
import { useRouter } from 'expo-router';
import AnimatedButton from '@/components/common/AnimatedButton';
export default function Category() {
    const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Online Learing ..... 📚</Text>
      {/* <View style={styles.buttonGroup}>
       <Button title="move to intro2" onPress={() => router.push('/intro2')} />
       </View> */}

       <AnimatedButton 
        text=""
        iconName="send"
        backgroundColor="#FF5722"
        fontWeight="bold" // Valid value
        onPress={()=>router.push('/intro3')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' ,  gap: 20,
    padding: 20,},
  text: { fontSize: 20, fontWeight: '600' },
  buttonGroup: {
    gap: 12,
    marginBottom: 20,
  },
});
