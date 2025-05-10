import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} /> }} />
    </Tabs>
  );
}
