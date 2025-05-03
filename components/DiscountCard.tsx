// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   StyleProp,
//   ViewStyle,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from '@expo/vector-icons';

// // Types
// type DiscountCardProps = {
//   type?: 'gradient' | 'neumorphic' | 'colorful';
//   discount: string;
//   title: string;
//   description: string;
//   onPress?: () => void;
//   style?: StyleProp<ViewStyle>;
// };

// const DiscountCard: React.FC<DiscountCardProps> = ({
//   type = 'gradient',
//   discount,
//   title,
//   description,
//   onPress,
//   style,
// }) => {
//   // Render Gradient Background Conditionally
//   const renderCardBackground = () => {
//     switch (type) {
//       case 'gradient':
//         return (
//           <LinearGradient
//             colors={['#6A11CB', '#2575FC']}
//             style={[styles.card, styles.gradientCard, style]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//           >
//             {renderCardContent()}
//           </LinearGradient>
//         );
//       case 'neumorphic':
//         return (
//           <View style={[styles.card, styles.neumorphicCard, style]}>
//             {renderCardContent()}
//           </View>
//         );
//       case 'colorful':
//         return (
//           <View style={[styles.card, styles.colorfulCard, style]}>
//             {renderCardContent()}
//           </View>
//         );
//       default:
//         return null;
//     }
//   };

//   // Shared Card Content
//   const renderCardContent = () => (
//     <>
//       {type === 'gradient' && (
//         <View style={styles.badge}>
//           <Text style={styles.badgeText}>LIMITED</Text>
//         </View>
//       )}
//       <Text style={[styles.discountPercent, { color: type === 'gradient' ? '#FFF' : '#333' }]}>
//         {discount}
//       </Text>
//       <Text style={[styles.title, { color: type === 'gradient' ? '#FFF' : '#333' }]}>
//         {title}
//       </Text>
//       <Text style={[styles.description, { color: type === 'gradient' ? '#FFF' : '#333', opacity: 0.8 }]}>
//         {description}
//       </Text>
//       {type === 'gradient' && (
//         <Ionicons name="rocket" size={40} color="#FFF" style={styles.cardIcon} />
//       )}
//       {type === 'colorful' && (
//         <View style={styles.timer}>
//           <Ionicons name="time" size={16} color="#FF6B6B" />
//           <Text style={styles.timerText}>23:59:59</Text>
//         </View>
//       )}
//       {type === 'neumorphic' && (
//         <TouchableOpacity style={styles.claimButton}>
//           <Text style={styles.claimText}>Claim Offer</Text>
//         </TouchableOpacity>
//       )}
//     </>
//   );

//   return (
//     <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
//       {renderCardBackground()}
//     </TouchableOpacity>
//   );
// };

// // Styles (Now without backgroundGradient)
// const styles = StyleSheet.create({
//   card: {
//     flex: 1,
//     minWidth: '48%',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   gradientCard: {
//     // Gradient is now handled by LinearGradient component
//   },
//   neumorphicCard: {
//     backgroundColor: '#F0F4F8',
//     shadowColor: '#A3B1C6',
//     shadowOffset: { width: 5, height: 5 },
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     borderWidth: 1,
//     borderColor: '#E5E9F2',
//   },
//   colorfulCard: {
//     backgroundColor: '#FFEFE8',
//     borderWidth: 1,
//     borderColor: '#FFD1C2',
//   },
//   badge: {
//     alignSelf: 'flex-start',
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 20,
//     marginBottom: 10,
//   },
//   badgeText: {
//     color: '#FFF',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   discountPercent: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 6,
//   },
//   description: {
//     fontSize: 12,
//   },
//   cardIcon: {
//     position: 'absolute',
//     right: 16,
//     bottom: 16,
//     opacity: 0.3,
//   },
//   claimButton: {
//     backgroundColor: '#4A90E2',
//     padding: 8,
//     borderRadius: 8,
//     alignSelf: 'flex-end',
//     marginTop: 10,
//   },
//   claimText: {
//     color: '#FFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   timer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   timerText: {
//     color: '#FF6B6B',
//     fontSize: 12,
//     marginLeft: 4,
//   },
// });

// export default DiscountCard;

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 3; // 3 cards with spacing

const DiscountCards = () => {
  return (
    <View style={styles.container}>
      {/* Card 1 - Premium Course Offer */}
      <TouchableOpacity activeOpacity={0.95}>
        <LinearGradient
          colors={['#6A11CB', '#2575FC']}
          style={[styles.card, styles.premiumCard]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>POPULAR</Text>
          </View>
          <Text style={styles.discount}>35% OFF</Text>
          <Text style={styles.title}>Full Stack Pro</Text>
          <Text style={styles.description}>React, Node, MongoDB</Text>
          <Ionicons name="rocket" size={28} color="rgba(255,255,255,0.3)" style={styles.icon} />
        </LinearGradient>
      </TouchableOpacity>

      {/* Card 2 - Limited Time Offer */}
      <TouchableOpacity activeOpacity={0.95} style={styles.card}>
        <View style={[styles.content, styles.limitedCard]}>
          <View style={styles.timerContainer}>
            <Ionicons name="time-outline" size={14} color="#FF6B6B" />
            <Text style={styles.timerText}>24h LEFT</Text>
          </View>
          <Text style={[styles.discount, styles.darkText]}>25% OFF</Text>
          <Text style={[styles.title, styles.darkText]}>Mobile Mastery</Text>
          <Text style={[styles.description, styles.darkText]}>React Native + Expo</Text>
          <View style={styles.claimButton}>
            <Text style={styles.claimText}>CLAIM</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Card 3 - New User Offer */}
      <TouchableOpacity activeOpacity={0.95}>
        <LinearGradient
          colors={['#FF9A9E', '#FAD0C4']}
          style={[styles.card, styles.newUserCard]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.badge}>
            <Text style={[styles.badgeText, styles.pinkBadge]}>NEW USER</Text>
          </View>
          <Text style={[styles.discount, styles.darkText]}>40% OFF</Text>
          <Text style={[styles.title, styles.darkText]}>Data Science</Text>
          <Text style={[styles.description, styles.darkText]}>Python + ML</Text>
          <MaterialIcons name="stars" size={28} color="rgba(0,0,0,0.1)" style={styles.icon} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    height: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  premiumCard: {
    padding: 16,
  },
  limitedCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  newUserCard: {
    padding: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  pinkBadge: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    color: '#D23C87',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  discount: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
  },
  darkText: {
    color: '#333333',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  description: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  icon: {
    position: 'absolute',
    right: 12,
    bottom: 12,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,107,107,0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timerText: {
    color: '#FF6B6B',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
  claimButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  claimText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});

export default DiscountCards;