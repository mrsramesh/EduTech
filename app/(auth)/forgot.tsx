import { View, Text, TextInput, Button, StyleSheet,Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleReset = () => {
    console.log("Reset link sent to:", email);
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.heading}>Forgot Password</Text> */}
       <Pressable onPress={() => router.push('/(auth)/login')}>
           <Text style={styles.link}>Forgot Password </Text>
            </Pressable>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />

      <Button title="Reset Password" onPress={handleReset} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 16, padding: 12 },
  link:{
      backgroundColor : "red",
  },
});
