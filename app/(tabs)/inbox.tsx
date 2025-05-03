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
