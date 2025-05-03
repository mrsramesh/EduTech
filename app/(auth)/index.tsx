import { useEffect } from 'react';
import { router } from 'expo-router';
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions,
  TouchableOpacity, 
  ImageBackground,
  ScrollView,
  SafeAreaView
} from 'react-native';

const { width, height } = Dimensions.get('window');

const TeleadApp = () => {
  // Placeholder function for button press
  const handleButtonPress = () => {
    console.log('Button pressed!');
    // Add your navigation logic here
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 2000); // 2 sec delay

    return () => clearTimeout(timer);
  }, []);
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Blue Background */}
        <View style={styles.blueBackground} />
        
        {/* Main Content Container */}
        <View style={styles.contentContainer}>
          
          {/* Circular Image Placeholder */}
          <View style={styles.circleContainer}>
            <View style={styles.circleOutline}>
              {/* Replace this with your Image component */}
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>Your Image Here</Text>
              </View>
            </View>
          </View>
          
          {/* Card Component */}
          <TouchableOpacity 
            style={styles.card} 
            onPress={handleButtonPress}
            activeOpacity={0.8}
          >
            <ImageBackground
              style={styles.cardBackground}
              source={require('../../assets/images/mentors/alice.png')} // Replace with your image
              resizeMode="cover"
            >
              <View style={styles.cardContent}>
                {/* Play Button Placeholder */}
                <View style={styles.playButton}>
                  <View style={styles.playTriangle} />
                </View>
                
                {/* Card Bottom Content */}
                <View style={styles.cardBottom}>
                  <View style={styles.cardLine} />
                  <View style={styles.cardDot} />
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
          
          {/* Logo and Text */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Telead</Text>
            <Text style={styles.tagline}>Learn From Home</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flexGrow: 1,
    minHeight: height,
  },
  blueBackground: {
    position: 'absolute',
    width: '100%',
    height: height * 0.5,
    backgroundColor: '#0961F5',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: height * 0.05,
    paddingBottom: 20,
  },
  circleContainer: {
    marginTop: height * 0.05,
    marginBottom: height * 0.03,
  },
  circleOutline: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    borderWidth: 3,
    borderColor: '#E8F1FF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  card: {
    width: width * 0.85,
    height: width * 0.5,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    padding: 15,
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(254, 188, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: '20%',
  },
  playTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 0,
    borderBottomWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: '#fff',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    marginLeft: 5,
  },
  cardBottom: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLine: {
    flex: 1,
    height: 3,
    backgroundColor: '#0455BF',
    marginRight: 10,
  },
  cardDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FEBC00',
  },
  logoContainer: {
    marginTop: height * 0.03,
    alignItems: 'center',
  },
  logoText: {
    color: '#332DA1',
    fontSize: 30,
    fontFamily: 'Aubrey',
    letterSpacing: 2.2,
    marginBottom: 5,
  },
  tagline: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

export default TeleadApp;