import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import API from "@/utils/api";
import { store } from "../../redux/store";
import Icon from "react-native-vector-icons/Ionicons";

// Dummy placeholder messages (replace with API data later)
const messages = [
  {
    id: "1",
    sender: "John Doe",
    subject: "Assignment Help",
    content: "Can you help me with the last module?",
    time: "2h ago",
  },
  {
    id: "2",
    sender: "Jane Smith",
    subject: "Course Feedback",
    content: "Loved the course structure, very clear!",
    time: "5h ago",
  },
];

export default function InboxScreen() {
  const [messages, setMessages] = useState([]);
  const currentUser = store.getState().auth.user;
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const teacherId = currentUser?._id; // Replace with actual ID (or fetch from auth context)
        const response = await API.get(`/api/queries/teacher/${teacherId}`);
        const formatted = response.data.map((item, index) => ({
          id: index.toString(),
          sender: item.studentName,
          subject: item.courseTitle,
          content: item.message,
          time: "Now", // Or format `createdAt` if included
        }));
        setMessages(formatted);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    fetchMessages();
  }, []);

  useFocusEffect(() => {
    const onBackPress = () => {
      router.replace("/(admin)/teacherDashboard");
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  });
  const renderMessageCard = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.sender}>{item.sender}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <Text style={styles.subject}>{item.subject}</Text>
      <Text style={styles.content}>{item.content}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <TouchableOpacity
          onPress={() => router.replace("/(admin)/teacherDashboard")}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#4C51BF" />
        </TouchableOpacity>
        <Text style={styles.headingText}>Inbox</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageCard}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
    paddingTop: 10, // Increased top padding
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center", // Center the title
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

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  sender: {
    fontWeight: "600",
    color: "#4C51BF",
  },
  time: {
    fontSize: 12,
    color: "#94a3b8",
  },
  subject: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
    color: "#1e293b",
  },
  content: {
    fontSize: 14,
    color: "#475569",
  },
});
