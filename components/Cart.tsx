import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const router = useRouter();  

  const [cartItems] = useState([
    {
      name: 'Karimnagar Red Bricks',
      description: 'Description of Karimnagar Red Bricks',
      price: 12500,
      originalPrice: 15000,
      discount: 15.7,
      quantity: 5000,
      image: require('../assets/cement.png'),
    },
    {
      name: 'Karimnagar Red Bricks',
      description: 'Description of Karimnagar Red Bricks',
      price: 12500,
      originalPrice: 15000,
      discount: 15.7,
      quantity: 5000,
      image: require('../assets/cement.png'),
    },
  ]);

  const Total = 100;
  const GST = 18;
  const Discount = 0;
  const DeliveryFee = 20;
  const PlatformFee = 20;
  const GrandTotal = 200;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Header */}
        <TouchableOpacity onPress={() => router.replace('/Homepage')} style={styles.header}>
          <Feather name="arrow-left" size={22} color="#222" />
          <Text style={styles.headerTitle}>Your Cart</Text>
        </TouchableOpacity>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <Text style={styles.progressActive}>                 </Text>
          <AntDesign name="arrowright" size={18} style={styles.progressArrowActive} />
          <Text style={styles.progressActive}>Cart</Text>
          <AntDesign name="arrowright" size={18} style={styles.progressArrowInactive} />
          <Text style={styles.progressInactive}>Address</Text>
          <AntDesign name="arrowright" size={18} style={styles.progressArrowInactive} />
          <Text style={styles.progressInactive}>Payment</Text>
        </View>

        {/* Address */}
        <View style={styles.addressContainer}>
          <View style={styles.addressRow}>
            <Text>
              Deliver to: <Text style={styles.addressName}>Sathwik, 500019</Text>
            </Text>
            <TouchableOpacity onPress={() => router.push('/Select_address')}>
                <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Coupons & Offers */}
        <TouchableOpacity style={styles.couponButton}>
          <Feather name="gift" size={18} color="#0C8744" />
          <Text style={styles.couponButtonText}>  Coupons & Offers</Text>
        </TouchableOpacity>

        {/* Cart Items */}
        {cartItems.map((item, index) => (
        <View key={index} style={styles.card}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={item.image} style={styles.itemImage} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDesc}>{item.description}</Text>
              <View style={styles.qtyRow}>
                <Text style={styles.qtyLabel}>Qty:</Text>
                <Text style={styles.qtyValue}>{item.quantity}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.itemPrice}>₹{item.price}</Text>
                <Text style={styles.itemOriginalPrice}>₹{item.originalPrice}</Text>
                <Text style={styles.itemDiscount}>({item.discount}% off)</Text>
              </View>

              {/* Action Row */}
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.outlinedButton}>
                  <Feather name="bookmark" size={16} color="#0C8744" />
                  <Text style={styles.outlinedButtonTextGreen}>Save for Later</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.outlinedButton}>
                  <Feather name="trash-2" size={16} color="#D32F2F" />
                  <Text style={styles.outlinedButtonTextRed}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      ))}


        {/* Total and Place Order */}
        <View style={styles.totalRow}>
          <Text style={styles.totalAmount}>₹{Total}</Text>
          
          <TouchableOpacity style={styles.placeOrderButton}>
            <Text style={styles.placeOrderText} onPress={() => router.push('/Delivery_estimate')}>Place Order</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
            <Text style={styles.viewDetailsTotal}>View Details</Text>
        </TouchableOpacity>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 19,
    color: '#222',
    marginLeft: 14,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 2,
  },
  progressActive: {
    color: '#0C8744',
    fontWeight: 'bold',
    fontSize: 15,
  },
  progressInactive: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
  },
  progressArrowActive: {
    marginHorizontal: 6,
    color: '#0C8744',
  },
  progressArrowInactive: {
    marginHorizontal: 6,
    color: '#000',
  },
  addressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f6f6f6',
  },
  addressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressName: {
    fontWeight: 'bold',
    color: '#222',
  },
  changeText: {
    color: '#D32F2F',
    fontWeight: 'bold',
    fontSize: 14,
  },
  couponButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
  },
  couponButtonText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  card: {
    backgroundColor: '#f6f6f6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    resizeMode: 'contain',
    backgroundColor: '#f3f3f3',
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginBottom: 1,
  },
  itemDesc: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  itemPrice: {
    color: '#0C8744',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  itemOriginalPrice: {
    color: '#888',
    textDecorationLine: 'line-through',
    fontSize: 14,
    marginRight: 6,
  },
  itemDiscount: {
    color: '#D32F2F',
    fontSize: 13,
  },
  viewDetails: {
    color: '#0C8744',
    textDecorationLine: 'underline',
    fontSize: 14,
    marginBottom: 7,
    marginTop: 2,
    marginLeft: 16,
    alignSelf: 'flex-start',
    fontWeight: '500',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 2,
  },
  qtyLabel: {
    fontSize: 10,
    color: '#222',
    fontWeight: '500',
    marginRight: 8,
  },
  qtyButton: {
    borderWidth: 1,
    borderColor: '#0C8744',
    borderRadius: 6,
    padding: 2,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    fontWeight: 'bold',
    fontSize: 10,
    color: '#222',
    minWidth: 38,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  outlinedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  outlinedButtonTextGreen: {
    color: '#0C8744',
    fontWeight: 'bold',
    fontSize: 10,
    marginLeft: 6,
  },
  outlinedButtonTextRed: {
    color: '#D32F2F',
    fontWeight: 'bold',
    fontSize: 10,
    marginLeft: 6,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#222',
    marginRight: 16,
  },
  viewDetailsTotal: {
    color: '#0C8744',
    textDecorationLine: 'underline',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 16,
  },
  placeOrderButton: {
    backgroundColor: '#111',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginLeft: 'auto',
  },
  placeOrderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  billSummary: {
    backgroundColor: '#f6f6f6',
    borderRadius: 10,
    margin: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#eee',
  },
  billHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#222',
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
    fontSize: 14,
  },
  separatorLine: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  grandTotal: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
  },
});
