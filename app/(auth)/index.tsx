import { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const TeleadApp = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideUpAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    ]).start();

    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#0F2027', '#203A43', '#2C5364']}
        style={styles.gradientBackground}
      >
        <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
          {/* Animated Logo Circle */}
          <Animated.View
            style={[
              styles.circleContainer,
              {
                transform: [
                  { scale: scaleAnim },
                  { translateY: slideUpAnim }
                ]
              }
            ]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)']}
              style={styles.circleGradient}
            >
              <View style={styles.logoInnerCircle}>
                <MaterialIcons name="school" size={60} color="white" />
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Featured Mentor Card */}
          <Animated.View
            style={[
              styles.cardContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideUpAnim }
                ]
              }
            ]}
          >
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=80'
              }}
              style={styles.cardBackground}
              resizeMode="cover"
            />
            <BlurView intensity={60} tint="dark" style={styles.cardOverlay}>
              <View style={styles.cardContent}>
                <TouchableOpacity style={styles.playButton}>
                  <MaterialIcons name="play-arrow" size={32} color="white" />
                </TouchableOpacity>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Learn from Top Mentors</Text>
                  <Text style={styles.cardSubtitle}>Start your journey today</Text>
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Branding */}
          <Animated.View
            style={[
              styles.brandingContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideUpAnim }
                ]
              }
            ]}
          >
            <Text style={styles.logoText}>EduTech</Text>
            <Text style={styles.tagline}>Learn Without Limits</Text>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000'
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  circleContainer: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 40
  },
  circleGradient: {
    flex: 1,
    borderRadius: width * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10
  },
  logoInnerCircle: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  cardContainer: {
    width: width * 0.85,
    height: width * 0.5,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 40,
    position: 'relative',
    backgroundColor: '#222'
  },
  cardBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  cardOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
    borderRadius: 20
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEBC00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  cardTextContainer: {
    flex: 1
  },
  cardTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14
  },
  brandingContainer: {
    alignItems: 'center',
    marginTop: 10
  },
  logoText: {
    color: 'white',
    fontSize: 38,
    fontWeight: 'bold',
    letterSpacing: 4
  },
  tagline: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 5,
    letterSpacing: 1.5,
    textTransform: 'uppercase'
  }
});

export default TeleadApp;
