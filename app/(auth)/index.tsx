
//  import { useEffect } from 'react';
//  import { router } from 'expo-router';

//   import React from 'react';

// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   Dimensions,
//   TouchableOpacity, 
//   ImageBackground,
//   ScrollView,
//   SafeAreaView
// } from 'react-native';

// const { width, height } = Dimensions.get('window');

// const TeleadApp = () => {
//   // Placeholder function for button press
//   const handleButtonPress = () => {
//     console.log('Button pressed!');
//     // Add your navigation logic here
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       router.replace('/(auth)/login');
//     }, 2000); // 2 sec delay

//     return () => clearTimeout(timer);
//   }, []);
//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView contentContainerStyle={styles.container}>
//         {/* Blue Background */}
//         <View style={styles.blueBackground} />
        
//         {/* Main Content Container */}
//         <View style={styles.contentContainer}>
          
//           {/* Circular Image Placeholder */}
//           <View style={styles.circleContainer}>
//             <View style={styles.circleOutline}>
//               {/* Replace this with your Image component */}
//               <View style={styles.imagePlaceholder}>
//                 <Text style={styles.placeholderText}>Your Image Here</Text>
//               </View>
//             </View>
//           </View>
          
//           {/* Card Component */}
//           <TouchableOpacity 
//             style={styles.card} 
//             onPress={handleButtonPress}
//             activeOpacity={0.8}
//           >
//             <ImageBackground
//               style={styles.cardBackground}
//               source={require('../../assets/images/mentors/alice.png')} // Replace with your image
//               resizeMode="cover"
//             >
//               <View style={styles.cardContent}>
//                 {/* Play Button Placeholder */}
//                 <View style={styles.playButton}>
//                   <View style={styles.playTriangle} />
//                 </View>
                
//                 {/* Card Bottom Content */}
//                 <View style={styles.cardBottom}>
//                   <View style={styles.cardLine} />
//                   <View style={styles.cardDot} />
//                 </View>
//               </View>
//             </ImageBackground>
//           </TouchableOpacity>
          
//           {/* Logo and Text */}
//           <View style={styles.logoContainer}>
//             <Text style={styles.logoText}>Telead</Text>
//             <Text style={styles.tagline}>Learn From Home</Text>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff'
//   },
//   container: {
//     flexGrow: 1,
//     minHeight: height,
//   },
//   blueBackground: {
//     position: 'absolute',
//     width: '100%',
//     height: height * 0.5,
//     backgroundColor: '#0961F5',
//   },
//   contentContainer: {
//     flex: 1,
//     alignItems: 'center',
//     paddingTop: height * 0.05,
//     paddingBottom: 20,
//   },
//   circleContainer: {
//     marginTop: height * 0.05,
//     marginBottom: height * 0.03,
//   },
//   circleOutline: {
//     width: width * 0.7,
//     height: width * 0.7,
//     borderRadius: width * 0.35,
//     borderWidth: 3,
//     borderColor: '#E8F1FF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     overflow: 'hidden',
//   },
//   imagePlaceholder: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#ddd',
//   },
//   placeholderText: {
//     color: '#666',
//     fontSize: 16,
//   },
//   card: {
//     width: width * 0.85,
//     height: width * 0.5,
//     borderRadius: 10,
//     overflow: 'hidden',
//     marginVertical: 15,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//   },
//   cardBackground: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//   },
//   cardContent: {
//     flex: 1,
//     padding: 15,
//   },
//   playButton: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: 'rgba(254, 188, 0, 0.9)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'center',
//     marginTop: '20%',
//   },
//   playTriangle: {
//     width: 0,
//     height: 0,
//     backgroundColor: 'transparent',
//     borderStyle: 'solid',
//     borderLeftWidth: 15,
//     borderRightWidth: 0,
//     borderBottomWidth: 10,
//     borderTopWidth: 10,
//     borderLeftColor: '#fff',
//     borderRightColor: 'transparent',
//     borderBottomColor: 'transparent',
//     borderTopColor: 'transparent',
//     marginLeft: 5,
//   },
//   cardBottom: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//     right: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   cardLine: {
//     flex: 1,
//     height: 3,
//     backgroundColor: '#0455BF',
//     marginRight: 10,
//   },
//   cardDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: '#FEBC00',
//   },
//   logoContainer: {
//     marginTop: height * 0.03,
//     alignItems: 'center',
//   },
//   logoText: {
//     color: '#332DA1',
//     fontSize: 30,
//     fontFamily: 'Aubrey',
//     letterSpacing: 2.2,
//     marginBottom: 5,
//   },
//   tagline: {
//     color: 'black',
//     fontSize: 12,
//     fontFamily: 'Poppins',
//     fontWeight: '600',
//     textTransform: 'uppercase',
//   },
// });

// export default TeleadApp;

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
    }, 3000);

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
            <Text style={styles.logoText}>EduTach</Text>
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
