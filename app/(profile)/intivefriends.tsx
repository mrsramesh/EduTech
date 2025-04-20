
// Example: EditProfile.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView,Button } from 'react-native';
import {router} from 'expo-router';
const EditProfile = () => {
    const goToHome = () => {
        router.push('/(tabs)/home'); // Navigates to Home tab
      };
  return (
    <SafeAreaView style={screenStyles.container}>
      <Text style={screenStyles.title}>invite Screen</Text>
      <View style={screenStyles.buttonContainer}>
        <Button title="Go to Home" onPress={goToHome} />
      </View>
    </SafeAreaView>
  );
};
export default EditProfile;

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  buttonContainer: {
    width: '60%',
    marginTop: 10,
  },
});
