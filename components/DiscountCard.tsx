import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

// Define allowed MaterialIcons names
type IconName = 'school' | 'flash-on' | 'discount';

// Type definition for each discount card
type DiscountItem = {
  id: string;
  title: string;
  discount: string;
  description: string;
  colors: [string, string]; // At least two color stops
  icon: IconName;
};

const discounts: DiscountItem[] = [
  {
    id: '1',
    title: 'New Student Offer!',
    discount: '40% OFF',
    description: 'On first course enrollment',
    colors: ['#7F56D9', '#9E77ED'],
    icon: 'school',
  },
  {
    id: '2',
    title: 'Flash Sale!',
    discount: '30% OFF',
    description: 'Limited time offer',
    colors: ['#DD2590', '#EC796B'],
    icon: 'flash-on',
  },
  {
    id: '3',
    title: 'Bundle Deal!',
    discount: '50% OFF',
    description: '3+ course packages',
    colors: ['#0BA5EC', '#00C1B0'],
    icon: 'discount',
  },
];

const DiscountCard = () => {
  return (
    <FlatList
      horizontal
      data={discounts}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <TouchableOpacity activeOpacity={0.9}>
          <LinearGradient
            colors={item.colors}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialIcons name={item.icon} size={32} color="#FFFFFF" style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.discount}>{item.discount}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    gap: 16,
  },
  card: {
    width: 280,
    height: 160,
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 16,
  },
  icon: {
    opacity: 0.3,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  discount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontFamily: 'Inter-ExtraBold',
    marginBottom: 8,
  },
  description: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});

export default DiscountCard;
