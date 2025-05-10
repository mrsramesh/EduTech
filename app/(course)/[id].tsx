import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import API from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const courseId = Array.isArray(id) ? id[0] : id ?? "";
  const router = useRouter();
  const { user } = useAuth();

  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storetoken, setStoretoken] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenAndUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        setStoretoken(token);
        // console.log('User ID:', user?.id || 'Not available');
        // Removed: setToken(storedToken); because it's undefined
      } catch (error) {
        console.error("Failed to fetch token or userId:", error);
      }
    };
    fetchTokenAndUser();
  }, []);

  const fetchCourseDetails = async () => {
    if (!storetoken || !courseId) {
      setError("Missing token or course ID");
      setLoading(false);

      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await API.get(`/api/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${storetoken}`,
        },
      });

      if (!response.data || !response.data._id) {
        throw new Error("Invalid course data received");
      }

      setCourse(response.data);
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to fetch course details");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
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
        pathname: "/(course)/lectures",
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
        <Text style={styles.debugText}>
          User Token: {storetoken ? "Valid" : "Invalid/Missing"}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchCourseDetails}
        >
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
          colors={["#7F56D9"]}
          tintColor="#7F56D9"
        />
      }
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
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
                    name={
                      item.videoUrl ? "play-circle-outline" : "lock-outline"
                    }
                    size={24}
                    color={item.videoUrl ? "#7F56D9" : "#98A2B3"}
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
            <Text style={styles.emptyLecturesText}>
              No lectures available yet
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  debugText: {
    color: "#667085",
    fontSize: 12,
    fontFamily: "Inter-Regular",
    marginBottom: 8,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#F04438",
    fontSize: 16,
    fontFamily: "Inter-Regular",
    marginBottom: 16,
    textAlign: "center",
  },
  emptyText: {
    color: "#98A2B3",
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  retryButton: {
    backgroundColor: "#7F56D9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EAECF0",
  },
  backButton: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter-Bold",
    color: "#101828",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#667085",
  },
  section: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#101828",
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#475467",
    lineHeight: 20,
  },
  lectureCard: {
    flexDirection: "row",
    paddingVertical: 12,
    alignItems: "center",
  },
  lectureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F4EBFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  lectureContent: {
    flex: 1,
  },
  lectureTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#101828",
    marginBottom: 4,
  },
  lectureDescription: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#667085",
  },
  separator: {
    height: 1,
    backgroundColor: "#EAECF0",
    marginVertical: 8,
  },
  emptyLectures: {
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyLecturesText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#98A2B3",
  },
});

export default CourseDetailsScreen;
