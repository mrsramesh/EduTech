// ✅ ProfileScreen.tsx (Fixed)
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const router = useRouter();

  const options = [
    { title: 'Edit Profile', icon: 'edit', screen: 'editprofile' },
    { title: 'Payment Option', icon: 'credit-card', screen: 'PaymentScreen' },
    { title: 'Notifications', icon: 'bell',  },
    { title: 'Security', icon: 'lock', },
    { title: 'Language', icon: 'globe',  },
    // { title: 'Dark Mode', icon: 'moon', screen: 'DarkMode' },
    { title: 'Terms & Conditions', icon: 'file-text',  },
    // { title: 'Help Center', icon: 'help-circle', screen: 'HelpCenter' },
    { title: 'Invite Friends', icon: 'user-plus', screen: 'intivefriends' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Feather name="camera" size={20} color="#4a90e2" />
          </View>
          <Text style={styles.name}>James S. Hernandez</Text>
          <Text style={styles.email}>hernandez.redial@gmail.ac.in</Text>
        </View>

        {options.map(({ title, icon, screen }, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionRow}
            // onPress={() => router.push(`/(profile)/${screen}` as any)}
            onPress={() => {
              if (screen === 'PaymentScreen') {
                router.push(`/(payment)/${screen}` as any);
              } else {
                router.push(`/(profile)/${screen}` as any);
              }
            }}
            
          >
            <Feather name={icon as keyof typeof Feather.glyphMap} size={20} color="#4a4a4a" />
            <Text style={styles.optionText}>{title}</Text>
            <MaterialIcons name="keyboard-arrow-right" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  container: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
    marginBottom: 30,
    elevation: 3,
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#888',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
});
