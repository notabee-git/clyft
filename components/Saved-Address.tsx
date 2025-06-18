
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getCurrentUserUUID } from './auth-helper';
import { db, doc, getDoc, updateDoc } from '../firebaseConfig';

import { StyleSheet } from 'react-native';

export const getUserData = async (uuid: string) => {
  const userDoc = await getDoc(doc(db, 'Users', uuid));
  return userDoc.exists() ? userDoc.data() : null;
};

export const updateDefaultAddress = async (uuid: string, index: number) => {
  console.log('Updating default address at index:', index);
  await updateDoc(doc(db, 'Users', uuid), {
    default_address: index,
  });
};

export const deleteAddress = async (uuid: string, updatedAddress: any[]) => {
  await updateDoc(doc(db, 'Users', uuid), {
    address: updatedAddress,
  });
};

export default function SavedAddressScreen() {
  const router = useRouter();

  const [defaultAddr, setDefaultAddr] = useState<Address | null>(null);
  const [defaultAddressIndex, setDefaultAddressIndex] = useState<number | null>(null);
  const [address, setAddress] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      const uuid = await getCurrentUserUUID();
      try {
        if (!uuid) {
          setLoading(false);
          return;
        }

        const data = await getUserData(uuid);
        if (data) {
          const { default_address, address } = data;

          if (Array.isArray(address)) {
            if (typeof default_address === 'number' && address[default_address]) {
              setDefaultAddr(address[default_address]);
              setDefaultAddressIndex(default_address);
              const filteredAddresses = address.filter((_, i) => i !== default_address);
              setAddress(filteredAddresses);
            } else {
              setDefaultAddr(null);
              setDefaultAddressIndex(null);
              setAddress(address);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching address:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, []);
const handleMarkDefault = async (index: number) => {
  const uuid = await getCurrentUserUUID();
  try {
    if (!uuid) {
      console.error('User UUID is null');
      return;
    }

    const data = await getUserData(uuid);
    if (!data || !Array.isArray(data.address)) return;

    const fullAddressList: Address[] = data.address;
    const currentDefaultIndex: number | null = data.default_address ?? null;

    // Calculate real index of the address being marked as default
    let actualIndexInFullList = index;
    if (currentDefaultIndex !== null && currentDefaultIndex <= index) {
      actualIndexInFullList += 1;
    }

    await updateDefaultAddress(uuid, actualIndexInFullList);

    // Update local state
    const newDefaultAddr = address[index];
    const updatedOtherAddresses = [...address];
    updatedOtherAddresses.splice(index, 1);

    if (currentDefaultIndex !== null && fullAddressList[currentDefaultIndex]) {
      updatedOtherAddresses.push(fullAddressList[currentDefaultIndex]);
    }

    setDefaultAddr(newDefaultAddr);
    setDefaultAddressIndex(actualIndexInFullList);
    setAddress(updatedOtherAddresses);
    Alert.alert('Success', 'Default address updated');
  } catch (error) {
    console.error('Failed to update default address:', error);
  }
};

  const handleDelete = (index: number, isDefault = false) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const uuid = await getCurrentUserUUID();
            try {
              if (isDefault) {
                if (uuid) {
                  await updateDoc(doc(db, 'Users', uuid), {
                    default_address: null,
                  });
                  setDefaultAddr(null);
                  setDefaultAddressIndex(null);
                } else {
                  console.error('User UUID is null');
                }
              }

                const updated = [...address];
                updated.splice(index, 1);
                if (uuid) {
                  await deleteAddress(uuid, updated);
                  setAddress(updated);
                } else {
                  console.error('User UUID is null');
                }
              Alert.alert('Success', 'Address deleted successfully');
            } catch (error) {
              console.error('Error deleting address:', error);
            }
          },
        },
      ]
    );
  };

  type Address = {
    fullname: string;
    mobile: string;
    locality: string;
    flatBuilding: string;
    city: string;
    landmark: string;
    state: string;
    pincode: string;
    [key: string]: any;
  };

  const renderAddressCard = (address: Address, index: number, isDefaultSection = false) => (
    <View key={index} style={styles.addressCard}>
      <Text style={styles.nameText}>{address.fullname}</Text>
      <Text style={styles.addressText}>{address.flatBuilding},{address.locality}</Text>
      <Text style={styles.addressText}>{address.landmark}</Text>
      <Text style={styles.addressText}>
        {address.city}, {address.state} - {address.pincode}
      </Text>

      
      <Text style={styles.mobileText}>
        Mobile : <Text style={{ fontWeight: 'bold' }}>{address.mobile}</Text>
      </Text>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleDelete(index, isDefaultSection)}
        >
          <Text style={styles.actionBtnText}>Delete</Text>
        </TouchableOpacity>
<TouchableOpacity
  style={styles.actionBtn}
  onPress={() =>
    router.push({
      pathname: './EditAddress',
      params: {
        index: index.toString(), // Convert to string for navigation
        // isDefault: isDefaultSection ? 'true' : 'false',
      },
    })
  }
>
  <Text style={styles.actionBtnText}>Edit</Text>
</TouchableOpacity>

        {!isDefaultSection && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleMarkDefault(index)}
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

  if (loading) return <Text>Loading...</Text>;

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
        {/* Add New Address */}
        <TouchableOpacity
          style={styles.addAddressButton}
          onPress={() => router.push('./AddNewAddress')}
        >
          <Text style={styles.addAddressText}>ADD A NEW ADDRESS</Text>
        </TouchableOpacity>

        {defaultAddr && defaultAddressIndex !== null && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Default Address</Text>
            {renderAddressCard(defaultAddr, defaultAddressIndex, true)}
          </View>
        )}

        {/* All Other Addresses */}
        {address.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Address</Text>
            {address.map((address, index) =>
              renderAddressCard(address, index, false)
            )}
          </View>
        )}
      </ScrollView>

      {/* Update Button */}
      {/* <TouchableOpacity style={styles.updateBtn}>
        <Text style={styles.updateBtnText}>UPDATE</Text>
      </TouchableOpacity> */}
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