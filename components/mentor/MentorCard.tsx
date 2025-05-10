
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