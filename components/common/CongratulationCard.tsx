import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Icon from 'react-native-vector-icons/MaterialIcons';

type CelebrationCardProps = {
  title: string;
  message: string;
  recipientName: string;
  points?: number;
  date?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  onPress?: () => void;
  isInteractive?: boolean;
  animationDuration?: number;
  testID?: string;
};

const CelebrationCard: React.FC<CelebrationCardProps> = ({
  title = 'Congratulations!',
  message = 'You have achieved something amazing!',
  recipientName = 'Team Member',
  points = 0,
  date = new Date().toLocaleDateString(),
  backgroundColor = '#6a11cb',
  textColor = '#ffffff',
  accentColor = '#ff8a00',
  onPress,
  isInteractive = true,
  animationDuration = 1000,
  testID = 'celebration-card',
}) => {
  const [displayPoints, setDisplayPoints] = useState('0');
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;
  const rotateYValue = useRef(new Animated.Value(0)).current;
  const pointsValue = useRef(new Animated.Value(0)).current;

  const perspective = 1000;
  const rotateY = rotateYValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  });

  useEffect(() => {
    const listener = pointsValue.addListener(({ value }) => {
      setDisplayPoints(Math.floor(value).toString());
    });

    Animated.timing(pointsValue, {
      toValue: points,
      duration: 2000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();

    return () => {
      pointsValue.removeListener(listener);
    };
  }, [points]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: animationDuration,
        easing: Easing.bezier(0.175, 0.885, 0.32, 1.275),
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: animationDuration * 0.7,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    });
  }, []);

  const handlePressIn = () => {
    if (!isInteractive) return;
    Animated.spring(rotateYValue, {
      toValue: 1,
      friction: 3,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (!isInteractive) return;
    Animated.spring(rotateYValue, {
      toValue: 0,
      friction: 3,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (!isInteractive || !onPress) return;
    onPress();
  };

  const renderPointsCounter = () => {
    if (!points) return null;
    
    return (
      <View style={styles.pointsContainer}>
        <Icon name="star" size={40} color={accentColor} />
        <Text style={[styles.pointsText, { color: accentColor }]}>
          {displayPoints}
        </Text>
        <Text style={[styles.pointsLabel, { color: textColor }]}>Points</Text>
      </View>
    );
  };

  return (
    <View style={styles.container} testID={testID}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={!isInteractive}
      >
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor,
              transform: [
                { scale: scaleValue },
                { perspective },
                { rotateY },
              ],
              opacity: opacityValue,
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0)']}
            style={styles.gradientOverlay}
          />

          <Icon 
            name="emoji-events" 
            size={120} 
            color={textColor} 
            style={styles.characterIcon} 
          />

          <View style={styles.content}>
            <Text style={[styles.title, { color: textColor }]}>{title}</Text>
            <Text style={[styles.message, { color: textColor }]}>{message}</Text>
            
            <View style={styles.separator}>
              <LinearGradient
                colors={[accentColor, textColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.separatorLine}
              />
            </View>

            <Text style={[styles.recipient, { color: textColor }]}>
              For: {recipientName}
            </Text>

            {renderPointsCounter()}

            <Text style={[styles.date, { color: textColor }]}>{date}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const { width } = Dimensions.get('window');
const cardWidth = Math.min(width * 0.9, 400);
const cardHeight = cardWidth * 1.2;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: cardWidth,
    height: cardHeight,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  characterIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  title: {
    fontSize: cardWidth * 0.1,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 16,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  message: {
    fontSize: cardWidth * 0.045,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  separator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  separatorLine: {
    height: 3,
    width: '40%',
    borderRadius: 3,
  },
  recipient: {
    fontSize: cardWidth * 0.05,
    textAlign: 'center',
    marginTop: 8,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  pointsText: {
    fontSize: cardWidth * 0.12,
    fontWeight: 'bold',
    marginRight: 8,
  },
  pointsLabel: {
    fontSize: cardWidth * 0.06,
  },
  date: {
    fontSize: cardWidth * 0.035,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default React.memo(CelebrationCard);