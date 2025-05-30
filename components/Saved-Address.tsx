import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function SavedAddressesScreen() {
  const router = useRouter();

  // Default address
  const defaultAddress = {
    id: 1,
    name: 'Sathwik',
    address: 'Address\nLocality/Town\nCity/District, State, Pin Code',
    mobile: '8008687540',
    isDefault: true,
  };

  // All other addresses
  const allAddresses = [
    {
      id: 2,
      name: 'Sathwik',
      address: 'Address\nLocality/Town\nCity/District, State, Pin Code',
      mobile: '8008687541',
      isDefault: false,
    },
  ];

  const [addresses, setAddresses] = useState(allAddresses);
  const [defaultAddr, setDefaultAddr] = useState<{
    id: number;
    name: string;
    address: string;
    mobile: string;
    isDefault: boolean;
  } | null>(defaultAddress);

  const handleMarkDefault = (addressId: any) => {
    // Find the address to make default
    const addressToMakeDefault = addresses.find(addr => addr.id === addressId);
    if (addressToMakeDefault) {
      // Move current default to all addresses
      const newAllAddresses = addresses.filter(addr => addr.id !== addressId);
      if (defaultAddr) {
        newAllAddresses.push({ ...defaultAddr, isDefault: false });
      }
      
      // Set new default
      setDefaultAddr({ ...addressToMakeDefault, isDefault: true });
      setAddresses(newAllAddresses);
    }
  };

  const handleDelete = (addressId: any, isDefault = false) => {
    if (isDefault) {
      setDefaultAddr(null);
    } else {
      setAddresses(addresses.filter(addr => addr.id !== addressId));
    }
  };

  const renderAddressCard = (address: any, isDefaultSection = false) => (
    <View key={address.id} style={styles.addressCard}>
      <Text style={styles.nameText}>{address.name}</Text>
      <Text style={styles.addressText}>{address.address}</Text>
      <Text style={styles.mobileText}>
        Mobile : <Text style={{ fontWeight: 'bold' }}>{address.mobile}</Text>
      </Text>
      
      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => handleDelete(address.id, isDefaultSection)}
        >
          <Text style={styles.actionBtnText}>Delete</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>Edit</Text>
        </TouchableOpacity>
        
        {!isDefaultSection && (
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => handleMarkDefault(address.id)}
          >
            <Text style={styles.actionBtnText}>Mark Default</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const handleGoBack = () => {
      router.back();
    };  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container}>
        {/* Add New Address Button */}
        <TouchableOpacity 
          style={styles.addAddressButton}
          onPress={() => router.push('./enter-address')}
        >
          <Text style={styles.addAddressText}>ADD A NEW ADDRESS</Text>
        </TouchableOpacity>

        {/* Default Address Section */}
        {defaultAddr && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Default Address</Text>
            {renderAddressCard(defaultAddr, true)}
          </View>
        )}

        {/* All Addresses Section */}
        {addresses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Address</Text>
            {addresses.map(address => renderAddressCard(address, false))}
          </View>
        )}
      </ScrollView>

      {/* Update Button */}
      <TouchableOpacity style={styles.updateBtn}>
        <Text style={styles.updateBtnText}>UPDATE</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'left',
    color: '#000',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  addAddressButton: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
    marginBottom: 24,
    marginTop: 12,
    paddingVertical: 18,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  addAddressText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    marginBottom: 12,
  },
  addressCard: {
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  nameText: {
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 8,
    color: '#000',
  },
  addressText: {
    color: '#222',
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 22,
  },
  mobileText: {
    color: '#000',
    fontSize: 16,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionBtn: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 3,
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: '#fafafa',
  },
  actionBtnText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  updateBtn: {
    backgroundColor: '#000',
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 6,
  },
  updateBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
});