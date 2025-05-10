import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TransactionProps = {
  transaction: {
    _id: string;
    amount: number;
    status: string;
    createdAt: string;
    courseId: {
      title: string;
      category: string;
    };
  };
};

const TransactionDetails: React.FC<TransactionProps> = ({ transaction }) => {
  const { courseId, amount, status, createdAt } = transaction;

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{courseId.title}</Text>
          <Text style={styles.category}>{courseId.category}</Text>
          <Text style={styles.date}>
            {new Date(createdAt).toLocaleDateString('en-IN')}
          </Text>
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.amount}>₹{amount}</Text>
          <Text style={[styles.status, status === 'success' && styles.success]}>
            {status.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6CBB3C',
  },
  success: {
    color: '#6CBB3C',
  },
});
export default TransactionDetails;