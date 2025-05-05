import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

interface SearchComponentProps {
  onSearch?: (query: string) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onSearch }) => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  const data = [
    'React', 'React Native', 'JavaScript', 'TypeScript',
    'Node.js', 'Python', 'UI/UX', 'Graphic Design'
  ];

  const handleSearch = (text: string) => {
    setSearchText(text);
    onSearch?.(text);
  };

  const handleSubmit = () => {
    if (searchText.trim()) {
      setSearchHistory([searchText, ...searchHistory.filter(h => h !== searchText).slice(0, 4)]);
    }
    setSearchText('');
  };

  const clearHistory = () => setSearchHistory([]);
  const deleteItem = (item: string) => setSearchHistory(prev => prev.filter(i => i !== item));

  const filteredData = data.filter(item => 
    item.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#667085" />
        <TextInput
          placeholder="Search courses..."
          placeholderTextColor="#98A2B3"
          value={searchText}
          onChangeText={handleSearch}
          onSubmitEditing={handleSubmit}
          style={styles.input}
          returnKeyType="search"
        />
        {!!searchText && (
          <Pressable onPress={() => setSearchText('')} style={styles.clearButton}>
            <Feather name="x" size={18} color="#98A2B3" />
          </Pressable>
        )}
      </View>

      {!!searchText && (
        <FlatList
          data={filteredData}
          style={styles.resultsContainer}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.resultItem}>
              <Text style={styles.resultText}>{item}</Text>
              <Feather name="arrow-up-left" size={18} color="#7F56D9" />
            </TouchableOpacity>
          )}
        />
      )}

      {!searchText && searchHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={clearHistory}>
              <Text style={styles.clearHistory}>Clear all</Text>
            </TouchableOpacity>
          </View>
          
          {searchHistory.map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <Ionicons name="time-outline" size={18} color="#98A2B3" />
              <Text style={styles.historyText}>{item}</Text>
              <Pressable onPress={() => deleteItem(item)}>
                <MaterialIcons name="delete-outline" size={18} color="#F04438" />
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#101828',
    fontFamily: 'Inter-Regular',
    marginLeft: 12,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  resultsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    maxHeight: 200,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  resultText: {
    fontSize: 14,
    color: '#101828',
    fontFamily: 'Inter-Medium',
  },
  historyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 14,
    color: '#101828',
    fontFamily: 'Inter-SemiBold',
  },
  clearHistory: {
    color: '#7F56D9',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  historyText: {
    flex: 1,
    fontSize: 14,
    color: '#475467',
    fontFamily: 'Inter-Regular',
  },
});

export default SearchComponent;