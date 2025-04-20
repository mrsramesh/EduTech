import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // using Ionicons for filter icon

const SearchComponent = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);

  const data: string[] = [
    'React',
    'React Native',
    'Expo',
    'JavaScript',
    'TypeScript',
    'Node.js',
    'Express',
    'MongoDB',
    'Python',
    'Django',
  ];

  const filters = ['Frontend', 'Backend', 'Fullstack', 'Mobile', 'Database'];

  const handleSearch = (text: string) => {
    setSearchText(text);

    if (text.length > 0) {
      const results = data.filter(item =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(results);
    } else {
      setFilteredData([]);
    }
  };

  const handleSubmit = () => {
    if (searchText.trim().length === 0) return;

    const updatedHistory = [
      searchText,
      ...searchHistory.filter(h => h !== searchText),
    ].slice(0, 5);

    setSearchHistory(updatedHistory);
    setSearchText('');
    setFilteredData([]);
  };

  const handleFilterSelect = (filter: string) => {
    setSearchText(filter);
    handleSearch(filter);
    setFilterModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="🔍 Search..."
          value={searchText}
          onChangeText={handleSearch}
          onSubmitEditing={handleSubmit}
          style={styles.input}
          returnKeyType="search"
        />

        {/* Filter icon button */}
        <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={styles.iconButton}>
          <Ionicons name="filter" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Filter dropdown modal */}
      <Modal
        transparent
        animationType="fade"
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {filters.map((filter, index) => (
              <TouchableOpacity
                key={index}
                style={styles.filterOption}
                onPress={() => handleFilterSelect(filter)}
              >
                <Text style={styles.filterText}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Filtered results */}
      {filteredData.length > 0 && (
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.resultItem}>{item}</Text>
          )}
        />
      )}

      {/* Search History */}
      <Text style={styles.historyTitle}>Recent Searches</Text>
      {searchHistory.map((item, index) => (
        <Text key={index} style={styles.historyItem}>
          • {item}
        </Text>
      ))}
    </View>
  );
};

export default SearchComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef1f7',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  iconButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    padding: 10,
    marginLeft: 8,
  },
  resultItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
    elevation: 2,
  },
  historyTitle: {
    marginTop: 30,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
  },
  historyItem: {
    paddingVertical: 6,
    fontSize: 15,
    color: '#555',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  filterOption: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
  },
  filterText: {
    fontSize: 16,
    color: '#333',
  },
});
