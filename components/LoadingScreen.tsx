import { View, Image, StyleSheet } from 'react-native';

export default function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Image source={require('../assets/loading.png')} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  image: {
    width: 350, // Adjust as needed
    height: 350, // Adjust as needed
    resizeMode: 'contain',
  },
});
