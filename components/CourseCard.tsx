import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Video, ResizeMode  } from "expo-av";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

interface CourseCardProps {
  title: string;
  subject: string;
  videoUrl: string;
  onPressPaid?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, subject, videoUrl, onPressPaid }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/(payment)/receipt",
      params: {
        title,
        subject,
        email: "shoemake.redial@gmail.com",
        name: "Scott R. Shoemake",
        transactionId: "SK345680976",
        course: "3d Character Illustration Cre..",
        category: "Web Development",
        price: "$55.00",
        date: "Nov 20, 202X",
        time: "15:45",
        status: "Paid",
        orderId: "25234567",
        invoiceId: "28646345",
      },
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Video
        source={{ uri: videoUrl }}
        rate={1.0}
        volume={1.0}
        resizeMode={ResizeMode.COVER}
        shouldPlay={false}
        isMuted={true}
        style={styles.video}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subject}>{subject}</Text>
        <TouchableOpacity style={styles.paidButton} onPress={onPressPaid}>
          <Text style={styles.paidText}>Paid</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default CourseCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    width: width - 40,
    alignSelf: "center",
  },
  video: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  subject: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  paidButton: {
    marginTop: 6,
    backgroundColor: "#007AFF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  paidText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
});
