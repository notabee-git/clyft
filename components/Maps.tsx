import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Dimensions, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useLocationStore } from "./store/useLocationStore";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Constants from "expo-constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GOOGLE_PLACES_API_KEY =
  Constants.expoConfig?.extra?.GOOGLE_PLACES_API_KEY;

export default function LocationPicker() {
  const [location, setLocation] = useState<Region | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const router = useRouter();
  const setGlobalLocation = useLocationStore(
    (state) => state.setGlobalCoordinates
  );

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
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
      {/* Search Bar */}
      <GooglePlacesAutocomplete
        placeholder="Search for a location"
        fetchDetails
        onPress={(data, details = null) => {
          const loc = details?.geometry?.location;
          if (loc) {
            const region = {
              latitude: loc.lat,
              longitude: loc.lng,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            };
            setLocation(region);
            setMarkerPosition({ latitude: loc.lat, longitude: loc.lng });
            mapRef.current?.animateToRegion(region, 1000);
          }
        }}
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: "en",
        }}
        styles={{
          container: {
            position: "absolute",
            width: "90%",
            top: insets.top + 10, // ✅ DYNAMIC OFFSET
            alignSelf: "center",
            zIndex: 1,
          },
          textInput: {
            height: 44,
            backgroundColor: "#fff",
            borderRadius: 5,
            paddingHorizontal: 10,
            fontSize: 16,
          },
        }}
      />

      {/* Map */}
      {location && (
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          initialRegion={location}
          onRegionChangeComplete={handleRegionChange}
        >
          {markerPosition && (
            <Marker
              draggable
              coordinate={markerPosition}
              onDragEnd={(e) => setMarkerPosition(e.nativeEvent.coordinate)}
            />
          )}
        </MapView>
      )}

      {/* Overlay Buttons */}
      <View style={styles.overlay}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => {
            if (markerPosition) {
              setGlobalLocation(markerPosition);
              console.log("Selected Location:", markerPosition);
              router.push("/StoreSelectionScreen");
            }
          }}
        >
          {({ pressed }) => (
            <Text
              style={[styles.buttonText, pressed && styles.buttonTextPressed]}
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
          onPress={() => router.push("/Maps")}
        >
          {({ pressed }) => (
            <Text
              style={[styles.buttonText, pressed && styles.buttonTextPressed]}
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
    backgroundColor: "transparent",
  },
  overlay: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
    gap: 12,
    backgroundColor: "transparent",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonPressed: {
    backgroundColor: "#fff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextPressed: {
    color: "#000",
  },
});
