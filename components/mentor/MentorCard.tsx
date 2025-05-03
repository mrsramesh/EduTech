// // components/mentor/MentorCard.tsx
// import { TouchableOpacity, View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';
// import React from 'react';

// type MentorCardProps = {
//   name: string;
//   image: ImageSourcePropType;
//   layout?: 'grid' | 'list';
//   onPress?: () => void;
// };

// const MentorCard: React.FC<MentorCardProps> = ({ 
//   name, 
//   image, 
//   layout = 'list', 
//   onPress 
// }) => {
//   return (
//     <TouchableOpacity 
//       onPress={onPress}
//       style={layout === 'list' ? styles.listContainer : styles.gridContainer}
//       activeOpacity={0.7}
//     >
//       <Image 
//         source={image} 
//         style={layout === 'list' ? styles.listImage : styles.gridImage} 
//       />
//       <Text style={layout === 'list' ? styles.listText : styles.gridText}>
//         {name}
//       </Text>
//       {layout === 'list' && (
//         <View style={styles.chevronContainer}>
//           <Text style={styles.chevron}>{'>'}</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   // Grid Layout Styles
//   gridContainer: {
//     width: 100,
//     alignItems: 'center',
//     margin: 8,
//     padding: 12,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   gridImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginBottom: 8,
//     borderWidth: 2,
//     borderColor: '#e7e7e7',
//   },
//   gridText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#333',
//     textAlign: 'center',
//   },

//   // List Layout Styles
//   listContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     marginBottom: 12,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   listImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 16,
//     borderWidth: 2,
//     borderColor: '#e7e7e7',
//   },
//   listText: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
  
//   // Chevron for list items
//   chevronContainer: {
//     paddingLeft: 8,
//   },
//   chevron: {
//     fontSize: 18,
//     color: '#999',
//     fontWeight: 'bold',
//   },
// });

// export default MentorCard;



// components/mentor/MentorCard.tsx

// import { TouchableOpacity, View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';
// import React from 'react';
// import { MaterialIcons } from '@expo/vector-icons';

// type MentorCardProps = {
//   name?: string;
//   image?: ImageSourcePropType;
//   specialty?: string;
//   rating?: number;
//   layout?: 'grid' | 'list';
//   onPress?: () => void;
// };

// const MentorCard: React.FC<MentorCardProps> = ({ 
//   name = 'Unknown Mentor', 
//   image = require('../../assets/images/icon.png'), 
//   specialty = 'General Education', 
//   rating = 0, 
//   layout = 'list', 
//   onPress = () => {} 
// }) => {
//   // Validate rating to be between 0-5
//   const validatedRating = Math.min(Math.max(rating || 0, 0), 5);
  
//   return (
//     <TouchableOpacity 
//       onPress={onPress}
//       style={layout === 'list' ? styles.listContainer : styles.gridContainer}
//       activeOpacity={0.8}
//     >
//       <Image 
//         source={image} 
//         style={styles.profileImage} 
//         defaultSource={require('../../assets/images/icon.png')}
//         onError={() => console.log('Error loading mentor image')}
//       />
//       <View style={styles.infoContainer}>
//         <View style={styles.nameContainer}>
//           <Text style={styles.name} numberOfLines={1}>{name}</Text>
//           {validatedRating >= 4.5 && (
//             <MaterialIcons name="verified" size={16} color="#4299e1" style={styles.verifiedIcon} />
//           )}
//         </View>
//         <Text style={styles.specialty} numberOfLines={1}>{specialty}</Text>
//         <View style={styles.ratingContainer}>
//           <Text style={styles.rating}>
//             ⭐ {validatedRating.toFixed(1)}
//           </Text>
//         </View>
//       </View>
//       {layout === 'list' && (
//         <View style={styles.chevronContainer}>
//           <Text style={styles.chevron}>›</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   listContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   gridContainer: {
//     width: 160,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     margin: 8,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   profileImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginRight: 16,
//     backgroundColor: '#f1f5f9', // Fallback color
//   },
//   infoContainer: {
//     flex: 1,
//     overflow: 'hidden', // Prevent text overflow
//   },
//   nameContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2D3748',
//     flexShrink: 1, // Allow text to shrink if needed
//   },
//   verifiedIcon: {
//     marginLeft: 6,
//   },
//   specialty: {
//     fontSize: 14,
//     color: '#718096',
//     marginBottom: 6,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   rating: {
//     fontSize: 14,
//     color: '#F6AD55',
//     fontWeight: '600',
//   },
//   chevronContainer: {
//     marginLeft: 8,
//   },
//   chevron: {
//     fontSize: 24,
//     color: '#CBD5E0',
//     fontWeight: 'bold',
//   },
// });

// export default MentorCard;

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Dimensions,
  Easing
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.4;
const AVATAR_SIZE = CARD_WIDTH * 0.6;

type MentorCardProps = {
  name?: string;
  image?: any;
  specialty?: string;
  rating?: number;
  students?: number;
  onPress?: () => void;
};

const MentorCard: React.FC<MentorCardProps> = ({ 
  name = 'Expert Mentor', 
  image = require('@/assets/images/mentors/alice.png'), 
  specialty = 'Specialized Field', 
  rating = 4.5, 
  students = 1000,
  onPress = () => {}
}) => {
  const [scaleValue] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(20));

  // Entry animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start(() => onPress());
  };

  const validatedRating = Math.min(Math.max(rating, 0), 5);
  const starIcons = [];
  
  for (let i = 1; i <= 5; i++) {
    starIcons.push(
      <FontAwesome
        key={i}
        name={i <= validatedRating ? 'star' : 'star-o'}
        size={14}
        color={i <= validatedRating ? '#FFC107' : '#E2E8F0'}
      />
    );
  }

  return (
    <Animated.View style={[
      styles.container,
      { 
        opacity: fadeAnim,
        transform: [
          { scale: scaleValue },
          { translateY: slideAnim }
        ] 
      }
    ]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Mentor Avatar with Border Gradient */}
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={['#FF5E3A', '#FF2A68']}
            style={styles.avatarBorder}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Image 
              source={image} 
              style={styles.avatar}
              resizeMode="cover"
            />
          </LinearGradient>
          
          {/* Verified Badge */}
          {validatedRating >= 4.7 && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={12} color="#FFF" />
            </View>
          )}
        </View>

        {/* Mentor Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.specialty} numberOfLines={1}>{specialty}</Text>
          
          {/* Rating and Students */}
          <View style={styles.metaContainer}>
            <View style={styles.ratingContainer}>
              {starIcons}
              <Text style={styles.ratingText}>{validatedRating.toFixed(1)}</Text>
            </View>
            
            <View style={styles.studentsContainer}>
              <Ionicons name="people" size={12} color="#718096" />
              <Text style={styles.studentsText}>
                {students > 1000 ? `${(students/1000).toFixed(1)}k` : students}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarBorder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: (AVATAR_SIZE - 6) / 2,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#4299E1',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  infoContainer: {
    alignItems: 'center',
    width: '100%',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 4,
    textAlign: 'center',
  },
  specialty: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 8,
    textAlign: 'center',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
    marginLeft: 4,
  },
  studentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentsText: {
    fontSize: 12,
    color: '#718096',
    marginLeft: 4,
  },
});

export default MentorCard;