import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function SelectAddressScreen() {
  const router = useRouter();

  // Variables/constants at the top
  const addresses = [
    {
      id: 1,
      name: 'Sathwik',
      address: 'Address\nLocality/Town\nCity/District, State, Pin Code',
      mobile: '8008687540',
    },
    {
      id: 2,
      name: 'Sathwik',
      address: 'Address\nLocality/Town\nCity/District, State, Pin Code',
      mobile: '8008687540',
    },
  ];

  const [selectedId, setSelectedId] = useState(addresses[0].id);

  // Render addresses using a for loop
  const renderAddresses = () => {
    const addressElements = [];
    for (let i = 0; i < addresses.length; i++) {
      const item = addresses[i];
      const isSelected = selectedId === item.id;

      addressElements.push(
        <View key={item.id} style={styles.addressBox}>
          <TouchableOpacity
            style={styles.radioRow}
            onPress={() => setSelectedId(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.radioOuter}>
              {isSelected && <View style={styles.radioInner} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nameText}>{item.name}</Text>
              <Text style={styles.addressText}>{item.address}</Text>
              <Text style={styles.mobileText}>
                Mobile : <Text style={{ fontWeight: 'bold' }}>{item.mobile}</Text>
              </Text>

              {/* Show Remove and Edit only if selected */}
              {isSelected && (
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.removeBtn}>
                    <Text style={styles.actionBtnText}>REMOVE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.editBtn}>
                    <Text style={styles.actionBtnText}>EDIT</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    return addressElements;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={{ padding: 4 }}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}> Address</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <AntDesign name="arrowright" size={18} style={styles.progressArrowActive} />
        <Text style={styles.progressActive}>Cart</Text>
        <AntDesign name="arrowright" size={18} style={styles.progressArrowActive} />
        <Text style={styles.progressActive}>Address</Text>
        <AntDesign name="arrowright" size={18} style={styles.progressArrowInactive} />
        <Text style={styles.progressInactive}>Payment</Text>
      </View>

      {/* Add New Address Button */}
      <TouchableOpacity style={styles.addAddressButton}>
        <Text style={styles.addAddressText} onPress={() => router.push('/Addaddress')}>ADD A NEW ADDRESS</Text>
      </TouchableOpacity>

      <ScrollView>{renderAddresses()}</ScrollView>

      {/* Deliver Here Button */}
      <TouchableOpacity style={styles.deliverBtn}>
        <Text style={styles.deliverBtnText} onPress={() => router.push('/payment')}>DELIVER HERE</Text>
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
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
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
  addAddressButton: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    marginHorizontal: 16,
    marginBottom: 14,
    marginTop: 6,
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
  addressBox: {
    backgroundColor: '#fafafa',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 3,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
    color: '#000',
  },
  addressText: {
    color: '#222',
    fontSize: 14,
    marginBottom: 2,
    marginTop: 2,
    lineHeight: 18,
  },
  mobileText: {
    color: '#000',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  removeBtn: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  editBtn: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },
  actionBtnText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  deliverBtn: {
    backgroundColor: '#000',
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 6,
  },
  deliverBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});
