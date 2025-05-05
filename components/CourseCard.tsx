// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// interface CourseProps {
//   course: {
//     id: string;
//     title: string;
//     duration: string;
//     progress: number;
//     category: string;
//   };
// }

// const CourseCard: React.FC<CourseProps> = ({ course }) => {
//   return (
//     <TouchableOpacity style={styles.container}>
//       <View style={styles.header}>
//         <View style={[styles.iconContainer, { backgroundColor: '#F4EBFF' }]}>
//           <Ionicons name="book" size={20} color="#7F56D9" />
//         </View>
//         <Text style={styles.duration}>{course.duration}</Text>
//       </View>
      
//       <View style={styles.content}>
//         <Text style={styles.title}>{course.title}</Text>
//         <Text style={styles.category}>{course.category}</Text>
//       </View>

//       <View style={styles.progressContainer}>
//         <View style={styles.progressBar}>
//           <View 
//             style={[
//               styles.progressFill,
//               { width: `${course.progress * 100}%` }
//             ]}
//           />
//         </View>
//         <Text style={styles.progressText}>
//           {Math.round(course.progress * 100)}% Complete
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     width: 240,
//     padding: 16,
//     marginRight: 16,
//     shadowColor: '#7F56D9',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 20,
//     elevation: 3,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   iconContainer: {
//     padding: 8,
//     borderRadius: 8,
//   },
//   duration: {
//     color: '#667085',
//     fontSize: 12,
//     fontFamily: 'Inter-Medium',
//   },
//   content: {
//     marginBottom: 24,
//   },
//   title: {
//     color: '#101828',
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     marginBottom: 8,
//   },
//   category: {
//     color: '#7F56D9',
//     fontSize: 12,
//     fontFamily: 'Inter-Medium',
//   },
//   progressContainer: {
//     marginBottom: 8,
//   },
//   progressBar: {
//     height: 4,
//     backgroundColor: '#F4EBFF',
//     borderRadius: 2,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#7F56D9',
//   },
//   progressText: {
//     color: '#667085',
//     fontSize: 12,
//     fontFamily: 'Inter-Medium',
//     marginTop: 4,
//   },
// });

// export default CourseCard;

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Updated interface to accept either the old format or new format
type CourseData = {
  id: string;
  title: string;
  duration: string;
  progress: number;
  category: string;
};

interface CourseProps {
  course?: CourseData; // Original format
  title?: string;      // New format
  subject?: string;    // New format (maps to category)
  videoUrl?: string;   // New format (unused but accepted)
  onPressPaid?: () => void; // New format
  duration?: string;   // Optional override
  progress?: number;   // Optional override
}

const CourseCard: React.FC<CourseProps> = (props) => {
  // Create the course object from either format
  const course: CourseData = props.course || {
    id: '1',
    title: props.title || 'Untitled Course',
    duration: props.duration || '10h 20m',
    progress: props.progress || 0.75,
    category: props.subject || 'General'
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={props.onPressPaid} // Added onPress handler
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: '#F4EBFF' }]}>
          <Ionicons name="book" size={20} color="#7F56D9" />
        </View>
        <Text style={styles.duration}>{course.duration}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.category}>{course.category}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${course.progress * 100}%` }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round(course.progress * 100)}% Complete
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Keep ALL existing styles EXACTLY THE SAME
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 240,
    padding: 16,
    marginRight: 16,
    shadowColor: '#7F56D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
  },
  duration: {
    color: '#667085',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  content: {
    marginBottom: 24,
  },
  title: {
    color: '#101828',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  category: {
    color: '#7F56D9',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F4EBFF',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7F56D9',
  },
  progressText: {
    color: '#667085',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
});

export default CourseCard;