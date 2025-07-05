import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getCurrentUserUUID } from "@/components/auth-helper";

const db = getFirestore();

type Order = {
  id: string;
  status:
    | "delivered"
    | "pending"
    | "cancelled"
    | "order_ready"
    | "out_for_delivery"
    | "shipped";
  placedDate: string;
  amount: number;
  products: Product[];
  quantity: number; // Assuming you want to keep track of the product quantity
  size: string; // Assuming you want to keep track of the product size
  name: string; // Assuming you want to keep track of the product name
};

type Product = {
  image: any; // can be `ImageSourcePropType` if imported from 'react-native'
};

const YourOrdersScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchOrders = async () => {
    try {
      const uuid = await getCurrentUserUUID();
      if (!uuid) return;

      const ordersQuery = query(
        collection(db, "orders"),
        where("UUID", "==", uuid)
      );
      const orderSnapshot = await getDocs(ordersQuery);
      const wideListingSnapshot = await getDocs(collection(db, "widelisting"));

      // Build a map of product name → image
      const productImageMap: Record<string, string> = {};
      wideListingSnapshot.forEach((doc) => {
        const data = doc.data();
        productImageMap[data.name] = data.image; // assuming `image` is a URL
      });

      const fetchedOrders: Order[] = orderSnapshot.docs
  .map((doc) => {
    const data = doc.data();

    const matchedImageURL = productImageMap[data.item];
    const productImage = matchedImageURL
      ? { uri: matchedImageURL }
      : require("../assets/cement.png");

    const createdAt = data.createdAt.toDate();

    return {
      id: data.OrderID,
      status: data.status,
      placedDate: createdAt.toLocaleString(), // keep this as string for display
      amount: data.total,
      name: data.item,
      size: data.size,
      quantity: data.quantity,
      products: [{ image: productImage }],
      _createdAt: createdAt, // ⬅️ Add this temporarily for sorting
    };
  })
  .sort((a, b) => b._createdAt.getTime() - a._createdAt.getTime()) // ⬅️ sort by createdAt desc
  .map(({ _createdAt, ...rest }) => rest); // ⬅️ remove _createdAt before saving to state


      setOrders(fetchedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const handleOrderPress = (orderId: string) => {
    console.log("Order pressed:", orderId);
    router.push(`/order-details/${orderId}`);
  };

  const renderProductImages = (products: Product[]) => {
    const displayProducts = products.slice(0, 4);
    const showMoreIndicator = products.length > 4;

    return (
      <View style={styles.productImagesContainer}>
        {displayProducts.map((product, index) => (
          <Image
            key={index}
            source={product.image}
            style={styles.productImage}
          />
        ))}

        {showMoreIndicator && <Text style={styles.moreText}>+More</Text>}
      </View>
    );
  };
  const renderOrderItem = (order: Order) => {
    const statusLevels = [
      "pending",
      "order_ready",
      "shipped",
      "out_for_delivery",
      "delivered",
    ];

    return (
      <TouchableOpacity
        key={order.id}
        style={styles.orderCard}
        onPress={() => handleOrderPress(order.id)}
        activeOpacity={0.7}
      >
        {renderProductImages(order.products)}

        <View style={styles.Detailsrow}>
          <View style={styles.orderDetails}>
            <Text>{order.name}</Text>
            <Text style={{ fontSize: 12, color: "#666" }}>
              {order.size}, {order.quantity} pcs
            </Text>

            <View style={styles.orderHeader}>
              <Text style={styles.orderStatus}>
                {order.status
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </Text>

              <Ionicons
                name={
                  order.status === "delivered"
                    ? "checkmark-circle"
                    : order.status === "cancelled"
                    ? "close-circle"
                    : "reload-circle"
                }
                size={16}
                color={
                  order.status === "delivered"
                    ? "#4CAF50"
                    : order.status === "cancelled"
                    ? "#F44336"
                    : "#2196F3"
                }
                style={styles.statusIcon}
              />
            </View>

            <Text style={styles.orderDate}>Placed on {order.placedDate}</Text>
          </View>

          <Text style={styles.orderAmount}>₹ {order.amount.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Orders</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#212652"
          style={{ marginTop: 20 }}
        />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.ordersContainer}>
            {orders.map(renderOrderItem)}
          </View>

          {/* <TouchableOpacity style={styles.loadMoreButton}>
            <Text style={styles.loadMoreText}>Load More</Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color="#212652"
              style={styles.loadMoreIcon}
            />
          </TouchableOpacity> */}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  ordersContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  orderCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  productImagesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#fff",
  },
  Detailsrow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  orderDetails: {
    flex: 1,
    flexDirection: "column",
  },
  moreText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: "800",
    color: "#000000",
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  orderStatus: {
    fontSize: 15,
    fontWeight: "800",
    color: "#222",
  },
  statusIcon: {
    marginLeft: 8,
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },
  orderDate: {
    fontSize: 12,
    color: "#666",
  },
  loadMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: "#0000000D",
    borderRadius: 8,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#212652",
  },
  loadMoreIcon: {
    marginLeft: 4,
  },
});

export default YourOrdersScreen;
