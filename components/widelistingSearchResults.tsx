import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Footer } from "../components/Footer";
import { CustomHeader } from "../components/CustomHeader";
import { fetchSearchData } from "./fetchSearchData";
import Fuse from "fuse.js";
import LiveSearchBar from "./SearchBar"; // ✅ Import your existing component

interface WidelistingItem {
  name: string;
  image: string;
  subcategoryName: string;
}

export default function WidelistingSearchResults() {
  const router = useRouter();
  const { query } = useLocalSearchParams<{ query?: string }>();
  const decodedQuery = query ? decodeURIComponent(query) : "";
  const [searchQuery, setSearchQuery] = useState(decodedQuery);
  const [results, setResults] = useState<WidelistingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndSearch = async () => {
      if (!searchQuery.trim()) return;

      const items = await fetchSearchData();
      const widelistingItems = items.filter((item) => item.type === "widelisting");

      const fuse = new Fuse(widelistingItems, {
        keys: ["name", "subcategoryName", "categoryName"],
        threshold: 0.3,
      });

      const matches = fuse.search(searchQuery).map((r) => r.item);
      setResults(matches);
      setLoading(false);
    };

    fetchAndSearch();
  }, [searchQuery]);

  const renderItem = ({ item }: { item: WidelistingItem }) => (
    <View style={styles.categoryItem}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/Product_page",
            params: {
              name: item.name,
              subcategory: item.subcategoryName,
            },
          })
        }
      >
        <Image
          source={{ uri: item.image }}
          style={styles.categoryImage}
          resizeMode="cover"
        />
        <Text style={styles.categoryText}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomHeader backRoute="/Homepage" backTitle="Search Results" />

      {/* ✅ Use the real live search bar with initial value */}
      <LiveSearchBar
        initialValue={searchQuery}
        onSearch={(newQuery: string) => {
          setSearchQuery(newQuery);
        }}
      />

      <Text style={styles.sectionTitle}>Search Results for "{searchQuery}"</Text>

      <View style={styles.categoryContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : results.length === 0 ? (
          <Text style={styles.loadingText}>No matching products found.</Text>
        ) : (
          <FlatList
            data={results}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            numColumns={3}
            contentContainerStyle={styles.gridContainer}
          />
        )}
      </View>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 16,
    marginTop: 10,
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
});
