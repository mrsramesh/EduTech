import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet ,Button } from 'react-native';

export default function CertificateScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Certificate for Course ID: {id}</Text>
    </View>
  );
}
