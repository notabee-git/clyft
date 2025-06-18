import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Pressable,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useLocationStore } from './store/useLocationStore'; // ✅ Import global store

export default function LocationPicker() {
  const [location, setLocation] = useState<Region | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const router = useRouter();
  const setGlobalLocation = useLocationStore((state) => state.setGlobalCoordinates); // ✅ Set function

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const region = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setLocation(region);
      setMarkerPosition(region);
    })();
  }, []);

  const handleRegionChange = (region: Region) => {
    setMarkerPosition({
      latitude: region.latitude,
      longitude: region.longitude,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {location && (
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={location}
          onRegionChangeComplete={handleRegionChange}
        >
          {markerPosition && (
            <Marker
              draggable
              coordinate={markerPosition}
              onDragEnd={(e) =>
                setMarkerPosition(e.nativeEvent.coordinate)
              }
            />
          )}
        </MapView>
      )}

      <View style={styles.overlay}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => {
            if (markerPosition) {
              setGlobalLocation(markerPosition); // ✅ Save globally
              console.log('Selected Location:', markerPosition);
              router.push('/StoreSelectionScreen'); // ✅ Navigate if needed
            }
          }}
        >
          {({ pressed }) => (
            <Text
              style={[
                styles.buttonText,
                pressed && styles.buttonTextPressed,
              ]}
            >
              Confirm Location
            </Text>
          )}
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push('/Maps')}
        >
          {({ pressed }) => (
            <Text
              style={[
                styles.buttonText,
                pressed && styles.buttonTextPressed,
              ]}
            >
              Enter location manually
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlay: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextPressed: {
    color: '#000',
  },
});
