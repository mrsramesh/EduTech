import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

interface CourseCardProps {
  title: string;
  category: string;
  price: number;
  oldPrice: number;
  rating: number;
  students: number;
  image: any;
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  category,
  price,
  oldPrice,
  rating,
  students,
  image,
}) => {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.thumbnail} />

      <View style={styles.info}>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>${price}</Text>
          <Text style={styles.oldPrice}>${oldPrice}</Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.rating}>
            <FontAwesome name="star" size={14} color="#f5a623" />
            <Text style={styles.metaText}> {rating}</Text>
          </View>

          <Text style={styles.separator}>|</Text>

          <Text style={styles.metaText}>{students} Std</Text>
        </View>
      </View>

      <Ionicons name="bookmark-outline" size={20} color="#2e7d32" style={styles.bookmark} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    padding: 10,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#000',
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  category: {
    fontSize: 12,
    color: 'orange',
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
    marginRight: 6,
  },
  oldPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    color: '#888',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#444',
  },
  separator: {
    marginHorizontal: 6,
    color: '#ccc',
  },
  bookmark: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default CourseCard;
