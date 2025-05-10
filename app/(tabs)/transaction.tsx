import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_URL } from '@/constants/urls';
import TransactionDetails from '../../components/TransactionDetails';


export default function TransactionScreen() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("Making transaction call");
        const { data } = await axios.get(AUTH_URL.TRANSACTION_LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Fetched transactions:", JSON.stringify(data.transactions, null, 2));
        setTransactions(data.transactions);
      } catch (error) {
        console.error("Failed to load transactions", error);
        Alert.alert("Error", "Could not load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading Transactions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>💰 Your Transactions</Text>
      <ScrollView style={styles.scrollView}>
        {transactions.map((tx) => (
          <TransactionDetails key={tx._id} transaction={tx} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  text: { fontSize: 24, fontWeight: 'bold', marginVertical: 16 },
  scrollView: { width: '100%' },
});
