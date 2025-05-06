import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
  BackHandler 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// Components
import SearchComponent from '@/components/common/SearchWithFilter';
import CourseSection from '@/components/CourseSection';
import API from '@/utils/api';
import DiscountCard from '@/components/DiscountCard';
import Categories from '@/components/CategoriesHome';
import { RootState } from '@/redux/store'; // Import your store type
import { useSelector } from 'react-redux';

const router =useRouter();
// HomeScreen कंपोनेंट के अंदर (useEffect के साथ)
useEffect(() => {
  const backAction = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      BackHandler.exitApp(); // ऐप बंद करें अगर कोई बैक नहीं है
    }
    return true; // बैक एक्शन को हैंडल कर लिया गया है
  };

  const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  return () => backHandler.remove();
}, [router]);
// useEffect(() => {
//   const checkAuthAndFetchData = async () => {
//     const token = await AsyncStorage.getItem('token');
//     if (!token) {
//       router.replace('/(auth)/login'); // <-- replace का इस्तेमाल करें
//       return;
//     }

//     try {
//       const userResponse = await API.get('/api/auth/me', { 
//         headers: { Authorization: `Bearer ${token}` } 
//       });
//       setUser(userResponse.data.data);
//     } catch (error) {
//       router.replace('/(auth)/login'); // टोकन इनवैलिड हो तो भी लॉगिन पर भेजें
//     } finally {
//       setLoading(false);
//     }
//   };

//   checkAuthAndFetchData();
// }, []);
// Types

type User = {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  profileImage?: string;
  role: string;
};

const { width } = Dimensions.get('window');


const HomeScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

    // Access specific data from Redux store
  const user1 = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          router.replace('/(auth)/login');
          return;
        }


        const userResponse = await API.get('/api/auth/me', { 
          headers: { Authorization: `Bearer ${token}` } 
        });



        setUser(userResponse.data.data);
      } catch (error) {
        console.error('Fetch error:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load user data',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#7F56D9" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>No user data found</Text>
      </View>
    );
  }

  const userInitials = `${user.fname?.[0] || ''}${user.lname?.[0] || ''}`;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <LinearGradient
        colors={['#7F56D9', '#9E77ED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user.fname} {user.lname}</Text>
          </View>
          {user.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{userInitials}</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Main Content */}
      <View style={styles.content}>
        <SearchComponent />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Offers</Text>
          <DiscountCard />
        </View>

        <View style={styles.section}>
          {/* <Text style={styles.sectionTitle}>Explore Categories</Text> */}
          <Categories />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Courses</Text>
            <TouchableOpacity onPress={() => router.push('/(home)/popular')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <CourseSection />
        </View>
      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#475467',
    fontFamily: 'Inter-Medium',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: '#F9FAFB',
    fontSize: 18,
    fontFamily: 'Inter-Regular',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginTop: 8,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF4D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  section: {
    marginVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#101828',
  },
  seeAll: {
    color: '#7F56D9',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});

export default HomeScreen;