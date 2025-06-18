import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import { useCart } from '@/context/cartContext';

export default function EstimateScreen() {
  const router = useRouter();
  const [address, setAddress] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { cart } = useCart();

  const db = getFirestore();
  const auth = getAuth();

  const deliveryItems = [
    {
      image: require('../assets/cement.png'),
      estimatedDelivery: '15 Apr 2025',
    },
    {
      image: require('../assets/cement.png'),
      estimatedDelivery: '15 Apr 2025',
    },
  ];

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log('No user logged in');
          return;
        }

        const userDocRef = doc(db, 'Users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setAddress({
            name: userData.name || '',
            mobile: userData.number || '',
            addressLines: userData.address?.[0]
              ? [
                  userData.address[0].street || '',
                  userData.address[0].area || '',
                  `${userData.address[0].city || ''}, ${userData.address[0].state || ''}, ${userData.address[0].pincode || ''}`,
                ]
              : [],
          });
        } else {
          console.log('User document does not exist');
        }
      } catch (error) {
        console.error('Failed to fetch address:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAddress();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32, backgroundColor: '#fff' }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/Cart')}>
            <Feather name="arrow-left" size={22} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Address</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <Text style={styles.progressActive}>                 </Text>
          <AntDesign name="arrowright" size={18} style={styles.progressArrowActive} />
          <Text style={styles.progressActive}>Cart</Text>
          <AntDesign name="arrowright" size={18} style={styles.progressArrowActive} />
          <Text style={styles.progressActive}>Address</Text>
          <AntDesign name="arrowright" size={18} style={styles.progressArrowInactive} />
          <Text style={styles.progressInactive}>Payment</Text>
        </View>
        <View style={styles.cardSeparator} />

        {/* Address Block */}
        <View style={styles.addressListContainer}>
          <View style={styles.addressDetailsContainer}>
            <View style={styles.addressHeaderRow}>
              <Text style={styles.addressName}>{address?.name}</Text>
              <TouchableOpacity onPress={() => router.push('/Select_address')}>
                <Text style={styles.changeButton}>Change</Text>
              </TouchableOpacity>
            </View>
            {address?.addressLines?.map((line: string, idx: number) => (
              <Text key={idx} style={styles.addressLine}>{line}</Text>
            ))}
            <View style={styles.mobileContainer}>
              <Text style={styles.mobileLabel}>Mobile: </Text>
              <Text style={styles.mobileNumber}>{address?.contact}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardSeparator} />

        {/* Delivery Estimates */}
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={styles.deliveryEstimatesContainer}>
            <Text style={styles.deliveryEstimatesTitle}>Delivery Estimates</Text>

            <FlatList
              data={cart}
              keyExtractor={(item, index) => item.product.name + index}
              renderItem={({ item }) => (
                <View style={styles.deliveryItem}>
                  <Image
                    source={{ uri: item.product.image || 'https://via.placeholder.com/100' }}
                    style={styles.deliveryItemImage}
                  />
                  <View style={styles.deliveryDetails}>
                    <Text style={styles.deliveryEstimateText}>
                      Estimated delivery by{' '}
                      <Text style={styles.deliveryDate}>{"XXXX"}</Text>
                    </Text>
                  </View>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </SafeAreaView>

        {/* Bottom Button */}
        <TouchableOpacity
          style={styles.deliverHereButton}
          onPress={() => router.push('/payment')}
        >
          <Text style={styles.deliverHereButtonText}>DELIVER HERE</Text>
        </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  addressListContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: '#fff',
  },
  addressDetailsContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
  },
  changeButton: {
    color: '#E63946', 
    fontWeight: 'bold',
    fontSize: 15,
  },
  addressLine: {
    fontSize: 14,
    color: '#222',
    marginBottom: 2,
  },
  mobileContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  mobileLabel: {
    fontSize: 14,
    color: '#222',
  },
  mobileNumber: {
    fontSize: 14,
    color: '#222',
    fontWeight: 'bold',
  },
  deliveryEstimatesContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#fff',
  },
  deliveryEstimatesTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginBottom: 12,
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  deliveryItemImage: {
    width: 70,
    height: 70,
    borderRadius: 4,
    backgroundColor: '#f3f3f3',
    resizeMode: 'contain',
  },
  deliveryDetails: {
    marginLeft: 12,
    flex: 1,
  },
  deliveryEstimateText: {
    fontSize: 14,
    color: '#222',
  },
  deliveryDate: {
    fontWeight: 'bold',
  },
  deliverHereButton: {
    backgroundColor: '#000',
    marginHorizontal: 16,
    marginTop: 80,
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  deliverHereButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardSeparator: {
  borderBottomColor: '#bcc0c4', 
  borderBottomWidth: 2,        
  marginVertical: 0,           
  },
});
