import 'react-native-get-random-values'; // Must be first
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';
import { SafeAreaView } from 'react-native-safe-area-context';
const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.GOOGLE_PLACES_API_KEY;
export default function LocationScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const [location, setLocation] = useState<Region | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{ latitude: number; longitude: number } | null>(null);
  const [addressData, setAddressData] = useState({
    street: '',
    city: '',
    region: '',
    postalCode: '',
    country: '',
  });
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
        latitude: formAddress.latitude,
        longitude: formAddress.longitude,
      },
    });
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
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search for a location"
        fetchDetails={true}
        onPress={(data, details = null) => {
          if (details?.geometry?.location) {
            const { lat, lng } = details.geometry.location;
            const region = {
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            };

            setLocation(region);
            setMarkerPosition({ latitude: lat, longitude: lng });
            updateAddressFields({ latitude: lat, longitude: lng });

            // Animate map to the new region
            mapRef.current?.animateToRegion(region, 1000);
          }
        }}
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: 'en',
        }}
        styles={{
          container: {
            position: 'absolute',
            width: '100%',
            zIndex: 1,
          },
          textInput: {
            backgroundColor: '#f0f0f0',
            margin: 10,
            borderRadius: 8,
            paddingHorizontal: 15,
            fontSize: 16,
          },
        }}
        enablePoweredByContainer={false}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={300}
      />

      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={location}
          onRegionChangeComplete={handleRegionChangeComplete}
          showsUserLocation
          provider={PROVIDER_GOOGLE}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
    zIndex: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressBox: {
    padding: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
    elevation: 3,
  },
  addressText: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 14,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
