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
import { colors } from '../../theme'; 

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
    backgroundColor: colors.darkBackground
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
    backgroundColor: colors.darkBackground
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40
  },
  circleContainer: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 30,
    position: 'relative'
  },
  circleGradient: {
    flex: 1,
    borderRadius: width * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
    backgroundColor: colors.primary, // Added primary color base
    borderWidth: 2,
    borderColor: `rgba(${colors.secondary}, 0.2)`
  },
  logoInnerCircle: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: `rgba(255,255,255,0.05)`,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: `rgba(${colors.secondary}, 0.3)`,
    overflow: 'hidden'
  },
  logoImage: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
    tintColor: colors.white
  },
  cardContainer: {
    width: width * 0.9,
    height: width * 0.6,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 30,
    position: 'relative',
    backgroundColor: colors.darkBackground,
    borderWidth: 1,
    borderColor: `rgba(255,255,255,0.15)`,
    shadowColor: colors.darkBackground,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15
  },
  cardBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.8
  },
  cardOverlay: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-end',
    backgroundColor: `rgba(${colors.darkBackground}, 0.6)`,
    borderRadius: 24
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5
  },
  playIcon: {
    marginLeft: 4,
    tintColor: colors.darkBackground
  },
  cardTextContainer: {
    flex: 1
  },
  cardTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
    textShadowColor: `rgba(${colors.darkBackground}, 0.5)`,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3
  },
  cardSubtitle: {
    color: `rgba(255,255,255,0.9)`,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.3
  },
  brandingContainer: {
    alignItems: 'center',
    marginTop: 20
  },
  logoText: {
    color: colors.white,
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 5,
    textShadowColor: `rgba(${colors.darkBackground}, 0.5)`,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3
  },
  tagline: {
    color: `rgba(255,255,255,0.8)`,
    fontSize: 16,
    marginTop: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '500'
  },
  loadingContainer: {
    marginTop: 40,
    alignItems: 'center'
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 12,
    letterSpacing: 1
  }
});
export default TeleadApp;
