import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import {
  Feather,
  MaterialIcons,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import API from "@/utils/api";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

interface User {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  profileImage?: string;
  role: string;
}

interface ApiUserResponse {
  data: User;
}

const ProfileScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const reduxUser = useSelector(
    (state: RootState) => state.auth.user as User | null
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.replace("/(auth)/login");
          return;
        }

        if (reduxUser && reduxUser._id) {
          setUser(reduxUser);
        } else {
          const response = await API.get<ApiUserResponse>("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to load user data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [reduxUser, router]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7F56D9" />
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

  const userInitials = `${user.fname.charAt(0)}${user.lname.charAt(
    0
  )}`.toUpperCase();

  const options = [
    { title: "Edit Profile", icon: "edit", screen: "editprofile" },
    { title: "Payment Methods", icon: "credit-card", screen: "PaymentScreen" },
    { title: "Notification Settings", icon: "bell", screen: "notifications" },
    { title: "Security", icon: "lock", screen: "security" },
    { title: "Language", icon: "globe", screen: "language" },
    { title: "Terms & Privacy", icon: "file-text", screen: "terms" },
    { title: "Invite Friends", icon: "user-plus", screen: "invite" },
    { title: "Log Out", icon: "log-out", screen: "login" },
  ];

  return (
    <LinearGradient colors={["#F8FAFF", "#E6EEFF"]} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          {/* <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <AntDesign name="arrowleft" size={24} color="#4C51BF" />
          </TouchableOpacity> */}
          <Text style={styles.headerTitle}>My Profile</Text>
          {/* <TouchableOpacity style={styles.settingsButton}>
            <Feather name="settings" size={22} color="#4C51BF" />
          </TouchableOpacity> */}
        </View>

        {/* Profile Card */}
        <BlurView intensity={25} tint="light" style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {user.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                style={styles.avatarImage}
              />
            ) : (
              <LinearGradient
                colors={["#667EEA", "#764BA2"]}
                style={styles.avatarPlaceholder}
              >
                <Text style={styles.avatarText}>{userInitials}</Text>
              </LinearGradient>
            )}
            <TouchableOpacity style={styles.editIcon}>
              <Feather name="edit-2" size={16} color="white" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>
            {user.fname} {user.lname}
          </Text>
          <Text style={styles.email}>{user.email}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="book" size={20} color="#4C51BF" />
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Courses</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="star" size={20} color="#F6AD55" />
              <Text style={styles.statValue}>4.9</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people" size={20} color="#68D391" />
              <Text style={styles.statValue}>2.1K</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
          </View>
        </BlurView>

        {/* Premium Banner */}
        <LinearGradient
          colors={["#FEF3C7", "#FDE68A"]}
          style={styles.premiumBanner}
        >
          <MaterialIcons name="workspace-premium" size={24} color="#D97706" />
          <View style={styles.premiumTextContainer}>
            <Text style={styles.premiumTitle}>Premium Member</Text>
            <Text style={styles.premiumSubtitle}>Unlock all features</Text>
          </View>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeText}>Upgrade</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Options List */}
        <View style={styles.optionsContainer}>
          {options.map(({ title, icon, screen }, index) => (
            <React.Fragment key={`option-${index}`}>
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => {
                  if (screen === "login") {
                    router.replace("/(auth)/login");
                  } else if (screen === "PaymentScreen") {
                    router.push("/(payment)/PaymentScreen");
                  } else if (screen) {
                    router.push(`/(profile)/editprofile`);
                  }
                }}
              >
                <View style={styles.optionIconContainer}>
                  <Feather
                    name={icon as keyof typeof Feather.glyphMap}
                    size={20}
                    color="#4C51BF"
                  />
                </View>
                <Text style={styles.optionText}>{title}</Text>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={24}
                  color="#A0AEC0"
                />
              </TouchableOpacity>
              {index < options.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        {/* App Version */}
        <Text style={styles.versionText}>App Version 1.0.0</Text>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(76, 81, 191, 0.1)",
  },
  settingsButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(76, 81, 191, 0.1)",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3748",
    fontFamily: "Inter-Bold",
  },
  profileCard: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 28,
    padding: 28,
    marginBottom: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    shadowColor: "#4C51BF",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "white",
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "white",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4C51BF",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 4,
    fontFamily: "Inter-Bold",
  },
  email: {
    fontSize: 16,
    color: "#718096",
    marginBottom: 24,
    fontFamily: "Inter-Regular",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3748",
    marginTop: 6,
    fontFamily: "Inter-Bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#718096",
    marginTop: 4,
    fontFamily: "Inter-Regular",
  },
  premiumBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(214, 158, 46, 0.3)",
  },
  premiumTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#92400E",
    fontFamily: "Inter-SemiBold",
  },
  premiumSubtitle: {
    fontSize: 14,
    color: "#B45309",
    marginTop: 2,
    fontFamily: "Inter-Regular",
  },
  upgradeButton: {
    backgroundColor: "#D97706",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  upgradeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
  },
  optionsContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  optionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(76, 81, 191, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#2D3748",
    fontFamily: "Inter-Medium",
  },
  divider: {
    height: 1,
    backgroundColor: "#EDF2F7",
    marginLeft: 80,
  },
  versionText: {
    textAlign: "center",
    color: "#A0AEC0",
    fontSize: 14,
    marginTop: 8,
    fontFamily: "Inter-Regular",
  },
});

export default ProfileScreen;
