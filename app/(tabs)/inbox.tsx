import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Reusable Type for chat or call data item
type MessageItem = {
  id: string;
  name: string;
  message: string;
  time: string;
  count?: string;
};

// Sample data
const chatData: MessageItem[] = [
  {
    id: '1',
    name: 'Virginia M. Patterson',
    message: 'Hi, Good Evening Bro.!',
    time: '14:59',
    count: '03',
  },
  {
    id: '2',
    name: 'Dominick S. Jenkins',
    message: 'I Just Finished It.!',
    time: '06:35',
    count: '02',
  },
  {
    id: '3',
    name: 'Duncan E. Hoffman',
    message: 'How are you?',
    time: '08:10',
  },
  {
    id: '4',
    name: 'Roy R. McCraney',
    message: 'OMG, This is Amazing..',
    time: '21:07',
    count: '05',
  },
];

const callsData: MessageItem[] = [
  {
    id: '1',
    name: 'Janice R. Norris',
    message: 'Wow, This is Really Epic',
    time: '09:15',
  },
  {
    id: '2',
    name: 'Marilyn C. Amerson',
    message: 'Hi, Good Evening Bro.!',
    time: '14:59',
    count: '03',
  },
  {
    id: '3',
    name: 'Dominick S. Jenkins',
    message: 'I Just Finished It.!',
    time: '06:35',
    count: '02',
  },
];

export default function InboxScreen(): JSX.Element {
  const [activeTab, setActiveTab] = useState<'Chat' | 'Calls'>('Chat');
  const navigation = useNavigation();

  const handleCardPress = (item: MessageItem) => {
    if (activeTab === 'Chat') {
      router.push('/(chat)/chatscreen');
    } else {
      router.push('/(chat)/calling');
    }
  };

  const renderCard: ListRenderItem<MessageItem> = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)}>
      <View style={styles.avatar} />
      <View style={styles.messageContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
      <View style={styles.info}>
        {item.count && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.count}</Text>
          </View>
        )}
        <Text style={styles.time}>{item.time}</Text>

        {activeTab === 'Calls' && (
          <View style={styles.iconRow}>
            <MaterialIcons name="call" size={18} color="#007260" style={styles.icon} />
            <FontAwesome name="envelope" size={16} color="#007260" style={styles.icon} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const data = activeTab === 'Chat' ? chatData : callsData;

  
  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Chat' && styles.activeTab]}
          onPress={() => setActiveTab('Chat')}
        >
          <Text style={[styles.tabText, activeTab === 'Chat' && styles.activeText]}>
            Chat
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Calls' && styles.activeTab]}
          onPress={() => setActiveTab('Calls')}
        >
          <Text style={[styles.tabText, activeTab === 'Calls' && styles.activeText]}>
            Calls
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <TouchableOpacity
  style={styles.newChatButton}
  onPress={() => router.push('/(chat)/contectBook')}
>
  <Ionicons name="person-add" size={24} color="white" />
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#f2f4f7',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#007260',
  },
  tabText: {
    fontSize: 16,
    color: '#6c757d',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafc',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: '#000',
    borderRadius: 20,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#212529',
  },
  message: {
    color: '#495057',
    fontSize: 13,
    marginTop: 2,
  },
  info: {
    alignItems: 'flex-end',
  },
  badge: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 5,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
  },
  time: {
    fontSize: 12,
    color: '#6c757d',
  },
  iconRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  icon: {
    marginLeft: 4,
  },
  newChatButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});


// 2nd version , inbox , contectboon , types.ts, chatscreen 

// // inbox.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   ActivityIndicator
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/redux/store';
// import { Chat, User } from '@/utils/types'; // Make sure to import User type

// const InboxScreen = () => {
//   const [activeTab, setActiveTab] = useState<'Chat' | 'Calls'>('Chat');
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigation = useNavigation();
  
//   const currentUser = useSelector((state: RootState) => state.auth.user);

//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         if (!currentUser?._id) return;
        
//         const response = await fetch(`http://localhost:5000/api/chat?userId=${currentUser._id}`);
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch chats');
//         }
        
//         const data: Chat[] = await response.json();
//         setChats(data);
//       } catch (err) {
//         console.error('Error fetching chats:', err);
//         setError(err instanceof Error ? err.message : 'Unknown error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChats();
//   }, [currentUser?._id]);

//   const getOtherParticipant = (participants: User[]) => {
//     return participants.find(p => p._id !== currentUser?._id);
//   };

//   const renderChatItem = ({ item }: { item: Chat }) => {
//     const otherUser = getOtherParticipant(item.participants);
//     if (!otherUser) return null;

//     return (
//       <TouchableOpacity 
//         style={styles.chatItem}
//         onPress={() => navigation.navigate('ChatScreen', {
//           chatId: item._id,
//           receiverId: otherUser._id,
//           receiverName: `${otherUser.fname} ${otherUser.lname}`,
//           receiverImage: otherUser.profileImage
//         } as never)} // Temporary fix for navigation params typing
//       >
//         {otherUser.profileImage ? (
//           <Image 
//             source={{ uri: otherUser.profileImage }} 
//             style={styles.avatar} 
//           />
//         ) : (
//           <View style={styles.avatarPlaceholder}>
//             <Text style={styles.avatarText}>
//               {otherUser.fname?.charAt(0)}{otherUser.lname?.charAt(0)}
//             </Text>
//           </View>
//         )}
        
//         <View style={styles.chatContent}>
//           <Text style={styles.contactName}>
//             {otherUser.fname} {otherUser.lname}
//           </Text>
//           <Text style={styles.lastMessage} numberOfLines={1}>
//             {item.lastMessage?.text || 'No messages yet'}
//           </Text>
//         </View>
        
//         <View style={styles.chatInfo}>
//           <Text style={styles.timeText}>
//             {item.lastMessage ? new Date(item.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
//           </Text>
//           {item.unreadCount > 0 && (
//             <View style={styles.unreadBadge}>
//               <Text style={styles.unreadCount}>{item.unreadCount}</Text>
//             </View>
//           )}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const handleNewChat = () => {
//     navigation.navigate('ContactBook' as never); // Temporary fix for navigation typing
//   };

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
//       <View style={styles.tabRow}>
//         <TouchableOpacity
//           style={[styles.tabButton, activeTab === 'Chat' && styles.activeTab]}
//           onPress={() => setActiveTab('Chat')}
//         >
//           <Text style={[styles.tabText, activeTab === 'Chat' && styles.activeText]}>
//             Chat
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.tabButton, activeTab === 'Calls' && styles.activeTab]}
//           onPress={() => setActiveTab('Calls')}
//         >
//           <Text style={[styles.tabText, activeTab === 'Calls' && styles.activeText]}>
//             Calls
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={chats}
//         renderItem={renderChatItem}
//         keyExtractor={(item) => item._id}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Ionicons name="chatbubbles-outline" size={60} color="#ccc" />
//             <Text style={styles.emptyText}>No chats yet</Text>
//             <Text style={styles.emptySubtext}>Start a new conversation</Text>
//           </View>
//         }
//         ItemSeparatorComponent={() => <View style={styles.separator} />}
//       />

//       <TouchableOpacity
//         style={styles.newChatButton}
//         onPress={handleNewChat}
//       >
//         <Ionicons name="person-add" size={24} color="white" />
//       </TouchableOpacity>
//     </View>
//   );
// };

// // ... keep your existing styles ...


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   tabRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 10,
//     paddingTop: 10,
//   },
//   tabButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     backgroundColor: '#f2f4f7',
//     borderRadius: 20,
//     marginHorizontal: 5,
//   },
//   activeTab: {
//     backgroundColor: '#007260',
//   },
//   tabText: {
//     fontSize: 16,
//     color: '#6c757d',
//   },
//   activeText: {
//     color: '#fff',
//     fontWeight: 'bold',
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
//   chatItem: {
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
//   chatContent: {
//     flex: 1,
//   },
//   contactName: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#333',
//     marginBottom: 3,
//   },
//   lastMessage: {
//     fontSize: 14,
//     color: '#888',
//   },
//   chatInfo: {
//     alignItems: 'flex-end',
//   },
//   timeText: {
//     fontSize: 12,
//     color: '#888',
//     marginBottom: 5,
//   },
//   unreadBadge: {
//     backgroundColor: '#007AFF',
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   unreadCount: {
//     color: 'white',
//     fontSize: 12,
//   },
//   listContent: {
//     paddingBottom: 20,
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
//     fontSize: 18,
//     color: '#6c757d',
//     marginBottom: 5,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: '#adb5bd',
//   },
//   newChatButton: {
//     position: 'absolute',
//     right: 20,
//     bottom: 20,
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#007AFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
// });

// export default InboxScreen;