
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Image,
  StyleSheet,
  Linking,
  Alert,
  Platform
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import EmojiSelector from 'react-native-emoji-selector';
import { io, Socket } from 'socket.io-client';

type FileType = {
  uri: string;
  type: string;
  name: string;
  base64?: string;
} | null;

type MessageStatus = 'sent' | 'delivered' | 'seen';

type ChatMessage = {
  id: string;
  message: string;
  file?: FileType;
  senderId: string;
  receiverId: string;
  status: MessageStatus;
  timestamp: number;
};

type ChatScreenProps = {
  route?: {
    params?: {
      currentUserId: string;
      otherUserId: string;
      roomId: string;
    };
  };
};

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  const { 
    currentUserId = 'current-user-id', 
    otherUserId = 'other-user-id', 
    roomId = 'default-room' 
  } = route?.params || {};
  
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [file, setFile] = useState<FileType>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [otherUserStatus, setOtherUserStatus] = useState<'online' | 'offline'>('offline');
  
  const socket = useRef<Socket | null>(null);
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  // Initialize socket connection
  useEffect(() => {
    socket.current = io('http://your-server-ip:5000', {
      query: {
        userId: currentUserId,
        roomId
      }
    });

    // Load previous messages
    socket.current.emit('get_messages', { roomId });

    // Socket event listeners
    socket.current.on('previous_messages', (msgs: ChatMessage[]) => {
      setMessages(msgs);
      scrollToBottom();
    });

    socket.current.on('receive_message', handleReceiveMessage);
    socket.current.on('message_status', handleMessageStatus);
    socket.current.on('user_status', setOtherUserStatus);
    socket.current.on('typing', setIsTyping);

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [currentUserId, roomId]);

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handleReceiveMessage = (newMessage: ChatMessage) => {
    setMessages(prev => [...prev, newMessage]);
    
    // If message is from other user, mark as seen
    if (newMessage.senderId === otherUserId) {
      markMessagesAsSeen([newMessage.id]);
    }
    
    scrollToBottom();
  };

  const handleMessageStatus = (data: { messageId: string; status: MessageStatus }) => {
    setMessages(prev => prev.map(msg => 
      msg.id === data.messageId ? { ...msg, status: data.status } : msg
    ));
  };

  const markMessagesAsSeen = (messageIds: string[]) => {
    if (socket.current) {
      socket.current.emit('mark_as_seen', {
        messageIds,
        roomId,
        seenBy: currentUserId
      });
    }
  };

  const sendMessage = async () => {
    if ((!message.trim() && !file) || !socket.current) return;

    let fileToSend = file;
    
    // If file is local URI, convert to base64 for sending
    if (file?.uri && file.uri.startsWith('file://')) {
      try {
        const base64 = await FileSystem.readAsStringAsync(file.uri, {
          encoding: FileSystem.EncodingType.Base64
        });
        fileToSend = {
          ...file,
          base64
        };
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message,
      file: fileToSend || undefined,
      senderId: currentUserId,
      receiverId: otherUserId,
      status: 'sent',
      timestamp: Date.now()
    };

    socket.current.emit('send_message', {
      ...newMessage,
      roomId
    });

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setFile(null);
    scrollToBottom();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setFile({
        uri: result.assets[0].uri,
        type: result.assets[0].mimeType || 'image/jpeg',
        name: result.assets[0].fileName || `image_${Date.now()}`,
        base64: result.assets[0].base64 || undefined
      });
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const document = result.assets[0];
        setFile({
          uri: document.uri,
          type: document.mimeType || 'application/octet-stream',
          name: document.name || `document_${Date.now()}`
        });
      }
    } catch (error) {
      console.error('Document picker error:', error);
    }
  };

  const handleFileOpen = async (file: FileType) => {
    if (!file) return;

    try {
      // For Android, we need to use a file provider
      if (Platform.OS === 'android') {
        // Check if we have permission to open the file
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        
        if (permissions.granted) {
          // Copy file to accessible location
          const newUri = await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            file.name,
            file.type
          );
          
          await FileSystem.writeAsStringAsync(newUri, file.base64 || '', {
            encoding: FileSystem.EncodingType.Base64
          });
          
          await Linking.openURL(newUri);
        }
      } else {
        // For iOS, we can try to open directly
        const supported = await Linking.canOpenURL(file.uri);
        
        if (supported) {
          await Linking.openURL(file.uri);
        } else {
          Alert.alert('Error', 'Cannot open this file type');
        }
      }
    } catch (error) {
      console.error('Error opening file:', error);
      Alert.alert('Error', 'Failed to open file');
    }
  };

  const renderMessageItem = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.messageContainer,
      item.senderId === currentUserId ? styles.sentMessage : styles.receivedMessage
    ]}>
      {item.file ? (
        item.file.type.startsWith('image/') ? (
          <TouchableOpacity onPress={() => item.file && handleFileOpen(item.file)}>
            <Image source={{ uri: item.file.uri }} style={styles.image} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.fileContainer}
            onPress={() => item.file && handleFileOpen(item.file)}
          >
            <MaterialIcons name="insert-drive-file" size={24} color="gray" />
            <Text>{item.file.name}</Text>
          </TouchableOpacity>
        )
      ) : (
        <Text style={styles.messageText}>{item.message}</Text>
      )}
      <View style={styles.messageFooter}>
        <Text style={styles.timeText}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        {item.senderId === currentUserId && (
          <MaterialIcons 
            name={item.status === 'seen' ? 'done-all' : item.status === 'delivered' ? 'done-all' : 'done'} 
            size={16} 
            color={item.status === 'seen' ? 'blue' : item.status === 'delivered' ? 'gray' : 'lightgray'} 
          />
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusDot,
            otherUserStatus === 'online' ? styles.online : styles.offline
          ]} />
          <Text style={styles.statusText}>
            {otherUserStatus}{isTyping && ' • typing...'}
          </Text>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
      />

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessage(prev => prev + emoji);
            setShowEmojiPicker(false);
          }}
          columns={8}
        />
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
          <Ionicons name="happy-outline" size={24} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity onPress={pickImage}>
          <Ionicons name="image-outline" size={24} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity onPress={pickDocument}>
          <Ionicons name="document-attach-outline" size={24} color="gray" />
        </TouchableOpacity>

        <TextInput
          value={message}
          onChangeText={(text) => {
            setMessage(text);
            if (socket.current) {
              socket.current.emit('typing', {
                isTyping: text.length > 0,
                roomId
              });
            }
          }}
          style={styles.input}
          placeholder="Type a message"
          multiline
        />

        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// // ... (keep your existing styles the same)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    marginHorizontal: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 10,
    marginLeft: 5,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  online: {
    backgroundColor: 'green',
  },
  offline: {
    backgroundColor: 'gray',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  fileContainer: {
    alignItems: 'center',
    padding: 10,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 5,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginRight: 5,
  },
  messagesContainer: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  messageText: {
    fontSize: 16,
  },
});

export default ChatScreen;

//  2nd version 



// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { Ionicons, MaterialIcons } from '@expo/vector-icons';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/redux/store';
// import { Message } from '@/utils/types';
// import * as ImagePicker from 'expo-image-picker';
// import * as DocumentPicker from 'expo-document-picker';
// import * as FileSystem from 'expo-file-system';

// const ChatScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { receiverId, receiverName, receiverImage, chatId } = route.params as {
//     receiverId: string;
//     receiverName: string;
//     receiverImage?: string;
//     chatId?: string;
//   };
  
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [file, setFile] = useState<{
//     uri: string;
//     type: string;
//     name: string;
//     base64?: string;
//   } | null>(null);
//   const flatListRef = useRef<FlatList<Message>>(null);
  
//   const currentUser = useSelector((state: RootState) => state.auth.user);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         let url = chatId 
//           ? `http://localhost:5000/api/message?chatId=${chatId}`
//           : `http://localhost:5000/api/message?userId=${receiverId}`;
        
//         const response = await fetch(url);
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch messages');
//         }
        
//         const data: Message[] = await response.json();
//         setMessages(data);
//       } catch (err) {
//         console.error('Error fetching messages:', err);
//         setError(err instanceof Error ? err.message : 'Unknown error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMessages();
    
//     navigation.setOptions({
//       title: receiverName,
//       headerLeft: () => (
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#007AFF" />
//         </TouchableOpacity>
//       ),
//     });
//   }, [receiverId, chatId]);

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.8,
//       base64: true,
//     });

//     if (!result.canceled && result.assets[0]) {
//       setFile({
//         uri: result.assets[0].uri,
//         type: result.assets[0].mimeType || 'image/jpeg',
//         name: result.assets[0].fileName || `image_${Date.now()}`,
//         base64: result.assets[0].base64 || undefined
//       });
//     }
//   };

//   const pickDocument = async () => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: '*/*',
//         copyToCacheDirectory: true,
//       });

//       if (result.canceled === false && result.assets && result.assets.length > 0) {
//         const document = result.assets[0];
//         setFile({
//           uri: document.uri,
//           type: document.mimeType || 'application/octet-stream',
//           name: document.name || `document_${Date.now()}`
//         });
//       }
//     } catch (error) {
//       console.error('Document picker error:', error);
//       Alert.alert('Error', 'Failed to pick document');
//     }
//   };

//   const sendMessage = async () => {
//     if ((!newMessage.trim() && !file) || !currentUser?._id) return;

//     try {
//       const formData = new FormData();
//       formData.append('sender', currentUser._id);
//       formData.append('receiver', receiverId);
//       formData.append('text', newMessage);
//       if (chatId) formData.append('chatId', chatId);
      
//       if (file) {
//         formData.append('file', {
//           uri: file.uri,
//           type: file.type,
//           name: file.name,
//         } as any);
//       }

//       const response = await fetch('http://localhost:5000/api/message', {
//         method: 'POST',
//         body: formData,
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to send message');
//       }

//       const sentMessage: Message = await response.json();
//       setMessages(prev => [...prev, sentMessage]);
//       setNewMessage('');
//       setFile(null);
      
//       setTimeout(() => {
//         flatListRef.current?.scrollToEnd({ animated: true });
//       }, 100);
//     } catch (err) {
//       console.error('Error sending message:', err);
//       setError(err instanceof Error ? err.message : 'Unknown error');
//     }
//   };

//   const renderMessage = ({ item }: { item: Message }) => {
//     const isMe = item.sender._id === currentUser?._id;
//     const messageTime = new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//     return (
//       <View style={[
//         styles.messageContainer,
//         isMe ? styles.myMessageContainer : styles.otherMessageContainer
//       ]}>
//         {!isMe && (
//           item.sender.profileImage ? (
//             <Image source={{ uri: item.sender.profileImage }} style={styles.avatar} />
//           ) : (
//             <View style={styles.avatarPlaceholder}>
//               <Text style={styles.avatarText}>
//                 {item.sender.name.split(' ').map(n => n[0]).join('')}
//               </Text>
//             </View>
//           )
//         )}
        
//         <View style={[
//           styles.messageBubble,
//           isMe ? styles.myBubble : styles.otherBubble
//         ]}>
//           {item.file ? (
//             item.file.type.startsWith('image/') ? (
//               <Image source={{ uri: item.file.url }} style={styles.messageImage} />
//             ) : (
//               <TouchableOpacity style={styles.fileContainer}>
//                 <MaterialIcons name="insert-drive-file" size={24} color="#666" />
//                 <Text style={styles.fileName}>{item.file.name}</Text>
//               </TouchableOpacity>
//             )
//           ) : (
//             <Text style={isMe ? styles.myText : styles.otherText}>
//               {item.text}
//             </Text>
//           )}
//           <View style={styles.messageFooter}>
//             <Text style={styles.timeText}>{messageTime}</Text>
//             {isMe && (
//               <Ionicons 
//                 name={item.read ? "checkmark-done" : "checkmark"} 
//                 size={16} 
//                 color={item.read ? "#4FC3F7" : "#90A4AE"} 
//               />
//             )}
//           </View>
//         </View>
//       </View>
//     );
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
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//       keyboardVerticalOffset={90}
//     >
//       <FlatList
//         ref={flatListRef}
//         data={messages}
//         renderItem={renderMessage}
//         keyExtractor={(item) => item._id}
//         contentContainerStyle={styles.messagesList}
//         onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No messages yet</Text>
//             <Text style={styles.emptySubtext}>Start the conversation</Text>
//           </View>
//         }
//       />
      
//       <View style={styles.inputContainer}>
//         <TouchableOpacity onPress={pickImage}>
//           <Ionicons name="image-outline" size={24} color="#666" style={styles.inputIcon} />
//         </TouchableOpacity>
        
//         <TouchableOpacity onPress={pickDocument}>
//           <Ionicons name="document-attach-outline" size={24} color="#666" style={styles.inputIcon} />
//         </TouchableOpacity>
        
//         <TextInput
//           style={styles.input}
//           placeholder="Type a message..."
//           value={newMessage}
//           onChangeText={setNewMessage}
//           multiline
//         />
        
//         <TouchableOpacity 
//           style={styles.sendButton}
//           onPress={sendMessage}
//           disabled={!newMessage.trim() && !file}
//         >
//           <Ionicons 
//             name="send" 
//             size={24} 
//             color={(newMessage.trim() || file) ? "#007AFF" : "#ccc"} 
//           />
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
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
//   messagesList: {
//     padding: 15,
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
//     marginBottom: 10,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: '#adb5bd',
//   },
//   messageContainer: {
//     flexDirection: 'row',
//     marginBottom: 15,
//     alignItems: 'flex-end',
//   },
//   myMessageContainer: {
//     justifyContent: 'flex-end',
//   },
//   otherMessageContainer: {
//     justifyContent: 'flex-start',
//   },
//   avatar: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     marginRight: 8,
//   },
//   avatarPlaceholder: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#007AFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 8,
//   },
//   avatarText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   messageBubble: {
//     maxWidth: '70%',
//     padding: 12,
//     borderRadius: 12,
//   },
//   myBubble: {
//     backgroundColor: '#DCF8C6',
//     borderBottomRightRadius: 2,
//   },
//   otherBubble: {
//     backgroundColor: 'white',
//     borderBottomLeftRadius: 2,
//     elevation: 1,
//   },
//   myText: {
//     color: 'black',
//     fontSize: 16,
//   },
//   otherText: {
//     color: 'black',
//     fontSize: 16,
//   },
//   messageImage: {
//     width: 200,
//     height: 200,
//     borderRadius: 8,
//     marginBottom: 5,
//   },
//   fileContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 8,
//   },
//   fileName: {
//     marginLeft: 5,
//     color: '#666',
//   },
//   messageFooter: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     marginTop: 5,
//   },
//   timeText: {
//     fontSize: 12,
//     marginRight: 5,
//     color: '#666',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     backgroundColor: 'white',
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
//   inputIcon: {
//     marginHorizontal: 5,
//   },
//   input: {
//     flex: 1,
//     minHeight: 40,
//     maxHeight: 100,
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 20,
//     marginHorizontal: 5,
//   },
//   sendButton: {
//     padding: 8,
//     marginLeft: 5,
//   },
// });

// export default ChatScreen;