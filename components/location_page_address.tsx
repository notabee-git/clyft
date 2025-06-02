// import React, { useEffect, useState } from "react";
// import { Alert, Platform, TextInput, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
// import * as Location from "expo-location";
// import MapView, { Marker } from "react-native-maps";
// import { useRouter } from "expo-router";
// import { useFonts, OpenSans_400Regular, OpenSans_700Bold } from "@expo-google-fonts/open-sans";
// import { StyleSheet } from "react-native";
// import { useLocationStore } from "./store/useLocationStore"; // Import global store
// import { getCurrentUserUUID } from './auth-helper'; // Import helper function to get current user UUID
// import { doc, setDoc } from "firebase/firestore";
// import { db } from "../firebaseConfig"; // Adjust path as needed

// export default function LocationScreen({ onLocationSelected }) {
//   const router = useRouter();

//   const [location, setLocation] = useState<Location.LocationObject | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [addressData, setAddressData] = useState({
//     street: "",
//     city: "",
//     region: "",
//     postalCode: "",
//     country: "",
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         let { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== "granted") {
//           Alert.alert("Permission denied", "Location access is required.");
//           setLoading(false);
//           return;
//         }

//         let currentLocation = await Location.getCurrentPositionAsync({});
//         setLocation(currentLocation);

//         await updateAddressFields(currentLocation.coords);

//         setLoading(false);
//       } catch (error) {
//         Alert.alert("Error", "Could not fetch location.");
//         setLoading(false);
//       }
//     })();
//   }, []);

//   async function updateAddressFields(coords) {
//     try {
//       const [locationAddress] = await Location.reverseGeocodeAsync(coords);

//       if (locationAddress) {
//         setAddressData({
//           street: locationAddress.street || "",
//           city: locationAddress.city || "",
//           region: locationAddress.region || "",
//           postalCode: locationAddress.postalCode || "",
//           country: locationAddress.country || "",
//         });
//       }
//     } catch {
//       Alert.alert("Error", "Failed to get address from coordinates");
//     }
//   }

//   const handleSearch = async () => {
//     if (!searchQuery.trim()) return;

//     try {
//       const geocodedLocations = await Location.geocodeAsync(searchQuery);
//       if (geocodedLocations.length > 0) {
//         const coords = geocodedLocations[0];
//         setLocation({ coords });
//         await updateAddressFields(coords);
//       } else {
//         Alert.alert("Location not found", "Try a different search.");
//       }
//     } catch {
//       Alert.alert("Error", "Could not perform geocoding.");
//     }
//   };

//   const handleDragEnd = async (e) => {
//     const coords = e.nativeEvent.coordinate;
//     setLocation({ coords });
//     await updateAddressFields(coords);
//   };

//   const handleUseCurrentLocation = () => {
//     if (!location) {
//       Alert.alert("Location not available", "Please try again.");
//       return;
//     }

//     // Prepare data to send back
//     const formAddress = {
//       fullAddress: `${addressData.street}, ${addressData.city}, ${addressData.region}, ${addressData.postalCode}, ${addressData.country}`,
//       pincode: addressData.postalCode,
//       state: addressData.region,
//       city: addressData.city,
//       locality: addressData.street,
//       latitude: location.coords.latitude,
//       longitude: location.coords.longitude,
//     };

//     // You can either:
//     // 1) Pass back via callback prop if using a component: onLocationSelected(formAddress)
//     // 2) Or navigate back with params (if using navigation)
//     // Here, example with router params:
//     router.back(); 
//     // Implement your logic to send this data back to your form screen

//     console.log("Selected Location for Form:", formAddress);
//   };

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" />
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       <TextInput
//         placeholder="Search location"
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//         onSubmitEditing={handleSearch}
//         style={{ /* your existing search input style */ }}
//       />

//       {Platform.OS !== "web" && location && (
//         <MapView
//           style={{ flex: 1 }}
//           region={{
//             latitude: location.coords.latitude,
//             longitude: location.coords.longitude,
//             latitudeDelta: 0.005,
//             longitudeDelta: 0.005,
//           }}
//           showsUserLocation
//         >
//           <Marker
//             coordinate={{
//               latitude: location.coords.latitude,
//               longitude: location.coords.longitude,
//             }}
//             draggable
//             onDragEnd={handleDragEnd}
//           />
//         </MapView>
//       )}

//       <Text>{`${addressData.street}, ${addressData.city}, ${addressData.region}, ${addressData.postalCode}`}</Text>

//       <TouchableOpacity onPress={handleUseCurrentLocation} style={{ /* your existing button styles */ }}>
//         <Text>Use this location</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "flex-end",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   pin: {
//     width: 50,
//     height: 50,
//     resizeMode: "contain",
//     position: "absolute",
//     top: "45%",
//     alignSelf: "center",
//   },
//   searchInput: {
//     width: "90%",
//     padding: 10,
//     backgroundColor: "#f1f1f1",
//     borderRadius: 5,
//     marginTop: 20,
//     fontFamily: "OpenSans_400Regular",
//   },
//   question: {
//     fontFamily: "OpenSans_400Regular",
//     fontSize: 16,
//     marginBottom: 10,
//     backgroundColor: "#fff",
//     paddingHorizontal: 10,
//   },
//   addressText: {
//     fontFamily: "OpenSans_400Regular",
//     fontSize: 14,
//     marginBottom: 20,
//     backgroundColor: "#fff",
//     paddingHorizontal: 10,
//     textAlign: "center",
//   },
//   currentLocationButton: {
//     backgroundColor: "#000",
//     width: "90%",
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   currentLocationText: {
//     color: "#fff",
//     fontFamily: "OpenSans_700Bold",
//     fontSize: 16,
//   },
//   manualLocationButton: {
//     backgroundColor: "#E5E5E5",
//     width: "90%",
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 30,
//   },
//   manualLocationText: {
//     color: "#000",
//     fontFamily: "OpenSans_700Bold",
//     fontSize: 16,
//   },
// });
