import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

export default function LocationScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<Region | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{ latitude: number; longitude: number } | null>(null);
  const [addressData, setAddressData] = useState({
    street: '',
    city: '',
    region: '',
    postalCode: '',
    country: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is required.');
        setLoading(false);
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
      setMarkerPosition({ latitude: region.latitude, longitude: region.longitude });

      await updateAddressFields(loc.coords);
      setLoading(false);
    })();
  }, []);

  const updateAddressFields = async (coords: { latitude: number; longitude: number }) => {
    try {
      const [locationAddress] = await Location.reverseGeocodeAsync(coords);
      if (locationAddress) {
        setAddressData({
          street: locationAddress.street || '',
          city: locationAddress.city || '',
          region: locationAddress.region || '',
          postalCode: locationAddress.postalCode || '',
          country: locationAddress.country || '',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get address from coordinates');
    }
  };

  const handleRegionChangeComplete = (region: Region) => {
    const coords = {
      latitude: region.latitude,
      longitude: region.longitude,
    };
    setMarkerPosition(coords);
    updateAddressFields(coords);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const geocoded = await Location.geocodeAsync(searchQuery);
      if (geocoded.length > 0) {
        const { latitude, longitude } = geocoded[0];
        const region = {
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        setLocation(region);
        setMarkerPosition({ latitude, longitude });
        await updateAddressFields({ latitude, longitude });
      } else {
        Alert.alert('Location not found', 'Try a different search.');
      }
    } catch {
      Alert.alert('Error', 'Could not perform geocoding.');
    }
  };

  const handleConfirmLocation = () => {
    if (!markerPosition) {
      Alert.alert('Location not available', 'Please try again.');
      return;
    }

    const formAddress = {
      fullAddress: `${addressData.street}, ${addressData.city}, ${addressData.region}, ${addressData.postalCode}, ${addressData.country}`,
      pincode: addressData.postalCode,
      state: addressData.region,
      city: addressData.city,
      locality: addressData.street,
      latitude: markerPosition.latitude,
      longitude: markerPosition.longitude,
    };

    router.push({
      pathname: '/AddNewAddress',
      params: {
        pincode: formAddress.pincode,
        state: formAddress.state,
        city: formAddress.city,
        locality: formAddress.locality,
        latitude: formAddress.latitude.toString(),
        longitude: formAddress.longitude.toString(),
      },
    });

    console.log('Navigating with address:', formAddress);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search for a location"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        style={styles.searchInput}
      />

      {location && (
        <MapView
          style={styles.map}
          initialRegion={location}
          onRegionChangeComplete={handleRegionChangeComplete}
          showsUserLocation
        >
          {markerPosition && (
            <Marker
              coordinate={markerPosition}
              draggable
              onDragEnd={(e) => {
                const coords = e.nativeEvent.coordinate;
                setMarkerPosition(coords);
                updateAddressFields(coords);
              }}
            />
          )}
        </MapView>
      )}

      <View style={styles.addressBox}>
        <Text style={styles.addressText}>
          {`${addressData.street}, ${addressData.city}, ${addressData.region}, ${addressData.postalCode}`}
        </Text>
      </View>

      <TouchableOpacity onPress={handleConfirmLocation} style={styles.confirmButton}>
        <Text style={styles.buttonText}>Use this location</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  searchInput: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    margin: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressBox: {
    padding: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    margin: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
