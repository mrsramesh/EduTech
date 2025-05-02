// import React, { useState } from 'react';
// import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
// import { Ionicons } from '@expo/vector-icons'; // using Ionicons for filter icon

// const SearchComponent = () => {
//   const [searchText, setSearchText] = useState<string>('');
//   const [filteredData, setFilteredData] = useState<string[]>([]);
//   const [searchHistory, setSearchHistory] = useState<string[]>([]);
//   const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);

//   const data: string[] = [
//     'React',
//     'React Native',
//     'Expo',
//     'JavaScript',
//     'TypeScript',
//     'Node.js',
//     'Express',
//     'MongoDB',
//     'Python',
//     'Django',
//   ];

//   const filters = ['Frontend', 'Backend', 'Fullstack', 'Mobile', 'Database'];

//   const handleSearch = (text: string) => {
//     setSearchText(text);

//     if (text.length > 0) {
//       const results = data.filter(item =>
//         item.toLowerCase().includes(text.toLowerCase())
//       );
//       setFilteredData(results);
//     } else {
//       setFilteredData([]);
//     }
//   };

//   const handleSubmit = () => {
//     if (searchText.trim().length === 0) return;

//     const updatedHistory = [
//       searchText,
//       ...searchHistory.filter(h => h !== searchText),
//     ].slice(0, 5);

//     setSearchHistory(updatedHistory);
//     setSearchText('');
//     setFilteredData([]);
//   };

//   const handleFilterSelect = (filter: string) => {
//     setSearchText(filter);
//     handleSearch(filter);
//     setFilterModalVisible(false);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Search bar */}
//       <View style={styles.searchBar}>
//         <TextInput
//           placeholder="🔍 Search..."
//           value={searchText}
//           onChangeText={handleSearch}
//           onSubmitEditing={handleSubmit}
//           style={styles.input}
//           returnKeyType="search"
//         />

//         {/* Filter icon button */}
//         <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={styles.iconButton}>
//           <Ionicons name="filter" size={24} color="white" />
//         </TouchableOpacity>
//       </View>

//       {/* Filter dropdown modal */}
//       <Modal
//         transparent
//         animationType="fade"
//         visible={filterModalVisible}
//         onRequestClose={() => setFilterModalVisible(false)}
//       >
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPressOut={() => setFilterModalVisible(false)}
//         >
//           <View style={styles.modalContent}>
//             {filters.map((filter, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={styles.filterOption}
//                 onPress={() => handleFilterSelect(filter)}
//               >
//                 <Text style={styles.filterText}>{filter}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* Filtered results */}
//       {filteredData.length > 0 && (
//         <FlatList
//           data={filteredData}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item }) => (
//             <Text style={styles.resultItem}>{item}</Text>
//           )}
//         />
//       )}

//       {/* Search History */}
//       <Text style={styles.historyTitle}>Recent Searches</Text>
//       {searchHistory.map((item, index) => (
//         <Text key={index} style={styles.historyItem}>
//           • {item}
//         </Text>
//       ))}
//     </View>
//   );
// };

// export default SearchComponent;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#eef1f7',
//     paddingTop: 60,
//     paddingHorizontal: 20,
//   },
//   searchBar: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     paddingHorizontal: 15,
//     alignItems: 'center',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     marginBottom: 20,
//   },
//   input: {
//     flex: 1,
//     height: 50,
//     fontSize: 16,
//     color: '#333',
//   },
//   iconButton: {
//     backgroundColor: '#4a90e2',
//     borderRadius: 8,
//     padding: 10,
//     marginLeft: 8,
//   },
//   resultItem: {
//     backgroundColor: '#fff',
//     padding: 12,
//     marginBottom: 10,
//     borderRadius: 10,
//     fontSize: 16,
//     color: '#333',
//     elevation: 2,
//   },
//   historyTitle: {
//     marginTop: 30,
//     fontWeight: 'bold',
//     fontSize: 18,
//     color: '#222',
//   },
//   historyItem: {
//     paddingVertical: 6,
//     fontSize: 15,
//     color: '#555',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//     width: '80%',
//     alignItems: 'center',
//   },
//   filterOption: {
//     paddingVertical: 10,
//     width: '100%',
//     alignItems: 'center',
//     borderBottomColor: '#ccc',
//     borderBottomWidth: 0.5,
//   },
//   filterText: {
//     fontSize: 16,
//     color: '#333',
//   },
// });


import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Keyboard,
  Pressable,
} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

const SearchComponent = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

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

  const filters = [];//['Frontend', 'Backend', 'Fullstack', 'Mobile', 'Database'];

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.length > 0) {
      const results = data.filter((item) =>
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
      ...searchHistory.filter((h) => h !== searchText),
    ].slice(0, 5);
    setSearchHistory(updatedHistory);
    Keyboard.dismiss();
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter === selectedFilter ? null : filter);
    setSearchText(filter);
    handleSearch(filter);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const deleteHistoryItem = (item: string) => {
    setSearchHistory(searchHistory.filter((h) => h !== item));
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
        <TextInput
          placeholder="Search for topics..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={handleSearch}
          onSubmitEditing={handleSubmit}
          style={styles.input}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <Pressable onPress={() => setSearchText('')} style={styles.clearIcon}>
            <Feather name="x" size={20} color="#777" />
          </Pressable>
        )}
      </View>

      {/* Filter Chips (Replaced Modal) */}
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => handleFilterSelect(filter)}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.selectedFilterChip,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.selectedFilterText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Results */}
      {filteredData.length > 0 && (
        <Animated.View style={styles.resultsContainer}>
          <FlatList
            data={filteredData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.resultItem}>
                <Text style={styles.resultText}>{item}</Text>
                <Feather name="arrow-up-left" size={18} color="#4A90E2" />
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </Animated.View>
      )}

      {/* Search History */}
      {searchHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={clearSearchHistory}>
              <Text style={styles.clearHistoryText}>Clear all</Text>
            </TouchableOpacity>
          </View>
          {searchHistory.map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <Ionicons name="time-outline" size={18} color="#777" />
              <Text style={styles.historyText}>{item}</Text>
              <Pressable
                onPress={() => deleteHistoryItem(item)}
                style={styles.deleteHistoryIcon}
              >
                <MaterialIcons name="delete-outline" size={18} color="#FF6B6B" />
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default SearchComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    height: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
    fontFamily: 'Inter-Medium',
  },
  clearIcon: {
    padding: 5,
  marginLeft: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    backgroundColor: '#EDF2F7',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  selectedFilterChip: {
    backgroundColor: '#4A90E2',
  },
  filterText: {
    color: '#4A5568',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  selectedFilterText: {
    color: '#FFFFFF',
  },
  resultsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  resultText: {
    fontSize: 16,
    color: '#2D3748',
    fontFamily: 'Inter-Regular',
  },
  historyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    fontFamily: 'Inter-SemiBold',
  },
  clearHistoryText: {
    color: '#4A90E2',
    fontSize: 14,
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
    fontSize: 15,
    color: '#4A5568',
    fontFamily: 'Inter-Regular',
  },
  deleteHistoryIcon: {
    padding: 4,
  },
});