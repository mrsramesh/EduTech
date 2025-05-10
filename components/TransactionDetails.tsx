import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

type TransactionProps = {
  transaction: {
    _id: string;
    courseTitle: string;
    amount: number;
    currency: string;
    paymentId: string;
    orderId: string;
    status: string;
    createdAt: string;
    courseId: {
      _id: string;
      title: string;
      description: string;
      category: string;
      thumbnail?: string;
    };
  };
};

const TransactionDetails: React.FC<TransactionProps> = ({ transaction }) => {
  const { courseId, paymentId, orderId, amount, currency, status, createdAt } = transaction;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={{
            uri:
              courseId.thumbnail?.trim() ||
              'https://via.placeholder.com/150',
          }}
          style={styles.thumbnail}
        />
        <View style={styles.headerText}>
          <Text style={styles.title}>{courseId.title}</Text>
          <Text style={styles.category}>{courseId.category}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.detailText}>💸 Amount: ₹{amount} {currency}</Text>
        <Text style={styles.detailText}>🧾 Payment ID: {paymentId}</Text>
        <Text style={styles.detailText}>📦 Order ID: {orderId}</Text>
        <Text style={styles.detailText}>📅 Date: {new Date(createdAt).toLocaleString()}</Text>
        <Text style={[styles.detailText, status === 'paid' ? styles.paid : styles.unpaid]}>
          ✅ Status: {status.toUpperCase()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  headerText: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  category: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  details: {
    marginTop: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  paid: {
    color: 'green',
    fontWeight: 'bold',
  },
  unpaid: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default TransactionDetails;
