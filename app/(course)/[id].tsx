// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   ScrollView,
//   ActivityIndicator,
//   RefreshControl
// } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { useQuery } from '@tanstack/react-query';
// import { Feather, MaterialIcons, AntDesign } from '@expo/vector-icons';
// import API from '@/utils/api';
// import { useAuth } from '@/app/context/AuthContext';
// import { LinearGradient } from 'expo-linear-gradient';

// interface Resource {
//   _id: string;
//   name: string;
//   url: string;
// }

// interface Lecture {
//   _id: string;
//   title: string;
//   description: string;
//   videoUrl?: string;
//   resources: Resource[];
// }

// interface CourseDetails {
//   _id: string;
//   title: string;
//   description: string;
//   category: string;
//   thumbnail: string;
//   lectures: Lecture[];
//   createdAt: string;
//   createdBy: {
//     _id: string;
//     email: string;
//     name?: string;
//   };
// }

// const CourseDetailsScreen = () => {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const { user } = useAuth();
//   const [refreshing, setRefreshing] = useState(false);
//   const [expandedLecture, setExpandedLecture] = useState<string | null>(null);

//   const { 
//     data: course, 
//     isLoading, 
//     error,
//     refetch 
//   } = useQuery<CourseDetails>({
//     queryKey: ['courseDetails', id],
//     queryFn: async () => {
//       const res = await API.get(`/api/courses/${id}`, {
//         headers: { Authorization: `Bearer ${user?.token}` }
//       });
//       return res.data;
//     },
//     enabled: !!user?.token && !!id
//   });

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await refetch();
//     setRefreshing(false);
//   };

//   const toggleLectureExpand = (lectureId: string) => {
//     setExpandedLecture(expandedLecture === lectureId ? null : lectureId);
//   };

//   const handlePlayLecture = (lecture: Lecture) => {
//     if (lecture.videoUrl) {
//       router.push({
//         pathname: `/lectures/${lecture._id}`,
//         params: {
//           title: lecture.title,
//           videoUrl: lecture.videoUrl
//         }
//       });
//     }
//   };

//   if (isLoading && !refreshing) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#7F56D9" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>
//           Error loading course details: {error.message}
//         </Text>
//         <TouchableOpacity 
//           style={styles.retryButton}
//           onPress={() => refetch()}
//         >
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   if (!course) {
//     return (
//       <View style={styles.emptyContainer}>
//         <Text style={styles.emptyText}>Course not found</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       style={styles.container}
//       refreshControl={
//         <RefreshControl
//           refreshing={refreshing}
//           onRefresh={onRefresh}
//           colors={['#7F56D9']}
//           tintColor="#7F56D9"
//         />
//       }
//     >
//       {/* Course Header with Gradient Background */}
//       <LinearGradient
//         colors={['#7F56D9', '#9E77ED']}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.headerContainer}
//       >
//         <TouchableOpacity 
//           style={styles.backButton}
//           onPress={() => router.back()}
//         >
//           <Feather name="arrow-left" size={24} color="white" />
//         </TouchableOpacity>

//         <View style={styles.headerContent}>
//           <Text style={styles.category}>{course.category}</Text>
//           <Text style={styles.title}>{course.title}</Text>
          
//           <View style={styles.metaContainer}>
//             <View style={styles.metaItem}>
//               <Feather name="user" size={16} color="rgba(255,255,255,0.8)" />
//               <Text style={styles.metaText}>
//                 {course.createdBy.name || course.createdBy.email}
//               </Text>
//             </View>
//             <View style={styles.metaItem}>
//               <Feather name="calendar" size={16} color="rgba(255,255,255,0.8)" />
//               <Text style={styles.metaText}>
//                 {new Date(course.createdAt).toLocaleDateString()}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </LinearGradient>

//       {/* Course Description */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Course Description</Text>
//         <Text style={styles.description}>{course.description}</Text>
//       </View>

//       {/* Lectures Section */}
//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Course Content</Text>
//           <Text style={styles.lectureCount}>
//             {course.lectures.length} {course.lectures.length === 1 ? 'Lecture' : 'Lectures'}
//           </Text>
//         </View>

//         {course.lectures.length > 0 ? (
//           <View style={styles.lecturesContainer}>
//             {course.lectures.map((lecture, index) => (
//               <View key={lecture._id} style={styles.lectureCard}>
//                 <View style={styles.lectureHeader}>
//                   <View style={styles.lectureNumber}>
//                     <Text style={styles.lectureNumberText}>{index + 1}</Text>
//                   </View>
//                   <View style={styles.lectureMainContent}>
//                     <Text style={styles.lectureTitle}>{lecture.title}</Text>
//                     <TouchableOpacity 
//                       style={styles.playButton}
//                       onPress={() => handlePlayLecture(lecture)}
//                       disabled={!lecture.videoUrl}
//                     >
//                       <MaterialIcons 
//                         name={lecture.videoUrl ? "play-circle-outline" : "lock-outline"} 
//                         size={24} 
//                         color={lecture.videoUrl ? "#7F56D9" : "#98A2B3"} 
//                       />
//                     </TouchableOpacity>
//                   </View>
//                   <TouchableOpacity 
//                     onPress={() => toggleLectureExpand(lecture._id)}
//                     style={styles.expandButton}
//                   >
//                     <AntDesign 
//                       name={expandedLecture === lecture._id ? "up" : "down"} 
//                       size={16} 
//                       color="#667085" 
//                     />
//                   </TouchableOpacity>
//                 </View>

//                 {expandedLecture === lecture._id && (
//                   <View style={styles.lectureDetails}>
//                     <Text style={styles.lectureDescription}>{lecture.description}</Text>
                    
//                     {lecture.resources.length > 0 && (
//                       <View style={styles.resourcesContainer}>
//                         <Text style={styles.resourcesTitle}>Resources:</Text>
//                         {lecture.resources.map(resource => (
//                           <TouchableOpacity key={resource._id} style={styles.resourceItem}>
//                             <Feather name="paperclip" size={16} color="#7F56D9" />
//                             <Text style={styles.resourceText}>{resource.name}</Text>
//                           </TouchableOpacity>
//                         ))}
//                       </View>
//                     )}
//                   </View>
//                 )}
//               </View>
//             ))}
//           </View>
//         ) : (
//           <View style={styles.emptyLectures}>
//             <MaterialIcons name="video-library" size={48} color="#E9D7FE" />
//             <Text style={styles.emptyLecturesText}>No lectures available yet</Text>
//             <Text style={styles.emptyLecturesSubText}>Check back later for updates</Text>
//           </View>
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8FAFC',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F8FAFC',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#F8FAFC',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F8FAFC',
//   },
//   errorText: {
//     color: '#F04438',
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   emptyText: {
//     color: '#98A2B3',
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//   },
//   retryButton: {
//     backgroundColor: '#7F56D9',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: '#FFFFFF',
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 14,
//   },
//   headerContainer: {
//     padding: 24,
//     paddingTop: 60,
//     borderBottomLeftRadius: 24,
//     borderBottomRightRadius: 24,
//   },
//   backButton: {
//     position: 'absolute',
//     top: 50,
//     left: 20,
//     zIndex: 1,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     borderRadius: 12,
//     padding: 8,
//   },
//   headerContent: {
//     marginTop: 16,
//   },
//   category: {
//     color: 'rgba(255,255,255,0.8)',
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     marginBottom: 4,
//     textTransform: 'uppercase',
//   },
//   title: {
//     color: '#FFFFFF',
//     fontSize: 28,
//     fontFamily: 'Inter-Bold',
//     marginBottom: 12,
//     lineHeight: 36,
//   },
//   metaContainer: {
//     flexDirection: 'row',
//     gap: 16,
//     marginTop: 8,
//   },
//   metaItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   metaText: {
//     color: 'rgba(255,255,255,0.8)',
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//   },
//   section: {
//     padding: 24,
//     backgroundColor: '#FFFFFF',
//     marginTop: 8,
//     borderRadius: 12,
//     marginHorizontal: 16,
//     shadowColor: '#101828',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 1,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     color: '#101828',
//     fontSize: 18,
//     fontFamily: 'Inter-Bold',
//   },
//   lectureCount: {
//     color: '#667085',
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//   },
//   description: {
//     color: '#475467',
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//     lineHeight: 24,
//   },
//   lecturesContainer: {
//     marginTop: 8,
//   },
//   lectureCard: {
//     backgroundColor: '#F9F5FF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//   },
//   lectureHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   lectureNumber: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#E9D7FE',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   lectureNumberText: {
//     color: '#7F56D9',
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//   },
//   lectureMainContent: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   lectureTitle: {
//     color: '#101828',
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     flex: 1,
//   },
//   playButton: {
//     marginLeft: 12,
//   },
//   expandButton: {
//     marginLeft: 8,
//     padding: 4,
//   },
//   lectureDetails: {
//     marginTop: 12,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#EAECF0',
//   },
//   lectureDescription: {
//     color: '#475467',
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     lineHeight: 20,
//   },
//   resourcesContainer: {
//     marginTop: 12,
//   },
//   resourcesTitle: {
//     color: '#101828',
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     marginBottom: 8,
//   },
//   resourceItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 8,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: '#EAECF0',
//   },
//   resourceText: {
//     color: '#475467',
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     marginLeft: 8,
//   },
//   emptyLectures: {
//     paddingVertical: 32,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   emptyLecturesText: {
//     color: '#101828',
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     marginTop: 16,
//   },
//   emptyLecturesSubText: {
//     color: '#98A2B3',
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     marginTop: 4,
//   },
// });

// export default CourseDetailsScreen;






import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import API from '@/utils/api';
import { useAuth } from '@/app/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Lecture {
  _id: string;
  title: string;
  description: string;
  videoUrl?: string;
  resources: any[];
}

interface CourseDetails {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnail?: string;
  lectures: Lecture[];
  createdAt: string;
  createdBy: {
    _id: string;
    email: string;
  };
}

const CourseDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const courseId = Array.isArray(id) ? id[0] : id ?? '';
  const router = useRouter();
  const { user } = useAuth();

  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storetoken ,setStoretoken] =useState<string | null>(null);
    
  useEffect(() => {
    const fetchTokenAndUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Stored Token:', token);
        setStoretoken(token)
        // console.log('User ID:', user?.id || 'Not available');
        // Removed: setToken(storedToken); because it's undefined
      } catch (error) {
        console.error('Failed to fetch token or userId:', error);
      }
    };
    fetchTokenAndUser();
  }, []);
  
  const fetchCourseDetails = async () => {
    if (!storetoken || !courseId) {
      setError('Missing token or course ID');
      setLoading(false);
      console.log(" token check ");
      
      return;
    }

    try {
        console.log("in api call");
        
      setLoading(true);
      setError(null);

      const response = await API.get(`/api/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${storetoken}`,
        },
      });

      if (!response.data || !response.data._id) {
        throw new Error('Invalid course data received');
      }

      setCourse(response.data);
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to fetch course details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  

  useEffect(() => {
    console.log('user.token in effect:', storetoken);
    console.log('courseId:', courseId);
    if (storetoken && courseId) {
        fetchCourseDetails();
      }
  }, [storetoken, courseId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCourseDetails();
  };

  const handleLecturePress = (lecture: Lecture) => {
    if (lecture.videoUrl) {
      router.push({
        pathname: '/(course)/lectures',
        params: {
          title: lecture.title,
          videoUrl: lecture.videoUrl,
          lectureId: lecture._id,
        },
      });
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7F56D9" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.debugText}>Course ID: {courseId}</Text>
        <Text style={styles.debugText}>User Token: {storetoken ? 'Valid' : 'Invalid/Missing'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCourseDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Course not found</Text>
        <Text style={styles.debugText}>Requested ID: {courseId}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#7F56D9']}
          tintColor="#7F56D9"
        />
      }
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#101828" />
        </TouchableOpacity>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.category}>{course.category}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{course.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Lectures ({course.lectures?.length || 0})
        </Text>

        {course.lectures && course.lectures.length > 0 ? (
          <FlatList
            data={course.lectures}
            scrollEnabled={false}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.lectureCard}
                onPress={() => handleLecturePress(item)}
              >
                <View style={styles.lectureIcon}>
                  <MaterialIcons
                    name={item.videoUrl ? 'play-circle-outline' : 'lock-outline'}
                    size={24}
                    color={item.videoUrl ? '#7F56D9' : '#98A2B3'}
                  />
                </View>
                <View style={styles.lectureContent}>
                  <Text style={styles.lectureTitle}>{item.title}</Text>
                  <Text style={styles.lectureDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <View style={styles.emptyLectures}>
            <Text style={styles.emptyLecturesText}>No lectures available yet</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  debugText: {
    color: '#667085',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#F04438',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyText: {
    color: '#98A2B3',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  retryButton: {
    backgroundColor: '#7F56D9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },
  backButton: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#101828',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#667085',
  },
  section: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#101828',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#475467',
    lineHeight: 20,
  },
  lectureCard: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
  },
  lectureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4EBFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lectureContent: {
    flex: 1,
  },
  lectureTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#101828',
    marginBottom: 4,
  },
  lectureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#667085',
  },
  separator: {
    height: 1,
    backgroundColor: '#EAECF0',
    marginVertical: 8,
  },
  emptyLectures: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyLecturesText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#98A2B3',
  },
});

export default CourseDetailsScreen;
