import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export const CustomHeader = ({
  backRoute,
  backTitle,
}: {
  backRoute?: string;
  backTitle?: string;
}) => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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
        <TouchableOpacity
          style={styles.cartGroup}
          onPress={() => router.push('/Cart')}
        >
          <Ionicons name="cart-outline" size={24} color="#111" />
          <Text style={styles.cartText}>Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#D6F5DD',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#D6F5DD',
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
    fontWeight: '900',
  },
});
