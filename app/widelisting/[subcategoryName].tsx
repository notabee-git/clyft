import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons, AntDesign, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Footer } from "../../components/Footer";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { CustomHeader } from "../../components/CustomHeader";

interface Product {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  variants:number;
}

const WideProductListing = () => {
  const router = useRouter();
  const { name } = useLocalSearchParams(); // subcategory
  const { category } = useLocalSearchParams(); // category
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("name-asc");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [modalType, setModalType] = useState("filter");
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const filterOptions = [
    { label: "All Products", value: "All" },
    { label: "Karimnagar Bricks", value: "Karimnagar" },
    { label: "Maharashtra Bricks", value: "Maharashtra" },
  ];

  const sortOptions = [
    { label: "Price (Low to High)", value: "price-asc" },
    { label: "Price (High to Low)", value: "price-desc" },
    { label: "Name (A-Z)", value: "name-asc" },
    { label: "Name (Z-A)", value: "name-desc" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(
          collection(db, "widelisting"),
          where("subcategoryName", "==", name)
        );
        const snapshot = await getDocs(q);
        const items: Product[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            image: data.image,
            rating: data.rating || 4.5,
            reviews: data.reviews || 10,
            price: data.bestSellingPrice || 10,
            originalPrice: data.originalPrice || 13,
            variants:data.variants?.length || 0,
          };
        });
        setProducts(items);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [name]);

  // Filtering and sorting
  let filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  if (filter !== "All") {
    filteredProducts = filteredProducts.filter((p) => p.name.includes(filter));
  }
  if (sort === "name-asc") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "name-desc") {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sort === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const rows = [];
  for (let i = 0; i < filteredProducts.length; i += 2) {
    rows.push(filteredProducts.slice(i, i + 2));
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {/* Header */}
      <CustomHeader backTitle="Categories" />

      {/* Search & Filters */}
      <View style={styles.containerBottom}>
        <View style={styles.searchcontainer}>
          <Ionicons
            name="search"
            size={20}
            color="#0A7B48"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder='Search for "Cement"'
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.filtersContainer}>
          {/* <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              setModalType("filter");
              setDropdownVisible(true);
            }}
          >
            <Feather name="filter" size={16} color="#0A7B48" />
            <Text style={styles.filterButtonText}>Filters</Text>
            <Feather name="chevron-down" size={14} color="#666" />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              setModalType("sort");
              setDropdownVisible(true);
            }}
          >
            <Feather name="arrow-up" size={16} color="#0A7B48" />
            <Text style={styles.filterButtonText}>Sort</Text>
            <Feather name="chevron-down" size={14} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Dropdown Modal */}
        <Modal
          visible={dropdownVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setDropdownVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setDropdownVisible(false)}
            activeOpacity={1}
          >
            <View style={styles.dropdownMenu}>
              <View style={styles.dropdownHeader}>
                <Text style={styles.dropdownTitle}>
                  {modalType === "filter"
                    ? "Select Filter"
                    : "Select Sort Option"}
                </Text>
                <TouchableOpacity onPress={() => setDropdownVisible(false)}>
                  <AntDesign name="close" size={20} color="#333" />
                </TouchableOpacity>
              </View>
              {(modalType === "filter" ? filterOptions : sortOptions).map(
                (option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.dropdownItem,
                      ((modalType === "filter" && filter === option.value) ||
                        (modalType === "sort" && sort === option.value)) &&
                        styles.dropdownItemSelected,
                    ]}
                    onPress={() => {
                      if (modalType === "filter") {
                        setFilter(option.value);
                      } else {
                        setSort(option.value);
                      }
                      setDropdownVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        ((modalType === "filter" && filter === option.value) ||
                          (modalType === "sort" && sort === option.value)) &&
                          styles.dropdownItemTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {((modalType === "filter" && filter === option.value) ||
                      (modalType === "sort" && sort === option.value)) && (
                      <AntDesign name="check" size={18} color="#0A7B48" />
                    )}
                  </TouchableOpacity>
                )
              )}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Product Grid */}
        <ScrollView style={styles.scrollView}>
          <View style={styles.productGrid}>
            {loading ? (
              <Text style={{ padding: 20 }}>Loading...</Text>
            ) : (
              rows.map((row, rowIdx) => (
                <View style={styles.productRow} key={rowIdx}>
                  {row.map((product) => (
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/Product_page",
                          params: {
                            name: product.name,
                            subcategory: name as string,
                          },
                        })
                      }
                      style={styles.productCardContainer}
                      key={product.id}
                    >
                      <View style={styles.productCard}>
                        <Image
                          source={{ uri: product.image }}
                          style={styles.productImage}
                          resizeMode="contain"
                        />
                        <Text style={styles.productName}>{product.name}</Text>
                        <View style={styles.ratingContainer}>
                          <View style={styles.ratingBadge}>
                            <Text style={styles.ratingText}>
                              ★ {product.rating}
                            </Text>
                          </View>
                          <Text style={styles.reviewCount}>
                            ({product.reviews})
                          </Text>
                        </View>
                        <View style={styles.priceContainer}>
                          <Text style={styles.price}>₹{product.price}/pc</Text>
                          <Text style={styles.originalPrice}>
                            ₹₹{(product.price * 1.15).toFixed(2)}
                          </Text>
                        </View>
                        <Text>{product.variants} variants available</Text>
                        <TouchableOpacity
                          style={styles.addtoCartButton}
                          onPress={() =>
                            router.push({
                              pathname: "/Product_page",
                              params: {
                                name: product.name,
                                subcategory: name as string,
                              },
                            })
                          }
                        >
                          <Text style={styles.addtoCartText}>View</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                  {row.length === 1 && (
                    <View style={styles.productCardContainer} />
                  )}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  containerBottom: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#DDF8E6",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    flex: 1,
    marginLeft: 8,
  },
  cartContainer: {
    alignItems: "center",
  },
  cartButton: {
    position: "relative",
  },
  cartText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
    marginRight: -5,
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    backgroundColor: "#333",
    width: 18,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  searchcontainer: {
    flexDirection: "row",
    backgroundColor: "#edf7ed",
    alignItems: "center",
    borderRadius: 15,
    paddingHorizontal: 20,
    height: 50,
    marginHorizontal: 12,
    marginTop: 4,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#d0e8d0",
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    paddingHorizontal: 5,
    color: "#000",
    includeFontPadding: false,
  },
  filtersContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    backgroundColor: "#fff",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  filterButtonText: {
    marginHorizontal: 4,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  dropdownMenu: {
    backgroundColor: "white",
    borderRadius: 8,
    width: "90%",
    marginTop: 130,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemSelected: {
    backgroundColor: "#f0f8f0",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownItemTextSelected: {
    color: "#0A7B48",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  productGrid: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  productCardContainer: {
    width: "48%",
  },
  productCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: 130,
    height: 130,
    borderRadius: 10,
    backgroundColor: "black",
    alignSelf: "center",
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingBadge: {
    backgroundColor: "#0A7B48",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 3,
  },
  ratingText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  reviewCount: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
  },
  originalPrice: {
    fontSize: 12,
    color: "#666",
    textDecorationLine: "line-through",
    marginLeft: 4,
    marginTop: 4,
  },
  addtoCartButton: {
    borderWidth: 1.5,
    borderColor: "#0A7B48",
    borderRadius: 8,
    paddingVertical: 5,
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#fff",
    marginHorizontal: 8,
  },
  addtoCartText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 14,
  },
  helpText: {
    textAlign: "center",
    color: "#666",
    fontSize: 10,
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  helpLink: {
    color: "blue",
    fontStyle: "italic",
  },
});

export default WideProductListing;
