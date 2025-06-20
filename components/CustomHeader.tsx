import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export const CustomHeader = ({ backRoute, backTitle }: { backRoute?: string; backTitle?: string }) => {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        {/* Back Section */}
        <TouchableOpacity
          style={styles.backGroup}
          onPress={() => (backRoute ? router.push(backRoute) : router.back())}
        >
          <Ionicons name="chevron-back" size={24} color="#111" />
          <Text style={styles.backTitle}>{backTitle}</Text>
        </TouchableOpacity>

        {/* Cart Section */}
        <TouchableOpacity style={styles.cartGroup} onPress={() => router.push('/Cart')}>
          <Ionicons name="cart-outline" size={24} color="#111" />
          <Text style={styles.cartText}>Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#D6F5DD', // Light green like your screenshot
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 44,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111',
    marginLeft: 4,
  },
  cartGroup: {
    alignItems: 'center',
  },
  cartText: {
    fontSize: 15,
    color: '#111',
    marginTop: 2,
    //make it bold
    fontWeight: '900',
  },
});
