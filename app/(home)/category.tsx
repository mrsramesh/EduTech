import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import SearchComponent from '@/components/common/SearchWithFilter';

// Updated dummy category data
const categories = [
  {
    id: '1',
    name: 'Web Development',
    image: 'https://cdn-icons-png.flaticon.com/512/919/919827.png',
  },
  {
    id: '2',
    name: 'Graphic Design',
    image: 'https://cdn-icons-png.flaticon.com/512/1055/1055687.png',
  },
  {
    id: '3',
    name: 'UI/UX Design',
    image: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png',
  },
  {
    id: '4',
    name: 'Photography',
    image: 'https://cdn-icons-png.flaticon.com/512/2922/2922017.png',
  },
  {
    id: '5',
    name: 'Marketing',
    image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  },
  {
    id: '6',
    name: 'Data Science',
    image: 'https://cdn-icons-png.flaticon.com/512/2721/2721290.png',
  },
  {
    id: '7',
    name: 'App Development',
    image: 'https://cdn-icons-png.flaticon.com/512/609/609803.png',
  },
];

export default function Category() {
  const router = useRouter();

  const renderCategoryItem = ({ item }: { item: (typeof categories)[0] }) => (
    <TouchableOpacity
      style={styles.card}
     // onPress={() => router.push('/####')} // Later you can use dynamic ID like `/courselist/${item.id}`
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <SearchComponent /> */}

      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  listContent: {
    paddingBottom: 50,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202244',
    textAlign: 'center',
  },
});
