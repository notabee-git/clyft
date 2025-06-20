import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Footer } from "../../components/Footer";
import { CustomHeader } from "../../components/CustomHeader";
interface WideItem {
  name: string;
  image: string;
}

export default function WidelistingScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams(); // subcategory name from route param
  const {category} = useLocalSearchParams(); // category name from route param
  const [widelisting, setWidelisting] = useState<WideItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWidelisting = async () => {
      try {
        const q = query(collection(db, "widelisting"), where("subcategoryName", "==", name));
        const snapshot = await getDocs(q);
        const wideList = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            name: data.name,
            image: data.image,
          };
        });
        setWidelisting(wideList);
      } catch (error) {
        console.error("Error fetching widelisting:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWidelisting();
  }, [name]);

  const renderItem = ({ item }: { item: WideItem }) => (
    <View style={styles.categoryItem}>
      <TouchableOpacity
        onPress={() => {
          router.push({ 
            pathname: "/Product_page", 
            params: { 
              name: item.name,
              //subcategory name is taken from the route params
              // so we can use it directly

              subcategory: name as string,
            } 
          });
        }}
      >
        <Image source={{ uri: item.image }} style={styles.categoryImage} resizeMode="cover" />
        <Text style={styles.categoryText}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
    <CustomHeader
      // backRoute={{
      //   pathname: '/subcategories/name',
      //   params: { name: encodeURIComponent(name) },
      // }}
      backTitle={category as string}
  />

      <Text style={styles.sectionTitle}>Items in {name}</Text>

      <View style={styles.categoryContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Loading items...</Text>
        ) : widelisting.length === 0 ? (
          <Text style={styles.loadingText}>No items available</Text>
        ) : (
          <FlatList
            data={widelisting}
            renderItem={renderItem}
            keyExtractor={(item) => item.name}
            numColumns={3}
            contentContainerStyle={styles.gridContainer}
          />
        )}
      </View>
        <Footer/>
      {/* Bottom Navigation */}
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingTop: 10,
  },
  gridContainer: {
    paddingBottom: 60,
  },
  categoryItem: {
    flex: 1,
    margin: 8,
    alignItems: "center",
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    marginTop: 20,
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
