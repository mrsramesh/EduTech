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


import React, { useEffect, useState, useRef } from "react";
import { TextInput, Button, FlatList, Text, View, StyleSheet } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { socket } from "../utils/socket";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type ChatMessage = {
  id: string;
  message: string;
  timestamp: number;
  senderId: string;
  status: 'sent' | 'delivered' | 'seen';
};

export default function ChatScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userId] = useState<string>(uuidv4());
  const [otherUserStatus, setOtherUserStatus] = useState<'online' | 'offline'>('offline');
  const roomId = "room1";
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    socket.connect();

    // Join room with user metadata
    socket.emit("join_room", { 
      roomId, 
      userId,
      userData: {
        name: "User", // You can replace with actual user data
        lastSeen: Date.now()
      }
    });

    // Message handlers
    const handleReceiveMessage = (data: ChatMessage) => {
      // Mark previous messages as seen when receiving new message
      setMessages(prev => prev.map(msg => 
        msg.senderId !== userId ? { ...msg, status: 'seen' } : msg
      ));
      
      // Add new message with delivered status
      setMessages(prev => [...prev, { ...data, status: 'delivered' }]);
      
      // Notify sender that message was delivered
      socket.emit("message_status", {
        roomId,
        messageId: data.id,
        status: 'delivered',
        receiverId: userId
      });
    };

    const handleMessageStatus = (data: { messageId: string, status: 'delivered' | 'seen' }) => {
      setMessages(prev => prev.map(msg => 
        msg.id === data.messageId ? { ...msg, status: data.status } : msg
      ));
    };

    const handleUserStatus = (status: 'online' | 'offline') => {
      setOtherUserStatus(status);
    };

    // Socket event listeners
    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_status", handleMessageStatus);
    socket.on("user_status", handleUserStatus);
    socket.on("user_typing", (isTyping: boolean) => {
      // Handle typing indicator if needed
    });

    // Cleanup
    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_status", handleMessageStatus);
      socket.off("user_status", handleUserStatus);
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: uuidv4(),
      message,
      timestamp: Date.now(),
      senderId: userId,
      status: 'sent'
    };

    socket.emit("send_message", { roomId, ...newMessage });
    setMessages(prev => [...prev, newMessage]);
    setMessage("");
    
    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessageStatus = (status: string) => {
    switch (status) {
      case 'sent':
        return <MaterialIcons name="done" size={16} color="#666" />;
      case 'delivered':
        return <MaterialIcons name="done-all" size={16} color="#666" />;
      case 'seen':
        return <MaterialIcons name="done-all" size={16} color="#007AFF" />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusIndicator, 
            otherUserStatus === 'online' ? styles.online : styles.offline
          ]} />
          <Text style={styles.statusText}>
            {otherUserStatus === 'online' ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.messageContainer,
            item.senderId === userId ? styles.sentMessage : styles.receivedMessage
          ]}>
            <Text style={styles.messageText}>{item.message}</Text>
            <View style={styles.messageMeta}>
              <Text style={styles.timeText}>
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              {item.senderId === userId && renderMessageStatus(item.status)}
            </View>
          </View>
        )}
        contentContainerStyle={styles.messagesList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message"
          style={styles.input}
          multiline
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
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
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  online: {
    backgroundColor: '#4CAF50',
  },
  offline: {
    backgroundColor: '#9E9E9E',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  messagesList: {
    padding: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
  },
  messageMeta: {
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
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    maxHeight: 100,
  },
});