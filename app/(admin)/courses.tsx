
import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ScrollView, BackHandler ,ActivityIndicator} from 'react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { ADMIN_URL } from '@/constants/urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function DashboardHome() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Hardware back button handler
  useEffect(() => {
    const backAction = () => {
      router.push('/(admin)/teacherDashboard');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        storedToken && setToken(storedToken);
      } catch (error) {
        console.error('Token fetch error:', error);
      }
    })();
  }, []);

  const handleCreateCourse = async () => {
    try {
      if ([title, description, category].some(field => !field.trim())) {
        Toast.show({ type: 'error', text1: 'Please fill all required fields' });
        return;
      }

      setIsLoading(true);
      const response = await axios.post(
        ADMIN_URL.CREATE_COURSE,
        { title, description, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response) {
        Toast.show({ 
          type: 'success', 
          text1: '🎉 Course Created!',
          text2: 'New course has been added successfully'
        });
        setTitle('');
        setDescription('');
        setCategory('');
        setCreatedBy('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Creation Failed',
        text2: error.response?.data?.message || 'Please try again later',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#F8FAFC', '#FFFFFF']}
      style={styles.container}
    >
      {/* Header Section */}
      <LinearGradient
        colors={['#6366F1', '#4F46E5']}
        style={styles.header}
      >
        <TouchableOpacity 
          onPress={() => router.push('/(admin)/teacherDashboard')}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Course</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </LinearGradient>

      {/* Form Content */}
      <ScrollView 
        contentContainerStyle={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Course Name Input */}
        <View style={styles.inputContainer}>
          <Feather name="book" size={20} color="#64748B" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Course Title"
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Category Input */}
        <View style={styles.inputContainer}>
          <Feather name="grid" size={20} color="#64748B" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="Category"
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Description Input */}
        <View style={[styles.inputContainer, { height: 120 }]}>
          <Feather name="edit-3" size={20} color="#64748B" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { height: '100%' }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Course Description"
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Instructor Input */}
        <View style={styles.inputContainer}>
          <Feather name="user" size={20} color="#64748B" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={createdBy}
            onChangeText={setCreatedBy}
            placeholder="Instructor Name"
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          onPress={handleCreateCourse}
          disabled={isLoading}
          style={styles.button}
        >
          <LinearGradient
            colors={['#6366F1', '#4F46E5']}
            style={styles.buttonGradient}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Feather name="plus-circle" size={20} color="white" />
                <Text style={styles.buttonText}>Create Course</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 48,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    letterSpacing: 0.5,
  },
  formContainer: {
    padding: 24,
    paddingTop: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
  },
  button: {
    marginTop: 24,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
// full working  working  without 
 
// import React, { useEffect, useState } from 'react';
// import { View, TextInput, Text, TouchableOpacity, StyleSheet, ScrollView, BackHandler, KeyboardAvoidingView, Platform } from 'react-native';
// import Toast from 'react-native-toast-message';
// import axios from 'axios';
// import { ADMIN_URL } from '@/constants/urls';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter } from 'expo-router';
// import { Feather } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import Animated, { FadeIn, FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
// import LottieView from 'lottie-react-native';


// const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
// const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// export default function DashboardHome() {
//   const router = useRouter();
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [category, setCategory] = useState('');
//   const [createdBy, setCreatedBy] = useState('');
//   const [token, setToken] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
  
//   // Animation Values
//   const buttonScale = useSharedValue(1);
//   const inputFocus = useSharedValue(0);
//   const successProgress = useSharedValue(0);

//   const buttonStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: buttonScale.value }],
//     opacity: isLoading ? 0.8 : 1
//   }));

//   const successStyle = useAnimatedStyle(() => ({
//     opacity: successProgress.value,
//     transform: [{ scale: successProgress.value }]
//   }));

//   // Hardware back handler remains same...

//   const handleCreateCourse = async () => {
//     try {
//       buttonScale.value = withSpring(0.95);
//       // ... existing logic
//       if (response) {
//         successProgress.value = withTiming(1, { duration: 500 });
//         setTimeout(() => successProgress.value = withTiming(0), 2000);
//       }
//     } finally {
//       buttonScale.value = withSpring(1);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={{ flex: 1 }}
//     >
//       <AnimatedLinearGradient
//         colors={['#F8FAFC', '#FFFFFF']}
//         style={styles.container}
//         entering={FadeIn.duration(500)}
//       >
//         {/* Animated Header */}
//         <Animated.View entering={FadeInDown.duration(800)}>
//           <LinearGradient
//             colors={['#6366F1', '#4F46E5']}
//             style={styles.header}
//           >
//             <AnimatedTouchable 
//               onPress={() => router.push('/(admin)/teacherDashboard')}
//               style={[styles.backButton, { borderRadius: 16 }]}
//               activeOpacity={0.9}
// //      entering={FadeInLeft.duration(600).delay(200)}
// entering={FadeInDown.duration(600).delay(200)}
//             >
//               <Feather name="arrow-left" size={24} color="white" />
//             </AnimatedTouchable>
//             <Animated.Text 
//               style={styles.headerTitle}
//               entering={FadeInUp.duration(600).delay(300)}
//             >
//               Create New Course
//             </Animated.Text>
//           </LinearGradient>
//         </Animated.View>

//         {/* Floating Form Container */}
//         <Animated.View 
//           style={styles.formElevation}
//           entering={FadeInUp.duration(800).delay(400)}
//         >
//           <ScrollView
//             contentContainerStyle={styles.formContainer}
//             showsVerticalScrollIndicator={false}
//           >
//             {/* Animated Inputs with Floating Labels */}
//             <Animated.View entering={FadeInDown.duration(500).delay(600)}>
//               <View style={styles.inputContainer}>
//                 <Feather name="book" size={20} color="#64748B" />
//                 <TextInput
//                   style={styles.input}
//                   value={title}
//                   onChangeText={setTitle}
//                   placeholder="Course Title"
//                   placeholderTextColor="#94A3B8"
//                   onFocus={() => inputFocus.value = withSpring(1)}
//                   onBlur={() => inputFocus.value = withSpring(0)}
//                 />
//               </View>
//             </Animated.View>

//             {/* Repeat similar animated blocks for other inputs */}

//             {/* Success Animation */}
//             <Animated.View style={[styles.successContainer, successStyle]}>
//               <LottieView
//                 source={require('@/assets/animations/success-check.json')}
//                 autoPlay
//                 loop={false}
//                 style={styles.successAnimation}
//               />
//               <Text style={styles.successText}>Course Created!</Text>
//             </Animated.View>

//             {/* Submit Button with Complex Animation */}
//             <AnimatedTouchable
//               onPress={handleCreateCourse}
//               disabled={isLoading}
//               style={[styles.button, buttonStyle]}
//               activeOpacity={0.9}
//             >
//               <LinearGradient
//                 colors={['#6366F1', '#4F46E5']}
//                 style={styles.buttonGradient}
//                 start={{ x: 0, y: 0.5 }}
//                 end={{ x: 1, y: 0.5 }}
//               >
//                 {isLoading ? (
//                   <LottieView
//                     source={require('@/assets/animations/loading-spinner.json')}
//                     autoPlay
//                     loop
//                     style={styles.loadingAnimation}
//                   />
//                 ) : (
//                   <>
//                     <Feather name="plus-circle" size={20} color="white" />
//                     <Text style={styles.buttonText}>Create Course</Text>
//                     <LinearGradient
//                       colors={['rgba(255,255,255,0.3)', 'transparent']}
//                       style={styles.buttonShine}
//                       start={{ x: 0, y: 0 }}
//                       end={{ x: 1, y: 0 }}
//                     />
//                   </>
//                 )}
//               </LinearGradient>
//             </AnimatedTouchable>
//           </ScrollView>
//         </Animated.View>
//       </AnimatedLinearGradient>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 24,
//     paddingTop: 54,
//     paddingBottom: 30,
//     borderBottomLeftRadius: 32,
//     borderBottomRightRadius: 32,
//     shadowColor: '#4F46E5',
//     shadowOffset: { width: 0, height: 12 },
//     shadowOpacity: 0.2,
//     shadowRadius: 24,
//     elevation: 8,
//   },
//   backButton: {
//     padding: 12,
//     backgroundColor: 'rgba(255, 255, 255, 0.15)',
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: 'white',
//     letterSpacing: 0.8,
//     marginLeft: 16,
//     textShadowColor: 'rgba(0, 0, 0, 0.1)',
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 4,
//   },
//   formElevation: {
//     flex: 1,
//     backgroundColor: 'white',
//     borderRadius: 32,
//     marginTop: -24,
//     paddingTop: 40,
//     shadowColor: '#1E293B',
//     shadowOffset: { width: 0, height: 20 },
//     shadowOpacity: 0.08,
//     shadowRadius: 32,
//     elevation: 16,
//   },
//   formContainer: {
//     padding: 28,
//     paddingBottom: 48,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F8FAFC',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 20,
//     borderWidth: 2,
//     borderColor: '#F1F5F9',
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#0F172A',
//     fontWeight: '500',
//     marginLeft: 12,
//     includeFontPadding: false,
//   },
//   button: {
//     borderRadius: 16,
//     overflow: 'hidden',
//     shadowColor: '#4F46E5',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//   },
//   buttonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: 58,
//     gap: 12,
//     paddingHorizontal: 32,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '700',
//     letterSpacing: 0.8,
//   },
//   buttonShine: {
//     position: 'absolute',
//     right: 0,
//     width: '30%',
//     height: '100%',
//     opacity: 0.4,
//   },
//   successContainer: {
//     alignItems: 'center',
//     marginVertical: 24,
//   },
//   successAnimation: {
//     width: 120,
//     height: 120,
//   },
//   successText: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#10B981',
//     marginTop: -16,
//   },
//   loadingAnimation: {
//     width: 40,
//     height: 40,
//   },
// });