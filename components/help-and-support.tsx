import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firebaseApp } from '../firebaseConfig'; // 👈 Import initialized Firebase app

// Initialize Firestore and Auth
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

// Main Help & Support screen component
const HelpSupportScreen = () => {
  const [orders, setOrders] = useState<any[]>([]); // Stores list of fetched orders
  const [loading, setLoading] = useState(true);    // Loading state for API call

  // Fetch user orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return; // Exit if not logged in

        // Create query to fetch orders for current user ordered by creation time
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc') // Sorting from latest to oldest
        );

        const querySnapshot = await getDocs(q);
        const fetchedOrders: any[] = [];

        // Process each document in result
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedOrders.push({
            id: doc.id, // Unique document ID
            status: data.items?.[0]?.status || 'pending', // Fallback if status is missing
            placedDate: new Date(data.createdAt.seconds * 1000).toLocaleString(), // Convert timestamp to readable date
            amount: data.total,
            image: require('../assets/cement.png'), // Placeholder image
          });
        });

        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error); // Error logging
      } finally {
        setLoading(false); // Hide loader
      }
    };

    fetchOrders();
  }, []);

  // Open phone dialer with prefilled number
  const handleCall = () => Linking.openURL('tel:8008687540');

  // Open email app with prefilled email
  const handleEmail = () => Linking.openURL('mailto:sathwikpadigela@gmail.com');

  // Go back to previous screen
  const handleGoBack = () => router.back();

  // Render a single order card
  const renderOrderItem = (order: any, idx: any) => (
    <View
      key={order.id}
      style={[
        styles.orderCard,
        { marginBottom: idx === orders.length - 1 ? 0 : 16 }, // Space between cards
      ]}
    >
      <Image source={order.image} style={styles.orderImage} />
      <View style={styles.orderDetails}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderStatus}>
            {order.status === 'cancelled' ? 'Order Cancelled' : 'Order Delivered'}
          </Text>
          <Ionicons
            name={order.status === 'delivered' ? 'checkmark-circle' : 'close-circle'}
            size={16}
            color={order.status === 'delivered' ? '#4CAF50' : '#9E9E9E'}
            style={styles.statusIcon}
          />
        </View>
        <Text style={styles.orderDate}>Placed on {order.placedDate}</Text>
      </View>
      <Text style={styles.orderAmount}>₹ {order.amount.toFixed(2)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
        </View>

        {/* Order section */}
        <Text style={styles.sectionTitle}>Get Help on Orders</Text>

        {/* Loading indicator or orders list */}
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <View style={styles.ordersContainer}>
            {orders.length > 0 ? (
              orders.map(renderOrderItem)
            ) : (
              <Text>No orders found.</Text>
            )}
          </View>
        )}

        {/* See all orders button */}
        <TouchableOpacity style={styles.seeAllBtn}>
          <Text style={styles.seeAllText}>See all orders</Text>
          <Text style={styles.seeAllArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* FAQs section */}
        <Text style={styles.sectionTitle}>FAQs</Text>

        <TouchableOpacity style={styles.faqItem}>
          <Text style={styles.faqText}>Payment Related</Text>
          <Text style={styles.faqArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.faqItem}>
          <Text style={styles.faqText}>Product Related</Text>
          <Text style={styles.faqArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Customer Care section */}
        <Text style={styles.customerCareTitle}>Customer Care</Text>

        <View style={styles.customerCareContainer}>
          <TouchableOpacity onPress={handleCall}>
            <Text style={styles.phoneNumber}>Call us @ 8008687540</Text>
          </TouchableOpacity>
          <Text style={styles.orText}>or</Text>
          <TouchableOpacity onPress={handleEmail}>
            <Text style={styles.emailAddress}>mail us @ sathwikpadigela@gmail.com</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 16,
    marginLeft: 20,
  },
  ordersContainer: {
    marginBottom: 8,
    marginLeft: 20,
    marginRight: 20,
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  orderImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 16,
  },
  orderDetails: {
    flex: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderStatus: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: 8,
  },
  statusIcon: {
    marginLeft: 6,
  },
  deliveredDot: {
    backgroundColor: '#4CAF50',
  },
  cancelledDot: {
    backgroundColor: '#9E9E9E',
  },
  orderDate: {
    fontSize: 10,
    color: '#666',
  },
  orderAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
  seeAllBtn: {
    backgroundColor: '#f6f6f6',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    marginTop: 16,
    marginBottom: 16,
    marginLeft: 10,
    marginRight: 10,
  },
  seeAllText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  seeAllArrow: {
    fontSize: 24,
    color: '#333',
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 20,
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    backgroundColor: '#f6f6f6',
    paddingHorizontal: 16,
  },
  faqText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  faqArrow: {
    fontSize: 24,
    color: '#888',
  },
  customerCareContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  customerCareTitle: {
    fontSize: 18,
    color: '#222',
    fontWeight: '600',
    marginBottom: 16,
    marginLeft: 20,
  },
  phoneNumber: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '400',
  },
  emailAddress: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '400',
  },
  orText: {
    fontSize: 14,
    color: '#888',
    marginVertical: 8,
  },
});

export default HelpSupportScreen;