import { Tabs } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { View, Text } from 'react-native';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8e8e93',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarStyle: {
          height: 60,
          borderTopWidth: 1,
          borderTopColor: '#ddd',
          backgroundColor: '#fff',
          elevation: 5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'home') {
            return <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />;
          } else if (route.name === 'mycourse') {
            return <MaterialIcons name={focused ? 'menu-book' : 'menu-book'} size={24} color={color} />;
          } else if (route.name === 'inbox') {
            return <Ionicons name={focused ? 'mail' : 'mail-outline'} size={24} color={color} />;
          } else if (route.name === 'transaction') {
            return <FontAwesome5 name="money-bill-wave" size={22} color={color} />;
          } else if (route.name === 'profile') {
            return <AntDesign name={focused ? 'user' : 'user'} size={24} color={color} />;
          }
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="mycourse" options={{ title: 'My Course' }} />
      <Tabs.Screen name="inbox" options={{ title: 'Inbox' }} />
      <Tabs.Screen name="transaction" options={{ title: 'Transaction' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
