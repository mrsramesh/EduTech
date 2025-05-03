
// import React from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import { FontAwesome, Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';

// interface CourseCardProps {
//   title: string;
//   category: string;
//   price: number;
//   oldPrice: number;
//   rating: number;
//   students: number;
//   image: any;
// }

// const CourseCard: React.FC<CourseCardProps> = ({
//   title,
//   category,
//   price,
//   oldPrice,
//   rating,
//   students,
//   image,
// }) => {
//   const router = useRouter();

//   const handleCardPress = () => {
//     router.push('/(payment)/paymentoption');
//   };

//   return (
//     <TouchableOpacity onPress={handleCardPress} activeOpacity={0.8}>
//       <View style={styles.card}>
//         <Image source={image} style={styles.thumbnail} />

//         <View style={styles.info}>
//           <Text style={styles.category}>{category}</Text>
//           <Text style={styles.title} numberOfLines={2}>{title}</Text>

//           <View style={styles.priceRow}>
//             <Text style={styles.price}>${price}</Text>
//             <Text style={styles.oldPrice}>${oldPrice}</Text>
//           </View>

//           <View style={styles.metaRow}>
//             <View style={styles.rating}>
//               <FontAwesome name="star" size={14} color="#f5a623" />
//               <Text style={styles.metaText}> {rating}</Text>
//             </View>

//             <Text style={styles.separator}>|</Text>

//             <Text style={styles.metaText}>{students} Std</Text>
//           </View>
//         </View>

//         <Ionicons name="bookmark-outline" size={20} color="#2e7d32" style={styles.bookmark} />
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     overflow: 'hidden',
//     padding: 10,
//     marginVertical: 8,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   thumbnail: {
//     width: 80,
//     height: 80,
//     borderRadius: 10,
//     backgroundColor: '#000',
//   },
//   info: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   category: {
//     fontSize: 12,
//     color: 'orange',
//     marginBottom: 2,
//   },
//   title: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   priceRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   price: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#007bff',
//     marginRight: 6,
//   },
//   oldPrice: {
//     fontSize: 12,
//     textDecorationLine: 'line-through',
//     color: '#888',
//   },
//   metaRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 6,
//   },
//   rating: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   metaText: {
//     fontSize: 12,
//     color: '#444',
//   },
//   separator: {
//     marginHorizontal: 6,
//     color: '#ccc',
//   },
//   bookmark: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//   },
// });

// export default CourseCard; // Make sure this is the default export



import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Dimensions
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

interface CourseCardProps {
  title: string;
  category: string;
  price: number;
  oldPrice: number;
  rating: number;
  students: number;
  image: any;
  isPopular?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  category,
  price,
  oldPrice,
  rating,
  students,
  image,
  isPopular = false
}) => {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const scaleValue = new Animated.Value(1);
  const bookmarkScale = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start(() => router.push('/(payment)/paymentoption'));
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    Animated.sequence([
      Animated.timing(bookmarkScale, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(bookmarkScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {isPopular && (
          <LinearGradient
            colors={['#FF5E3A', '#FF2A68']}
            style={styles.popularBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.popularText}>🔥 POPULAR</Text>
          </LinearGradient>
        )}
        
        <Image source={image} style={styles.thumbnail} />
        
        <View style={styles.content}>
          <Text style={styles.category}>{category}</Text>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${price}</Text>
            <Text style={styles.oldPrice}>${oldPrice}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {Math.round((1 - price/oldPrice) * 100)}% OFF
              </Text>
            </View>
          </View>
          
          <View style={styles.footer}>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={14} color="#FFC107" />
              <Text style={styles.metaText}>{rating}</Text>
              <View style={styles.separator} />
              <Ionicons name="people" size={14} color="#6C757D" />
              <Text style={styles.metaText}>{students.toLocaleString()}</Text>
            </View>
            
            <TouchableOpacity onPress={toggleBookmark} activeOpacity={0.7}>
              <Animated.View style={{ transform: [{ scale: bookmarkScale }] }}>
                <Ionicons 
                  name={isBookmarked ? "bookmark" : "bookmark-outline"} 
                  size={22} 
                  color={isBookmarked ? "#4CAF50" : "#6C757D"} 
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  content: {
    padding: 16,
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  popularText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C757D',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
    lineHeight: 24,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4CAF50',
    marginRight: 8,
  },
  oldPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#ADB5BD',
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFC107',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingTop: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#495057',
    marginLeft: 4,
    marginRight: 8,
  },
  separator: {
    width: 1,
    height: 16,
    backgroundColor: '#E9ECEF',
    marginHorizontal: 8,
  },
});

export default CourseCard;