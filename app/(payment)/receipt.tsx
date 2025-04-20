import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Menu, Provider, IconButton } from 'react-native-paper';
import * as Print from 'expo-print';
import * as MediaLibrary from 'expo-media-library';

export default function ReceiptScreen() {
  const router = useRouter();
  const {
    name,
    email,
    transactionId,
    course,
    category,
    price,
    date,
    time,
    status,
    orderId,
    invoiceId,
  } = useLocalSearchParams();

  const [menuVisible, setMenuVisible] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Receipt for ${course}\nAmount: ${price}\nTransaction ID: ${transactionId}`,
      });
    } catch (error) {
      console.error('Sharing failed:', error);
    }
  };

  const handlePrint = async () => {
    const html = `
      <h1>E-Receipt</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Course:</strong> ${course}</p>
      <p><strong>Price:</strong> ${price}</p>
      <p><strong>Transaction ID:</strong> ${transactionId}</p>
    `;
    await Print.printAsync({ html });
  };

  const handleDownload = async () => {
    const html = `
      <h1>E-Receipt</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Course:</strong> ${course}</p>
      <p><strong>Price:</strong> ${price}</p>
      <p><strong>Transaction ID:</strong> ${transactionId}</p>
    `;
    const { uri } = await Print.printToFileAsync({ html });

    const permission = await MediaLibrary.requestPermissionsAsync();
    if (permission.granted) {
      await MediaLibrary.saveToLibraryAsync(uri);
      alert('Receipt downloaded to your device.');
    } else {
      alert('Permission denied for saving file.');
    }
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header with 3-dot menu */}
        <View style={styles.header}>
          <Text style={styles.heading}>🧾 E-Receipt</Text>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={24}
                onPress={() => setMenuVisible(true)}
              />
            }>
            <Menu.Item onPress={handleShare} title="Share" />
            <Menu.Item onPress={handlePrint} title="Print" />
            <Menu.Item onPress={handleDownload} title="Download" />
          </Menu>
        </View>

        {/* Receipt Content */}
        <Text style={styles.label}>Order ID: <Text style={styles.value}>{orderId}</Text></Text>
        <Text style={styles.label}>Invoice ID: <Text style={styles.value}>{invoiceId}</Text></Text>
        <Text style={styles.label}>Name: <Text style={styles.value}>{name}</Text></Text>
        <Text style={styles.label}>Email ID: <Text style={styles.value}>{email}</Text></Text>
        <Text style={styles.label}>Course: <Text style={styles.value}>{course}</Text></Text>
        <Text style={styles.label}>Category: <Text style={styles.value}>{category}</Text></Text>
        <Text style={styles.label}>Transaction ID: <Text style={styles.value}>{transactionId}</Text></Text>
        <Text style={styles.label}>Price: <Text style={styles.value}>{price}</Text></Text>
        <Text style={styles.label}>Date: <Text style={styles.value}>{date} / {time}</Text></Text>
        <Text style={styles.label}>Status: <Text style={[styles.value, { color: 'green' }]}>{status}</Text></Text>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '600',
  },
  value: {
    fontWeight: '400',
    color: '#444',
  },
  backButton: {
    marginTop: 30,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
