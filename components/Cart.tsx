import React, { useMemo, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useCart } from "@/context/cartContext";

export default function CartScreen() {
  const router = useRouter();
  const steps = ["Cart", "Address", "Payment"];
  const currentStep = 0; // 0 = Cart, 1 = Address, 2 = Payment
  const { cart, incrementItem, decrementItem, removeItem, address } = useCart();
  const flatListRef = useRef<FlatList>(null);

  // Calculate billing breakdown
  const { Total, GST, Discount, DeliveryFee, PlatformFee, GrandTotal } =
    useMemo(() => {
      const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const gst = +(total * 0.18).toFixed(2); // Calculate 18% GST

      // Discount logic placeholder (redundant currently)
      const discount = cart.reduce((sum, item) => {
        if (item.price && item.price > item.price) {
          return sum + (item.price - item.price) * item.quantity;
        }
        return sum;
      }, 0);

      const deliveryFee = 20;
      const platformFee = 20;
      const grandTotal = +(
        total +
        gst +
        deliveryFee +
        platformFee -
        discount
      ).toFixed(2);

      return {
        Total: total,
        GST: gst,
        Discount: discount,
        DeliveryFee: deliveryFee,
        PlatformFee: platformFee,
        GrandTotal: grandTotal,
      };
    }, [cart]);
  // console.log(address);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Go back to Homepage */}
      <TouchableOpacity onPress={() => router.back()} style={styles.header}>
        <Feather name="arrow-left" size={22} color="#222" />
        <Text style={styles.headerTitle}>Your Cart</Text>
      </TouchableOpacity>
      {/* Checkout progress indicator */}
      <View style={styles.stepper}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <React.Fragment key={step}>
              {/* Dot */}
              <View
                style={[
                  styles.dot,
                  isCompleted && styles.dotCompleted,
                  isActive && styles.dotActive,
                ]}
              />
              {/* Label */}
              <Text
                style={[
                  styles.label,
                  isCompleted || isActive
                    ? styles.labelActive
                    : styles.labelInactive,
                ]}
              >
                {step}
              </Text>

              {/* Line */}
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.line,
                    index < currentStep
                      ? styles.lineActive
                      : styles.lineInactive,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
      {/* Delivery address section */}
      {/* <View style={styles.addressContainer}>
        <View style={styles.addressRow}>
          <Text>
            Deliver to: <Text style={styles.addressName}>Sathwik, 500019</Text>
          </Text>
          <TouchableOpacity onPress={() => router.push("/Select_address")}>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>
      </View> */}
      {/* Coupons & Offers section */}
      <TouchableOpacity style={styles.couponButton}>
        <Feather name="shopping-cart" size={18} color="#0C8744" />
        <Text style={styles.couponButtonText}> Items in cart</Text>
      </TouchableOpacity>
      {/* Cart Items list */}
      {cart.length > 0 ? (
        <>
          <FlatList
            ref={flatListRef}
            data={cart}
            keyExtractor={(item, index) => item.product.name + index}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() =>
                        router.push({
                          pathname: "/Product_page",
                          params: {
                            name: item.product.name,
                            subcategory: item.product.subcategoryName as string,
                          },
                        })
                      }>
                <View style={{ flexDirection: "row" }}>
                  {/* Product Image */}
                  <Image
                    source={{
                      uri:
                        item.product.image || "https://via.placeholder.com/100",
                    }}
                    style={styles.itemImage}
                  />

                  {/* Product Details */}
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.itemName}>{item.product.name}</Text>
                    <Text>{item.product.variants[item.variantIndex].size}</Text>

                    {/* Quantity Controls */}
                    <View style={styles.qtyRow}>
                      <Text style={styles.qtyLabel}>Qty:</Text>
                      <TouchableOpacity
                        onPress={() =>
                          decrementItem(item.product.name, item.variantIndex)
                        }
                        style={styles.qtyButton}
                      >
                        <Text>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyValue}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          incrementItem(item.product.name, item.variantIndex)
                        }
                        style={styles.qtyButton}
                      >
                        <Text>+</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Price Details */}
                    <View style={styles.priceRow}>
                      <Text style={styles.itemPrice}>
                        ₹{item.price.toFixed(2)}
                      </Text>

                      {/* Discount Display (inactive due to same price logic) */}
                      {/* {item.price && item.price > item.price && (
                        <>
                          <Text style={styles.itemOriginalPrice}>
                            ₹{item.price.toFixed(2)}
                          </Text>
                          <Text style={styles.itemDiscount}>
                            (
                            {Math.round(
                              ((item.price - item.price) / item.price) * 100
                            )}
                            % off)
                          </Text>
                        </>
                      )} */}
                    </View>

                    {/* Save for later & Remove actions */}
                    <View style={styles.actionRow}>
                      {/* <TouchableOpacity style={styles.outlinedButton}>
                        <Feather name="bookmark" size={16} color="#0C8744" />
                        <Text style={styles.outlinedButtonTextGreen}>
                          Save for Later
                        </Text>
                      </TouchableOpacity> */}
                      <TouchableOpacity
                        style={styles.outlinedButton}
                        onPress={() =>
                          removeItem(item.product.name, item.variantIndex)
                        }
                      >
                        <Feather name="trash-2" size={16} color="#D32F2F" />
                        <Text style={styles.outlinedButtonTextRed}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListFooterComponent={
              <View style={styles.billSummary}>
                <Text style={styles.billHeader}>Bill Summary</Text>
                <View style={styles.billRow}>
                  <Text>Total</Text>
                  <Text>₹{Total.toFixed(2)}</Text>
                </View>
                {/* <View style={styles.billRow}>
                  <Text>GST</Text>
                  <Text>₹{GST.toFixed(2)}</Text>
                </View> */}
                <View style={styles.billRow}>
                  <Text>Discount</Text>
                  <Text>-₹{Discount.toFixed(2)}</Text>
                </View>
                <View style={styles.billRow}>
                  <Text>Delivery Fee</Text>
                  <Text>₹{DeliveryFee.toFixed(2)}</Text>
                </View>
                <View style={styles.billRow}>
                  <Text>Platform Fee</Text>
                  <Text>₹{PlatformFee.toFixed(2)}</Text>
                </View>

                <View style={styles.separatorLine} />

                <View style={styles.billRow}>
                  <Text style={styles.grandTotal}>Grand Total</Text>
                  <Text style={styles.grandTotal}>
                    ₹{GrandTotal.toFixed(2)}
                  </Text>
                </View>
              </View>
            }
          />

          {/* Sticky Footer */}
          <View style={styles.footerBar}>
            <View style={{ flex: 1 }}>
              <Text style={styles.totalAmount}>₹{GrandTotal.toFixed(2)}</Text>
              <TouchableOpacity
                onPress={() =>
                  flatListRef.current?.scrollToEnd({ animated: true })
                }
              >
                <Text style={styles.viewDetailsTotal}>View Details</Text>
              </TouchableOpacity>
            </View>

            {/* Right side: Place Order */}
            <TouchableOpacity
              style={styles.placeOrderButton}
              onPress={() => router.push("/Delivery_estimate")}
            >
              <Text style={styles.placeOrderText}>Place Order</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>🛒 Your cart is empty</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  footerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },

  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d1d5db", // gray
    marginHorizontal: 4,
  },

  dotCompleted: {
    backgroundColor: "#0C8744",
    shadowColor: "#0C8744",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },

  dotActive: {
    backgroundColor: "#0C8744",
    borderWidth: 1,
    borderColor: "#0C8744",
  },

  label: {
    fontSize: 11,
    marginRight: 6,
    marginLeft: 2,
  },

  labelActive: {
    color: "#0C8744",
    fontWeight: "600",
  },

  labelInactive: {
    color: "#9ca3af",
  },

  line: {
    width: 20,
    height: 1.5,
    marginHorizontal: 2,
    marginBottom: 2,
  },

  lineActive: {
    backgroundColor: "#0C8744",
  },

  lineInactive: {
    backgroundColor: "#d1d5db",
  },

  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },

  emptyCartText: {
    fontSize: 18,
    color: "#555",
    fontWeight: "600",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 19,
    color: "#222",
    marginLeft: 14,
  },
  progressBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 2,
  },
  progressActive: {
    color: "#0C8744",
    fontWeight: "bold",
    fontSize: 15,
  },
  progressInactive: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 15,
  },
  progressArrowActive: {
    marginHorizontal: 6,
    color: "#0C8744",
  },
  progressArrowInactive: {
    marginHorizontal: 6,
    color: "#000",
  },
  addressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f6f6f6",
  },
  addressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressName: {
    fontWeight: "bold",
    color: "#222",
  },
  changeText: {
    color: "#D32F2F",
    fontWeight: "bold",
    fontSize: 14,
  },
  couponButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
  },
  couponButtonText: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#222",
  },
  card: {
    backgroundColor: "#f6f6f6",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    resizeMode: "contain",
    backgroundColor: "#f3f3f3",
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
    marginBottom: 1,
  },
  itemDesc: {
    fontSize: 10,
    color: "#666",
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
  },
  itemPrice: {
    color: "#0C8744",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
  },
  itemOriginalPrice: {
    color: "#888",
    textDecorationLine: "line-through",
    fontSize: 14,
    marginRight: 6,
  },
  itemDiscount: {
    color: "#D32F2F",
    fontSize: 13,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 2,
  },
  qtyLabel: {
    fontSize: 10,
    color: "#222",
    fontWeight: "500",
    marginRight: 8,
  },
  qtyButton: {
    borderWidth: 1,
    borderColor: "#0C8744",
    borderRadius: 6,
    padding: 2,
    marginHorizontal: 4,
    backgroundColor: "#fff",
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyValue: {
    fontWeight: "bold",
    fontSize: 10,
    color: "#222",
    minWidth: 38,
    textAlign: "center",
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap", // allow buttons to wrap on small screens
    gap: 10, // optional: better spacing than marginRight
    marginTop: 8,
  },
  outlinedButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    marginBottom: 6, // in case button wraps to next line
  },
  outlinedButtonTextGreen: {
    color: "#0C8744",
    fontWeight: "bold",
    fontSize: 10,
    marginLeft: 6,
  },
  outlinedButtonTextRed: {
    color: "#D32F2F",
    fontWeight: "bold",
    fontSize: 10,
    marginLeft: 6,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  totalAmount: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#222",
    marginRight: 16,
  },
  viewDetailsTotal: {
    color: "#0C8744",
    textDecorationLine: "underline",
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 1,
  },
  placeOrderButton: {
    backgroundColor: "#111",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginLeft: "auto",
  },
  placeOrderText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  billSummary: {
    backgroundColor: "#f6f6f6",
    borderRadius: 10,
    margin: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eee",
  },
  billHeader: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: "#222",
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
    fontSize: 14,
  },
  separatorLine: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },
  grandTotal: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
  },
});
