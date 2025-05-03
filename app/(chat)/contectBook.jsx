// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   TextInput,
//   ActivityIndicator
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import { useSelector } from 'react-redux';
// import type, { RootState } from '../redux/store'; // Adjust path to your store file

// const ContactBookScreen = () => {
//   const [contacts, setContacts] = useState([]);
//   const [filteredContacts, setFilteredContacts] = useState([]);
//   const [searchText, setSearchText] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigation = useNavigation();
  
//   // Safe Redux access with optional chaining and type checking
//   const currentUser = useSelector((state: RootState) => state?.auth?.user);

//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         // Simulate API call - replace with your actual API endpoint
//         const response = await fetch('http://localhost:5000/api/auth/alluser');
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch contacts');
//         }
        
//         const data = await response.json();
        
//         // Safe filtering with null check
//         const filteredData = data.filter(user => 
//           currentUser ? user._id !== currentUser._id : true
//         );
        
//         setContacts(filteredData);
//         setFilteredContacts(filteredData);
//       } catch (err) {
//         console.error('Error fetching contacts:', err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchContacts();
//   }, [currentUser?.id]); // Add dependency

//   useEffect(() => {
//     if (searchText) {
//       const filtered = contacts.filter(contact =>
//         contact.fname?.toLowerCase().includes(searchText.toLowerCase()) ||
//         contact.lname?.toLowerCase().includes(searchText.toLowerCase()) ||
//         contact.email?.toLowerCase().includes(searchText.toLowerCase())
//       );
//       setFilteredContacts(filtered);
//     } else {
//       setFilteredContacts(contacts);
//     }
//   }, [searchText, contacts]);

//   const handleContactSelect = (contact) => {
//     navigation.navigate('ChatScreen', {
//       receiverId: contact._id,
//       receiverName: `${contact.fname} ${contact.lname}`,
//       receiverRole: contact.role
//     });
//   };

//   const renderContactItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.contactItem}
//       onPress={() => handleContactSelect(item)}
//     >
//       {item.profileImage ? (
//         <Image 
//           source={{ uri: item.profileImage }} 
//           style={styles.avatar} 
//           resizeMode="cover"
//         />
//       ) : (
//         <View style={styles.avatarPlaceholder}>
//           <Text style={styles.avatarText}>
//             {item.fname?.charAt(0)}{item.lname?.charAt(0)}
//           </Text>
//         </View>
//       )}
      
//       <View style={styles.contactInfo}>
//         <Text style={styles.contactName} numberOfLines={1}>
//           {item.fname} {item.lname}
//         </Text>
//         <Text style={styles.contactRole} numberOfLines={1}>
//           {item.role === 'teacher' ? 'Teacher' : 'Student'}
//         </Text>
//       </View>
      
//       <Ionicons name="chevron-forward" size={20} color="#888" />
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#007AFF" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Ionicons name="warning-outline" size={40} color="#ff3b30" />
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity 
//           style={styles.retryButton}
//           onPress={() => setLoading(true)}
//         >
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.searchContainer}>
//         <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search contacts..."
//           placeholderTextColor="#888"
//           value={searchText}
//           onChangeText={setSearchText}
//           autoCapitalize="none"
//           autoCorrect={false}
//         />
//       </View>

//       <FlatList
//         data={filteredContacts}
//         renderItem={renderContactItem}
//         keyExtractor={(item) => item._id}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Ionicons name="people-outline" size={60} color="#ccc" />
//             <Text style={styles.emptyText}>No contacts found</Text>
//           </View>
//         }
//         ItemSeparatorComponent={() => <View style={styles.separator} />}
//         refreshing={loading}
//         onRefresh={() => setLoading(true)}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#ff3b30',
//     marginVertical: 15,
//     textAlign: 'center',
//   },
//   retryButton: {
//     backgroundColor: '#007AFF',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 5,
//   },
//   retryButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     borderRadius: 10,
//     margin: 15,
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#333',
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   contactItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     paddingVertical: 12,
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 15,
//   },
//   avatarPlaceholder: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#007AFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   avatarText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   contactInfo: {
//     flex: 1,
//     marginRight: 10,
//   },
//   contactName: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#333',
//     marginBottom: 3,
//   },
//   contactRole: {
//     fontSize: 14,
//     color: '#888',
//   },
//   separator: {
//     height: 1,
//     backgroundColor: '#f0f0f0',
//     marginLeft: 80,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingTop: 100,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#888',
//     marginTop: 15,
//   },
// });

// export default ContactBookScreen;