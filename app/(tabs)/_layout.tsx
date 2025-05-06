import { Tabs } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { View, Text } from 'react-native';

// Color palette
const COLORS = {
  primary: '#7F56D9',
  inactive: '#667085',
  background: '#FFFFFF',
  border: '#F2F4F7',
};

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
        tabBarStyle: {
          height: 64,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          backgroundColor: COLORS.background,
          elevation: 2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'home') {
            return <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />;
          } else if (route.name === 'mycourse') {
            return <MaterialIcons name={focused ? 'book' : 'book'} size={24} color={color} />;
          } else if (route.name === 'inbox') {
            return <Ionicons name={focused ? 'mail' : 'mail-outline'} size={24} color={color} />;
          } else if (route.name === 'transaction') {
            return <FontAwesome5 name="receipt" size={22} color={color} />;
          } else if (route.name === 'profile') {
            return <AntDesign name={focused ? 'user' : 'user'} size={24} color={color} />;
          }
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="mycourse" options={{ title: 'My Courses' }} />
      <Tabs.Screen name="inbox" options={{ title: 'Inbox' }} />
      <Tabs.Screen name="transaction" options={{ title: 'Transactions' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}