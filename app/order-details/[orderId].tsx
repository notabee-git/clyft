import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  Clipboard,
  ActivityIndicator,
} from "react-native";
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { db } from "../../firebaseConfig"; // adjust path based on your setup

interface Product {
  id: string;
  name: string;
  dimensions: string;
  price: number;
  mrp: number;
  image: any;
  canExchange: boolean;
  canReturn: boolean;
  deliveryDate: string;
  rating: number;
  quantity: number; // Optional, if you want to track quantity
  isDelivered: boolean;
  status: string;
}

interface OrderData {
  orderId: string;
  product: Product;
  billSummary: {
    total: number;
    gst: number;
    discount: number;
    deliveryFee: number;
    platformFee: number;
    grandTotal: number;
  };
  orderDetails: {
    paymentMethod: string;
    deliveryAddress: string;
    orderPlaced: string;
  };
}

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [productRating, setProductRating] = useState<number>(0);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId) {
          setError("Invalid order ID");
          setLoading(false);
          return;
        }

        // Query the 'orders' collection for documents where 'OrderID' matches 'orderId'
        const ordersRef = collection(db, "orders");
        const productRef = collection(db, "widelisting");
        const q = query(ordersRef, where("OrderID", "==", orderId));
        const querySnapshot = await getDocs(q);
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();
        const q2 = query(productRef, where("name", "==", data.item));
        const querySnapshot2 = await getDocs(q2);
        const docSnap2 = querySnapshot2.docs[0];
        const ProdcutData = docSnap2.data();
        if (querySnapshot.empty) {
          setError("Order not found");
          setLoading(false);
          return;
        }

        // Assuming OrderID is unique, get the first document
        // You can replace this hardcoded product & billing info with fetchedData properties
        const createdAt = data.createdAt.toDate();
        const deliveryDate = new Date(createdAt);
        deliveryDate.setDate(deliveryDate.getDate() + 1);

        const formattedDeliveryDate = deliveryDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        setOrderData({
          orderId: data.OrderID, // Note: make sure Firestore field name is 'OrderID' (case-sensitive)
          product: {
            id: "1",
            name: data.item,
            dimensions: data.size,
            price: data.total,
            mrp: 72000.0,
            image: { uri: ProdcutData.image }, // Fallback image
            canExchange: false,
            canReturn: false,
            deliveryDate: formattedDeliveryDate,
            rating: 0,
            isDelivered: data.status == "delivered",
            quantity: data.quantity,
            status: data.status,
          },
          billSummary: {
            total: data.total,
            gst: data.GST,
            discount: 0,
            deliveryFee: data.delivery_fee,
            platformFee: 2,
            grandTotal: data.total,
          },
          orderDetails: {
            paymentMethod: "UPI",
            deliveryAddress: `${data.Address.flatBuilding}\n${data.Address.locality}\n${data.Address.city}, ${data.Address.state}, ${data.Address.pincode}`,
            orderPlaced: data.createdAt.toDate().toLocaleString(), // Assuming createdAt is a Firestore Timestamp
          },
        });
      } catch (e) {
        setError("Failed to fetch order");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Set initial productRating once orderData loads
  useEffect(() => {
    if (orderData?.product) {
      setProductRating(orderData.product.rating);
    }
  }, [orderData]);

  const handleStarPress = (rating: number) => {
    setProductRating(rating);
  };

  const renderStars = (currentRating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleStarPress(index + 1)}
          style={{ marginRight: 2 }}
        >
          <Ionicons
            name={index < currentRating ? "star" : "star-outline"}
            size={22}
            color={index < currentRating ? "#FFD700" : "#000"}
          />
        </TouchableOpacity>
      ));
  };

  const copyOrderId = async () => {
    if (!orderData) return;

    try {
      await Clipboard.setString(orderData.orderId);
      Alert.alert("Copied", "Order ID copied to clipboard");
    } catch (error) {
      Alert.alert("Error", "Failed to copy order ID");
    }
  };

  const renderProduct = (product: Product) => {
    const currentRating = productRating;
    const hasRating = currentRating > 0;

    return (
      <View key={product.id} style={styles.productCard}>
        {/* Product rendering code remains unchanged */}
        <TouchableOpacity
          style={styles.deliveredBadge}
          onPress={() => {
            if (product.status !== "cancelled") {
              router.push({
                pathname: "/Shipment-Tracking",
                params: { orderId: orderId, imageid: product.image?.uri ?? "" },
              });
            }
          }}
        >
          <Ionicons
            name={
              product.status === "delivered"
                ? "cube-outline"
                : product.status === "cancelled"
                ? "close-circle-outline"
                : "car-outline"
            }
            size={30}
            color={
              product.status === "delivered"
                ? "#038025"
                : product.status === "cancelled"
                ? "#d00"
                : "#FF8C00"
            }
          />

          <View style={styles.deliveredTextContainer}>
            <Text
              style={[
                styles.deliveredText,
                {
                  color:
                    product.status === "delivered"
                      ? "#038025"
                      : product.status === "cancelled"
                      ? "#d00"
                      : "#FF8C00",
                },
              ]}
            >
              {/* Capitalize status text */}
              {product.status
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </Text>

            <Text style={styles.deliveryDate}>
              {product.status === "delivered"
                ? `Delivered on ${product.deliveryDate}`
                : product.status === "cancelled"
                ? `Cancelled`
                : `Expected ${product.deliveryDate}`}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.productInfo}>
          <Image source={product.image} style={styles.productImage} />
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDimensions}>
              Dimensions : {product.dimensions}
            </Text>
            <Text style={styles.productDimensions}>
              Quantity : {product.quantity || 1} pcs
            </Text>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.actionsAndPrice}>
            {product.canExchange || product.canReturn ? (
              <View style={styles.actionButtons}>
                {product.canExchange && (
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Exchange</Text>
                  </TouchableOpacity>
                )}
                {product.canReturn && (
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Return</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <Text style={styles.exchangeNotAvailable}>
                Exchange/Return is not available on this particular product
              </Text>
            )}
            <View style={styles.priceContainer}>
              <Text style={styles.productPrice}>
                ₹{product.price.toFixed(2)}
              </Text>
              <Text style={styles.productMrp}>₹{product.mrp.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.ratingSection}>
            <View style={styles.starsContainer}>
              {renderStars(currentRating)}
            </View>
            <View style={styles.ratingTextContainer}>
              <Text style={styles.rateText}>Rate & Review</Text>
              {hasRating && (
                <TouchableOpacity
                  style={styles.tellUsMore}
                  onPress={() => {
                    // Your review page navigation here
                  }}
                >
                  <Text style={styles.tellUsMoreText}>Tell Us More</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.helpSection}>
          <Ionicons name="chatbubble-outline" size={24} color="#000" />
          <View style={styles.helpText}>
            <Text style={styles.helpTitle}>Need Help with this product ?</Text>
            <Text style={styles.helpSubtitle}>
              Find your issue or chat with us to resolve your issue
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: "red", fontSize: 16 }}>{error}</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 20 }}
        >
          <Text style={{ color: "#007bff" }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!orderData) {
    return null; // or fallback UI if needed
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{orderData.orderId}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderProduct(orderData.product)}

        {/* Bill Summary */}
        <View style={styles.billSummary}>
          <View style={styles.sectionHeader}>
            <Ionicons name="receipt-outline" size={20} color="#000" />
            <Text style={styles.sectionTitle}>Bill Summary</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Total</Text>
            <Text style={styles.billValue}>
              ₹{orderData.billSummary.total.toFixed(2)}
            </Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>GST</Text>
            <Text style={styles.billValue}>
              ₹{orderData.billSummary.gst.toFixed(2)}
            </Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Discount</Text>
            <Text style={styles.billValue}>
              -₹{orderData.billSummary.discount.toFixed(2)}
            </Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={styles.billValue}>
              ₹{orderData.billSummary.deliveryFee.toFixed(2)}
            </Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Platform Fee</Text>
            <Text style={styles.billValue}>
              ₹{orderData.billSummary.platformFee.toFixed(2)}
            </Text>
          </View>

          <View style={styles.billTotalRow}>
            <Text style={styles.billTotalLabel}>Grand Total</Text>
            <Text style={styles.billTotalValue}>
              ₹{orderData.billSummary.grandTotal.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.orderDetails}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#000"
            />
            <Text style={styles.sectionTitle}>Order Details</Text>
          </View>

          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Payment Method</Text>
            <Text style={styles.orderDetailValue}>
              {orderData.orderDetails.paymentMethod}
            </Text>
          </View>
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Delivery Address</Text>
            <Text style={styles.orderDetailValue}>
              {orderData.orderDetails.deliveryAddress}
            </Text>
          </View>
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Order Placed</Text>
            <Text style={styles.orderDetailValue}>
              {orderData.orderDetails.orderPlaced}
            </Text>
          </View>

          <TouchableOpacity
            onPress={copyOrderId}
            style={styles.copyOrderIdButton}
          >
            <Text style={styles.copyOrderIdText}>Copy Order ID</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollView: {
    padding: 16,
  },
  productCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  deliveredBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  deliveredTextContainer: {
    marginLeft: 12,
  },
  deliveredText: {
    fontSize: 14,
    fontWeight: "600",
  },
  deliveryDate: {
    fontSize: 12,
    color: "#666",
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  productDimensions: {
    fontSize: 13,
    color: "#555",
  },
  bottomSection: {
    marginTop: 12,
  },
  actionsAndPrice: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: "row",
  },
  actionButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 10,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  exchangeNotAvailable: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#999",
    maxWidth: "60%",
    paddingHorizontal: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginRight: 8,
  },
  productMrp: {
    fontSize: 14,
    textDecorationLine: "line-through",
    color: "#666",
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  starsContainer: {
    flexDirection: "row",
  },
  ratingTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rateText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  tellUsMore: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  tellUsMoreText: {
    fontSize: 12,
    fontWeight: "600",
  },
  helpSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e7e7e7",
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  helpText: {
    flex: 1,
    marginLeft: 8,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  helpSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  billSummary: {
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 14,
    color: "#444",
  },
  billValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  billTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 12,
  },
  billTotalLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  billTotalValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  orderDetails: {
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 12,
  },
  orderDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderDetailLabel: {
    fontSize: 14,
    color: "#444",
  },
  orderDetailValue: {
    fontSize: 14,
    fontWeight: "600",
    maxWidth: "70%",
    textAlign: "right",
  },
  copyOrderIdButton: {
    marginTop: 16,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#007bff",
    borderRadius: 25,
  },
  copyOrderIdText: {
    color: "#fff",
    fontWeight: "700",
  },
});
