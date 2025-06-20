import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Dimensions, ImageSourcePropType } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const IMAGE_WIDTH = screenWidth * 0.8;
const IMAGE_HEIGHT = (screenHeight * 0.8) / 2;

interface StoreCardProps {
  logo: ImageSourcePropType;
  onPress: () => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ logo, onPress }) => (
  <TouchableOpacity style={styles.logoButton} onPress={onPress} activeOpacity={0.8}>
    <Image
      source={logo}
      style={styles.logo}
      resizeMode="contain"
    />
  </TouchableOpacity>
);

const CombinedSelectionScreen: React.FC = () => {
  const handleStoreSelect = (store: string) => {
    console.log(`Selected store: ${store}`);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
    <View style={styles.container}>
      <StoreCard
        logo={require('../assets/buildstore.png')}
        onPress={() => router.push('/Homepage')}
      />
      <StoreCard
        logo={require('../assets/crew.png')}
        onPress={() => router.push('/Maps')}
        // onPress={() => handleStoreSelect('ClyftCrew')}
      />
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoButton: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 90,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 90,
  },
});

export default CombinedSelectionScreen;
