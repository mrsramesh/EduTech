// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { Video, ResizeMode } from 'expo-av';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { MaterialIcons } from '@expo/vector-icons';

// const LecturePlayerScreen = () => {
//   const { title, videoUrl } = useLocalSearchParams();
//   const router = useRouter();
//   const videoRef = React.useRef<Video>(null);

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()}>
//           <MaterialIcons name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.title} numberOfLines={1}>{title as string}</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       <Video
//         ref={videoRef}
//         style={styles.video}
//         source={{ uri: videoUrl as string }}
//         useNativeControls
//         resizeMode={ResizeMode.CONTAIN}
//         isLooping
//       />
//     </View>
//   );
// };

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LecturePlayerScreen = () => {
  const { title, videoUrl } = useLocalSearchParams();
  const router = useRouter();
  const videoRef = useRef<Video>(null);
  const [initialPosition, setInitialPosition] = useState(0);

  const storageKey = `video-position-${videoUrl}`;

  useEffect(() => {
    // Load saved position
    const loadPosition = async () => {
      try {
        const savedPosition = await AsyncStorage.getItem(storageKey);
        if (savedPosition) {
          setInitialPosition(parseInt(savedPosition, 10));
        }
      } catch (error) {
        console.error('Failed to load position', error);
      }
    };
    loadPosition();
  }, []);

  const handlePlaybackStatusUpdate = async (status: any) => {
    if (status.isLoaded && status.positionMillis) {
      await AsyncStorage.setItem(storageKey, status.positionMillis.toString());
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{title as string}</Text>
        <View style={{ width: 24 }} />
      </View>

      <Video
        ref={videoRef}
        style={styles.video}
        source={{ uri: videoUrl as string }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onLoad={() => {
          // Seek to last position when video is loaded
          if (videoRef.current && initialPosition > 0) {
            videoRef.current.setPositionAsync(initialPosition);
          }
        }}
      />
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 50,
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default LecturePlayerScreen;