import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Animated, Easing, Share } from 'react-native';
import { router } from 'expo-router';

const CertificateCard = ({ 
  courseName = "Advanced React Native", 
  studentName = "John Doe", 
  completionDate = "May 5, 2025",
  instructorName = "Jane Smith"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const scaleValue = new Animated.Value(0);
  const opacityValue = new Animated.Value(0);
  const translateYValue = new Animated.Value(30);

  const toggleCertificate = () => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYValue, {
          toValue: 30,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      scaleValue.setValue(0);
      opacityValue.setValue(0);
      translateYValue.setValue(30);
      
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 400,
          easing: Easing.bezier(0.175, 0.885, 0.32, 1.275),
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(translateYValue, {
          toValue: 0,
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: true,
        })
      ]).start();
    }
    setIsOpen(!isOpen);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I just completed the ${courseName} course! Check out my certificate.`,
        url: 'https://yourplatform.com/certificates/verify/12345',
        title: `My ${courseName} Certificate`
      });
    } catch (error) {
      console.error('Error sharing certificate:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={toggleCertificate}
        style={styles.viewCertificateButton}
        activeOpacity={0.7}
      >
        <Text style={styles.viewCertificateText}>VIEW CERTIFICATE</Text>
      </TouchableOpacity>

      {/* Overlay */}
      <Animated.View 
        style={[
          styles.overlay, 
          { 
            opacity: opacityValue,
            display: isOpen ? 'flex' : 'none' 
          }
        ]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      />

      {/* Certificate Card */}
      <Animated.View 
        style={[
          styles.cardContainer,
          { 
            transform: [
              { scale: scaleValue },
              { translateY: translateYValue }
            ],
            opacity: opacityValue,
            display: isOpen ? 'flex' : 'none'
          }
        ]}
      >
        <ImageBackground
          source={require('@/assets/images/icon.png')} // Replace with your actual image path
          style={styles.cardBackground}
          imageStyle={styles.cardBackgroundImage}
        >
          <View style={styles.cardContent}>
            <Text style={styles.congratsText}>Certificate of Completion</Text>
            
            <View style={styles.sealContainer}>
              <View style={styles.seal}>
                <Text style={styles.sealText}>✓</Text>
              </View>
            </View>
            
            <Text style={styles.awardedTo}>This is to certify that</Text>
            <Text style={styles.studentName}>{studentName}</Text>
            
            <Text style={styles.hasCompleted}>has successfully completed the</Text>
            <Text style={styles.courseName}>{courseName}</Text>
            
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{completionDate}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Instructor</Text>
                <Text style={styles.detailValue}>{instructorName}</Text>
              </View>
            </View>
            
            <View style={styles.signatureContainer}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureText}>Authorized Signature</Text>
            </View>
            
            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={styles.shareButton}
                onPress={handleShare}
              >
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={toggleCertificate}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  viewCertificateButton: {
    backgroundColor: '#4a6da7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  viewCertificateText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 100,
  },
  cardContainer: {
    position: 'absolute',
    top: '20%',
    left: '5%',
    right: '5%',
    zIndex: 200,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardBackground: {
    width: '100%',
    padding: 20,
  },
  cardBackgroundImage: {
    borderRadius: 12,
  },
  cardContent: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 8,
    padding: 25,
    alignItems: 'center',
  },
  congratsText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  sealContainer: {
    marginBottom: 20,
  },
  seal: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#388E3C',
  },
  sealText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  awardedTo: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  studentName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 15,
    textDecorationLine: 'underline',
  },
  hasCompleted: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 5,
    textAlign: 'center',
  },
  courseName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2980b9',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  signatureContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  signatureLine: {
    width: 150,
    height: 1,
    backgroundColor: '#2c3e50',
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 15,
  },
  shareButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginRight: 10,
  },
  shareButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default CertificateCard;