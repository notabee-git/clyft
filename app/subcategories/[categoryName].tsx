import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Footer } from "../../components/Footer";
import { CustomHeader } from "../../components/CustomHeader";
interface Subcategory {
  name: string;
  image: string;
}

export default function SubcategoriesScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams(); // category name from route param
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const q = query(collection(db, "subcategories"), where("categoryName", "==", name));
        const snapshot = await getDocs(q);
        const subcatList = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            name: data.name,
            image: data.image,
          };
        });
        setSubcategories(subcatList);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [name]);

  const renderSubcategory = ({ item }: { item: Subcategory }) => (
    <View style={styles.categoryItem}>
          <TouchableOpacity onPress={() => router.push({
            pathname: '/widelisting/[subcategoryName]',
            params: { name : encodeURIComponent(item.name) ,
              // Pass the category name as a parameter
              category: encodeURIComponent(name as string),
            },
          })}>
            <Image source={{ uri: item.image }} style={styles.categoryImage} resizeMode="cover" />
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        </View>
  );

  return (
    <View style={styles.container}>
        <CustomHeader backRoute="/Categories" backTitle="Categories" />
      
      <Text style={styles.sectionTitle}>Subcategories in {name}</Text>

      <View style={styles.categoryContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Loading subcategories...</Text>
        ) : subcategories.length === 0 ? (
          <Text style={styles.loadingText}>No subcategories available</Text>
        ) : (
          <FlatList
            data={subcategories}
            renderItem={renderSubcategory}
            keyExtractor={(item) => item.name}
            numColumns={3}
            contentContainerStyle={styles.gridContainer}
          />
        )}
      </View>

      {/* Bottom Navigation */}
      <Footer/>
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
