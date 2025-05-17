import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from '../../context/cartContext'; // Adjust the path if needed

export default function Layout() {
  return (
    <SafeAreaProvider>
      <CartProvider>
            <Tabs>
              <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} />
              {/* <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} /> }} /> */}
            </Tabs>
      </CartProvider>
    </SafeAreaProvider>

  );
}
