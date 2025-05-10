import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_URL } from '@/constants/urls';
import TransactionDetails from '../../components/TransactionDetails';
import { Ionicons } from '@expo/vector-icons';


export default function TransactionScreen() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const { data } = await axios.get(AUTH_URL.TRANSACTION_LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(data.transactions);
      } catch (error) {
        Alert.alert("Error", "Could not load transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <View style={screenStyles.container}>
      <Text style={screenStyles.header}>Payment History</Text>
      
      {loading ? (
        <View style={screenStyles.loadingContainer}>
          <Ionicons name="refresh-circle" size={24} color="#4C51BF" />
          <Text style={screenStyles.loadingText}>Loading transactions...</Text>
        </View>
      ) : (
        <ScrollView>
          {transactions.map((tx) => (
            <TransactionDetails key={tx._id} transaction={tx} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7FAFC',
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  loadingText: {
    color: '#718096',
  },
});
