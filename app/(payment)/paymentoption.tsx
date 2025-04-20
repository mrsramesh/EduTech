import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button } from 'react-native';
import { router } from 'expo-router';
const PaymentOption = () => {
    const goToHome = () => {
        router.push('/addnewcard'); // Navigates to Home tab
      };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Payment Option</Text>
      <Text style={styles.text}>💳 Choose or add your preferred payment method.</Text>
      <Text style={styles.text}>🔒 All transactions are secure and encrypted.</Text>
      <View style={styles.buttonContainer}>
        <Button title="Go to Home" onPress={goToHome} />
      </View>
    </SafeAreaView>
  );
};

export default PaymentOption;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f7fa',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '60%',
    marginTop: 10,
  },
});
