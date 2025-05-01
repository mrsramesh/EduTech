import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const DrawerContent = (props: any) => {
  const router = useRouter();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color="#4C51BF" />
          </View>
          <View>
            <Text style={styles.name}>Teacher Name</Text>
            <Text style={styles.email}>teacher@example.com</Text>
          </View>
        </View>
      </View>

      <DrawerItemList {...props} />

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => {
          router.replace('/(auth)/login');
          props.navigation.closeDrawer();
        }}
      >
        <Ionicons name="log-out" size={20} color="#718096" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E9D8FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  email: {
    fontSize: 14,
    color: '#718096',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginTop: 'auto',
    marginBottom: 20,
    marginLeft: 10,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#718096',
  },
});

export default DrawerContent;