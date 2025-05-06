import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native';
import CourseCard from '@/components/CourseCard'; // or '../components/CourseCard' if not using alias
import { useRouter } from 'expo-router';

export default function TransactionScreen() {
    const router = useRouter();
    
    return (
        <View style={styles.container}>
            <Text style={styles.text}>💰 Transaction Screen</Text>
            <ScrollView style={styles.scrollView}>
                {/* First CourseCard - needs to match the Course interface */}
                <CourseCard course={{
                    _id: "1",
                    title: "Master React Native",
                    category: "Mobile Development",
                    description: "Learn to build cross-platform mobile apps",
                    progress: 75 // Note: should be number (0-100), not 0.75
                }} />
                
                {/* Second CourseCard - this format doesn't match the component's props */}
                {/* You'll need to modify it to match the expected interface */}
                <CourseCard course={{
                    _id: "2",
                    title: "Advanced React Native",
                    category: "Mobile Development",
                    description: "Dive deeper into React Native concepts",
                    thumbnail: "https://example.com/image.jpg"
                }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 16 
    },
    text: { 
        fontSize: 24, 
        fontWeight: 'bold',
        marginVertical: 16 
    },
    scrollView: {
        width: '100%'
    }
});