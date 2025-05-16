import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity,StatusBar,TextInput  } from "react-native";
import { useRouter } from "expo-router";
import { db, collection, getDocs } from "../firebaseConfig"; // Make sure to update path
import { Footer } from "../components/Footer";
import { useFonts, OpenSans_400Regular, OpenSans_700Bold, OpenSans_600SemiBold } from '@expo-google-fonts/open-sans';
import { Ionicons } from "@expo/vector-icons";
interface Category {
  name: string;
  image: string;
}
const TopContainerWithSearch = () => {
  const router = useRouter();
  
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#e6f7ef" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Categories</Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => router.push('/Cart')} 
          style={styles.cartButton}
        >
          <Ionicons name="cart-outline" size={24} color="black" />
          <Text style={styles.cartText}>Cart</Text>
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#4CAF50" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder='Search for "Cement"'
          placeholderTextColor="#666"
        />
      </View>
    </>
  );
};
export default function CategoriesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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

  const renderCategory = ({ item }: { item: Category }) => (
    <View style={styles.categoryItem}>
      <TouchableOpacity onPress={() => router.push({
        pathname: '/subcategories/[categoryName]',
        params: { name: encodeURIComponent(item.name) },
      })}>
        <Image source={{ uri: item.image }} style={styles.categoryImage} resizeMode="cover" />
        <Text style={styles.categoryText}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TopContainerWithSearch/>
      <View style={styles.categoryContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Loading categories...</Text>
        ) : categories.length === 0 ? (
          <Text style={styles.loadingText}>No categories available</Text>
        ) : (
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.name}
            numColumns={3}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.columnWrapper}
          />
        )}
      </View>

      {/* Bottom Navigation */}
      <Footer/>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#e6f7ef",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    fontFamily: "OpenSans_700Bold",
  },
  cartButton: {
    alignItems: "center",
  },
  cartText: {
    fontSize: 12,
    marginTop: -2,
    fontFamily: "OpenSans_700Bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    marginHorizontal: 16,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 12,
    marginTop: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    padding: 0,
    height: 20,
    fontFamily: "OpenSans_400Regular",
  },
  container: { flex: 1, backgroundColor: "white" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 16,
    marginTop: 20,
  },
  categoryContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  gridContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    paddingBottom: 80, // Padding to avoid overlap with bottom nav
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryItem: {
    flex: 1,
    margin: 8,
    alignItems: "center",
  },
  categoryImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    fontFamily: "OpenSans_700Bold",

  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    marginTop: 20,
    fontFamily: "OpenSans_400Regular",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  navItem: {
    fontSize: 12,
    textAlign: "center",
  },
  
});
