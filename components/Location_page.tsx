import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";

export default function LocationScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission denied", "Location access is required.");
          setLoading(false);
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);

        // Reverse geocode to get the address
        const [locationAddress] = await Location.reverseGeocodeAsync(currentLocation.coords);
        setAddress(locationAddress ? `${locationAddress.street}, ${locationAddress.city}, ${locationAddress.region}` : "Address not found");

        setLoading(false);
      } catch (error) {
        Alert.alert("Error", "Could not fetch location.");
        setLoading(false);
      }
    })();
  }, []);

  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;
  
    try {
      const geocodedLocation = await Location.geocodeAsync(searchQuery);
      if (geocodedLocation.length > 0) {
        const { latitude, longitude } = geocodedLocation[0];
  
        // Construct the required LocationObjectCoords
        const newLocation = {
          coords: {
            latitude,
            longitude,
            altitude: 0, // Default value
            accuracy: 1, // Default value
            altitudeAccuracy: 1, // Default value
            heading: 0, // Default value
            speed: 0, // Default value
          },
          timestamp: Date.now(),
        };
  
        setLocation(newLocation);
  
        // Reverse geocode to get the address
        const [locationAddress] = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        setAddress(locationAddress ? `${locationAddress.street}, ${locationAddress.city}, ${locationAddress.region}` : "Address not found");
      } else {
        Alert.alert("Location not found", "Please try a different search.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not fetch location.");
    }
  };
  

  // Update location and address when pin is dragged
  const handleDragEnd = async (e: any) => {
    const newLocation = e.nativeEvent.coordinate;
    setLocation({
      coords: newLocation,
      timestamp: Date.now(),
    });

    const [locationAddress] = await Location.reverseGeocodeAsync(newLocation);
    setAddress(locationAddress ? `${locationAddress.street}, ${locationAddress.city}, ${locationAddress.region}` : "Address not found");
  };

  const handleUseCurrentLocation = () => {
    if (location) {
      console.log("Selected Location:", location.coords);
      router.push("/Homepage");
    } else {
      Alert.alert("Location not available", "Please try again.");
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a location"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />

      {Platform.OS !== "web" && location && (
        <MapView
          style={styles.map}
          region={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          showsUserLocation={true}
          provider={PROVIDER_GOOGLE}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
            draggable
            onDragEnd={handleDragEnd} // Handle pin drag
          />
        </MapView>
      )}

      <Image source={require("../assets/image-pin.png")} style={styles.pin} />

      <Text style={styles.question}>Where do you want your Service?</Text>

      <Text style={styles.addressText}>{address}</Text> {/* Display selected address */}

      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={handleUseCurrentLocation}
      >
        <Text style={styles.currentLocationText} >At my current location</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.manualLocationButton}
        // onPress={handleManualEntry}
      >
        <Text style={styles.manualLocationText}>
          I’ll enter my location manually
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  pin: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    position: "absolute",
    top: "45%",
    alignSelf: "center",
  },
  searchInput: {
    width: "90%",
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
    marginTop: 20,
    fontFamily: "OpenSans_400Regular",
  },
  question: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  addressText: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 14,
    marginBottom: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    textAlign: "center",
  },
  currentLocationButton: {
    backgroundColor: "#000",
    width: "90%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  currentLocationText: {
    color: "#fff",
    fontFamily: "OpenSans_700Bold",
    fontSize: 16,
  },
  manualLocationButton: {
    backgroundColor: "#E5E5E5",
    width: "90%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  manualLocationText: {
    color: "#000",
    fontFamily: "OpenSans_700Bold",
    fontSize: 16,
  },
});
