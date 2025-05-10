import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Toast from "react-native-toast-message";
import API from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

import { BackHandler } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";

import { store } from "../../redux/store";

const UploadLectureScreen = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const token = store.getState().auth.token;
  const currentUser = store.getState().auth.user;
  console.log(currentUser);

  const router = useRouter();

  useFocusEffect(() => {
    const onBackPress = () => {
      router.replace("/(admin)/teacherDashboard");
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  });
  useEffect(() => {

    const fetchUserCourses = async () => {
      try {
        //console.log("current user :" + currentUser._id)
        console.log("this is upload lecture token :" + token);
        const res = await API.get(
          `/api/courses/my-courses/${currentUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Toast.show({
          type: "success",
          text1: "Error",
          text2: "Course fetched successfully",
        });
        setCourses(res.data || []);
      } catch (err) {
        console.log(
          "Error fetching user courses:",
          err.response?.data || err.message
        );
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
    console.log("User is this:  " + user);
    const result = await DocumentPicker.getDocumentAsync({
      type: "video/*",
      copyToCacheDirectory: true,
    });

    if (result.assets && result.assets.length > 0) {
      setVideo(result.assets[0]);
    } else {
      console.log("No file picked or operation cancelled.");
    }
  };

  const handleUpload = async () => {
    if (!selectedCourse || !title || !description || !video) {
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

      await API.post(`/api/courses/${selectedCourse}/lectures`, formData, {
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
      <Text style={styles.heading}>
        <TouchableOpacity
          onPress={() => router.replace("/(admin)/teacherDashboard")}
        >
          <Icon name="arrow-back" size={24} color="#4C51BF" />
        </TouchableOpacity>
        Upload Lecture
      </Text>

      <Text style={styles.label}>Select Course</Text>
      {courses.map((course: any) => (
        <TouchableOpacity
          key={course._id}
          style={[
            styles.courseItem,
            selectedCourse === course._id && styles.selectedCourse,
          ]}
          onPress={() => setSelectedCourse(course._id)}
        >
          <Text>{course.title}</Text>
        </TouchableOpacity>
      ))}

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
    paddingTop: 48,
    backgroundColor: "#F8FAFC",
    flexGrow: 1,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 32,
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
  input: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    borderColor: "#E2E8F0",
    borderWidth: 1.5,
    fontSize: 15,
    color: "#2D3748",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  inputFocused: {
    borderColor: "#4C51BF",
  },
  courseItem: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  selectedCourse: {
    backgroundColor: "#EBF8FF",
    borderColor: "#4C51BF",
  },
  courseItemText: {
    fontSize: 15,
    color: "#2D3748",
  },
  pickButton: {
    marginTop: 20,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    shadowColor: '#000',
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
    shadowColor: '#4C51BF',
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
  successMessage: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#EBF8FF",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4C51BF",
  },
  successText: {
    color: "#2D3748",
    fontSize: 15,
    fontWeight: "500",
  },
});

export default UploadLectureScreen;
