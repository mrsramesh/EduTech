import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Toast from "react-native-toast-message";
import API from "@/utils/api";
import { useFocusEffect } from "expo-router";
import { BackHandler } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import { store } from "../../redux/store";

const UploadLectureScreen = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const token = store.getState().auth.token;
  const currentUser = store.getState().auth.user;

  const router = useRouter();

  useFocusEffect(() => {
    const onBackPress = () => {
      router.replace("/(admin)/teacherDashboard");
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  });

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        const res = await API.get(
          `/api/courses/my-courses/${currentUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourses(res.data || []);
      } catch (err) {
        console.log("Error fetching user courses:", err.response?.data || err.message);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Could not fetch your courses",
        });
      }
    };
    fetchUserCourses();
  }, [token]);

  const handlePickVideo = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "video/*",
      copyToCacheDirectory: true,
    });

    if (result.assets && result.assets.length > 0) {
      setVideo(result.assets[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedCourse?._id || !title || !description || !video) {
      return Toast.show({
        type: "error",
        text1: "All fields required",
        text2: "Please fill all fields and pick a video",
      });
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", {
      uri: video.uri,
      name: video.name || "video.mp4",
      type: video.mimeType || "video/mp4",
    });

    try {
      setUploading(true);
      setUploadProgress(0);

      await API.post(`/api/courses/${selectedCourse._id}/lectures`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      });

      Toast.show({
        type: "success",
        text1: "Lecture uploaded successfully",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setVideo(null);
      setSelectedCourse(null);
      setUploadProgress(0);
    } catch (err: any) {
      console.error("Upload error:", err);
      Toast.show({
        type: "error",
        text1: "Upload failed",
        text2: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headingContainer}>
        <TouchableOpacity
          onPress={() => router.replace("/(admin)/teacherDashboard")}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#4C51BF" />
        </TouchableOpacity>
        <Text style={styles.headingText}>Upload Lecture</Text>
      </View>

      <Text style={styles.label}>Select Course</Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setDropdownVisible(true)}
      >
        <Text style={selectedCourse ? styles.dropdownButtonText : styles.dropdownButtonPlaceholder}>
          {selectedCourse ? selectedCourse.title : "Select a course"}
        </Text>
        <Icon name="chevron-down" size={20} color="#718096" />
      </TouchableOpacity>

      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setDropdownVisible(false)}>
          <View style={styles.dropdownContainer}>
            <ScrollView style={styles.dropdownScrollView}>
              {courses.map((course: any) => (
                <TouchableOpacity
                  key={course._id}
                  style={[
                    styles.dropdownItem,
                    selectedCourse?._id === course._id && styles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedCourse(course);
                    setDropdownVisible(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{course.title}</Text>
                  {selectedCourse?._id === course._id && (
                    <Icon name="checkmark" size={20} color="#4C51BF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      <Text style={styles.label}>Lecture Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter title"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
        multiline
      />

      <TouchableOpacity style={styles.pickButton} onPress={handlePickVideo}>
        <Text style={styles.pickButtonText}>
          {video ? `Picked: ${video.name}` : "Pick a video"}
        </Text>
      </TouchableOpacity>

      {uploading && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Uploading: {uploadProgress}%</Text>
          <View style={styles.progressBarBackground}>
            <View
              style={[styles.progressBarFill, { width: `${uploadProgress}%` }]}
            />
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.uploadButton, uploading && { opacity: 0.7 }]}
        onPress={handleUpload}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.uploadButtonText}>Upload Lecture</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingTop: 16,
    backgroundColor: "#F8FAFC",
    flexGrow: 1,
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    marginRight: 12,
  },
  headingText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2D3748",
    letterSpacing: 0.3,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#2D3748",
    letterSpacing: 0.2,
  },
  dropdownButton: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    borderColor: "#E2E8F0",
    borderWidth: 1.5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  dropdownButtonText: {
    color: "#2D3748",
    fontSize: 15,
  },
  dropdownButtonPlaceholder: {
    color: "#A0AEC0",
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  dropdownContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    maxHeight: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownScrollView: {
    padding: 8,
  },
  dropdownItem: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  dropdownItemSelected: {
    backgroundColor: "#EBF8FF",
  },
  dropdownItemText: {
    fontSize: 15,
    color: "#2D3748",
  },
  input: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    borderColor: "#E2E8F0",
    borderWidth: 1.5,
    fontSize: 15,
    color: "#2D3748",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  pickButton: {
    marginTop: 20,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  pickButtonText: {
    color: "#2D3748",
    fontWeight: "600",
    fontSize: 15,
  },
  uploadButton: {
    backgroundColor: "#4C51BF",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 32,
    shadowColor: "#4C51BF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  uploadButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  progressContainer: {
    marginTop: 24,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  progressText: {
    fontSize: 15,
    color: "#4A5568",
    marginBottom: 8,
    fontWeight: "500",
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#EDF2F7",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 8,
    backgroundColor: "#4C51BF",
    borderRadius: 4,
  },
});

export default UploadLectureScreen;