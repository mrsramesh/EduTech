// // components/mentor/MentorCard.tsx
// import { TouchableOpacity, View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';
// import React from 'react';

// type MentorCardProps = {
//   name: string;
//   image: ImageSourcePropType;
//   layout?: 'grid' | 'list';
//   onPress?: () => void;
// };

// const MentorCard: React.FC<MentorCardProps> = ({ 
//   name, 
//   image, 
//   layout = 'list', 
//   onPress 
// }) => {
//   return (
//     <TouchableOpacity 
//       onPress={onPress}
//       style={layout === 'list' ? styles.listContainer : styles.gridContainer}
//       activeOpacity={0.7}
//     >
//       <Image 
//         source={image} 
//         style={layout === 'list' ? styles.listImage : styles.gridImage} 
//       />
//       <Text style={layout === 'list' ? styles.listText : styles.gridText}>
//         {name}
//       </Text>
//       {layout === 'list' && (
//         <View style={styles.chevronContainer}>
//           <Text style={styles.chevron}>{'>'}</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   // Grid Layout Styles
//   gridContainer: {
//     width: 100,
//     alignItems: 'center',
//     margin: 8,
//     padding: 12,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   gridImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginBottom: 8,
//     borderWidth: 2,
//     borderColor: '#e7e7e7',
//   },
//   gridText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#333',
//     textAlign: 'center',
//   },

//   // List Layout Styles
//   listContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     marginBottom: 12,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   listImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 16,
//     borderWidth: 2,
//     borderColor: '#e7e7e7',
//   },
//   listText: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
  
//   // Chevron for list items
//   chevronContainer: {
//     paddingLeft: 8,
//   },
//   chevron: {
//     fontSize: 18,
//     color: '#999',
//     fontWeight: 'bold',
//   },
// });

// export default MentorCard;



// components/mentor/MentorCard.tsx
import { TouchableOpacity, View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

type MentorCardProps = {
  name?: string;
  image?: ImageSourcePropType;
  specialty?: string;
  rating?: number;
  layout?: 'grid' | 'list';
  onPress?: () => void;
};

const MentorCard: React.FC<MentorCardProps> = ({ 
  name = 'Unknown Mentor', 
  image = require('../../assets/images/icon.png'), 
  specialty = 'General Education', 
  rating = 0, 
  layout = 'list', 
  onPress = () => {} 
}) => {
  // Validate rating to be between 0-5
  const validatedRating = Math.min(Math.max(rating || 0, 0), 5);
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={layout === 'list' ? styles.listContainer : styles.gridContainer}
      activeOpacity={0.8}
    >
      <Image 
        source={image} 
        style={styles.profileImage} 
        defaultSource={require('../../assets/images/icon.png')}
        onError={() => console.log('Error loading mentor image')}
      />
      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          {validatedRating >= 4.5 && (
            <MaterialIcons name="verified" size={16} color="#4299e1" style={styles.verifiedIcon} />
          )}
        </View>
        <Text style={styles.specialty} numberOfLines={1}>{specialty}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>
            ⭐ {validatedRating.toFixed(1)}
          </Text>
        </View>
      </View>
      {layout === 'list' && (
        <View style={styles.chevronContainer}>
          <Text style={styles.chevron}>›</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  gridContainer: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: '#f1f5f9', // Fallback color
  },
  infoContainer: {
    flex: 1,
    overflow: 'hidden', // Prevent text overflow
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    flexShrink: 1, // Allow text to shrink if needed
  },
  verifiedIcon: {
    marginLeft: 6,
  },
  specialty: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#F6AD55',
    fontWeight: '600',
  },
  chevronContainer: {
    marginLeft: 8,
  },
  chevron: {
    fontSize: 24,
    color: '#CBD5E0',
    fontWeight: 'bold',
  },
});

export default MentorCard;