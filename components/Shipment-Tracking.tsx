import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firebaseApp } from "@/firebaseConfig"; // Adjust path if needed

const ShipmentTrackingScreen = () => {
  const router = useRouter();
  const { orderId, imageid } = useLocalSearchParams();
  const imageUrl = typeof imageid === "string" ? imageid : "";

  const db = getFirestore(firebaseApp);
  console.log(orderId);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const q = query(
          collection(db, "orders"),
          where("OrderID", "==", orderId)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setOrder(querySnapshot.docs[0].data());
        } else {
          console.warn("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  const steps = [
    {
      label: "Ordered",
      date: order?.createdAt?.toDate()?.toDateString(),
      icon: "shopping-cart",
    },
    {
      label: "Order ready",
      date: order?.createdAt?.toDate()?.toDateString(),
      icon: "box",
    },
    {
      label: "Shipped",
      date: order?.createdAt?.toDate()?.toDateString(),
      icon: "truck",
    },
    {
      label: "Out for delivery",
      date: order?.delivery_date?.toDate()?.toDateString(),
      icon: "truck-loading",
    },
    {
      label: "Delivered",
      date: order?.delivery_date?.toDate()?.toDateString(),
      icon: "box-open",
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Order not found</Text>
      </SafeAreaView>
    );
  }
  const statusLevels = [
    "pending",
    "order_ready",
    "shipped",
    "out_for_delivery",
    "delivered",
  ];
  const statusIndex = statusLevels.indexOf(order?.status || "pending");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Delivery Status</Text>
        </View>

        {/* Product Info */}
        <View style={styles.productContainer}>
          <Image
            source={{ uri: imageUrl || "https://via.placeholder.com/100" }}
            style={styles.productImage}
          />

          <View>
            <Text style={styles.productTitle}>{order.item}</Text>
            <Text style={styles.productSubtitle}>Size: {order.size}</Text>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.timelineContainer}>
          {steps.map((step, index) => {
            const isCompleted = index <= statusIndex;

            return (
              <View key={index} style={styles.stepRow}>
                <View style={styles.timelineColumn}>
                  <View
                    style={[
                      styles.checkIcon,
                      { backgroundColor: isCompleted ? "#0C8744" : "#ccc" },
                    ]}
                  >
                    {isCompleted && (
                      <Feather name="check" size={12} color="#fff" />
                    )}
                  </View>
                  {index < steps.length - 1 && (
                    <View
                      style={[
                        styles.verticalLine,
                        {
                          backgroundColor:
                            index < statusIndex ? "#0C8744" : "#ccc",
                        },
                      ]}
                    />
                  )}
                </View>

                <View style={styles.contentColumn}>
                  <View
                    style={[
                      styles.iconCircle,
                      {
                        borderColor: isCompleted ? "#0C8744" : "#ccc",
                        backgroundColor: isCompleted ? "#E6F3EB" : "#eee",
                      },
                    ]}
                  >
                    <FontAwesome5
                      name={step.icon as any}
                      size={16}
                      color={isCompleted ? "#0C8744" : "#888"}
                    />
                  </View>
                  <View>
                    <Text style={styles.stepTitle}>{step.label}</Text>
                    {/* Optional: Add dates if you want */}
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Cancel Button */}
        <TouchableOpacity
          style={[
            styles.cancelButton,
            statusIndex >= 2 && { backgroundColor: "#ccc" }, // ✅ greyed out
          ]}
          disabled={statusIndex > 2} // ✅ disables the touch
          onPress={() => {
            if (statusIndex <= 2) {
              // your cancel logic here
            }
          }}
        >
          <Text
            style={[
              styles.cancelButtonText,
              statusIndex > 2 && { color: "#888" }, // ✅ dull text
            ]}
          >
            Cancel Order
          </Text>
        </TouchableOpacity>
        {/* ✅ Conditional message below */}
{statusIndex >= 2 && (
  <Text style={styles.cancelNotice}>
    Order has been shipped and can't be canceled now.
  </Text>
)}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShipmentTrackingScreen;

const styles = StyleSheet.create({
    cancelNotice: {
  marginTop: 8,
  textAlign: "center",
  color: "#ff4444",
  fontSize: 14,
  fontStyle: "italic",
},
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 16,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productSubtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  timelineContainer: {
    paddingLeft: 8,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  timelineColumn: {
    width: 30,
    alignItems: "center",
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  verticalLine: {
    width: 2,
    height: 50,
    backgroundColor: "#000",
    marginTop: 2,
  },
  contentColumn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#0C8744",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#E6F3EB",
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "500",
  },
  stepDate: {
    fontSize: 13,
    color: "#555",
  },
  cancelButton: {
    marginTop: 24,
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
