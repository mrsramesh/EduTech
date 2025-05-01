// import React, { useState } from 'react';
// import { View, ScrollView, StyleSheet } from 'react-native';
// import SearchInput from '../../components/SearchInput';
// import CourseSection from '../../components/CourseSection';

// const sectionsData = [
//   {
//     title: 'Section 01 - Introduction',
//     totalDuration: '25 Mins',
//     courses: [
//       { id: '1', title: 'Why Using 3D Blender', duration: '15 Mins', videoUrl: '...' },
//       { id: '2', title: '3D Blender Installation', duration: '10 Mins', videoUrl: '...' },
//       { id: '11', title: 'Why Using 3D Blender', duration: '15 Mins', videoUrl: '...' },
//       { id: '21', title: '3D Blender Installation', duration: '10 Mins', videoUrl: '...' },
//     ],
//   },
//   {
//     title: 'Section 02 - Graphic Design',
//     totalDuration: '125 Mins',
//     courses: [
//       { id: '3', title: 'Take a Look Blender Interface', duration: '20 Mins', videoUrl: '...' },
//       { id: '4', title: 'The Basic of 3D Modelling', duration: '25 Mins', videoUrl: '...' },
//       { id: '5', title: 'Shading and Lighting', duration: '80 Mins', videoUrl: '...' },
//     ],
//   },
//   {
//     title: 'Section 03 - Introduction',
//     totalDuration: '25 Mins',
//     courses: [
//       { id: '1', title: 'Why Using 3D Blender', duration: '15 Mins', videoUrl: '...' },
//       { id: '2', title: '3D Blender Installation', duration: '10 Mins', videoUrl: '...' },
//       { id: '11', title: 'Why Using 3D Blender', duration: '15 Mins', videoUrl: '...' },
//       { id: '21', title: '3D Blender Installation', duration: '10 Mins', videoUrl: '...' },
//     ],
//   },
//   {
//     title: 'Section 04 - Graphic Design',
//     totalDuration: '125 Mins',
//     courses: [
//       { id: '3', title: 'Take a Look Blender Interface', duration: '20 Mins', videoUrl: '...' },
//       { id: '4', title: 'The Basic of 3D Modelling', duration: '25 Mins', videoUrl: '...' },
//       { id: '5', title: 'Shading and Lighting', duration: '80 Mins', videoUrl: '...' },
//     ],
//   },
// ];

// export default function CompletedScreen() {
//   const [text, setText] = useState('');

//   const handleVideoPress = (video:any) => {
//     // Navigate or play video here
//     console.log('Play video: ', video.title);
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <SearchInput
//         value={text}
//         onChangeText={setText}
//         placeholder="Search users..."
//       />
//       {sectionsData.map((section, idx) => (
//         <CourseSection 
//           key={idx}
//           section={section}
//           type="ongoing"
//           onVideoPress={handleVideoPress}
//         />
//       ))}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: '#F7F9FC',
//   },
// });
  // working well me nichi lock system laga raha hu . 
  
  
  import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  Alert, 
  Modal, 
  Button,
  SafeAreaView 
} from 'react-native';
import SearchInput from '@/components/SearchInput';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';

// Define types for our data
type Course = {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
};

type Section = {
  title: string;
  totalDuration: string;
  courses: Course[];
};

const sectionsData: Section[] = [
  {
    title: 'Section 01 - Introduction (Free)',
    totalDuration: '25 Mins',
    courses: [
      { id: '1', title: 'Why Using 3D Blender', duration: '15 Mins', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
      { id: '2', title: '3D Blender Installation', duration: '10 Mins', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    ],
  },
  {
    title: 'Section 02 - Graphic Design (Premium)',
    totalDuration: '125 Mins',
    courses: [
      { id: '3', title: 'Take a Look Blender Interface', duration: '20 Mins', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
      { id: '4', title: 'The Basic of 3D Modelling', duration: '25 Mins', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
    ],
  },
];

export default function CompletedScreen() {
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [hasPaid, setHasPaid] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Course | null>(null);
  const [videoModalVisible, setVideoModalVisible] = useState(false);

  const isSectionFree = (index: number) => index === 0;

  const handleVideoPress = (video: Course, isLocked: boolean) => {
    if (isLocked) {
      Alert.alert(
        'Premium Content',
        'This video is locked. Please make payment to access all content.',
        [
          { text: 'Pay Now', onPress: () => setHasPaid(true) },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }
    
    setCurrentVideo(video);
    setVideoModalVisible(true);
  };

  const closeVideoModal = () => {
    setVideoModalVisible(false);
    setCurrentVideo(null);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Course Content</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        <ScrollView style={styles.scrollView}>
          <SearchInput
            value={text}
            onChangeText={setText}
            placeholder="Search courses..."
          />
          
          {sectionsData.map((section, idx) => (
            <View key={idx}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <View style={styles.durationLockContainer}>
                  <Text style={styles.durationText}>{section.totalDuration}</Text>
                  {!isSectionFree(idx) && !hasPaid && (
                    <Icon name="lock" size={20} color="#888" style={styles.lockIcon} />
                  )}
                </View>
              </View>
              
              {section.courses.map((course) => {
                const isLocked = !isSectionFree(idx) && !hasPaid;
                return (
                  <TouchableOpacity 
                    key={course.id} 
                    style={[styles.courseCard, isLocked && styles.lockedCard]}
                    onPress={() => handleVideoPress(course, isLocked)}
                  >
                    <View style={styles.courseInfo}>
                      <Text style={styles.courseTitle}>{course.title}</Text>
                      <Text style={styles.courseDuration}>{course.duration}</Text>
                    </View>
                    {isLocked ? (
                      <Icon name="lock" size={24} color="#888" />
                    ) : (
                      <Icon name="play-circle-outline" size={24} color="#4CAF50" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </ScrollView>

        <Modal
          visible={videoModalVisible}
          animationType="slide"
          onRequestClose={closeVideoModal}
        >
          <View style={styles.videoModalContainer}>
            {currentVideo && (
              <>
                <View style={styles.videoModalHeader}>
                  <TouchableOpacity onPress={closeVideoModal}>
                    <Icon name="arrow-back" size={24} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.videoModalTitle}>{currentVideo.title}</Text>
                  <View style={styles.videoModalHeaderPlaceholder} />
                </View>
                <Video
                  source={{ uri: currentVideo.videoUrl }}
                  style={styles.videoPlayer}
                  controls={true}
                  resizeMode="contain"
                  paused={false}
                />
                <View style={styles.videoInfo}>
                  <Text style={styles.videoDuration}>{currentVideo.duration}</Text>
                </View>
              </>
            )}
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRightPlaceholder: {
    width: 24,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  durationLockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  lockIcon: {
    marginLeft: 5,
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  lockedCard: {
    backgroundColor: '#f5f5f5',
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  courseDuration: {
    fontSize: 14,
    color: '#666',
  },
  videoModalContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  videoModalTitle: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  videoModalHeaderPlaceholder: {
    width: 24,
  },
  videoPlayer: {
    width: '100%',
    height: '70%',
  },
  videoInfo: {
    padding: 20,
    backgroundColor: '#000',
  },
  videoDuration: {
    fontSize: 14,
    color: '#fff',
  },
});