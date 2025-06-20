import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  Feather,
  AntDesign,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useCart } from "../context/cartContext";
import { getAuth } from "firebase/auth";
import { auth } from "../firebaseConfig"; // your Firebase config file
import { placeOrder } from "../utils/place_orders_in_cart"; // adjust path as needed
import { Alert } from "react-native";
export default function PaymentScreen() {
  const { cart, totalAmount, address, clearCart } = useCart();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("savedCard");
  const [expanded, setExpanded] = useState({
    upi: false,
    card: false,
    netBanking: false,
    emi: false,
    wallets: false,
    payLater: false,
  });

  const toggleExpand = (section: keyof typeof expanded) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePlaceOrder = async () => {
    const user =  auth.currentUser;
    if (!user) {
      Alert.alert("Not logged in", "Please login to place your order.");
      return;
    }
    try {
      if (!address) {
        console.error("Address is null");
        return;
      }
      await placeOrder(cart, user.uid, address, clearCart);
      Alert.alert("Success", "Order placed successfully!");
      // router.replace('/OrderConfirmation');
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to place order. Try again.");
    }
  };

  // Dummy Data
  const Total = 100;
  const GST = 18;
  const Discount = 0;
  const DeliveryFee = 20;
  const PlatformFee = 20;
  const GrandTotal = 200;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <TouchableOpacity
          onPress={() => router.replace("/Delivery_estimate")}
          style={styles.header}
        >
          <Feather name="arrow-left" size={22} color="#222" />
          <Text style={styles.headerTitle}>Payment</Text>
        </TouchableOpacity>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <Text style={styles.progressActive}> </Text>
          <AntDesign
            name="arrowright"
            size={18}
            style={styles.progressArrowActive}
          />
          <Text style={styles.progressActive}>Cart</Text>
          <AntDesign
            name="arrowright"
            size={18}
            style={styles.progressArrowActive}
          />
          <Text style={styles.progressActive}>Address</Text>
          <AntDesign
            name="arrowright"
            size={18}
            style={styles.progressArrowActive}
          />
          <Text style={styles.progressActive}>Payment</Text>
        </View>
        <View style={styles.cardSeparator} />
        {/* Bank Offer */}
        <View style={styles.offerContainer}>
          <Ionicons
            name="gift-outline"
            size={26}
            color="#000"
            style={styles.iconMargin}
          />
          <View style={styles.offerTextContainer}>
            <Text style={styles.offerTitle}>Bank Offer</Text>
            <Text style={styles.offerDescription}>
              10% Instant Discount on Federal Bank Credit and Debit Cards on a
              min spend of ₹3,000. T&CA
            </Text>
            <TouchableOpacity>
              <Text style={styles.showMore}>
                Show More{" "}
                <Ionicons name="chevron-down" size={12} color="#8e44ad" />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.cardSeparator} />
        {/* Saved Payment Options */}
        <Text style={styles.sectionHeader}>SAVED PAYMENT OPTIONS</Text>
        <View style={styles.cardSeparator} />
        {/* ICICI Card */}
        <TouchableOpacity
          style={[
            styles.paymentOption,
            selectedPaymentMethod === "savedCard" && styles.selectedOption,
          ]}
          onPress={() => setSelectedPaymentMethod("savedCard")}
        >
          <View style={styles.radioButtonContainer}>
            <View style={styles.radioButton}>
              {selectedPaymentMethod === "savedCard" && (
                <View style={styles.radioButtonSelected} />
              )}
            </View>
          </View>
          <View style={styles.paymentMethodDetails}>
            <View style={styles.rowBetween}>
              <Text style={styles.paymentMethodTitle}>ICICI Credit Card</Text>
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png",
                }}
                style={styles.cardLogo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.cardNumber}>**** 4002</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.cardSeparator} />
        {/* PhonePe */}
        <TouchableOpacity
          style={[
            styles.paymentOption,
            selectedPaymentMethod === "savedUPI" && styles.selectedOption,
          ]}
          onPress={() => setSelectedPaymentMethod("savedUPI")}
        >
          <View style={styles.radioButtonContainer}>
            <View style={styles.radioButton}>
              {selectedPaymentMethod === "savedUPI" && (
                <View style={styles.radioButtonSelected} />
              )}
            </View>
          </View>
          <View style={styles.paymentMethodDetails}>
            <View style={styles.rowBetween}>
              <Text style={styles.cardNumber}>8008687540@ybl</Text>
              <View style={styles.phonePeLogoContainer}>
                <Text style={styles.phonePeText}>₹</Text>
              </View>
            </View>
            <Text style={styles.paymentMethodTitle}>PADIGELA SATHWIK</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.cardSeparator} />
        {/* Online Payment Options */}
        <Text style={styles.sectionHeader}>ONLINE PAYMENT OPTIONS</Text>
        <View style={styles.cardSeparator} />
        {/* UPI */}
        <TouchableOpacity
          style={styles.paymentOptionCollapsible}
          onPress={() => toggleExpand("upi")}
        >
          <View style={styles.paymentMethodRow}>
            <Ionicons
              name="phone-portrait-outline"
              size={24}
              color="#666"
              style={styles.iconMargin}
            />
            <Text style={styles.paymentMethodTitle}>
              UPI (Pay using any App or UPI ID)
            </Text>
            <Ionicons
              name={expanded.upi ? "chevron-up" : "chevron-down"}
              size={24}
              color="#666"
              style={styles.expandIcon}
            />
          </View>
        </TouchableOpacity>

        {expanded.upi && (
          <View style={styles.expandedOptions}>
            {["sathwik@ybl", "john.doe@oksbi", "randomuser@okaxis"].map(
              (upiId) => (
                <TouchableOpacity
                  key={upiId}
                  style={[
                    styles.paymentOption,
                    selectedPaymentMethod === upiId && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedPaymentMethod(upiId)}
                >
                  <View style={styles.radioButtonContainer}>
                    <View style={styles.radioButton}>
                      {selectedPaymentMethod === upiId && (
                        <View style={styles.radioButtonSelected} />
                      )}
                    </View>
                  </View>
                  <View style={styles.paymentMethodDetails}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.paymentMethodTitle}>{upiId}</Text>
                      <View style={styles.phonePeLogoContainer}>
                        <Text style={styles.phonePeText}>₹</Text>
                      </View>
                    </View>
                    <Text style={styles.cardNumber}>Dummy UPI Name</Text>
                  </View>
                </TouchableOpacity>
              )
            )}
          </View>
        )}
        <View style={styles.cardSeparator} />
        {/* Credit/Debit Card */}
        <TouchableOpacity
          style={styles.paymentOptionCollapsible}
          onPress={() => toggleExpand("card")}
        >
          <View style={styles.paymentMethodRow}>
            <Ionicons
              name="card-outline"
              size={24}
              color="#666"
              style={styles.iconMargin}
            />
            <Text style={styles.paymentMethodTitle}>Credit/Debit Card</Text>
            <Ionicons
              name={expanded.card ? "chevron-up" : "chevron-down"}
              size={24}
              color="#666"
              style={styles.expandIcon}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.cardSeparator} />
        {/* Net Banking */}
        <TouchableOpacity
          style={styles.paymentOptionCollapsible}
          onPress={() => toggleExpand("netBanking")}
        >
          <View style={styles.paymentMethodRow}>
            <MaterialIcons
              name="account-balance"
              size={24}
              color="#666"
              style={styles.iconMargin}
            />
            <Text style={styles.paymentMethodTitle}>Net Banking</Text>
            <Ionicons
              name={expanded.netBanking ? "chevron-up" : "chevron-down"}
              size={24}
              color="#666"
              style={styles.expandIcon}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.cardSeparator} />
        {/* EMI */}
        <TouchableOpacity
          style={styles.paymentOptionCollapsible}
          onPress={() => toggleExpand("emi")}
        >
          <View style={styles.paymentMethodRow}>
            <FontAwesome
              name="calendar"
              size={22}
              color="#666"
              style={styles.iconMargin}
            />
            <Text style={styles.paymentMethodTitle}>EMI</Text>
            <Ionicons
              name={expanded.emi ? "chevron-up" : "chevron-down"}
              size={24}
              color="#666"
              style={styles.expandIcon}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.cardSeparator} />
        {/* Wallets */}
        <TouchableOpacity
          style={styles.paymentOptionCollapsible}
          onPress={() => toggleExpand("wallets")}
        >
          <View style={styles.paymentMethodRow}>
            <Feather
              name="credit-card"
              size={22}
              color="#666"
              style={styles.iconMargin}
            />
            <Text style={styles.paymentMethodTitle}>Wallets</Text>
            <Ionicons
              name={expanded.wallets ? "chevron-up" : "chevron-down"}
              size={24}
              color="#666"
              style={styles.expandIcon}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.cardSeparator} />
        {/* Pay Later */}
        <TouchableOpacity
          style={styles.paymentOptionCollapsible}
          onPress={() => toggleExpand("payLater")}
        >
          <View style={styles.paymentMethodRow}>
            <MaterialIcons
              name="schedule"
              size={24}
              color="#666"
              style={styles.iconMargin}
            />
            <Text style={styles.paymentMethodTitle}>Pay Later</Text>
            <Ionicons
              name={expanded.payLater ? "chevron-up" : "chevron-down"}
              size={24}
              color="#666"
              style={styles.expandIcon}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.cardSeparator} />
        {/* Cash on Delivery */}
        <Text style={styles.sectionHeader}>PAY ON DELIVERY OPTION</Text>
        <View style={styles.cardSeparator} />
        <TouchableOpacity
          style={[
            styles.paymentOption,
            selectedPaymentMethod === "cashOnDelivery" && styles.selectedOption,
          ]}
          onPress={() => setSelectedPaymentMethod("cashOnDelivery")}
        >
          <View style={styles.radioButtonContainer}>
            <View style={styles.radioButton}>
              {selectedPaymentMethod === "cashOnDelivery" && (
                <View style={styles.radioButtonSelected} />
              )}
            </View>
          </View>
          <View style={styles.paymentMethodDetails}>
            <Text style={styles.paymentMethodTitle}>
              Cash on Delivery (Cash/UPI/Cheque/Other)
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.cardSeparator} />
        {/* Payment Summary */}
        <View style={styles.amountContainer}>
          <View>
            <Text style={styles.amountText}>₹{GrandTotal}</Text>
            <TouchableOpacity>
              <Text style={styles.viewDetails}>VIEW DETAILS</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.payNowButton}
            onPress={handlePlaceOrder}
          >
            <Text style={styles.payNowText}>PAY NOW</Text>
          </TouchableOpacity>
        </View>

        {/* Bill Summary */}
        <View style={styles.billSummary}>
          <Text style={styles.billHeader}>Bill Summary</Text>
          <View style={styles.billRow}>
            <Text>Total</Text>
            <Text>₹{Total}</Text>
          </View>
          <View style={styles.billRow}>
            <Text>GST</Text>
            <Text>₹{GST}</Text>
          </View>
          <View style={styles.billRow}>
            <Text>Discount</Text>
            <Text>-₹{Discount}</Text>
          </View>
          <View style={styles.billRow}>
            <Text>Delivery Fee</Text>
            <Text>₹{DeliveryFee}</Text>
          </View>
          <View style={styles.billRow}>
            <Text>Platform Fee</Text>
            <Text>₹{PlatformFee}</Text>
          </View>
          <View style={styles.separatorLine} />
          <View style={styles.billRow}>
            <Text style={styles.grandTotal}>Grand Total</Text>
            <Text style={styles.grandTotal}>₹{GrandTotal}</Text>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  offerContainer: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  offerTextContainer: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  offerDescription: {
    fontSize: 10,
    color: "#333",
    marginBottom: 4,
  },
  showMore: {
    fontSize: 12,
    color: "#8e44ad",
    fontWeight: "500",
  },
  sectionHeader: {
    padding: 16,
    backgroundColor: "#fff",
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  paymentOption: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedOption: {
    backgroundColor: "#f0f0ff",
  },
  radioButtonContainer: {
    justifyContent: "center",
    marginRight: 12,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#8e44ad",
  },
  paymentMethodDetails: {
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  cardNumber: {
    color: "#666",
    marginTop: 4,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLogo: {
    width: 50,
    height: 20,
  },
  phonePeLogoContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#5f27cd",
    alignItems: "center",
    justifyContent: "center",
  },
  phonePeText: {
    color: "white",
    fontWeight: "bold",
  },
  paymentOptionCollapsible: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  paymentMethodRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconMargin: {
    marginRight: 16,
  },
  expandIcon: {
    marginLeft: "auto",
  },
  amountContainer: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginVertical: 8,
  },
  amountText: {
    fontSize: 18,
    fontWeight: "700",
  },
  viewDetails: {
    fontSize: 12,
    color: "#8e44ad",
    marginTop: 4,
  },
  payNowButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  payNowText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomPadding: {
    height: 40,
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
  collapsibleContent: {
    padding: 16,
    backgroundColor: "#fdfdfd",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    borderTopColor: "#ccc",
    borderTopWidth: 1,
  },
  dummyText: {
    fontSize: 13,
    color: "#444",
    marginBottom: 4,
  },
  expandedOptions: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  cardSeparator: {
    borderBottomColor: "#bcc0c4",
    borderBottomWidth: 2,
    marginVertical: 0,
  },
});
