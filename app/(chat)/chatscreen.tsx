// import React, { useEffect, useState } from "react";
// import { socket } from "../utils/socket";
// import { TextInput, Button, FlatList, Text, View } from "react-native";
// import { v4 as uuidv4 } from "uuid"; // for generating unique userId

// // Define the type for a message
// type ChatMessage = {
//   message: string;
//   timestamp: number;
//   senderId: string;
// };

// export default function ChatScreen() {
//   const [message, setMessage] = useState<string>("");
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [userId] = useState<string>(uuidv4()); // Unique ID for user
//   const roomId = "room1"; // You can make this dynamic too

//   useEffect(() => {
//     // Join a room
//     socket.emit("join_room", { roomId, userId });

//     // Listen for incoming messages
//     const handleReceiveMessage = (data: ChatMessage) => {
//       setMessages((prev) => [...prev, data]);
//     };

//     socket.on("receive_message", handleReceiveMessage);

//     return () => {
//       socket.off("receive_message", handleReceiveMessage);
//     };
//   }, [roomId, userId]);

//   const sendMessage = () => {
//     const newMessage = {
//       message,
//       timestamp: Date.now(),
//       senderId: userId,
//     };
//     socket.emit("send_message", { roomId, ...newMessage });
//     setMessages((prev) => [...prev, newMessage]); // Show sent message instantly
//     setMessage("");
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <FlatList
//         data={messages}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <Text style={{ marginVertical: 5 }}>
//             {item.senderId === userId ? "You: " : "Other: "} {item.message}
//           </Text>
//         )}
//       />
//       <TextInput
//         value={message}
//         onChangeText={setMessage}
//         placeholder="Type your message"
//         style={{
//           borderWidth: 1,
//           borderColor: "#ccc",
//           padding: 10,
//           marginBottom: 10,
//         }}
//       />
//       <Button title="Send" onPress={sendMessage} />
//     </View>
//   );
// }


// import React, { useEffect, useState, useRef } from "react";
// import { TextInput, Button, FlatList, Text, View, StyleSheet } from "react-native";
// import { v4 as uuidv4 } from "uuid";
// import { socket } from "../utils/socket";
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// type ChatMessage = {
//   id: string;
//   message: string;
//   timestamp: number;
//   senderId: string;
//   status: 'sent' | 'delivered' | 'seen';
// };

// export default function ChatScreen() {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [userId] = useState<string>(uuidv4());
//   const [otherUserStatus, setOtherUserStatus] = useState<'online' | 'offline'>('offline');
//   const roomId = "room1";
//   const flatListRef = useRef<FlatList>(null);

//   useEffect(() => {
//     socket.connect();

//     // Join room with user metadata
//     socket.emit("join_room", { 
//       roomId, 
//       userId,
//       userData: {
//         name: "User", // You can replace with actual user data
//         lastSeen: Date.now()
//       }
//     });

//     // Message handlers
//     const handleReceiveMessage = (data: ChatMessage) => {
//       // Mark previous messages as seen when receiving new message
//       setMessages(prev => prev.map(msg => 
//         msg.senderId !== userId ? { ...msg, status: 'seen' } : msg
//       ));
      
//       // Add new message with delivered status
//       setMessages(prev => [...prev, { ...data, status: 'delivered' }]);
      
//       // Notify sender that message was delivered
//       socket.emit("message_status", {
//         roomId,
//         messageId: data.id,
//         status: 'delivered',
//         receiverId: userId
//       });
//     };

//     const handleMessageStatus = (data: { messageId: string, status: 'delivered' | 'seen' }) => {
//       setMessages(prev => prev.map(msg => 
//         msg.id === data.messageId ? { ...msg, status: data.status } : msg
//       ));
//     };

//     const handleUserStatus = (status: 'online' | 'offline') => {
//       setOtherUserStatus(status);
//     };

//     // Socket event listeners
//     socket.on("receive_message", handleReceiveMessage);
//     socket.on("message_status", handleMessageStatus);
//     socket.on("user_status", handleUserStatus);
//     socket.on("user_typing", (isTyping: boolean) => {
//       // Handle typing indicator if needed
//     });

//     // Cleanup
//     return () => {
//       socket.off("receive_message", handleReceiveMessage);
//       socket.off("message_status", handleMessageStatus);
//       socket.off("user_status", handleUserStatus);
//       socket.disconnect();
//     };
//   }, []);

//   const sendMessage = () => {
//     if (!message.trim()) return;

//     const newMessage: ChatMessage = {
//       id: uuidv4(),
//       message,
//       timestamp: Date.now(),
//       senderId: userId,
//       status: 'sent'
//     };

//     socket.emit("send_message", { roomId, ...newMessage });
//     setMessages(prev => [...prev, newMessage]);
//     setMessage("");
    
//     // Scroll to bottom
//     setTimeout(() => {
//       flatListRef.current?.scrollToEnd({ animated: true });
//     }, 100);
//   };

//   const renderMessageStatus = (status: string) => {
//     switch (status) {
//       case 'sent':
//         return <MaterialIcons name="done" size={16} color="#666" />;
//       case 'delivered':
//         return <MaterialIcons name="done-all" size={16} color="#666" />;
//       case 'seen':
//         return <MaterialIcons name="done-all" size={16} color="#007AFF" />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Chat</Text>
//         <View style={styles.statusContainer}>
//           <View style={[
//             styles.statusIndicator, 
//             otherUserStatus === 'online' ? styles.online : styles.offline
//           ]} />
//           <Text style={styles.statusText}>
//             {otherUserStatus === 'online' ? 'Online' : 'Offline'}
//           </Text>
//         </View>
//       </View>

//       <FlatList
//         ref={flatListRef}
//         data={messages}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={[
//             styles.messageContainer,
//             item.senderId === userId ? styles.sentMessage : styles.receivedMessage
//           ]}>
//             <Text style={styles.messageText}>{item.message}</Text>
//             <View style={styles.messageMeta}>
//               <Text style={styles.timeText}>
//                 {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </Text>
//               {item.senderId === userId && renderMessageStatus(item.status)}
//             </View>
//           </View>
//         )}
//         contentContainerStyle={styles.messagesList}
//       />

//       <View style={styles.inputContainer}>
//         <TextInput
//           value={message}
//           onChangeText={setMessage}
//           placeholder="Type your message"
//           style={styles.input}
//           multiline
//         />
//         <Button title="Send" onPress={sendMessage} />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//     backgroundColor: '#fff',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   statusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 5,
//   },
//   statusIndicator: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     marginRight: 5,
//   },
//   online: {
//     backgroundColor: '#4CAF50',
//   },
//   offline: {
//     backgroundColor: '#9E9E9E',
//   },
//   statusText: {
//     fontSize: 12,
//     color: '#666',
//   },
//   messagesList: {
//     padding: 10,
//   },
//   messageContainer: {
//     maxWidth: '80%',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   sentMessage: {
//     alignSelf: 'flex-end',
//     backgroundColor: '#DCF8C6',
//   },
//   receivedMessage: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#fff',
//   },
//   messageText: {
//     fontSize: 16,
//   },
//   messageMeta: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     marginTop: 5,
//   },
//   timeText: {
//     fontSize: 12,
//     color: '#666',
//     marginRight: 5,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     padding: 10,
//     borderTopWidth: 1,
//     borderTopColor: '#ddd',
//     backgroundColor: '#fff',
//     alignItems: 'center',
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 20,
//     padding: 10,
//     marginRight: 10,
//     maxHeight: 100,
//   },
// });




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

// ... (keep your existing styles the same)


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