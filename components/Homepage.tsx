import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons'; // Chevron icon
import { db, collection, getDocs } from "../firebaseConfig";
import { useFonts, OpenSans_400Regular, OpenSans_700Bold, OpenSans_600SemiBold } from '@expo-google-fonts/open-sans';

interface Category {
  name: string;
  image: string;
}

const LOCATIONS = [
  "Tarnaka, Hyderabad, 500019",
  "Madhapur, Hyderabad, 500081",
  "Banjara Hills, Hyderabad, 500034",
];

export default function HomeScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categorySnapshot = await getDocs(collection(db, "categories"));
        const categoriesList = categorySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            name: data.name,
            image: data.image,
          };
        });
        setCategories(categoriesList);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.greenBackground}>
        <View style={styles.header}>
          <View style={styles.leftHeader}>
            <Ionicons name="location-sharp" size={30} color="white" style={{ marginRight: 8 }} />
            <View>
              <Text style={styles.deliveryText}>Delivery to</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.dropdownTrigger}>
                <Text style={styles.locationText} numberOfLines={1}>{selectedLocation}</Text>
                <Ionicons name="chevron-down" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.push("/Cart")}>
          <Ionicons name="cart" size={30} color="white" style={styles.cartIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="green" />
          <TextInput placeholder='Search for "Cement"' style={styles.searchInput} />
        </View>
        <Image
          source={require('../assets/Homepage_img.png')} // Local image
          style={styles.CentreImage}
        />
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Clyft’s Intro Banners</Text>
        </View>
        </View>
        <Text style={styles.sectionTitle}>Shop by category</Text>

        <View style={styles.categoryContainer}>
          {loading ? (
            <Text>Loading categories...</Text>
          ) : categories.length === 0 ? (
            <Text>No categories available</Text>
          ) : (
            categories.slice(0, 3).map((item, idx) => (
              <TouchableOpacity key={idx} onPress={() => {}}>
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

        <TouchableOpacity style={styles.button} onPress={() => router.push("/Categories")}>
          <Text style={styles.text}>See all categories</Text>
          <Feather name="chevron-right" size={18} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Bestsellers</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/Categories")}>
          <Text style={styles.text}>See all products</Text>
          <Feather name="chevron-right" size={18} color="#1A1A2E" />
        </TouchableOpacity>
      </ScrollView>

      <Modal transparent visible={modalVisible} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.dropdown}>
            {LOCATIONS.map((loc) => (
              <TouchableOpacity
                key={loc}
                onPress={() => {
                  setSelectedLocation(loc);
                  setModalVisible(false);
                }}
                style={styles.dropdownItem}
              >
                <Text style={styles.dropdownItemText}>{loc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/Homepage")}> 
          <Text style={styles.navItem}>Home</Text>
         </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/StoreSelectionScreen")}> <Text style={styles.navItem}>🔄 Switch Stores</Text> </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/Categories")}> <Text style={[styles.navItem, { color: "#00B900" }]}>🟢 Categories</Text> </TouchableOpacity>
        <TouchableOpacity> <Text style={styles.navItem}>👤 Account</Text> </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // Header
  header: {
    paddingHorizontal: 0,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
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
  cartIcon: {
    marginLeft: "auto",
  },

  // Search bar
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

  // Banner
  banner: {
    backgroundColor: "#eee",
    height: 100,
    marginHorizontal: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  bannerText: {
    color: "#999",
  },

  // Section title
  sectionTitle: {
    fontSize: 16,
    marginLeft: 16,
    marginTop: 20,
    fontFamily: "OpenSans_700Bold",
  },
  // Categories
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingTop: 16,
    fontFamily: "OpenSans_400Regular",
  },
  categoryItem: {
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 16,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: "OpenSans_600SemiBold",
    textAlign: "center",
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
  },
  navItem: {
    alignItems: "center",
  },

  // Dropdown Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  dropdown: {
    backgroundColor: "white",
    marginHorizontal: 40,
    borderRadius: 6,
    paddingVertical: 10,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 16,
    fontFamily: "OpenSans_700Bold",
  },

  // Green header background
  greenBackground: {
    backgroundColor: "rgb(84, 166, 70)",
    padding: 16,
  },

  // Button
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
  CentreImage:{
    width: "100%",
    height: 150,
    borderRadius: 16,
    marginTop: 10,
  },
});
