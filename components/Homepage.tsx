import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Location from "expo-location";

import { db, collection, getDocs } from "../firebaseConfig";
import { Footer } from "../components/Footer";
import { getCurrentUserUUID } from "./auth-helper";
import { useLocationStore } from "./store/useLocationStore";
import LiveSearchBar from "./SearchBar";

interface Category {
  name: string;
  image: string;
}

const uuid = getCurrentUserUUID();

export default function HomeScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isvalidpincode, setisvalidpincode] = useState<boolean>(false);
  // ✅ Refresh logic here
  function validatePincode(postalCode: string | null | undefined): boolean {
  const cleaned = postalCode?.replace(/\s/g, "") || "1";
  return /^\d+$/.test(cleaned) && Number(cleaned) >= 500001 && Number(cleaned) <= 500999;
}



  const refreshHomepage = async () => {
    try {
      setLoading(true);

      // Fetch categories
      const categorySnapshot = await getDocs(collection(db, "categories"));
      const categoriesList = categorySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          name: data.name,
          image: data.image,
        };
      });
      setCategories(categoriesList);

      // Get address from globalCoordinates
      const globalCoordinates = useLocationStore.getState().globalCoordinates;
      if (globalCoordinates) {
        const [location] = await Location.reverseGeocodeAsync({
          latitude: globalCoordinates.latitude,
          longitude: globalCoordinates.longitude,
        });

        if (location) {
          const address = `${location.name || ""}, ${location.city || ""}, ${
            location.postalCode || ""
          }`;
          setisvalidpincode(validatePincode(location.postalCode));
          console.log(isvalidpincode);
          setSelectedLocation(address.trim());
        } else {
          setSelectedLocation(null);
        }
      }
    } catch (err) {
      console.error("❌ Error refreshing Homepage:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Refresh on screen focus (even on back)
  useFocusEffect(
    useCallback(() => {
      console.log("🏠 Homepage focused");
      refreshHomepage();

      return () => {
        console.log("🏃 Leaving Homepage");
      };
    }, [])
  );
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.greenBackground}>
            <View style={styles.header}>
              <View style={styles.leftHeader}>
                <Ionicons
                  name="location-sharp"
                  size={30}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <View>
                  <Text style={styles.deliveryText}>Delivery to</Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (!selectedLocation) {
                        router.push({
                          pathname: "/Maps",
                          params: { from: "Homepage" },
                        });
                      } else {
                        setModalVisible(true);
                      }
                    }}
                    style={styles.dropdownTrigger}
                  >
                    <Text style={styles.locationText} numberOfLines={1}>
                      {selectedLocation || "Select Location"}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={() => router.push("/Cart")}>
                <Ionicons
                  name="cart"
                  size={30}
                  color="white"
                  style={styles.cartIcon}
                />
              </TouchableOpacity>
            </View>

            <LiveSearchBar />

            <Image
              source={require("../assets/Homepage_img.png")}
              style={styles.CentreImage}
            />

            <View style={styles.banner}>
              <Text style={styles.bannerText}>Clyft’s Intro Banners</Text>
            </View>
          </View>

          {!isvalidpincode && (
            <View style={{ padding: 16, alignItems: "center" }}>
              <Text style={{ color: "red", fontSize: 16, fontWeight: "600" }}>
                🚫 Delivery not available in this area
              </Text>
              <Text style={{ color: "#555", marginTop: 8 }}>
                Please select a valid location to explore products.
              </Text>
            </View>
          )}

          {isvalidpincode && (
            <>
              <Text style={styles.sectionTitle}>Shop by category</Text>
              <View style={styles.categoryContainer}>
                {loading ? (
                  <Text>Loading categories...</Text>
                ) : categories.length === 0 ? (
                  <Text>No categories available</Text>
                ) : (
                  categories.slice(0, 3).map((item, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() =>
                        router.push({
                          pathname: "/subcategories/[categoryName]",
                          params: { name: encodeURIComponent(item.name) },
                        })
                      }
                    >
                      <View style={styles.categoryItem}>
                        <Image
                          source={{ uri: item.image }}
                          style={styles.categoryImage}
                          resizeMode="cover"
                        />
                        <Text style={styles.categoryText}>{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/Categories")}
              >
                <Text style={styles.text}>See all categories</Text>
                <Feather name="chevron-right" size={18} color="#1A1A2E" />
              </TouchableOpacity>
              <Text style={styles.sectionTitle}>Bestsellers</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/Categories")}
              >
                <Text style={styles.text}>See all products</Text>
                <Feather name="chevron-right" size={18} color="#1A1A2E" />
              </TouchableOpacity>{" "}
            </>
          )}
        </ScrollView>

        {/* Modal for current location */}
        {selectedLocation && (
          <Modal transparent visible={modalVisible} animationType="fade">
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPressOut={() => setModalVisible(false)}
            >
              <View style={styles.modalCenteredView}>
                <View style={styles.dropdown}>
                  <Text style={styles.locationInModal}>
                    📍 {selectedLocation || "No location selected"}
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      router.push({
                        pathname: "/Maps",
                        params: { from: "Homepage" },
                      });
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text style={styles.dropdownItemText}>Change Location</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        )}

        { isvalidpincode && ( <>  <Footer />  </>)}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  greenBackground: { backgroundColor: "rgb(84, 166, 70)", padding: 16 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftHeader: { flexDirection: "row", alignItems: "center", flex: 1 },
  deliveryText: {
    fontSize: 16,
    color: "white",
    fontFamily: "OpenSans_400Regular",
  },
  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: 250,
  },
  locationText: {
    fontSize: 16,
    color: "white",
    marginRight: 4,
    fontFamily: "OpenSans_700Bold",
  },
  cartIcon: { marginLeft: "auto" },

  searchContainer: {
    backgroundColor: "#f5f5f5",
    margin: 2,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "OpenSans_400Regular",
    flex: 1,
  },

  banner: {
    backgroundColor: "#eee",
    height: 100,
    marginHorizontal: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  bannerText: { color: "#999" },

  sectionTitle: {
    fontSize: 16,
    marginLeft: 16,
    marginTop: 20,
    fontFamily: "OpenSans_700Bold",
  },

  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingTop: 16,
  },
  categoryItem: {
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 16,
  },
  categoryImage: { width: 80, height: 80, borderRadius: 10, marginBottom: 8 },
  categoryText: {
    fontSize: 14,
    fontFamily: "OpenSans_600SemiBold",
    textAlign: "center",
  },

  button: {
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 12,
    width: "95%",
  },
  text: {
    color: "#1A1A2E",
    fontSize: 16,
    fontWeight: "500",
    marginRight: 6,
    fontFamily: "OpenSans_700Bold",
  },
  CentreImage: {
    width: "100%",
    height: 150,
    borderRadius: 16,
    marginTop: 10,
  },
  dropdown: {
    backgroundColor: "white",
    marginHorizontal: 40,
    borderRadius: 6,
    paddingVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCenteredView: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  locationInModal: {
    fontSize: 14,
    color: "#4b5563", // Tailwind gray-600
    marginBottom: 10,
    fontFamily: "OpenSans_700Bold",
    textAlign: "center",
  },

  dropdownItem: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  dropdownItemText: {
    fontSize: 16,
    fontFamily: "OpenSans_700Bold",
    color: "black",
  },
});
